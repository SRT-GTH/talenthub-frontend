/*
 * agencyHomeData.js — MOCK data of the agency home (Figma 11.4.0a-d; shaped like the future GET /agency/home response).
 * Sample content only. Counts go through formatCount() in the components ("<5" rule). One marked block per concern.
 */

/* ===== BLOCK 1 · hero (default / first login / quota nearly used) ======================================================= */
export const HOME_HERO = {
  default: {
    title: 'Welcome back, {first}',
    subtitle:
      'Here’s your national picture: 1 data request in review, 6 days left on district access and 340 YouthStart applicants to review.',
    action: 'Customise',
  },
  firstLogin: {
    title: 'Welcome to GTH, {first}',
    subtitle:
      'Your MoU is active. Most agencies run their first query within a day. Here’s where to start.',
    action: 'Customise',
  },
  quota: {
    title: 'You’ve used {pct}% of this month’s query quota',
    subtitle:
      'Dashboards keep working at 100%, but new queries pause until {resets}. Ask your GTH contact to raise the MoU limit.',
    action: 'Request more quota',
  },
};

/* ===== BLOCK 2 · quick actions ========================================================================================== */
// tint: card fill; icon key into agencyHomeIcons. Metas verbatim from the frames.
export const QUICK_ACTIONS = {
  default: [
    {
      id: 'invite',
      title: 'Invite your analysts',
      meta: '3 analysts active',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/agency/settings?tab=analysts',
    },
    {
      id: 'query',
      title: 'Run a query',
      meta: '4 saved queries',
      icon: 'search',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/agency/queries',
    },
    {
      id: 'applicants',
      title: 'Review applicants',
      meta: '340 to review',
      icon: 'users',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/agency/applicants',
    },
    {
      id: 'programme',
      title: 'Post a programme',
      meta: '2 live',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/agency/programmes',
    },
  ],
  firstLogin: [
    {
      id: 'query',
      title: 'Run a query',
      meta: 'None saved yet',
      icon: 'search',
      tint: '#ebf1ec',
      ink: '#244a9f',
      to: '/agency/queries',
    },
    {
      id: 'national',
      title: 'Explore national data',
      meta: '16 regions · district detail',
      icon: 'map',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/agency/national',
    },
    {
      id: 'invite',
      title: 'Invite your analysts',
      meta: '2 analyst seats free',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/agency/settings?tab=analysts',
    },
    {
      id: 'programme',
      title: 'Post a programme',
      meta: 'Reach eligible talents',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/agency/programmes',
    },
  ],
  // The welcome modal / tour frames draw "4 saved queries" under "Run a query" (kept as drawn).
  firstLoginOverlay: [
    {
      id: 'query',
      title: 'Run a query',
      meta: '4 saved queries',
      icon: 'search',
      tint: '#ebf1ec',
      ink: '#244a9f',
      to: '/agency/queries',
    },
    {
      id: 'national',
      title: 'Explore national data',
      meta: '16 regions · district detail',
      icon: 'map',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/agency/national',
    },
    {
      id: 'invite',
      title: 'Invite your analysts',
      meta: '2 analyst seats free',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/agency/settings?tab=analysts',
    },
    {
      id: 'programme',
      title: 'Post a programme',
      meta: 'Reach eligible talents',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/agency/programmes',
    },
  ],
};

/* ===== BLOCK 3 · national snapshot (formatCount-ed in the component) ===================================================== */
export const NATIONAL_SNAPSHOT = {
  eyebrow: 'NATIONAL DATA',
  total: 219428,
  regions: 16,
  top: [
    { name: 'Greater Accra', count: 42310 },
    { name: 'Ashanti', count: 38540 },
    { name: 'Eastern', count: 16780 },
  ],
  readinessNote: 'readiness up 9% since July',
  action: 'Open national data',
  to: '/agency/national',
};

/* ===== BLOCK 4 · this month + next step ================================================================================= */
export const MONTH_STATS = {
  title: 'This month',
  csvExports: 18,
  dataRequests: 3,
  // Mini bar glyph (Figma Group 41232): three bars, heights as % of 64.
  bars: [
    { w: 128, h: 50, fill: '#f3f8f4', opacity: 1, x: 0 },
    { w: 128, h: 75, fill: '#a7f4bb', opacity: 0.5, x: 32 },
    { w: 128, h: 100, fill: '#00522b', opacity: 0.2, x: 137 },
  ],
};

