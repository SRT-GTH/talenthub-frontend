/*
 * Talent profile — mock data for the header, tab bar and the six tab bodies (P-01 .. P-06).
 * Every string / number below is verbatim from the Figma frames (file Bin8roWL8sloyc36IgFMuT,
 * Playful 7570:105 / 7571:190 / 7571:1007 / 7572:359 / 7572:1128 / 7572:1869 and the Focused
 * twins). Frontend-only; the shape is chosen so an API response can replace it. Icons are
 * referenced by KEY and mapped to the named components in the section files.
 * Strings keep Figma's double spaces ("  ·  ") — render with `whitespace-pre-wrap`.
 */

/* ------------------------------ header (all tabs) ------------------------------ */
export const PROFILE_HERO = {
  name: 'Kofi Agyekum',
  openToWork: 'Open to work',
  verified: 'Verified',
  level: 'Rising Talent · Lvl 4',
  handle: '@kofi.agyekum · he/him · joined Jul 2026',
  headline: 'Aspiring Data Analyst · BSc Statistics, KNUST · Accra, Ghana',
  pitch: { title: 'Watch my 60-sec pitch', meta: '0:58 · 112 plays' },
  chips: [
    { label: 'Internships · Graduate roles', icon: 'target', tone: 'green' },
    { label: 'Accra · Hybrid or remote', icon: 'pin', tone: 'white' },
    { label: 'English · Twi', icon: 'lang', tone: 'white' },
  ],
  actions: { preview: 'Preview as recruiter', share: 'Share profile' },
  stats: [
    { value: '47', label: 'views this week' },
    { value: '24', label: 'endorsements' },
    { value: '12', label: 'day streak', streak: true },
  ],
};

/* Tab bar. `count` chips: Overview (6) and About me (142) are hidden in every frame. */
export const PROFILE_TAB_LIST = [
  { key: 'overview', label: 'Overview' },
  { key: 'skills', label: 'Skills', count: '7' },
  { key: 'experience', label: 'Experience', count: '2' },
  { key: 'portfolio', label: 'Portfolio', count: '3' },
  { key: 'certs', label: 'Certs', count: '2' },
  { key: 'about', label: 'About me' },
];

/* ------------------------------ P-01 Overview ------------------------------ */
export const OVERVIEW_ABOUT = {
  title: 'About',
  link: 'Read more →',
  text: "Final-year Statistics student who turns messy data into clear decisions. I build dashboards in Power BI, clean data in Python and SQL, and I'm happiest when a chart finally makes a trotro route make sense. Looking for my first analyst role in Accra.",
  vibeLabel: 'My vibe',
  vibe: [
    { label: 'Analytical', icon: 'analytical' },
    { label: 'Calm under pressure', icon: 'calm' },
    { label: 'Team player', icon: 'team' },
    { label: 'Football · Afrobeats', icon: 'heart' },
  ],
};

/* Skill rows. `pct` = meter fill (Figma px / 300 on Overview, / 180 on the Skills tab). */
export const OVERVIEW_SKILLS = {
  title: 'Top skills',
  link: 'See all 7 →',
  items: [
    {
      key: 'data-analytics',
      icon: 'bar',
      name: 'Data analytics',
      chip: { label: 'Assessed', tone: 'green' },
      pct: 86,
      note: 'Top 10% · Advanced',
    },
    {
      key: 'sql',
      icon: 'dns',
      name: 'SQL',
      chip: { label: 'Skills Lab', tone: 'white' },
      pct: 78,
      note: 'Level 4 · 3 labs passed',
    },
    {
      key: 'python',
      icon: 'func',
      name: 'Python',
      chip: { label: 'Assessed', tone: 'green' },
      pct: 62,
      note: 'Intermediate',
    },
    {
      key: 'communication',
      icon: 'voice',
      name: 'Communication',
      chip: { label: 'Endorsed', tone: 'white' },
      pct: 70,
      note: '8 endorsements',
    },
  ],
};

export const OVERVIEW_EXPERIENCE = {
  title: 'Experience',
  link: 'See all 2 →',
  items: [
    {
      key: 'intern',
      icon: 'trend',
      iconBg: '#eaeffb',
      title: 'Data & Research Intern',
      meta: 'Ghana Statistical Service · Accra  ·  Jun – Aug 2025 · 3 mos',
      text: 'Cleaned 40k+ census survey rows and built the regional summary dashboard my team now uses weekly.',
      tags: ['SQL', 'Power BI', 'Excel'],
    },
    {
      key: 'ta',
      icon: 'grad',
      iconBg: '#faf4e8',
      title: 'Teaching Assistant, Intro to Statistics',
      meta: 'KNUST · Dept. of Statistics  ·  Sep 2024 – May 2025',
      text: 'Ran weekly tutorials for 120 first-years and made R practice sheets that cut re-sit rates.',
      tags: ['R', 'Public speaking'],
    },
  ],
};

