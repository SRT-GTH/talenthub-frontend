/*
 * Errand Run data (Figma "Games v2 · 9", frames ER-01 … ER-03). Mock payload shaped like a future
 * GET /skills-lab/games/errand-run/maps?level=… response.
 *
 * Grid: 7 x 7 street crossings (col 0-6 left → right, row 0-6 bottom → top). Home is the bottom-left crossing (0,0).
 * A trip costs the blocks across plus the blocks up or down (Manhattan distance) — the Figma lead copy.
 * Drawn (exact, Intermediate map 2): Home (0,0) · Chop Bar (1,2) · Makola Market (2,5) · Pharmacy (5,4) · Lorry Station (5,1);
 * Chop Bar +3 · Makola +4 · Pharmacy +4 · Lorry +3 = 14 (shortest); Chop → Pharmacy → Makola → Lorry = 20.
 * ⚠️ ASSUMPTION: every other map (maps 1 and 3 of each level, the other levels), stop counts per level (3 / 4 / 5 / 6), the extra stop
 * names "Post Office" and "Bank", the per-map time limit (30 s + 15 s per stop; 90 s for the drawn 4 stops), the scoring, and the
 * "Best so far: 77" mock are not drawn. Maps are generated deterministically (seeded) and each must have a shortest route that
 * beats the nearest-first route.
 */
export const ERRAND_HOME = { id: 'home', name: 'Home', col: 0, row: 0 };
export const ERRAND_MAPS_PER_RUN = 3;
export const ERRAND_BEST_SO_FAR = 77;
export const ERRAND_MEASURES = ['Planning', 'Numerical reasoning', 'Processing speed'];

// ⚠️ ASSUMPTION for all but Intermediate = 4 stops (drawn).
export const ERRAND_STOPS_BY_LEVEL = { beginner: 3, intermediate: 4, advanced: 5, expert: 6 };
export const errandTimeLimit = (stops) => 30 + 15 * stops;

// Stop catalogue: `ref` is how a sentence names the stop ("Visiting Makola before the Pharmacy …").
export const ERRAND_STOP_TYPES = {
  chop: { id: 'chop', name: 'Chop Bar', ref: 'the Chop Bar', icon: 'pin' },
  makola: { id: 'makola', name: 'Makola Market', ref: 'Makola', icon: 'pin' },
  pharmacy: { id: 'pharmacy', name: 'Pharmacy', ref: 'the Pharmacy', icon: 'plus' },
  lorry: { id: 'lorry', name: 'Lorry Station', ref: 'the Lorry Station', icon: 'pin' },
  post: { id: 'post', name: 'Post Office', ref: 'the Post Office', icon: 'pin' }, // ⚠️ ASSUMPTION
  bank: { id: 'bank', name: 'Bank', ref: 'the Bank', icon: 'pin' }, // ⚠️ ASSUMPTION
};
export const ERRAND_STOP_ORDER = ['chop', 'makola', 'pharmacy', 'lorry', 'post', 'bank'];

export const ERRAND_DRAWN_MAP = {
  id: 'drawn-intermediate-2',
  stops: [
    { ...ERRAND_STOP_TYPES.chop, col: 1, row: 2 },
    { ...ERRAND_STOP_TYPES.makola, col: 2, row: 5 },
    { ...ERRAND_STOP_TYPES.pharmacy, col: 5, row: 4 },
    { ...ERRAND_STOP_TYPES.lorry, col: 5, row: 1 },
  ],
};

// Green "park" blocks of the drawn town map: (col, row-from-top) of the 6 x 6 blocks.
export const ERRAND_PARK_BLOCKS = [
  [0, 0],
  [0, 5],
  [1, 2],
  [2, 4],
  [3, 1],
  [4, 3],
  [5, 0],
  [5, 5],
];

// Frame seeds: the exact drawn states (intermediate, map 2 of 3). `seconds` = clock value of the frame.
export const ERRAND_SEEDS = {
  'ER-01': {
    mapIdx: 2,
    route: ['chop', 'makola'],
    status: 'play',
    results: ['shortest'],
    seconds: 64,
  },
  'ER-02': {
    mapIdx: 2,
    route: ['chop', 'pharmacy', 'makola', 'lorry'],
    status: 'done',
    results: ['shortest', 'longer'],
    seconds: 90 - 52,
  },
  'ER-03': {
    mapIdx: 2,
    route: ['chop', 'makola', 'pharmacy', 'lorry'],
    status: 'done',
    results: ['shortest', 'shortest'],
    seconds: 90 - 41,
  },
};
