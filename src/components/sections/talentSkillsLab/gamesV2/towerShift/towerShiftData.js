/*
 * Tower Shift data (Figma "Games v2 · 8", frames TS-01 … TS-03). Mock payload shaped like a future
 * GET /skills-lab/games/tower-shift/config?level=… response.
 *
 * Drawn (exact): the Intermediate level = 4 discs, fewest possible 15, "3:10 left" at move 6 (TS-01), "Best so far: 86".
 * ⚠️ ASSUMPTION: the other levels (3 / 5 / 6 discs), every time limit, the disc colours of discs 5 and 6, the "fewest possible"
 * copy variants (zero / one move over) and the scoring below are not drawn.
 */
export const TOWER_PEG_NAMES = ['Start', 'Middle', 'Goal'];
export const TOWER_GOAL_PEG = 2;

// ⚠️ ASSUMPTION: discs per level + time limit (seconds). Intermediate = 4 discs is drawn; its 4:00 limit is inferred from 3:10 left at move 6.
export const TOWER_LEVELS = {
  beginner: { discs: 3, seconds: 120 },
  intermediate: { discs: 4, seconds: 240 },
  advanced: { discs: 5, seconds: 480 },
  expert: { discs: 6, seconds: 900 },
};

// Discs 1-4 are drawn (#c4502e, #f2b731, #387440, #2f5e9e). ⚠️ ASSUMPTION: discs 5 and 6.
export const TOWER_DISC_COLORS = ['#c4502e', '#f2b731', '#387440', '#2f5e9e', '#6a4c93', '#2f8f8f'];

export const TOWER_BEST_SO_FAR = 86; // mock "Best so far: 86" (drawn)

export const TOWER_MEASURES = ['Planning', 'Logical reasoning', 'Processing speed'];

export const TOWER_COPY = {
  title: 'Move the tower to the Goal peg.',
  lead: 'One disc at a time. A bigger disc can never sit on a smaller one.',
  notAllowed: 'A bigger disc can’t go on a smaller one. No move counted.',
  solvedTitle: 'Tower moved!',
};

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

/** Lead sentence once solved. Drawn: "Two moves over the fewest possible. Try for 15 next time." ⚠️ ASSUMPTION: the 0- and 1-over variants. */
export const towerSolvedLead = (moves, optimal) => {
  const over = moves - optimal;
  if (over <= 0) return `That’s the fewest possible: ${optimal} moves.`;
  const word = WORDS[over] ?? String(over);
  return `${word} move${over === 1 ? '' : 's'} over the fewest possible. Try for ${optimal} next time.`;
};

export const towerSolvedMessage = (moves, optimal) =>
  `Tower moved in ${moves} moves. The fewest is ${optimal}.`;

/** ⚠️ ASSUMPTION: score = efficiency (fewest / moves) minus 3 per illegal try. */
export const towerScore = ({ moves, optimal, illegal }) =>
  Math.max(0, Math.round((100 * optimal) / Math.max(moves, optimal)) - illegal * 3);

// Frame seeds: the exact drawn states. lifted.from = the peg the disc was picked up from.
export const TOWER_SEEDS = {
  'TS-01': {
    stacks: [[4, 3], [2], []],
    lifted: { disc: 1, from: 1 },
    cursor: 1,
    moves: 6,
    illegal: 0,
    blocked: false,
    seconds: 190,
  },
  'TS-02': {
    stacks: [[4], [2], [1]],
    lifted: { disc: 3, from: 0 },
    cursor: 1,
    moves: 6,
    illegal: 1,
    blocked: true,
    seconds: 182,
  },
  'TS-03': {
    stacks: [[], [], [4, 3, 2, 1]],
    lifted: null,
    cursor: 2,
    moves: 17,
    illegal: 1,
    blocked: false,
    seconds: 240 - 161,
  },
};