export const NEXT_STEP = {
  eyebrow: 'Next step',
  title: 'Download before access ends',
  body: '“Youth unemployment by district” closes on 24 Oct. Downloads are logged.',
};

/* ===== BLOCK 5 · saved queries (GET /agency/queries?limit=4) ============================================================ */
export const SAVED_QUERIES = [
  {
    id: 'q-volta-tech',
    initials: 'VT',
    chip: { bg: '#c1e9c9', ink: '#32683a' },
    name: 'Volta tech, 18–24',
    dims: 'Region · interest · age',
    cadence: 'Monthly',
    result: 237,
    bar: 88,
    barFill: '#00522b',
    resultInk: '#1f4a2b',
    lastRun: '2026-10-18',
  },
  {
    id: 'q-neet',
    initials: 'ND',
    chip: { bg: '#a7f4bb', ink: '#1f4a2b' },
    name: 'NEET by district',
    dims: 'District · readiness',
    cadence: 'Monthly',
    result: 12410,
    bar: 77,
    barFill: '#43664d',
    resultInk: '#32683a',
    lastRun: '2026-10-16',
  },
  {
    id: 'q-agri-women',
    initials: 'WA',
    chip: { bg: '#fbe7b5', ink: '#5a430c' },
    name: 'Women in agribusiness',
    dims: 'Interest · gender',
    cadence: 'Weekly',
    result: 23210,
    bar: 92,
    barFill: '#00522b',
    resultInk: '#1f4a2b',
    lastRun: '2026-10-14',
  },
  {
    id: 'q-uw-placements',
    initials: 'UW',
    chip: { bg: '#e4e2dd', ink: '#716e65' },
    name: 'Upper West placements',
    dims: 'Region · outcomes',
    cadence: 'Paused',
    result: 3,
    bar: 25,
    barFill: '#b23b3b',
    resultInk: '#ad3327',
    lastRun: '2026-10-02',
  },
];

/* ===== BLOCK 6 · "Your MoU this month" limit cards ====================================================================== */
// Copy templates verbatim; {used}/{limit}/{resets} are filled from useAgencySession().
export const LIMIT_CARDS = [
  {
    id: 'queries',
    title: 'Queries run',
    body: '{used} of {limit} queries used. Resets on {resets}.',
    foot: 'Used this month',
    icon: 'eye',
  },
  {
    id: 'csvExports',
    title: 'CSV exports',
    body: '{used} of {limit} used. Every export is logged.',
    foot: 'Used this month',
    icon: 'shield',
  },
  {
    id: 'dataRequests',
    title: 'Data requests',
    body: '{used} of {limit} open requests used this quarter.',
    foot: 'Used this week',
    icon: 'sparkle',
  },
];

