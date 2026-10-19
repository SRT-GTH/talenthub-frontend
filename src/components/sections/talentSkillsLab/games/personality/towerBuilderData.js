/*
 * Tower Builder mock content (Figma SL-GP10 New rule, Playful 7943:10911 / Focused 8110:497813). Level 2 — copy, the
 * drawn tower (5 rows), the ghost slot, the held blue block, tray colours / widths, "7 moves left", "Height 6 of 10" —
 * is verbatim. Board geometry is in "units" (one unit = 47.1px of the 1040px-wide board = 4.529cqw); x may be a half unit.
 *
 * ⚠️ ASSUMPTION: levels 1 and 3 (targets, rules, titles, moves), the placement rules (blocks land on whatever is below
 * them; a block may not touch a same-colour block when the level rule names that colour), what happens when moves run
 * out (the level ends, the game goes on), a "level" sticker for levels 1 and 3, and the completion dialog.
 */
export const UNIT = 47.1; // px at the Figma 1040px board
export const BOARD = { w: 1040, h: 603, ground: 57 };

export const COLORS = {
  yellow: '#ffd86b',
  green: '#387440',
  blue: '#5c8cd9',
  pink: '#f472b6',
};
/* Tray order and widths (units): 1 · 2 · 3 · 2 */
export const TRAY = [
  { color: 'yellow', w: 1 },
  { color: 'green', w: 2 },
  { color: 'blue', w: 3 },
  { color: 'pink', w: 2 },
];

/* Level 2 starting tower (rows from the ground up): { color, x, w, row } */
const L2_TOWER = [
  { color: 'green', x: 9, w: 4, row: 0 },
  { color: 'yellow', x: 9, w: 2, row: 1 },
  { color: 'blue', x: 11, w: 2, row: 1 },
  { color: 'green', x: 9.5, w: 3, row: 2 },
  { color: 'pink', x: 10, w: 2, row: 3 },
  { color: 'yellow', x: 9, w: 2, row: 4 },
  { color: 'green', x: 11, w: 1, row: 4 },
];

export const TOWER = {
  gameId: 'tower-builder',
  title: 'Personality game · Tower Builder',
  subtitle: '3 levels · Undo is free · About 3 min left',
  xp: '+20 {xp}',
  doneXp: '+50 {xp}',
  doneSubtitle: '3 levels · Game done',
  progressNote: 'Undo is free',
  doneNote: 'Saved',
  info: 'Drag a block onto the tower. Rules change every level, so check the rule card.',
  doneInfo: 'Your traits update after every game. Recruiters only see traits.',
  reads: ['Conscientiousness', 'Adapting to change'],
  levels: [
    {
      /* ⚠️ ASSUMPTION */
      eyebrow: 'LEVEL 1 · LOGIC',
      sticker: 'WARM UP',
      title: ['Build to 6. ', 'Warm up first.'],
      body: 'No rule yet. Drag a block onto the tower. Undo is free.',
      target: 6,
      moves: 8,
      rule: { color: null, text: 'Stack anything, anywhere.' },
      tower: [],
    },
    {
      /* DRAWN: GP10 */
      eyebrow: 'LEVEL 2 · LOGIC',
      sticker: 'NEW RULE!',
      title: ['Build to 10. A new rule ', 'just dropped.'],
      body: 'No two yellow blocks can touch. Drag a block onto the tower. Undo is free.',
      target: 10,
      moves: 7,
      rule: { color: 'yellow', text: 'No two yellow blocks can touch.' },
      tower: L2_TOWER,
    },
    {
      /* ⚠️ ASSUMPTION */
      eyebrow: 'LEVEL 3 · LOGIC',
      sticker: 'NEW RULE!',
      title: ['Build to 10. The rule ', 'changed again.'],
      body: 'No two pink blocks can touch. Drag a block onto the tower. Undo is free.',
      target: 10,
      moves: 9,
      rule: { color: 'pink', text: 'No two pink blocks can touch.' },
      tower: [],
    },
  ],
  complete: {
    sticker: 'TOWER DONE',
    eyebrow: 'YOUR PLAY STYLE',
    title: 'The Steady Builder.',
    body: 'You checked the rule before every block and rebuilt your plan when it changed.',
    stats: [
      { value: '3 of 3', label: 'LEVELS', tone: 'green' },
      { value: '+50 {xp}', label: 'EARNED', tone: 'gold' },
      { value: '2', label: 'TRAITS READ', tone: 'green' },
    ],
    traits: [
      { label: 'Conscientiousness', note: 'Checked the rule card', chip: '+6', strong: true },
      { label: 'Adapting to change', note: 'Replanned after each rule', chip: '+5', strong: true },
    ],
    next: { title: 'Up next: The Pitch', sub: '~3 min · Creativity · +50 {xp}', cta: 'Play' },
    actions: { secondary: 'Back to games', primary: 'Play next game' },
  },
};

/* ---- placement helpers (pure) ---- */
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x;
/* the row a block of {x,w} lands on */
export const landingRow = (blocks, x, w) =>
  blocks.reduce((top, b) => (overlaps({ x, w }, b) ? Math.max(top, b.row + 1) : top), 0);
/* does placing {color,x,w,row} touch a same-colour block (edge to edge)? */
export const touchesSame = (blocks, block) =>
  blocks.some(
    (b) =>
      b.color === block.color &&
      ((b.row === block.row && (b.x + b.w === block.x || block.x + block.w === b.x)) ||
        (Math.abs(b.row - block.row) === 1 && overlaps(b, block)))
  );
export const towerHeight = (blocks) => blocks.reduce((m, b) => Math.max(m, b.row + 1), 0);
