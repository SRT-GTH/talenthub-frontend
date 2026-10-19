/*
 * Product management lab flow (Figma SL-L15a … L15h, labId `product-management`). Shape = PYTHON_FLOW in skillsLabLabsData.js.
 * Real content in Figma: Q2 "Which feature should the team build next?" (RICE table; SL-L15a/b/c/d), Q3 "How will you know checkout
 * works?" (SL-L15e), Q4 "Two weeks. What makes the cut?" (SL-L15f), and the two results modals (SL-L15g verified 5/6, SL-L15h fail 3/6).
 * ⚠️ ASSUMPTION: Q1, Q5 and Q6 are not drawn in any frame — invented to fill the 6-challenge flow (topics from the results modal:
 * User stories Q1 · Prioritisation Q2 · Metrics Q3 · Scope Q4 · Trade-offs Q5, Q6).
 * ⚠️ ASSUMPTION: hints/explanations for Q3 and Q4 (only Q2's hint, "right" and option-B explanation are drawn); Q2's explanations
 * for options C and D are computed from the drawn RICE numbers.
 * ⚠️ ASSUMPTION: results for 6/6 ("perfect") and 0–1/6 ("tough") are not drawn for this lab — the shared Python modal copy is used.
 *
 * Figma inconsistency kept as drawn: SL-L15g lists topics only for Q1 – Q4 (Q5, Q6 are missing from the breakdown).
 * Plugs in through labFlows/*.js (auto-merged by skillsLabLabsData.js); the question renderers are labKinds/planningKinds.jsx.
 */
