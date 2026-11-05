/*
 * Grid Logic mock data — shaped like a future `GET /skills-lab/games/grid-logic/puzzle?level=…` payload.
 * Figma: "Games v2 · 8" GL-01 … GL-04 (6×6 Intermediate, 9×9 Expert). Rows are strings, `.` = empty.
 *
 * Drawn (exact) puzzles: INTERMEDIATE 6×6 and EXPERT 9×9 — the given squares are the dark-grey digits in GL-01 / GL-04.
 *   ⚠️ ASSUMPTION  the drawn givens alone have more than one completion (6×6: 2, 9×9: 5+ — checked with a solver). Frames boot the
 *   drawn board exactly; a fresh run adds `bonusGivens` (squares that are correct in every drawn frame) so each fresh puzzle has ONE
 *   solution. Submit still accepts any grid that follows the rules, so a board continued from a frame is judged fairly.
 *   ⚠️ ASSUMPTION  BEGINNER 4×4 and ADVANCED 6×6 are not drawn; both generated and checked unique with a solver.
 *   ⚠️ ASSUMPTION  par times (score), the subtitle / hint wording for 4×4 and 9×9 "no notes" and the "Best so far" mock.
 */
export const GRID_LOGIC_BEST = 79;

export const GRID_LOGIC_LEVELS = {
  beginner: {
    level: 'beginner',
    size: 4,
    eyebrow: 'BEGINNER · 4×4',
    subtitleLead: 'Logical reasoning · 4×4 puzzle',
    intro: 'Each row, column and box of four uses 1 to 4 exactly once.',
    hint: 'Every row, column and box of four uses 1 to 4 once.',
    givens: ['...3', '31.4', '.43.', '..42'],
    bonusGivens: [],
    parSeconds: 180,
  },
  intermediate: {
    level: 'intermediate',
    size: 6,
    eyebrow: 'INTERMEDIATE · 6×6',
    subtitleLead: 'Logical reasoning · 6×6 puzzle',
    intro: 'Each row, column and box of six uses 1 to 6 exactly once.',
    hint: 'Every row, column and box of six uses 1 to 6 once.',
    givens: ['1..4.6', '.5..2.', '2.1..4', '..42.1', '31....', '6..3.2'],
    bonusGivens: [{ row: 4, col: 5, value: 3 }],
    parSeconds: 600,
  },
  advanced: {
    level: 'advanced',
    size: 6,
    eyebrow: 'ADVANCED · 6×6',
    subtitleLead: 'Logical reasoning · 6×6 hard',
    intro: 'Each row, column and box of six uses 1 to 6 exactly once.',
    hint: 'Every row, column and box of six uses 1 to 6 once.',
    givens: ['..241.', '.....6', '..1.5.', '5.6..2', '.....4', '2.536.'],
    bonusGivens: [],
    parSeconds: 900,
  },
  expert: {
    level: 'expert',
    size: 9,
    eyebrow: 'EXPERT · 9×9',
    subtitleLead: 'Logical reasoning · 9×9 hard',
    intro: 'Each row, column and box of nine uses 1 to 9 exactly once.',
    hint: 'Every row, column and box of nine uses 1 to 9 once.',
    givens: [
      '1.3.5....',
      '..6..9..3',
      '..9...45.',
      '.345.....',
      '567891234',
      '.912.....',
      '..5...91.',
      '..8..2..5',
      '9.2.4....',
    ],
    bonusGivens: [
      { row: 1, col: 6, value: 6 },
      { row: 2, col: 8, value: 2 },
      { row: 9, col: 7, value: 6 },
    ],
    parSeconds: 1500,
  },
};

/*
 * The four frames. `users` = the player's own (green) digits, [row, col, value] 1-based as in the Figma layer names.
 * `shown` = values the frame prints that the rules alone would not produce; they apply until the first edit:
 *   filled   "18 of 36 filled" is printed in GL-01…03 although 20 squares hold a digit (Figma inconsistency, kept as drawn);
 *            GL-04 prints 41 for 42 digits.
 *   strip    GL-04's progress strip says "7:40 so far" while its chip says "18:05 so far" (Figma inconsistency, kept as drawn).
 *   bad      GL-02 flags only the two 4s of row 3; the 4 at row 4 col 3 shares a box with the new 4 but is not flagged.
 */
const GL_USERS_A = [
  [1, 2, 2],
  [2, 1, 4],
  [2, 3, 6],
  [4, 1, 5],
];

export const GRID_LOGIC_FRAMES = {
  'GL-01': {
    level: 'intermediate',
    users: GL_USERS_A,
    selected: [3, 5],
    notesOn: false,
    clockSeconds: 460,
    shown: { filled: '18 of 36 filled', strip: '7:40 so far' },
  },
  'GL-02': {
    level: 'intermediate',
    users: [...GL_USERS_A, [3, 2, 4]],
    selected: [3, 5],
    notesOn: false,
    clockSeconds: 460,
    lastEdit: [3, 2],
    shown: {
      filled: '18 of 36 filled',
      strip: '7:40 so far',
      bad: [
        [3, 2],
        [3, 6],
      ],
    },
  },
  'GL-03': {
    level: 'intermediate',
    users: GL_USERS_A,
    selected: [1, 1],
    notesOn: false,
    clockSeconds: 460,
    shown: {
      filled: '18 of 36 filled',
      strip: '7:40 so far',
      feedback: { tone: 'info', text: 'That number is part of the puzzle. Pick an empty square.' },
    },
  },
  'GL-04': {
    level: 'expert',
    users: [
      [1, 6, 6],
      [2, 8, 2],
      [3, 5, 2],
      [4, 7, 8],
      [6, 1, 8],
      [6, 6, 4],
      [8, 5, 1],
      [9, 2, 1],
      [9, 7, 6],
    ],
    selected: [5, 5],
    notesOn: true,
    clockSeconds: 1085,
    shown: { filled: '41 of 81 filled', strip: '7:40 so far' },
  },
};

export const GRID_LOGIC_COPY = {
  title: 'Fill the grid.',
  notesIntro: 'Notes are on. Pencil in options, then commit when you’re sure.',
  notesHint: 'Notes are on: numbers you tap go in small, as pencil marks.',
  givenBlocked: 'That number is part of the puzzle. Pick an empty square.',
  measures: ['Logical reasoning', 'Attention to detail', 'Processing speed'],
  /* ⚠️ ASSUMPTION — Submit with squares still empty */
  incomplete: 'Some squares are still empty. Fill them all, then submit.',
};
