/*
 * Talent My Assessment — mock data (frontend-only; shaped like the API payloads so it can be swapped for fetch calls).
 * One `/* ---- <area> ---- *\/` block per section agent. Re-read the file before editing and only touch your own block.
 * Figma canvas "Talent My Assessment" 7962:530. Frame -> URL table: wiki/talent-assessment.md.
 */

/* ---- full ---- */
/*
 * Full TypeScript assessment (MA-04 intro · MA-05 question 12 · MA-06 passed · MA-10 not passed · MA-11 connection lost ·
 * MA-12 time is up · MA-13 leave confirmation). API shape: GET /assessments/:skillId (meta + questions) ·
 * POST /assessments/:skillId/attempts (start) · PUT /attempts/:id/answers · POST /attempts/:id/submit -> result.
 *
 * Tokens in strings: {xp} -> "XP" in Playful, "pts" in Focused (Figma swaps the word); {n}, {score}, {top}, {earned}, {date}.
 *
 * CONTENT RULE: only what a frame draws is real. Everything below tagged ⚠️ ASSUMPTION was invented to make the flow
 * playable end to end and must be replaced by the real content/API:
 *   ⚠️ ASSUMPTION  questions 1-11 and 13-24: the Figma draws ONE question (Q12, "Types and generics"); the other 23 are
 *                  short invented TypeScript questions (3 per topic, cycled) so the 25-question run can be played.
 *   ⚠️ ASSUMPTION  question 25: Figma labels it "QUESTION 25 · REAL-WORLD FIX" but re-uses the Q12 body, so the bank does too.
 *   ⚠️ ASSUMPTION  which topic each question number belongs to (only Q12 = Types and generics and Q25 = Real-world fix are
 *                  drawn; the 8/6/6/5 split is the drawn "What it covers" counts, the interleaving is invented).
 *   ⚠️ ASSUMPTION  scoring: score = correct / 25 x 100 (rounded); pass at 70; "Strong" topic = 70% or more right;
 *                  "Top N%" = 100 - score; +40 XP on pass, +20 XP for practice; hint = -5 XP and removes one wrong answer.
 *                  Figma's own numbers do not follow one rule (82 with 20 of 25 right, 58 with 14 of 25), so the frame
 *                  seeds below carry the drawn numbers verbatim and only a real run uses the rule above.
 *   ⚠️ ASSUMPTION  "Next question" stays disabled until an answer is picked; the last question says "Submit answers".
 *   ⚠️ ASSUMPTION  total time 20:00; the clock pauses while offline and the 30-minute resume window counts down; if it
 *                  runs out the run is scored like a time-up. Leaving keeps the clock running (drawn copy).
 *   ⚠️ ASSUMPTION  "Scoring your answers" bar fills over 5 seconds ("About 5 seconds" is drawn, the fill animation is not).
 *   ⚠️ ASSUMPTION  "Practise first" and "Practise in Skills Lab" go to /skills-lab, "Open" (refresher) to /learning,
 *                  "See it on my card" to /profile; "Start assessment" goes to ?step=play on the same URL.
 *   ⚠️ ASSUMPTION  the question navigator is keyboard only (no control is drawn): arrow keys move between answered
 *                  questions, 1-4 / A-D pick an answer, Enter = next.
 */
