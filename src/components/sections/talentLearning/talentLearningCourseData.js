/*
 * Mock data for the Course agent's screens (ML-02 .. ML-05, QC-01 .. QC-05).
 * Every string is the verbatim Figma `characters` value (no invented copy). Where Focused and Playful
 * words differ, both are stored: `{ focused, playful }`. Swap for an API later, keep the shape.
 */

export const COURSE = {
  provider: 'GTH ACADEMY · BEGINNER',
  sticker: 'Closes your gap',
  title: 'Power BI Basics',
  blurb:
    'Turn spreadsheets into dashboards people actually read. Short videos, hands-on practice, one real project.',
  backLabel: 'Back to My Learning',
  crumb: '·  Recommended / Power BI Basics',
  meta: [
    { id: 'hours', label: '2 hours', icon: 'clock' },
    { id: 'modules', label: '6 modules', icon: 'layers' },
    { id: 'level', label: 'Beginner', icon: 'signal' },
    { id: 'price', label: 'Free', icon: 'gift' },
    { id: 'cert', label: 'Certificate', icon: 'award' },
  ],
  start: 'Start course',
  save: 'Save for later',
  saved: 'Saved',
  pace: 'Learn at your own pace. 15 min a day finishes it in 8 days.',
  insideTitle: 'What’s inside',
  insideMeta: '6 modules · 2h',
  modules: [
    {
      n: 1,
      title: 'Your first dashboard in 10 minutes',
      meta: 'Video + practice · 12 min',
      icon: 'play',
      tag: 'Start here',
      current: true,
    },
    {
      n: 2,
      title: 'Cleaning data with Power Query',
      meta: 'Video + practice · 22 min',
      icon: 'play',
    },
    { n: 3, title: 'Charts that tell a story', meta: 'Video + practice · 20 min', icon: 'play' },
    {
      n: 4,
      title: 'DAX basics: measures and totals',
      meta: 'Video + practice · 25 min',
      icon: 'play',
    },
    { n: 5, title: 'Quick check', meta: '5-question quiz · 10 min', icon: 'quiz' },
    {
      n: 6,
      title: 'Project: build a sales dashboard for a Kumasi shop',
      meta: 'Hands-on project · 30 min',
      icon: 'hammer',
      tag: 'Earns verified skill',
      project: true,
    },
  ],
  why: {
    eyebrow: 'WHY THIS COURSE',
    title: 'It’s the skill your top matches are missing',
    roles: [
      { title: 'Data Analyst · Accra Tech', delta: '82% → ~88%', mark: 'hex' },
      { title: 'BI Intern · Hubtel', delta: '74% → ~79%', mark: 'chat' },
    ],
  },
  earn: {
    title: 'What you’ll earn',
    items: [
      {
        id: 'skill',
        title: 'Power BI · verified skill',
        sub: 'Shows on your profile with a',
        icon: 'check',
        tint: 'bg-[#ebf1ec]',
      },
      {
        id: 'cert',
        title: 'GTH certificate',
        sub: 'Share to LinkedIn or download',
        icon: 'award',
        tint: 'bg-[#faf4e8]',
      },
      {
        id: 'pts',
        title: { focused: '+150 pts', playful: '+150 XP' },
        sub: 'Gets you to Level 5',
        icon: 'zap',
        tint: 'bg-[#ffd86b]',
      },
    ],
  },
  proof: '1,240 talents finished this · most in 8 days',
};

export const LESSON = {
  backLabel: 'SQL for Data Analysis',
  crumb: '·  Module 4 of 7 · Window functions',
  title: 'Window functions: rank without losing rows',
  code: [
    [
      ['SELECT', 'kw'],
      ['name, region, sales,', 'tx'],
    ],
    [
      ['  RANK()', 'fn'],
      ['OVER (', 'tx'],
      ['PARTITION BY', 'kw'],
      ['region', 'tx'],
    ],
    [
      ['    ORDER BY', 'kw'],
      ['sales DESC) AS rank', 'tx'],
    ],
    [
      ['FROM', 'kw'],
      ['shop_sales;', 'tx'],
    ],
  ],
  table: {
    head: ['name', 'region', 'rank'],
    rows: [
      ['Ama', 'Accra', '1'],
      ['Kojo', 'Accra', '2'],
      ['Esi', 'Kumasi', '1', true],
      ['Yaw', 'Kumasi', '2'],
    ],
  },
  tableTag: 'ranks restart per region',
  time: '11:48 / 14:30',
  speed: '1×',
  gate: {
    title: '3-question quick check to finish this module',
    body: 'Modules are marked done when you pass the check, not by ticking a box. You can retry as many times as you like.',
    cta: 'Take the quick check',
  },
  tabs: ['Notes', 'Transcript', 'Resources'],
  note: '06:12 · RANK() gives ties the same number, ROW_NUMBER() never does. Use RANK for leaderboards.',
  progress: {
    title: 'Course progress',
    summary: '3 of 7 modules done · 57%',
    pct: 57,
    modules: [
      { title: 'SELECT basics', state: 'done' },
      { title: 'Filtering with WHERE', state: 'done' },
      { title: 'JOINs that make sense', state: 'done' },
      { title: 'Window functions', state: 'current', right: '11 of 14 min' },
      { n: 5, title: 'CTEs and subqueries', state: 'todo' },
      { n: 6, title: 'Dates in SQL', state: 'todo' },
      { n: 7, title: 'Final project: Accra sales report', state: 'todo' },
    ],
  },
  buddy: {
    title: 'Stuck? Ask Career Buddy',
    placeholder: '“Explain PARTITION BY like I’m new”',
  },
};