/* Portfolio covers are drawn in code (Figma "cover/bars | line | dots"). */
export const OVERVIEW_PORTFOLIO = {
  title: 'Portfolio',
  link: 'See all 3 →',
  items: [
    {
      key: 'traffic',
      cover: 'bars',
      tag: 'Live demo ↗',
      title: 'Accra traffic dashboard',
      meta: 'Power BI · 2025',
    },
    {
      key: 'cocoa',
      cover: 'line',
      tag: 'Notebook',
      title: 'Cocoa price forecast',
      meta: 'Python · 2025',
    },
    {
      key: 'trotro',
      cover: 'dots',
      tag: 'Case study',
      title: 'Trotro fare survey',
      meta: 'Excel · R · 2024',
    },
  ],
};

export const PROFILE_STRENGTH = {
  title: 'Profile strength',
  pct: 82,
  sub: '3 steps to Top Talent',
  steps: [
    { key: 'pitch', label: 'Add your 60-sec pitch', done: true },
    { key: 'portfolio', label: 'Add a portfolio link', gain: '+6%' },
    { key: 'skill', label: 'Verify 1 more skill', gain: '+8%' },
    { key: 'endorse', label: 'Get 1 more endorsement', gain: '+4%' },
  ],
  cta: 'Finish my profile',
};

export const PROFILE_VIEWS = {
  title: 'Who’s looking',
  link: 'See all →',
  count: '47',
  label: 'views this week',
  trend: '↑ 38% vs last week',
  who: 'Recruiters from Accra Tech, MTN Ghana and 7 others viewed you',
  searchNote: 'You showed up in 34 recruiter searches',
};

export const PROFILE_GOAL = {
  title: 'My goal',
  headline: 'Land a Data Analyst role in Accra',
  detail: 'By June 2027 · GHS 4,000+ / month · hybrid',
  pct: 60,
  progress: '3 of 5 milestones · next: get shortlisted once',
};

export const PROFILE_BADGES = {
  title: 'Badges',
  link: 'All 9 →',
  items: [
    { key: 'sql', label: 'SQL Top 10%', bg: '#faf4e8', icon: 'trophy' },
    { key: 'verified', label: 'Verified Pro', bg: '#ebf1ec', icon: 'checkc' },
    { key: 'streak', label: '12-day streak', bg: '#fef5eb', icon: 'streak' },
    { key: 'quiz', label: 'Quiz Ace', bg: '#eaeffb', icon: 'bulb' },
  ],
};

/* ------------------------------ P-02 Skills ------------------------------ */
export const SKILLS_FILTERS = [
  { key: 'all', label: 'All 7' },
  { key: 'verified', label: 'Verified 5', icon: 'check' },
  { key: 'endorsed', label: 'Endorsed 1' },
  { key: 'self', label: 'Self-added 1' },
];
export const SKILLS_ADD = '+ Add a skill';

export const SKILL_GROUPS = [
  {
    key: 'verified',
    title: 'Verified',
    titleIcon: 'check',
    hint: 'Proven on GTH, recruiters trust these most',
    rows: [
      {
        key: 'data-analytics',
        icon: 'bar',
        name: 'Data analytics',
        chip: { label: 'Assessed', tone: 'green' },
        meta: 'Advanced · Top 10% of 2,340 talents  ·  Assessment · Sep 2026',
        pct: 86,
        faces: 0,
      },
      {
        key: 'sql',
        icon: 'dns',
        name: 'SQL',
        chip: { label: 'Skills Lab', tone: 'white' },
        meta: 'Level 4 of 5 · 3 labs passed  ·  Skills Lab · Oct 2026',
        pct: 78,
        faces: 2,
        endorsed: 'endorsed',
      },
      {
        key: 'python',
        icon: 'func',
        name: 'Python',
        chip: { label: 'Assessed', tone: 'green' },
        meta: 'Intermediate  ·  Assessment · Aug 2026',
        pct: 62,
        faces: 0,
      },
      {
        key: 'power-bi',
        icon: 'trend',
        name: 'Power BI',
        chip: { label: 'Skills Lab', tone: 'white' },
        meta: 'Level 3 of 5  ·  Skills Lab · Oct 2026',
        pct: 60,
        faces: 1,
        endorsed: 'endorsed',
      },
      {
        key: 'excel',
        icon: 'table',
        name: 'Excel',
        chip: { label: 'Assessed', tone: 'green' },
        meta: 'Advanced  ·  Assessment · Jul 2026',
        pct: 82,
        faces: 3,
        endorsed: 'endorsed',
      },
    ],
  },
  {
    key: 'endorsed',
    title: 'Endorsed',
    hint: 'Vouched for by people you’ve worked with',
    rows: [
      {
        key: 'communication',
        icon: 'voice',
        name: 'Communication',
        chip: { label: 'Endorsed', tone: 'white' },
        meta: '8 endorsements  ·  Ama Owusu, Dr. Mensah + 6',
        pct: 70,
        faces: 3,
        endorsed: '+5',
      },
    ],
  },
  {
    key: 'self',
    title: 'Self-added',
    hint: 'Not checked yet. Prove it to get the green tick',
    rows: [
      {
        key: 'figma',
        icon: null,
        name: 'Figma',
        chip: { label: 'Self-added', tone: 'white' },
        meta: 'Beginner  ·  Added by you · Aug 2026',
        pct: 35,
        self: true,
        cta: 'Prove it in Skills Lab →',
      },
    ],
  },
];

