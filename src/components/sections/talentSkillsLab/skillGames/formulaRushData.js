/*
 * Formula Rush mock data — Figma SL-GS10 "Lap 3" (Playful 7943:8468 / Focused 8110:496529). Shaped like
 * `GET /skills-lab/games/formula-rush` (laps + the shared sheet) + `POST …/laps/:n/fire` (the cell value).
 *
 * DRAWN: lap 3 (=SUMIF(A2:A9, "Ashanti", [sum range]) with the sum-range slot empty, tokens E2:E9 / D2:D9 / B2:B9 / COUNTIF, the
 * sheet rows 1–7, race track "YOU" 58% vs ghost 67%, "Lap time 0:18", "Ghost 4s ahead", "2 laps · both under 30s", header copy).
 * ⚠️ ASSUMPTION: laps 1, 2, 4, 5, 6 (question, formula, tokens, answers) on the same sheet; the right answer of lap 3 is E2:E9
 * (Revenue); the ghost finishes a lap in 27 s (so 18 s = 67%), "Ghost is Ns ahead" = lap time ÷ 4.5; a lap is clean when the
 * formula is right and fired under 30 s (45 s = lap lost); the value shown in F2 after "Fire formula"; +20 XP per clean lap /
 * +20 pass bonus. Note: Figma's formula says A2:A9 but the sheet only draws rows 2–7 (kept as drawn).
 */
export const FORMULA_RUSH = {
  gameId: 'formula-rush',
  title: 'Skills Lab · Formula Rush',
  label: 'Formula Rush',
  subtitle: 'Excel · 6 laps · Pass 5 to earn Verified',
  skill: 'Excel',
  total: 6,
  passMark: 5,
  baseXp: 240,
  streakDays: 7,
  lapXp: 20,
  passBonusXp: 20,
  cleanUnder: 30,
  lostAt: 45,
  ghostSeconds: 27,
};

export const SHEET = {
  heads: ['', 'A · Region', 'B · Rep', 'C · Product', 'D · Units', 'E · Revenue', 'F'],
  header: ['1', 'Region', 'Rep', 'Product', 'Units', 'Revenue', ''],
  rows: [
    ['2', 'Ashanti', 'Akua', 'Shea butter', '120', 'GH₵ 3,600'],
    ['3', 'Greater Accra', 'Kofi', 'Shea butter', '95', 'GH₵ 2,850'],
    ['4', 'Ashanti', 'Yaa', 'Cocoa nibs', '60', 'GH₵ 2,400'],
    ['5', 'Northern', 'Fuseini', 'Shea butter', '140', 'GH₵ 4,200'],
    ['6', 'Volta', 'Edem', 'Cocoa nibs', '40', 'GH₵ 1,600'],
    ['7', 'Ashanti', 'Kwame', 'Kente strips', '30', 'GH₵ 2,700'],
  ],
};

// parts: fn (green =FN( token), range (blue), text (cream), comma/close (plain), slot
const fn = (t) => ({ k: 'fn', t });
const range = (t) => ({ k: 'range', t });
const text = (t) => ({ k: 'text', t });
const comma = { k: 'comma', t: ',' };
const close = { k: 'close', t: ')' };
const slot = (label) => ({ k: 'slot', t: label });

const RANGES = ['E2:E9', 'D2:D9', 'B2:B9'];

export const LAPS = [
  {
    // ⚠️ ASSUMPTION (lap 1)
    checks: ['SUM', 'Ranges'],
    topic: 'Ranges',
    title: [
      ['Total units sold, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [fn('=SUM('), slot('range'), close],
    tokens: ['D2:D9', 'E2:E9', 'A2:A9', 'COUNTIF'],
    answer: 0,
    value: '485',
    hl: [],
  },
  {
    // ⚠️ ASSUMPTION (lap 2)
    checks: ['COUNTIF', 'Ranges'],
    topic: 'COUNTIF',
    title: [
      ['How many Ashanti sales, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [fn('=COUNTIF('), range('A2:A9'), comma, slot('criteria'), close],
    tokens: ['"Ashanti"', '"Volta"', 'E2:E9', 'SUMIF'],
    answer: 0,
    value: '3',
    hl: ['A:Ashanti'],
  },
  {
    // DRAWN (lap 3, Figma SL-GS10)
    checks: ['SUMIF', 'Ranges'],
    topic: 'SUMIF',
    title: [
      ['Total revenue for Ashanti, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [
      fn('=SUMIF('),
      range('A2:A9'),
      comma,
      text('"Ashanti"'),
      comma,
      slot('sum range'),
      close,
    ],
    tokens: RANGES.concat(['COUNTIF']),
    answer: 0,
    value: 'GH₵ 8,700',
    hl: ['A:Ashanti', 'E:Ashanti'],
  },
  {
    // ⚠️ ASSUMPTION (lap 4)
    checks: ['AVERAGE', 'Ranges'],
    topic: 'AVERAGE',
    title: [
      ['Average revenue per sale, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [fn('=AVERAGE('), slot('range'), close],
    tokens: ['E2:E9', 'D2:D9', 'B2:B9', 'COUNTIF'],
    answer: 0,
    value: 'GH₵ 2,892',
    hl: [],
  },
  {
    // ⚠️ ASSUMPTION (lap 5)
    checks: ['MAX', 'Ranges'],
    topic: 'MAX',
    title: [
      ['Biggest single sale, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [fn('=MAX('), slot('range'), close],
    tokens: ['E2:E9', 'D2:D9', 'COUNTIF', 'B2:B9'],
    answer: 0,
    value: 'GH₵ 4,200',
    hl: [],
  },
  {
    // ⚠️ ASSUMPTION (lap 6)
    checks: ['SUMIF', 'Ranges'],
    topic: 'SUMIF',
    title: [
      ['Total revenue for Shea butter, ', false],
      ['fast.', true],
    ],
    prompt: 'Finish the formula in F2 before the ghost crosses the line.',
    parts: [
      fn('=SUMIF('),
      range('C2:C9'),
      comma,
      text('"Shea butter"'),
      comma,
      slot('sum range'),
      close,
    ],
    tokens: ['E2:E9', 'D2:D9', 'B2:B9', 'COUNTIF'],
    answer: 0,
    value: 'GH₵ 10,650',
    hl: ['C:Shea butter', 'E:Shea butter'],
  },
];

/* Figma seed (?f=GS10): lap 3, laps 1–2 clean, 0:18 on the clock, E2:E9 highlighted but not yet in the slot. */
export const FORMULA_FRAMES = {
  GS10: { lap: 2, results: ['ok', 'ok'], held: 0, slot: null, seconds: 18 },
};