export const FULL_ASSESSMENT_TYPESCRIPT = {
  id: 'typescript',
  title: 'TypeScript',
  headerTitle: 'Assessment · TypeScript',
  total: 25,
  passMark: 70,
  totalSeconds: 20 * 60,
  resumeWindowSeconds: 30 * 60,
  retakeDays: 30,
  hintCost: 5,
  passXp: 40,
  practiceXp: 20,
  startXp: 240,
  streakDays: 7,
  subtitle: '25 questions · About 20 min · Score 70+ to earn Assessment-evidenced',
  // MA-04 intro (Playful 7968:9939 / Focused 8110:31895).
  intro: {
    back: 'My Assessment',
    title: 'TypeScript assessment',
    sticker: 'Biggest boost',
    lede: 'The strongest proof on GTH. Pass it and TypeScript moves from Self-reported to Assessment-evidenced.',
    stats: [
      { value: '25', label: 'questions' },
      { value: '~20 min', label: 'timed' },
      { value: '70 / 100', label: 'to pass' },
      { value: '+40 {xp}', label: 'on pass' },
    ],
    coversTitle: 'What it covers',
    topics: [
      {
        id: 'types',
        label: 'Types and generics',
        blurb: 'Read code, pick the exact type',
        count: 8,
      },
      {
        id: 'narrowing',
        label: 'Narrowing and unions',
        blurb: 'Spot what the compiler allows',
        count: 6,
      },
      {
        id: 'async',
        label: 'Async and errors',
        blurb: 'Promises, try/catch, typed errors',
        count: 6,
      },
      { id: 'real', label: 'Real-world fix', blurb: 'Debug a small Next.js component', count: 5 },
    ],
    rulesTitle: 'Before you start',
    rules: [
      {
        icon: 'clock',
        title: 'One sitting',
        text: 'The timer keeps running if you leave the tab.',
      },
      {
        icon: 'wifi',
        title: 'Stable connection',
        text: 'Answers save after every question. If you drop, you can pick up within 30 minutes.',
      },
      {
        icon: 'book',
        title: 'Open book is fine',
        text: 'You can check docs. Copy-pasting the question into AI tools is not allowed.',
      },
      {
        icon: 'refresh',
        title: 'One retake every 30 days',
        text: 'Only your best score shows to recruiters.',
      },
    ],
    start: {
      title: 'Ready when you are',
      body: 'Pick a quiet 20 minutes. You can practise first with Bug Hunt or the Python lab.',
      primary: 'Start assessment',
      secondary: 'Practise first',
    },
    card: {
      title: 'What changes on your card',
      nowLabel: 'Now',
      now: 'Self-reported',
      afterLabel: 'After you pass',
      after: 'Assessment-evidenced',
      note: 'TypeScript is in 64% of the frontend roles you match. Passing closes your top readiness gap.',
    },
  },
  // Header / progress copy while playing and when finished.
  copy: {
    countLabel: 'Question {n} of {total}',
    summary: '{answered} answered · {left} left',
    timedSticker: 'TIMED · {left} LEFT',
    passMark: 'Pass mark: 70 / 100',
    doneLabel: 'All {total} done',
    doneSummary: '{correct} correct · {review} to review',
    doneSubtitle: '25 questions · Completed in {min} min',
    stickerPass: 'COMPLETE',
    stickerFail: 'NOT YET',
    hintPrompt: 'Stuck?',
    hintLink: 'Use a hint (−{cost} {xp})',
    hintUsed: 'Hint used', // ⚠️ ASSUMPTION (borrowed from the Skills Lab frames)
    next: 'Next question',
    submit: 'Submit answers', // ⚠️ ASSUMPTION
    checkDisabled: 'Check answer', // drawn on MA-06 / MA-10 behind the results modal
    eyebrow: 'QUESTION {n} · {topic}',
  },
  resume: {
    // MA-11 (Playful 7985:10960 / Focused 8110:34831)
    title: 'You dropped off. No stress.',
    body: 'Your {answered} answers are saved. The clock paused at {left} when the connection dropped. Pick up within 30 minutes to continue.',
    window: 'Resume window: {window} left',
    secondary: 'Save and exit',
    primary: 'Resume question {n}',
  },
  timeUp: {
    // MA-12 (Playful 7985:11131 / Focused 8110:34982)
    title: "Time's up.",
    body: 'You answered {answered} of 25. Unanswered questions count as wrong, and we are scoring the rest now.',
    progress: 'Scoring your answers',
    eta: 'About 5 seconds',
    primary: 'See my result',
  },
  leave: {
    // MA-13 (Playful 7985:11291 / Focused 8110:35134)
    title: 'Leave the assessment?',
    body: 'The timer keeps running while you are away. If you do not return before it ends, we score the questions you answered.',
    secondary: 'Leave anyway',
    primary: 'Keep going',
  },
  // Results modals, LabResultsDialog view-model shape. MA-06 (Playful 7968:326977 / Focused 8110:32506), MA-10 (7985:10712 / 8110:34614).
  results: {
    pass: {
      id: 'pass',
      tone: 'pass',
      medallion: 'check',
      sticker: 'EVIDENCED',
      confetti: 'verified',
      eyebrow: 'ASSESSMENT PASSED',
      heading: [
        ['TypeScript ', false],
        ['evidenced.', true],
      ],
      body: 'You scored {score} / 100. TypeScript now carries the strongest label on GTH and moves you up in recruiter search.',
      stats: [
        { value: '{score}/100', label: 'SCORE', tone: 'green' },
        { value: '+{earned} {xp}', label: 'EARNED', tone: 'gold' },
        { value: 'Top {top}%', label: 'OF GTH TALENTS', tone: 'green' },
      ],
      refresher: {
        title: 'Brush up on typed React props',
        sub: 'Free 15-min refresher in My Learning',
        cta: 'Open',
      },
      actions: { secondary: 'Back to My Assessment', primary: 'See it on my card' },
    },
    fail: {
      id: 'fail',
      tone: 'retry',
      medallion: 'refresh',
      sticker: 'RETAKE IN 30 DAYS',
      confetti: null,
      eyebrow: 'NOT EVIDENCED YET',
      heading: [['So close.', false]],
      body: 'You scored {score} and need 70. Nothing changes on your card. TypeScript stays Self-reported, and you can retake from {date}.',
      stats: [
        { value: '{score}/100', label: 'SCORE', tone: 'plain' },
        { value: '+{earned} {xp}', label: 'FOR PRACTICE', tone: 'gold' },
        { value: '70', label: 'NEEDED TO PASS', tone: 'plain' },
      ],
      refresher: {
        title: 'Practise first: TypeScript generics in 15 min',
        sub: 'My Learning · free · then try Bug Hunt',
        cta: 'Open',
      },
      actions: { secondary: 'Back to My Assessment', primary: 'Practise in Skills Lab' },
    },
  },
};

// Topic rows as drawn in the two results frames (the real run derives them from the answers).
export const FULL_FRAME_TOPICS = {
  pass: [
    { id: 'types', label: 'Types and generics', qs: '7 of 8', strong: true },
    { id: 'narrowing', label: 'Narrowing and unions', qs: '5 of 6', strong: true },
    { id: 'async', label: 'Async and errors', qs: '5 of 6', strong: true },
    { id: 'real', label: 'Real-world fix', qs: '3 of 5', strong: false },
  ],
  fail: [
    { id: 'types', label: 'Types and generics', qs: '6 of 8', strong: true },
    { id: 'narrowing', label: 'Narrowing and unions', qs: '3 of 6', strong: false },
    { id: 'async', label: 'Async and errors', qs: '2 of 6', strong: false },
    { id: 'real', label: 'Real-world fix', qs: '3 of 5', strong: false },
  ],
};
// MA-10 draws 8 answer dots (the modal is a copy of the Skills Lab one); a real run draws one dot per question.
export const FULL_FRAME_DOTS_FAIL = ['ok', 'ok', 'bad', 'ok', 'bad', 'bad', 'ok', 'bad'];

export const FULL_TOPIC_LABELS = {
  types: 'Types and generics',
  narrowing: 'Narrowing and unions',
  async: 'Async and errors',
  real: 'Real-world fix',
};

// Topic of each question number (⚠️ ASSUMPTION except Q12 / Q25), 8 / 6 / 6 / 5 like the drawn counts.
// prettier-ignore
const TOPIC_SEQUENCE = [
  'narrowing', 'types', 'async', 'types', 'narrowing', 'types', 'async', 'types', 'narrowing', 'async',
  'types', 'types', 'narrowing', 'async', 'types', 'real', 'narrowing', 'async', 'types', 'real',
  'async', 'real', 'narrowing', 'real', 'real',
];

const Q12_BODY = {
  title: [
    ['What type does this function ', false],
    ['return?', true],
  ],
  prompt: 'Read the code, then pick the exact return type.',
  code: [
    'function firstOr<T>(items: T[], fallback: T) {',
    '  return items.length ? items[0] : fallback;',
    '}',
  ],
  options: ['T | undefined', 'T', 'any', 'T[]'],
  answer: 1,
};

