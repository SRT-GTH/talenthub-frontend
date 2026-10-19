/*
 * Data analysis lab flow (Figma "Talent - Skills Lab": SL-L12a Q3 answer selected 7851:3704, L12e Q2 trend 7851:3907,
 * L12f Q4 correlation 7851:4095, L12b Q3 correct 7851:4283, L12c Q3 not quite 7851:4502, L12d Q3 hint 7851:4724,
 * L12g verified 7851:4936, L12h not verified yet 7851:5265; Focused twins 8110:475808 … 8110:477097).
 * Plugged in automatically: skillsLabLabsData.js merges every `labFlows/*.js` FLOWS export into LAB_FLOWS.
 *
 * API shape it stands in for (same as PYTHON_FLOW):
 *   GET  /skills-lab/labs/data-analysis/session   -> flow.session
 *   GET  /skills-lab/labs/data-analysis/questions -> flow.questions (6)
 *   POST …/attempts/:attemptId/answers            -> correct + explanation
 *
 * ONLY what Figma draws is verbatim. Drawn: Q2 (trend line chart: question, chart, answers), Q3 (anomaly bar chart: everything
 * incl. hint, right explanation and the explanation for answer A), Q4 (scatter: question, chart, answers), the results modal copy.
 * Everything tagged ⚠️ ASSUMPTION below is invented to make the lab playable end to end, in the same voice.
 */

const kay = (value) => `${value}k`;

/* ---------- charts (values read off the Figma plots: bar 2.625 px per k, line/scatter 50 px per tick) ---------- */
const WEEKLY_SALES = {
  type: 'bar',
  title: 'Weekly sales',
  sub: 'GH₵ thousands · 6 Jan to 24 Feb 2025',
  chip: 'Week 5 is 21k above the 8-week average',
  max: 80,
  ticks: [0, 20, 40, 60, 80].map((value) => ({ value, label: kay(value) })),
  bars: [
    { label: 'Wk 1', value: 48 },
    { label: 'Wk 2', value: 52 },
    { label: 'Wk 3', value: 50 },
    { label: 'Wk 4', value: 54 },
    { label: 'Wk 5', value: 76, tone: 'alert' },
    { label: 'Wk 6', value: 53 },
    { label: 'Wk 7', value: 56 },
    { label: 'Wk 8', value: 51 },
  ].map((bar) => ({ ...bar, display: kay(bar.value) })),
  average: { value: 55, label: 'Average 55k' },
  // ⚠️ ASSUMPTION: accessible name for the figure, built from the values drawn.
  summary:
    'Wk 1 48k, Wk 2 52k, Wk 3 50k, Wk 4 54k, Wk 5 76k, Wk 6 53k, Wk 7 56k, Wk 8 51k. Average 55k.',
};

const MONTHLY_SIGNUPS = {
  type: 'line',
  title: 'Monthly sign-ups',
  sub: 'Thousands · Jan to Jun 2025',
  max: 3,
  ticks: [
    { value: 0, label: '0k' },
    { value: 0.75, label: '0.8k' },
    { value: 1.5, label: '1.5k' },
    { value: 2.25, label: '2.3k' },
    { value: 3, label: '3k' },
  ],
  points: [
    { label: 'Jan', value: 1.2, display: '1.2k' },
    { label: 'Feb', value: 1.5, display: '1.5k' },
    { label: 'Mar', value: 1.9, display: '1.9k' },
    { label: 'Apr', value: 2.4, display: '2.4k' },
    { label: 'May', value: 2.2, display: '2.2k', tone: 'warn' },
    { label: 'Jun', value: 2.9, display: '2.9k' },
  ],
  // ⚠️ ASSUMPTION: accessible name for the figure, built from the values drawn.
  summary: 'Jan 1.2k, Feb 1.5k, Mar 1.9k, Apr 2.4k, May 2.2k, Jun 2.9k.',
};

const AD_SPEND = {
  type: 'scatter',
  title: 'Ad spend vs sign-ups',
  sub: '10 regions · last month',
  max: 4,
  xMax: 13,
  ticks: [0, 1, 2, 3, 4].map((value) => ({ value, label: kay(value) })),
  xTicks: [
    { value: 0, label: 'GH₵0k' },
    { value: 4, label: 'GH₵4k' },
    { value: 8, label: 'GH₵8k' },
    { value: 12, label: 'GH₵12k' },
  ],
  // [ad spend GH₵k, sign-ups k] — read off the 10 dots of the Figma plot.
  points: [
    [2, 0.9],
    [3, 1.2],
    [4, 1.1],
    [5, 1.7],
    [6, 1.9],
    [7, 2.1],
    [8, 2.6],
    [9, 2.4],
    [10, 3.1],
    [12, 3.4],
  ].map(([x, y]) => ({ x, y })),
  trend: { x1: 1.5, y1: 0.74, x2: 12.8, y2: 3.26 },
  // ⚠️ ASSUMPTION: accessible name for the figure, built from the values drawn.
  summary:
    'Scatter plot of 10 regions with a rising dashed trend line. Ad spend (GH₵k, sign-ups k): 2 0.9, 3 1.2, 4 1.1, 5 1.7, 6 1.9, 7 2.1, 8 2.6, 9 2.4, 10 3.1, 12 3.4.',
};