export const QUIZ = {
  topLabel: 'Quick check · SQL Module 4',
  back: 'Back to lesson',
  head: 'Question 1 of 3',
  hint: 'Need a hint?',
  question:
    'You want to rank shops by sales within each region, so ranks restart for every region. Which one does that?',
  options: [
    { id: 'A', code: 'RANK() OVER (ORDER BY sales DESC)' },
    { id: 'B', code: 'RANK() OVER (PARTITION BY region ORDER BY sales DESC)' },
    { id: 'C', code: 'GROUP BY region ORDER BY sales DESC' },
    { id: 'D', code: 'ROW_NUMBER() OVER (ORDER BY region)' },
  ],
  answer: 'B',
  hintLine: 'Pick one answer. You can retry the whole check as many times as you like.',
  check: 'Check answer',
  correct: {
    title: 'Nice one!',
    body: 'PARTITION BY region restarts the ranking for every region.',
    cta: 'Continue',
  },
  wrong: {
    title: 'Not quite, no stress',
    body: 'ORDER BY on its own ranks every shop together. PARTITION BY region is what restarts it per region.',
    cta: 'Got it, next',
    rightAnswer: 'Right answer',
  },
  passed: {
    score: '3/3',
    tag: 'Module 4 complete',
    title: 'You nailed window functions',
    rewards: [
      { id: 'pts', label: { focused: '+30 pts', playful: '+30 XP' }, tone: 'bg-[#ffd86b]' },
      { id: 'streak', label: 'Streak kept · 13 days', tone: 'bg-[#faf4e8]', flame: true },
      { id: 'done', label: 'Course 71% done', tone: 'bg-[#ebf1ec]' },
    ],
    upNext: 'UP NEXT',
    upNextNum: '5',
    upNextTitle: 'Module 5 · CTEs and subqueries · 16 min',
    back: 'Back to course',
    start: 'Start module 5',
  },
  retry: {
    score: '1/3',
    tag: 'almost there',
    title: 'You need 2 of 3 to finish the module',
    body: 'No penalty and no limit. Rewatch the bits below and try again. Your streak still counts for today.',
    review: [
      { id: 'q1', title: 'Q1 · PARTITION BY', ok: true },
      { id: 'q2', title: 'Q2 · RANK vs ROW_NUMBER', ok: false, rewatch: 'Rewatch ' },
      { id: 'q3', title: 'Q3 · Ties in RANK()', ok: false, rewatch: 'Rewatch ' },
    ],
    rewatch: 'Rewatch the lesson',
    again: 'Try again',
    buddy: 'Ask Career Buddy to explain it differently',
  },
};

export const COMPLETE = {
  sticker: 'Level up! Level 5',
  title: 'Course complete!',
  sub: 'SQL for Data Analysis · passed the final check 8/10',
  changes: [
    {
      id: 'skill',
      title: 'SQL is now a verified skill on your profile',
      sub: 'Recruiters see the . Verified by GTH, not self-reported.',
      tint: 'bg-[#ebf1ec]',
      icon: 'check',
    },
    {
      id: 'match',
      title: 'Your Accra Tech match went up: 82% → 85%',
      sub: 'And 3 other matches got a boost too.',
      tint: 'bg-[#ffd86b]',
      icon: 'up',
    },
    {
      id: 'pts',
      title: { focused: '+200 pts · you’re now Level 5', playful: '+200 XP · you’re now Level 5' },
      sub: 'Next badge: finish 2 more courses',
      tint: 'bg-[#faf4e8]',
      icon: 'zap',
    },
  ],
  back: 'Back to My Learning',
  share: 'Share certificate',
  // Confetti confetti: centre (x, y) inside the modal, rotation, fill (from the Figma Rectangles).
  confetti: [
    { x: 50, y: 32, r: -20, c: '#ffd86b' },
    { x: 97, y: 158, r: 30, c: '#ffffff' },
    { x: 569, y: 39, r: -40, c: '#ffffff' },
    { x: 548, y: 186, r: 15, c: '#ffd86b' },
    { x: 78, y: 246, r: -60, c: '#ebf1ec' },
    { x: 529, y: 283, r: -10, c: '#ffd86b' },
  ],
};

export const CERT_HEAD = 'GHANA TALENT HUB · CERTIFICATE';
export const CERT_LEAD = 'This certifies that';
export const CERT_NAME = 'Kofi Agyekum';

export const CERTIFICATES = {
  banner: 'Every certificate has a verify link, so employers can check it’s real.',
  earned: '4 earned',
  share: 'Share',
  download: 'Download PDF',
  onProfile: 'On profile',
  newTag: 'New',
  items: [
    {
      id: 'sql',
      course: 'SQL for Data Analysis',
      date: '14 Oct 2026',
      link: 'gth.com/cert/7F3K2',
      isNew: true,
    },
    {
      id: 'product',
      course: 'Intro to Product Thinking',
      date: '12 May 2026',
      link: 'gth.com/cert/4QX9M',
    },
    { id: 'excel', course: 'Excel Essentials', date: '2 Apr 2026', link: 'gth.com/cert/8BD2L' },
    {
      id: 'comms',
      course: 'Workplace Communication',
      date: '18 Feb 2026',
      link: 'gth.com/cert/2RT7P',
    },
  ],
};
