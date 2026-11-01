/*
 * patternPulseData — mock payload shaped like the future `GET /skills-lab/games/pattern-pulse/rounds?level=…` response:
 * eight rounds per level, each `{ rule | a+b, shown, clue, ruleText, wrong }` (see patternPulseRules.js for the rule kinds).
 * `shown` = number of beads drawn before the "?" bead; `wrong` = the three wrong choices (the right one is computed from the rule).
 *
 * DRAWN IN FIGMA (exact):
 *   Intermediate · round 4 = 2, 3, 5, 8, 12 → 17, choices 16 / 17 / 18 / 20, clue "Look at how the gaps between the beads
 *   change.", rule "The jump grows by 1 each time."                                                   (PP-01 … PP-05)
 *   Expert · round 6 = 3, 2, 6, 4, 9, 8 → 12, choices 12 / 16 / 11 / 10, title "Two patterns take turns. What comes next?",
 *   clue "Green beads follow one rule, gold beads another."            (PP-06; the frame draws no rule sentence: green +3 and
 *   gold ×2 are read off the beads)
 * ⚠️ ASSUMPTION: every other round (all of Beginner and Advanced, the other seven Intermediate / Expert rounds), its clue, its
 * rule sentence and its wrong choices are mine, written in the voice of the drawn copy and checked by `validateSpec`
 * (four unique integer choices, ≤ 7 beads, interleaved rounds always offer the other pattern's next term as a wrong choice).
 * ⚠️ ASSUMPTION: the per-question limit (28 s, Expert 30 s) is deduced from the drawn rings (18 s ≈ 64 %, 15 s ≈ 52 %,
 * 4 s ≈ 14 %, Expert 21 s ≈ 70 %); "urgent" at ≤ 5 s (drawn: "4 s" is red, 15 / 18 / 21 s are green).
 */
export const PATTERN_PULSE_ROUNDS_PER_RUN = 8;
export const PATTERN_PULSE_TIME_LIMIT = {
  beginner: 28,
  intermediate: 28,
  advanced: 28,
  expert: 30,
};
export const PATTERN_PULSE_URGENT_AT = 5;
export const PATTERN_PULSE_REVEAL_SECONDS = 3; // drawn: "Next round starts in 3 s."
export const PATTERN_PULSE_SENDING_MS = 800; // ⚠️ ASSUMPTION: mock latency of "Checking your answer…"
export const PATTERN_PULSE_BEST_SO_FAR = 82; // drawn (mock)

const GAP_CLUE = 'Look at how the gaps between the beads change.';
const TURNS_TITLE = 'Two patterns take turns. What comes next?';
const TURNS_CLUE = 'Green beads follow one rule, gold beads another.';
const STEP_CLUE = 'Look at the gap between each pair of beads.';
const DIRECTION_CLUE = 'Are the beads going up or down?';
const RATIO_CLUE = 'Compare each bead with the one before it.';
const SUM_CLUE = 'Try adding two beads together.';

