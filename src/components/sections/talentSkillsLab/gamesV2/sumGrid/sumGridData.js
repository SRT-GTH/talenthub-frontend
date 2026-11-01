/*
 * Sum Grid mock data — shaped like a future `GET /skills-lab/games/sum-grid/puzzle?level=…` payload.
 * Figma: "Games v2 · 8" SG-01 … SG-04 (4×4 Intermediate). A cage is { op, target, cells: [[row, col]…] } 1-based as the layer names;
 * `op` '' is a one-square cage ("4"), otherwise + − × ÷. A cage's small label is `${target}${op}`.
 *
 * Drawn (exact): INTERMEDIATE 4×4 — the eight cages of SG-01 (cage borders = the thick "group line" rects).
 *   ⚠️ ASSUMPTION  the drawn cages have TWO completions (checked with a solver: 4 3 2 1 / 2 1 4 3 as drawn in SG-04, or the same grid
 *   with the 3 and 1 swapped in rows 3–4 of columns 2 and 4). Frames boot the drawn board; a fresh run adds `bonusGivens` (a locked
 *   square that is right in the drawn solution) so a fresh puzzle has ONE solution. Solved is judged by the rules, so either
 *   completion of a board continued from a frame is accepted.
 *   ⚠️ ASSUMPTION  BEGINNER 3×3, ADVANCED 5×5 and EXPERT 6×6 are not drawn; generated and checked unique with a solver.
 *   ⚠️ ASSUMPTION  par times, the operators line of the other levels, the "Best so far: 70" mock.
 */
export const SUM_GRID_BEST = 70;

export const SUM_GRID_LEVELS = {
  beginner: {
    level: 'beginner',
    size: 3,
    eyebrow: 'BEGINNER · 3×3',
    subtitleLead: 'Numerical reasoning · 3×3 · + − ×',
    parSeconds: 120,
    bonusGivens: [],
    cages: [
      {
        op: '×',
        target: 2,
        cells: [
          [1, 1],
          [2, 1],
        ],
      },
      {
        op: '−',
        target: 1,
        cells: [
          [1, 2],
          [1, 3],
        ],
      },
      {
        op: '×',
        target: 3,
        cells: [
          [3, 1],
          [3, 2],
        ],
      },
      {
        op: '+',
        target: 3,
        cells: [
          [2, 3],
          [3, 3],
        ],
      },
      { op: '', target: 3, cells: [[2, 2]] },
    ],
  },
  intermediate: {
    level: 'intermediate',
    size: 4,
    eyebrow: 'INTERMEDIATE · 4×4',
    subtitleLead: 'Numerical reasoning · 4×4 · + − × ÷',
    parSeconds: 300,
    bonusGivens: [{ row: 4, col: 4, value: 3 }],
    cages: [
      {
        op: '+',
        target: 4,
        cells: [
          [1, 1],
          [2, 1],
        ],
      },
      {
        op: '×',
        target: 6,
        cells: [
          [1, 2],
          [1, 3],
        ],
      },
      {
        op: '÷',
        target: 2,
        cells: [
          [1, 4],
          [2, 4],
        ],
      },
      {
        op: '+',
        target: 7,
        cells: [
          [2, 2],
          [2, 3],
          [3, 3],
        ],
      },
      {
        op: '×',
        target: 8,
        cells: [
          [3, 1],
          [4, 1],
        ],
      },
      {
        op: '−',
        target: 2,
        cells: [
          [3, 2],
          [4, 2],
        ],
      },
      { op: '', target: 4, cells: [[4, 3]] },
      {
        op: '+',
        target: 4,
        cells: [
          [3, 4],
          [4, 4],
        ],
      },
    ],
  },
  advanced: {
    level: 'advanced',
    size: 5,
    eyebrow: 'ADVANCED · 5×5',
    subtitleLead: 'Numerical reasoning · 5×5 · + − × ÷',
    parSeconds: 600,
    bonusGivens: [],
    cages: [
      {
        op: '×',
        target: 6,
        cells: [
          [4, 3],
          [4, 4],
        ],
      },
      {
        op: '×',
        target: 30,
        cells: [
          [1, 3],
          [1, 4],
          [1, 5],
        ],
      },
      {
        op: '+',
        target: 11,
        cells: [
          [4, 1],
          [4, 2],
          [5, 1],
        ],
      },
      {
        op: '×',
        target: 15,
        cells: [
          [5, 2],
          [5, 3],
        ],
      },
      {
        op: '+',
        target: 7,
        cells: [
          [2, 4],
          [3, 3],
          [3, 4],
        ],
      },
      {
        op: '−',
        target: 2,
        cells: [
          [2, 5],
          [3, 5],
        ],
      },
      {
        op: '×',
        target: 20,
        cells: [
          [2, 2],
          [2, 3],
        ],
      },
      {
        op: '−',
        target: 2,
        cells: [
          [2, 1],
          [3, 1],
        ],
      },
      { op: '', target: 2, cells: [[3, 2]] },
      {
        op: '×',
        target: 4,
        cells: [
          [4, 5],
          [5, 4],
          [5, 5],
        ],
      },
      {
        op: '÷',
        target: 4,
        cells: [
          [1, 1],
          [1, 2],
        ],
      },
    ],
  },
  expert: {
    level: 'expert',
    size: 6,
    eyebrow: 'EXPERT · 6×6',
    subtitleLead: 'Numerical reasoning · 6×6 · + − × ÷',
    parSeconds: 900,
    bonusGivens: [],
    cages: [
      {
        op: '+',
        target: 11,
        cells: [
          [5, 3],
          [6, 2],
          [6, 3],
        ],
      },
      {
        op: '+',
        target: 7,
        cells: [
          [1, 3],
          [1, 4],
          [2, 3],
        ],
      },
      {
        op: '×',
        target: 18,
        cells: [
          [1, 5],
          [1, 6],
        ],
      },
      {
        op: '+',
        target: 7,
        cells: [
          [3, 4],
          [3, 5],
        ],
      },
      {
        op: '×',
        target: 16,
        cells: [
          [1, 1],
          [1, 2],
          [2, 1],
        ],
      },
      {
        op: '+',
        target: 12,
        cells: [
          [4, 3],
          [4, 4],
          [5, 4],
        ],
      },
      {
        op: '+',
        target: 13,
        cells: [
          [2, 6],
          [3, 6],
          [4, 6],
        ],
      },
      {
        op: '×',
        target: 12,
        cells: [
          [4, 5],
          [5, 5],
          [5, 6],
        ],
      },
      {
        op: '+',
        target: 6,
        cells: [
          [3, 1],
          [4, 1],
        ],
      },
      {
        op: '−',
        target: 1,
        cells: [
          [2, 4],
          [2, 5],
        ],
      },
      {
        op: '+',
        target: 8,
        cells: [
          [3, 2],
          [3, 3],
          [4, 2],
        ],
      },
      {
        op: '×',
        target: 90,
        cells: [
          [5, 1],
          [5, 2],
          [6, 1],
        ],
      },
      { op: '', target: 6, cells: [[2, 2]] },
      {
        op: '×',
        target: 20,
        cells: [
          [6, 4],
          [6, 5],
          [6, 6],
        ],
      },
    ],
  },
};

