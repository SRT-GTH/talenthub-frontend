/*
 * Memory Match — data + pure game logic (Figma "Games v2 · 4 … 6": GV-04 Correct, GV-05 Wrong, GV-06/07/08 dialogs over the board).
 * Everything the frames draw is exact; everything invented to make the game playable is tagged ⚠️ ASSUMPTION. The mock payloads are
 * shaped like a future `GET /skills-lab/games/memory-match/run` response.
 */

/* Levels — labels and sizes are the GV-02 level picker (Beginner 3×4 · Intermediate 4×4 · Advanced 4×5 · Expert 5×6). cols × rows. */
export const MEMORY_LEVELS = {
  beginner: { label: 'Beginner', cols: 3, rows: 4, cards: '3×4', pairs: 6 },
  intermediate: { label: 'Intermediate', cols: 4, rows: 4, cards: '4×4', pairs: 8 },
  advanced: { label: 'Advanced', cols: 4, rows: 5, cards: '4×5', pairs: 10 },
  expert: { label: 'Expert', cols: 5, rows: 6, cards: '5×6', pairs: 15 },
};

/*
 * ⚠️ ASSUMPTION — only Intermediate's clock is drawn ("1:52 left" of a 2-minute game). The other levels scale it:
 * Beginner 1:30 · Advanced 2:30 · Expert 3:30.
 */
export const MEMORY_CLOCK_SECONDS = { beginner: 90, intermediate: 120, advanced: 150, expert: 210 };

/* "Best so far: 82" (drawn in every frame of the strip; mock personal best, ⚠️ ASSUMPTION it is static). */
export const MEMORY_BEST_SO_FAR = 82;

/* The 8 drawn faces first (GV-04 … GV-08), then 7 more from the same Figma icon family (⚠️ ASSUMPTION, see MemoryMatchIcons). */
export const MEMORY_SYMBOLS = [
  'star',
  'heart',
  'bolt',
  'bulb',
  'compass',
  'trophy',
  'pin',
  'book',
  'building',
  'cash',
  'chart',
  'target',
  'repeat',
  'trend',
  'grid',
];
export const MEMORY_SYMBOL_NAMES = {
  star: 'Star',
  heart: 'Heart',
  bolt: 'Bolt',
  bulb: 'Light bulb',
  compass: 'Compass',
  trophy: 'Trophy',
  pin: 'Map pin',
  book: 'Book',
  building: 'Building',
  cash: 'Cash',
  chart: 'Chart',
  target: 'Target',
  repeat: 'Repeat',
  trend: 'Trend',
  grid: 'Grid',
};

/* Copy — verbatim from the frames. */
export const MEMORY_COPY = {
  name: 'Memory Match',
  title: 'Find every pair.',
  prompt: 'Turn two cards at a time. Fewer turns and less time score higher.',
  measures: ['Working memory', 'Attention to detail', 'Processing speed'],
  pairFeedback: 'Nice — that’s a pair.',
  missFeedback: 'Not a match. Try to remember where they were.',
  faceDown: 'GTH',
};

/* Card states: down (GTH back) · up (turned, waiting for its partner) · pair (just matched, white) · wrong · found (matched, light green). */

/*
 * Seeds — the drawn boards. Each row is the 4 cards left to right: [symbol, state]. GV-04 / GV-05 / GV-06-08 are 4×4 intermediate.
 * In the frames the light "matched" faces are 12 (six pairs) but the pin and the book show once (r4c1, r4c4) while their
 * partners are still face down — a Figma inconsistency kept as drawn; playing on is handled by `flipCard` (a hidden card whose
 * twin is a lone `found` face is matched on its own).
 */
const row = (...cells) => cells;
export const MEMORY_SEEDS = {
  'GV-04': {
    seconds: 112,
    turns: 11,
    pairsFound: 6,
    feedback: 'pair',
    cards: [
      row(['star', 'found'], ['heart', 'pair'], ['bolt', 'found'], ['bulb', 'found']),
      row(['heart', 'pair'], ['star', 'found'], ['compass', 'found'], ['bolt', 'found']),
      row(['trophy', 'found'], ['compass', 'found'], ['bulb', 'found'], ['pin', 'down']),
      row(['pin', 'found'], ['trophy', 'found'], ['book', 'down'], ['book', 'found']),
    ],
  },
  'GV-05': {
    seconds: 112,
    turns: 11,
    pairsFound: 6,
    feedback: 'wrong',
    cards: [
      row(['star', 'found'], ['heart', 'wrong'], ['bolt', 'found'], ['bulb', 'found']),
      row(['heart', 'down'], ['star', 'found'], ['compass', 'found'], ['bolt', 'found']),
      row(['trophy', 'found'], ['compass', 'found'], ['bulb', 'found'], ['book', 'wrong']),
      row(['pin', 'found'], ['trophy', 'found'], ['pin', 'down'], ['book', 'found']),
    ],
  },
  /* GV-06 / GV-07 / GV-08 draw the same board: four face-down cards, no feedback pill. */
  'GV-06': {
    seconds: 112,
    turns: 11,
    pairsFound: 6,
    feedback: null,
    cards: [
      row(['star', 'found'], ['heart', 'down'], ['bolt', 'found'], ['bulb', 'found']),
      row(['heart', 'down'], ['star', 'found'], ['compass', 'found'], ['bolt', 'found']),
      row(['trophy', 'found'], ['compass', 'found'], ['bulb', 'found'], ['pin', 'down']),
      row(['pin', 'found'], ['trophy', 'found'], ['book', 'down'], ['book', 'found']),
    ],
  },
};
MEMORY_SEEDS['GV-07'] = { ...MEMORY_SEEDS['GV-06'], seconds: 0 };
MEMORY_SEEDS['GV-08'] = { ...MEMORY_SEEDS['GV-06'] };

