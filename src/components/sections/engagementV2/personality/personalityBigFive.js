/*
 * Live Personality stage on the backend Big Five bank (product decision 2026-10-23): the quiz is the server's Mini-IPIP
 * template (GET /engagement/assessments/templates, assessmentType big_five, 1–5 agree scale, answer keys stripped), scoring
 * is POST /engagement/assessments/score (the server also writes profile.personalitySnapshot), and the v2 archetype is
 * derived here, in the browser, from the five trait scores the server returns.
 * Pure functions only (no React, no assets) so they can be unit-tested in node: scratchpad/agent-pers/archetype.test.mjs.
 * personalityData.js re-exports archetypeFromBigFive.
 */

/* The 9 v2 archetypes, in the order personalityData.js lists them. */
export const ARCHETYPE_NAMES = [
  'The Architect',
  'The Builder',
  'The Connector',
  'The Visionary',
  'The Analyst',
  'The Guardian',
  'The Catalyst',
  'The Mentor',
  'The Pioneer',
];

/* ⚠️ ASSUMPTION copy (only The Architect's line is drawn in Figma). */
export const ARCHETYPE_COPY = {
  'The Architect':
    'Strategic and systematic. You plan before you build, spot risks early and like clear structure. Teams lean on you when things get complicated.',
  'The Builder':
    'Steady and dependable. You turn plans into finished work, keep your head when things get busy and see jobs through to the end.',
  'The Connector':
    'Warm and outgoing. You bring people together, keep conversations going and make teams feel like teams.',
  'The Visionary':
    'Curious and big-picture. You see where things could go and bring people along with fresh ideas.',
  'The Analyst':
    'Curious and careful. You dig into how things work, test ideas properly and like to get the details right.',
  'The Guardian':
    'Reliable and considerate. You keep standards high, look out for the people around you and make sure nothing falls through the cracks.',
  'The Catalyst':
    'Energetic and driven. You get things moving, rally people quickly and keep momentum when others slow down.',
  'The Mentor':
    'Patient and supportive. You stay calm, listen well and help the people around you grow.',
  'The Pioneer':
    'Open and unflappable. You are happy in new territory, try untested ideas and stay steady while you figure things out.',
};

/*
 * The five traits as the v2 screens show them. The backend scores Neuroticism; we show its mirror, Emotional stability
 * (100 − neuroticism percentile, or 6 − the 1–5 mean), so every bar reads "higher is more of the label".
 * `dim` = the template's question.dimension letter.
 */
export const BIG_FIVE_TRAITS = [
  {
    id: 'openness',
    dim: 'O',
    icon: 'Bulb',
    title: 'Openness',
    adjective: 'Open',
    body: 'Curiosity and new ideas',
  },
  {
    id: 'conscientiousness',
    dim: 'C',
    icon: 'Target',
    title: 'Conscientiousness',
    adjective: 'Conscientious',
    body: 'Organisation and follow-through',
  },
  {
    id: 'extraversion',
    dim: 'E',
    icon: 'Users',
    title: 'Extraversion',
    adjective: 'Outgoing',
    body: 'Energy from people and groups',
  },
  {
    id: 'agreeableness',
    dim: 'A',
    icon: 'Heart',
    title: 'Agreeableness',
    adjective: 'Cooperative',
    body: 'Empathy and cooperation',
  },
  {
    id: 'stability',
    dim: 'N',
    icon: 'Shield',
    title: 'Emotional stability',
    adjective: 'Steady',
    body: 'Staying calm under pressure',
  },
];
const TRAIT_ORDER = BIG_FIVE_TRAITS.map((t) => t.id);

export const LIKERT_LABELS = [
  'Strongly disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly agree',
];

const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
const clamp100 = (v) => Math.max(0, Math.min(100, v));