export const SKILLS_VERIFICATION = {
  title: 'How skills get the tick',
  rows: [
    { chip: { label: 'Assessed', tone: 'green', icon: true }, text: 'Passed a GTH assessment' },
    {
      chip: { label: 'Skills Lab', tone: 'white', icon: true },
      text: 'Cleared a hands-on lab or game',
    },
    {
      chip: { label: 'Endorsed', tone: 'white', icon: true },
      text: '3+ people you’ve worked with vouched',
    },
    {
      chip: { label: 'Self-added', tone: 'white' },
      text: 'Your word for now. Not shown in recruiter filters',
    },
  ],
};

export const SKILLS_IN_DEMAND = {
  title: 'Recruiters want',
  sub: 'Most searched skills for Data Analyst roles in Accra this month',
  rows: [
    { label: 'Power BI', share: '92% of searches', have: true },
    { label: 'SQL', share: '88% of searches', have: true },
    { label: 'Tableau', share: '41% of searches', have: false },
    { label: 'Data storytelling', share: '37% of searches', have: false },
  ],
  cta: 'Start a Tableau course →',
};

/* ------------------------------ P-03 Experience ------------------------------ */
export const EXPERIENCE_WORK = {
  title: 'Work & volunteering',
  add: '+ Add',
  items: [
    {
      key: 'intern',
      icon: 'trend',
      iconBg: '#eaeffb',
      title: 'Data & Research Intern',
      chips: [
        { label: 'Internship', tone: 'white' },
        { label: 'Reference available', tone: 'green', icon: true },
      ],
      org: 'Ghana Statistical Service · Accra · On-site',
      dates: 'Jun – Aug 2025 · 3 mos',
      bullets: [
        '•  Cleaned 40k+ census survey rows in SQL and Excel',
        '•  Built the regional summary dashboard in Power BI, now used weekly by 6 staff',
        '•  Presented findings to the deputy director',
      ],
      tags: ['SQL', 'Power BI', 'Excel'],
    },
    {
      key: 'ta',
      icon: 'grad',
      iconBg: '#faf4e8',
      title: 'Teaching Assistant, Intro to Statistics',
      chips: [{ label: 'Part-time', tone: 'white' }],
      org: 'KNUST · Dept. of Statistics · Kumasi',
      dates: 'Sep 2024 – May 2025 · 9 mos',
      bullets: [
        '•  Ran weekly tutorials for 120 first-years',
        '•  Made R practice sheets; re-sit rate dropped from 18% to 11%',
      ],
      tags: ['R', 'Public speaking'],
    },
    {
      key: 'volunteer',
      icon: 'laptop',
      iconBg: '#ebf1ec',
      title: 'Volunteer Data Lead',
      chips: [{ label: 'Volunteer', tone: 'white' }],
      org: 'Accra Youth Coding Club · Accra',
      dates: 'Jan 2023 – Dec 2024',
      bullets: ['•  Taught Saturday Excel & Python sessions to 40 SHS students'],
      tags: ['Python', 'Mentoring'],
    },
  ],
};

