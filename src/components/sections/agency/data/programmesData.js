import { MAP_REGIONS_SAMPLE } from '../../publicData/map/data/mapData.js';
import { REGIONS } from '../../publicData/regionsList.js';
import { isSuppressed } from '../../publicData/publicDataFormat.js';

/*
 * programmesData.js — API-shaped MOCK data of the agency programmes (Figma 11.5.2a-k, canvas 8605:395409). SAMPLE CONTENT ONLY.
 * Future endpoints: GET /agency/programmes, POST /agency/programmes (draft), PATCH /agency/programmes/:id (close, duplicate),
 * GET /agency/programmes/:id/audience?rules (the "Audience preview"), POST /agency/programmes/:id/publish,
 * GET /agency/programmes/:id/applicants (the pipeline). Counts under 5 are printed "<5" by the components (formatCount).
 *
 * BLOCK 1 programmes   BLOCK 2 templates   BLOCK 3 eligibility rules + audience   BLOCK 4 supply insights
 * BLOCK 5 talent preview + published   BLOCK 6 applicant pipeline
 */

/* ===== BLOCK 1 · programmes (Figma 11.5.2e / f) ======================================================================= */

export const PROGRAMME_TABS = [
  { id: 'programmes', label: 'Your programmes' },
  { id: 'templates', label: 'Templates' },
  { id: 'apply', label: 'Who can apply' },
];

export const PROGRAMME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'draft', label: 'Draft' },
  { id: 'closed', label: 'Closed' },
];

/* status: live | draft | closed. The card tile colours are the Figma ones. ⚠️ ASSUMPTION: the last two rows are sample content
   (the header counts "All (5)", the frame draws three cards). */