// ⚠️ ASSUMPTION: every entry except Q12_BODY (drawn) is invented. Shape: { title, prompt, code[], options[4], answer }.
const mk = (title, code, options, answer) => ({
  title: [[title, false]],
  prompt: 'Read the code, then pick the exact answer.',
  code,
  options,
  answer,
});
/* prettier-ignore */
const INVENTED = {
  types: [
    mk('What is the type of first?', ['const ids = [1, 2, 3];', 'const first = ids[0];'], ['number', 'number[]', 'any', 'undefined'], 0),
    mk('What type does wrap(5) return?', ['function wrap<T>(value: T) {', '  return { value };', '}'], ['{ value: number }', '{ value: T }', 'number', '{ value: any }'], 0),
    mk('What is the type of p[1]?', ['type Pair<A, B> = [A, B];', "const p: Pair<string, number> = ['a', 1];"], ['string', 'number', 'A', 'B'], 1),
  ],
  narrowing: [
    mk('What type does len return?', ['function len(x: string | number) {', "  if (typeof x === 'string') return x.length;", '  return x;', '}'], ['number', 'string | number', 'string', 'any'], 0),
    mk('What is s inside the if?', ["type Shape = { kind: 'a' } | { kind: 'b' };", 'function f(s: Shape) {', "  if (s.kind === 'a') {", '    s;', '  }', '}'], ["{ kind: 'a' }", 'Shape', "{ kind: 'b' }", 'never'], 0),
    mk('What is the type of n?', ['const v: string | null = getName();', "const n = v ?? 'guest';"], ['string', 'string | null', 'null', "'guest'"], 0),
  ],
  async: [
    mk('What type does load() return?', ['async function load() {', '  return 42;', '}'], ['number', 'Promise<number>', 'Promise<void>', '42'], 1),
    mk('With strict settings, what is the type of err?', ['try {', '  JSON.parse(text);', '} catch (err) {', '  console.log(err);', '}'], ['unknown', 'Error', 'string', 'any'], 0),
    mk('What is the type of b?', ['const [a, b] = await Promise.all([', '  fetchNum(),', '  fetchStr(),', ']);'], ['string', 'Promise<string>', 'number | string', 'unknown'], 0),
  ],
  real: [
    mk('Which change fixes the compiler error?', ['function Card({ title }: { title?: string }) {', '  return <h2>{title.toUpperCase()}</h2>;', '}'], ['{title?.toUpperCase()}', '{title as number}', '{title: string}', '{toUpperCase(title)}'], 0),
    mk('Which line types the state correctly?', ['const [items, setItems] = useState([]);', "setItems(['a']);"], ['useState<string[]>([])', 'useState(string[])', 'useState<string>([])', 'useState([]: string)'], 0),
    mk('How do you fix "el is possibly null"?', ["const el = document.getElementById('root');", 'el.focus();'], ['el?.focus();', 'el!!.focus;', 'el: null', 'el as number'], 0),
  ],
};

// The 25 questions in play order: [{ n, topic, title, prompt, code, options, answer }].
export const FULL_TYPESCRIPT_QUESTIONS = (() => {
  const used = { types: 0, narrowing: 0, async: 0, real: 0 };
  return TOPIC_SEQUENCE.map((topic, i) => {
    const n = i + 1;
    if (n === 12 || n === 25) return { n, topic, ...Q12_BODY };
    const pool = INVENTED[topic];
    const body = pool[used[topic] % pool.length];
    used[topic] += 1;
    return { n, topic, ...body };
  });
})();

/*
 * ?f=<code> seeds. Every frame draws question 12 with answer B picked, 11 answers saved and 18:20 on the clock (1100 s).
 * `committed` (answers to questions 1-11) is ⚠️ ASSUMPTION: not visible anywhere, only the count (11) is drawn.
 * `frozen`: the clock holds still until the first click / key press so the frame can be compared with Figma.
 */
const PLAY_SEED = {
  screen: 'play',
  index: 11,
  committed: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  pending: 1,
  secondsLeft: 1100,
  xp: 240,
  frozen: true,
};
export const FULL_FRAMES = {
  'MA-04': { screen: 'intro' },
  'MA-05': { ...PLAY_SEED },
  'MA-06': {
    screen: 'play',
    phase: 'finished',
    outcome: 'pass',
    score: 82,
    correct: 20,
    xp: 320,
    elapsedMin: 17,
    frozen: true,
  },
  'MA-10': {
    screen: 'play',
    phase: 'finished',
    outcome: 'fail',
    score: 58,
    correct: 14,
    xp: 320,
    elapsedMin: 17,
    retakeFrom: '14 Nov',
    frozen: true,
  },
  'MA-11': { ...PLAY_SEED, dialog: 'resume', resumeLeft: 27 * 60 + 41 },
  // The modal says "22 of 25" while the page behind it says "11 answered": Figma inconsistency, both kept as drawn.
  'MA-12': { ...PLAY_SEED, dialog: 'timeup', answeredOverride: 22, scoringPct: 60 },
  'MA-13': { ...PLAY_SEED, dialog: 'leave' },
};

export const getFullAssessment = (skillId) =>
  skillId === 'typescript' ? FULL_ASSESSMENT_TYPESCRIPT : null;

/* ---- details ---- */
/*
 * My Assessment details + library mock data (Figma "Talent My Assessment" 7962:530): MA-02 Personality detail
 * (Playful 7965:326919 / Focused 8110:30568), MA-03 Skill evidence · Python (7967:9820 / 8110:30892), MA-03b Skill evidence ·
 * Firebase, self-reported (7987:10602 / 8110:35142), MA-09 Assessments library (7984:10325 / 8110:34137) and the HP Help pop-over
 * copy (8376:503889 / 8376:504009). Every string is verbatim from the Figma `characters`, including the ones that read oddly
 * ("72th percentile", "41th percentile": Figma inconsistency, kept verbatim). Shaped like the API responses they stand in for:
 *   GET /assessment/personality          -> PERSONALITY_DETAIL
 *   GET /assessment/skills/:skillId      -> SKILL_EVIDENCE[skillId]   (getSkillEvidence)
 *   GET /assessment/library              -> ASSESSMENT_LIBRARY
 * Tone / state keys are semantic (the components map them to colours per UI style):
 *   trait.tone    green | amber | grey      chip tones: soft | neutral | dark   mini tones: strong | review | done | here | next
 * ⚠️ ASSUMPTION markers below are things Figma does not draw (destinations, tab contents).
 */