// ⚠️ ASSUMPTION: Q1 chart (Figma only draws Q2–Q4).
const AIRTIME_SALES = {
  type: 'bar',
  title: 'Airtime sales',
  sub: 'GH₵ hundreds · one week in Tamale',
  max: 60,
  ticks: [0, 20, 40, 60].map((value) => ({ value, label: kay(value) })),
  bars: [
    { label: 'Mon', value: 32 },
    { label: 'Tue', value: 28 },
    { label: 'Wed', value: 41 },
    { label: 'Thu', value: 36 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 47 },
  ].map((bar) => ({ ...bar, display: kay(bar.value) })),
  average: null,
  summary: 'Mon 32k, Tue 28k, Wed 41k, Thu 36k, Fri 58k, Sat 47k.',
};

const DATA_QUESTIONS = [
  {
    // ⚠️ ASSUMPTION: the whole of Q1 (topic Reading charts per the SL-L12g results breakdown: Q1, Q2).
    id: 'da-1',
    kind: 'chart',
    topic: 'Reading charts',
    eyebrowTopic: 'Reading bars',
    title: [
      ['Which day ', false],
      ['sold the most?', true],
    ],
    prompt: 'A kiosk in Tamale tracks airtime sales each day.',
    body: { chart: AIRTIME_SALES, optionsLabel: 'WHICH DAY HAD THE TALLEST BAR?' },
    options: ['Wednesday', 'Friday', 'Saturday', 'Monday'],
    answer: 1,
    hint: 'Find the tallest bar, then read its label on the bottom axis.',
    explain: {
      right: 'Friday has the tallest bar, at 58k, so it sold the most.',
      wrong:
        'Friday has the tallest bar, at 58k. Read the label under the tallest bar, not the order of the days.',
    },
  },
  {
    // Drawn (SL-L12e): title, prompt, chart, label, four answers. ⚠️ ASSUMPTION: the correct answer (B), hint and explanations.
    id: 'da-2',
    kind: 'chart',
    topic: 'Reading charts',
    eyebrowTopic: 'Reading trends',
    title: [
      ['What’s the ', false],
      ['story', true],
      [' in this line?', false],
    ],
    prompt: 'A mobile money app tracks new sign-ups in Ghana each month.',
    body: { chart: MONTHLY_SIGNUPS, optionsLabel: 'WHICH SENTENCE DESCRIBES THE TREND BEST?' },
    options: [
      'Sign-ups are falling.',
      'Steady growth, with one small dip in May.',
      'Sign-ups are flat.',
      'Sign-ups double every month.',
    ],
    answer: 1,
    hint: 'Follow the line from January to June. Does it mostly rise, fall or stay level, and is there a month that breaks the pattern?',
    explain: {
      right: 'Sign-ups climb from 1.2k to 2.9k, with one small dip in May (2.2k after 2.4k).',
      wrong:
        'The line climbs from 1.2k in January to 2.9k in June. Only May dips (2.2k after 2.4k), so “steady growth, with one small dip” fits best.',
    },
  },
  {
    // Drawn (SL-L12a/b/c/d): everything. Right + wrong(A) + hint verbatim; wrong explanations for B-less options C and D are ⚠️ ASSUMPTIONS.
    id: 'da-3',
    kind: 'chart',
    topic: 'Spotting anomalies',
    title: [
      ['One week doesn’t fit. ', false],
      ['Why?', true],
    ],
    prompt:
      'A shop in Kumasi tracks weekly sales. Week 6 is back to normal, and finance confirms the Week 5 sales were real payments.',
    body: { chart: WEEKLY_SALES, optionsLabel: 'WHAT MOST LIKELY CAUSED THE WEEK 5 SPIKE?' },
    options: [
      'A public holiday raised foot traffic. It’s a demand signal, so update the forecast.',
      'A one-off bulk order from a corporate client. Real, but not a trend, so leave it out of the forecast.',
      'Tuesday’s sales were entered twice. It’s a data quality problem, not real sales.',
      'A competitor closed for good. It’s a lasting shift in the baseline.',
    ],
    answer: 1,
    hint: 'Look at Week 6. If the cause were lasting (a holiday season or a closed competitor), would sales drop straight back the next week?',
    explain: {
      right:
        'A one-off order is real money, but it won’t repeat. Report it, and leave it out of the forecast so next month isn’t inflated.',
      wrong:
        'A holiday would also lift the weeks around it, and Week 6 dropped straight back to normal. A single real spike that doesn’t repeat points to a one-off order.',
      wrongByOption: {
        // ⚠️ ASSUMPTION (C, D): same voice as the drawn explanation for A.
        2: 'Finance confirms the Week 5 sales were real payments, so this isn’t a data entry error. A single real spike that doesn’t repeat points to a one-off order.',
        3: 'A competitor closing for good would lift the weeks after it too, and Week 6 dropped straight back to normal. A single real spike that doesn’t repeat points to a one-off order.',
      },
    },
  },
  {
    // Drawn (SL-L12f): title, prompt, chart, label, four answers (B selected). ⚠️ ASSUMPTION: the correct answer (B), hint and explanations.
    id: 'da-4',
    kind: 'chart',
    topic: 'Correlation vs cause',
    title: [
      ['What can you ', false],
      ['honestly', true],
      [' conclude?', false],
    ],
    prompt:
      'Each dot is one region. It shows how much was spent on ads last month and how many people signed up.',
    body: { chart: AD_SPEND, optionsLabel: 'WHAT CAN YOU CONCLUDE FROM THIS CHART?' },
    options: [
      'More ad spend causes more sign-ups.',
      'Regions that spend more tend to get more sign-ups, but this chart alone can’t prove the ads caused it.',
      'There’s no relationship between the two.',
      'The company should stop spending on ads.',
    ],
    answer: 1,
    hint: 'The dots rise together, so there is a link. Then ask: could anything else explain it, and can one chart prove which way the cause runs?',
    explain: {
      right:
        'The dots rise together, so spend and sign-ups move together. But a chart like this can’t show that the ads caused it. Bigger regions could explain both.',
      wrong:
        'The dots clearly rise together, so there is a relationship. But a chart alone can’t prove the ads caused it, and it gives no reason to cut spending.',
    },
  },
  {
    // ⚠️ ASSUMPTION: the whole of Q5 (topic Summarising findings per the results breakdown: Q5, Q6).
    id: 'da-5',
    kind: 'choice',
    topic: 'Summarising findings',
    eyebrowTopic: 'Summarising findings',
    title: [
      ['Which summary ', false],
      ['is honest?', true],
    ],
    prompt:
      'A shop’s sales were 40k, 42k, 41k and then 60k in the festival month. The 60k was a one-off.',
    body: { optionsLabel: 'PICK THE BEST ONE-LINE SUMMARY' },
    options: [
      'Sales jumped to 60k, so expect 60k every month.',
      'Sales held near 41k, with one festival month at 60k.',
      'Sales are rising fast.',
      'Sales were poor until the festival.',
    ],
    answer: 1,
    hint: 'A good summary gives the usual level first, then flags the exception.',
    explain: {
      right: 'It gives the usual level (about 41k) and flags the one-off festival month.',
      wrong:
        'A summary should give the usual level (about 41k) and flag the one-off festival month, not treat 60k as the new normal.',
    },
  },
  {
    // ⚠️ ASSUMPTION: the whole of Q6.
    id: 'da-6',
    kind: 'choice',
    topic: 'Summarising findings',
    eyebrowTopic: 'Summarising findings',
    title: [
      ['Where does the ', false],
      ['main finding', true],
      [' go?', false],
    ],
    prompt: 'You are writing a one-page report for a busy shop owner.',
    body: { optionsLabel: 'WHERE SHOULD THE MAIN FINDING GO?' },
    options: [
      'First, in one plain sentence.',
      'At the very end, after all the charts.',
      'In a footnote.',
      'Only in the chart titles.',
    ],
    answer: 0,
    hint: 'A busy reader may only read the first line.',
    explain: {
      right: 'Lead with the finding in one plain sentence, then show the evidence.',
      wrong:
        'A busy reader may stop after the first line, so the main finding goes first, in one plain sentence.',
    },
  },
];

