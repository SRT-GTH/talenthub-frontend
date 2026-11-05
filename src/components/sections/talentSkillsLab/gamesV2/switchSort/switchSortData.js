/*
 * Switch Sort — data + pure rules (Figma "Games v2 · Switch Sort": SS-01 9619:56616 / 9619:59949, SS-02 9619:57464 / 9619:60663,
 * SS-03 9619:58318 / 9619:61383, SS-04 9619:59170 / 9619:62101). Mock payload shaped like a future
 * `GET /skills-lab/games/switch-sort/run?level=` response; nothing here talks to a server.
 *
 * Drawn (exact): Intermediate = 20 cards, 3.2 s per card; Expert = 30 cards, 2.2 s per card, no rule sign.
 * ⚠️ ASSUMPTION everywhere else, tagged below.
 */

export const SS_BASKETS = {
  left: { colour: 'red', shape: 'circle', title: 'Red · Circle', key: '← Left' },
  right: { colour: 'blue', shape: 'square', title: 'Blue · Square', key: 'Right →' },
};

export const SS_RULE_LABEL = { colour: 'COLOUR', shape: 'SHAPE' };

/* Which basket a card belongs to under a rule: reds / circles go left, blues / squares go right (drawn: "Squares go right, circles go left."). */
export const sideFor = (card, rule) => {
  if (rule === 'colour') return card.colour === 'red' ? 'left' : 'right';
  return card.shape === 'circle' ? 'left' : 'right';
};

export const cardLabel = (card) => `${card.colour === 'red' ? 'Red' : 'Blue'} ${card.shape}`;

/* ⚠️ ASSUMPTION: Beginner / Advanced numbers (only Intermediate and Expert are drawn). `ruleRun` = how many cards a rule lasts. */
export const SS_LEVELS = {
  beginner: { total: 12, perCardMs: 4500, ruleRun: [4, 6], sign: true },
  intermediate: { total: 20, perCardMs: 3200, ruleRun: [3, 6], sign: true },
  advanced: { total: 24, perCardMs: 2800, ruleRun: [3, 5], sign: true },
  expert: { total: 30, perCardMs: 2200, ruleRun: [3, 6], sign: false },
};

/* ⚠️ ASSUMPTION: how long the tick / cross stays on the basket before the next card arrives (drawn: "Next card in 0.4 s" mid-hold). */
export const SS_HOLD_MS = 800;
export const SS_TICK_MS = 100;
/* ⚠️ ASSUMPTION: dots are drawn up to 20 cards (SS-01…03), none at the 30-card Expert run (SS-04). */
export const SS_MAX_DOTS = 20;

export const ssPerCardLabel = (ms) => (ms / 1000).toFixed(1);

/* Copy (verbatim from the frames unless tagged). */
export const SS_COPY = {
  headline: 'Which basket does this card go in?',
  headlineExpert: 'Which basket? Work out the rule.',
  sub: 'Follow the rule sign. It changes without warning.',
  subExpert: 'No sign at Expert. The tick or cross tells you if the rule has changed.',
  changedShape: 'The rule just changed. Squares go right, circles go left.',
  // ⚠️ ASSUMPTION: mirror of the drawn shape sentence, for a switch back to colour.
  changedColour: 'The rule just changed. Reds go left, blues go right.',
  signHidden: 'No rule sign at Expert · work it out from the ticks',
  footerNote: 'Use ← and → on your keyboard. Dots mean red, stripes mean blue.',
  best: 'Best so far: 88',
};

const rand = (min, max, rng) => min + Math.floor(rng() * (max - min + 1));

/*
 * buildDeck — `total` cards: [{ shape, colour, rule, switched }]. The rule starts as colour and flips every few cards (⚠️ ASSUMPTION:
 * random run lengths from `ruleRun`). ~70 % of cards are "diagnostic" (red square / blue circle: the two rules disagree).
 */
