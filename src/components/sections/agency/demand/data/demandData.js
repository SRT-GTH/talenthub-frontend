/*
 * demandData.js — API-shaped mock data of the agency "Demand & outcomes" screens (Figma 11.4.5a-p). SAMPLE CONTENT ONLY.
 * Future endpoints (shape only, no calls): GET /agency/demand/skills · /agency/demand/trends · /agency/demand/success.
 * Counts under 5 are stored as real numbers here and ALWAYS printed through formatCount() / SuppressedValue by the components.
 * One marked block per concern.
 */

export const DATA_AS_OF = 'Data as of 18 Oct 2026, 09:00';

/* ===== BLOCK 1 · page copy ================================================================================================ */
export const DEMAND_VIEWS = [
  { id: 'skills', label: 'Skill demand' },
  { id: 'trends', label: 'Trends' },
  { id: 'success', label: 'Success rates' },
];

export const HERO_SUBTITLE = {
  skills:
    'What employers and programmes are asking for, how it is changing and what happens to applicants. Data as of 18 Oct 2026, 09:00. Groups under 5 are hidden.',
  trends:
    'How talent, opportunities, skills and assessments change over time. Each chart has its own scale. Data as of 18 Oct 2026, 09:00.',
  success:
    'How many applicants end up hired or placed, where people drop off and which programmes work best. Data as of 18 Oct 2026, 09:00. Groups under 5 are hidden.',
};

export const COMPACT_SUBTITLE = 'Data as of 18 Oct 2026, 09:00 · groups under 5 hidden';

export const PRIVACY_FOOTNOTE =
  'Opportunities come from verified recruiters and government programmes on GTH. Districts with fewer than 5 opportunities show as “Too few opportunities to show”. Every view is logged.';

export const SUCCESS_FOOTNOTE =
  'Success means hired for recruiter roles and placed for government programmes. Groups under 5 show as <5, also after filters are combined. Other agencies’ programmes show as totals only.';

/* ===== BLOCK 2 · filter menus ============================================================================================= */
export const CATEGORIES = [
  'Technology',
  'Business',
  'Finance',
  'Creative arts',
  'Trades',
  'Health',
  'Agriculture',
  'Education',
  'Hospitality',
  'Engineering',
  'Public service',
  'Logistics',
  'Retail',
  'Manufacturing',
].map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), label }));

export const PERIODS = [
  { id: 'quarter', label: 'Last quarter' },
  { id: '30d', label: 'Last 30 days' },
  { id: '12m', label: 'Last 12 months' },
];

export const PROGRAMMES = [
  { id: 'youth-in-digital-skills', label: 'Youth in Digital Skills' },
  { id: 'youth-in-solar-installation', label: 'Youth in Solar Installation' },
  { id: 'youth-in-agribusiness', label: 'Youth in Agribusiness' },
  { id: 'youth-summer-internship', label: 'Youth Summer Internship' },
  { id: 'youth-enterprise-bootcamp', label: 'Youth Enterprise Bootcamp' },
];

/** ⚠️ ASSUMPTION: Figma draws no open District menu; the list is the districts of the chosen region (constants/ghanaDistricts). */
export const EXTRA_DISTRICTS = [{ id: 'bunkpurugu-nakpanduri', label: 'Bunkpurugu-Nakpanduri' }];

/** The two chips frame 11.4.5d draws when the URL only says state=empty. */
export const EMPTY_FILTERS = { district: 'bunkpurugu-nakpanduri', category: 'creative-arts' };

/* ===== BLOCK 3 · skill demand (11.4.5a-d, m) ============================================================================== */
export const SKILLS = [
  {
    id: 'data-analysis',
    name: 'Data analysis',
    category: 'Technology',
    count: 612,
    share: 15.6,
    growth: 38,
  },
  {
    id: 'customer-service',
    name: 'Customer service',
    category: 'Business',
    count: 548,
    share: 14.0,
    growth: 4,
  },
  {
    id: 'digital-marketing',
    name: 'Digital marketing',
    category: 'Business',
    count: 486,
    share: 12.4,
    growth: 21,
  },
  {
    id: 'software-development',
    name: 'Software development',
    category: 'Technology',
    count: 451,
    share: 11.5,
    growth: 12,
  },
  {
    id: 'accounting-bookkeeping',
    name: 'Accounting & bookkeeping',
    category: 'Finance',
    count: 402,
    share: 10.3,
    growth: -3,
  },
  { id: 'sales', name: 'Sales', category: 'Business', count: 377, share: 9.6, growth: -6 },
  {
    id: 'project-coordination',
    name: 'Project coordination',
    category: 'Business',
    count: 318,
    share: 8.1,
    growth: 9,
  },
  {
    id: 'graphic-design',
    name: 'Graphic design',
    category: 'Creative',
    count: 264,
    share: 6.7,
    growth: 2,
  },
  {
    id: 'electrical-installation',
    name: 'Electrical installation',
    category: 'Trades',
    count: 231,
    share: 5.9,
    growth: 17,
  },
  {
    id: 'nursing-care',
    name: 'Nursing care',
    category: 'Health',
    count: 208,
    share: 5.3,
    growth: -1,
  },
];

