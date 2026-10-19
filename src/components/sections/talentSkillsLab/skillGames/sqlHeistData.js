/*
 * SQL Heist mock data — Figma SL-GS04 "Clue 3" (Playful 7943:7270 / Focused 8110:495932). Shaped like
 * `GET /skills-lab/games/sql-heist` (run config + clues) and `POST …/clues/:n/run` (the query result).
 *
 * DRAWN: clue 3 only (title, prompt, the three tables, the query with the BETWEEN slot filled and an empty last slot, the five
 * draggable clauses, the preview rows Selorm 3 / Abena 1 / Kwame 1, "4 suspects left", "2 of 5 clues", header copy).
 * ⚠️ ASSUMPTION: clues 1, 2, 4 and 5 (their query, clauses, preview rows, suspects count) are invented so the 5-clue loop can
 * be played; so are the error messages of wrong clauses, "HAVING … > 1" being the only correct clause of clue 3, the scoring
 * (a clue is cracked when you lock the right suspect after at most 1 wrong run) and +20 XP per clue / +20 pass bonus.
 *
 * Query segments: [text, tone] where tone 'k' = keyword (#ffd86b), 'fill' = a clause already placed (green chip).
 */
export const SQL_HEIST = {
  gameId: 'sql-heist',
  title: 'Skills Lab · SQL Heist',
  label: 'SQL Heist',
  subtitle: 'SQL · 5 clues · Pass 4 to earn Verified',
  skill: 'SQL',
  total: 5,
  passMark: 4,
  baseXp: 240,
  streakDays: 7,
  clueXp: 20,
  passBonusXp: 20,
  maxMisses: 1,
  tables: [
    'staff (id, name, role)',
    'shifts (staff_id, clock_in, clock_out)',
    'orders (id, staff_id, item, time)',
  ],
};

const NAME_ORDERS = ['name', 'orders'];
const NAME = ['name'];