export const buildDeck = (level, rng = Math.random) => {
  const cfg = SS_LEVELS[level] ?? SS_LEVELS.intermediate;
  const deck = [];
  let rule = 'colour';
  let left = rand(cfg.ruleRun[0] + 1, cfg.ruleRun[1] + 1, rng);
  for (let i = 0; i < cfg.total; i += 1) {
    let switched = false;
    if (left === 0) {
      rule = rule === 'colour' ? 'shape' : 'colour';
      left = rand(cfg.ruleRun[0], cfg.ruleRun[1], rng);
      switched = true;
    }
    left -= 1;
    const diagnostic = rng() < 0.7;
    const colour = rng() < 0.5 ? 'red' : 'blue';
    // diagnostic = colour and shape point to different baskets
    const shape = diagnostic
      ? colour === 'red'
        ? 'square'
        : 'circle'
      : colour === 'red'
        ? 'circle'
        : 'square';
    deck.push({ shape, colour, rule, switched });
  }
  return deck;
};

const answer = (correct, ms = 1400) => ({ correct, side: null, ms, afterSwitch: false });
const runOf = (pattern) => pattern.map((c) => answer(c));

/*
 * Seeds for `?f=SS-0x` — the exact Figma state, frozen. `patch` overrides cards of the deck; `overrides` carries copy that the frames
 * draw but that does not follow from the other numbers (Figma inconsistencies kept as drawn, see the report).
 */
export const SS_SEEDS = {
  'SS-01': {
    level: 'intermediate',
    answers: runOf([1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1].map(Boolean)),
    phase: 'card',
    remainingMs: 2000,
    patch: { 11: { shape: 'circle', colour: 'blue', rule: 'colour', switched: false } },
    summary: '10 right · avg 1.4 s',
  },
  'SS-02': {
    level: 'intermediate',
    answers: runOf([1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1].map(Boolean)),
    phase: 'feedback',
    remainingMs: 2000,
    holdMs: 400,
    feedback: { side: 'right', correct: true, tookMs: 1200, remainingAtPick: 2000 },
    patch: { 11: { shape: 'circle', colour: 'blue', rule: 'colour', switched: false } },
    summary: '10 right · avg 1.4 s',
  },
  'SS-03': {
    level: 'intermediate',
    answers: runOf([1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1].map(Boolean)),
    phase: 'card',
    remainingMs: 2560,
    patch: { 13: { shape: 'square', colour: 'red', rule: 'shape', switched: true } },
    summary: '10 right · avg 1.4 s',
    // Figma: the chip still says "2.0 s left" / "10 of 11 right" while the dots, caption and bar say otherwise (copied from SS-01).
    overrides: {
      statLeft: '2.0 s left',
      statRight: '10 of 11 right',
      caption: '2.6 s for this card',
    },
  },
  'SS-04': {
    level: 'expert',
    answers: runOf([...Array(21)].map((_, i) => ![3, 8, 13, 20].includes(i))),
    phase: 'feedback',
    remainingMs: 2200,
    holdMs: 440,
    feedback: { side: 'left', correct: false, tookMs: 900, remainingAtPick: 1000 },
    patch: { 20: { shape: 'circle', colour: 'blue', rule: 'colour', switched: false } },
    summary: '10 right · avg 1.4 s',
  },
};

/* Result payload for GameV2Result (contract: score 0–100, skills, summary, verifies). ⚠️ ASSUMPTION: the scoring formula. */
export const scoreRun = ({ answers, total, perCardMs }) => {
  const right = answers.filter((a) => a.correct).length;
  const accuracy = right / Math.max(1, total);
  const switchCards = answers.filter((a) => a.afterSwitch);
  const switchRight = switchCards.filter((a) => a.correct).length;
  const flexibility = switchCards.length ? switchRight / switchCards.length : accuracy;
  const avgMs = answers.reduce((s, a) => s + a.ms, 0) / Math.max(1, answers.length);
  const speed = Math.max(0, Math.min(1, 1 - avgMs / perCardMs));
  const pct = (v) => Math.round(Math.max(0, Math.min(1, v)) * 100);
  return {
    score: pct(accuracy * 0.6 + flexibility * 0.25 + speed * 0.15),
    skills: [
      { label: 'Cognitive flexibility', value: pct(flexibility) },
      { label: 'Attention to detail', value: pct(accuracy) },
      { label: 'Processing speed', value: pct(speed * 0.5 + 0.5) },
    ],
    summary: `Sorted ${right} of ${total} cards into the right basket (${switchRight} of ${switchCards.length} straight after a rule change), about ${(avgMs / 1000).toFixed(1)} s per card.`,
    verifies: 'Cognitive flexibility',
  };
};