/** Short names the phone / tablet card draws ("Software dev.", "Accounting"). */
export const SHORT_SKILL_NAMES = {
  'software-development': 'Software dev.',
  'accounting-bookkeeping': 'Accounting',
};

export const EMERGING_SKILLS = [
  { id: 'solar-pv-installation', name: 'Solar PV installation', category: 'Trades', count: 46 },
  { id: 'cybersecurity-basics', name: 'Cybersecurity basics', category: 'Technology', count: 38 },
  { id: 'generative-ai-tools', name: 'Generative AI tools', category: 'Technology', count: 31 },
  { id: 'cocoa-traceability', name: 'Cocoa traceability', category: 'Agriculture', count: 24 },
  {
    id: 'mobile-money-operations',
    name: 'Mobile money operations',
    category: 'Finance',
    count: 19,
  },
  { id: 'drone-crop-spraying', name: 'Drone crop spraying', category: 'Agriculture', count: 12 },
];

/** Talents per open opportunity; bar = value / 24 (Figma track 820: 2.4 -> 82px). Shortage < 3.5. */
export const SUPPLY_DEMAND = [
  {
    id: 'electrical-installation',
    compact: true,
    name: 'Electrical installation',
    ratio: 2.4,
    tag: 'Shortage',
  },
  { id: 'nursing-care', compact: true, name: 'Nursing care', ratio: 2.8, tag: 'Shortage' },
  { id: 'data-analysis', compact: true, name: 'Data analysis', ratio: 3.1, tag: 'Shortage' },
  { id: 'software-development', name: 'Software development', ratio: 4.2, tag: 'Tight' },
  { id: 'project-coordination', name: 'Project coordination', ratio: 9.1, tag: 'Balanced' },
  { id: 'graphic-design', name: 'Graphic design', ratio: 18.3, tag: 'Surplus' },
  { id: 'customer-service', compact: true, name: 'Customer service', ratio: 21.6, tag: 'Surplus' },
];
export const SUPPLY_MAX = 24;

export const NATIONAL_KPIS = {
  hero: {
    eyebrow: 'Opportunities posted',
    count: 3912,
    label: 'Open roles and programme places, last quarter.',
    change: { pct: 18, suffix: 'vs last quarter' },
    note: '+596 in the last 30 days',
    series: [8, 9, 9, 11, 10, 12, 13, 12, 15, 16, 15, 18, 20, 19, 22, 24, 23, 27, 30, 29, 34, 38],
  },
  tiles: [
    {
      eyebrow: 'Skills tracked',
      value: '412',
      sub: 'Across 14 categories, taken from employer and programme opportunities.',
    },
    {
      eyebrow: 'Fastest-growing skill',
      value: 'Data analysis',
      sub: '▲ +38% opportunities vs last quarter, the biggest rise of any skill.',
    },
    {
      eyebrow: 'Top category',
      value: 'Technology',
      sub: '31% of all opportunities · 1,212 roles and places.',
    },
  ],
  compact: [
    { eyebrow: 'Opportunities posted', value: '3,912', sub: '▲ +18%', tone: 'up' },
    { eyebrow: 'Skills tracked', value: '412', sub: '14 categories' },
    { eyebrow: 'Fastest-growing', value: 'Data analysis', sub: '▲ +38%', tone: 'up', small: true },
    { eyebrow: 'Top category', value: 'Technology', sub: '31% of opportunities', small: true },
  ],
  result: '3,912 opportunities · 412 skills',
  topRegions: [
    { id: 'greater-accra', count: 1486 },
    { id: 'ashanti', count: 842 },
    { id: 'western', count: 356 },
    { id: 'eastern', count: 298 },
    { id: 'northern', count: 214 },
  ],
  mapHint: 'Opportunities posted · click a region for its districts',
  topNote: 'Hover a bar for share and growth. Click to filter the page.',
  supplyHint: 'Talents with the skill for every open opportunity · national average 9.4',
};

