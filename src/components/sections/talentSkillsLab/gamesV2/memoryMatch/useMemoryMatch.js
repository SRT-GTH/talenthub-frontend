import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameClock } from '../useGameClock.js';
import { useGameV2Params } from '../gamesV2State.js';
import {
  MEMORY_CLOCK_SECONDS,
  MEMORY_LEVELS,
  MEMORY_SEEDS,
  boardFromSeed,
  buildResult,
  dealBoard,
  flipCard,
  isComplete,
  pairsFound,
  settlePairs,
} from './memoryMatchData.js';

const log = debug('useMemoryMatch');

const PAIR_SETTLE_MS = 900; // a matched pair stays white ("Nice — that's a pair.") before it turns light green
const WRONG_HOLD_MS = 1100; // a miss stays red before both cards turn back

/*
 * useMemoryMatch — all state of one Memory Match run.
 *   frame  the `?f=` code: GV-04 / GV-05 / GV-06 / GV-07 / GV-08 boot the drawn board (4×4, clock frozen until the first tap)
 * Returns { level, levelId, cards, turns, feedback, found, pairs, clock, timeLabel, done, flip, seeResult }.
 * Pauses the clock while a dialog (`?modal=`) is open; at 0:00 opens the Time's up card; a finished board calls `finish()`.
 */
export const useMemoryMatch = (frame) => {
  const g = useGameV2Params();
  const seed = MEMORY_SEEDS[frame] ?? null;
  const levelId = seed ? 'intermediate' : g.level;
  const level = MEMORY_LEVELS[levelId];
  const totalSeconds = MEMORY_CLOCK_SECONDS[levelId];

  const [cards, setCards] = useState(() => (seed ? boardFromSeed(seed) : dealBoard(levelId)));
  const [turns, setTurns] = useState(seed?.turns ?? 0);
  const [feedback, setFeedback] = useState(seed?.feedback ?? null);
  const [started, setStarted] = useState(!seed);
  const [done, setDone] = useState(false);
  const timers = useRef([]);
  const latest = useRef({});

  const found = pairsFound(cards);
  const modal = g.modal;

  const openTimeUp = useCallback(() => {
    log('clock reached 0 → time up');
    if (latest.current.modal !== 'timeup') g.openModal('timeup');
  }, [g]);
  const clock = useGameClock({
    start: seed ? seed.seconds : totalSeconds,
    direction: 'down',
    running: started && !modal && !done,
    onEnd: openTimeUp,
  });

  useEffect(() => {
    latest.current = { cards, turns, modal, seconds: clock.seconds, found };
  });
  useEffect(() => {
    log('mount', {
      frame,
      seeded: Boolean(seed),
      levelId,
      cards: cards.length,
      seconds: clock.seconds,
    });
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const later = (fn, ms) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const finishRun = useCallback(
    (cardsNow, turnsNow, secondsLeft) => {
      const result = buildResult({
        found: pairsFound(settlePairs(cardsNow)),
        pairs: level.pairs,
        turns: turnsNow,
        secondsLeft,
        totalSeconds,
      });
      log('finish', { score: result.score, run: result.run });
      g.finish(result);
    },
    [g, level.pairs, totalSeconds]
  );

  const flip = useCallback(
    (id) => {
      const { cards: cardsNow, turns: turnsNow } = latest.current;
      if (done || latest.current.modal) return;
      const step = flipCard(cardsNow, id);
      if (step.cards === cardsNow) {
        log('flip ignored', id);
        return;
      }
      if (!started) setStarted(true);
      const nextTurns = turnsNow + (step.turn ? 1 : 0);
      log('flip', { id, outcome: step.outcome, turns: nextTurns });
      setCards(step.cards);
      setTurns(nextTurns);
      setFeedback(step.outcome);
      latest.current = { ...latest.current, cards: step.cards, turns: nextTurns };
      if (step.outcome === 'pair') {
        if (isComplete(step.cards)) {
          log('board complete');
          setDone(true);
          later(() => {
            setCards((c) => settlePairs(c));
          }, 300);
          later(() => finishRun(step.cards, nextTurns, latest.current.seconds), PAIR_SETTLE_MS);
        } else {
          later(() => setCards((c) => settlePairs(c)), PAIR_SETTLE_MS);
        }
      } else if (step.outcome === 'wrong') {
        later(
          () => setCards((c) => c.map((x) => (x.state === 'wrong' ? { ...x, state: 'down' } : x))),
          WRONG_HOLD_MS
        );
      }
    },

    [done, started, finishRun]
  );

  const seeResult = useCallback(() => {
    log('see result (time up)');
    finishRun(latest.current.cards, latest.current.turns, 0);
  }, [finishRun]);

  const timeLabel = useMemo(() => {
    if (modal === 'offline') return 'Paused';
    return `${modal === 'timeup' ? '0:00' : clock.label} left`;
  }, [modal, clock.label]);

  return {
    g,
    level,
    levelId,
    cards,
    turns,
    feedback,
    found,
    pairs: level.pairs,
    clock,
    timeLabel,
    done,
    flip,
    seeResult,
    paused: modal === 'offline',
  };
};