export const PATTERN_PULSE_BANK = {
  beginner: [
    {
      rule: { kind: 'arithmetic', start: 1, step: 2 },
      shown: 4,
      clue: STEP_CLUE,
      ruleText: 'Each bead is 2 more than the one before.',
      wrong: [8, 10, 11],
    },
    {
      rule: { kind: 'arithmetic', start: 5, step: 5 },
      shown: 4,
      clue: STEP_CLUE,
      ruleText: 'Each bead is 5 more than the one before.',
      wrong: [24, 30, 35],
    },
    {
      rule: { kind: 'arithmetic', start: 20, step: -3 },
      shown: 4,
      clue: DIRECTION_CLUE,
      ruleText: 'Each bead is 3 less than the one before.',
      wrong: [6, 7, 9],
    },
    {
      rule: { kind: 'arithmetic', start: 2, step: 4 },
      shown: 5,
      clue: STEP_CLUE,
      ruleText: 'Each bead is 4 more than the one before.',
      wrong: [20, 24, 26],
    },
    {
      rule: { kind: 'geometric', start: 1, ratio: 2 },
      shown: 4,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is double the one before.',
      wrong: [12, 14, 18],
    },
    {
      rule: { kind: 'arithmetic', start: 100, step: -10 },
      shown: 4,
      clue: DIRECTION_CLUE,
      ruleText: 'Each bead is 10 less than the one before.',
      wrong: [50, 65, 80],
    },
    {
      rule: { kind: 'arithmetic', start: 7, step: 7 },
      shown: 4,
      clue: STEP_CLUE,
      ruleText: 'Each bead is 7 more than the one before.',
      wrong: [32, 36, 42],
    },
    {
      rule: { kind: 'growing', start: 1, step: 1, grow: 1 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The jump grows by 1 each time.',
      wrong: [15, 17, 18],
    },
  ],
  intermediate: [
    {
      rule: { kind: 'arithmetic', start: 4, step: 3 },
      shown: 5,
      clue: STEP_CLUE,
      ruleText: 'Each bead is 3 more than the one before.',
      wrong: [18, 20, 21],
    },
    {
      rule: { kind: 'geometric', start: 2, ratio: 2 },
      shown: 5,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is double the one before.',
      wrong: [48, 62, 66],
    },
    {
      rule: { kind: 'growing', start: 1, step: 2, grow: 2 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The jump grows by 2 each time.',
      wrong: [29, 30, 33],
    },
    {
      rule: { kind: 'growing', start: 2, step: 1, grow: 1 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The jump grows by 1 each time.',
      wrong: [16, 18, 20],
    },
    {
      rule: { kind: 'arithmetic', start: 50, step: -6 },
      shown: 5,
      clue: DIRECTION_CLUE,
      ruleText: 'Each bead is 6 less than the one before.',
      wrong: [18, 21, 22],
    },
    {
      rule: { kind: 'fibonacci', a: 1, b: 2 },
      shown: 5,
      clue: SUM_CLUE,
      ruleText: 'Each bead is the sum of the two before it.',
      wrong: [11, 12, 15],
    },
    {
      rule: { kind: 'power', from: 1, exp: 2 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'These are square numbers: 1×1, 2×2, 3×3…',
      wrong: [30, 35, 49],
    },
    {
      rule: { kind: 'geometric', start: 2, ratio: 3 },
      shown: 4,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is three times the one before.',
      wrong: [108, 148, 172],
    },
  ],
  advanced: [
    {
      rule: { kind: 'growing', start: 3, step: 2, grow: 2 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The jump grows by 2 each time.',
      wrong: [31, 35, 38],
    },
    {
      rule: { kind: 'geometric', start: 3, ratio: 2 },
      shown: 4,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is double the one before.',
      wrong: [36, 42, 60],
    },
    {
      rule: { kind: 'fibonacci', a: 2, b: 3 },
      shown: 5,
      clue: SUM_CLUE,
      ruleText: 'Each bead is the sum of the two before it.',
      wrong: [18, 20, 26],
    },
    {
      rule: { kind: 'power', from: 1, exp: 3 },
      shown: 4,
      clue: 'These numbers grow fast. Think of cubes.',
      ruleText: 'These are cube numbers: 1×1×1, 2×2×2, 3×3×3…',
      wrong: [100, 120, 216],
    },
    {
      rule: { kind: 'arithmetic', start: 90, step: -7 },
      shown: 5,
      clue: DIRECTION_CLUE,
      ruleText: 'Each bead is 7 less than the one before.',
      wrong: [53, 54, 56],
    },
    {
      rule: { kind: 'geometric', start: 2, ratio: 3 },
      shown: 4,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is three times the one before.',
      wrong: [108, 148, 160],
    },
    {
      rule: { kind: 'growing', start: 100, step: -2, grow: -2 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The drop grows by 2 each time.',
      wrong: [68, 72, 74],
    },
    {
      rule: { kind: 'fibonacci', a: 1, b: 3 },
      shown: 6,
      clue: SUM_CLUE,
      ruleText: 'Each bead is the sum of the two before it.',
      wrong: [25, 28, 30],
    },
  ],
  expert: [
    {
      rule: { kind: 'growing', start: 5, step: 3, grow: 3 },
      shown: 5,
      clue: GAP_CLUE,
      ruleText: 'The jump grows by 3 each time.',
      wrong: [47, 48, 53],
    },
    {
      rule: { kind: 'geometric', start: 2, ratio: 4 },
      shown: 4,
      clue: RATIO_CLUE,
      ruleText: 'Each bead is four times the one before.',
      wrong: [256, 384, 640],
    },
    {
      a: { kind: 'arithmetic', start: 1, step: 4 },
      b: { kind: 'arithmetic', start: 20, step: -3 },
      shown: 6,
      title: TURNS_TITLE,
      clue: TURNS_CLUE,
      ruleText: 'Green goes up by 4, gold goes down by 3.',
      wrong: [11, 12, 14],
    },
    {
      rule: { kind: 'fibonacci', a: 3, b: 4 },
      shown: 6,
      clue: SUM_CLUE,
      ruleText: 'Each bead is the sum of the two before it.',
      wrong: [40, 45, 48],
    },
    {
      a: { kind: 'geometric', start: 1, ratio: 2 },
      b: { kind: 'arithmetic', start: 10, step: 5 },
      shown: 6,
      title: TURNS_TITLE,
      clue: TURNS_CLUE,
      ruleText: 'Green doubles, gold goes up by 5.',
      wrong: [6, 7, 25],
    },
    {
      a: { kind: 'arithmetic', start: 3, step: 3 },
      b: { kind: 'geometric', start: 2, ratio: 2 },
      shown: 6,
      title: TURNS_TITLE,
      clue: TURNS_CLUE,
      ruleText: 'Green goes up by 3, gold doubles.',
      wrong: [16, 11, 10],
    },
    {
      a: { kind: 'growing', start: 1, step: 1, grow: 1 },
      b: { kind: 'arithmetic', start: 10, step: 10 },
      shown: 6,
      title: TURNS_TITLE,
      clue: TURNS_CLUE,
      ruleText: 'Green’s jump grows by 1, gold goes up by 10.',
      wrong: [6, 8, 40],
    },
    {
      a: { kind: 'geometric', start: 2, ratio: 3 },
      b: { kind: 'arithmetic', start: 30, step: -5 },
      shown: 6,
      title: TURNS_TITLE,
      clue: TURNS_CLUE,
      ruleText: 'Green triples, gold goes down by 5.',
      wrong: [15, 48, 60],
    },
  ],
};

/*
 * Figma frames → seeded state (`?f=PP-0x` boots exactly this, clock frozen).
 *   level, roundIndex   the drawn round (round 4 = index 3)
 *   history             the earlier rounds [['ok' | 'bad', seconds]] ('ok' seconds feed "avg 9 s")
 *   phase               thinking | sending | revealed             picked  index of the pressed choice
 *   seconds, ring       the drawn timer text and the drawn arc fraction (the live ring is seconds / limit)
 *   choices             the drawn order of the four choices
 *   answeredIn          seconds the drawn correct answer took (PP-03 "3 right · avg 9 s" keeps the average at 9)
 */
const EARLY = [
  ['ok', 9],
  ['ok', 9],
  ['bad', 28],
];
export const PATTERN_PULSE_FRAMES = {
  'PP-01': {
    level: 'intermediate',
    roundIndex: 3,
    history: EARLY,
    phase: 'thinking',
    seconds: 18,
    ring: 0.64,
    choices: [16, 17, 18, 20],
  },
  'PP-02': {
    level: 'intermediate',
    roundIndex: 3,
    history: EARLY,
    phase: 'sending',
    seconds: 15,
    ring: 0.52,
    picked: 1,
    choices: [16, 17, 18, 20],
  },
  'PP-03': {
    level: 'intermediate',
    roundIndex: 3,
    history: EARLY,
    phase: 'revealed',
    picked: 1,
    answeredIn: 9,
    choices: [16, 17, 18, 20],
  },
  'PP-04': {
    level: 'intermediate',
    roundIndex: 3,
    history: EARLY,
    phase: 'revealed',
    picked: 0,
    answeredIn: 12,
    choices: [16, 17, 18, 20],
  },
  'PP-05': {
    level: 'intermediate',
    roundIndex: 3,
    history: EARLY,
    phase: 'thinking',
    seconds: 4,
    ring: 0.14,
    choices: [16, 17, 18, 20],
  },
  'PP-06': {
    level: 'expert',
    roundIndex: 5,
    history: [
      ['ok', 14],
      ['ok', 14],
      ['ok', 14],
      ['bad', 30],
      ['ok', 14],
    ],
    phase: 'thinking',
    seconds: 21,
    ring: 0.7,
    choices: [12, 16, 11, 10],
  },
};
