/*
 * P-03 Opportunities data — copy verbatim from Figma 7797:27590 (desktop) / 7815:304934 (mobile) / 7815:306490 (filters sheet).
 */

export const HERO = {
  crumb: 'Opportunities',
  chip: '1,580+ live roles',
  title: 'Roles that fit you, \nall over Ghana.',
  subtitle:
    'Internships, graduate schemes, NSS placements, scholarships and first jobs. Sign up to see your fit score on every one.',
  queryPlaceholder: 'Role, skill or company',
  locationPlaceholder: 'Anywhere in Ghana',
  searchLabel: 'Search',
};

/* Type filter chips (counts as drawn). `id` is the URL value of ?type= */
export const TYPES = [
  { id: 'all', label: 'All', count: '1580' },
  { id: 'internships', label: 'Internships', count: '412' },
  { id: 'graduate-schemes', label: 'Graduate schemes', count: '96' },
  { id: 'nss', label: 'NSS placements', count: '220' },
  { id: 'scholarships', label: 'Scholarships', count: '84' },
  { id: 'part-time', label: 'Part-time', count: '310' },
  { id: 'remote', label: 'Remote', count: '140' },
];

/* Filter groups. `defaults` = the options drawn checked in Figma (used when the URL has no param for the group). */
export const FILTER_GROUPS = [
  {
    key: 'level',
    label: 'LEVEL',
    defaults: ['undergraduate', 'graduate'],
    options: [
      { id: 'student-shs', label: 'Student / SHS' },
      { id: 'undergraduate', label: 'Undergraduate' },
      { id: 'graduate', label: 'Graduate' },
      { id: 'early-career', label: 'Early career' },
    ],
  },
  {
    key: 'style',
    label: 'WORK STYLE',
    defaults: ['on-site', 'hybrid'],
    options: [
      { id: 'on-site', label: 'On-site' },
      { id: 'hybrid', label: 'Hybrid' },
      { id: 'remote', label: 'Remote' },
    ],
  },
  {
    key: 'region',
    label: 'REGION',
    defaults: ['greater-accra'],
    options: [
      { id: 'greater-accra', label: 'Greater Accra' },
      { id: 'ashanti', label: 'Ashanti' },
      { id: 'northern', label: 'Northern' },
      { id: 'western', label: 'Western' },
    ],
  },
];

export const PAY = { label: 'PAY (GH₵ / MONTH)', range: '2,000 – 8,000', fillRatio: 162 / 296 };

export const RESULTS = {
  head: '312 roles match your filters',
  sort: 'Sort: Best fit',
  count: '312',
  loadMore: 'Load more roles',
  sheetTitle: 'Filters',
  panelTitle: 'Filters',
  reset: 'Reset',
  showPrefix: 'Show',
  showSuffix: 'roles',
  filtersButton: 'Filters',
  fitLocked: 'Sign up to see your fit score',
  posted: 'Posted 2d ago',
  featured: 'FEATURED',
};

/* `kinds` = which type chips (?type=) the role belongs to (derived from the chip label drawn on the card). */
export const JOBS = [
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    meta: 'Hubtel · Accra · Hybrid',
    chip: 'Graduate',
    pay: 'GH₵ 9–13k',
    icon: 'wallet',
    featured: true,
    kinds: ['graduate-schemes'],
  },
  {
    id: 'data-analyst-intern',
    title: 'Data Analyst Intern',
    meta: 'MTN Ghana · Accra · Hybrid',
    chip: 'Internship',
    pay: 'Paid internship',
    icon: 'globe',
    kinds: ['internships'],
  },
  {
    id: 'analyst-trainee',
    title: 'Analyst Trainee',
    meta: 'Ecobank Ghana · Accra · On-site',
    chip: 'Graduate',
    pay: 'GH₵ 2.4–3.2k',
    icon: 'wallet',
    kinds: ['graduate-schemes'],
  },
  {
    id: 'marketing-graduate',
    title: 'Marketing Graduate',
    meta: 'Unilever Ghana · Tema · On-site',
    chip: 'Graduate scheme',
    pay: 'GH₵ 3.8–5.2k',
    icon: 'company',
    kinds: ['graduate-schemes'],
  },
  {
    id: 'agritech-field-associate',
    title: 'Agritech Field Associate',
    meta: 'Farmerline · Kumasi · Hybrid',
    chip: 'NSS placement',
    pay: 'GH₵ 3–4k',
    icon: 'map',
    kinds: ['nss'],
  },
  {
    id: 'pharmacy-operations-intern',
    title: 'Pharmacy Operations Intern',
    meta: 'mPharma · Accra · On-site',
    chip: 'Internship',
    pay: 'Paid internship',
    icon: 'heart',
    kinds: ['internships'],
  },
  {
    id: 'engineering-scholarship',
    title: 'Engineering Scholarship 2026',
    meta: 'Ghana Education Service · Nationwide',
    chip: 'Scholarship',
    pay: 'Full grant',
    icon: 'book',
    kinds: ['scholarships'],
  },
  {
    id: 'customer-experience-associate',
    title: 'Customer Experience Associate',
    meta: 'Telecel Ghana · Takoradi · On-site',
    chip: 'Early career',
    pay: 'GH₵ 2.8–3.6k',
    icon: 'globe',
    kinds: [],
  },
];

export const MATCHING = {
  chip: 'How matching works',
  title: 'Your fit score, explained.',
  subtitle: 'Four things go into every score. You always see the reasons.',
  cards: [
    {
      id: 'verified-skills',
      title: 'Verified skills',
      body: 'Skills with stronger evidence count for more.',
      tile: '#ffd86b',
      icon: 'bolt',
    },
    {
      id: 'personality-fit',
      title: 'Personality fit',
      body: 'How your working style suits the team.',
      tile: '#84cc16',
      icon: 'bulb',
    },
    {
      id: 'your-goals',
      title: 'Your goals',
      body: 'Role, place and pay you’re aiming for.',
      tile: '#f9c9b6',
      icon: 'target',
    },
    {
      id: 'readiness',
      title: 'Readiness',
      body: 'Your job readiness score and recent growth.',
      tile: '#ffd86b',
      icon: 'trend',
    },
  ],
};
