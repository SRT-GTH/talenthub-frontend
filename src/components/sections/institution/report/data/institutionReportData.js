/*
 * institutionReportData.js — MOCK content of the "Board of Governors report · Term 1, 2026/27" of Savannah Hills SHS (Figma 11.3.5 v2, ids
 * 8914:100 … 8914:452, instances of the GTH Report kit). Shaped like the future GET /institution/reports/term-1-2026-27 response. Texts are
 * verbatim from the frames. Counts go through formatCount in the components; "8 students have no profile yet" is a roster fact of the
 * institution itself (as drawn), not a cross-tab aggregate.
 */

/* ---- BLOCK 1 · shared ---- */
export const INSTITUTION_REPORT_PAGE_COUNT = 8;
export const INSTITUTION_REPORT_TITLE = 'Board of Governors report, Term 1, 2026/27';
export const INSTITUTION_REPORT_FOOTER =
  'Savannah Hills SHS  ·  Board of Governors report  ·  30 October 2026';

/* ---- BLOCK 2 · cover, contents, opener (pages 1-3) ---- */
export const INSTITUTION_REPORT_COVER = {
  brand: 'Ghana Talent Hub',
  eyebrow: 'Board of Governors report  ·  Term 1, 2026/27',
  titleLines: ['Our class,', 'ready for what’s next'],
  titleTail: '',
  intro:
    'How Savannah Hills SHS students are using Ghana Talent Hub: verified skills, certificates anyone can check, and real places on internships and scholarships.',
  preparedLabel: 'Prepared for',
  preparedFor: 'Board of Governors · meeting of 6 November 2026',
  bigNumber: 304,
  bigNumberLabel: 'students with a verified GTH profile',
  leafStat: '231',
  leafStatLabel: ['certificates issued', 'and verified'],
  footer: 'Data as of 30 Oct 2026, 09:00 GMT  ·  Names off by default',
};

export const INSTITUTION_REPORT_CONTENTS = {
  vertical: 'Contents',
  inside: 'Inside this report',
  meta: ['8 pages  ·  30 October 2026', 'Names are off by default.'],
  outline: 'Contents',
  sections: [
    {
      numeral: '1',
      x: 432,
      title: 'Where our students come from',
      items: ['Home regions map', 'Top regions', 'Who needs support'],
      ref: 'Page 4',
    },
    {
      numeral: '2',
      x: 598,
      title: 'What our students want',
      items: ['Career interests', 'Year groups'],
      ref: 'Page 5',
    },
    {
      numeral: '3',
      x: 764,
      title: 'How GTH works at school',
      items: ['Learn, verify,', 'get matched, earn'],
      ref: 'Page 6',
    },
    {
      numeral: '4',
      x: 930,
      title: 'Programmes and method',
      items: ['Three programmes', 'How we count'],
      ref: 'Pages 7–8',
    },
  ],
};

export const INSTITUTION_REPORT_OPENER = {
  photoHeadline: ['OUR', 'CLASS'],
  eyebrow: 'Section 1  ·  Where our students come from',
  title: 'Ready for next',
  subtitle: 'A class on the national map',
  body: [
    '304 of our 312 students have a verified GTH profile. 231 certificates are issued and can be checked by any employer or university.',
    'This report shows where our students come from, what they want to do, and what changed this term.',
  ],
  quote:
    '“Parents can now check a certificate is real in seconds. That builds trust in our school.”',
  quoteBy: 'Iddrisu Abdul-Rahman, Registrar',
  footer: 'Savannah Hills SHS  ·  30 Oct 2026',
};

