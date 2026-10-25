/*
 * reportData.js — MOCK content of the agency report "Youth skills and outcomes Q3 2026" (Figma 11.4.4i–p v2, ids 8932:18920 … 8932:19360,
 * instances of the GTH Report kit). Shaped like the future GET /agency/reports/q3-2026 response. Texts are verbatim from the frames
 * (including the typo "A opportunity" on page 5, kept as drawn). Counts go through formatCount in the components.
 */

/* ---- BLOCK 1 · shared ---- */
export const AGENCY_REPORT_PAGE_COUNT = 8;
export const AGENCY_REPORT_FOOTER =
  'National Youth Authority  ·  Youth skills and outcomes  ·  Q3 2026';

/* ---- BLOCK 2 · cover, contents, opener (pages 1-3) ---- */
export const AGENCY_REPORT_COVER = {
  brand: 'Ghana Talent Hub',
  eyebrow: 'Agency report  ·  Q3 2026 (July – September)',
  titleLines: ['Where Ghana’s', 'young talent'],
  titleTail: ' is',
  intro:
    'Youth skills, demand and programme outcomes on Ghana Talent Hub, for the National Youth Authority',
  preparedLabel: 'Prepared for',
  preparedFor: 'Minister for Youth Development · October 2026',
  bigNumber: 186400,
  bigNumberLabel: 'young people aged 15–35 on GTH',
  leafStat: '23.4%',
  leafStatLabel: ['of programme applicants', 'placed or hired'],
  footer: 'Data as of 30 Sep 2026  ·  MoU GTH-MOU-2026-004  ·  Aggregates only',
};

export const AGENCY_REPORT_CONTENTS = {
  vertical: 'Contents',
  inside: 'Inside this snapshot',
  meta: ['8 pages  ·  30 September 2026', 'Aggregates only. Groups under 5 hidden.'],
  outline: 'Contents',
  sections: [
    {
      numeral: '1',
      x: 432,
      title: 'Where young people are',
      items: ['Regions map', 'Top regions', 'Where we’re thin'],
      ref: 'Page 4',
    },
    {
      numeral: '2',
      x: 598,
      title: 'Skills in demand',
      items: ['Top skills', 'Supply vs demand'],
      ref: 'Page 5',
    },
    {
      numeral: '3',
      x: 764,
      title: 'From programme to work',
      items: ['Apply, train,', 'verify, place'],
      ref: 'Page 6',
    },
    {
      numeral: '4',
      x: 930,
      title: 'Stories and method',
      items: ['Three programmes', 'How we count'],
      ref: 'Pages 7–8',
    },
  ],
};

export const AGENCY_REPORT_OPENER = {
  photoHeadline: ['YOUTH IN', 'NUMBERS'],
  eyebrow: 'Section 1  ·  Where young people are',
  title: 'Every region counted',
  subtitle: 'Totals, never names',
  body: [
    '186,400 young people aged 15–35 have a GTH profile, 49% of them women. Two in five live in Greater Accra or Ashanti, so Q4 outreach goes north and to the three newest regions.',
  ],
  quote: '“We plan from this quarter’s skills now, district by district.”',
  quoteBy: 'Efua Owusu, Director, Research & Data',
};

