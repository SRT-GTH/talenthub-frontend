/*
 * Engineering planning lab flow (Figma SL-L14a … L14h, labId `engineering-planning`). Shape = PYTHON_FLOW in skillsLabLabsData.js.
 * Real content in Figma: Q1 "When can QA testing start?" (SL-L14a/b/c/d) and Q2 "If Design slips a day, does launch move?"
 * (SL-L14e), the two results modals (SL-L14g verified 5/6, SL-L14h fail 3/6) and their topic breakdown.
 * ⚠️ ASSUMPTION: Q3 – Q6 are not drawn in any frame. They are invented to fill the 6-challenge flow, in the same voice, with the
 * topics the results modal lists (Dependencies Q1, Q3 · Critical path Q2 · Estimating effort Q4, Q5 · Release planning Q6).
 * ⚠️ ASSUMPTION: the QA-row preview for options C and D of Q1 (Day 4 / Day 1) and every preview of Q3 follow the drawn A / B pattern.
 * ⚠️ ASSUMPTION: hints and explanations for Q2 – Q6 (only Q1's hint / "right" / option-A explanation are drawn).
 * ⚠️ ASSUMPTION: results for 6/6 ("perfect") and 0–1/6 ("tough") are not drawn for this lab — the shared Python modal copy is used.
 *
 * Plugs in through labFlows/*.js (auto-merged by skillsLabLabsData.js); the question renderers are labKinds/planningKinds.jsx.
 */
const DAYS = ['Mon · Day 1', 'Tue · Day 2', 'Wed · Day 3', 'Thu · Day 4', 'Fri · Day 5'];