const QUESTIONS = [
  {
    id: 'pm-1',
    kind: 'brief-choice',
    topic: 'User stories',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['Which is a ', false],
      ['good user story', true],
      ['?', false],
    ],
    prompt: 'A good story says who it’s for, what they need and why.',
    body: {},
    options: [
      'Build a database table for bookings.',
      'As a parent, I want to pay with mobile money so I can book a tutor without cash.',
      'Make the app faster.',
      'Add a button.',
    ],
    answer: 1,
    hint: 'Look for the option that says who, what and why.',
    explain: {
      right:
        'It names the user (a parent), the need (pay with mobile money) and the reason (book a tutor without cash).',
      wrong:
        'A good story says who the user is, what they need and why. Only one option has all three.',
    },
  },
  {
    id: 'pm-2',
    kind: 'rice-table',
    topic: 'Prioritisation',
    title: [
      ['Which feature should the team ', false],
      ['build next?', true],
    ],
    prompt: 'Use RICE: Reach × Impact × Confidence ÷ Effort. The highest score wins.',
    body: {
      columns: ['Feature', 'Reach / month', 'Impact', 'Confidence', 'Effort (weeks)'],
      rows: [
        {
          name: 'Mobile money checkout',
          reach: '8,000',
          impact: '3',
          confidence: '80%',
          effort: '4',
        },
        { name: 'Dark mode', reach: '10,000', impact: '0.5', confidence: '90%', effort: '2' },
        { name: 'Referral rewards', reach: '3,000', impact: '2', confidence: '50%', effort: '3' },
        { name: 'Offline mode', reach: '5,000', impact: '2', confidence: '70%', effort: '6' },
      ],
      note: 'Impact: 3 = massive, 2 = high, 1 = medium, 0.5 = low. You can use a calculator.',
    },
    options: ['Mobile money checkout', 'Dark mode', 'Referral rewards', 'Offline mode'],
    answer: 0,
    hint: 'Turn confidence into a decimal (80% = 0.8), then work out Reach × Impact × Confidence ÷ Effort for each row.',
    explain: {
      right:
        'Mobile money checkout scores 4,800 (8,000 × 3 × 0.8 ÷ 4). Dark mode is next at 2,250, then offline mode at 1,167 and referrals at 1,000.',
      // Option B is the drawn Figma copy (SL-L15c); C and D are ⚠️ ASSUMPTIONS computed from the drawn numbers.
      wrong: 'Mobile money checkout has the highest RICE score: 4,800 (8,000 × 3 × 0.8 ÷ 4).',
      wrongByOption: {
        1: 'Dark mode reaches the most people, but its impact is low (0.5). It scores 2,250. Mobile money checkout scores 4,800.',
        2: 'Referral rewards score 1,000 (3,000 × 2 × 0.5 ÷ 3). Mobile money checkout scores 4,800.',
        3: 'Offline mode scores 1,167 (5,000 × 2 × 0.7 ÷ 6). Mobile money checkout scores 4,800.',
      },
    },
  },
  {
    id: 'pm-3',
    kind: 'brief-choice',
    topic: 'Metrics',
    title: [
      ['How will you know ', false],
      ['checkout works?', true],
    ],
    prompt: 'The mobile money checkout shipped last week. Pick the one number you’d watch first.',
    body: {
      context: {
        title: 'What the team wants',
        lines: [
          'More people who start paying actually finish paying',
          'Fewer failed or abandoned payments',
          'A number you can check every day',
        ],
      },
    },
    options: [
      'Page views on the checkout screen',
      'Checkout completion rate: payments finished ÷ payments started',
      'App downloads this month',
      'Number of features shipped this quarter',
    ],
    answer: 1,
    // ⚠️ ASSUMPTION: hint + explanations (not drawn).
    hint: 'Pick the number that tells you whether the people who start paying finish paying.',
    explain: {
      right:
        'Completion rate measures what the team wants: more people finishing, fewer abandoned payments, and a number you can check every day.',
      wrong:
        'That number doesn’t show whether payments get finished. Checkout completion rate does: payments finished ÷ payments started.',
      wrongByOption: {
        0: 'Page views only count visits to the screen, not payments that were finished.',
        2: 'Downloads happen before anyone reaches checkout, so they say nothing about payments.',
        3: 'Features shipped measures output, not whether checkout works for people.',
      },
    },
  },
  {
    id: 'pm-4',
    kind: 'brief-choice',
    topic: 'Scope',
    title: [
      ['Two weeks. What ', false],
      ['makes the cut?', true],
    ],
    prompt:
      'You’re launching a tutoring booking app for students in Kumasi. Pick the smallest version that still works end to end.',
    body: {
      context: {
        title: 'Constraints',
        lines: [
          '2 developers, 2 weeks',
          'Tutors already use WhatsApp to confirm sessions',
          'Parents pay with mobile money',
        ],
      },
    },
    options: [
      'Booking, mobile money payment and an SMS confirmation',
      'Booking, payments, in-app chat, ratings and video calls',
      'Just a landing page with a waitlist',
      'Rebuild the whole app on a new framework first',
    ],
    answer: 0,
    // ⚠️ ASSUMPTION: hint + explanations (not drawn).
    hint: 'Which option lets a parent book and pay, and nothing more, within 2 developers and 2 weeks?',
    explain: {
      right:
        'Booking, mobile money payment and an SMS confirmation is the smallest version that works end to end, and it fits 2 developers in 2 weeks.',
      wrong:
        'That is either too big for 2 developers in 2 weeks or it doesn’t work end to end. The smallest version lets a parent book, pay and get a confirmation.',
    },
  },
  {
    id: 'pm-5',
    kind: 'brief-choice',
    topic: 'Trade-offs',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['A client wants a ', false],
      ['custom feature', true],
      ['. Now what?', false],
    ],
    prompt:
      'It would use the whole sprint, and the roadmap already has a feature that more users need.',
    body: {},
    options: [
      'Build it, because the client is big.',
      'Say no without explaining.',
      'Compare its value with the planned feature, then decide and explain the trade-off.',
      'Build both by working weekends.',
    ],
    answer: 2,
    hint: 'A trade-off decision compares value, then explains the choice.',
    explain: {
      right:
        'Comparing the value of both options lets you choose with evidence, and explaining the trade-off keeps the client and the team on side.',
      wrong:
        'This skips the comparison. Weigh the value of the custom feature against the planned one, then explain the trade-off.',
    },
  },
  {
    id: 'pm-6',
    kind: 'brief-choice',
    topic: 'Trade-offs',
    // ⚠️ ASSUMPTION: whole question (not drawn).
    title: [
      ['What do you ', false],
      ['cut first', true],
      ['?', false],
    ],
    prompt: 'The deadline is fixed and the team is one developer short.',
    body: {},
    options: [
      'Testing, to keep every feature.',
      'The lowest-value feature, and tell the client why.',
      'Nothing. Ask the team to work faster.',
      'The deadline, without telling anyone.',
    ],
    answer: 1,
    hint: 'When the deadline and the team are fixed, only the scope can move.',
    explain: {
      right:
        'With the deadline and the team fixed, scope is the only thing that can move. Cut the lowest-value feature and tell the client why.',
      wrong:
        'Cutting quality or surprising the client causes bigger problems later. With time and people fixed, cut scope and say so.',
    },
  },
];