/** One skill selected (11.4.5b, 11.4.5m). ⚠️ ASSUMPTION: skills Figma does not draw are derived from the national row. */
export const SKILL_FOCUS = {
  'data-analysis': {
    heroLabel: '15.6% of all opportunities last quarter.',
    count: 612,
    change: { pct: 38, suffix: 'vs last quarter' },
    note: '+168 in the last 30 days',
    badge: null,
    tiles: [
      {
        eyebrow: 'Talents with this skill',
        value: '1,904',
        sub: 'Verified through an assessment or certificate.',
      },
      {
        eyebrow: 'Talents per opportunity',
        value: '3.1',
        sub: '▼ Shortage · national average is 9.4.',
      },
      {
        eyebrow: 'Top hiring region',
        value: 'Greater Accra',
        sub: '58% of Data analysis opportunities · 355 roles.',
      },
    ],
    topRegions: [
      { id: 'greater-accra', count: 355 },
      { id: 'ashanti', count: 121 },
      { id: 'western', count: 48 },
      { id: 'eastern', count: 39 },
      { id: 'northern', count: 22 },
    ],
    topNote: 'Data analysis is selected. The whole page is filtered to it.',
    mapHint: 'Opportunities for this skill · click a region for its districts',
  },
  'drone-crop-spraying': {
    heroLabel: 'A new skill this quarter. Most regions have too few opportunities to show.',
    count: 12,
    change: null,
    note: 'All 12 posted in the last 60 days',
    badge: 'New this quarter',
    tiles: [
      {
        eyebrow: 'Talents with this skill',
        value: '1,904',
        sub: 'Verified through an assessment or certificate.',
      },
      {
        eyebrow: 'Talents per opportunity',
        value: '3.1',
        sub: '▼ Shortage · national average is 9.4.',
      },
      {
        eyebrow: 'Top hiring region',
        value: 'Greater Accra',
        sub: '58% of Data analysis opportunities · 355 roles.',
      },
    ],
    topRegions: [
      { id: 'northern', count: 7 },
      { id: 'upper-east', count: 5 },
      { id: 'savannah', count: 3 },
      { id: 'bono-east', count: 2 },
      { id: 'upper-west', count: 1 },
    ],
    topNote: 'Drone crop spraying is selected. It has 12 opportunities in total.',
    mapHint: 'Regions under 5 opportunities are greyed out',
  },
};

/* ===== BLOCK 4 · region drill-down (11.4.5c) ============================================================================== */
export const NORTHERN = {
  regionId: 'northern',
  hero: {
    eyebrow: 'Opportunities posted · Northern',
    count: 214,
    label: '5.5% of national opportunities last quarter.',
    change: { pct: 9, suffix: 'vs last quarter' },
    note: '+31 in the last 30 days',
  },
  tiles: [
    {
      eyebrow: 'Skills tracked',
      value: '96',
      sub: 'Skills with at least 5 opportunities are named. The rest are grouped.',
    },
    {
      eyebrow: 'Fastest-growing skill',
      value: 'Solar PV',
      sub: '▲ +52% opportunities vs last quarter.',
    },
    {
      eyebrow: 'Top category',
      value: 'Agriculture',
      sub: '27% of Northern opportunities · 58 roles and places.',
    },
  ],
  result: '214 opportunities · 96 skills',
  districts: [
    { id: 'tamale-metro', name: 'Tamale Metro', count: 118, share: 55, growth: 11 },
    { id: 'yendi-municipal', name: 'Yendi Municipal', count: 22, share: 10, growth: 4 },
    { id: 'savelugu-municipal', name: 'Savelugu Municipal', count: 14, share: 7, growth: -2 },
    { id: 'sagnarigu-municipal', name: 'Sagnarigu Municipal', count: 12, share: 6, growth: 6 },
    { id: 'tolon', name: 'Tolon', count: 9, share: 4, growth: 1 },
    { id: 'gushegu-municipal', name: 'Gushegu Municipal', count: 4 },
    { id: 'karaga', name: 'Karaga', count: 3 },
    { id: 'mion', name: 'Mion', count: 2 },
  ],
  moreDistricts: 8,
  hiddenTotal: 39,
  districtsHint: '16 districts · opportunities last quarter',
  districtsNote:
    'Districts with fewer than 5 opportunities are hidden so no single employer or person can be identified. Together they hold 39 opportunities.',
  topSkills: [
    { name: 'Agri-business', count: 31 },
    { name: 'Solar PV installation', count: 26 },
    { name: 'Customer service', count: 22 },
    { name: 'Nursing care', count: 18 },
    { name: 'Teaching (basic)', count: 15 },
    { name: 'Data analysis', count: 11 },
    { name: 'Mobile money operations', count: 8 },
    { name: 'Electrical installation', count: 6 },
    { name: 'Drone crop spraying', count: 3 },
    { name: 'Graphic design', count: 2 },
  ],
  topNote: '<5 means fewer than 5 opportunities. The bar is hidden to protect privacy.',
  breakdown: [
    { name: 'Agri-business', category: 'Agriculture', count: 31, share: 14.5, growth: 8 },
    { name: 'Solar PV installation', category: 'Trades', count: 26, share: 12.1, growth: 52 },
    { name: 'Customer service', category: 'Business', count: 22, share: 10.3, growth: 2 },
    { name: 'Nursing care', category: 'Health', count: 18, share: 8.4, growth: -4 },
    { name: 'Teaching (basic)', category: 'Education', count: 15, share: 7.0, growth: 3 },
    { name: 'Data analysis', category: 'Technology', count: 11, share: 5.1, growth: 19 },
    { name: 'Drone crop spraying', category: 'Agriculture', count: 3 },
    { name: 'Graphic design', category: 'Creative', count: 2 },
  ],
  emerging: [
    { name: 'Solar PV installation', category: 'Trades', count: 46 },
    { name: 'Cybersecurity basics', category: 'Technology', count: 38 },
    { name: 'Generative AI tools', category: 'Technology', count: 31 },
    { name: 'Cocoa traceability', category: 'Agriculture', count: 24 },
  ],
  emergingNote: 'Only skills with 5 or more opportunities are listed here.',
  supplyHint: 'Northern · talents with the skill for every open opportunity · regional average 7.8',
};