export const PERSONALITY_DETAIL = {
  back: { label: 'My Assessment', to: '/my-assessment' },
  title: 'Your personality',
  subtitle:
    'Measured on 14 Oct through the Personality quiz. Recruiters see your archetype and trait scores, never your answers.',
  // The Retake button is the cooldown pop-up trigger (MA-08, ?modal=retake on the overview).
  retake: { label: 'Retake in 72 days', to: '?modal=retake' },
  archetype: {
    eyebrow: '1 OF 9 ARCHETYPES',
    lead: "You're ",
    name: 'The Architect.',
    icon: 'compass',
    summary:
      'You plan before you build, spot risks early and like clear structure. Teams lean on you when things get complicated.',
    affinityLabel: 'Career affinity',
    affinity: ['Technology', 'Fintech', 'Product', 'Systems design', 'Research'],
  },
  measured: {
    title: 'How it was measured',
    rows: [
      { icon: 'list-bullet', text: 'Personality quiz · 15 scenarios' },
      { icon: 'calendar', text: '14 Oct 2026' },
      { icon: 'refresh', text: 'Retake from 25 Dec' },
    ],
    // ⚠️ ASSUMPTION: destination (Skills Lab hub) is not drawn; the prototype link target is not in the frame.
    link: { label: 'Prefer games? Play 3 to update', to: '/skills-lab' },
  },
  traits: {
    title: 'Your six traits',
    chip: 'Compared with 12,400 GTH talents',
    // `percentile` drives the bar fill; `percentileLabel` is the verbatim Figma text. In Figma every bar is drawn at the
    // same 88% (the component's default fill was never overridden), so the fill here follows the percentile instead.
    items: [
      {
        id: 'conscientiousness',
        name: 'Conscientiousness',
        percentile: 88,
        percentileLabel: '88th percentile',
        text: 'Organised and follows through. You finish what you start.',
        level: 'Strong',
        tone: 'green',
      },
      {
        id: 'decisiveness',
        name: 'Decisiveness',
        percentile: 79,
        percentileLabel: '79th percentile',
        text: 'You make calls with what you know and adjust later.',
        level: 'Strong',
        tone: 'green',
      },
      {
        id: 'openness',
        name: 'Openness',
        percentile: 72,
        percentileLabel: '72th percentile',
        text: 'Curious about new ideas and comfortable with change.',
        level: 'Above average',
        tone: 'green',
      },
      {
        id: 'emotional-stability',
        name: 'Emotional stability',
        percentile: 70,
        percentileLabel: '70th percentile',
        text: 'Calm under pressure, especially near deadlines.',
        level: 'Above average',
        tone: 'green',
      },
      {
        id: 'agreeableness',
        name: 'Agreeableness',
        percentile: 64,
        percentileLabel: '64th percentile',
        text: 'Cooperative, though you will push back when it matters.',
        level: 'Balanced',
        tone: 'amber',
      },
      {
        id: 'extraversion',
        name: 'Extraversion',
        percentile: 41,
        percentileLabel: '41th percentile',
        text: 'You recharge alone and prefer small groups.',
        level: 'Reserved',
        tone: 'grey',
      },
    ],
  },
  bestWork: {
    title: 'Where you do your best work',
    rows: [
      { icon: 'check', text: 'Clear goals and a plan you helped shape' },
      { icon: 'check', text: 'Small, focused teams' },
      { icon: 'check', text: 'Roles where you own a system end to end' },
      { icon: 'alert', text: 'Watch out: very fast pivots without context can drain you' },
    ],
  },
  recruiters: {
    title: 'What recruiters see',
    rows: [
      { label: 'Archetype', chip: 'The Architect', tone: 'soft', icon: 'eye' },
      { label: 'Six trait scores', chip: 'Percentiles only', tone: 'soft', icon: 'eye' },
      { label: 'Your answers', chip: 'Never shared', tone: 'neutral', icon: 'lock' },
    ],
    note: 'Results are system-generated and cannot be edited. You can retake every 90 days.',
  },
};

/* Skill chips shared by "Other skills" (Figma lists the same five on both frames, Firebase included on the Firebase page). */
const OTHER_SKILLS = [
  { id: 'react', label: 'React' },
  { id: 'data-analytics', label: 'Data Analytics' },
  { id: 'figma', label: 'Figma' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'firebase', label: 'Firebase' },
];

/*
 * Skill evidence payloads. `ladder.rungs[].state`: done | current | next (a rung chip is free text: Done · You are here · Next ·
 * Quickest). `attempts.rows[].to` is the row's destination when Figma implies one (the chevron);
 * ⚠️ ASSUMPTION: Python Lab -> its lab page and Bug Hunt -> its game page (existing Skills Lab routes); the Career Buddy chat
 * row has no destination in the vault, so it is a button. `startTo` is where "Take the … assessment" goes:
 * ⚠️ ASSUMPTION: only the TypeScript full flow is drawn, so every start button opens it.
 */
