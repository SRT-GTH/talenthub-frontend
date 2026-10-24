/*
 * uiGalleryData.js — sample content of the dev-only UI gallery (/data/_ui). Every figure is sample data copied from the Theme 8 frames
 * (overview 8.2.1a 8487:345935, mobile 8507:9) so the built primitives can be compared with the Figma nodes. Not used by any real screen.
 */

/* ===== BLOCK 1 · overview hero + KPI tiles ============================================================================= */
export const GALLERY_HERO = {
  eyebrow: 'Total registered talents',
  count: 219428,
  label: 'Ghanaian talents, discovered.',
  change: { pct: 42, suffix: 'vs last quarter' },
  note: '+64,120 in the last 90 days',
  noteShort: '+64,120 in 90 days',
};

export const GALLERY_KPIS = [
  {
    id: 'placements',
    eyebrow: 'Placements made',
    eyebrowShort: 'Placements',
    count: 4218,
    sub: 'Talents matched into jobs, internships and training through GTH.',
    subShort: 'Jobs, internships, training',
  },
  {
    id: 'scholarships',
    eyebrow: 'Scholarships surfaced',
    eyebrowShort: 'Scholarships',
    value: 'GHS 2.4M',
    sub: 'Funding matched to eligible talents in the last 12 months.',
    subShort: 'Last 12 months',
  },
  {
    id: 'partners',
    eyebrow: 'Active partners',
    eyebrowShort: 'Active partners',
    count: 185,
    sub: '127 schools · 34 universities · 18 NGOs · 6 government agencies.',
    subShort: '127 schools · 34 unis · 24 other',
  },
];

/* ===== BLOCK 2 · bars ================================================================================================== */
export const GALLERY_INTERESTS = [
  ['Technology', 48320],
  ['Business & Finance', 36790],
  ['Health & Medical', 32850],
  ['Creative & Media', 28120],
  ['Education & Training', 25140],
  ['Agriculture & Agribusiness', 23210],
  ['Engineering & Construction', 20340],
  ['Hospitality & Tourism', 17420],
  ['Entrepreneurship', 15480],
  ['Public Service & Policy', 11650],
].map(([label, count]) => ({ label, count }));

export const GALLERY_CAPABILITIES = [
  ['Technical', 41],
  ['Creative', 22],
  ['Analytical', 18],
  ['Social / caring', 13],
  ['Still exploring', 6],
].map(([label, pct]) => ({ label, pct }));

export const GALLERY_EDUCATION = {
  total: 219428,
  segments: [
    { key: 'pre', label: 'Pre-tertiary', count: 100937, tone: 'dark' },
    { key: 'in', label: 'In-tertiary', count: 70217, tone: 'mid' },
    { key: 'post', label: 'Post-tertiary', count: 48274, tone: 'light' },
  ],
};

export const GALLERY_GENDER = {
  total: 219428,
  segments: [
    { key: 'female', label: 'Female', count: 105325, tone: 'green' },
    { key: 'male', label: 'Male', count: 111908, tone: 'blue' },
    { key: 'not-shared', label: 'Not shared', count: 2195, tone: 'neutral' },
  ],
};

export const GALLERY_AGES = [
  { key: '14-17', label: '14–17', count: 39497 },
  { key: '18-24', label: '18–24', count: 92160 },
  { key: '25-29', label: '25–29', count: 61440 },
  { key: '30-35', label: '30–35', count: 26331 },
];

/* ===== BLOCK 3 · today strip =========================================================================================== */
export const GALLERY_TODAY = [
  { key: 'signups', value: 328, prefix: '+', label: 'New sign-ups', labelShort: 'Sign-ups' },
  { key: 'assessments', value: 1247, label: 'Assessments taken', labelShort: 'Assessments' },
  { key: 'matches', value: 82, label: 'Matches made', labelShort: 'Matches' },
  { key: 'opportunities', value: 14, label: 'Opportunities posted', labelShort: 'Opportunities' },
];

export const GALLERY_RANGE_OPTIONS = [
  { id: '90d', label: 'Last 90 days' },
  { id: '12m', label: 'Last 12 months' },
  { id: 'all', label: 'All time' },
];