/* ===== BLOCK 5 · no results (11.4.5d) ===================================================================================== */
export const NO_RESULTS = {
  hero: {
    eyebrow: 'Opportunities posted',
    value: '0',
    label: 'No opportunities for this mix of filters yet.',
    badge: 'No change to show',
    note: 'Last opportunity here: 4 Aug 2026',
    series: [8, 9, 9, 11, 10, 12, 13, 12, 15, 16, 15, 18, 20, 19, 22, 24, 23, 27, 30, 29, 34, 38],
  },
  tiles: [
    { eyebrow: 'Skills tracked', value: '—', sub: 'Nothing to show for these filters.' },
    { eyebrow: 'Fastest-growing skill', value: '—', sub: 'Nothing to show for these filters.' },
    { eyebrow: 'Top category', value: '—', sub: 'Nothing to show for these filters.' },
  ],
  cardTitle: 'Skill demand',
  cardHint: 'Bunkpurugu-Nakpanduri · Creative arts · last quarter',
  title: 'No opportunities match these filters',
  message:
    'There are no Creative arts opportunities in Bunkpurugu-Nakpanduri this quarter. Try a wider area or a longer date range.',
  nearbyLabel: 'Nearby with opportunities:',
  nearby: [
    { label: 'Nalerigu-Gambaga · 7', count: 7 },
    { label: 'Bawku West · 9', count: 9 },
    { label: 'Tamale Metro · 118', count: 118 },
  ],
};

/* ===== BLOCK 6 · trends (11.4.5e-h) ======================================================================================= */
export const TREND_RANGES = [
  { id: '30d', label: 'Last 30 days' },
  { id: 'quarter', label: 'Last quarter' },
  { id: 'ytd', label: 'Year to date' },
  { id: '12m', label: 'Last 12 months' },
  { id: 'custom', label: 'Custom' },
];
export const GRANULARITY_BY_RANGE = {
  '30d': 'day',
  quarter: 'week',
  ytd: 'month',
  '12m': 'month',
  custom: 'month',
  long: 'month',
};

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const WEEKS = [
  '20 Jul',
  '27 Jul',
  '3 Aug',
  '10 Aug',
  '17 Aug',
  '24 Aug',
  '31 Aug',
  '7 Sep',
  '14 Sep',
  '21 Sep',
  '28 Sep',
  '5 Oct',
  '12 Oct',
];

