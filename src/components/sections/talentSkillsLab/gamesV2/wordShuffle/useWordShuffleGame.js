import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameClock } from '../useGameClock.js';
import {
  WORD_SHUFFLE_BANK,
  WORD_SHUFFLE_FRAMES,
  WORD_SHUFFLE_HINT_COST,
  WORD_SHUFFLE_RETRY_COST,
  WORD_SHUFFLE_RUN_SECONDS,
  WORD_SHUFFLE_WORDS_PER_RUN,
} from './wordShuffleData.js';

const log = debug('useWordShuffleGame');

const identity = (n) => Array.from({ length: n }, (_, i) => i);
const RESOLVED = ['correct', 'failed', 'skipped'];

const shuffled = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const seededResults = (seed) => {
  const earlier = Array.from({ length: seed.solved }, (_, i) => ({
    result: 'solved',
    points: 1,
    hint: i < seed.hints,
  }));
  return seed.status === 'correct'
    ? [...earlier, { result: 'solved', points: 1, hint: seed.hintOnWord }]
    : earlier;
};

/*
 * useWordShuffleGame — the Word Shuffle run (6 job titles, one run clock).
 *   tiles are the letters of `scramble` (ids = positions); `order` is the tray order (Shuffle permutes it); `answer` = tile ids in
 *   the answer row; `locked` = the hint-locked first tile. status idle → (Check) correct | wrong (1 more try) → correct | failed;
 *   Skip → skipped. `?f=WS-0x` seeds the drawn state and freezes the clock until the player touches the board.
 */