/*
 * Server scores -> { openness, conscientiousness, extraversion, agreeableness, stability } on 0–100 (null when missing),
 * plus `basis`: 'percentile' when the server sent percentiles for the traits, else 'scale' (1–5 means mapped to 0–100).
 * Accepts the score response's `scores` or a result row's `bigFiveScores` (same shape: trait means + `percentiles`).
 */
export const bigFiveLevels = (scores) => {
  const s = scores && typeof scores === 'object' ? scores : {};
  const p = s.percentiles && typeof s.percentiles === 'object' ? s.percentiles : {};
  const usePct = [
    'openness',
    'conscientiousness',
    'extraversion',
    'agreeableness',
    'neuroticism',
  ].some((k) => Number.isFinite(num(p[k])));
  const level = (key) => {
    if (usePct) {
      const v = num(p[key]);
      return Number.isFinite(v) ? clamp100(v) : null;
    }
    const m = num(s[key]);
    return Number.isFinite(m) ? clamp100(((m - 1) / 4) * 100) : null;
  };
  const neuro = level('neuroticism');
  let stability = neuro === null ? null : 100 - neuro;
  if (stability === null) {
    // A server that already reports stability (no inversion needed).
    const direct = usePct
      ? num(p.stability ?? p.emotionalStability)
      : num(s.stability ?? s.emotionalStability);
    if (Number.isFinite(direct))
      stability = usePct ? clamp100(direct) : clamp100(((direct - 1) / 4) * 100);
  }
  return {
    basis: usePct ? 'percentile' : 'scale',
    openness: level('openness'),
    conscientiousness: level('conscientiousness'),
    extraversion: level('extraversion'),
    agreeableness: level('agreeableness'),
    stability,
  };
};

/*
 * archetypeFromBigFive(scores) -> one of the 9 archetype names, or null when no trait has a score.
 *
 * Rule (deterministic): normalise each trait to 0–100 (bigFiveLevels: percentiles when the server sends them, else the
 * 1–5 mean; Neuroticism inverted to Emotional stability). Rank the five traits high to low; ties keep the fixed order
 * Openness, Conscientiousness, Extraversion, Agreeableness, Stability. The top two traits pick the archetype:
 *
 *   Openness first, Conscientiousness second ...... The Analyst     (curiosity, then rigour)
 *   Conscientiousness first, Openness second ...... The Architect   (structure, then ideas)
 *   Conscientiousness + Stability ................. The Builder
 *   Conscientiousness + Agreeableness ............. The Guardian
 *   Conscientiousness + Extraversion .............. The Catalyst
 *   Extraversion + Stability ...................... The Catalyst
 *   Extraversion + Agreeableness .................. The Connector
 *   Openness + Extraversion ....................... The Visionary
 *   Openness + Stability .......................... The Pioneer
 *   Openness + Agreeableness ...................... The Mentor
 *   Agreeableness + Stability ..................... The Mentor
 *
 * (pairs other than O/C are order-independent). Only one trait scored -> it pairs with the next in the fixed order.
 */
const PAIR_TO_ARCHETYPE = {
  'conscientiousness+stability': 'The Builder',
  'agreeableness+conscientiousness': 'The Guardian',
  'conscientiousness+extraversion': 'The Catalyst',
  'extraversion+stability': 'The Catalyst',
  'agreeableness+extraversion': 'The Connector',
  'extraversion+openness': 'The Visionary',
  'openness+stability': 'The Pioneer',
  'agreeableness+openness': 'The Mentor',
  'agreeableness+stability': 'The Mentor',
};

export const rankTraits = (levels) =>
  TRAIT_ORDER.filter((id) => levels[id] !== null && levels[id] !== undefined)
    .map((id) => ({ id, value: levels[id], i: TRAIT_ORDER.indexOf(id) }))
    .sort((a, b) => b.value - a.value || a.i - b.i);