export const SKILL_EVIDENCE = {
  python: {
    id: 'python',
    back: { label: 'My Assessment · Skills evidence', to: '/my-assessment' },
    title: 'Python',
    badge: { label: 'Game-evidenced', tone: 'soft', icon: 'check-circle-fill' },
    subtitle: 'Intermediate · 1 year · Verified on 12 May through Python Lab (84/100).',
    cta: { label: 'Take the Python assessment', to: '/my-assessment/full/typescript' },
    ladder: {
      title: 'How strong is your Python evidence?',
      step: 'Step 3 of 4',
      rungs: [
        {
          id: 'self',
          icon: 'edit',
          title: 'Self-reported',
          sub: 'Added by you',
          state: 'done',
          chip: 'Done',
        },
        {
          id: 'ai',
          icon: 'chat',
          title: 'AI-validated in chat',
          sub: 'Checked by Career Buddy · 3 Apr',
          state: 'done',
          chip: 'Done',
        },
        {
          id: 'game',
          icon: 'check-circle',
          title: 'Game-evidenced',
          sub: 'Python Lab 84/100 · 12 May',
          state: 'current',
          chip: 'You are here',
        },
        {
          id: 'assessment',
          icon: 'shield',
          title: 'Assessment-evidenced',
          sub: 'Take the 20-min assessment',
          state: 'next',
          chip: 'Next',
        },
      ],
      tip: 'Assessment-evidenced skills appear first in recruiter search. For Python this would move you into the top 15% of junior developers in Accra.',
      tipStyle: 'muted',
    },
    attempts: {
      title: 'Every attempt',
      note: 'Only your best result shows to recruiters. Failed attempts never appear on your card.',
      rows: [
        {
          id: 'python-lab-84',
          date: '12 May',
          title: 'Python Lab',
          sub: '84 / 100 · 7 of 8 correct',
          chip: { label: 'Verified', tone: 'dark' },
          to: '/skills-lab/lab/python',
        },
        {
          id: 'bug-hunt',
          date: '2 May',
          title: 'Bug Hunt (game)',
          sub: '7 of 8 bugs squashed',
          chip: { label: 'Verified', tone: 'soft' },
          to: '/skills-lab/games/bug-hunt',
        },
        {
          id: 'python-lab-5',
          date: '20 Apr',
          title: 'Python Lab',
          sub: '5 of 8 · pass mark was 6',
          chip: { label: 'Not yet', tone: 'neutral' },
          to: '/skills-lab/lab/python',
        },
        {
          id: 'buddy-chat',
          date: '3 Apr',
          title: 'Chat with Career Buddy',
          sub: 'Talked through a data cleaning project',
          chip: { label: 'AI-validated', tone: 'outline' },
          to: null,
        },
      ],
      empty: null,
    },
    topics: {
      title: 'Topic breakdown',
      rows: [
        { id: 'loops', label: 'Loops and functions', value: 92, level: 'Strong', tone: 'strong' },
        { id: 'lists', label: 'Lists and sets', value: 88, level: 'Strong', tone: 'strong' },
        { id: 'dicts', label: 'Dictionaries', value: 80, level: 'Strong', tone: 'strong' },
        { id: 'errors', label: 'Error handling', value: 50, level: 'Review', tone: 'review' },
        {
          id: 'mutable',
          label: 'Mutable default arguments',
          value: 40,
          level: 'Review',
          tone: 'review',
        },
      ],
    },
    recruiterPreview: {
      title: 'How recruiters see Python',
      skill: 'Python · Intermediate',
      line: 'Verified 12 May · 84/100',
      chip: { label: 'Game-evidenced', tone: 'strong' },
    },
    practice: {
      title: 'Close the gaps',
      gap: 16,
      rows: [
        {
          id: 'learn',
          icon: 'book',
          title: 'Error handling in Python',
          sub: 'My Learning · 15 min · free',
          to: '/learning',
        },
        {
          id: 'game',
          icon: 'function',
          title: 'Bug Hunt',
          sub: 'Skills Lab game · 4 min',
          to: '/skills-lab/games/bug-hunt',
        },
      ],
    },
    otherSkills: { title: 'Other skills', skills: OTHER_SKILLS },
  },
  firebase: {
    id: 'firebase',
    back: { label: 'My Assessment · Skills evidence', to: '/my-assessment' },
    title: 'Firebase',
    badge: { label: 'Self-reported', tone: 'pending', icon: null },
    subtitle: 'Intermediate · Added by you on 2 Mar. Not proven yet.',
    cta: { label: 'Take the Firebase assessment', to: '/my-assessment/full/typescript' },
    ladder: {
      title: 'How strong is your Firebase evidence?',
      step: 'Step 1 of 4',
      rungs: [
        {
          id: 'self',
          icon: 'edit',
          title: 'Self-reported',
          sub: 'Added by you · 2 Mar',
          state: 'current',
          chip: 'You are here',
        },
        {
          id: 'ai',
          icon: 'chat',
          title: 'AI-validated in chat',
          sub: 'Chat with Buddy · ~5 min',
          state: 'next',
          chip: 'Quickest',
        },
        {
          id: 'game',
          icon: 'check-circle',
          title: 'Game-evidenced',
          sub: 'Skills Lab or game · ~6 min',
          state: 'next',
          chip: 'Next',
        },
        {
          id: 'assessment',
          icon: 'shield',
          title: 'Assessment-evidenced',
          sub: '20-min assessment',
          state: 'next',
          chip: 'Next',
        },
      ],
      tip: 'Firebase is in 38% of your matches. Even a 5-minute chat with Career Buddy moves it up one step.',
      tipStyle: 'strong',
    },
    attempts: {
      title: 'Every attempt',
      note: 'Only your best result shows to recruiters. Failed attempts never appear on your card.',
      rows: [],
      empty: {
        title: 'No attempts yet',
        body: 'Prove Firebase in the way that suits you.',
        secondary: { label: 'Chat with Buddy', to: null },
        primary: { label: 'Open Skills Lab', to: '/skills-lab' },
      },
    },
    topics: null,
    recruiterPreview: {
      title: 'How recruiters see Firebase',
      skill: 'Firebase · Intermediate',
      line: 'Added by Kofi · not proven',
      chip: { label: 'Self-reported', tone: 'review' },
    },
    practice: {
      title: 'Start proving it',
      gap: 12,
      rows: [
        {
          id: 'learn',
          icon: 'book',
          title: 'Firebase basics: Auth and Firestore',
          sub: 'My Learning · 15 min · free',
          to: '/learning',
        },
        {
          id: 'buddy',
          icon: 'function',
          title: 'Ask Buddy to validate it',
          sub: 'Chat · ~5 min',
          to: null,
        },
      ],
    },
    otherSkills: { title: 'Other skills', skills: OTHER_SKILLS },
  },
};

export const getSkillEvidence = (skillId) => SKILL_EVIDENCE[skillId] ?? null;

/*
 * MA-09 Assessments library. `tabs` counts are verbatim Figma strings. Figma draws ONE tab ("For your skills", all six cards);
 * ⚠️ ASSUMPTION: "Passed" lists the passed card(s) (only Data Analytics is drawn although the count says 2) and "All
 * assessments" lists the same six cards (the count says 18; the other twelve are not drawn).
 * card.icon: function | dns | chart-bar | laptop | image; card.tile: amber (default) | green; card.status.tone: neutral | soft |
 * dark (+ icon star | check-circle-fill | hourglass); card.action.kind: primary | secondary, `disabled` = the faded Notify me.
 * ⚠️ ASSUMPTION: Start / Retake open the TypeScript full flow (the only one drawn); Remind me has no drawn result.
 */