// Frame seeds (`?f=`): results = outcome per challenge so far, index = challenge on screen, selected = option index.
// The results frames draw Challenge 2 behind the modal, nothing selected (SL-L15g / SL-L15h).
const FRAMES = {
  L15a: { index: 1, results: ['ok'], status: 'selected', selected: 0, hintUsed: false, xp: 240 },
  L15e: {
    index: 2,
    results: ['ok', 'ok'],
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: 240,
  },
  L15f: {
    index: 3,
    results: ['ok', 'ok', 'ok'],
    status: 'selected',
    selected: 0,
    hintUsed: false,
    xp: 240,
  },
  L15b: {
    index: 1,
    results: ['ok', 'ok'],
    status: 'correct',
    selected: 0,
    hintUsed: false,
    xp: 250,
  },
  L15c: {
    index: 1,
    results: ['ok', 'bad'],
    status: 'wrong',
    selected: 1,
    hintUsed: false,
    xp: 240,
  },
  L15d: { index: 1, results: ['ok'], status: 'playing', selected: null, hintUsed: true, xp: 235 },
  L15g: {
    index: 1,
    results: ['ok', 'ok', 'ok', 'bad', 'ok', 'ok'],
    status: 'finished',
    selected: 0,
    xp: 300,
    scenario: 'verified',
  },
  L15h: {
    index: 1,
    results: ['ok', 'ok', 'bad', 'bad', 'ok', 'bad'],
    status: 'finished',
    selected: 0,
    xp: 255,
    scenario: 'fail',
  },
};

// Topic breakdown + refresher exactly as drawn on the two results frames.
const FRAME_RESULTS = {
  verified: {
    earned: 60,
    topics: [
      { label: 'User stories', qs: 'Q1', strong: true },
      { label: 'Prioritisation', qs: 'Q2', strong: true },
      { label: 'Metrics', qs: 'Q3', strong: true },
      { label: 'Scope and trade-offs', qs: 'Q4', strong: false },
    ],
    refresher: {
      title: 'Brush up on scoping',
      sub: 'Cutting an MVP down, 8 min',
      cta: 'Open',
    },
  },
  fail: {
    earned: 15,
    topics: [
      { label: 'User stories and prioritisation', qs: 'Q1, Q2', strong: true },
      { label: 'Metrics', qs: 'Q3', strong: false },
      { label: 'Scope', qs: 'Q4', strong: false },
      { label: 'Trade-offs', qs: 'Q5, Q6', strong: false },
    ],
    refresher: {
      title: 'Practise first? Product basics, 12 min',
      sub: 'RICE, metrics and MVP scope',
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

// Results copy that differs from the shared Python scenarios (Figma SL-L15g / SL-L15h). The shared engine ignores this until
// buildResultView merges `flow.resultCopy[scenarioId]` over RESULT_SCENARIOS[scenarioId] — see the report to the lead.
const RESULT_COPY = {
  verified: {
    body: '{n} of {total}. {title} now carries the Verified badge on your card.',
  },
  fail: {
    heading: [
      ['Solid thinking. ', false],
      ['Not yet.', true],
    ],
    body: '{n} of {total}, and you need {passMark}. Nothing changes on your card until you pass. New product scenarios every retake.',
  },
};

export const PRODUCT_MANAGEMENT_FLOW = {
  id: 'product-management',
  title: 'Product management',
  headerTitle: 'Skills Lab · Product management',
  subtitle: '6 challenges · Pass 5 to earn Verified · Retake any time',
  sticker: 'PASS 5 = VERIFIED',
  total: 6,
  passMark: 5,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/product-management/session — not started yet (hub card status "explore"), Challenge 1 of 6.
  session: { index: 0, results: [], xp: 240, streakDays: 7 },
  questions: QUESTIONS,
  frames: FRAMES,
  frameResults: FRAME_RESULTS,
  refreshers: REFRESHERS,
  resultCopy: RESULT_COPY,
};

export const FLOWS = { 'product-management': PRODUCT_MANAGEMENT_FLOW };