/* ---- BLOCK 3 · where our students come from (page 4) ---- */
export const INSTITUTION_REPORT_REGIONS = {
  eyebrow: '01  ·  Where our students come from',
  title: 'Five regions, one school',
  sub: 'Students on GTH by home region. Boarders come from across the north.',
  mapAlt:
    'Map of Ghana’s 16 regions, darker green where more of our students come from. Northern is the darkest; Savannah, North East and Upper East follow; Upper West and Ashanti, Eastern and Volta have a few.',
  legendTitle: 'Students per region',
  legend: [
    { swatch: '#c1d4c4', label: 'Under 10' },
    { swatch: '#6ca271', label: '10 – 24' },
    { swatch: '#387440', label: '25 – 49' },
    { swatch: '#224626', label: '50 – 99' },
    { swatch: '#142916', label: '100+' },
  ],
  topTitle: 'Top five regions',
  top: [
    { rank: '01', name: 'Northern', value: 186, bar: 330, tone: 'dark' },
    { rank: '02', name: 'Savannah', value: 41, bar: 66, tone: 'dark' },
    { rank: '03', name: 'North East', value: 33, bar: 66 },
    { rank: '04', name: 'Upper East', value: 24, bar: 50 },
    { rank: '05', name: 'Upper West', value: 12, bar: 17 },
  ],
  calloutEyebrow: 'Who needs support',
  calloutText:
    '8 students have no profile yet, mostly first-years without a phone. The ICT club will help them sign up in November.',
  stats: [
    { value: 304, label: 'students on GTH' },
    { value: 231, label: 'certificates' },
    { value: 41, label: 'internships' },
    { value: 'GHS 48k', label: 'scholarships' },
    { value: 12, label: 'partner organisations' },
  ],
};

/* ---- BLOCK 4 · what our students want (page 5) ---- */
export const INSTITUTION_REPORT_INTERESTS = {
  eyebrow: '02  ·  What our students want',
  title: 'Health and technology lead the way.',
  sub: 'Top 10 career interests chosen by our students (each can pick up to three).',
  rows: [
    { label: 'Health & Medical', value: 142, bar: 330 },
    { label: 'Technology', value: 118, bar: 281 },
    { label: 'Education & Training', value: 96, bar: 231 },
    { label: 'Agriculture', value: 88, bar: 198 },
    { label: 'Business & Finance', value: 74, bar: 165 },
    { label: 'Engineering', value: 61, bar: 149 },
    { label: 'Public Service', value: 43, bar: 99 },
    { label: 'Creative & Media', value: 37, bar: 83 },
    { label: 'Entrepreneurship', value: 29, bar: 66 },
    { label: 'Hospitality', value: 18, bar: 50 },
  ],
  highlightValue: '1 in 2',
  highlightText:
    'girls want a health or science career. Only 18% have a verified science skill yet. The lab club can close that gap.',
  yearsTitle: 'Our students by year',
  years: [
    { count: '38%', label: 'SHS 1', hint: '118 first-years', bar: 293 },
    { count: '33%', label: 'SHS 2', hint: '101 students', bar: 249 },
    { count: '29%', label: 'SHS 3', hint: '85 final-years', bar: 220 },
  ],
  note: 'A student can pick up to three interests, so the bars add up to more than 304.',
};

/* ---- BLOCK 5 · how GTH works at school (page 6) ---- */
export const INSTITUTION_REPORT_FLOW = {
  eyebrow: '03  ·  How GTH works at school',
  title: 'Verified skills open doors',
  sub: 'Four steps from classroom to opportunity. Numbers are for this term (Sep–Oct 2026).',
  steps: [
    { n: '01', name: 'Learn', value: 296, text: 'students took a course or assessment', x: 48 },
    { n: '02', name: 'Verify', value: 187, text: 'skills verified by teachers or tests', x: 310 },
    { n: '03', name: 'Get matched', value: 41, text: 'holiday internships confirmed', x: 572 },
    {
      n: '04',
      name: 'Earn',
      value: 'GHS 48k',
      text: 'in scholarships for 24 students',
      x: 834,
      filled: true,
    },
  ],
  policyEyebrow: 'What the board can do',
  policies: [
    {
      title: 'Fund a second computer lab',
      text: 'Only 60% of students reach a verified skill. Shared computers are the bottleneck.',
      x: 72,
    },
    {
      title: 'Invite more local partners',
      text: 'Most internships are in Tamale. Partners in Bolgatanga and Yendi would reach more boarders.',
      x: 407,
    },
    {
      title: 'Keep guardians in the loop',
      text: 'Guardians of 41 under-18s approved invites by SMS. Let’s reach the rest next term.',
      x: 742,
    },
  ],
};