export const ASSESSMENT_LIBRARY = {
  back: { label: 'My Assessment', to: '/my-assessment' },
  title: 'Assessments',
  subtitle:
    'One 20-minute assessment per skill. Pass with 70 or more and the skill becomes Assessment-evidenced.',
  tabs: [
    { id: 'for-you', label: 'For your skills', count: '6' },
    { id: 'passed', label: 'Passed', count: '2' },
    { id: 'all', label: 'All assessments', count: '18' },
  ],
  cards: [
    {
      id: 'typescript',
      tabs: ['for-you', 'all'],
      icon: 'function',
      tile: 'amber',
      emphasis: true,
      status: { label: 'Recommended', tone: 'outline', icon: 'star' },
      name: 'TypeScript',
      meta: '25 questions · ~20 min · pass 70',
      body: 'Self-reported → Assessment-evidenced. In 64% of your matches.',
      action: { label: 'Start assessment', kind: 'primary', to: '/my-assessment/full/typescript' },
    },
    {
      id: 'python',
      tabs: ['for-you', 'all'],
      icon: 'function',
      tile: 'amber',
      status: { label: 'Ready', tone: 'soft' },
      name: 'Python',
      meta: '25 questions · ~20 min · pass 70',
      body: 'Game-evidenced now. One step from the top label.',
      action: { label: 'Start assessment', kind: 'primary', to: '/my-assessment/full/typescript' },
    },
    {
      id: 'firebase',
      tabs: ['for-you', 'all'],
      icon: 'dns',
      tile: 'amber',
      status: { label: 'Ready', tone: 'soft' },
      name: 'Firebase',
      meta: '20 questions · ~15 min · pass 70',
      body: 'Self-reported. Try the Skills Lab first if you want practice.',
      action: { label: 'Start assessment', kind: 'primary', to: '/my-assessment/full/typescript' },
    },
    {
      id: 'data-analytics',
      tabs: ['for-you', 'passed', 'all'],
      icon: 'chart-bar',
      tile: 'green',
      status: { label: 'Passed · 82', tone: 'dark', icon: 'check-circle-fill' },
      name: 'Data Analytics',
      meta: 'Passed 12 Sep · Top 20%',
      body: 'Assessment-evidenced. Retake any time after 12 Oct to improve.',
      action: { label: 'Retake', kind: 'secondary', to: '/my-assessment/full/typescript' },
    },
    {
      id: 'react',
      tabs: ['for-you', 'all'],
      icon: 'laptop',
      tile: 'amber',
      status: { label: 'Cooldown', tone: 'neutral', icon: 'hourglass' },
      name: 'React',
      meta: 'Retake from 2 Nov',
      body: 'You scored 64 on 3 Oct. Your Game-evidenced label stays.',
      action: { label: 'Remind me', kind: 'secondary', to: null },
    },
    {
      id: 'figma',
      tabs: ['for-you', 'all'],
      icon: 'image',
      tile: 'amber',
      muted: true,
      status: { label: 'Coming soon', tone: 'neutral' },
      name: 'Figma and UI design',
      meta: 'Launching December',
      body: 'Use Pixel Perfect in Skills Lab to verify it now.',
      action: { label: 'Notify me', kind: 'secondary', to: null, disabled: true },
    },
  ],
  note: 'Only your best score shows to recruiters. A score under 70 never appears on your card, and you can retake after 30 days.',
};

/* HP — Help pop-over for /my-assessment (Figma 8376:503889 Playful / 8376:504009 Focused: identical text). Same card as the
 * default pop-over with the "for this page" block swapped; HelpPopover picks it via `home.helpPage === 'assessment'` (the lead
 * wires that). Same shape as SKILLS_LAB_HELP_COPY. */
export const ASSESSMENT_HELP_COPY = {
  title: 'Help',
  subtitle: 'Quick answers for the page you are on',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · MY ASSESSMENT',
  page: [
    { label: 'What is my readiness score?', icon: 'help' },
    { label: 'How often can I retake an assessment?', icon: 'help' },
    { label: 'Who can see my results?', icon: 'help' },
  ],
  popularLabel: 'POPULAR',
  popular: [
    { label: 'A recruiter asked me to pay a fee. What do I do?', icon: 'shield' },
    { label: 'Can I use GTH without data?', icon: 'info' },
    { label: 'How do I verify a skill?', icon: 'verified' },
  ],
  buddy: 'Ask Career Buddy',
  whatsapp: 'WhatsApp us',
  replay: 'Replay the tour',
  shortcuts: 'Shortcuts',
  help: 'Help centre',
};

/* ---- end details ---- */

/* ---- overview ---- */
/*
 * My Assessment overview (MA-01 overview 3 of 4 · MA-01b first visit · MA-01c loading · MA-01d could not load · MA-07 recruiter
 * view · MA-08 retake cooldown pop-up). API shape: GET /assessment/overview -> { summary, steps, personality, skills, next,
 * labels, skillsLab, history } (all of it below) · GET /assessment/recruiter-view -> RECRUITER_VIEW · GET /assessment/retake
 * -> RETAKE_COOLDOWN. Tokens in strings: {xp} -> "XP" in Playful, "pts" in Focused (Figma swaps the word).
 *
 * ⚠️ ASSUMPTION (links the frames imply but do not name — all in OVERVIEW_ROUTES so the lead can retarget them):
 *   - "Start with personality" / "Start" (first visit) -> /my-assessment/personality (the personality quiz flow, canvas PA-xx, has no route yet)
 *   - "Manage skills" and the "Skills added" step -> /profile (there is no skills-management route)
 *   - history rows: Personality -> /my-assessment/personality, Skills Lab rows -> /skills-lab, "Data Analytics assessment" /
 *     skills rows -> /my-assessment/skills/<id> (only python and firebase have a drawn detail page), "Chat with Career Buddy" -> /profile/filling/career-buddy
 *   - "Try again" on the error state re-runs the loading skeleton for ~1.2s and then shows the overview (no network call exists)
 *   - "Message" (recruiter view), "Remind me on 25 Dec" (retake pop-up) have no drawn destination: they log and close / do nothing
 *
 * ⚠️ FIGMA INCONSISTENCIES kept verbatim: percentile ordinals read "72th" / "41th" (a correct "72nd" / "41st" is only drawn in MA-02);
 *   the six trait bars on the overview are drawn at HALF scale (88th -> 370 of 847px, `fill` below) while the recruiter view draws
 *   them true to scale (88th -> 533 of 606px); the Skills Lab score bars are drawn wider than their 48px track (clipped, full).
 */