const QUESTIONS = [
  {
    id: 'ep-1',
    kind: 'plan-timeline',
    topic: 'Dependencies',
    title: [
      ['When can ', false],
      ['QA testing', true],
      [' start?', false],
    ],
    prompt: 'Pick an option to preview it on the plan.',
    body: {
      rule: 'Rule: QA can only start after development is finished.',
      days: DAYS,
      rows: [
        { label: 'User research', bar: { tone: 'blue', start: 1, span: 1, text: 'Day 1' } },
        { label: 'Design', bar: { tone: 'purple', start: 2, span: 1, text: 'Day 2' } },
        { label: 'Development', bar: { tone: 'green', start: 3, span: 2, text: 'Days 3–4' } },
        { label: 'QA testing', slot: true },
      ],
      // One entry per option: where QA lands if you pick it. A and B are drawn; C and D are ⚠️ ASSUMPTIONS in the same pattern.
      previews: [
        { start: 2, preview: 'Day 2 · preview', done: 'Day 2', bad: 'Day 2 · nothing to test yet' },
        { start: 5, preview: 'Day 5 · preview', done: 'Day 5', bad: 'Day 5' },
        { start: 4, preview: 'Day 4 · preview', done: 'Day 4', bad: 'Day 4 · nothing to test yet' },
        { start: 1, preview: 'Day 1 · preview', done: 'Day 1', bad: 'Day 1 · nothing to test yet' },
      ],
    },
    options: [
      'Day 2, alongside Design, to save time.',
      'Day 5, straight after development finishes on Day 4.',
      'Day 4, while development is still running.',
      'Day 1. QA doesn’t depend on anything.',
    ],
    answer: 1,
    hint: 'Find the last day of Development. QA can only start on the day after it.',
    explain: {
      right:
        'QA depends on finished code. Development ends on Day 4, so Day 5 is the earliest QA can start.',
      // ⚠️ ASSUMPTION for options C and D; option A is the drawn Figma copy (SL-L14c).
      wrong:
        'Development isn’t finished until the end of Day 4, so there’s no finished code to test before Day 5.',
      wrongByOption: {
        0: 'On Day 2 there’s no code to test. The rule says QA waits until development is finished at the end of Day 4.',
      },
    },
  },
  {
    id: 'ep-2',
    kind: 'plan-timeline',
    topic: 'Critical path',
    title: [
      ['If ', false],
      ['Design slips', true],
      [' a day, does launch move?', false],
    ],
    prompt: 'Frontend needs the designs. Integration needs both Backend and Frontend.',
    body: {
      rule: 'Launch is planned for the end of Day 5.',
      days: DAYS,
      rows: [
        { label: 'Design', bar: { tone: 'purple', start: 1, span: 2, text: 'Days 1–2' } },
        { label: 'Backend API', bar: { tone: 'blue', start: 1, span: 3, text: 'Days 1–3' } },
        { label: 'Frontend', bar: { tone: 'green', start: 3, span: 2, text: 'Days 3–4' } },
        { label: 'Integration', bar: { tone: 'gold', start: 5, span: 1, text: 'Day 5' } },
      ],
    },
    options: [
      'Yes, by a day. Frontend can’t start until the designs are done, and Integration waits for Frontend.',
      'No. Backend is the longest task, so it’s the only one that matters.',
      'Only if Backend also slips.',
      'No. Integration can start early and catch up.',
    ],
    answer: 0,
    // ⚠️ ASSUMPTION: hint + explanations (not drawn).
    hint: 'Follow the chain Design → Frontend → Integration and count the days along it.',
    explain: {
      right:
        'Design, Frontend and Integration form the critical path with no spare days. A one-day slip in Design moves launch from Day 5 to Day 6.',
      wrong:
        'Frontend waits for Design and Integration waits for Frontend, so Design sits on the critical path. If it slips a day, launch slips a day.',
    },
  },
  {
    id: 'ep-3',
    kind: 'plan-timeline',
    topic: 'Dependencies',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['When can ', false],
      ['Frontend', true],
      [' start?', false],
    ],
    prompt: 'Pick an option to preview it on the plan.',
    body: {
      rule: 'Rule: Frontend can only start after Design is finished.',
      days: DAYS,
      rows: [
        { label: 'User research', bar: { tone: 'blue', start: 1, span: 1, text: 'Day 1' } },
        { label: 'Design', bar: { tone: 'purple', start: 2, span: 2, text: 'Days 2–3' } },
        { label: 'Backend API', bar: { tone: 'blue', start: 1, span: 3, text: 'Days 1–3' } },
        { label: 'Frontend', slot: true },
      ],
      previews: [
        { start: 1, preview: 'Day 1 · preview', done: 'Day 1', bad: 'Day 1 · no designs yet' },
        { start: 3, preview: 'Day 3 · preview', done: 'Day 3', bad: 'Day 3 · no designs yet' },
        { start: 4, preview: 'Day 4 · preview', done: 'Day 4', bad: 'Day 4' },
        { start: 2, preview: 'Day 2 · preview', done: 'Day 2', bad: 'Day 2 · no designs yet' },
      ],
    },
    options: [
      'Day 1, in parallel with User research.',
      'Day 3, while Design is still running.',
      'Day 4, straight after Design finishes on Day 3.',
      'Day 2, once User research is done.',
    ],
    answer: 2,
    hint: 'Find the last day of Design. Frontend can only start on the day after it.',
    explain: {
      right:
        'Frontend depends on finished designs. Design ends on Day 3, so Day 4 is the earliest Frontend can start.',
      wrong:
        'The designs aren’t finished until the end of Day 3, and the rule says Frontend waits for them.',
    },
  },
  {
    id: 'ep-4',
    kind: 'plan-timeline',
    topic: 'Estimating effort',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['How long should you ', false],
      ['quote', true],
      ['?', false],
    ],
    prompt: 'A task usually takes 3 days, but twice it has taken 5. The client wants one answer.',
    body: { rule: 'Rule: Never promise the best case.' },
    options: [
      '3 days, because that’s the usual time.',
      '5 days, the worst case, to be safe.',
      'Between 3 and 5 days, and say what could push it to 5.',
      'Whatever date the client prefers.',
    ],
    answer: 2,
    hint: 'Look at both numbers: the usual time and the slowest time.',
    explain: {
      right:
        'A range with its assumptions is honest. The usual case is 3 days, and the client can see what could push it to 5.',
      wrong:
        'A single number hides the risk. Give the usual time and the slowest time, and say what could cause the delay.',
    },
  },
  {
    id: 'ep-5',
    kind: 'plan-timeline',
    topic: 'Estimating effort',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['Can one developer finish by ', false],
      ['Day 3', true],
      ['?', false],
    ],
    prompt: 'Task A takes 2 days. Task B takes 2 days. Both need the same developer.',
    body: { rule: 'Rule: One developer works on one task at a time.' },
    options: [
      'Yes, if they work on both at once.',
      'No. One after the other they need 4 days, so Day 4 at the earliest.',
      'Yes, if Task B starts on Day 2.',
      'Only if the developer skips testing.',
    ],
    answer: 1,
    hint: 'Add the two tasks together, because they can’t overlap.',
    explain: {
      right: 'The tasks can’t overlap, so they take 2 + 2 = 4 days. The earliest finish is Day 4.',
      wrong:
        'One developer does one task at a time, so the two tasks add up to 4 days and can’t finish by Day 3.',
    },
  },
  {
    id: 'ep-6',
    kind: 'plan-timeline',
    topic: 'Release planning',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['What should ship ', false],
      ['first', true],
      ['?', false],
    ],
    prompt: 'The team has 2 days left. Pick the release that can ship safely.',
    body: { rule: 'Rule: Ship something that works end to end, and keep the rest for later.' },
    options: [
      'Everything, with testing squeezed into the last hour.',
      'Login only, because it’s the smallest change.',
      'Login and checkout, tested, with reports kept for the next release.',
      'Nothing until every feature is finished.',
    ],
    answer: 2,
    hint: 'A release should work end to end and be tested. What can wait for the next one?',
    explain: {
      right:
        'Login and checkout work end to end and can be tested in 2 days. Reports can wait for the next release.',
      wrong:
        'A safe release is tested and works end to end. Squeezing everything in, or waiting for everything, puts the launch at risk.',
    },
  },
];

