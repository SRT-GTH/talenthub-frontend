import { regionById } from '../../regionsList.js';
import { SUPPRESSION_THRESHOLD } from '../../publicDataFormat.js';

/*
 * shareData.js — API-shaped mock data of the Theme 8 "share · download · print · report · digest" package
 * (Figma canvas 8477:209484: 8.1.2, 8.8.1, 8.8.2, 8.8.3, print layouts 8.2.1h / 8.5.1e, report kit 8.8.1 v2).
 * One marked block per concern. Everything here is SAMPLE content (all figures, organisations and people in Figma are sample data);
 * the future endpoints are named in each block header. Counts that reach the screen still go through formatCount() / safeShare().
 */

/* ======================================================================================
 * BLOCK 1 · SHARE — GET /api/public/share-links (future). Figma 8.1.2a-c, 8.8.2a-b, mobile sheet 8515:566
 * ====================================================================================== */

/*
 * ⚠️ ASSUMPTION: shared links use the public vanity host drawn in Figma (gh-talenthub.gov.gh) and the path of the page being shared
 * (overview → /snapshot) with the CURRENT query (filters) plus `src=share`. The vanity host does not resolve in development.
 */
export const SHARE_ORIGIN = 'https://gh-talenthub.gov.gh';
export const SHARE_DEFAULT_PATH = 'snapshot';
export const SHARE_SOURCE_KEY = 'src';
export const SHARE_SOURCE_VALUE = 'share';
/** Query keys that make it into a shared link (the five overview filters; UI-only keys such as modal / drawer / rail never do). */
export const SHARE_QUERY_KEYS = ['region', 'edu', 'interest', 'age', 'gender'];
export const SHARE_MESSAGE_MAX = 280;
/** Figma 8500:205 — the sample note under "Add a message (optional)". */
export const SHARE_DEFAULT_MESSAGE =
  'As discussed in today’s meeting, here is the national picture.';
export const SHARE_EMAIL_SUBJECT = 'National talent snapshot · Ghana Talent Hub';

export const SHARE_CARD = {
  brand: 'Ghana Talent Hub',
  title: 'National talent snapshot',
  headline: '219,428 talents',
  sub: 'Live, anonymised data · 16 regions · updated 17 Oct 2026',
  metaTitle: 'National talent snapshot | Ghana Talent Hub',
  metaDescription: 'Live, anonymised data about Ghanaian talent. No personal information is shown.',
  metaHost: 'gh-talenthub.gov.gh',
};

/** Channel tiles of the desktop dialog (8500:1800) in drawn order. */
export const SHARE_CHANNELS = [
  { id: 'copy', label: 'Copy link' },
  { id: 'email', label: 'Email' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'x', label: 'X' },
];

/** App row of the phone sheet (8515:799) in drawn order. */
export const SHARE_SHEET_APPS = [
  { id: 'copy', label: 'Copy link' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
  { id: 'more', label: 'More' },
];

/* Mock talent counts for a filtered view. ⚠️ ASSUMPTION: shares are invented; the drawn example (Volta · Technology · 18–24 = 237) is pinned. */
const MOCK_TOTAL_TALENTS = 219428;
const MOCK_FILTER_SHARES = {
  region: { volta: 0.0597, ashanti: 0.1683, 'greater-accra': 0.188, default: 0.045 },
  interest: { technology: 0.22, default: 0.12 },
  edu: { tertiary: 0.32, default: 0.3 },
  age: { '18-24': 0.082, default: 0.2 },
  gender: { female: 0.52, default: 0.48 },
};
const MOCK_COUNT_OVERRIDES = { 'age=18-24|interest=technology|region=volta': 237 };

export const getFilteredTalentCount = (filters) => {
  const entries = Object.entries(filters)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) return MOCK_TOTAL_TALENTS;
  const key = entries.map(([k, v]) => `${k}=${v}`).join('|');
  if (MOCK_COUNT_OVERRIDES[key] !== undefined) return MOCK_COUNT_OVERRIDES[key];
  const share = entries.reduce((acc, [k, v]) => {
    const table = MOCK_FILTER_SHARES[k] ?? {};
    return acc * (table[v] ?? table.default ?? 0.5);
  }, 1);
  const count = Math.round(MOCK_TOTAL_TALENTS * share);
  // The suppression rule is applied at render time by formatCount(); a zero-match view stays 0.
  return count < SUPPRESSION_THRESHOLD ? 0 : count;
};