export const PROGRAMMES = [
  {
    id: 'ysd-2026',
    title: 'YouthStart Digital Grant',
    optionLabel: 'YouthStart Digital Grant — national',
    status: 'live',
    statusLabel: 'Active',
    icon: 'pencil',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
    place: 'National · all 16 regions',
    kind: 'Start-up grant · 8-week course',
    stamp: 'Posted 2 Oct',
    applicants: 1912,
    toReview: 340,
    avgMatch: 79,
    success: { rate: '33.7%', delta: '▲ +3.1 pts', placed: 620, enrolled: 1840, bar: 302 / 358 },
    action: 'View applicants',
  },
  {
    id: 'nss-2027',
    title: 'NSS Placement Matching 2027',
    optionLabel: 'NSS Placement Matching 2027 — national',
    status: 'draft',
    statusLabel: 'Draft',
    icon: 'board',
    tile: { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' },
    place: 'National · NSS secretariat',
    kind: 'National Service · 12 months',
    stamp: 'Draft · saved 15 Oct',
    applicants: null,
    toReview: null,
    avgMatch: null,
    success: null,
    action: 'Continue editing',
  },
  {
    id: 'agri-2026',
    title: 'Youth in Agribusiness Training',
    optionLabel: 'Youth in Agribusiness Training — Bono East · Northern · Savannah',
    status: 'closed',
    statusLabel: 'Closed',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#737373]' },
    place: 'Bono East · Northern · Savannah',
    kind: '6-week training + inputs',
    // Figma draws "Draft · saved 15 Oct" here too (a copy slip on a closed programme); kept as drawn.
    stamp: 'Draft · saved 15 Oct',
    applicants: 412,
    toReview: null,
    avgMatch: 71,
    success: { rate: '23.3%', delta: 'Final', placed: 294, enrolled: 1260, bar: 302 / 358 },
    action: 'View summary',
  },
  {
    id: 'job-fair-2026',
    title: 'District Job Fair Series',
    optionLabel: 'District Job Fair Series — Northern',
    status: 'live',
    statusLabel: 'Active',
    icon: 'board',
    tile: { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' },
    place: 'Northern',
    kind: 'Events · 1 day',
    stamp: 'Posted 9 Sep',
    applicants: 236,
    toReview: 41,
    avgMatch: 68,
    success: { rate: '18.0%', delta: '▲ +1.2 pts', placed: 42, enrolled: 233, bar: 0.45 },
    action: 'View applicants',
  },
  {
    id: 'skills-pilot-2025',
    title: 'Skills for Work Pilot',
    optionLabel: 'Skills for Work Pilot — Volta',
    status: 'closed',
    statusLabel: 'Closed',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#737373]' },
    place: 'Volta',
    kind: 'Training · 8–12 weeks',
    stamp: 'Closed 30 Jun',
    applicants: 188,
    toReview: null,
    avgMatch: 64,
    success: { rate: '27.1%', delta: 'Final', placed: 51, enrolled: 188, bar: 0.68 },
    action: 'View summary',
  },
];

export const programmeById = (id) => PROGRAMMES.find((p) => p.id === id) ?? null;

export const ACTION_MENU = [
  { id: 'edit', label: 'Edit programme' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close programme', danger: true },
];

/** The Close dialog sentence takes the applicant count of the programme (Figma: "Your 1,912 applicants ..."). */
export const closeSentence = (count) =>
  `Talents can’t apply once it’s closed. Your ${new Intl.NumberFormat('en-GH').format(count)} applicants and their stages stay as they are. Closing is logged under the MoU.`;

/* ===== BLOCK 2 · templates (Figma 11.5.2g) ============================================================================= */

export const TEMPLATE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'grants', label: 'Grants' },
  { id: 'service', label: 'National service' },
  { id: 'training', label: 'Training' },
  { id: 'employment', label: 'Employment' },
  { id: 'events', label: 'Events' },
  { id: 'internships', label: 'Internships' },
];

export const TEMPLATES = [
  {
    id: 'youthstart-grant',
    title: 'YouthStart grant',
    group: 'grants',
    badge: 'Grant',
    length: '8-week course',
    blurb: 'Start-up grant with a short course and pitch day.',
    foot: 'Last used 2 days ago',
    icon: 'code',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
  },
  {
    id: 'skills-training',
    title: 'Skills training',
    group: 'training',
    badge: 'Training',
    length: '8–12 weeks',
    blurb: 'Regional training with stipend, schedule and certificate fields.',
    foot: 'Popular Choice',
    icon: 'megaphone',
    tile: { bg: 'bg-[#ffddb6]', fg: 'text-[#633e00]' },
  },
  {
    id: 'nss-placement',
    title: 'National service placement',
    group: 'service',
    badge: 'NSS',
    length: '6–12 months',
    blurb: 'Match service personnel to host institutions by region.',
    foot: '4 variants',
    icon: 'service',
    tile: { bg: 'bg-[#c1e9c9]', fg: 'text-[#43664d]' },
  },
  {
    id: 'agribusiness-training',
    title: 'Agribusiness training',
    group: 'training',
    badge: 'Agriculture',
    length: '3–6 months',
    blurb: 'Field training with inputs and a cooperative.',
    foot: 'Updated Q3 2026',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#404941]' },
  },
  {
    id: 'job-fair',
    title: 'Regional job fair',
    group: 'events',
    badge: 'Events',
    length: '1 day',
    blurb: 'District job fairs and info sessions with RSVP.',
    foot: 'New',
    icon: 'palette',
    tile: { bg: 'bg-[#1f6b3f]', fg: 'text-[#9de9b2]' },
  },
];

/* ===== BLOCK 3 · eligibility rules + audience (Figma 11.5.2a / h / i) ================================================ */

export const AGE_RANGES = [
  { id: '18-35', label: '18–35', factor: 1 },
  { id: '18-24', label: '18–24', factor: 0.55 },
  { id: '25-35', label: '25–35', factor: 0.45 },
];

export const SKILL_OPTIONS = [
  'Digital marketing',
  'Web design',
  'Bookkeeping',
  'Data analysis',
  'Graphic design',
  'Customer service',
  'Basic coding',
];

export const READINESS_STEPS = [
  { months: 1, label: 'Ready in 1 month', factor: 0.5 },
  { months: 2, label: 'Ready in 2 months', factor: 0.8 },
  { months: 3, label: 'Ready in 3 months', factor: 1 },
  { months: 6, label: 'Ready in 6 months', factor: 1.3 },
];

export const DEFAULT_RULES = {
  ageOn: true,
  age: '18-35',
  skillsOn: true,
  skills: ['Digital marketing', 'Web design', 'Bookkeeping'],
  regionOn: false,
  regions: [],
  readinessOn: true,
  readiness: 3,
  under18: false,
};

const POOL = 42610;
const MATCH_DEFAULT = 9870;
const NATIONAL = MAP_REGIONS_SAMPLE.reduce((a, r) => a + (r.count ?? 0), 0) || 1;

export const REGION_CHOICES = REGIONS.map((r) => ({ id: r.id, label: r.name }));

/**
 * Mock of GET /agency/programmes/:id/audience. Returns { pool, match, readyPct, readyNow, stars }.
 * Counts under 5 are returned raw: the components print them "<5" (formatCount), and "Save and continue" is blocked
 * while fewer than 5 talents match ("Groups under 5 can’t be targeted").
 * ⚠️ ASSUMPTION: every factor is sample maths calibrated to the drawn default (42,610 in the pool, 9,870 matching, 81 % ready now).
 */
export const computeAudience = (rules, { forceUnder5 = false } = {}) => {
  if (forceUnder5) return { pool: 6, match: 4, readyPct: 50, readyNow: 2, stars: 4 };
  const regionShare =
    rules.regionOn && rules.regions.length
      ? rules.regions.reduce(
          (a, id) => a + (MAP_REGIONS_SAMPLE.find((r) => r.id === id)?.count ?? 0),
          0
        ) / NATIONAL
      : 1;
  const age = AGE_RANGES.find((a) => a.id === rules.age)?.factor ?? 1;
  const ageF = rules.ageOn ? age : 1;
  const skillsF = rules.skillsOn
    ? Math.min(1.5, Math.sqrt(Math.max(1, rules.skills.length) / 3))
    : 1.6;
  const readyF = rules.readinessOn
    ? (READINESS_STEPS.find((s) => s.months === rules.readiness)?.factor ?? 1)
    : 1.4;
  const pool = Math.round(POOL * regionShare);
  const match = Math.min(pool, Math.round(MATCH_DEFAULT * regionShare * ageF * skillsF * readyF));
  const readyPct = 81;
  return { pool, match, readyPct, readyNow: Math.round((match * readyPct) / 100), stars: 4 };
};

export const audienceBlocked = (audience) => isSuppressed(audience.match);

/** The sentence under the stars. */
export const audienceNote = (audience, formatCount) =>
  audienceBlocked(audience)
    ? `Only ${formatCount(audience.match)} talents match these rules. Groups under 5 can’t be targeted. Widen the age range or add a region.`
    : `About ${formatCount(audience.match)} talents will see this programme in their feed.`;

/** ⚠️ ASSUMPTION: the phone number the policy check finds in the description (Figma 11.5.2i), masked as drawn. */
export const POLICY_FINDING = {
  title: 'Remove contact details to publish',
  sentence:
    'Your description includes a phone number (030 •••• 412). Talents reach NYA through GTH, so contact details can’t go in programmes.',
};

/* ===== BLOCK 4 · supply insights ======================================================================================= */

export const SUPPLY_INSIGHTS = [
  {
    id: 'stipend',
    label: 'Typical stipend',
    value: '₵5k – ₵20k',
    note: 'What similar national grants paid in 2025.',
  },
  {
    id: 'speed',
    label: 'Response speed',
    value: 'Fast',
    note: 'Talents here usually reply within 2 days.',
  },
  {
    id: 'gender',
    label: 'Gender balance',
    value: '52% women',
    note: 'Your rules keep a balanced audience.',
  },
];

/* ===== BLOCK 5 · talent preview + published (Figma 11.5.2b / c) ======================================================== */

export const PREVIEW = {
  agency: 'National Youth Authority',
  agencyLine: 'Agency · Accra · national',
  agencyBadge: 'Government agency · MoU active',
  sticker: 'New today',
  title: 'YouthStart Digital Grant',
  chips: [
    { id: 'where', text: 'All regions · Online + hubs' },
    { id: 'what', text: '8-week course, then grant' },
    { id: 'pay', text: 'Grant up to GHS 20,000' },
    { id: 'closes', text: 'Closes 30 Nov' },
  ],
  hint: 'Takes 1 minute. You’ll preview what they see first.',
  about: {
    title: 'About the grant',
    intro:
      'A government start-up grant for young Ghanaians with a digital business idea. Finish the 8-week course to unlock funding.',
    bullets: [
      'Learn to plan, price and market a small business',
      'Pitch to a regional YouthStart panel',
      'Weekly mentoring at your nearest NYA hub',
      'Graduates get a GTH-verified certificate',
    ],
  },
  good: {
    title: 'Good to have',
    summary: 'You have 3 of 4',
    items: [
      { id: 'dm', text: 'Digital marketing', verified: true },
      { id: 'bk', text: 'Bookkeeping' },
      { id: 'bp', text: 'Business plan draft' },
      { id: 'gc', text: 'Ghana Card' },
    ],
    missing: 'Business registration',
  },
  match: {
    pct: 79,
    label: 'Strong match',
    note: 'NYA sees you in the top matches for this grant in Greater Accra.',
    rows: [
      { id: 'skills', label: 'Skills', value: '3 of 4' },
      { id: 'education', label: 'Education', value: 'BSc' },
      { id: 'region', label: 'Region', value: 'Greater Accra' },
    ],
  },
  boost: {
    title: 'Boost to ~86%',
    delta: '+7%',
    note: 'Register your business name with ORC and your match jumps.',
    have: 'I’ve registered',
    learn: 'How to register',
  },
  runner: {
    heading: 'WHO’S RUNNING IT',
    name: 'Efua Owusu',
    role: 'Director, Research & Data · NYA',
    reply: 'Usually replies within 3 days',
  },
};

export const PUBLISHED = {
  sticker: 'Live now',
  title: 'Programme published!',
  body: (count) =>
    `${count} matched talents will see YouthStart Digital Grant in their feed today.`,
  next: [
    'Applicants land in your pipeline',
    'We email you a daily digest',
    'Broadcast it to a saved filter',
  ],
  back: 'Back to programmes',
  view: 'View applicants',
};

/* ===== BLOCK 6 · applicant pipeline (Figma 11.5.2d) ==================================================================== */

/** Names stay masked until the talent accepts an invite (first name + initial only). */
export const PIPELINE_COLUMNS = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'pitch', label: 'Pitch day' },
  { id: 'offered', label: 'Grant offered' },
  { id: 'funded', label: 'FUNDED' },
  { id: 'declined', label: 'not selected' },
];