/*
 * The four frames (all INTERMEDIATE 4×4). `users` are [row, col, value] 1-based. `shown` as in gridLogicData:
 *   filled  SG-01 / SG-03 print "6 of 16 filled" while 4 / 5 squares hold a digit (Figma inconsistency, kept as drawn)
 *   strip   SG-04's strip says "3:12 so far" while its chip says "6:48 total" (Figma inconsistency, kept as drawn)
 *   bad     SG-02 flags only the cage 7+ cells; the two 3s in column 3 (rows 1 and 3) are not flagged in the frame
 */
const SG_USERS_A = [
  [1, 1, 1],
  [1, 2, 2],
  [1, 3, 3],
  [2, 1, 3],
];

export const SUM_GRID_FRAMES = {
  'SG-01': {
    level: 'intermediate',
    users: SG_USERS_A,
    selected: [2, 2],
    clockSeconds: 192,
    shown: { filled: '6 of 16 filled', strip: '3:12 so far' },
  },
  'SG-02': {
    level: 'intermediate',
    users: [...SG_USERS_A, [2, 2, 4], [2, 3, 1], [3, 3, 3]],
    selected: null,
    lastEdit: [3, 3],
    clockSeconds: 192,
    shown: {
      filled: '7 of 16 filled',
      strip: '3:12 so far',
      bad: [
        [2, 2],
        [2, 3],
        [3, 3],
      ],
      feedback: { tone: 'bad', text: 'This cage makes 8. It needs 7+.' },
    },
  },
  'SG-03': {
    level: 'intermediate',
    users: [
      [1, 1, 1],
      [1, 2, 2],
      [1, 3, 3],
      [1, 4, 3],
      [2, 1, 3],
    ],
    selected: null,
    lastEdit: [1, 4],
    clockSeconds: 192,
    shown: { filled: '6 of 16 filled', strip: '3:12 so far' },
  },
  'SG-04': {
    level: 'intermediate',
    users: [
      [1, 1, 1],
      [1, 2, 2],
      [1, 3, 3],
      [1, 4, 4],
      [2, 1, 3],
      [2, 2, 4],
      [2, 3, 1],
      [2, 4, 2],
      [3, 1, 4],
      [3, 2, 3],
      [3, 3, 2],
      [3, 4, 1],
      [4, 1, 2],
      [4, 2, 1],
      [4, 3, 4],
      [4, 4, 3],
    ],
    selected: null,
    clockSeconds: 408,
    shown: { strip: '3:12 so far' },
  },
};

export const SUM_GRID_COPY = {
  title: 'Make every cage add up.',
  intro: 'The small number in each cage is its target. The sign shows how to get there.',
  hint: 'Each cage must make its target with its sign. No number repeats in a row or column.',
  solvedTitle: 'Solved!',
  solvedIntro: 'Every row, column and cage is right.',
  solvedMessage: 'Solved. Every cage adds up.',
  measures: ['Numerical reasoning', 'Logical reasoning', 'Attention to detail'],
  /* ⚠️ ASSUMPTION — Submit with squares still empty / with a clash still on the board */
  incomplete: 'Some squares are still empty. Fill them all, then submit.',
};
