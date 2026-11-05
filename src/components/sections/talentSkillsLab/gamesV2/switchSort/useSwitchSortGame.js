import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';
import {
  buildDeck,
  scoreRun,
  sideFor,
  SS_HOLD_MS,
  SS_LEVELS,
  SS_SEEDS,
  SS_TICK_MS,
} from './switchSortData.js';

const log = debug('useSwitchSortGame');

/*
 * useSwitchSortGame — the run state machine.
 *   phase 'card'      a card is up, its bar counts down (`remainingMs`)
 *   phase 'feedback'  the tick / cross is on the basket for SS_HOLD_MS (`holdMs`), progress has already moved to the next card
 * `answers.length` = cards answered, so the card on show is `answers.length` in 'card' and `answers.length - 1` in 'feedback'.
 * A Figma seed (`?f=SS-0x`) boots a frozen state: no timer, no input.
 */
const makeState = (deck, cfg, seed) => {
  if (seed) {
    return {
      answers: seed.answers,
      phase: seed.phase,
      remainingMs: seed.remainingMs,
      holdMs: seed.holdMs ?? 0,
      feedback: seed.feedback ?? null,
      done: false,
    };
  }
  return {
    answers: [],
    phase: 'card',
    remainingMs: cfg.perCardMs,
    holdMs: 0,
    feedback: null,
    done: false,
  };
};

const reducer = (state, action) => {
  const { deck, cfg } = action;
  if (action.type === 'pick' || action.type === 'timeout') {
    if (state.phase !== 'card' || state.done) return state;
    const index = state.answers.length;
    const card = deck[index];
    const side = action.type === 'pick' ? action.side : null;
    const correct = side !== null && side === sideFor(card, card.rule);
    const tookMs = cfg.perCardMs - state.remainingMs;
    log('answer', {
      index,
      card: `${card.colour} ${card.shape}`,
      rule: card.rule,
      side,
      correct,
      tookMs,
    });
    return {
      ...state,
      answers: [
        ...state.answers,
        { correct, side, ms: tookMs, afterSwitch: Boolean(card.switched) },
      ],
      phase: 'feedback',
      holdMs: SS_HOLD_MS,
      feedback: { side, correct, tookMs, remainingAtPick: state.remainingMs },
    };
  }
  if (action.type === 'tick') {
    if (state.phase === 'card') {
      const remainingMs = state.remainingMs - SS_TICK_MS;
      return remainingMs <= 0
        ? reducer({ ...state, remainingMs: 0 }, { ...action, type: 'timeout' })
        : { ...state, remainingMs };
    }
    if (state.phase === 'feedback') {
      const holdMs = state.holdMs - SS_TICK_MS;
      if (holdMs > 0) return { ...state, holdMs };
      if (state.answers.length >= deck.length) return { ...state, holdMs: 0, done: true };
      return { ...state, phase: 'card', holdMs: 0, feedback: null, remainingMs: cfg.perCardMs };
    }
  }
  return state;
};

export const useSwitchSortGame = ({ level, frame, paused, onDone }) => {
  const seed = frame ? SS_SEEDS[frame] : null;
  const runLevel = seed?.level ?? level;
  const cfg = SS_LEVELS[runLevel] ?? SS_LEVELS.intermediate;
  const deck = useMemo(() => {
    const built = buildDeck(runLevel);
    if (seed?.patch)
      Object.entries(seed.patch).forEach(([i, patch]) => Object.assign(built[Number(i)], patch));
    log('deck built', { level: runLevel, cards: built.length, seed: frame });
    return built;
  }, [runLevel, seed, frame]);
  const [state, dispatch] = useReducer(reducer, null, () => makeState(deck, cfg, seed));
  const frozen = Boolean(seed);

  useEffect(() => {
    if (frozen || paused || state.done) return undefined;
    const id = window.setInterval(() => dispatch({ type: 'tick', deck, cfg }), SS_TICK_MS);
    return () => window.clearInterval(id);
  }, [frozen, paused, state.done, deck, cfg]);

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);
  useEffect(() => {
    if (!state.done) return;
    const result = scoreRun({
      answers: state.answers,
      total: deck.length,
      perCardMs: cfg.perCardMs,
    });
    log('run finished', result);
    doneRef.current?.(result);
  }, [state.done, state.answers, deck.length, cfg.perCardMs]);

  const pick = useCallback(
    (side) => {
      if (frozen || paused) return;
      dispatch({ type: 'pick', side, deck, cfg });
    },
    [frozen, paused, deck, cfg]
  );

  const shownIndex = Math.min(
    deck.length - 1,
    state.phase === 'feedback' ? state.answers.length - 1 : state.answers.length
  );
  return {
    ...state,
    cfg,
    level: runLevel,
    deck,
    seed,
    frozen,
    pick,
    shownIndex,
    shown: deck[shownIndex],
  };
};