const titleCase = (id) => id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** "volta" → "Volta", "18-24" → "18–24", "technology" → "Technology". */
export const humanizeFilterValue = (key, value) => {
  if (!value) return '';
  if (key === 'region') return regionById(value)?.name ?? titleCase(value);
  if (key === 'age') return value.replace('-', '–');
  return titleCase(value);
};

/** The filters label of a view: "Volta · Technology · 18–24" in the drawn order region · education · interest · age · gender. */
export const FILTER_LABEL_ORDER = ['region', 'edu', 'interest', 'age', 'gender'];

/** The 8.8.2a short names of the filter keys, used in the footer of the share dialog ("Filters included: Region: Ashanti"). */
export const FILTER_KEY_NAMES = {
  region: 'Region',
  edu: 'Education',
  interest: 'Interest',
  age: 'Age',
  gender: 'Gender',
};

/* ======================================================================================
 * BLOCK 2 · DOWNLOAD — POST /api/public/pdf-exports (future; a real PDF needs a backend). Figma 8.8.1a / e / f, sheet 8515:2461
 * ====================================================================================== */

export const DOWNLOAD_OPTIONS = [
  { id: 'view', label: 'This view', detail: 'National snapshot · 4 pages', sheet: '4 pages' },
  {
    id: 'full',
    label: 'Full snapshot',
    detail: 'Overview, outcomes, trends and methodology · 9 pages',
    sheet: '9 pages',
  },
  {
    id: 'regional',
    label: 'Regional pack',
    detail: 'Choose up to 3 regions · 3 pages each',
    sheet: 'Up to 3 regions',
  },
];
export const DOWNLOAD_REGIONAL_MAX = 3;
export const DOWNLOAD_NOTE_MAX = 200;
/** Figma 8504:251 — sample cover note. */
export const DOWNLOAD_DEFAULT_NOTE = 'Prepared for Hon. Minister of Youth, 17 Oct 2026';

export const DOWNLOAD_STEPS = [
  'Collecting live figures',
  'Laying out pages',
  'Drawing the regional map',
  'Adding methodology page',
];
/** 8.8.1e is drawn at 300 of 504 px = 59.5 % (step 3 of 4). A deep link to ?state=generating resumes there. */
export const DOWNLOAD_RESUME_PROGRESS = 300 / 504;
/** Mock timer: the whole "build" lasts this long (Figma copy: "usually takes under 10 seconds"). */
export const DOWNLOAD_MOCK_DURATION_MS = 6000;
export const DOWNLOAD_ERROR_CODE = 'PDF-504';

/**
 * Mock of POST /api/public/pdf-exports. Resolves when the "PDF" is ready, rejects with { code } when it fails.
 * Add `?pdf=fail` to the URL to exercise the failed state (8.8.1f) through the real flow.
 */
export const requestPdfExport = ({ shouldFail = false } = {}) =>
  new Promise((resolve, reject) => {
    window.setTimeout(
      () => (shouldFail ? reject({ code: DOWNLOAD_ERROR_CODE }) : resolve({ ready: true })),
      DOWNLOAD_MOCK_DURATION_MS
    );
  });

/* ======================================================================================
 * BLOCK 3 · DIGEST — POST /api/public/digest-subscriptions (future). Figma 8.8.3a / b / f, emails 8.8.3c-e
 * ====================================================================================== */

/*
 * ⚠️ ASSUMPTION: the three audiences of the site (Public, Investor, Government) are the roles of the "Your role" select.
 * The sample values below are what Figma draws in the filled form; flip DIGEST_PREFILL_SAMPLE to false to start the form empty.
 */