export const archetypeFromBigFive = (scores) => {
  const ranked = rankTraits(bigFiveLevels(scores));
  if (!ranked.length) return null;
  const first = ranked[0].id;
  const second = ranked[1]?.id || TRAIT_ORDER.find((id) => id !== first);
  if (first === 'openness' && second === 'conscientiousness') return 'The Analyst';
  if (first === 'conscientiousness' && second === 'openness') return 'The Architect';
  return PAIR_TO_ARCHETYPE[[first, second].sort().join('+')];
};

/* Template -> quiz questions [{ key, dim, text }] (the bank's order). */
export const bankQuestions = (template) =>
  (template?.questions || [])
    .filter((q) => q && q.key && q.text)
    .map((q) => ({ key: String(q.key), dim: q.dimension || null, text: q.text }));

/* Answers { key: 1..5 } restricted to the bank's keys -> rawResponses for /assessments/score. */
export const toBigFiveResponses = (questions, answers) => {
  const raw = {};
  questions.forEach((q) => {
    const v = answers?.[q.key];
    if (Number.isInteger(v) && v >= 1 && v <= 5) raw[q.key] = v;
  });
  return raw;
};

/* Latest big_five row from GET /assessments/results/me -> { scores, interpretation, at } or null. */
export const latestBigFiveResult = (rows) => {
  const at = (r) => new Date(r?.completedAt || r?.createdAt || 0).getTime() || 0;
  const latest = (rows || [])
    .filter((r) => r?.assessmentType === 'big_five')
    .sort((a, b) => at(b) - at(a))[0];
  const scores = latest?.bigFiveScores || latest?.scores;
  if (!scores) return null;
  return {
    scores,
    interpretation: latest.interpretation || {},
    at: latest.completedAt || latest.createdAt || null,
  };
};

const ordinal = (n) => {
  const v = Math.round(n);
  const mod100 = v % 100;
  const suffix =
    mod100 >= 11 && mod100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[v % 10] ?? 'th');
  return `${v}${suffix}`;
};

/*
 * { scores, interpretation } + the card's person -> the view-model PersonalityResult renders (same keys as RESULT in
 * personalityData.js). Trait rows are the five real traits, highest first; labels are percentiles when the server sent
 * them, else the 1–5 average.
 */
export const buildBigFiveResultView = ({ scores, interpretation } = {}, person = {}) => {
  const levels = bigFiveLevels(scores);
  const archetype = archetypeFromBigFive(scores);
  const ranked = rankTraits(levels);
  const byId = Object.fromEntries(BIG_FIVE_TRAITS.map((t) => [t.id, t]));
  const label = (value) =>
    levels.basis === 'percentile'
      ? `${ordinal(value)} percentile`
      : `${(1 + (value / 100) * 4).toFixed(1)} / 5`;
  const short = (value) =>
    levels.basis === 'percentile' ? ordinal(value) : `${(1 + (value / 100) * 4).toFixed(1)}`;
  const traits = ranked.map(({ id, value }) => ({
    id,
    icon: byId[id].icon,
    title: byId[id].title,
    percentile: label(value),
    strong: value >= 60,
    fill: value / 100,
    body: byId[id].body,
  }));
  return {
    archetype,
    kicker: 'YOUR ARCHETYPE · 1 OF 9',
    titleLead: 'You’re ',
    titleAccent: `${archetype}.`,
    body: ARCHETYPE_COPY[archetype] || interpretation?.summary || '',
    topChips: ranked.slice(0, 3).map(({ id, value }) => `${byId[id].title} · ${short(value)}`),
    traits,
    traitsTitle: 'Your five traits',
    traitsNote:
      levels.basis === 'percentile'
        ? 'Percentile vs GTH talents who took the quiz'
        : 'Average of your answers on the 1–5 scale',
    cardChips: ranked.slice(0, 3).map(({ id }) => byId[id].adjective),
    cardName: person.name || 'You',
    cardPlace: person.place || '',
    avatar: person.photo || null,
    initials: person.initials || '',
    basis: levels.basis,
  };
};