export const APPLICANTS = [
  {
    id: 'a1',
    stage: 'applied',
    initials: 'KA',
    tint: '#fae7b5',
    name: 'Kwame A.',
    sub: 'Match 91% • BSc · Accra',
    skills: ['Digital marketing', 'Business plan'],
    ago: '2h ago',
    rating: '4.8',
  },
  {
    id: 'a2',
    stage: 'applied',
    name: 'Yaa D.',
    sub: 'Match 84% • HND · Kumasi',
    skills: ['Bookkeeping', 'Ghana Card'],
    ago: '5h ago',
    rating: '3.2',
  },
  {
    id: 'a3',
    stage: 'screening',
    initials: 'FI',
    tint: '#e6e1fa',
    name: 'Fuseini I.',
    sub: 'Match 76% • WASSCE · Tamale',
    skills: ['Web design', 'Bookkeeping'],
    next: { title: 'Next: eligibility call', when: 'Tuesday at 14:00' },
  },
  {
    id: 'a4',
    stage: 'shortlisted',
    initials: 'AS',
    tint: '#dce7fa',
    name: 'Adwoa S.',
    sub: 'Match 88% • BA · Ho',
    skills: ['E-commerce', 'Registered business'],
    invite: 'Invite to pitch day',
  },
  {
    id: 'a5',
    stage: 'pitch',
    name: 'Kwesi O.',
    sub: 'Tue 20 Oct · 10:00',
    pitch: { tone: 'amber', title: 'Pitch day', place: 'Accra hub' },
    primary: null,
    secondary: 'View details',
    badge: 'hourglass',
  },
  {
    id: 'a6',
    stage: 'pitch',
    name: 'Ibrahim Y.',
    sub: 'Mon 19 Oct · 10:00',
    pitch: { tone: 'red', title: 'Missed pitch', place: 'Accra hub' },
    primary: 'Mark as attended',
    secondary: 'Reschedule',
    badge: 'alert',
  },
  {
    id: 'a7',
    stage: 'pitch',
    name: 'Abena M.',
    sub: 'Thu 15 Oct · 10:00',
    pitch: { tone: 'green', title: 'Pitched · scored 78', place: 'Accra hub' },
    primary: null,
    secondary: 'View scores',
    badge: 'done',
  },
  {
    id: 'a8',
    stage: 'offered',
    initials: 'EK',
    tint: '#f8dccf',
    name: 'Efia K.',
    sub: 'Awaiting response',
    subTone: 'amber',
  },
  { id: 'a9', stage: 'funded', name: 'Akua N.', sub: 'Funded Oct 14' },
  { id: 'a10', stage: 'declined', name: 'Kojo B.', sub: 'Outside age range', dim: true },
];

export const APPLICANTS_COPY = {
  title: 'Applicants',
  sentence:
    'Move applicants from applied to funded. Names stay masked until they accept an invite.',
};
