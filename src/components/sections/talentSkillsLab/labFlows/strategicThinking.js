import ExtLabScreen from '../labScreens/ExtLabScreen.jsx';
import { CHESS_PUZZLES } from '../labScreens/chessData.js';

/*
 * Strategic thinking lab flow — five chess puzzles (Figma SL-L18a … L18h, Playful 7851:13321 … 7851:15065 / Focused 8110:485250 …
 * 8110:486758). Drawn: Puzzle 3 "Back-rank mate" (your move with the rook on e1 selected, hint with arrow, checkmate Re8#, wrong move
 * Re7 "Not mate · 1 try left") and both results modals (topics Forks P1, Pins P2, Back-rank mates P3, Sacrifices P4, Endgames P5).
 * Board, moves and per-puzzle copy: labScreens/chessData.js (⚠️ ASSUMPTION: puzzles 1, 2, 4, 5 are invented). Rules: two wrong moves
 * and the puzzle counts as missed; "Give up and see the answer" also counts as missed (⚠️ ASSUMPTION: what happens after give-up is
 * not drawn — the board shows the answer and the puzzle is marked "to review").
 */
const QUESTIONS = CHESS_PUZZLES.map((puzzle, i) => ({
  id: `st-${i + 1}`,
  kind: 'chess',
  topic: puzzle.topic,
  options: [],
  answer: puzzle.answer,
  hint: puzzle.hint,
  explain: { right: puzzle.explain, wrong: puzzle.explain },
}));

const FRAMES = {
  L18a: {
    index: 2,
    results: ['ok', 'ok'],
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: 240,
    draft: { from: 'e1' },
  },
  L18b: {
    index: 2,
    results: ['ok', 'ok'],
    status: 'playing',
    selected: null,
    hintUsed: true,
    xp: 235,
    draft: { from: 'e1' },
  },
  L18c: {
    index: 2,
    results: ['ok', 'ok', 'ok'],
    status: 'correct',
    selected: 'e1-e8',
    hintUsed: false,
    xp: 250,
  },
  L18d: {
    index: 2,
    results: ['ok', 'ok'],
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: 240,
    draft: { from: 'e1', to: 'e7', fails: 1, shown: true },
  },
  // The results frames sit on top of Puzzle 3 with the rook on e1 selected.
  L18g: {
    index: 2,
    results: ['ok', 'ok', 'ok', 'bad', 'ok'],
    status: 'finished',
    selected: null,
    xp: 290,
    scenario: 'verified',
    draft: { from: 'e1' },
  },
  L18h: {
    index: 2,
    results: ['ok', 'bad', 'ok', 'bad', 'bad'],
    status: 'finished',
    selected: null,
    xp: 250,
    scenario: 'fail',
    draft: { from: 'e1' },
  },
};

const FRAME_RESULTS = {
  verified: {
    earned: 50,
    topics: [
      { label: 'Forks', qs: 'P1', strong: true },
      { label: 'Pins', qs: 'P2', strong: true },
      { label: 'Back-rank mates', qs: 'P3', strong: true },
      { label: 'Sacrifices', qs: 'P4', strong: false },
      { label: 'Endgames', qs: 'P5', strong: true },
    ],
    refresher: null,
  },
  fail: {
    earned: 10,
    topics: [
      { label: 'Forks', qs: 'P1', strong: true },
      { label: 'Pins', qs: 'P2', strong: false },
      { label: 'Back-rank mates', qs: 'P3', strong: true },
      { label: 'Sacrifices', qs: 'P4', strong: false },
      { label: 'Endgames', qs: 'P5', strong: false },
    ],
    refresher: null,
  },
};

// Figma draws no refresher row on either strategic thinking results modal.
const REFRESHERS = { verified: null, perfect: null, fail: null, tough: null };