export const DIGEST_PREFILL_SAMPLE = true;
export const DIGEST_SAMPLE = {
  email: 'ama.mensah@youthministry.gov.gh',
  name: 'Ama Mensah',
  role: 'Government',
  regions: ['volta'],
};
export const DIGEST_ROLES = ['Government', 'Investor', 'Public'];
export const DIGEST_FIRST_ISSUE = '1 November 2026';
export const DIGEST_RESEND_SECONDS = 60;
export const DIGEST_UNDO_DAYS = 30;
export const DIGEST_MOCK_LATENCY_MS = 900;

export const subscribeToDigest = (payload) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ ok: true, email: payload.email }), DIGEST_MOCK_LATENCY_MS);
  });

/** "National" + the picked region names → "National + Volta" (Figma 8504:2623). */
export const digestRegionsLabel = (regionIds) =>
  ['National', ...regionIds.map((id) => regionById(id)?.name ?? id)].join(' + ');

/* ======================================================================================
 * BLOCK 4 · PRINT LAYOUTS — A4 portrait. Figma 8.2.1h (8503:258) and 8.5.1e (8503:448)
 * ====================================================================================== */

export const PRINT_STAMP = '17/10/2026, 14:05';
export const PRINT_OVERVIEW = {
  headerTitle: 'Ghana Talent Hub · National talent snapshot',
  pageLabel: 'Page 1 of 3',
  title: 'National snapshot',
  kpis: [
    { label: 'Talents', value: 219428, tone: 'green' },
    { label: 'Placements', value: 4218 },
    { label: 'Scholarships', text: 'GHS 2.4M' },
    { label: 'Active partners', value: 185 },
  ],
  mapTitle: 'Regional distribution',
  legend: [
    { swatch: '#c1d4c4', label: 'Under 6,000' },
    { swatch: '#6ca271', label: '6,000 – 9,999' },
    { swatch: '#387440', label: '10,000 – 14,999' },
    { swatch: '#224626', label: '15,000 – 29,999' },
    { swatch: '#142916', label: '30,000+' },
    { swatch: '#e4e4df', label: 'Fewer than 5 · hidden', muted: true },
  ],
  interestsTitle: 'Career interests · top 10',
  interests: [
    { label: 'Technology', value: 48320, bar: 156 },
    { label: 'Business & Finance', value: 36790, bar: 119 },
    { label: 'Health & Medical', value: 32850, bar: 106 },
    { label: 'Creative & Media', value: 28120, bar: 91 },
    { label: 'Education & Training', value: 25140, bar: 81 },
    { label: 'Agriculture', value: 23210, bar: 75 },
    { label: 'Engineering', value: 20340, bar: 66 },
    { label: 'Hospitality', value: 17420, bar: 56 },
    { label: 'Entrepreneurship', value: 15480, bar: 50 },
    { label: 'Public Service', value: 11650, bar: 38 },
  ],
  educationTitle: 'Who the talents are',
  education: [
    { label: 'Pre-tertiary', pct: 46, width: 327, bg: '#224626', fg: '#ffffff' },
    { label: 'In-tertiary', pct: 32, width: 227, bg: '#6ca271', fg: '#1c2a21' },
    { label: 'Post-tertiary', pct: 22, width: 156, bg: '#c1d4c4', fg: '#1c2a21' },
  ],
  footnote:
    'Printed from the live site. Colours print in greyscale-safe steps; values are labelled so they survive black-and-white printing.',
  browserLine: ['17/10/2026, 14:05', 'gh-talenthub.gov.gh/snapshot', '1/3'],
};

