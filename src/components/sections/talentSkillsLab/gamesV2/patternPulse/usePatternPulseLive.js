import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';
import { useRoundShown } from '../live/useRoundShown.js';
import { PATTERN_PULSE_REVEAL_SECONDS, PATTERN_PULSE_URGENT_AT } from './patternPulseData.js';
import { BEAD_COLORS } from './patternPulseRules.js';

const log = debug('usePatternPulseLive');

const LIVE_CLUE = 'Work out the rule, then pick the number that comes next.';
const TICK_MS = 250;

const beadsOf = (terms) =>
  terms.map((value, position) => ({
    value,
    position,
    pattern: 'single',
    index: position,
    color: BEAD_COLORS[position % BEAD_COLORS.length],
  }));

const average = (list) =>
  list.length ? Math.round(list.reduce((s, n) => s + n, 0) / list.length) : 0;

/*
 * usePatternPulseLive — Pattern Pulse against the server engine (backend utils/gameEngines/engines/numberSequence.js).
 * Same shape as the mock adapter in games/PatternPulse.jsx, so PatternPulseBoardView draws both.
 *   view.round { index, total, terms, options, timeLimitSec, timeLeftSec, clockRunning } · view.results ['correct' | 'missed']
 *   actions    { type: 'answer', value, clientMs } · { type: 'skip', clientMs } · { type: 'timeout', round, clientMs }
 *              · { type: 'round_shown', round } (quiet: starts the round's server clock when the round is drawn)
 *   result     { correct, timedOut, answer, explain, finished } — the answer and the rule only arrive with the result.
 * The server moves to the next round as soon as a round is answered, so the answered round is kept on screen (`reveal`) for
 * \"Next round starts in 3 s\". The round clock is the server's: it starts when the round is drawn (round_shown; until then the view
 * gives the full limit and clockRunning false) and is counted down locally; at 0 the round is sent as a timeout (a miss).
 * No local answer key, no local score.
 */