/** Frame-exact series: 12 months by month (11.4.5e) and last quarter by week (11.4.5f). The last point is the period still filling. */
export const FRAME_SERIES = {
  month: {
    labels: MONTHS,
    ticks: MONTHS,
    registrations: [9.8, 10.4, 12.1, 14.7, 13.2, 15.9, 17.3, 18.9, 20.3, 22.6, 24.1, 15.2],
    previous: [8.1, 8.4, 9.0, 9.4, 10.1, 10.8, 11.2, 11.9, 12.4, 13.0, 13.6, 14.2],
    cumulativeStart: 25,
    cumulativeEnd: 219.4,
    recruiter: [785, 823, 867, 937, 899, 975, 1032, 1095, 1152, 1203, 1247, 848],
    programmes: [133, 146, 203, 171, 152, 228, 247, 222, 285, 266, 304, 203],
    assessments: [3.3, 3.6, 4.2, 5.0, 4.9, 5.4, 5.9, 6.0, 6.2, 6.7, 8.9, 5.1],
    score: [61, 62, 62, 63, 64, 63, 65, 66, 67, 68, 68, 68],
    skills: {
      'Data analysis': [120, 127, 134, 147, 150, 160, 172, 183, 190, 197, 205, 215],
      'Customer service': [175, 168, 180, 178, 187, 183, 188, 186, 182, 184, 183, 181],
      'Digital marketing': [124, 130, 136, 141, 144, 150, 156, 160, 163, 166, 168, 169],
      'Software dev.': [140, 138, 135, 130, 128, 125, 123, 121, 119, 120, 121, 122],
      Accounting: [141, 142, 140, 139, 138, 137, 137, 135, 134, 133, 133, 132],
    },
    skillAxis: [100, 140, 180, 220],
    regional: [52, 46, 38, 34, 31, 27, 22, 19, 15, 12, 9, 6, 3, 1, -2, -4],
    regionalNames: [
      'Upper East',
      'Northern',
      'Greater Accra',
      'Bono East',
      'Ashanti',
      'Central',
      'Volta',
      'Eastern',
      'Western',
      'Oti',
      'Savannah',
      'Ahafo',
      'Western North',
      'Bono',
      'Upper West',
      'North East',
    ],
    totals: {
      registrations: 194400,
      regChange: 87,
      opportunities: 14630,
      oppChange: 34,
      assessments: 71240,
      assessChange: 46,
      scoreChange: 7,
      skillChange: 77,
      unit: 'month',
    },
  },
  week: {
    labels: WEEKS,
    ticks: ['20 Jul', '3 Aug', '17 Aug', '31 Aug', '14 Sep', '28 Sep', '12 Oct'],
    registrations: [4.6, 4.8, 5.0, 5.2, 4.9, 5.3, 5.6, 5.6, 5.8, 5.7, 5.9, 6.0, 3.2],
    previous: [3.6, 3.8, 3.7, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3, 4.3, 4.4, 4.5, 4.5],
    cumulativeStart: 160,
    cumulativeEnd: 219.4,
    cumulativeTicks: ['20 Jul', '10 Aug', '31 Aug', '21 Sep', '12 Oct'],
    recruiter: [280, 290, 300, 310, 295, 305, 320, 330, 340, 330, 335, 345, 210],
    programmes: [70, 75, 70, 80, 70, 90, 80, 85, 95, 80, 90, 85, 45],
    assessments: [1.15, 1.25, 1.35, 1.2, 1.5, 1.6, 1.9, 2.0, 1.7, 2.1, 2.2, 2.1, 0.9],
    score: [66, 66, 68, 67, 67, 68, 67, 67, 67, 68, 68, 69, 68],
    skills: {
      'Data analysis': [33, 34, 36, 38, 40, 41, 43, 45, 46, 48, 50, 52, 53],
      'Customer service': [44, 46, 44, 45, 46, 43, 44, 46, 46, 45, 46, 46, 46],
      'Digital marketing': [34, 35, 34, 36, 37, 38, 37, 39, 40, 41, 41, 42, 42],
      'Software dev.': [33, 34, 34, 35, 35, 36, 37, 36, 37, 37, 38, 38, 38],
      Accounting: [35, 34, 35, 34, 34, 33, 34, 33, 33, 33, 33, 33, 33],
    },
    skillAxis: [30, 35, 40, 45, 50, 55],
    regional: [58, 49, 41, 35, 30, 24, 20, 18, 14, 10, 8, 5, 2, -1, -3, -6],
    regionalNames: [
      'Northern',
      'Upper East',
      'Greater Accra',
      'Ashanti',
      'Bono East',
      'Central',
      'Volta',
      'Eastern',
      'Western',
      'Oti',
      'Savannah',
      'Ahafo',
      'Western North',
      'Bono',
      'Upper West',
      'North East',
    ],
    totals: {
      registrations: 62020,
      regChange: 91,
      opportunities: 4108,
      oppChange: 22,
      assessments: 24310,
      assessChange: 38,
      scoreChange: 2,
      skillChange: 24,
      unit: 'week',
    },
  },
};

export const TREND_TEXT = {
  month: {
    regHint: 'New registrations per month · faint line is the previous period',
    regNote: 'new talents in 12 months',
    oppNote: 'opportunities in 12 months',
    current: 'Current month, still filling',
    previous: 'Previous period',
    skillHint: 'Top 5 skills · opportunities per month',
    regionalHint: 'Change in registrations vs the previous period · sorted',
  },
  week: {
    regHint: 'New registrations per week · faint line is the previous quarter',
    regNote: 'new talents this quarter',
    oppNote: 'opportunities this quarter',
    current: 'Current week, still filling',
    previous: 'Previous quarter',
    skillHint: 'Top 5 skills · opportunities per week',
    regionalHint: 'Change in registrations vs the previous quarter · sorted',
  },
};