/* ---------- frame seeds: `?f=<code>` boots the state each Figma frame draws ---------- */
const OK3 = ['ok', 'ok'];
export const DATA_FRAMES = {
  L12a: { index: 2, results: OK3, status: 'selected', selected: 1, hintUsed: false, xp: 240 },
  L12e: { index: 1, results: ['ok'], status: 'playing', selected: null, hintUsed: false, xp: 240 },
  L12f: {
    index: 3,
    results: [...OK3, 'ok'],
    status: 'selected',
    selected: 1,
    hintUsed: false,
    xp: 240,
  },
  L12b: {
    index: 2,
    results: [...OK3, 'ok'],
    status: 'correct',
    selected: 1,
    hintUsed: false,
    xp: 250,
  },
  L12c: {
    index: 2,
    results: [...OK3, 'bad'],
    status: 'wrong',
    selected: 0,
    hintUsed: false,
    xp: 240,
  },
  L12d: { index: 2, results: OK3, status: 'playing', selected: null, hintUsed: true, xp: 235 },
  L12g: {
    index: 2,
    results: ['ok', 'ok', 'ok', 'bad', 'ok', 'ok'],
    status: 'finished',
    xp: 300,
    scenario: 'verified',
  },
  // ⚠️ ASSUMPTION: which of Q5 / Q6 was right (the modal draws Q1, Q2 strong; Q3, Q4, Q5-Q6 review; 3 of 6 and dots ok ok bad bad ok bad).
  L12h: {
    index: 2,
    results: ['ok', 'ok', 'bad', 'bad', 'ok', 'bad'],
    status: 'finished',
    xp: 255,
    scenario: 'fail',
  },
};