export const SQL_CLUES = [
  {
    // ⚠️ ASSUMPTION (clue 1)
    topic: 'Filtering',
    check: ['Filtering', 'JOINs'],
    suspects: 10,
    suspectsAfter: 7,
    title: [
      ['Who was clocked in ', false],
      ['at 1pm?', true],
    ],
    prompt:
      'The 2pm jollof pot vanished between 13:00 and 13:45. Finish the query to see who was on shift.',
    lines: [
      [['SELECT', 'k'], [' s.name']],
      [['FROM', 'k'], [' staff s']],
      [['JOIN', 'k'], [' shifts sh '], ['ON', 'k'], [' sh.staff_id = s.id']],
      [['WHERE', 'k'], [" sh.clock_in <= '13:00'"]],
    ],
    base: {
      cols: NAME,
      rows: [
        ['Selorm'],
        ['Abena'],
        ['Kwame'],
        ['Esi'],
        ['Yaw'],
        ['Adwoa'],
        ['Kofi'],
        ['Mawuli'],
        ['Efua'],
        ['Nii'],
      ],
    },
    tokens: [
      {
        label: "AND sh.clock_out >= '13:45'",
        run: {
          cols: NAME,
          rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi'], ['Yaw'], ['Adwoa'], ['Kofi']],
        },
      },
      {
        label: "AND sh.clock_out <= '13:45'",
        run: { cols: NAME, rows: [['Mawuli'], ['Efua'], ['Nii']] },
      },
      {
        label: 'ORDER BY s.name',
        run: { error: 'Nothing is filtered yet. ORDER BY only sorts the rows.' },
      },
      {
        label: 'GROUP BY s.name',
        run: { error: 'Nothing is filtered yet. GROUP BY only merges the rows.' },
      },
    ],
    answer: 0,
    solved: {
      cols: NAME,
      rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi'], ['Yaw'], ['Adwoa'], ['Kofi']],
    },
    resolveRows: 7,
  },
  {
    // ⚠️ ASSUMPTION (clue 2)
    topic: 'JOINs',
    check: ['JOINs', 'Filtering'],
    suspects: 7,
    suspectsAfter: 4,
    title: [
      ['Who rang up ', false],
      ['an order?', true],
    ],
    prompt:
      'Only people who took an order could have seen the pot. Join the tables to keep just them.',
    lines: [
      [['SELECT DISTINCT', 'k'], [' s.name']],
      [['FROM', 'k'], [' staff s']],
    ],
    base: {
      cols: NAME,
      rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi'], ['Yaw'], ['Adwoa'], ['Kofi']],
    },
    tokens: [
      {
        label: 'JOIN orders o ON o.staff_id = s.id',
        run: { cols: NAME, rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi']] },
      },
      { label: 'JOIN orders o ON o.id = s.id', run: { cols: NAME, rows: [['Selorm'], ['Abena']] } },
      {
        label: 'LEFT JOIN shifts sh ON sh.staff_id = s.id',
        run: {
          cols: NAME,
          rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi'], ['Yaw'], ['Adwoa'], ['Kofi']],
        },
      },
    ],
    answer: 0,
    solved: { cols: NAME, rows: [['Selorm'], ['Abena'], ['Kwame'], ['Esi']] },
  },
  {
    // DRAWN (clue 3, Figma SL-GS04)
    topic: 'GROUP BY',
    check: ['JOINs', 'Filtering', 'GROUP BY'],
    suspects: 4,
    suspectsAfter: 2,
    title: [
      ['Who was on shift ', false],
      ['and ordered?', true],
    ],
    prompt:
      'The 2pm jollof pot vanished between 13:00 and 13:45. Finish the query to narrow down the suspects.',
    lines: [
      [['SELECT', 'k'], [' s.name, '], ['COUNT', 'k'], ['(o.id) '], ['AS', 'k'], [' orders']],
      [['FROM', 'k'], [' staff s']],
      [['JOIN', 'k'], [' orders o '], ['ON', 'k'], [' o.staff_id = s.id']],
      [['WHERE', 'k'], [' o.time '], ['BETWEEN', 'fill']],
      [["  '13:00' "], ['AND', 'k'], [" '13:45'"]],
      [['GROUP BY', 'k'], [' s.name']],
    ],
    base: {
      cols: NAME_ORDERS,
      rows: [
        ['Selorm', '3'],
        ['Abena', '1'],
        ['Kwame', '1'],
      ],
    },
    tokens: [
      { label: 'HAVING COUNT(o.id) > 1', run: { cols: NAME_ORDERS, rows: [['Selorm', '3']] } },
      {
        label: 'ORDER BY orders DESC',
        run: {
          cols: NAME_ORDERS,
          rows: [
            ['Selorm', '3'],
            ['Abena', '1'],
            ['Kwame', '1'],
          ],
        },
      },
      { label: 'LIMIT 1', run: { error: 'LIMIT 1 keeps an arbitrary row. Sort or filter first.' } },
      {
        label: "WHERE s.role = 'Chef'",
        run: { error: 'Syntax error near WHERE. Filters go before GROUP BY.' },
      },
      {
        label: 'LEFT JOIN shifts',
        run: { error: 'Syntax error near LEFT. Joins go before WHERE.' },
      },
    ],
    answer: 0,
    solved: { cols: NAME_ORDERS, rows: [['Selorm', '3']] },
  },
  {
    // ⚠️ ASSUMPTION (clue 4)
    topic: 'Filtering',
    check: ['Filtering', 'GROUP BY'],
    suspects: 2,
    suspectsAfter: 1,
    title: [
      ['Who ordered ', false],
      ['the jollof?', true],
    ],
    prompt: 'Two suspects left. Check which of them ordered jollof in that window.',
    lines: [
      [['SELECT', 'k'], [' s.name, ', ''], ['COUNT', 'k'], ['(o.id) '], ['AS', 'k'], [' orders']],
      [['FROM', 'k'], [' staff s']],
      [['JOIN', 'k'], [' orders o '], ['ON', 'k'], [' o.staff_id = s.id']],
      [['WHERE', 'k'], [" s.name IN ('Selorm', 'Abena')"]],
    ],
    base: {
      cols: NAME_ORDERS,
      rows: [
        ['Selorm', '3'],
        ['Abena', '1'],
      ],
    },
    tokens: [
      { label: "AND o.item = 'jollof'", run: { cols: NAME_ORDERS, rows: [['Selorm', '3']] } },
      { label: "AND o.item = 'waakye'", run: { cols: NAME_ORDERS, rows: [['Abena', '1']] } },
      { label: 'ORDER BY s.name', run: { error: 'That only sorts. Add a condition on o.item.' } },
    ],
    answer: 0,
    solved: { cols: NAME_ORDERS, rows: [['Selorm', '3']] },
  },
  {
    // ⚠️ ASSUMPTION (clue 5)
    topic: 'GROUP BY',
    check: ['GROUP BY', 'JOINs'],
    suspects: 1,
    suspectsAfter: 1,
    title: [
      ['One last count: ', false],
      ['how many pots?', true],
    ],
    prompt: 'Confirm the culprit by counting the jollof orders per person.',
    lines: [
      [['SELECT', 'k'], [' s.name, ', ''], ['COUNT', 'k'], ['(o.id) '], ['AS', 'k'], [' pots']],
      [['FROM', 'k'], [' staff s']],
      [['JOIN', 'k'], [' orders o '], ['ON', 'k'], [' o.staff_id = s.id']],
      [['WHERE', 'k'], [" o.item = 'jollof'"]],
    ],
    base: { cols: ['name', 'pots'], rows: [['Selorm', '3']] },
    tokens: [
      { label: 'GROUP BY s.name', run: { cols: ['name', 'pots'], rows: [['Selorm', '3']] } },
      {
        label: 'GROUP BY o.item',
        run: { error: 'Each person needs their own count. Group by s.name.' },
      },
      { label: 'LIMIT 0', run: { cols: ['name', 'pots'], rows: [] } },
    ],
    answer: 0,
    solved: { cols: ['name', 'pots'], rows: [['Selorm', '3']] },
  },
];

/*
 * Figma seed (?f=GS04): clue 3 (index 2), clues 1–2 cracked, the HAVING clause "in hand" (gold, tilted 3°), slot still empty,
 * the preview still showing the base rows, Lock in suspect disabled.
 */
export const SQL_FRAMES = {
  GS04: { clue: 2, results: ['ok', 'ok'], held: 0, slot: null, ran: null, misses: 0 },
};
