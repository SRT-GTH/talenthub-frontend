/* ---- hub ---- */
/*
 * Hub mock data (Figma "Talent - Skills Lab" SL-01 … SL-09). Shaped like the API it will be swapped for:
 *   GET /skills-lab/labs            -> HUB_LABS_RESPONSE   { labs[], summary, weekly, nudge, popularForNewTalent[], closeMatches[] }
 *   GET /skills-lab/attempts        -> HUB_ATTEMPTS        (history table)
 *   GET /skills-lab/profile-scores  -> HUB_PROFILE_SCORES  (which verified scores recruiters can see)
 * Lab `status`: ready | in_progress | verified | cooldown | explore | new (the six "GTH · Lab card" variants).
 * Copy is verbatim from Figma; per-context description overrides live in `notes`.
 */
export const HUB_LABS_RESPONSE = {
  labs: [
    {
      id: 'python',
      title: 'Python',
      icon: 'function',
      categories: ['data'],
      unit: 'challenges',
      count: 8,
      minutes: 10,
      passMark: 6,
      description: 'Read code and predict the output: loops, lists, functions and errors.',
      status: 'in_progress',
      // Lab-card dots exactly as drawn (done, done, current, 5 upcoming); the continue card has its own result dots.
      cardDots: [
        'correct',
        'correct',
        'current',
        'upcoming',
        'upcoming',
        'upcoming',
        'upcoming',
        'upcoming',
      ],
      progress: {
        answered: 5,
        total: 8,
        minutesLeft: 6,
        results: ['correct', 'correct', 'review', 'correct'],
        correct: 3,
        toReview: 1,
        needed: 6,
      },
      notes: {},
    },
    {
      id: 'public-speaking',
      title: 'Public speaking',
      icon: 'mic',
      categories: ['people', 'design'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Open strong, cut the filler and structure a message that lands.',
      status: 'ready',
      notes: { design: 'Slides, structure and storytelling. Counts towards Design too.' },
    },
    {
      id: 'team-leadership',
      title: 'Team leadership',
      icon: 'users',
      categories: ['people'],
      unit: 'scenarios',
      count: 5,
      minutes: 6,
      passMark: 4,
      description: 'What would you do? Real workplace situations from Ghanaian teams.',
      status: 'ready',
      notes: {},
    },
    {
      id: 'sql',
      title: 'SQL',
      icon: 'dns',
      categories: ['data'],
      unit: 'challenges',
      count: 8,
      minutes: 10,
      passMark: 6,
      description: 'Perfect score on 2 Oct. Shows on your profile as Verified.',
      status: 'verified',
      score: '8/8',
      notes: { verifiedTab: 'Perfect score on 2 Oct. Top 15% in Greater Accra.' },
    },
    {
      id: 'excel-and-google-sheets',
      title: 'Excel and Google Sheets',
      icon: 'view-table',
      categories: ['data'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Verified on 28 Sep. Retake any time; your best score counts.',
      status: 'verified',
      score: '6/6',
      notes: { popular: 'Formulas, lookups and pivot tables on a real sales sheet.' },
    },
    {
      id: 'data-analysis',
      title: 'Data analysis',
      icon: 'chart-bar',
      categories: ['data'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Verified 5/6 on 14 Oct. You can retake to improve after the cooldown.',
      status: 'cooldown',
      score: '5/6',
      cooldown: { hours: 18 },
      notes: {
        verifiedTab: 'Verified 5/6 on 14 Oct. Retake to improve after the cooldown.',
        popular: 'Read charts, spot anomalies and pick the right conclusion.',
      },
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      icon: 'laptop',
      categories: ['data'],
      unit: 'challenges',
      count: 8,
      minutes: 10,
      passMark: 6,
      description: 'Predict what the code does: arrays, objects, async and the DOM.',
      status: 'explore',
      notes: {},
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX design',
      icon: 'image',
      categories: ['design'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Colour, hierarchy and layout choices on real product screens.',
      status: 'explore',
      notes: {},
    },
    {
      id: 'engineering-planning',
      title: 'Engineering planning',
      icon: 'calendar',
      categories: ['business'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Order tasks, spot dependencies and plan a release.',
      status: 'explore',
      notes: {},
    },
    {
      id: 'product-management',
      title: 'Product management',
      icon: 'target',
      categories: ['business'],
      unit: 'challenges',
      count: 6,
      minutes: 8,
      passMark: 5,
      description: 'Prioritise features with real numbers and trade-offs.',
      status: 'explore',
      notes: {},
    },
    {
      id: 'strategic-thinking',
      title: 'Strategic thinking',
      icon: 'compass',
      categories: ['business'],
      unit: 'puzzles',
      count: 5,
      minutes: 6,
      passMark: 4,
      description: 'Chess puzzles: spot the weak point and commit to the move.',
      status: 'new',
      notes: {},
    },
  ],
  summary: {
    verified: 3,
    total: 6,
    xp: 240,
    topLine: 'Top 15% for SQL in Greater Accra',
    labsTotal: 11,
    inProgress: 1,
    games: 20,
    bestResult: 'Top 15%',
    bestResultLab: 'SQL',
    labsTaken: 6,
  },
  weekly: {
    title: 'Excel speed run',
    xp: 50,
    detail: '5 quick questions · ends Sunday · 1,204 talents playing',
  },
  nudge: {
    title: 'Finish Python by Sunday',
    body: 'Talents who finish a lab within a week are twice as likely to pass.',
  },
  // SL-08: the labs "talents like you" pick first, with the chip drawn on each card.
  popularForNewTalent: [
    { id: 'excel-and-google-sheets', badge: 'Most picked' },
    { id: 'data-analysis', badge: 'Most picked' },
    { id: 'public-speaking', badge: 'Quick win · 8 min' },
  ],
  // SL-01e: when a search finds nothing, these are offered as "Close matches".
  closeMatches: ['ui-ux-design', 'public-speaking'],
};

export const HUB_CATEGORIES = [
  { id: 'data', label: 'Data and tech' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'people', label: 'People skills' },
];

// GET /skills-lab/attempts — newest first, as drawn in SL-07.
export const HUB_ATTEMPTS = [
  {
    id: 'a1',
    labId: 'python',
    date: 'Today',
    score: '3 / 4',
    result: 'in_progress',
    onProfile: false,
  },
  {
    id: 'a2',
    labId: 'data-analysis',
    date: '14 Oct',
    score: '5 / 6',
    result: 'verified',
    onProfile: true,
    cooldown: { hours: 18 },
  },
  { id: 'a3', labId: 'sql', date: '2 Oct', score: '8 / 8', result: 'perfect', onProfile: true },
  { id: 'a4', labId: 'python', date: '2 Oct', score: '4 / 8', result: 'not_yet', onProfile: false },
  {
    id: 'a5',
    labId: 'excel-and-google-sheets',
    date: '28 Sep',
    score: '6 / 6',
    result: 'verified',
    onProfile: true,
  },
  {
    id: 'a6',
    labId: 'public-speaking',
    date: '20 Sep',
    score: '3 / 6',
    result: 'not_yet',
    onProfile: false,
  },
];

// GET /skills-lab/profile-scores — which verified scores recruiters can see.
export const HUB_PROFILE_SCORES = [
  { labId: 'sql', label: 'SQL · 8/8', shown: true },
  { labId: 'excel-and-google-sheets', label: 'Excel and Google Sheets · 6/6', shown: true },
  { labId: 'data-analysis', label: 'Data analysis · 5/6', shown: false },
];

export const HUB_HOW_LABS_WORK = [
  { icon: 'repeat', text: 'Retake any time. Your best score counts.' },
  { icon: 'eye-off', text: 'A failed attempt never shows on your profile.' },
  { icon: 'hourglass', text: 'Need more time? Turn on extra time in Settings › Accessibility.' },
  {
    icon: 'shield',
    text: 'Questions are built from real work tasks and reviewed by people who do the job.',
  },
];
export const HUB_HOW_LABS_WORK_NEW = [
  ...HUB_HOW_LABS_WORK.slice(0, 3),
  {
    icon: 'wifi-off',
    text: 'Light on data. Labs save after every answer, so a dropped signal is fine.',
  },
];

export const HUB_COPY = {
  title: 'Skills Lab',
  subtitle:
    'Short challenges that prove what you can do. Pass once and the Verified badge goes on your profile.',
  historySubtitle: 'Every attempt, your scores and what shows on your profile.',
  loadingNote: 'Loading your labs. Saved progress is safe.',
};

export const hubLabById = (id) => HUB_LABS_RESPONSE.labs.find((l) => l.id === id);
export const hubLabMeta = (lab) =>
  `${lab.count} ${lab.unit} · ~${lab.minutes} min · pass ${lab.passMark} of ${lab.count}`;
/* ---- end hub ---- */

/* ---- dialogs ---- */

/*
 * Dialogs / toasts / help copy — Figma "Talent - Skills Lab" SL-M1 … SL-M6 (Playful 7853:12314 · 7853:13081 · 7853:13852 ·
 * 7854:13342 · 7854:14117 · 7854:14622, Focused 8110:489651 … 8110:491736), SL-T1 … SL-T4 (7854:14824 · 7854:15546 · 7854:16119 ·
 * 7854:16566 / 8110:491888 · 8110:492285 · 8110:492719 · 8110:493055) and HP (8376:502994 / 8376:503114).
 * Copy is verbatim from Figma; the two styles share every string except XP -> "pts" (see `{unit}`).
 */

// SL-M1 · How verification works — steps (icon keys map to SkillsLabDialogIcons).
export const SKILLS_LAB_HOW = {
  title: 'How verification works',
  steps: [
    {
      id: 'take',
      icon: 'play',
      title: 'Take a short lab',
      body: '6 to 8 challenges built from real work tasks. About 10 minutes.',
    },
    {
      id: 'pass',
      icon: 'target',
      title: 'Hit the pass mark',
      body: 'Get the pass mark (for example 6 of 8) and the skill is Verified.',
    },
    {
      id: 'private',
      icon: 'eyeoff',
      title: 'Fails stay private',
      body: 'Only passes show. Retake any time; your best score counts.',
    },
    {
      id: 'recruiters',
      icon: 'search',
      title: 'Recruiters filter by it',
      body: 'Verified skills rank you higher in search and matches.',
    },
  ],
  who: 'Questions are written with people who do the job and reviewed every quarter.',
  cta: 'Got it',
};

/*
 * SL-M2 · Add a skill. `GET /skills-lab/skills?q=` would return this shape. The first three rows are drawn in Figma
 * (typed "Java"); the rest are ASSUMPTION rows so other searches have something to match.
 */
export const SKILLS_LAB_ADD = {
  title: 'Add a skill',
  intro: 'Add skills from your profile to unlock their labs.',
  initialQuery: 'Java',
  initialSelected: 'javascript',
  initialLevel: 'intermediate',
  levelLabel: 'Your level in {skill}',
  chips: { available: 'Lab available', soon: 'Lab coming soon' },
  levels: [
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ],
  cancel: 'Cancel',
  submit: 'Add skill',
  searchLabel: 'Search skills',
};
export const SKILLS_LAB_SKILL_CATALOG = [
  { id: 'javascript', name: 'JavaScript', lab: true },
  { id: 'java', name: 'Java', lab: false },
  { id: 'java-android', name: 'Java (Android)', lab: false },
  // ⚠️ ASSUMPTION rows (not drawn in Figma)
  { id: 'typescript', name: 'TypeScript', lab: false },
  { id: 'react', name: 'React', lab: false },
  { id: 'excel', name: 'Excel', lab: true },
  { id: 'sql', name: 'SQL', lab: true },
  { id: 'python', name: 'Python', lab: true },
];

// SL-M3 · Suggest a lab.
export const SKILLS_LAB_SUGGEST = {
  title: 'Suggest a lab',
  intro: 'Popular requests ship first. We will let you know when yours is live.',
  topicLabel: 'Skill or topic',
  useLabel: 'How would you use it?',
  initialTopic: 'Video editing',
  initialUse: 'Editing short videos for brand pages',
  popularLabel: 'Most requested this month',
  popular: [
    { id: 'digital-marketing', topic: 'Digital marketing', votes: 412 },
    { id: 'accounting', topic: 'Accounting', votes: 356 },
    { id: 'video-editing', topic: 'Video editing', votes: 290 },
  ],
  cancel: 'Cancel',
  submit: 'Send suggestion',
};

// SL-M4 · Weekly challenge (`GET /skills-lab/weekly`). `{unit}` = XP (Playful) / pts (Focused).
export const SKILLS_LAB_WEEKLY = {
  id: 'excel-speed-run',
  title: 'Excel speed run',
  chips: ['5 questions', '2 min per question', 'Ends Sunday 11:59 pm', '+50 {unit}'],
  body: 'A quick weekly race on lookups and pivot tables. Speed counts, but every right answer scores.',
  board: {
    title: 'Greater Accra this week',
    playing: '1,204 playing',
    rows: [
      { rank: '1', name: 'Esi O.', score: '5/5 · 3:12' },
      { rank: '2', name: 'Yaw B.', score: '5/5 · 3:40' },
      { rank: '3', name: 'Abena K.', score: '5/5 · 4:05' },
      { rank: '—', name: 'You', score: 'Not played yet', you: true },
    ],
  },
  privacy:
    'Leaderboards are opt-in: only people who join are shown, by first name and initial. Under-18s aren’t listed.',
  later: 'Maybe later',
  start: 'Start challenge',
};

/* SL-M5 / SL-M6 (lab play screens). `{lab}`, `{n}`, `{challenge}`, `{total}` are filled by the lab flow; `{unit}` = XP / pts. */
export const SKILLS_LAB_RESTART = {
  title: 'Start {lab} from the beginning?',
  body: 'Your {n} correct answers in this attempt will be cleared. Past attempts and {unit} stay.',
  keep: 'Keep my progress',
  confirm: 'Start over',
};
export const SKILLS_LAB_LEAVE = {
  title: 'Leave the lab for now?',
  body: 'You are on challenge {challenge} of {total}. Your answers are saved, so you can pick up exactly here.',
  note: 'Leaving never counts as a fail.',
  keep: 'Keep going',
  confirm: 'Save and leave',
};

/* SL-T1 … SL-T4 — toasts (`?toast=suggestion|hidden|reminder|pdf`). `{topic}` = the suggested topic. */
export const SKILLS_LAB_TOASTS = {
  suggestion: {
    title: 'Thanks. Suggestion sent',
    body: 'We will tell you when {topic} is live.',
  },
  hidden: {
    title: 'Score hidden on your profile',
    body: 'Excel stays Verified. Only the 6/6 is hidden.',
  },
  reminder: {
    title: 'Reminder set for Saturday, 10 am',
    body: 'We will nudge you to finish Python.',
  },
  pdf: {
    title: 'Your PDF is downloading',
    body: 'Kofi-Agyekum-verified-skills.pdf · 180 KB',
  },
  undo: 'Undo',
};

/* HP — the same card as the default help pop-over with the "for this page" block swapped (identical text in Playful and
 * Focused; Figma 8376:502994 / 8376:503114). HelpPopover picks it via `home.helpPage === 'skills-lab'`. */
export const SKILLS_LAB_HELP_COPY = {
  title: 'Help',
  subtitle: 'Quick answers for the page you are on',
  search: 'Search help, e.g. verify a skill',
  pageLabel: 'FOR THIS PAGE · SKILLS LAB',
  page: [
    { label: 'How is a lab scored?', icon: 'help' },
    { label: 'Can I retake a lab?', icon: 'help' },
    { label: 'What if I lose connection mid-lab?', icon: 'help' },
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

/* ---- end dialogs ---- */

/* ---- details ---- */
/*
 * Lab details mock data (Figma SL-02 Python 7834:8424, SL-02b Public speaking 7852:229677, SL-02c Data analysis 7852:230161).
 * Shaped like `GET /skills-lab/labs/:id` (one payload per lab). Every string is verbatim Figma; `{xp}` is XP in Playful and
 * "pts" in Focused. Labs without a drawn frame fall back to `buildFallbackDetail(hubLab)` (⚠️ ASSUMPTION copy).
 *   icon        key of LAB_ICONS (hubShared.js): function | mic | chart-bar | …
 *   facts       chips under the headline: icon = list-bullet | stopwatch | flag | star | repeat
 *   start       the right-hand card; `kind` = resume (Resume lab + Start over) | ready (Start lab) | cooldown (disabled Retake + See it on my profile)
 *   recruiters  example of what recruiters see after a pass (skill row + "Verified" chip)
 *   attempts    table rows; `status` = the chip text (Resume | Private | Shown)
 */
const DETAIL_STEPS_COMMON = {
  learn: { title: 'Learn as you go', text: 'Every answer explains why. Hints cost 5 {xp}.' },
};

export const LAB_DETAILS = {
  python: {
    id: 'python',
    title: 'Python lab',
    sticker: 'In progress',
    breadcrumb: 'Skills Lab › Python · Read code and predict the output.',
    icon: 'function',
    headline: 'Prove you can read and reason about Python code.',
    facts: [
      { icon: 'list-bullet', text: '8 challenges' },
      { icon: 'stopwatch', text: 'About 10 min' },
      { icon: 'flag', text: 'Pass 6 of 8' },
      { icon: 'star', text: '+80 {xp} on a pass' },
      { icon: 'repeat', text: 'Unlimited retakes' },
    ],
    covers: [
      'Sets and sorting',
      'Loops and functions',
      'List comprehensions',
      'Error handling',
      'String formatting',
      'Dictionaries',
    ],
    steps: [
      { title: 'Read the code', text: 'Each challenge shows a short snippet from a real task.' },
      { title: 'Pick the output', text: 'Choose an answer, then check it. Keys 1 to 4 work too.' },
      DETAIL_STEPS_COMMON.learn,
      { title: 'Get Verified', text: 'Get 6 right and the badge goes on your profile.' },
    ],
    recruiters: { skill: 'Python', line: 'Verified in Skills Lab · 7 of 8 · Oct 2026' },
    attempts: [
      {
        date: 'Today, 9:14',
        result: 'In progress · challenge 5',
        score: '3 of 4',
        status: 'Resume',
      },
      { date: '2 Oct 2026', result: 'Not yet · practice run', score: '4 of 8', status: 'Private' },
    ],
    attemptsEmpty: null,
    start: {
      kind: 'resume',
      eyebrow: 'PICK UP WHERE YOU LEFT OFF',
      title: 'Challenge 5 of 8',
      body: '3 correct so far. 3 more and Python is Verified.',
      primary: 'Resume lab',
      secondary: 'Start over',
    },
    warmup: {
      title: 'Want a warm-up?',
      body: 'Python basics refresher · 15 min · free in My Learning.',
      link: 'Open the refresher',
    },
    accessibility: {
      title: 'Make it work for you',
      toggles: [
        { id: 'extra-time', label: 'Extra time', on: false },
        { id: 'read-aloud', label: 'Read questions aloud', on: false },
        { id: 'larger-text', label: 'Larger code text', on: true },
      ],
      link: 'More in Settings › Accessibility',
    },
  },
  'public-speaking': {
    id: 'public-speaking',
    title: 'Public speaking lab',
    sticker: 'Ready to verify',
    breadcrumb: 'Skills Lab › Public speaking · Open strong, cut the filler and land the message.',
    icon: 'mic',
    headline: 'Show you can structure a message people remember.',
    facts: [
      { icon: 'list-bullet', text: '6 challenges' },
      { icon: 'stopwatch', text: 'About 8 min' },
      { icon: 'flag', text: 'Pass 5 of 6' },
      { icon: 'star', text: '+60 {xp} on a pass' },
      { icon: 'repeat', text: 'Unlimited retakes' },
    ],
    covers: ['Strong openings', 'Cutting filler', 'Structure', 'Persuasion', 'Q and A'],
    steps: [
      {
        title: 'Read the situation',
        text: 'A real brief: a team update, a pitch or a class talk.',
      },
      {
        title: 'Build the answer',
        text: 'Order the parts, cut the filler or pick the best opening.',
      },
      DETAIL_STEPS_COMMON.learn,
      { title: 'Get Verified', text: 'Get 5 right and the badge goes on your profile.' },
    ],
    recruiters: { skill: 'Public speaking', line: 'Verified in Skills Lab · 6 of 6 · Oct 2026' },
    attempts: [],
    attemptsEmpty: 'No attempts yet. Your first try is private, pass or not.',
    start: {
      kind: 'ready',
      eyebrow: 'READY WHEN YOU ARE',
      title: 'About 8 minutes',
      body: 'You can pause any time. Progress saves after every answer.',
      primary: 'Start lab',
      secondary: null,
    },
    warmup: {
      title: 'Want a warm-up?',
      body: 'Speaking with confidence · 10 min · free in My Learning.',
      link: 'Open the refresher',
    },
    accessibility: {
      title: 'Make it work for you',
      toggles: [
        { id: 'extra-time', label: 'Extra time', on: false },
        { id: 'read-aloud', label: 'Read questions aloud', on: false },
        { id: 'larger-text', label: 'Larger text', on: true },
      ],
      link: 'More in Settings › Accessibility',
    },
  },
  'data-analysis': {
    id: 'data-analysis',
    title: 'Data analysis lab',
    sticker: 'Verified · 5/6',
    breadcrumb:
      'Skills Lab › Data analysis · Read charts, spot anomalies and pick the right conclusion.',
    icon: 'chart-bar',
    headline: 'You have proved you can read data and draw the right conclusion.',
    facts: [
      { icon: 'list-bullet', text: '6 challenges' },
      { icon: 'stopwatch', text: 'About 8 min' },
      { icon: 'flag', text: 'Pass 5 of 6' },
      { icon: 'star', text: 'Best: 5 of 6' },
      { icon: 'repeat', text: 'Retake in 18h' },
    ],
    covers: ['Trends', 'Correlation', 'Outliers', 'Averages', 'Charts that mislead'],
    steps: [
      {
        title: 'Read the chart',
        text: 'Each challenge uses a real dataset from a Ghanaian business.',
      },
      {
        title: 'Pick the conclusion',
        text: 'Choose the answer the data supports, not the one that sounds right.',
      },
      DETAIL_STEPS_COMMON.learn,
      { title: 'Keep it Verified', text: 'Retake to improve. Only your best score shows.' },
    ],
    recruiters: { skill: 'Data analysis', line: 'Verified in Skills Lab · 5 of 6 · Oct 2026' },
    attempts: [
      { date: '14 Oct 2026', result: 'Verified · 5 of 6', score: '5 of 6', status: 'Shown' },
      { date: '9 Oct 2026', result: 'Not yet · practice run', score: '3 of 6', status: 'Private' },
    ],
    attemptsEmpty: null,
    start: {
      kind: 'cooldown',
      eyebrow: 'VERIFIED ON 14 OCT',
      title: '5 of 6 · Verified',
      body: 'Want a perfect score? You can retake in 18 hours. Use the time to brush up on outliers.',
      primary: 'Retake in 18h',
      secondary: 'See it on my profile',
    },
    warmup: {
      title: 'Aim for 6 of 6',
      body: 'You missed the outliers question. Spotting outliers · 12 min · free in My Learning.',
      link: 'Open the refresher',
    },
    accessibility: {
      title: 'Make it work for you',
      toggles: [
        { id: 'extra-time', label: 'Extra time', on: false },
        { id: 'read-aloud', label: 'Read questions aloud', on: false },
        { id: 'larger-text', label: 'Larger chart labels', on: true },
      ],
      link: 'More in Settings › Accessibility',
    },
  },
};

/*
 * Fallback for labs whose details frame is not in Figma yet (e.g. SQL, UI/UX design …): built from the hub payload so every
 * lab card still opens a working page. ⚠️ ASSUMPTION — headline / steps / warm-up copy are generic, not from Figma.
 */
export const buildFallbackDetail = (lab) => {
  const unit =
    lab.unit === 'puzzles' ? 'puzzles' : lab.unit === 'scenarios' ? 'scenarios' : 'challenges';
  const verified = lab.status === 'verified' || lab.status === 'cooldown';
  return {
    id: lab.id,
    title: `${lab.title} lab`,
    sticker: verified
      ? `Verified · ${lab.score}`
      : lab.status === 'in_progress'
        ? 'In progress'
        : 'Ready to verify',
    breadcrumb: `Skills Lab › ${lab.title} · ${lab.description}`,
    icon: lab.icon,
    headline: `Show what you can do in ${lab.title}.`,
    facts: [
      { icon: 'list-bullet', text: `${lab.count} ${unit}` },
      { icon: 'stopwatch', text: `About ${lab.minutes} min` },
      { icon: 'flag', text: `Pass ${lab.passMark} of ${lab.count}` },
      { icon: 'repeat', text: 'Unlimited retakes' },
    ],
    covers: [],
    steps: [
      { title: 'Read the task', text: 'Each one comes from a real work situation.' },
      { title: 'Pick your answer', text: 'Choose an answer, then check it.' },
      DETAIL_STEPS_COMMON.learn,
      {
        title: 'Get Verified',
        text: `Get ${lab.passMark} right and the badge goes on your profile.`,
      },
    ],
    recruiters: { skill: lab.title, line: `Verified in Skills Lab · ${lab.count} of ${lab.count}` },
    attempts: [],
    attemptsEmpty: 'No attempts yet. Your first try is private, pass or not.',
    start: {
      kind: 'ready',
      eyebrow: 'READY WHEN YOU ARE',
      title: `About ${lab.minutes} minutes`,
      body: 'You can pause any time. Progress saves after every answer.',
      primary: 'Start lab',
      secondary: null,
    },
    warmup: {
      title: 'Want a warm-up?',
      body: `${lab.title} basics · free in My Learning.`,
      link: 'Open the refresher',
    },
    accessibility: LAB_DETAILS.python.accessibility,
  };
};

// GET /skills-lab/labs/:id
export const getLabDetail = (labId) => {
  if (LAB_DETAILS[labId]) return LAB_DETAILS[labId];
  const lab = hubLabById(labId);
  return lab ? buildFallbackDetail(lab) : null;
};
/* ---- end details ---- */
