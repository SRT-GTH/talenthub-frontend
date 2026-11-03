import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import {
  fetchGameRun,
  gameErrorCode,
  gameErrorData,
  gameErrorMessage,
  sendGameAction,
  startGameRun,
  submitGameRun,
} from '../../../../../services/games.api.js';
import { notifyStreakActivity } from '../../../../../services/streak.api.js';
import { notifyXpChanged } from '../../../../../services/xp.api.js';
import { useGameV2Params } from '../gamesV2State.js';
import { cardToResult } from './cardToResult.js';
import { gameKeyFor } from './gameKeys.js';
import { refreshGamesCatalogue } from './useGamesCatalogue.js';

const log = debug('useGameRun');

const fmtClock = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/*
 * useGameRun — one live run of a Games v2 game against the server engine (/api/games). The server holds the answer key and the
 * score; the board only draws `view` and sends actions.
 *
 *   const run = useGameRun({ enabled })        enabled = isLiveGames() (the `?f=` frames and `?demo=1` keep the local mock)
 *   run.status        'off' | 'loading' | 'ready' | 'conflict' | 'cooldown' | 'error' | 'finished'
 *   run.view          the engine's view (board, round, …) + difficulty, finished, timeLeftSec?, timeLimitSec?
 *   run.mode / run.difficulty / run.runId / run.resumed
 *   run.lastResult    `result` of the last move (correct / outcome / … per engine)
 *   run.act(action)   → Promise<{ result, view, card? } | { error, code } | null>. Moves are sent one at a time, in order.
 *                     Network failure opens `?modal=offline` and re-sends the move when the player taps Try again.
 *   run.busy          a move is in flight
 *   run.submit()      end now (time up / "See my result"): the server scores what was done and the result card opens
 *   run.timeLeft / run.timeLabel   the server clock (when the game has a time limit), ticking locally between moves
 *   run.conflict      { runId, mode, difficulty } when another level / mode of this game is open → resolveConflict('resume'|'restart')
 *   run.nextRankedAt  ranked cool-down (status 'cooldown') → playPractice()
 * When a move ends the game the server returns the result card in the same call; the hook waits `finishDelayMs` (so the last move
 * can be seen) and then opens the result view with `cardToResult(card)`.
 */