export const OVERVIEW_ROUTES = {
  full: '/my-assessment/full/typescript',
  personality: '/my-assessment/personality',
  personalityQuiz: '/my-assessment/personality',
  skillsLab: '/skills-lab',
  skills: '/profile',
  home: '/home',
  careerBuddy: '/profile/filling/career-buddy',
  skill: (id) => `/my-assessment/skills/${id}`,
};

export const OVERVIEW_PAGE = {
  title: 'My Assessment',
  subtitle:
    'How recruiters know your profile is real: your personality, your verified skills and how each one was proven.',
  previewCta: 'Preview recruiter view',
};

export const ASSESSMENT_OVERVIEW = {
  summary: {
    done: 3,
    total: 4,
    sticker: '3 of 4 done',
    numberCaption: 'OF 4 DONE',
    headline: 'Assessment profile: strong foundation',
    body: 'Finish the full assessment to reach 4 of 4. Profiles at 4 of 4 get about 2x more recruiter views.',
    percent: 75,
  },
  steps: [
    {
      id: 'personality',
      icon: 'compass',
      title: 'Personality',
      sub: 'The Architect · 14 Oct',
      status: 'done',
      to: 'personality',
    },
    {
      id: 'skills-added',
      icon: 'list',
      title: 'Skills added',
      sub: '9 skills on your card',
      status: 'done',
      to: 'skills',
    },
    {
      id: 'labs',
      icon: 'check',
      title: 'Skills Lab and games',
      sub: '7 skills verified',
      status: 'done',
      to: 'skillsLab',
    },
    {
      id: 'full',
      icon: 'clipboard',
      title: 'Full assessment',
      sub: '~20 min · +40 {xp}',
      status: 'not-started',
      statusLabel: 'Not started',
      cta: 'Start assessment',
      to: 'full',
    },
  ],
  personality: {
    title: 'Personality',
    status: 'Completed',
    link: 'See full personality',
    lead: 'You’re ',
    type: 'The Architect.',
    meta: '1 of 9 archetypes · strategic and systematic',
    blurb:
      'You plan before you build, spot risks early and like clear structure. Teams lean on you when things get complicated.',
    affinityLabel: 'Career affinity',
    affinity: ['Technology', 'Fintech', 'Product', 'Systems design', 'Research'],
    traits: [
      {
        id: 'conscientiousness',
        name: 'Conscientiousness',
        label: '88th percentile',
        value: 88,
        fill: 43.68,
        tone: 'green',
      },
      {
        id: 'decisiveness',
        name: 'Decisiveness',
        label: '79th percentile',
        value: 79,
        fill: 39.2,
        tone: 'green',
      },
      {
        id: 'openness',
        name: 'Openness',
        label: '72th percentile',
        value: 72,
        fill: 35.66,
        tone: 'green',
      },
      {
        id: 'emotional-stability',
        name: 'Emotional stability',
        label: '70th percentile',
        value: 70,
        fill: 34.71,
        tone: 'green',
      },
      {
        id: 'agreeableness',
        name: 'Agreeableness',
        label: '64th percentile',
        value: 64,
        fill: 31.76,
        tone: 'muted',
      },
      {
        id: 'extraversion',
        name: 'Extraversion',
        label: '41th percentile',
        value: 41,
        fill: 20.31,
        tone: 'muted',
      },
    ],
    note: 'Results are system-generated and can’t be edited. You can retake the quiz in 72 days.',
  },
  skillsEvidence: {
    title: 'Skills evidence',
    chip: '9 skills · 7 verified',
    sub: 'How each skill was proven. Recruiters see the same labels.',
    skills: [
      { id: 'react', name: 'React', level: 'Advanced · 2+ years', kind: 'game' },
      {
        id: 'data-analytics',
        name: 'Data Analytics',
        level: 'Intermediate · Google certificate',
        kind: 'assessment',
      },
      { id: 'python', name: 'Python', level: 'Intermediate · 1 year', kind: 'game' },
      { id: 'figma', name: 'Figma and UI design', level: 'Intermediate', kind: 'ai' },
      { id: 'typescript', name: 'TypeScript', level: 'Intermediate', kind: 'self' },
      { id: 'firebase', name: 'Firebase', level: 'Intermediate', kind: 'game' },
    ],
    more: '3 more skills',
    manage: 'Manage skills',
  },
  next: {
    skillId: 'typescript',
    title: 'Take the TypeScript assessment',
    meta: 'About 20 minutes · +40 {xp}',
    body: 'Moves TypeScript from Self-reported to Assessment-evidenced, the strongest label on GTH. It also closes your top readiness gap.',
    cta: 'Start assessment',
    sticker: 'BIGGEST BOOST',
  },
  labelsLegend: {
    title: 'What the labels mean',
    items: [
      { kind: 'assessment', text: 'Passed a GTH assessment. Strongest.' },
      { kind: 'game', text: 'Proven in a Skills Lab challenge.' },
      { kind: 'ai', text: 'Checked by Career Buddy in conversation.' },
      { kind: 'self', text: 'Added by you. Not yet proven.' },
    ],
  },
  skillsLab: {
    title: 'Skills Lab',
    link: 'Play more',
    games: [
      {
        id: 'react-speedrun',
        name: 'React Speedrun',
        when: '8 May · 22 min',
        score: 91,
        top: 'Top 11%',
        strong: true,
      },
      {
        id: 'design-thinking-sprint',
        name: 'Design Thinking Sprint',
        when: '28 Apr · 15 min',
        score: 88,
        top: 'Top 18%',
        strong: true,
      },
      {
        id: 'python-lab',
        name: 'Python Lab',
        when: '12 May · 18 min',
        score: 84,
        top: 'Top 23%',
        strong: false,
      },
      {
        id: 'leadership-chess',
        name: 'Leadership Chess',
        when: '3 May · 12 min',
        score: 76,
        top: 'Top 38%',
        strong: false,
      },
    ],
  },
  history: {
    title: 'History',
    window: 'Last 90 days',
    sub: 'Every result that changed your profile. Only the latest score in each area shows to recruiters.',
    rows: [
      {
        id: 'quiz',
        date: '14 Oct',
        title: 'Personality quiz',
        sub: 'The Architect · 15 scenarios',
        chip: { kind: 'tag', label: 'Personality' },
        to: 'personality',
      },
      {
        id: 'js',
        date: '2 Oct',
        title: 'Skills Lab · JavaScript',
        sub: '7 of 8 · Verified',
        chip: { kind: 'game', label: 'Game-evidenced' },
        to: 'skillsLab',
      },
      {
        id: 'sql',
        date: '2 Oct',
        title: 'Skills Lab · SQL',
        sub: '8 of 8 · Verified',
        chip: { kind: 'game', label: 'Game-evidenced' },
        to: 'skillsLab',
      },
      {
        id: 'da',
        date: '12 Sep',
        title: 'Data Analytics assessment',
        sub: '82 / 100 · Top 20%',
        chip: { kind: 'assessment', label: 'Assessment-evidenced' },
        skillId: 'data-analytics',
      },
      {
        id: 'chat',
        date: '28 Aug',
        title: 'Chat with Career Buddy',
        sub: 'Figma and UI design validated',
        chip: { kind: 'ai', label: 'AI-validated in chat' },
        to: 'careerBuddy',
      },
    ],
  },
};