export const TREND_BUILDING = {
  title: 'Building your 22-month view',
  body: 'Ranges longer than 90 days are built in the background. This usually takes 1 to 2 minutes. You can leave this page; we will let you know in the bell when it is ready.',
  notify: 'Notify me when ready',
  fallback: 'Use last 90 days',
  rangeText: '1 Jan 2025 – 18 Oct 2026 · 656 days',
  result: '22 months · building',
  notified: 'We will let you know in the bell when your 22-month view is ready.',
};

export const DATE_RANGE = {
  title: 'Custom range',
  from: 'From',
  to: 'To',
  defaultFrom: '2025-01-01',
  defaultTo: '2026-10-18',
  today: '2026-10-18',
  cancel: 'Cancel',
  apply: 'Apply range',
  backgroundDays: 90,
};

/* ===== BLOCK 7 · success rates (11.4.5i-l, n) ============================================================================= */
export const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'programmes', label: 'Government programmes' },
  { id: 'opportunities', label: 'Recruiter opportunities' },
];

export const REGION_CODES = [
  'GA',
  'AS',
  'EA',
  'WE',
  'CE',
  'VO',
  'NO',
  'UE',
  'UW',
  'BO',
  'BE',
  'AH',
  'WN',
  'OT',
  'SA',
  'NE',
];
export const REGION_NAMES = {
  GA: 'Greater Accra',
  AS: 'Ashanti',
  EA: 'Eastern',
  WE: 'Western',
  CE: 'Central',
  VO: 'Volta',
  NO: 'Northern',
  UE: 'Upper East',
  UW: 'Upper West',
  BO: 'Bono',
  BE: 'Bono East',
  AH: 'Ahafo',
  WN: 'Western North',
  OT: 'Oti',
  SA: 'Savannah',
  NE: 'North East',
};
export const REGION_CODES_NOTE =
  'Region codes: GA Greater Accra, AS Ashanti, NO Northern, UE Upper East and so on. Hover a bar for the region name and counts.';

const SPARK = [6, 7, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 15, 15, 16, 17, 18, 19];