export const EXPERIENCE_EDUCATION = {
  title: 'Education',
  add: '+ Add',
  items: [
    {
      key: 'bsc',
      icon: 'bldg',
      iconBg: '#faf4e8',
      title: 'BSc Statistics',
      org: 'Kwame Nkrumah University of Science and Technology (KNUST)',
      meta: '2022 – 2026 (expected)  ·  Second Class Upper so far · Final project: forecasting cocoa prices',
    },
    {
      key: 'wassce',
      icon: 'company',
      iconBg: '#eaeffb',
      title: 'WASSCE · General Science',
      org: 'Achimota School · Accra',
      meta: '2018 – 2021  ·  Aggregate 9',
    },
  ],
};

export const EXPERIENCE_ADD = 'Add a role, gig, side hustle or volunteering';

export const EXPERIENCE_TIP = {
  sticker: 'Buddy tip',
  title: 'Numbers get noticed',
  text: 'Roles with a result in them (“cut re-sits from 18% to 11%”) get 2× more recruiter clicks. Your TA role already has one, your volunteer role doesn’t yet.',
  cta: 'Improve with Career Buddy',
};
export const EXPERIENCE_IMPORT = {
  title: 'Import from CV',
  text: 'Upload a PDF or Word CV and we’ll fill in roles and dates for you to check. Nothing is published until you say so.',
  cta: 'Upload CV',
};
export const EXPERIENCE_GAPS = {
  title: 'Career gaps?',
  text: 'Gaps are normal: NSS, exams, family, a break. Add a short note if you want; recruiters on GTH never see an unexplained-gap warning.',
};

/* ------------------------------ P-04 Portfolio ------------------------------ */
export const PORTFOLIO_FILTERS = [
  { key: 'all', label: 'All 3' },
  { key: 'dashboards', label: 'Dashboards 1' },
  { key: 'code', label: 'Code 1' },
  { key: 'research', label: 'Research 1' },
];
export const PORTFOLIO_SORT = 'Sort: Pinned first';
export const PORTFOLIO_ADD = '+ Add project';

export const PORTFOLIO_PROJECTS = [
  {
    key: 'traffic',
    cover: 'bars',
    category: 'dashboards',
    tag: 'Live demo ↗',
    pinned: true,
    title: 'Accra traffic dashboard',
    text: 'Power BI dashboard showing rush-hour congestion on 12 Accra corridors from 6 months of GPS pings. Picked up by a TV3 data segment.',
    tags: ['Power BI', 'SQL', 'DAX'],
    links: [
      { label: 'Live demo', icon: 'link' },
      { label: 'Write-up', icon: 'file' },
    ],
    stats: '312 views · 9 recruiter clicks',
  },
  {
    key: 'cocoa',
    cover: 'line',
    category: 'code',
    tag: 'Notebook',
    title: 'Cocoa price forecast',
    text: 'My final-year project: an ARIMA + XGBoost model forecasting Ghana cocoa farm-gate prices 3 months ahead, MAPE 6.2%.',
    tags: ['Python', 'pandas', 'scikit-learn'],
    links: [
      { label: 'GitHub', icon: 'laptop' },
      { label: 'Notebook', icon: 'note' },
    ],
    stats: '198 views · 4 recruiter clicks',
  },
  {
    key: 'trotro',
    cover: 'dots',
    category: 'research',
    tag: 'Case study',
    title: 'Trotro fare survey',
    text: 'Surveyed 420 commuters across Kaneshie, Circle and Madina on fare hikes; R analysis + a 2-page brief for the Assembly.',
    tags: ['R', 'Survey design', 'Excel'],
    links: [{ label: 'PDF brief', icon: 'file' }],
    stats: '87 views',
  },
];
export const PORTFOLIO_ADD_CARD = {
  title: 'Add a project',
  text: 'Dashboards, code, designs, research, a video, a side hustle. If you made it, it counts.',
};
export const PORTFOLIO_TIP =
  'Pin your best project. Pinned projects show first on your recruiter card and get ~3× more clicks.';