/* ---- BLOCK 3 · where young people are (page 4) ---- */
export const AGENCY_REPORT_REGIONS = {
  eyebrow: '01  ·  Where young people are',
  title: 'Talents aged 15–35 by home region',
  sub: 'Darker green means more talents. Groups under 5 are hidden; ages 14–17 are counted as totals only.',
  mapAlt:
    'Map of Ghana’s 16 regions, darker green where more young people are registered. Greater Accra and Ashanti are the darkest; Oti, Ahafo and Western North the lightest.',
  legendTitle: 'Talents per region',
  legend: [
    { swatch: '#c1d4c4', label: 'Under 2,000' },
    { swatch: '#6ca271', label: '2,000 – 4,999' },
    { swatch: '#387440', label: '5,000 – 9,999' },
    { swatch: '#224626', label: '10,000 – 24,999' },
    { swatch: '#142916', label: '25,000+' },
  ],
  topTitle: 'Top five regions',
  top: [
    { rank: '01', name: 'Greater Accra', value: 44700, bar: 330, tone: 'dark' },
    { rank: '02', name: 'Ashanti', value: 36800, bar: 264, tone: 'dark' },
    { rank: '03', name: 'Central', value: 15600, bar: 116 },
    { rank: '04', name: 'Eastern', value: 14900, bar: 116 },
    { rank: '05', name: 'Northern', value: 13100, bar: 99 },
  ],
  calloutEyebrow: 'Where we’re thin',
  calloutText:
    'Oti, Ahafo and Western North each have under 2,000 talents. NYA district officers will run sign-up days there in Q4.',
  stats: [
    { value: 186400, label: 'talents' },
    { value: '49%', label: 'women' },
    { value: 71300, label: 'verified skills' },
    { value: 9830, label: 'placed or hired' },
    { value: 'GHS 6.2M', label: 'grants paid by wallet' },
  ],
};

/* ---- BLOCK 4 · skills in demand (page 5) ---- */
export const AGENCY_REPORT_SKILLS = {
  eyebrow: '02  ·  Skills in demand',
  title: 'Service, digital and farm skills lead demand.',
  sub: 'Opportunities posted on GTH, by skill, July–September 2026.',
  rows: [
    { label: 'Customer service', value: 3420, bar: 330 },
    { label: 'Digital marketing', value: 2980, bar: 281 },
    { label: 'Data entry', value: 2610, bar: 248 },
    { label: 'Agribusiness', value: 2240, bar: 215 },
    { label: 'Solar installation', value: 1870, bar: 182 },
    { label: 'Driving', value: 1650, bar: 165 },
    { label: 'Bookkeeping', value: 1420, bar: 132 },
    { label: 'Phone repair', value: 1080, bar: 99 },
    { label: 'Tailoring', value: 860, bar: 83 },
    { label: 'Welding', value: 640, bar: 66 },
  ],
  highlightValue: '3.1',
  highlightText:
    'talents per opportunity for solar installation, the tightest of the top ten. Q4 YouthStart grants will prioritise solar and data entry.',
  supplyTitle: 'Supply vs demand',
  supply: [
    { count: '4', label: 'Shortage skills', hint: 'Under 3.5 talents per opportunity', bar: 293 },
    { count: '3', label: 'Tight skills', hint: '3.5 to 6 talents per opportunity', bar: 220 },
    { count: '3', label: 'Balanced or surplus', hint: 'Over 6 talents per opportunity', bar: 220 },
  ],
  note: 'A opportunity can list up to 5 skills, so the bars add up to more than the 9,120 opportunities this quarter.',
};

/* ---- BLOCK 5 · from programme to work (page 6) ---- */
export const AGENCY_REPORT_FLOW = {
  eyebrow: '03  ·  From programme to work',
  title: 'Apply, train, verify, place',
  sub: 'Four steps for every NYA programme applicant. Q3 2026, all NYA programmes on GTH.',
  steps: [
    { n: '01', name: 'Apply', value: 42000, text: 'applied to NYA programmes', x: 48 },
    { n: '02', name: 'Train', value: 28600, text: 'started training or a placement', x: 310 },
    { n: '03', name: 'Verify', value: 17900, text: 'passed a verified assessment', x: 572 },
    {
      n: '04',
      name: 'Place',
      value: 9830,
      text: 'placed in work or study within 6 months',
      x: 834,
      filled: true,
    },
  ],
  policyEyebrow: 'What NYA will do in Q4',
  policies: [
    {
      title: 'Fund solar and data skills',
      text: 'Two of the four shortage skills. YouthStart grants add 600 training places.',
      x: 72,
    },
    {
      title: 'Reach the newest regions',
      text: 'District sign-up days in Oti, Ahafo and Western North with GES and NSS.',
      x: 407,
    },
    {
      title: 'Close the verify gap',
      text: 'Only 63% of trainees took an assessment. Free test centres in every regional capital.',
      x: 742,
    },
  ],
};