const DATA_FRAME_RESULTS = {
  verified: {
    earned: 60,
    topics: [
      { label: 'Reading charts', qs: 'Q1, Q2', strong: true },
      { label: 'Spotting anomalies', qs: 'Q3', strong: true },
      { label: 'Correlation vs cause', qs: 'Q4', strong: false },
      { label: 'Summarising findings', qs: 'Q5, Q6', strong: true },
    ],
    refresher: {
      title: 'Brush up on correlation vs cause',
      sub: '10-min lesson in My Learning',
      cta: 'Open',
    },
  },
  fail: {
    earned: 15,
    topics: [
      { label: 'Reading charts', qs: 'Q1, Q2', strong: true },
      { label: 'Spotting anomalies', qs: 'Q3', strong: false },
      { label: 'Correlation vs cause', qs: 'Q4', strong: false },
      { label: 'Summarising findings', qs: 'Q5, Q6', strong: false },
    ],
    refresher: {
      title: 'Practise first? Reading data, 15 min',
      sub: 'Anomalies, correlation and summaries',
      cta: 'Open',
    },
  },
};

// Refresher on a REAL run's results ({topic} = first topic to review, filled by the engine).
const DATA_REFRESHERS = {
  // ⚠️ ASSUMPTION: generic wording of the Figma "10-min lesson in My Learning" line for any review topic.
  verified: { title: 'Brush up on {topic}', sub: '10-min lesson in My Learning', cta: 'Open' },
  perfect: null,
  fail: DATA_FRAME_RESULTS.fail.refresher,
  // ⚠️ ASSUMPTION: tough run (≤ 1 of 6) is not drawn for this lab; mirrors the Python wording.
  tough: {
    title: 'Reading data refresher · 15 min',
    sub: 'Free in My Learning · built from your answers',
    cta: 'Open',
  },
};

// Results copy that differs from the shared Python wording (Figma SL-L12g / SL-L12h). Needs the one-line `flow.resultCopy`
// merge in useLabAttempt.buildResultView (see the report); perfect / tough fall back to the shared copy (⚠️ ASSUMPTION).
const DATA_RESULT_COPY = {
  verified: { body: '{n} of {total}. {title} now carries the Verified badge on your card.' },
  fail: {
    heading: [
      ['Almost ', false],
      ['there.', true],
    ],
    body: '{n} of {total}, and you need {passMark}. Nothing changes on your card until you pass. Retake with new charts whenever you’re ready.',
  },
};

export const DATA_ANALYSIS_FLOW = {
  id: 'data-analysis',
  title: 'Data analysis',
  headerTitle: 'Skills Lab · Data analysis',
  subtitle: '6 challenges · Pass 5 to earn Verified · Retake any time',
  sticker: 'PASS 5 = VERIFIED',
  total: 6,
  passMark: 5,
  hintCost: 5,
  correctXp: 10,
  // GET /skills-lab/labs/data-analysis/session — Kofi is on challenge 3 of 6 (SL-L12a header: 240 XP, 7-day streak).
  session: { index: 2, results: OK3, xp: 240, streakDays: 7 },
  questions: DATA_QUESTIONS,
  frames: DATA_FRAMES,
  frameResults: DATA_FRAME_RESULTS,
  refreshers: DATA_REFRESHERS,
  resultCopy: DATA_RESULT_COPY,
};

export const FLOWS = { 'data-analysis': DATA_ANALYSIS_FLOW };