/* MA-01b — first visit (0 of 4). */
export const FIRST_VISIT = {
  sticker: 'Start here',
  hero: {
    caption: '0 OF 4 DONE',
    lead: 'Show recruiters what you can ',
    accent: 'really do.',
    body: 'Three short steps turn "I can do this" into proof. Each one adds a label recruiters trust. You can pause any time.',
    cta: 'Start with personality',
    meta: 'About 8 minutes · +100 {xp}',
  },
  steps: [
    {
      id: 'personality',
      n: '1',
      icon: 'compass',
      title: 'Personality',
      text: 'Quiz, games or a chat with Buddy. Gives your archetype and six trait scores.',
      time: '~8 min',
      cta: 'Start',
      to: 'personalityQuiz',
      active: true,
    },
    {
      id: 'verify',
      n: '2',
      icon: 'check',
      title: 'Verify a skill',
      text: 'Pass a Skills Lab challenge or a game. Your skill gets the Verified badge.',
      time: '~6 to 10 min each',
      cta: 'Open Skills Lab',
      to: 'skillsLab',
    },
    {
      id: 'full',
      n: '3',
      icon: 'clipboard',
      title: 'Full assessment',
      text: 'A longer test for your top skill. The strongest label on GTH.',
      time: '~20 min',
      locked: 'Unlocks after step 2',
    },
  ],
  seen: {
    title: 'What recruiters see right now',
    rows: [
      { id: 'personality', label: 'Personality', value: 'Not shared yet' },
      { id: 'skills', label: 'Skills', value: '9 skills · all Self-reported' },
      { id: 'verified', label: 'Verified skills', value: 'None yet' },
    ],
  },
};

/* MA-01c — loading. */
export const OVERVIEW_LOADING = { note: 'Loading your results…' };

/* MA-01d — could not load. */
export const OVERVIEW_ERROR = {
  title: "We couldn't load your results",
  body: 'Your results are safe. This is a connection problem on our side or yours.',
  home: 'Go to Home',
  retry: 'Try again',
  code: 'Error MA-503 · 15 Oct, 15:12',
};

/* MA-07 — recruiter view (preview). */
export const RECRUITER_VIEW = {
  banner: 'You are previewing your profile as a recruiter at Farmerline would see it.',
  exit: 'Exit preview',
  title: 'Recruiter view',
  subtitle:
    'Exactly what a recruiter sees when they open your assessment. Nothing private is shown.',
  candidate: {
    initials: 'KA',
    name: 'Kofi Agyekum',
    line: 'Frontend developer · Accra · Open to opportunities',
    chip: 'Assessment profile 3 of 4',
    message: 'Message',
  },
  personality: {
    type: 'The Architect',
    sub: 'Strategic and systematic · measured 14 Oct',
    traits: [
      {
        id: 'conscientiousness',
        name: 'Conscientiousness',
        label: '88th',
        value: 88,
        tone: 'green',
      },
      { id: 'decisiveness', name: 'Decisiveness', label: '79th', value: 79, tone: 'green' },
      { id: 'openness', name: 'Openness', label: '72th', value: 72, tone: 'green' },
      {
        id: 'emotional-stability',
        name: 'Emotional stability',
        label: '70th',
        value: 70,
        tone: 'green',
      },
      { id: 'agreeableness', name: 'Agreeableness', label: '64th', value: 64, tone: 'gold' },
      { id: 'extraversion', name: 'Extraversion', label: '41th', value: 41, tone: 'dark' },
    ],
  },
  skillsTitle: 'Skills and how they were proven',
  skills: [
    { id: 'typescript', name: 'TypeScript', level: 'Intermediate', kind: 'assessment' },
    { id: 'data-analytics', name: 'Data Analytics', level: 'Intermediate', kind: 'assessment' },
    { id: 'react', name: 'React', level: 'Advanced', kind: 'game' },
    { id: 'python', name: 'Python', level: 'Intermediate', kind: 'game' },
    { id: 'figma', name: 'Figma and UI design', level: 'Intermediate', kind: 'ai' },
    { id: 'firebase', name: 'Firebase', level: 'Intermediate', kind: 'self' },
  ],
  hidden: {
    title: 'Recruiters never see',
    items: [
      'Your quiz answers',
      'Failed or retaken attempts',
      'Your moves inside games',
      'Your chats with Career Buddy',
      'Your recordings',
    ],
  },
  improve: {
    title: 'Make this view stronger',
    body: 'Firebase is still Self-reported. A 6-minute lab would move it to Game-evidenced.',
    cta: 'Open Skills Lab',
  },
};

/* MA-08 — retake cooldown pop-up (opens from "Retake in 72 days" on the personality page, and `?modal=retake`). */
export const RETAKE_COOLDOWN = {
  title: 'You can retake on 25 Dec',
  body: 'That is 72 days from now. We space retakes so your scores reflect how you really work, not how well you remember the questions. Your current result stays on your card.',
  alt: 'Meanwhile, personality games can add detail to your trait scores.',
  dismiss: 'Got it',
  remind: 'Remind me on 25 Dec',
};

/* Sidebar rail card for the overview states (merged into talentHome/talentShellData.js ASSESSMENT_PAGE) lives there. */
/* ---- end overview ---- */