export const PRINT_OUTCOMES = {
  headerTitle: 'Ghana Talent Hub · Platform outcomes',
  pageLabel: 'Page 2',
  title: 'Platform outcomes · last 12 months',
  kpis: [
    { label: 'Placements', value: 4218 },
    { label: 'Scholarships', text: 'GHS 2.4M' },
    { label: 'Skills evidenced', text: '38%' },
    { label: 'Organisations', value: 237 },
  ],
  monthsTitle: 'Placements by month',
  /* Figma 8503:470: axis 0–500, 35 px per 100; values read back from the bar heights (⚠️ approximate, sample). */
  months: [
    { id: 'N', value: 211 },
    { id: 'D', value: 189 },
    { id: 'J', value: 286 },
    { id: 'F', value: 300 },
    { id: 'M', value: 317 },
    { id: 'A', value: 334 },
    { id: 'M', value: 340 },
    { id: 'J', value: 366 },
    { id: 'J', value: 389 },
    { id: 'A', value: 400 },
    { id: 'S', value: 429 },
    { id: 'O', value: 437, current: true },
  ],
  monthsAxis: [0, 100, 200, 300, 400, 500],
  typesTitle: 'Placements by type',
  types: [
    { label: 'Jobs', value: 1640, bar: 436 },
    { label: 'Internships', value: 1410, bar: 375 },
    { label: 'Training', value: 820, bar: 218 },
    { label: 'Apprenticeships', value: 348, bar: 93 },
  ],
  storiesTitle: 'Stories from the platform',
  stories:
    'From Tamale to a data internship · A scholarship for nursing school · Apprenticeship to own business. Full stories at gh-talenthub.gov.gh/outcomes.',
  footer:
    'Live data as of 17 Oct 2026, 14:02 GMT · Figures under 5 shown as “<5” · gh-talenthub.gov.gh/snapshot',
};

/* ======================================================================================
 * BLOCK 5 · REPORT — GET /api/public/reports/national (future). Figma 8.8.1 v2 report kit, 8 pages, A4 landscape
 * ====================================================================================== */

export const REPORT_FOOTER = 'Ghana Talent Hub  ·  National talent snapshot  ·  17 October 2026';
export const REPORT_PAGE_COUNT = 8;

export const REPORT_COVER = {
  brand: 'Ghana Talent Hub',
  eyebrow: 'National talent snapshot  ·  October 2026',
  /* Figma 8898:66840 draws a straight apostrophe in "Ghana's talent," (kept as drawn); the second line is green. */
  titleLines: ["Ghana's talent,", 'region by region'],
  intro:
    'A live picture of the young Ghanaians who have built a verified profile on Ghana Talent Hub: where they are, what they want to do, and what changes when their skills are verified.',
  preparedLabel: 'Prepared for',
  preparedFor: 'Hon. Minister of Youth, 17 Oct 2026',
  bigNumber: 219428,
  bigNumberLabel: 'registered talents across all 16 regions',
  leafStat: 16,
  leafStatLabel: ['regions, every one', 'on the map'],
  footer: 'Live data as of 17 Oct 2026, 14:02 GMT  ·  gh-talenthub.gov.gh/snapshot',
};

export const REPORT_CONTENTS = {
  vertical: 'Contents',
  inside: 'Inside this snapshot',
  meta: ['8 pages  ·  17 October 2026', 'Data is live at the time of download.'],
  outline: 'Contents',
  footer: 'Ghana Talent Hub  ·  National talent snapshot  ·  17 October 2026',
  sections: [
    {
      numeral: '1',
      title: 'Where the talent is',
      items: ['Regional map', 'Top regions', 'Where we are thin'],
      ref: 'Page 4',
      x: 432,
    },
    {
      numeral: '2',
      title: 'What they want to do',
      items: ['Career interests', 'Education levels'],
      ref: 'Page 5',
      x: 598,
    },
    {
      numeral: '3',
      title: 'How GTH works',
      items: ['Learn, verify,', 'get matched, earn'],
      ref: 'Page 6',
      x: 764,
    },
    {
      numeral: '4',
      title: 'Results and method',
      items: ['Three stories', 'How we count'],
      ref: 'Pages 7–8',
      x: 930,
    },
  ],
};

export const REPORT_OPENER = {
  photoHeadline: ['RISING', 'TALENT'],
  eyebrow: 'Section 1  ·  Where the talent is',
  title: 'Yɛn daakye',
  subtitle: 'Our future, in our hands',
  body: [
    '219,428 young Ghanaians have built a verified profile on Ghana Talent Hub. They live in every region, from Upper East to Western North.',
    'This snapshot shows where they are, what they want to do, and what changes when their skills are verified and matched to real opportunities.',
  ],
  quote: '“When a skill is verified, a recruiter in Accra can trust a student in Bolgatanga.”',
  quoteBy: 'GTH team, 2026',
  footer: 'Ghana Talent Hub  ·  17 Oct 2026',
};

