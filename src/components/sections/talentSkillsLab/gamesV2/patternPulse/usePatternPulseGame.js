import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameClock } from '../useGameClock.js';
import {
  PATTERN_PULSE_BANK,
  PATTERN_PULSE_FRAMES,
  PATTERN_PULSE_REVEAL_SECONDS,
  PATTERN_PULSE_ROUNDS_PER_RUN,
  PATTERN_PULSE_SENDING_MS,
  PATTERN_PULSE_TIME_LIMIT,
  PATTERN_PULSE_URGENT_AT,
} from './patternPulseData.js';
import { buildRound } from './patternPulseRules.js';

const log = debug('usePatternPulseGame');

const shuffled = (list) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/* single patterns list their choices ascending (as drawn: 16 / 17 / 18 / 20); two-pattern rounds are shuffled (drawn: 12 / 16 / 11 / 10) */
const choicesFor = (spec, answer) => {
  const all = [answer, ...spec.wrong];
  return spec.a ? shuffled(all) : [...all].sort((x, y) => x - y);
};

const average = (list) =>
  list.length ? Math.round(list.reduce((s, n) => s + n, 0) / list.length) : 0;

/*
 * usePatternPulseGame — the Pattern Pulse run (8 rounds, one question clock per round).
 *   phase  thinking → (pick) sending ("Checking your answer…", mock 0.8 s) → revealed (rule shown, "Next round starts in 3 s")
 *          thinking → (skip / clock 0) revealed with a miss. After round 8 the player presses "See my result".
 * `?f=PP-0x` seeds the drawn state and freezes every clock until the player touches the board (then it plays on live).
 */
// ⚠️ ASSUMPTION: the drawn saved game (GV-09: "round 5 of 8") resumes with rounds 1–4 answered correctly; their times are invented.
const RESUME_ROUND = 4;
const RESUME_HISTORY = [
  { result: 'ok', seconds: 14 },
  { result: 'ok', seconds: 11 },
  { result: 'ok', seconds: 17 },
  { result: 'ok', seconds: 12 },
];