const RESULT_COPY = {
  verified: {
    body: '{n} of {total} puzzles solved. {title} now carries the Verified badge on your card.',
    confetti: 'strategic-thinking:verified',
    stats: [
      { value: '{n}/{total}', label: 'SOLVED', tone: 'green' },
      { value: '+{earned} {xp}', label: 'EARNED', tone: 'gold' },
      { value: 'Verified', label: 'BADGE ADDED', tone: 'green' },
    ],
  },
  fail: {
    heading: [
      ['Good moves. ', false],
      ['Not yet.', true],
    ],
    body: '{n} of {total} solved, and you need {passMark}. Nothing changes on your card until you pass. New puzzles every retake.',
    stats: [
      { value: '{n}/{total}', label: 'SOLVED', tone: 'plain' },
      { value: '+{earned} {xp}', label: 'FOR PRACTICE', tone: 'gold' },
      { value: '{passMark}', label: 'NEEDED TO PASS', tone: 'plain' },
    ],
    actions: { secondary: 'Back to Skills Lab', primary: 'Retake with new puzzles' },
  },
};

const CONFETTI = {
  verified: [
    [531, 34, -10, '#3062d4', 0.9, '#3062d4', 0.9],
    [476, 21, 55, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [432, 30, 35, '#3062d4', 0.9, '#3062d4', 0.9],
    [457, 52, -16, '#c8951a', 0.9, '#c8951a', 0.9],
    [160, 79, 45, '#ffd86b', 0.9, '#387440', 1.0],
    [158, 116, -73, '#ffd86b', 0.9, '#387440', 1.0],
    [412, 65, 64, '#c0392b', 0.9, '#c0392b', 0.9],
    [418, 20, -39, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [437, 85, 5, '#ffd86b', 0.9, '#387440', 1.0],
    [131, 21, -68, '#387440', 1.0, '#387440', 1.0],
    [55, 87, 44, '#3062d4', 0.9, '#3062d4', 0.9],
    [111, 150, -30, '#ffd86b', 0.9, '#387440', 1.0],
    [407, 30, 5, '#3062d4', 0.9, '#3062d4', 0.9],
    [445, 82, -7, '#c8951a', 0.9, '#c8951a', 0.9],
    [111, 135, 61, '#c0392b', 0.9, '#c0392b', 0.9],
    [487, 27, -14, '#ffd86b', 0.9, '#ffd86b', 0.9],
    [392, 104, 49, '#c8951a', 0.9, '#c8951a', 0.9],
    [170, 128, -20, '#c0392b', 0.9, '#c0392b', 0.9],
    [434, 107, -67, '#3062d4', 0.9, '#3062d4', 0.9],
    [106, 97, -88, '#ffd86b', 0.9, '#387440', 1.0],
  ],
};

const summary = (results) => {
  const ok = results.filter((r) => r === 'ok').length;
  const bad = results.filter((r) => r === 'bad').length;
  return (
    [ok ? `${ok} solved` : null, bad ? `${bad} to review` : null].filter(Boolean).join(' · ') ||
    'Just started'
  );
};

export const STRATEGIC_THINKING_FLOW = {
  id: 'strategic-thinking',
  title: 'Strategic thinking',
  headerTitle: 'Skills Lab · Strategic thinking',
  subtitle: '5 puzzles · Pass 4 to earn Verified · Retake any time',
  sticker: 'PASS 4 = VERIFIED',
  total: 5,
  passMark: 4,
  hintCost: 5,
  correctXp: 10,
  // ⚠️ ASSUMPTION: starts at Puzzle 1 (the lab is not started in the hub data).
  session: { index: 0, results: [], xp: 240, streakDays: 7 },
  questions: QUESTIONS,
  frames: FRAMES,
  frameResults: FRAME_RESULTS,
  refreshers: REFRESHERS,
  resultCopy: RESULT_COPY,
  confetti: CONFETTI,
  ui: { unit: 'Puzzle', next: 'Next puzzle', last: 'See results', summary, wide: true },
  Screen: ExtLabScreen,
};

export const FLOWS = { 'strategic-thinking': STRATEGIC_THINKING_FLOW };