export const SUCCESS_VIEW_BY = [
  { id: 'career-interest', label: 'Career interest' },
  { id: 'education', label: 'Education level' },
  { id: 'personality', label: 'Personality type', note: 'Broad groups only' },
  { id: 'career-goal', label: 'Career goal' },
  { id: 'skills-held', label: 'Skills held' },
  { id: 'work-experience', label: 'Work experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'age', label: 'Age range', note: '14–17 shown as one total' },
  { id: 'readiness', label: 'Readiness level' },
  {
    id: 'disability',
    label: 'Disability status',
    locked: true,
    note: 'Not in your MoU · request access',
  },
];

/** ⚠️ ASSUMPTION: only "Education level" is drawn; the other options reuse the Education rows (a real API returns each grouping). */
export const PROFILE_GROUPS = [
  { label: 'Tertiary degree', rate: 31.2, count: 900 },
  { label: 'HND / diploma', rate: 27.4, count: 640 },
  { label: 'TVET certificate', rate: 24.6, count: 520 },
  { label: 'SHS / WASSCE', rate: 18.9, count: 410 },
  { label: 'JHS / BECE', rate: 9.8, count: 160 },
  { label: 'No formal education', rate: 2, count: 3 },
];

export const FUNNELS = {
  opportunities: {
    title: 'Recruiter opportunities',
    stages: [
      { label: 'Applied', count: 41860 },
      { label: 'Shortlisted', count: 12140, drop: 71 },
      { label: 'Interviewed', count: 5320, drop: 56 },
      { label: 'Hired', count: 2410, drop: 55 },
    ],
  },
  programmes: {
    title: 'Government programmes',
    stages: [
      { label: 'Enrolled', count: 6350 },
      { label: 'Completed', count: 4510, drop: 29 },
      { label: 'Placed', count: 1808, drop: 60 },
    ],
  },
  bootcamp: {
    title: 'Youth Enterprise Bootcamp',
    stages: [
      { label: 'Enrolled', count: 64 },
      { label: 'Completed', count: 41, drop: 36 },
      { label: 'Placed', count: 3, dropHidden: true },
    ],
  },
};
export const FUNNEL_NOTE =
  'Hired means a confirmed start date. Placed means a job, internship or further study within 6 months of finishing.';

const RECRUITER_HIRE_RATES = [
  8.0, 7.3, 6.1, 6.5, 5.0, 4.7, 4.1, 3.8, 3.0, 4.4, 3.7, 3.4, 2.9, 2.7, 2.5, 2.2,
];
export const PROGRAMME_PLACED_RATES = [
  34, 31, 29, 27, 28, 26, 30, 33, 24, 25, 27, 22, 21, 23, 20, 19,
];
const PROGRAMME_PLACED = [34, 31, 29, 27, 28, 26, 30, 33, 24, 25, 27, 22, 21, 23, 20, 19];
const RECRUITER_HIRED = [26, 24, 21, 22, 19, 18, 17, 15, 14, 18, 16, 15, 14, 13, 12, 11];

export const SUCCESS = {
  all: {
    result: '48,210 applications · 6,350 enrolments',
    range: 'Comparing 1 Jul – 18 Oct 2026 with the period before',
    hero: {
      eyebrow: 'Overall success rate',
      value: '23.4%',
      label: 'Hired or placed, out of everyone who applied or enrolled.',
      change: { pct: 2.1, text: '▲ +2.1 pts vs last period' },
      note: '4,218 hired or placed this period',
    },
    tiles: [
      {
        eyebrow: 'Programme completion rate',
        value: '71%',
        sub: '▲ +4 pts · 4,510 of 6,350 enrolled finished.',
      },
      {
        eyebrow: 'Avg time to placement',
        value: '38 days',
        sub: '▼ 6 days faster than last period, from application to start.',
      },
      {
        eyebrow: 'Applications volume',
        value: '48,210',
        sub: '▲ +29% vs last period · recruiter roles and programmes.',
      },
    ],
    funnels: ['opportunities', 'programmes'],
    region: {
      title: 'Programmes vs recruiter roles',
      hint: 'Success rate by region · side by side',
      axis: [0, 10, 20, 30, 40],
      series: [
        { label: 'Government programmes · placed', values: PROGRAMME_PLACED, tone: 'dark' },
        { label: 'Recruiter roles · hired', values: RECRUITER_HIRED, tone: 'light' },
      ],
    },
  },
  programmes: {
    result: '6,350 enrolments · 17 programmes',
    range: 'Comparing 1 Jul – 18 Oct 2026 with the period before',
    hero: {
      eyebrow: 'Programme success rate',
      value: '28.5%',
      label: 'Placed within 6 months, out of everyone who enrolled.',
      change: { pct: 3.4, text: '▲ +3.4 pts vs last period' },
      note: '1,808 placed this period',
    },
    tiles: [
      {
        eyebrow: 'Programme completion rate',
        value: '71%',
        sub: '▲ +4 pts · 4,510 of 6,350 enrolled finished.',
      },
      {
        eyebrow: 'Avg time to placement',
        value: '52 days',
        sub: '▼ 9 days faster, from finishing to starting a role.',
      },
      {
        eyebrow: 'Enrolments',
        value: '6,350',
        sub: '▲ +18% vs last period across all programmes.',
      },
    ],
    funnels: ['programmes'],
    region: {
      title: 'Placement rate by region',
      hint: 'Government programmes · placed ÷ enrolled',
      axis: [0, 10, 20, 30, 40],
      series: [{ label: 'Government programmes · placed', values: PROGRAMME_PLACED, tone: 'dark' }],
    },
  },
  opportunities: {
    result: '41,860 applications · 1,214 employers',
    range: 'Comparing 1 Jul – 18 Oct 2026 with the period before',
    hero: {
      eyebrow: 'Recruiter success rate',
      value: '5.8%',
      label: 'Hired, out of everyone who applied to a recruiter role.',
      change: { pct: 0.6, text: '▲ +0.6 pts vs last period' },
      note: '2,410 hired this period',
    },
    tiles: [
      {
        eyebrow: 'Shortlist rate',
        value: '29%',
        sub: '▲ +2 pts · 12,140 of 41,860 applications shortlisted.',
      },
      {
        eyebrow: 'Avg time to hire',
        value: '31 days',
        sub: '▼ 4 days faster, from application to start date.',
      },
      { eyebrow: 'Applications volume', value: '41,860', sub: '▲ +31% vs last period.' },
    ],
    funnels: ['opportunities'],
    region: {
      title: 'Hire rate by region',
      hint: 'Recruiter roles · hired ÷ applied',
      axis: [0, 2.5, 5, 7.5, 10],
      series: [{ label: 'Recruiter roles · hired', values: RECRUITER_HIRE_RATES, tone: 'dark' }],
    },
  },
};

/** 11.4.5n — one small programme selected, the funnel and rates are suppressed. */
export const SMALL_PROGRAMME = {
  result: '64 enrolments · 1 programme',
  hero: {
    eyebrow: 'Programme success rate',
    value: '<5 placed',
    label: 'Too few placements to show a rate yet.',
    badge: 'Rate hidden until 5 or more are placed',
    note: '41 of 64 finished the bootcamp',
  },
  tiles: [
    { eyebrow: 'Completion rate', value: '64%', sub: '41 of 64 enrolled finished.' },
    { eyebrow: 'Avg time to placement', value: '—', sub: 'Hidden while fewer than 5 are placed.' },
    { eyebrow: 'Enrolments', value: '64', sub: 'Cohort 1 · Jul – Sep 2026.' },
  ],
  regionTitle: 'Too few to show by region',
  regionMessage:
    'Every region has fewer than 5 placements for this programme. Totals appear above.',
  profileRows: PROFILE_GROUPS.slice(0, 4).map((g) => ({ ...g, rate: null, count: 2 })),
};

export const PROGRAMME_ROWS = [
  {
    id: 'youth-in-digital-skills',
    name: 'Youth in Digital Skills',
    agency: 'NYA (yours)',
    enrolled: 1840,
    completed: 1412,
    placed: 620,
    rate: 33.7,
  },
  {
    id: 'youth-in-solar-installation',
    name: 'Youth in Solar Installation',
    agency: 'NYA (yours)',
    enrolled: 720,
    completed: 560,
    placed: 268,
    rate: 37.2,
  },
  {
    id: 'youth-in-agribusiness',
    name: 'Youth in Agribusiness',
    agency: 'NYA (yours)',
    enrolled: 1260,
    completed: 830,
    placed: 294,
    rate: 23.3,
  },
  {
    id: 'youth-summer-internship',
    name: 'Youth Summer Internship',
    agency: 'NYA (yours)',
    enrolled: 980,
    completed: 902,
    placed: 341,
    rate: 34.8,
  },
  {
    id: 'youth-enterprise-bootcamp',
    name: 'Youth Enterprise Bootcamp',
    agency: 'NYA (yours)',
    enrolled: 64,
    completed: 41,
    placed: 3,
    rate: null,
  },
];
export const PROGRAMME_TOTALS = {
  label: '11 programmes · 4 other agencies',
  agency: 'Totals only',
  enrolled: 1486,
  completed: 765,
  placed: 281,
  rate: 18.9,
};
export const PROGRAMME_HINT =
  'Your programmes are named. Other agencies’ programmes show as totals only.';
export const PROGRAMME_NOTE =
  'Rate = placed ÷ enrolled. Rows with fewer than 5 people placed show <5.';

export const JOB_CATEGORIES = [
  { name: 'Technology', employers: 212, applied: 9840, shortlisted: 3120, hired: 742, rate: 7.5 },
  { name: 'Health & care', employers: 96, applied: 4210, shortlisted: 1380, hired: 298, rate: 7.1 },
  {
    name: 'Trades & construction',
    employers: 184,
    applied: 5630,
    shortlisted: 1690,
    hired: 352,
    rate: 6.3,
  },
  {
    name: 'Business & sales',
    employers: 341,
    applied: 12480,
    shortlisted: 3210,
    hired: 604,
    rate: 4.8,
  },
  { name: 'Finance', employers: 118, applied: 5120, shortlisted: 1410, hired: 236, rate: 4.6 },
  {
    name: 'Creative & media',
    employers: 74,
    applied: 3260,
    shortlisted: 910,
    hired: 128,
    rate: 3.9,
  },
  { name: 'Agriculture', employers: 189, applied: 1320, shortlisted: 420, hired: 50, rate: 3.8 },
  { name: 'Mining support', employers: 3, applied: 42, shortlisted: 11, hired: 2, rate: null },
];
export const JOB_NOTE = 'Rate = hired ÷ applied. Each employer is counted once per category.';
export const JOB_HINT =
  'Employers are never named here. Categories with fewer than 5 hires show <5.';

export const SPARKLINE = SPARK;

/** ⚠️ ASSUMPTION: Figma draws only "Education level"; two other groupings carry sample rows, the rest reuse the education rows. */
export const GROUP_ROWS = {
  'career-interest': [
    { label: 'Technology', rate: 29.4, count: 840 },
    { label: 'Health', rate: 26.1, count: 610 },
    { label: 'Trades', rate: 24.8, count: 560 },
    { label: 'Business', rate: 19.7, count: 700 },
    { label: 'Agriculture', rate: 12.3, count: 380 },
    { label: 'Creative', rate: 3, count: 2 },
  ],
  age: [
    { label: '18–24', rate: 27.9, count: 1200 },
    { label: '25–30', rate: 24.2, count: 880 },
    { label: '31–35', rate: 19.4, count: 420 },
    { label: '36 and over', rate: 11.8, count: 190 },
    { label: '14–17', rate: null, count: 2 },
  ],
};