export const REPORT_TALENT = {
  eyebrow: '01  ·  Where the talent is',
  title: 'Every region is on the map',
  sub: 'Talents per region, from verified profiles. Darker green means more talents. Areas with weaker internet are under-represented.',
  legendTitle: 'Talents per region',
  legend: [
    { swatch: '#c1d4c4', label: 'Under 6,000' },
    { swatch: '#6ca271', label: '6,000 – 9,999' },
    { swatch: '#387440', label: '10,000 – 14,999' },
    { swatch: '#224626', label: '15,000 – 29,999' },
    { swatch: '#142916', label: '30,000+' },
  ],
  topTitle: 'Top five regions',
  top: [
    { rank: '01', name: 'Greater Accra', value: 41260, bar: 330, tone: 'dark' },
    { rank: '02', name: 'Ashanti', value: 36940, bar: 297, tone: 'dark' },
    { rank: '03', name: 'Eastern', value: 18720, bar: 149 },
    { rank: '04', name: 'Northern', value: 16350, bar: 132 },
    { rank: '05', name: 'Central', value: 14110, bar: 116 },
  ],
  calloutEyebrow: 'Where we are thin',
  calloutText:
    'Oti, Ahafo and Western North each have under 6,000 talents. Mobile sign-up days are planned there for November.',
  stats: [
    { value: 219428, label: 'talents' },
    { value: 16, label: 'regions' },
    { value: 4218, label: 'placements' },
    { value: 'GHS 2.4M', label: 'scholarships' },
    { value: 185, label: 'active partners' },
  ],
};

export const REPORT_INTERESTS = {
  eyebrow: '02  ·  What they want to do',
  title: 'Technology leads. Health and business are close behind.',
  sub: 'Top 10 career interests chosen during onboarding (a talent can pick up to three).',
  interests: [
    { label: 'Technology', value: 48320, bar: 330, tone: 'dark' },
    { label: 'Business & Finance', value: 36790, bar: 248 },
    { label: 'Health & Medical', value: 32850, bar: 231 },
    { label: 'Creative & Media', value: 28120, bar: 198 },
    { label: 'Education & Training', value: 25140, bar: 165 },
    { label: 'Agriculture', value: 23210, bar: 165 },
    { label: 'Engineering', value: 20340, bar: 132 },
    { label: 'Hospitality', value: 17420, bar: 116 },
    { label: 'Entrepreneurship', value: 15480, bar: 99 },
    { label: 'Public Service', value: 11650, bar: 83 },
  ],
  highlightValue: '1 in 5',
  highlightText:
    'talents want a technology career. Only 31% of them have a verified tech skill yet.',
  peopleTitle: 'Who the talents are',
  people: [
    { pct: 46, label: 'Pre-tertiary', hint: 'SHS and TVET students', bar: 293 },
    { pct: 32, label: 'In tertiary', hint: 'University and college', bar: 205 },
    { pct: 22, label: 'Post-tertiary', hint: 'Graduates and workers', bar: 146 },
  ],
  note: 'A talent can pick up to three interests, so the bars add up to more than 219,428.',
};

export const REPORT_HOW = {
  eyebrow: '03  ·  How GTH works',
  title: 'Skills that are verified get used',
  sub: 'Four steps move a young person from learning to earning. Each number is for the 12 months to October 2026.',
  steps: [
    { n: '01', name: 'Learn', value: 58900, text: 'learners took a course or assessment', x: 48 },
    { n: '02', name: 'Verify', value: 31540, text: 'skills verified by tests or tutors', x: 310 },
    { n: '03', name: 'Get matched', value: 4218, text: 'placements confirmed by partners', x: 572 },
    {
      n: '04',
      name: 'Earn',
      value: 'GHS 2.4M',
      text: 'in scholarships and stipends',
      x: 834,
      filled: true,
    },
  ],
  policyEyebrow: 'What it means for policy',
  policies: [
    {
      title: 'Fund verification, not only training',
      text: 'Only 53% of learners reach a verified skill. Assessment centres in each region would close the gap.',
      x: 72,
    },
    {
      title: 'Grow placements outside Accra',
      text: '62% of placements are in Greater Accra and Ashanti. Partner incentives can spread them.',
      x: 407,
    },
    {
      title: 'Keep the data open',
      text: 'This snapshot updates live. Officials can subscribe to a monthly regional digest.',
      x: 742,
    },
  ],
};

