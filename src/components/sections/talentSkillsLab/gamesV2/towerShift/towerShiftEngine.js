import { debug } from '../../../../../utils/debug.js';
import { TOWER_GOAL_PEG } from './towerShiftData.js';

const log = debug('towerShiftEngine');

/* Pure Tower of Hanoi rules. state = { stacks: number[][] (bottom → top, 1 = smallest), lifted: {disc, from} | null,
   cursor, moves, illegal, blocked }. A disc lifted off a stack is NOT in `stacks`. */
export const towerOptimalMoves = (discs) => 2 ** discs - 1;

export const towerFreshState = (discs) => ({
  stacks: [Array.from({ length: discs }, (_, i) => discs - i), [], []],
  lifted: null,
  cursor: 0,
  moves: 0,
  illegal: 0,
  blocked: false,
});

export const towerCanDrop = (stacks, disc, peg) => {
  const top = stacks[peg][stacks[peg].length - 1];
  return top === undefined || top > disc;
};

export const towerIsSolved = (stacks, discs) => stacks[TOWER_GOAL_PEG].length === discs;

export const towerMoveCursor = (state, delta) => ({
  ...state,
  cursor: Math.min(2, Math.max(0, state.cursor + delta)),
  blocked: false,
});

export const towerLift = (state, peg) => {
  if (state.lifted) return state;
  const stack = state.stacks[peg];
  if (!stack.length) return { ...state, cursor: peg, blocked: false };
  const stacks = state.stacks.map((s, i) => (i === peg ? s.slice(0, -1) : s));
  return {
    ...state,
    stacks,
    lifted: { disc: stack[stack.length - 1], from: peg },
    cursor: peg,
    blocked: false,
  };
};

/** Drop the lifted disc on `peg`: back on its own peg = no move; legal = move counted; illegal = flagged, no move. */
export const towerDrop = (state, peg) => {
  if (!state.lifted) return state;
  const { disc, from } = state.lifted;
  if (peg === from) {
    return {
      ...state,
      stacks: state.stacks.map((s, i) => (i === peg ? [...s, disc] : s)),
      lifted: null,
      cursor: peg,
      blocked: false,
    };
  }
  if (!towerCanDrop(state.stacks, disc, peg)) {
    log('illegal drop', { disc, peg });
    return { ...state, cursor: peg, illegal: state.illegal + 1, blocked: true };
  }
  return {
    ...state,
    stacks: state.stacks.map((s, i) => (i === peg ? [...s, disc] : s)),
    lifted: null,
    cursor: peg,
    moves: state.moves + 1,
    blocked: false,
  };
};

/** Tap a peg: lifts its top disc, or (while holding a disc) tries to drop it there. */
export const towerTap = (state, peg) =>
  state.lifted ? towerDrop({ ...state, cursor: peg }, peg) : towerLift(state, peg);