export const useWordShuffleGame = ({ frame, level, paused, onFinish, onTimeUp }) => {
  const seed = frame ? (WORD_SHUFFLE_FRAMES[frame] ?? null) : null;
  const levelKey = seed?.level ?? level;
  const words = WORD_SHUFFLE_BANK[levelKey];
  const runSeconds = WORD_SHUFFLE_RUN_SECONDS[levelKey];

  const [wordIndex, setWordIndex] = useState(seed?.wordIndex ?? 0);
  const [touched, setTouched] = useState(!seed);
  const [answer, setAnswer] = useState(seed?.answer ?? []);
  const [locked, setLocked] = useState(seed?.locked ?? null);
  const [wrongs, setWrongs] = useState(seed?.wrongs ?? 0);
  const [status, setStatus] = useState(seed?.status ?? 'idle');
  const [hintUsed, setHintUsed] = useState(seed?.hintOnWord ?? false);
  const [notice, setNotice] = useState(null);
  const [results, setResults] = useState(() => (seed ? seededResults(seed) : []));
  const [order, setOrder] = useState(() => identity(words[seed?.wordIndex ?? 0].word.length));

  const current = words[wordIndex];
  const n = current.word.length;
  const tiles = useMemo(
    () => [...current.scramble].map((letter, id) => ({ id, letter })),
    [current]
  );
  const resolved = RESOLVED.includes(status);
  const isLast = wordIndex === WORD_SHUFFLE_WORDS_PER_RUN - 1;
  const frozen = !touched;

  const clock = useGameClock({
    start: seed?.seconds ?? runSeconds,
    direction: 'down',
    running: !paused && !frozen && !resolved,
    onEnd: touched ? onTimeUp : undefined,
  });

  const touch = useCallback(() => {
    setTouched((t) => {
      if (!t) log('seeded frame touched → clock runs live');
      return true;
    });
  }, []);

  /* an edit after a wrong guess puts the row back to normal (the "Last try" chip stays) */
  const edit = useCallback(
    (nextAnswer) => {
      setAnswer(nextAnswer);
      setNotice(null);
      if (status === 'wrong') setStatus('idle');
    },
    [status]
  );

  const addTile = useCallback(
    (id) => {
      if (resolved || paused || answer.length >= n || answer.includes(id)) return;
      touch();
      log('add tile', tiles[id].letter);
      edit([...answer, id]);
    },
    [resolved, paused, answer, n, tiles, touch, edit]
  );

  const removeAt = useCallback(
    (position) => {
      if (resolved || paused) return;
      const id = answer[position];
      if (id === undefined || id === locked) return;
      touch();
      log('take back', tiles[id].letter);
      edit(answer.filter((_, i) => i !== position));
    },
    [resolved, paused, answer, locked, tiles, touch, edit]
  );

  const backspace = useCallback(() => {
    if (resolved || paused) return;
    const floor = locked === null ? 0 : 1;
    if (answer.length <= floor) return;
    touch();
    log('backspace');
    edit(answer.slice(0, -1));
  }, [resolved, paused, answer, locked, touch, edit]);

  const clear = useCallback(() => {
    if (resolved || paused) return;
    touch();
    log('clear');
    edit(locked === null ? [] : [locked]);
  }, [resolved, paused, locked, touch, edit]);

  const shuffle = useCallback(() => {
    if (resolved || paused) return;
    touch();
    const freeIds = shuffled(order.filter((id) => !answer.includes(id)));
    let k = 0;
    const next = order.map((id) => (answer.includes(id) ? id : freeIds[k++]));
    log('shuffle tray', next.map((id) => tiles[id].letter).join(''));
    setOrder(next);
  }, [resolved, paused, order, answer, tiles, touch]);

  const typeLetter = useCallback(
    (letter) => {
      const id = order.find((t) => !answer.includes(t) && tiles[t].letter === letter);
      if (id !== undefined) addTile(id);
    },
    [order, answer, tiles, addTile]
  );

  const takeHint = useCallback(() => {
    if (resolved || paused || hintUsed) return;
    touch();
    const first = current.word[0];
    const pool = tiles.filter((t) => t.letter === first);
    const tile = pool.find((t) => !answer.includes(t.id)) ?? pool[0];
    log('hint → lock first letter', first, tile.id);
    setHintUsed(true);
    setLocked(tile.id);
    edit([tile.id, ...answer.filter((id) => id !== tile.id)].slice(0, n));
  }, [resolved, paused, hintUsed, touch, current, tiles, answer, edit, n]);

  const record = useCallback(
    (result, points) => {
      setResults((r) => [...r, { result, points, hint: hintUsed }]);
    },
    [hintUsed]
  );

  const check = useCallback(() => {
    if (resolved || paused) return;
    touch();
    if (answer.length < n) {
      log('check with a short row', answer.length, '/', n);
      setNotice(`Fill in all ${n} letters first.`);
      return;
    }
    const guess = answer.map((id) => tiles[id].letter).join('');
    if (guess === current.word) {
      const points = Math.max(
        0,
        1 - (hintUsed ? WORD_SHUFFLE_HINT_COST : 0) - (wrongs > 0 ? WORD_SHUFFLE_RETRY_COST : 0)
      );
      log('correct', guess, points);
      setStatus('correct');
      record('solved', points);
      return;
    }
    if (wrongs === 0) {
      log('wrong guess, one more try', guess);
      setWrongs(1);
      setStatus('wrong');
    } else {
      log('wrong again → word lost', guess);
      setWrongs(2);
      setStatus('failed');
      record('missed', 0);
    }
  }, [resolved, paused, touch, answer, n, tiles, current, hintUsed, wrongs, record]);

  const skip = useCallback(() => {
    if (resolved || paused) return;
    touch();
    log('skip word');
    setStatus('skipped');
    record('missed', 0);
  }, [resolved, paused, touch, record]);

  const finishRun = useCallback(
    (list) => {
      const points = list.reduce((sum, r) => sum + r.points, 0);
      const solved = list.filter((r) => r.result === 'solved').length;
      const hints = list.filter((r) => r.hint).length;
      const left = clock.seconds;
      const score = Math.round((points / WORD_SHUFFLE_WORDS_PER_RUN) * 100);
      const verbal = Math.round((solved / WORD_SHUFFLE_WORDS_PER_RUN) * 100);
      const speed = Math.round(verbal * (0.5 + 0.5 * Math.min(1, left / runSeconds)));
      log('run finished', { points, solved, hints, left, score });
      onFinish({
        score,
        skills: [
          { label: 'Verbal reasoning', value: verbal },
          { label: 'Processing speed', value: speed },
        ],
        summary: `Unscrambled ${solved} of ${WORD_SHUFFLE_WORDS_PER_RUN} job titles using ${hints} ${hints === 1 ? 'hint' : 'hints'}.`,
        verifies: 'Verbal reasoning',
      });
    },
    [clock.seconds, runSeconds, onFinish]
  );

  const next = useCallback(() => {
    if (!resolved) return;
    touch();
    if (isLast) {
      finishRun(results);
      return;
    }
    const upcoming = words[wordIndex + 1];
    log('next word', wordIndex + 2, upcoming.word.length, 'letters');
    setWordIndex(wordIndex + 1);
    setOrder(identity(upcoming.word.length));
    setAnswer([]);
    setLocked(null);
    setWrongs(0);
    setStatus('idle');
    setHintUsed(false);
    setNotice(null);
  }, [resolved, touch, isLast, finishRun, results, words, wordIndex]);

  /* keyboard: letters type, Backspace takes back, Enter checks */
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

  const solvedCount = results.filter((r) => r.result === 'solved').length;
  const hintCount = results.filter((r) => r.hint).length + (hintUsed && !resolved ? 1 : 0);

  return {
    levelKey,
    current,
    n,
    wordIndex,
    totalWords: WORD_SHUFFLE_WORDS_PER_RUN,
    isLast,
    tiles,
    order,
    answer,
    locked,
    wrongs,
    status,
    resolved,
    hintUsed,
    notice,
    results,
    solvedCount,
    hintCount,
    attempted: results.length,
    seconds: clock.seconds,
    clockLabel: clock.label,
    ended: clock.ended,
    frozen,
    addTile,
    removeAt,
    clear,
    shuffle,
    takeHint,
    check,
    skip,
    next,
    finishNow: () => finishRun([...results]),
  };
};