/* ------------------------------ P-05 Certs ------------------------------ */
export const CERTS_LIST = {
  title: 'Certifications',
  add: '+ Add',
  items: [
    {
      key: 'google',
      sealBg: '#eaeffb',
      title: 'Google Data Analytics Professional Certificate',
      chip: { label: 'Link verified', tone: 'green' },
      issuer: 'Google · via Coursera',
      meta: 'Issued Mar 2025 · No expiry  ·  Credential ID 8KQ2-PL7X',
      tags: ['Data cleaning', 'SQL', 'Tableau'],
      action: 'View credential ↗',
    },
    {
      key: 'sql',
      sealBg: '#ebf1ec',
      title: 'SQL · Level 4',
      chip: { label: 'GTH verified', tone: 'green' },
      issuer: 'Ghana Talent Hub Skills Lab',
      meta: 'Issued Oct 2026  ·  Auto-verified by GTH',
      tags: ['SQL', 'Joins', 'Window functions'],
      action: 'View credential ↗',
    },
  ],
};
export const CERTS_IN_PROGRESS = {
  title: 'In progress',
  hint: 'Only you can see these',
  item: {
    title: 'Microsoft Power BI Data Analyst (PL-300)',
    issuer: 'Microsoft Learn · Exam booked for 4 Dec 2026',
    pct: 60,
    progress: '6 of 10 study modules done · counts toward your goal',
    cta: 'Continue',
  },
};
export const CERTS_VERIFICATION = {
  title: 'How we check certs',
  rows: [
    {
      chip: { label: 'Link verified', tone: 'green', icon: true },
      text: 'We opened the issuer link and the name matches yours',
    },
    {
      chip: { label: 'GTH verified', tone: 'green', icon: true },
      text: 'Earned on GTH, nothing to check',
    },
    { chip: { label: 'Checking…', tone: 'white' }, text: 'Usually under 24 hours' },
    {
      chip: { label: 'Not verified', tone: 'white' },
      text: 'No link or file yet. Still shown, with a grey tag',
    },
  ],
};
export const CERTS_SUGGESTED = {
  title: 'Worth adding',
  rows: [
    {
      key: 'tableau',
      icon: 'bar',
      title: 'Tableau Desktop Specialist',
      sub: 'Free prep course in My Learning · 41% of analyst searches',
    },
    {
      key: 'python',
      icon: 'game',
      title: 'GTH Python Level 3 lab',
      sub: '15 min · you’re 1 lab away',
    },
  ],
};

/* ------------------------------ P-06 About me ------------------------------ */
export const ABOUT_PITCH = {
  title: 'My 60-sec pitch',
  link: 'Re-record',
  caption: '“Hi, I’m Kofi. I make numbers make sense…”',
  chip: '0:58 · CC on',
  stats: ['112 plays', 'Avg watch 47s (81%)', 'Transcript on for screen readers'],
};
export const ABOUT_BIO = {
  title: 'Bio',
  paragraphs: [
    "Final-year Statistics student at KNUST who turns messy data into clear decisions. I build dashboards in Power BI, clean data in Python and SQL, and I'm happiest when a chart finally makes a trotro route make sense.",
    'Outside data: Sunday football at Legon, Afrobeats playlists, and teaching SHS students Excel on Saturdays. Looking for my first analyst role in Accra where I can learn fast and ship things people use.',
  ],
};
/* `pos` = marker position along the track (Figma px / 562 minus the 22px marker). */
export const ABOUT_TRAITS = {
  title: 'How I work',
  chip: 'From your personality quiz',
  rows: [
    { key: 'analytical', left: 'Analytical', right: 'Intuitive', pos: 103.4 / 540 },
    { key: 'calm', left: 'Calm', right: 'Energetic', pos: 353 / 540 },
    { key: 'team', left: 'Team player', right: 'Solo', pos: 327 / 540 },
    { key: 'detail', left: 'Detail-focused', right: 'Big picture', pos: 186.6 / 540 },
  ],
};
export const ABOUT_GOALS = {
  title: 'Goals',
  items: [
    {
      key: 'role',
      icon: 'target',
      headline: 'Land a Data Analyst role in Accra',
      detail: 'By June 2027 · hybrid',
      primary: true,
    },
    { key: 'exam', icon: 'book', headline: 'Pass PL-300 (Power BI)', detail: 'By Dec 2026' },
  ],
  salary: 'Pay hope: GHS 4,000+ / mo · only you see this',
};
export const ABOUT_INTERESTS = {
  title: 'Into',
  chips: [
    { label: 'Data & analytics', icon: 'data' },
    { label: 'Fintech', icon: 'fintech' },
    { label: 'Agritech', icon: 'agritech' },
    { label: 'Smart cities', icon: 'city' },
    { label: 'Public speaking', icon: 'mic' },
    { label: 'Football', icon: 'heart' },
    { label: 'Afrobeats', icon: 'music' },
  ],
};
export const ABOUT_WORK_STYLE = {
  title: 'Work style',
  rows: [
    { label: 'Looking for', value: 'Internships · Graduate roles' },
    { label: 'Where', value: 'Accra · Hybrid or remote' },
    { label: 'Start', value: 'From Jul 2026 (after NSS)' },
    { label: 'Languages', value: 'English (fluent) · Twi (native) · French (basic)' },
  ],
};