// Frame seeds (`?f=`): results = outcome per challenge so far, index = challenge on screen, selected = option index.
// The results frames draw Challenge 1 behind the modal with option B still marked (SL-L14g / SL-L14h).
const FRAMES = {
  L14a: { index: 0, results: [], status: 'selected', selected: 1, hintUsed: false, xp: 240 },
  L14e: { index: 1, results: ['ok'], status: 'playing', selected: null, hintUsed: false, xp: 240 },
  L14b: { index: 0, results: ['ok'], status: 'correct', selected: 1, hintUsed: false, xp: 250 },
  L14c: { index: 0, results: ['bad'], status: 'wrong', selected: 0, hintUsed: false, xp: 240 },
  L14d: { index: 0, results: [], status: 'playing', selected: null, hintUsed: true, xp: 235 },
  L14g: {
    index: 0,
    results: ['ok', 'ok', 'ok', 'bad', 'ok', 'ok'],
    status: 'finished',
    selected: 1,
    xp: 300,
    scenario: 'verified',
  },
  L14h: {
    index: 0,
    results: ['ok', 'bad', 'ok', 'bad', 'bad', 'ok'],
    status: 'finished',
    selected: 1,
    xp: 255,
    scenario: 'fail',
  },
};

// Topic breakdown + refresher exactly as drawn on the two results frames.
const FRAME_RESULTS = {
  verified: {
    earned: 60,
    topics: [
      { label: 'Dependencies', qs: 'Q1, Q3', strong: true },
      { label: 'Critical path', qs: 'Q2', strong: true },
      { label: 'Estimating effort', qs: 'Q4, Q5', strong: false },
      { label: 'Release planning', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Brush up on estimating',
      sub: '8-min lesson in My Learning',
      cta: 'Open',
    },
  },
  fail: {
    earned: 15,
    topics: [
      { label: 'Dependencies', qs: 'Q1, Q3', strong: true },
      { label: 'Critical path', qs: 'Q2', strong: false },
      { label: 'Estimating effort', qs: 'Q4, Q5', strong: false },
      { label: 'Release planning', qs: 'Q6', strong: true },
    ],
    refresher: {
      title: 'Practise first? Planning basics, 12 min',
      sub: 'Critical paths and estimates',
      cta: 'Open',
    },
  },
};

// Refresher on a real run's results ({topic} = first review topic, filled in by the engine). Only verified + fail are drawn.
const REFRESHERS = {
  verified: { title: 'Brush up on {topic}', sub: '8-min lesson in My Learning', cta: 'Open' },
  perfect: null,
  fail: FRAME_RESULTS.fail.refresher,
  // ⚠️ ASSUMPTION: "tough" is not drawn for this lab — it reuses the fail refresher.
  tough: FRAME_RESULTS.fail.refresher,
};

// Results copy that differs from the shared Python scenarios (Figma SL-L14g / SL-L14h). The shared engine ignores this until
// buildResultView merges `flow.resultCopy[scenarioId]` over RESULT_SCENARIOS[scenarioId] — see the report to the lead.
const RESULT_COPY = {
  verified: {
    body: '{n} of {total}. The Verified badge is now on {title} on your card.',
  },
  fail: {
    heading: [
      ['Nearly. ', false],
      ['Run it back.', true],
    ],
    body: '{n} of {total}, and you need {passMark}. Nothing changes on your card until you pass. New plans every retake.',
  },
};

export const ENGINEERING_PLANNING_FLOW = {
  id: 'engineering-planning',
  title: 'Engineering planning',
  headerTitle: 'Skills Lab · Engineering planning',
  subtitle: '6 challenges · Pass 5 to earn Verified · Retake any time',
  sticker: 'PASS 5 = VERIFIED',
  total: 6,
  passMark: 5,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/engineering-planning/session — not started yet (hub card status "explore"), Challenge 1 of 6.
  session: { index: 0, results: [], xp: 240, streakDays: 7 },
  questions: QUESTIONS,
  frames: FRAMES,
  frameResults: FRAME_RESULTS,
  refreshers: REFRESHERS,
  resultCopy: RESULT_COPY,
};

export const FLOWS = { 'engineering-planning': ENGINEERING_PLANNING_FLOW };