export const useGameRun = ({ enabled = true, finishDelayMs = 900 } = {}) => {
  const g = useGameV2Params();
  const gameKey = gameKeyFor(g.gameId);
  const [s, setS] = useState(() => ({
    status: enabled && gameKey ? 'loading' : 'off',
    runId: null,
    mode: g.mode,
    difficulty: g.level,
    view: null,
    resumed: false,
    lastResult: null,
    error: null,
    conflict: null,
    nextRankedAt: null,
  }));
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const runRef = useRef(null);
  const queue = useRef(Promise.resolve());
  const pending = useRef(null);
  const sawOffline = useRef(false);
  const finished = useRef(false);
  const timers = useRef([]);
  const gRef = useRef(g);
  useEffect(() => {
    gRef.current = g;
  });

  const showCard = useCallback(
    (card, delay = finishDelayMs) => {
      if (finished.current || !card) return;
      finished.current = true;
      log('result card', { points: card.points, xp: card.xp, percentile: card.percentile });
      setS((x) => ({ ...x, status: 'finished' }));
      notifyStreakActivity();
      refreshGamesCatalogue();
      if (card.xp > 0) notifyXpChanged();
      const id = window.setTimeout(() => gRef.current.finish(cardToResult(card)), delay);
      timers.current.push(id);
    },
    [finishDelayMs]
  );

  const applyRun = useCallback((data) => {
    runRef.current = data.runId;
    setS((x) => ({
      ...x,
      status: data.view?.finished ? 'finished' : 'ready',
      runId: data.runId,
      mode: data.mode,
      difficulty: data.difficulty,
      view: data.view,
      resumed: Boolean(data.resumed),
      error: null,
      conflict: null,
    }));
    if (Number.isFinite(data.view?.timeLeftSec)) setTimeLeft(data.view.timeLeftSec);
  }, []);

  const submit = useCallback(async () => {
    const runId = runRef.current;
    if (!runId || finished.current) return null;
    log('submit', runId);
    try {
      const card = await submitGameRun(runId);
      showCard(card, 0);
      return card;
    } catch (err) {
      log.error('submit failed', gameErrorCode(err), gameErrorMessage(err));
      if (!err?.response) {
        sawOffline.current = false;
        pending.current = { submit: true };
        gRef.current.openModal('offline');
      } else setS((x) => ({ ...x, error: gameErrorMessage(err) }));
      return null;
    }
  }, [showCard]);

  const start = useCallback(
    async ({ restart = false, difficulty, mode } = {}) => {
      if (!gameKey) return;
      setS((x) => ({ ...x, status: 'loading', error: null }));
      const body = {
        gameKey,
        difficulty: difficulty === null ? undefined : (difficulty ?? gRef.current.level),
        mode: mode ?? gRef.current.mode,
        restart,
      };
      try {
        const data = await startGameRun(body);
        log('started', {
          runId: data.runId,
          resumed: data.resumed,
          mode: data.mode,
          difficulty: data.difficulty,
        });
        applyRun(data);
      } catch (err) {
        const code = gameErrorCode(err);
        log('start failed', code);
        if (code === 'GAME_IN_PROGRESS') {
          setS((x) => ({ ...x, status: 'conflict', conflict: gameErrorData(err) }));
        } else if (code === 'GAME_COOLDOWN') {
          setS((x) => ({
            ...x,
            status: 'cooldown',
            nextRankedAt: gameErrorData(err)?.nextRankedAt ?? null,
          }));
        } else if (code === 'INVALID_DIFFICULTY' && body.difficulty) {
          // a one-level game (Crisis Room, Makola Haggle, …): let the server pick its level
          start({ restart, difficulty: null, mode });
        } else {
          setS((x) => ({ ...x, status: 'error', error: gameErrorMessage(err) }));
        }
      }
    },
    [gameKey, applyRun]
  );

  // one run per game / mode / level
  useEffect(() => {
    if (!enabled || !gameKey) return undefined;
    finished.current = false;
    // `?restart=1` ("Start again" in the resume dialog): end the saved run and start fresh, once
    const restart = new URLSearchParams(window.location.search).get('restart') === '1';
    start({ restart });
    if (restart) gRef.current.update({ restart: null });
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, [enabled, gameKey, g.mode, g.level, start]);

  const reload = useCallback(async () => {
    const runId = runRef.current;
    if (!runId) return;
    try {
      applyRun(await fetchGameRun(runId));
    } catch (err) {
      log.error('reload failed', gameErrorMessage(err));
    }
  }, [applyRun]);

  const sendNow = useCallback(
    async (action) => {
      const runId = runRef.current;
      if (!runId || finished.current) return null;
      setBusy(true);
      try {
        const res = await sendGameAction(runId, action);
        setS((x) => ({
          ...x,
          view: res.view,
          lastResult: res.result,
          status: res.view?.finished ? 'finished' : x.status,
        }));
        if (Number.isFinite(res.view?.timeLeftSec)) setTimeLeft(res.view.timeLeftSec);
        if (res.card) showCard(res.card);
        else if (res.view?.finished) submit();
        return res;
      } catch (err) {
        const code = gameErrorCode(err);
        if (!err?.response) {
          log.error('move failed (offline), keeping it for Try again', action?.type);
          pending.current = { action };
          sawOffline.current = false;
          gRef.current.openModal('offline');
          return null;
        }
        if (code === 'STALE_STATE') {
          log('stale state → reload');
          await reload();
          return null;
        }
        if (code === 'GAME_FINISHED') {
          submit();
          return null;
        }
        log('move refused', code, gameErrorMessage(err));
        return { error: gameErrorMessage(err), code };
      } finally {
        setBusy(false);
      }
    },
    [showCard, submit, reload]
  );

  const act = useCallback(
    (action) => {
      const p = queue.current.then(() => sendNow(action));
      queue.current = p.catch(() => null);
      return p;
    },
    [sendNow]
  );

  // Try again after "Connection lost": re-send the kept move (or the submit) once the banner closes.
  useEffect(() => {
    if (g.modal === 'offline') sawOffline.current = true;
    if (!g.modal && sawOffline.current && pending.current) {
      sawOffline.current = false;
      const p = pending.current;
      pending.current = null;
      log('retry after offline', p.submit ? 'submit' : p.action?.type);
      if (p.submit) submit();
      else act(p.action);
    }
  }, [g.modal, act, submit]);

  // The server clock: count down locally between moves; at 0 the game ends (the Time's up card scores it).
  const live = s.status === 'ready';
  useEffect(() => {
    if (!live || timeLeft === null) return undefined;
    if (timeLeft <= 0) {
      if (!finished.current && gRef.current.modal !== 'timeup') gRef.current.openModal('timeup');
      return undefined;
    }
    const id = window.setTimeout(() => setTimeLeft((t) => (t === null ? t : t - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [live, timeLeft]);

  const resolveConflict = useCallback(
    (how) => {
      const c = s.conflict;
      if (!c) return;
      if (how === 'resume') {
        log('resume the open run', c);
        if (c.mode === gRef.current.mode && c.difficulty === gRef.current.level) start();
        else gRef.current.update({ mode: c.mode, level: c.difficulty });
      } else {
        log('restart with the asked level / mode');
        start({ restart: true });
      }
    },
    [s.conflict, start]
  );

  const playPractice = useCallback(() => gRef.current.update({ mode: 'practice' }), []);

  return useMemo(
    () => ({
      ...s,
      live: s.status !== 'off',
      gameKey,
      busy,
      act,
      submit,
      reload,
      restart: () => start({ restart: true }),
      resolveConflict,
      playPractice,
      timeLeft,
      timeLabel: timeLeft === null ? null : fmtClock(timeLeft),
    }),
    [s, gameKey, busy, act, submit, reload, start, resolveConflict, playPractice, timeLeft]
  );
};