/* ===== BLOCK 7 · phone home (Figma 11.4.0d 8613:8) ====================================================================== */
export const MOBILE_HOME = {
  greeting: 'Good morning, ',
  sub: 'Here’s what needs you at {short} today.',
  org: 'NYA',
  mou: {
    title: 'MoU',
    sub: 'Your MoU is active',
    director: {
      title: 'Director · Efua Owusu',
      sub: 'Approved on 18 Oct',
      chip: 'Verified',
      tone: 'ok',
    },
    ref: {
      title: 'MoU · GTH-MOU-2026-004',
      sub: 'Ends 18 Oct 2027',
      chip: 'Verified',
      tone: 'warn',
    },
    docsLabel: 'MOU DOCUMENTS',
    docs: [
      { name: 'Signed MoU', chip: 'Verified', tone: 'ok' },
      { name: 'Letter of authority', chip: 'Accepted', tone: 'mint' },
      { name: 'Data protection officer', chip: 'Accepted', tone: 'mint' },
    ],
    note: 'Renewal due in October 2027.',
    action: 'View documents',
  },
  requests: {
    title: 'Data requests',
    sub: 'Decisions on your requests',
    tabs: [
      { id: 'pending', label: 'Pending · 1' },
      { id: 'approved', label: 'Approved · 2' },
    ],
    items: [
      {
        name: 'Youth unemployment by district',
        status: 'Approved · access ends in 6 days',
        tone: 'plain',
        action: 'Open',
      },
      {
        name: 'NSS placements by region',
        status: 'In review · day 3 of 10',
        tone: 'warn',
        action: 'View',
      },
      {
        name: 'Under-18 skills by school',
        status: 'Rejected · appeal by 2 Nov',
        tone: 'warn',
        action: 'View',
      },
    ],
    all: 'View all data requests',
  },
  programmes: {
    title: 'Live programmes',
    count: '4',
    sub: 'Grants, service and training',
    items: [
      {
        name: 'YouthStart Digital Grant',
        meta: 'Grant · national · Oct 2',
        chips: ['1,912 applicants', '+340 new'],
      },
      {
        name: 'Youth in Agribusiness',
        meta: 'Training · 3 regions · Sep 28',
        chips: ['412 applicants', '+38 new'],
      },
      {
        name: 'NSS Placement Matching',
        meta: 'National service · draft',
        chips: ['Opens 1 Dec', 'Draft'],
      },
      {
        name: 'Regional job fair · Ho',
        meta: 'Event · Volta · 14 Nov',
        chips: ['640 RSVPs', '+52 new'],
      },
    ],
    all: 'View all programmes',
  },
  applicants: {
    title: 'Applicants',
    sub: 'All programmes · last 30 days',
    windows: ['7d', '30d', '90d'],
    activeWindow: '30d',
    stages: [
      { label: 'Applied', n: 1912, pct: 100 },
      { label: 'Eligible', n: 940, from: '49% from prev.', pct: 49 },
      { label: 'Shortlisted', n: 410, from: '55% from prev.', pct: 21 },
      { label: 'Pitch day', n: 280, from: '67% from prev.', pct: 15 },
      { label: 'Grant offered', n: 2, from: '25% from prev.', pct: 1 },
      { label: 'Funded', n: 1, from: '50% from prev.', pct: 1 },
    ],
    notEligible: 'Not eligible · 970',
    withdrawn: 'Withdrawn · 22',
  },
  changes: {
    title: 'Saved query changes',
    sub: 'Your saved queries that moved this month.',
    set: 'Query set: NYA analysts',
    all: 'See all saved queries',
    movesLabel: 'Biggest moves',
    movesCount: '4 queries',
    moves: [
      {
        name: 'NEET by district',
        meta: '12,410 talents · all districts',
        tags: ['District', 'Readiness', 'Monthly'],
        delta: '+7%',
      },
      {
        name: 'Volta tech, 18–24',
        meta: '237 talents · Volta',
        tags: ['Region', 'Interest'],
        delta: '+2%',
      },
      {
        name: 'Upper West placements',
        meta: '<5 talents · paused',
        tags: ['Region', 'Outcome'],
        delta: '0%',
      },
      {
        name: 'Women in agribusiness',
        meta: '23,210 talents · national',
        tags: ['Readiness', 'Readiness'],
        delta: '+4%',
      },
      {
        name: 'Graduates by region',
        meta: '48,274 talents · national',
        tags: ['Education', 'Region'],
        delta: '+1%',
      },
    ],
    view: 'View',
    open: 'Open',
  },
  skills: {
    title: 'Readiness by skill',
    sub: 'National · all skills',
    legend: [
      { label: 'Hot', tone: 'hot' },
      { label: 'Warm', tone: 'warm' },
      { label: 'Cooling', tone: 'cool' },
    ],
    rows: [
      { name: 'Data Analysis', talents: 1206, delta: '+32%' },
      { name: 'Agriculture', talents: 980, delta: '+27%' },
      { name: 'Customer service', talents: 812, delta: '+22%' },
      { name: 'Solar installation', talents: 402, delta: '+18%' },
      { name: 'Teaching', talents: 688, delta: '+15%' },
    ],
    foot: 'Aggregated and anonymised — groups smaller than 5 people are never shown.',
  },
};