/* ---- BLOCK 6 · programme stories (page 7) ---- */
export const AGENCY_REPORT_STORIES = {
  eyebrow: '04  ·  Programmes',
  sub: 'Three NYA programmes, told with verified numbers.',
  bigTitle: ['PROGRAMME', 'STORIES'],
  cases: [
    {
      id: 'agri',
      bg: '#387440',
      region: 'Techiman',
      chipWidth: 82,
      title: 'YouthStart grant  ·  Starter capital for agribusiness',
      text: 'Applicants pitched a plan, passed a verified agribusiness assessment and received GHS 5,000 starter grants in their GTH wallets.',
      stats: [
        { value: 1240, label: 'grants paid' },
        { value: '81%', label: 'trading after 6 months' },
        { value: 'GHS 6.2M', label: 'paid by wallet' },
      ],
    },
    {
      id: 'nss',
      bg: '#2a5730',
      region: 'Bolgatanga',
      chipWidth: 111,
      title: 'NSS placement  ·  Matched on verified skills',
      text: 'National service personnel were matched to district assemblies and firms on verified skills, not only their degree.',
      stats: [
        { value: 6400, label: 'placed' },
        { value: '38%', label: 'offered a job after service' },
        { value: '52%', label: 'women' },
      ],
    },
    {
      id: 'fair',
      bg: '#387440',
      region: 'Kumasi',
      chipWidth: 58,
      title: 'Regional job fair  ·  Ashanti, August 2026',
      text: 'Employers posted roles on GTH before the fair, so talents arrived with matched shortlists.',
      stats: [
        { value: 3100, label: 'talents attended' },
        { value: 214, label: 'employers' },
        { value: 640, label: 'hired in 8 weeks' },
      ],
    },
  ],
};

/* ---- BLOCK 7 · how we count (page 8) ---- */
export const AGENCY_REPORT_METHOD = {
  eyebrow: '05  ·  How we count',
  title: 'Aggregates only, every number checked',
  sub: 'All figures come from GTH records at 30 September 2026, shared under MoU GTH-MOU-2026-004. NYA sees totals, never individuals.',
  blocks: [
    {
      title: 'Source',
      text: 'GTH profiles, assessment results, job opportunities and wallet payments. No survey data.',
      x: 48,
      y: 200,
      strong: true,
    },
    {
      title: 'Privacy',
      text: 'Groups under 5 show as “<5”. Ages 14–17 appear as totals only and are never crossed with other attributes.',
      x: 378,
      y: 200,
      strong: true,
    },
    {
      title: 'Placed',
      text: 'In a job, internship or further study within 6 months of finishing, or hired with a confirmed start date.',
      x: 48,
      y: 350,
    },
    {
      title: 'Demand',
      text: 'Opportunities posted by recruiters and programmes in the quarter. Employers are never named.',
      x: 378,
      y: 350,
    },
    {
      title: 'Access',
      text: 'Every view and download of this report is logged under the reader’s name. The DPO gets a monthly access report.',
      x: 48,
      y: 500,
    },
    {
      title: 'Limitations',
      text: 'Young people not on GTH are not counted. Work found outside GTH is not counted as a placement.',
      x: 378,
      y: 500,
    },
  ],
  dataLine:
    'Data as of  30 September 2026   ·   Methodology version 1.3   ·   MoU GTH-MOU-2026-004',
  backTitle: 'Check this report is real',
  backText:
    'Scan the code or open the link. You will see the same figures and the time they were taken.',
  verifyUrl: 'gh-talenthub.gov.gh/verify/R-2026-NYA-Q3',
  questions: ['Questions about this report', 'research@nya.gov.gh'],
};
