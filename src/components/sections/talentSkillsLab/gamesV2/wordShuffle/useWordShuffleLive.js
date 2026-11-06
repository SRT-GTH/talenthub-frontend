import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { formatClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import { useRoundShown } from '../live/useRoundShown.js';

const log = debug('useWordShuffleLive');

const NEXT_WORD_SECONDS = 3; // the server starts the next word's clock when it is drawn (round_shown), or by itself soon after
const TICK_MS = 250;
const HINT_COST = 0.25; // shown in the hint label only; the server scores
const FRACTION = { 1: '1', 0.75: '¾', 0.5: '½', 0.25: '¼', 0: '0' };

const identity = (n) => Array.from({ length: n }, (_, i) => i);
const shuffled = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const freshFor = (round) => ({
  index: round?.index ?? null,
  picks: [], // tile ids the player placed (the hint-locked tiles are derived from `revealed`)
  order: identity(round?.letters.length ?? 0),
  status: 'idle', // idle | wrong | correct | failed | skipped | timeout
  wrongs: 0,
  notice: null,
  snapshot: null, // the round as it was when it resolved (the server has already moved on)
  word: null, // the right word, once the server tells it
  shownAt: Date.now(),
});

/* hint-locked tiles: one tile per revealed letter, first free tile with that letter (ids = positions in `letters`) */
const lockedFor = (letters, revealed) => {
  const out = [];
  for (const ch of revealed) {
    const id = [...letters].findIndex((l, i) => l === ch && !out.includes(i));
    if (id >= 0) out.push(id);
  }
  return out;
};

/*
 * useWordShuffleLive — Word Shuffle against the server engine (backend utils/gameEngines/engines/wordScramble.js).
 * Same shape as the mock adapter in games/WordShuffle.jsx, so WordShuffleBoard draws both.
 *   view.round { index, total, letters, length, field, revealed, hintsLeft, timeLimitSec, timeLeftSec, clockRunning } · view.results
 *   actions    { type: 'answer', value, clientMs } · { type: 'hint' } · { type: 'skip', clientMs } · { type: 'timeout', round, clientMs }
 *              · { type: 'round_shown', round } (quiet: starts the word's server clock when the word is drawn)
 *   result     answer → { correct, timedOut?, answer, finished } | { correct: false, tryAgain, triesLeft }; hint → { revealed, hintsLeft }
 * The word itself is never on the client until the server resolves the round. Each word has its own server clock (timeLeftSec),
 * started when the word is drawn (round_shown); at 0 the word is sent as a timeout (a miss). Hints reveal the next letter (server
 * `revealed`).
 */
export const useWordShuffleLive = (run) => {
  const g = useGameV2Params();
  const paused = Boolean(g.modal);
  const v = run.view;
  const live = v?.round ?? null;
  const [st, setSt] = useState(() => freshFor(live));
  const [hintsDone, setHintsDone] = useState(0); // hints of the resolved words (summary label only)
  const [clock, setClock] = useState(null);
  const [now, setNow] = useState(0);
  const [nextLeft, setNextLeft] = useState(NEXT_WORD_SECONDS);
  const [sending, setSending] = useState(false);

  const resolved = Boolean(st.snapshot);
  // a new word from the server (and none held on screen): start it fresh
  if (!resolved && live && st.index !== live.index) setSt(freshFor(live));

  const round = st.snapshot ?? live;

  // when the current view arrived: timeLeftSec is the server's count at that moment (the word may be drawn later)
  const receivedAt = useRef(0);
  useEffect(() => {
    receivedAt.current = Date.now();
  }, [v]);

  const liveIndex = !resolved && live ? live.index : null;
  const liveLeft = live?.timeLeftSec ?? null;
  const liveRunning = live?.clockRunning !== false;
  useEffect(() => {
    if (liveIndex === null) return;
    const at = Date.now();
    // a clock that has not started yet starts now (round_shown below); a running one counts from when the view arrived
    const from = liveRunning ? receivedAt.current || at : at;
    setClock({ index: liveIndex, deadline: from + (liveLeft ?? 0) * 1000 });
    setNow(at);
  }, [liveIndex, liveLeft, liveRunning]);
  useRoundShown(run, liveIndex);

  // the clock of the word on show (a just-arrived word has none until its effect has run)
  const wordClock = clock && live && clock.index === live.index ? clock : null;
  useEffect(() => {
    if (resolved || !wordClock) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [resolved, wordClock]);

  const seconds = wordClock
    ? Math.max(0, Math.ceil((wordClock.deadline - now) / 1000))
    : (live?.timeLimitSec ?? 0);

  const letters = round?.letters ?? '';
  const n = round?.length ?? letters.length;
  const revealed = round?.revealed ?? '';
  const locked = useMemo(() => lockedFor(letters, revealed), [letters, revealed]);
  const answer = useMemo(
    () => [...locked, ...st.picks.filter((id) => !locked.includes(id))].slice(0, n),
    [locked, st.picks, n]
  );
  const tiles = useMemo(() => [...letters].map((letter, id) => ({ id, letter })), [letters]);

  const edit = useCallback((picks) => {
    setSt((s) => ({ ...s, picks, notice: null, status: s.status === 'wrong' ? 'idle' : s.status }));
  }, []);

  const blocked = resolved || paused || sending;

  const addTile = useCallback(
    (id) => {
      if (blocked || answer.length >= n || answer.includes(id)) return;
      edit([...answer.filter((x) => !locked.includes(x)), id]);
    },
    [blocked, answer, n, locked, edit]
  );
  const removeAt = useCallback(
    (position) => {
      if (blocked) return;
      const id = answer[position];
      if (id === undefined || locked.includes(id)) return;
      edit(answer.filter((x, i) => i !== position && !locked.includes(x)));
    },
    [blocked, answer, locked, edit]
  );
  const backspace = useCallback(() => {
    if (blocked || answer.length <= locked.length) return;
    edit(answer.slice(0, -1).filter((x) => !locked.includes(x)));
  }, [blocked, answer, locked, edit]);
  const clear = useCallback(() => {
    if (!blocked) edit([]);
  }, [blocked, edit]);
  const shuffle = useCallback(() => {
    if (blocked) return;
    setSt((s) => {
      const free = shuffled(s.order.filter((id) => !answer.includes(id)));
      let k = 0;
      return { ...s, order: s.order.map((id) => (answer.includes(id) ? id : free[k++])) };
    });
  }, [blocked, answer]);
  const typeLetter = useCallback(
    (ch) => {
      const id = st.order.find((t) => !answer.includes(t) && letters[t] === ch);
      if (id !== undefined) addTile(id);
    },
    [st.order, answer, letters, addTile]
  );

  const resolve = useCallback(
    (status, word) => {
      const snap = live;
      setHintsDone((h) => h + (snap?.revealed?.length ?? 0));
      setNextLeft(NEXT_WORD_SECONDS);
      setSt((s) => ({ ...s, status, word, snapshot: snap }));
    },
    [live]
  );

  const sendAnswerLike = useCallback(
    async (action, missKind) => {
      if (!live || resolved || sending || run.busy) return;
      const clientMs = Math.max(0, Date.now() - st.shownAt);
      log('send', action.type, { word: live.index + 1, clientMs });
      setSending(true);
      const res = await run.act({ ...action, clientMs });
      setSending(false);
      if (!res || res.error) {
        if (res?.error) setSt((s) => ({ ...s, notice: res.error }));
        return;
      }
      const r = res.result || {};
      if (r.ignored) return; // a timeout for a word the server had already moved past
      if (r.tryAgain) {
        log('wrong, one more try');
        setSt((s) => ({ ...s, status: 'wrong', wrongs: s.wrongs + 1 }));
        return;
      }
      let status = missKind;
      if (r.correct) status = 'correct';
      else if (r.timedOut) status = 'timeout';
      log('resolved', status, r.answer);
      resolve(status, r.answer ?? null);
    },
    [live, resolved, sending, run, st.shownAt, resolve]
  );

  const check = useCallback(() => {
    if (blocked) return;
    if (answer.length < n) {
      setSt((s) => ({ ...s, notice: `Fill in all ${n} letters first.` }));
      return;
    }
    sendAnswerLike({ type: 'answer', value: answer.map((id) => letters[id]).join('') }, 'failed');
  }, [blocked, answer, n, letters, sendAnswerLike]);

  const skip = useCallback(() => {
    if (!blocked) sendAnswerLike({ type: 'skip' }, 'skipped');
  }, [blocked, sendAnswerLike]);

  const takeHint = useCallback(async () => {
    if (blocked || !live || live.hintsLeft <= 0 || run.busy) return;
    log('hint');
    setSending(true);
    const res = await run.act({ type: 'hint' });
    setSending(false);
    if (res?.error) setSt((s) => ({ ...s, notice: res.error }));
  }, [blocked, live, run]);

  /* the word's server clock ran out: send a timeout (the server records a miss) */
  useEffect(() => {
    if (!resolved && wordClock && !paused && !sending && seconds <= 0) {
      log('word clock hit 0 → timeout');
      sendAnswerLike({ type: 'timeout', round: wordClock.index }, 'timeout');
    }
  }, [resolved, wordClock, paused, sending, seconds, sendAnswerLike]);

  const results = useMemo(() => v?.results ?? [], [v]);
  const last = Boolean(v?.finished);

  const next = useCallback(() => {
    if (!resolved) return;
    if (last) {
      run.submit(); // the card is already on its way (useGameRun opens it); a no-op then
      return;
    }
    log('next word');
    setSt(freshFor(live));
  }, [resolved, last, run, live]);

  useEffect(() => {
    if (!resolved || last || paused) return undefined;
    if (nextLeft <= 0) {
      next();
      return undefined;
    }
    const id = window.setTimeout(() => setNextLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resolved, last, paused, nextLeft, next]);

  /* keyboard: letters type, Backspace takes back, Enter checks (or moves on) */
  const keyRef = useRef();
  useEffect(() => {
    keyRef.current = { typeLetter, backspace, check, next, resolved };
  });
  useEffect(() => {
    if (paused) return undefined;
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (
        event.target instanceof HTMLElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)
      )
        return;
      const api = keyRef.current;
      if (event.key === 'Backspace') {
        event.preventDefault();
        api.backspace();
      } else if (event.key === 'Enter') {
        if (event.target instanceof HTMLElement && event.target.closest('button, a')) return;
        event.preventDefault();
        if (api.resolved) api.next();
        else api.check();
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        api.typeLetter(event.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused]);

  if (!round) return null;

  const total = round.total;
  const hintsHere = revealed.length;
  const worth = FRACTION[Math.max(0, 1 - HINT_COST * hintsHere)] ?? '';
  let hintLabel = 'Hint · costs ¼ of this word';
  if (hintsHere && round.hintsLeft > 0) hintLabel = `Next letter · this word is now worth ${worth}`;
  else if (hintsHere) hintLabel = `Hint used · this word is now worth ${worth}`;
  const dots = Array.from({ length: total }, (_, i) => {
    const label = String(i + 1);
    if (i < results.length) return { state: results[i] === 'correct' ? 'ok' : 'bad', label };
    return { state: i === results.length ? 'now' : 'todo', label };
  });
  const solvedCount = results.filter((r) => r === 'correct').length;
  const status = sending && st.status === 'wrong' ? 'idle' : st.status;

  return {
    levelKey: run.difficulty || g.level,
    field: round.field,
    word: st.word,
    n,
    wordIndex: round.index,
    totalWords: total,
    isLast: resolved ? last : round.index === total - 1,
    tiles,
    order: st.order.length === letters.length ? st.order : identity(letters.length),
    answer,
    lockedIds: locked,
    wrongs: st.wrongs,
    status,
    resolved,
    hintMessage: hintsHere && !resolved ? `Hint: it starts with ${revealed}.` : null,
    hintLabel,
    hintDisabled: resolved || round.hintsLeft <= 0,
    notice: st.notice,
    dots,
    solvedCount,
    hintCount: hintsDone + (resolved ? 0 : hintsHere),
    attempted: results.length,
    clockLabel: formatClock(resolved ? 0 : seconds),
    nextHint: resolved && !last ? `Next word in ${nextLeft} s.` : null,
    bestSoFar: null,
    addTile,
    removeAt,
    clear,
    shuffle,
    takeHint,
    check,
    skip,
    next,
    finishNow: run.submit,
  };
};