export const usePatternPulseLive = (run) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const v = run.view;
  const live = v?.round ?? null;
  const [reveal, setReveal] = useState(null); // { round, picked, miss, answer, explain, last }
  const [sending, setSending] = useState(null); // { round, picked }
  const [times, setTimes] = useState([]); // seconds of the right answers (the \"avg\" label only)
  const [revealLeft, setRevealLeft] = useState(PATTERN_PULSE_REVEAL_SECONDS);
  const [clock, setClock] = useState(null); // { index, at, deadline } of the round on screen
  const [now, setNow] = useState(0);

  // when the current view arrived: timeLeftSec is the server's count at that moment (the round may be drawn later, after the reveal)
  const receivedAt = useRef(0);
  useEffect(() => {
    receivedAt.current = Date.now();
  }, [v]);

  const liveIndex = !reveal && live ? live.index : null;
  const liveLeft = live?.timeLeftSec ?? null;
  const liveRunning = live?.clockRunning !== false;
  useEffect(() => {
    if (liveIndex === null) return;
    const at = Date.now();
    log('round drawn', { round: liveIndex + 1, timeLeftSec: liveLeft, running: liveRunning });
    setClock({
      index: liveIndex,
      at,
      // a clock that has not started yet starts now (round_shown below); a running one counts from when the view arrived
      deadline: (liveRunning ? receivedAt.current || at : at) + (liveLeft ?? 0) * 1000,
    });
    setNow(at);
  }, [liveIndex, liveLeft, liveRunning]);
  useRoundShown(run, liveIndex);

  const phase = reveal ? 'revealed' : sending ? 'sending' : 'thinking';
  // the clock of the round on show (a just-drawn round has none until its effect has run)
  const roundClock = clock && live && clock.index === live.index ? clock : null;
  useEffect(() => {
    if (phase !== 'thinking' || !roundClock) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [phase, roundClock]);

  const limit = live?.timeLimitSec ?? reveal?.round.timeLimitSec ?? 30;
  const seconds = roundClock ? Math.max(0, Math.ceil((roundClock.deadline - now) / 1000)) : limit;

  const send = useCallback(
    async (action, picked, missKind) => {
      if (!live || sending || reveal || paused || run.busy) return;
      const round = live;
      const tookMs = roundClock ? Math.max(0, Date.now() - roundClock.at) : undefined;
      log('send', action.type, { round: round.index + 1, value: action.value, tookMs });
      setSending({ round, picked });
      const res = await run.act({ ...action, clientMs: tookMs });
      setSending(null);
      if (!res || res.error) {
        if (res?.error) log('refused', res.code);
        return;
      }
      const r = res.result || {};
      if (r.ignored) return; // a timeout for a round the server had already moved past
      const ok = Boolean(r.correct);
      const miss = ok ? null : r.timedOut ? 'timeout' : missKind;
      if (ok) setTimes((t) => [...t, Math.max(1, Math.round((tookMs ?? 0) / 1000))]);
      log('result', { ok, miss, answer: r.answer, finished: r.finished });
      setRevealLeft(PATTERN_PULSE_REVEAL_SECONDS);
      setReveal({
        round,
        picked,
        miss,
        answer: r.answer,
        explain: r.explain ?? '',
        last: Boolean(r.finished),
      });
    },
    [live, sending, reveal, paused, run, roundClock]
  );

  const pick = useCallback(
    (index) => {
      if (!live || index < 0 || index >= live.options.length) return;
      send({ type: 'answer', value: live.options[index] }, index, null);
    },
    [live, send]
  );
  const skip = useCallback(() => send({ type: 'skip' }, null, 'skip'), [send]);

  /* the server's round clock ran out: send a timeout (the server records a miss) */
  useEffect(() => {
    if (phase === 'thinking' && roundClock && !paused && seconds <= 0) {
      log('round clock hit 0 → timeout');
      send({ type: 'timeout', round: roundClock.index }, null, 'timeout');
    }
  }, [phase, roundClock, paused, seconds, send]);

  const next = useCallback(() => {
    if (!reveal) return;
    if (reveal.last) {
      // the result card is already on its way (useGameRun opens it); submit is a no-op then
      run.submit();
      return;
    }
    log('next round');
    setReveal(null);
  }, [reveal, run]);

  useEffect(() => {
    if (!reveal || reveal.last || paused) return undefined;
    if (revealLeft <= 0) {
      next();
      return undefined;
    }
    const id = window.setTimeout(() => setRevealLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [reveal, paused, revealLeft, next]);

  const onScreen = reveal?.round ?? sending?.round ?? live;
  const results = useMemo(() => v?.results ?? [], [v]);

  return useMemo(() => {
    if (!onScreen) return null;
    const total = onScreen.total;
    const rightCount = results.filter((r) => r === 'correct').length;
    const dots = Array.from({ length: total }, (_, i) => {
      const label = String(i + 1);
      if (i < results.length) return { state: results[i] === 'correct' ? 'ok' : 'bad', label };
      return { state: i === results.length ? 'now' : 'todo', label };
    });
    const picked = reveal?.picked ?? sending?.picked ?? null;
    return {
      levelKey: run.difficulty || g.level,
      spec: { clue: LIVE_CLUE, ruleText: reveal?.explain ?? '', a: null },
      round: {
        beads: beadsOf(onScreen.terms),
        answer: reveal?.answer,
        target: { color: BEAD_COLORS[onScreen.terms.length % BEAD_COLORS.length] },
        jumps: null,
      },
      roundNumber: onScreen.index + 1,
      totalRounds: total,
      isLast: reveal ? reveal.last : onScreen.index === total - 1,
      choices: onScreen.options,
      correctIndex: reveal ? onScreen.options.indexOf(reveal.answer) : -1,
      phase,
      picked,
      miss: reveal?.miss ?? null,
      dots,
      rightCount,
      answeredCount: results.length,
      avgSeconds: average(times),
      seconds,
      ring: limit ? seconds / limit : 0,
      urgent: seconds <= PATTERN_PULSE_URGENT_AT,
      revealLeft,
      pick,
      skip,
      next,
      finishNow: run.submit,
      bestSoFar: null,
    };
  }, [
    onScreen,
    results,
    reveal,
    sending,
    run.difficulty,
    run.submit,
    g.level,
    phase,
    times,
    seconds,
    limit,
    revealLeft,
    pick,
    skip,
    next,
  ]);
};