/* The result strip drawn for GV-10 / GV-11 ("8 of 8 pairs" · "14 turns · 2:31", Best so far). */
export const MEMORY_DRAWN_RESULT = { found: 8, pairs: 8, turns: 14, time: '2:31' };

/* ---------- game logic (pure) ---------- */

const shuffle = (list, rand = Math.random) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* A fresh board for a level: `pairs` symbols twice, shuffled. Card = { id, sym, state }. */
export const dealBoard = (levelId, rand = Math.random) => {
  const level = MEMORY_LEVELS[levelId] ?? MEMORY_LEVELS.intermediate;
  const syms = MEMORY_SYMBOLS.slice(0, level.pairs);
  return shuffle([...syms, ...syms], rand).map((sym, id) => ({ id, sym, state: 'down' }));
};

export const boardFromSeed = (seed) =>
  seed.cards.flat().map(([sym, state], id) => ({ id, sym, state }));

export const countFoundCards = (cards) => cards.filter((c) => c.state === 'found').length;
/* pairs shown in the counter: found faces / 2 (a just-matched `pair` settles into `found` first, as GV-04 draws "6 of 8"). */
export const pairsFound = (cards) => Math.floor(countFoundCards(cards) / 2);
export const isComplete = (cards) =>
  cards.every((c) => c.state === 'found' || c.state === 'pair') &&
  cards.some((c) => c.state === 'pair' || c.state === 'found');

/* Settle `pair` cards into `found` (called before the next flip, or after a short delay). */
export const settlePairs = (cards) =>
  cards.map((c) => (c.state === 'pair' ? { ...c, state: 'found' } : c));
/* Wrong cards turn back face down. */
export const clearWrong = (cards) =>
  cards.map((c) => (c.state === 'wrong' ? { ...c, state: 'down' } : c));

/*
 * flipCard — one tap. Returns { cards, turn, outcome } where outcome ∈ null | 'pair' | 'wrong' (the feedback pill).
 *   • first card of a turn → `up`
 *   • second card → `pair` when the symbols match (a hidden card whose twin is a lone found face matches on its own), else both `wrong`
 */
export const flipCard = (cards, id) => {
  const card = cards[id];
  if (!card || card.state !== 'down') return { cards, turn: false, outcome: null };
  let next = clearWrong(settlePairs(cards));
  const up = next.find((c) => c.state === 'up');
  if (!up) {
    const lone = next.filter((c) => c.state === 'found' && c.sym === card.sym).length % 2 === 1;
    if (lone) {
      next = next.map((c) => (c.id === id ? { ...c, state: 'pair' } : c));
      return { cards: next, turn: true, outcome: 'pair' };
    }
    return {
      cards: next.map((c) => (c.id === id ? { ...c, state: 'up' } : c)),
      turn: false,
      outcome: null,
    };
  }
  const match = up.sym === card.sym;
  const state = match ? 'pair' : 'wrong';
  next = next.map((c) => (c.id === id || c.id === up.id ? { ...c, state } : c));
  return { cards: next, turn: true, outcome: match ? 'pair' : 'wrong' };
};

/*
 * ⚠️ ASSUMPTION — scoring (not drawn): working memory = completion × turn efficiency; attention to detail = completion × (1 − mistakes);
 * processing speed = completion × time left; score = 40 / 30 / 30 of those. Fits the drawn card (82 = 85 / 80 / 77 is a mock).
 */
export const scoreRun = ({ found, pairs, turns, secondsLeft, totalSeconds }) => {
  const completion = pairs ? found / pairs : 0;
  const efficiency = turns ? Math.min(1, found / turns) : 0;
  const mistakes = Math.max(0, turns - found);
  const accuracy = 1 - Math.min(0.6, mistakes / Math.max(1, pairs * 3));
  const timeLeft = totalSeconds ? Math.max(0, secondsLeft) / totalSeconds : 0;
  const workingMemory = Math.round(100 * completion * (0.4 + 0.6 * efficiency));
  const attention = Math.round(100 * completion * accuracy);
  const speed = Math.round(100 * completion * (0.4 + 0.6 * timeLeft));
  const score = Math.round(0.4 * workingMemory + 0.3 * attention + 0.3 * speed);
  return { score, workingMemory, attention, speed };
};

export const buildResult = ({ found, pairs, turns, secondsLeft, totalSeconds }) => {
  const s = scoreRun({ found, pairs, turns, secondsLeft, totalSeconds });
  const used = Math.max(0, totalSeconds - secondsLeft);
  return {
    score: s.score,
    skills: [
      { label: 'Working memory', value: s.workingMemory },
      { label: 'Attention to detail', value: s.attention },
      { label: 'Processing speed', value: s.speed },
    ],
    summary:
      found >= pairs
        ? `Found all ${pairs} pairs in ${turns} turns (fewest possible: ${pairs}).`
        : `Found ${found} of ${pairs} pairs in ${turns} turns before time ran out.`,
    verifies: 'Working memory',
    /* extra keys (stored as-is by finish): the result strip above the card reads them. */
    run: { found, pairs, turns, seconds: used },
  };
};