export const usePatternPulseGame = ({ frame, level, paused, onFinish, resume = false }) => {
  const seed = frame ? (PATTERN_PULSE_FRAMES[frame] ?? null) : null;
  const levelKey = seed?.level ?? level;
  const bank = PATTERN_PULSE_BANK[levelKey];
  const limit = PATTERN_PULSE_TIME_LIMIT[levelKey];

  const startRound = !seed && resume ? RESUME_ROUND : 0;
  const [roundIndex, setRoundIndex] = useState(seed?.roundIndex ?? startRound);
  const [touched, setTouched] = useState(!seed);
  const [phase, setPhase] = useState(seed?.phase ?? 'thinking');
  const [picked, setPicked] = useState(seed?.picked ?? null);
  const [miss, setMiss] = useState(null); // 'skip' | 'timeout' | null
  const [history, setHistory] = useState(() => {
    if (!seed) return startRound ? RESUME_HISTORY : [];
    const earlier = seed.history.map(([result, seconds]) => ({ result, seconds }));
    if (seed.phase !== 'revealed') return earlier;
    const spec = PATTERN_PULSE_BANK[seed.level][seed.roundIndex];
    const answer = buildRound(spec).answer;
    const ok = seed.choices[seed.picked] === answer;
    return [...earlier, { result: ok ? 'ok' : 'bad', seconds: seed.answeredIn }];
  });
  const [choices, setChoices] = useState(() => {
    if (seed) return seed.choices;
    const spec = bank[startRound];
    return choicesFor(spec, buildRound(spec).answer);
  });
  const [revealLeft, setRevealLeft] = useState(PATTERN_PULSE_REVEAL_SECONDS);

  const spec = bank[roundIndex];
  const round = useMemo(() => buildRound(spec), [spec]);
  const correctIndex = choices.indexOf(round.answer);
  const isLast = roundIndex === PATTERN_PULSE_ROUNDS_PER_RUN - 1;
  const frozen = !touched;

  const timeout = useCallback(() => {
    log('question clock hit 0 → missed');
    setMiss('timeout');
    setPhase('revealed');
    setRevealLeft(PATTERN_PULSE_REVEAL_SECONDS);
    setHistory((h) => [...h, { result: 'bad', seconds: limit }]);
  }, [limit]);

  const clock = useGameClock({
    start: seed?.seconds ?? limit,
    direction: 'down',
    running: phase === 'thinking' && !paused && !frozen,
    onEnd: phase === 'thinking' && touched ? timeout : undefined,
  });

  const touch = useCallback(() => {
    setTouched((t) => {
      if (!t) log('seeded frame touched → clocks run live');
      return true;
    });
  }, []);

  const reveal = useCallback(
    (pickedIndex, elapsed) => {
      const ok = pickedIndex === correctIndex;
      log('reveal', {
        round: roundIndex + 1,
        picked: choices[pickedIndex],
        answer: round.answer,
        ok,
        elapsed,
      });
      setPhase('revealed');
      setRevealLeft(PATTERN_PULSE_REVEAL_SECONDS);
      setHistory((h) => [...h, { result: ok ? 'ok' : 'bad', seconds: elapsed }]);
    },
    [correctIndex, roundIndex, choices, round.answer]
  );

  const elapsedRef = useRef(0);
  const pick = useCallback(
    (index) => {
      if (phase !== 'thinking' || paused) return;
      touch();
      elapsedRef.current = Math.max(1, limit - clock.seconds);
      log('answer sent', { index, value: choices[index], elapsed: elapsedRef.current });
      setPicked(index);
      setPhase('sending');
    },
    [phase, paused, touch, limit, clock.seconds, choices]
  );

  const skip = useCallback(() => {
    if (phase !== 'thinking' || paused) return;
    touch();
    log('skip → counts as missed');
    setMiss('skip');
    setPhase('revealed');
    setRevealLeft(PATTERN_PULSE_REVEAL_SECONDS);
    setHistory((h) => [...h, { result: 'bad', seconds: Math.max(1, limit - clock.seconds) }]);
  }, [phase, paused, touch, limit, clock.seconds]);

  /* "Checking your answer…" → reveal (mock server latency) */
  useEffect(() => {
    if (phase !== 'sending' || paused || frozen) return undefined;
    const id = window.setTimeout(
      () => reveal(picked, elapsedRef.current),
      PATTERN_PULSE_SENDING_MS
    );
    return () => window.clearTimeout(id);
  }, [phase, paused, frozen, picked, reveal]);

  const finishRun = useCallback(
    (hist) => {
      const right = hist.filter((h) => h.result === 'ok');
      const accuracy = Math.round((right.length / PATTERN_PULSE_ROUNDS_PER_RUN) * 100);
      const avg = average(right.map((h) => h.seconds));
      const singleRounds = bank.map((s, i) => ({ s, i })).filter(({ s }) => !s.a);
      const singleRight = singleRounds.filter(({ i }) => hist[i]?.result === 'ok').length;
      const numerical = Math.round((singleRight / Math.max(1, singleRounds.length)) * 100);
      const speed = right.length
        ? Math.max(0, Math.min(100, Math.round(100 * (1 - avg / limit))))
        : 0;
      log('run finished', { right: right.length, accuracy, avg, numerical, speed });
      onFinish({
        score: accuracy,
        skills: [
          { label: 'Pattern recognition', value: accuracy },
          { label: 'Numerical reasoning', value: numerical },
          { label: 'Processing speed', value: speed },
        ],
        summary: right.length
          ? `Spotted ${right.length} of ${PATTERN_PULSE_ROUNDS_PER_RUN} patterns, answering the right ones in ${avg} s on average.`
          : `Spotted 0 of ${PATTERN_PULSE_ROUNDS_PER_RUN} patterns this time.`,
        verifies: 'Pattern recognition',
      });
    },
    [bank, limit, onFinish]
  );

  const next = useCallback(() => {
    if (phase !== 'revealed') return;
    touch();
    if (isLast) {
      finishRun(history);
      return;
    }
    const upcoming = bank[roundIndex + 1];
    log('next round', roundIndex + 2);
    setRoundIndex(roundIndex + 1);
    setChoices(choicesFor(upcoming, buildRound(upcoming).answer));
    setPicked(null);
    setMiss(null);
    setPhase('thinking');
    clock.reset(limit);
  }, [phase, touch, isLast, finishRun, history, bank, roundIndex, clock, limit]);

  /* "Next round starts in 3 s." (the latest `next` is read through a ref so a re-render never restarts the second) */
  const nextRef = useRef(next);
  useEffect(() => {
    nextRef.current = next;
  });
  useEffect(() => {
    if (phase !== 'revealed' || paused || frozen || isLast) return undefined;
    if (revealLeft <= 0) {
      nextRef.current();
      return undefined;
    }
    const id = window.setTimeout(() => setRevealLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, paused, frozen, isLast, revealLeft]);

  const rights = history.filter((h) => h.result === 'ok');
  const seconds = clock.seconds;
  const ring = frozen && seed?.ring != null ? seed.ring : seconds / limit;

  return {
    levelKey,
    spec,
    round,
    roundNumber: roundIndex + 1,
    totalRounds: PATTERN_PULSE_ROUNDS_PER_RUN,
    isLast,
    choices,
    correctIndex,
    phase,
    picked,
    miss,
    history,
    rightCount: rights.length,
    avgSeconds: average(rights.map((h) => h.seconds)),
    seconds,
    ring,
    urgent: seconds <= PATTERN_PULSE_URGENT_AT,
    revealLeft,
    frozen,
    pick,
    skip,
    next,
    finishNow: () => finishRun(history),
  };
};