/* ---- BLOCK 6 · programmes (page 7) ---- */
export const INSTITUTION_REPORT_STORIES = {
  eyebrow: '04  ·  Programmes',
  sub: 'Three programmes this term, told with verified numbers.',
  bigTitle: ['OUR', 'PROGRAMMES'],
  cases: [
    {
      id: 'school',
      bg: '#387440',
      region: 'Holiday internship',
      chipWidth: 136,
      title: 'Shea cooperative, Tamale  ·  Learning on the job',
      text: 'Final-years spent four weeks at a women-led shea cooperative, learning quality control and record keeping. Every placement was approved by a guardian.',
      stats: [
        { value: 18, label: 'students placed' },
        { value: '4 wks', label: 'each' },
        { value: 16, label: 'got a reference' },
      ],
    },
    {
      id: 'office',
      bg: '#2a5730',
      region: 'Scholarships',
      chipWidth: 111,
      title: 'Northern Skills Foundation  ·  Fees for 24 students',
      text: 'Shortlists used verified assessments, not who you know. Half of the winners are girls from the Savannah Region.',
      stats: [
        { value: 24, label: 'scholarships' },
        { value: 'GHS 2,000', label: 'each' },
        { value: '50%', label: 'girls' },
      ],
    },
    {
      id: 'graduate',
      bg: '#387440',
      region: 'Credentials',
      chipWidth: 97,
      title: 'Records office  ·  A whole class on the map',
      text: 'The registrar uploaded 298 students in one afternoon. Every certificate can be checked by any employer or university.',
      stats: [
        { value: 231, label: 'certificates' },
        { value: '0', label: 'fakes found' },
        { value: 41, label: 'guardian consents' },
      ],
    },
  ],
};

/* ---- BLOCK 7 · how we count (page 8) ---- */
export const INSTITUTION_REPORT_METHOD = {
  eyebrow: '05  ·  How we count',
  title: 'Every number here is checked',
  sub: 'All figures come live from Savannah Hills SHS records on GTH at the time of download.',
  blocks: [
    {
      title: 'Source',
      text: 'Student records uploaded by the registrar and confirmed with Ghana Card or NIA numbers.',
      x: 48,
      y: 200,
      strong: true,
    },
    {
      title: 'Privacy',
      text: 'No student names or photos. Groups under 5 show as “<5”. Names are off by default.',
      x: 378,
      y: 200,
      strong: true,
    },
    {
      title: 'Student',
      text: 'Enrolled at Savannah Hills SHS in 2026/27 with a confirmed GTH profile.',
      x: 48,
      y: 350,
    },
    {
      title: 'Placement',
      text: 'An internship, volunteer role or programme place confirmed by the host, and approved by a guardian for under-18s.',
      x: 378,
      y: 350,
    },
    {
      title: 'Regions',
      text: 'Home region from the student’s record. Boarders count in their home region.',
      x: 48,
      y: 500,
    },
    {
      title: 'Limitations',
      text: 'Interests are self-reported. 8 students have no profile yet and are not counted.',
      x: 378,
      y: 500,
    },
  ],
  dataLine:
    'Data as of  30 October 2026, 09:00 GMT   ·   Methodology version 1.3   ·   gh-talenthub.gov.gh/methodology',
  backTitle: 'Check this report is real',
  backText:
    'Scan the code or open the link. You will see the same figures and the time they were taken.',
  verifyUrl: 'gh-talenthub.gov.gh/verify/R-2026-1030-SHS',
  questions: ['Questions about this report', 'registrar@savannahhills.edu.gh'],
};