export const REPORT_RESULTS = {
  eyebrow: '04  ·  Results',
  sub: 'Three stories from three regions, told with verified numbers.',
  bigTitle: ['RESULTS ON', 'THE GROUND'],
  cases: [
    {
      id: 'school',
      bg: '#387440',
      region: 'Northern',
      chipWidth: 82,
      title: 'Savannah Hills SHS  ·  A whole class on the map',
      text: 'The registrar uploaded 298 students in one afternoon. Guardians consented by SMS and every certificate can now be checked by any employer.',
      stats: [
        { value: 298, label: 'students' },
        { value: 231, label: 'certificates' },
        { value: 41, label: 'guardian consents' },
      ],
    },
    {
      id: 'office',
      bg: '#2a5730',
      region: 'Greater Accra',
      chipWidth: 111,
      title: 'Accra Tech  ·  Interns hired on verified skills',
      text: 'Accra Tech filtered by verified React and SQL skills and hired its 2026 intern class in three weeks, half the usual time.',
      stats: [
        { value: 24, label: 'interns' },
        { value: '3 wks', label: 'to hire' },
        { value: 'GHS 1,200', label: 'monthly stipend' },
      ],
    },
    {
      id: 'graduate',
      bg: '#387440',
      region: 'Volta',
      chipWidth: 58,
      title: 'MTN Data Skills award  ·  Scholarships that reach the regions',
      text: 'Shortlists use verified assessments instead of CVs. A third of this year’s winners live outside Accra and Kumasi.',
      stats: [
        { value: 120, label: 'awards' },
        { value: 'GHS 2,000', label: 'each' },
        { value: '34%', label: 'outside Accra, Kumasi' },
      ],
    },
  ],
};

export const REPORT_METHOD = {
  eyebrow: '05  ·  How we count',
  title: 'Nothing in this report is estimated',
  sub: 'All figures come live from the Ghana Talent Hub database at the time of download.',
  blocks: [
    {
      title: 'Source',
      text: 'All figures come live from the GTH database at the time of download. Nothing is estimated or modelled.',
      x: 48,
      y: 200,
      strong: true,
    },
    {
      title: 'Privacy',
      text: 'No names, photos or contact details. Counts below 5 show as “<5” and smaller breakdowns are hidden.',
      x: 378,
      y: 200,
      strong: true,
    },
    {
      title: 'Talent',
      text: 'A person with a confirmed account who finished onboarding. Duplicates are merged through Ghana Card checks.',
      x: 48,
      y: 350,
    },
    {
      title: 'Placement',
      text: 'A job, internship, apprenticeship or training start found through GTH and confirmed by the partner.',
      x: 378,
      y: 350,
    },
    {
      title: 'Regions',
      text: 'The 16 regions created in 2019. District markers are approximate until official boundary files are added.',
      x: 48,
      y: 500,
    },
    {
      title: 'Limitations',
      text: 'Interests and some education details are self-reported. Areas with weaker internet are under-represented.',
      x: 378,
      y: 500,
    },
  ],
  dataLine:
    'Data as of  17 October 2026, 14:02 GMT   ·   Methodology version 1.3   ·   gh-talenthub.gov.gh/methodology',
  backTitle: 'Check this report is real',
  backText:
    'Scan the code or open the link. You will see the same figures and the time they were taken.',
  verifyUrl: 'gh-talenthub.gov.gh/verify/R-2026-1017-NAT',
  questions: ['Questions about this report', 'reports@gh-talenthub.gov.gh'],
};

/* ======================================================================================
 * BLOCK 6 · UNSUBSCRIBED — Figma 8.8.3f (8505:187)
 * ====================================================================================== */

export const UNSUBSCRIBED_SAMPLE_EMAIL = 'ama.mensah@youthministry.gov.gh';
