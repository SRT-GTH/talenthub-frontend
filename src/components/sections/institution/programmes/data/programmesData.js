/*
 * programmesData.js — API-shaped MOCK data of the institution programmes (Figma 11.3.1a-d + 11.3.4a-e, canvas 8520:10). SAMPLE CONTENT ONLY.
 * Future endpoints: GET /institution/programmes, POST /institution/programmes (draft), PATCH /institution/programmes/:id (close, duplicate),
 * GET /institution/programmes/:id/audience?rules (the "Audience preview"), POST /institution/programmes/:id/publish,
 * GET /institution/programmes/:id/applicants (the board). Counts in AGGREGATES go through formatCount() ("<5" under 5); the applicants board shows
 * the school's own students by name (their roster, as the Figma subtitle says: "They’re your students, so you see their names").
 *
 * BLOCK 1 programmes   BLOCK 2 templates   BLOCK 3 eligibility rules + audience   BLOCK 4 your students (insights)
 * BLOCK 5 student preview + published   BLOCK 6 applicants board
 */

import { isSuppressed } from '../../institutionFormat.js';

/* ===== BLOCK 1 · programmes (Figma 11.3.4a / b) ======================================================================= */

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

/** The programme the Who-can-apply form, the preview, the published dialog and the applicants board show by default (Figma "Scholarship Prep Clinic — Form 3"). */
export const DEFAULT_PROGRAMME_ID = 'scholarship-prep-clinic';

/** The foundation's proposed URL id (tests/institution/frames.json) resolves to the default programme. */
export const PROGRAMME_ALIASES = { 'science-scholarship-2027': DEFAULT_PROGRAMME_ID };

/* status: live | draft | closed. The card tile colours are the Figma ones. ⚠️ ASSUMPTION: the first three rows are the drawn cards; the last two
   (Scholarship Prep Clinic, Alumni Mentoring Circle) are sample rows that make the drawn "All (5)" and "Draft (1)" true. */
export const PROGRAMMES = [
  {
    id: 'form3-holiday-internships',
    title: 'Form 3 Holiday Internships',
    optionLabel: 'Form 3 Holiday Internships — Form 3',
    status: 'live',
    statusLabel: 'Active',
    icon: 'pencil',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
    place: 'Form 3 · all programmes',
    kind: '6-week placement with local businesses',
    stamp: 'Posted 2 Oct',
    applicants: 184,
    toReview: 42,
    avgMatch: 79,
    success: { rate: '33.7%', delta: '▲ +3.1 pts', placed: 62, of: 184, bar: 302 / 358 },
    action: 'View applicants',
  },
  {
    id: 'scholarship-nominations-2027',
    title: 'Scholarship Nominations 2027',
    optionLabel: 'Scholarship Nominations 2027 — Form 3',
    status: 'draft',
    statusLabel: 'Draft',
    icon: 'board',
    tile: { bg: 'bg-[#faf4e8]', fg: 'text-[#785910]' },
    place: 'Form 3 · top 10% of class',
    kind: 'University scholarships · 4 partners',
    stamp: 'Draft · saved 15 Oct',
    applicants: null,
    toReview: null,
    avgMatch: null,
    success: null,
    action: 'Continue editing',
  },
  {
    id: 'coding-club-bootcamp',
    title: 'Coding Club Bootcamp',
    optionLabel: 'Coding Club Bootcamp — Form 1 and 2',
    status: 'closed',
    statusLabel: 'Closed',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#737373]' },
    place: 'Form 1 and 2 · after school',
    kind: '8-week coding club with Kumasi Hive',
    // Figma draws "Draft · saved 15 Oct" here too (a copy slip on a closed programme); kept as drawn.
    stamp: 'Draft · saved 15 Oct',
    applicants: 96,
    toReview: null,
    avgMatch: 71,
    success: { rate: '23.3%', delta: 'Final', placed: 22, of: 96, bar: 302 / 358 },
    action: 'View summary',
  },
  {
    id: DEFAULT_PROGRAMME_ID,
    title: 'Scholarship Prep Clinic',
    optionLabel: 'Scholarship Prep Clinic — Form 3',
    status: 'live',
    statusLabel: 'Active',
    icon: 'hat',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
    place: 'Form 3 · linked profiles',
    kind: '6 Saturdays · School library',
    stamp: 'Posted 12 Oct',
    applicants: 64,
    toReview: 3,
    avgMatch: 78,
    success: null,
    action: 'View applicants',
  },
  {
    id: 'alumni-mentoring-circle',
    title: 'Alumni Mentoring Circle',
    optionLabel: 'Alumni Mentoring Circle — Form 3',
    status: 'closed',
    statusLabel: 'Closed',
    icon: 'board',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#737373]' },
    place: 'Form 3 · alumni mentors',
    kind: '6 sessions',
    stamp: 'Closed 30 Jun',
    applicants: 38,
    toReview: null,
    avgMatch: 66,
    success: { rate: '31.6%', delta: 'Final', placed: 12, of: 38, bar: 0.32 },
    action: 'View summary',
  },
];

export const programmeById = (id) =>
  PROGRAMMES.find((p) => p.id === (PROGRAMME_ALIASES[id] ?? id)) ?? null;

export const ACTION_MENU = [
  { id: 'edit', label: 'Edit programme' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close programme', danger: true },
];

/** The Close dialog sentence takes the applicant count of the programme (Figma: "Your 184 applicants ..."). */
export const closeSentence = (count) =>
  `Students can’t apply once it’s closed. Your ${new Intl.NumberFormat('en-GH').format(count)} applicants and their stages stay as they are. Closing is logged with your name.`;

/* ===== BLOCK 2 · templates (Figma 11.3.4c) ============================================================================= */

export const TEMPLATE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'internships', label: 'Internships' },
  { id: 'scholarships', label: 'Scholarships' },
  { id: 'clubs', label: 'Clubs' },
  { id: 'events', label: 'Career events' },
  { id: 'mentoring', label: 'Mentoring' },
  { id: 'exchanges', label: 'Exchanges' },
];

/* ⚠️ ASSUMPTION: the group of each card (the chips filter by it; Figma draws only "All" selected). "YouthStart grant" sits under Scholarships. */
export const TEMPLATES = [
  {
    id: 'youthstart-grant',
    title: 'YouthStart grant',
    group: 'scholarships',
    badge: 'Grant',
    length: '8-week course',
    blurb: 'Start-up grant with a short course and pitch day.',
    foot: 'Last used 2 days ago',
    icon: 'code',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
  },
  {
    id: 'scholarship-nomination',
    title: 'Scholarship nomination',
    group: 'scholarships',
    badge: 'Clubs',
    length: '1 round',
    blurb: 'Nominate top students to partner universities and foundations.',
    foot: 'Popular Choice',
    icon: 'megaphone',
    tile: { bg: 'bg-[#ffddb6]', fg: 'text-[#633e00]' },
  },
  {
    id: 'after-school-club',
    title: 'After-school club',
    group: 'clubs',
    badge: 'Club',
    length: '1 term',
    blurb: 'Coding, debate or robotics clubs with attendance and badges.',
    foot: '4 variants',
    icon: 'service',
    tile: { bg: 'bg-[#c1e9c9]', fg: 'text-[#43664d]' },
  },
  {
    id: 'career-fair',
    title: 'Career fair',
    group: 'events',
    badge: 'Event',
    length: '1 day',
    blurb: 'Bring employers and universities to campus, with RSVP.',
    foot: 'Updated Q3 2026',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#404941]' },
  },
  {
    id: 'alumni-mentoring',
    title: 'Alumni mentoring',
    group: 'mentoring',
    badge: 'Mentoring',
    length: '6 sessions',
    blurb: 'Pair Form 3 students with alumni mentors.',
    foot: 'New',
    icon: 'palette',
    tile: { bg: 'bg-[#1f6b3f]', fg: 'text-[#9de9b2]' },
  },
];

/* ===== BLOCK 3 · eligibility rules + audience (Figma 11.3.1a) ========================================================= */

/** Students on the roster per year group (847 in total = the persona card). The drawn Form 3 figure is 247. */
export const FORMS = [
  { id: 'form-1', label: 'Form 1', students: 298 },
  { id: 'form-2', label: 'Form 2', students: 302 },
  { id: 'form-3', label: 'Form 3', students: 247 },
];

export const STUDY_PROGRAMMES = [
  'General Science',
  'Business',
  'General Arts',
  'Technical',
  'Visual Arts',
  'Home Economics',
  'Agricultural Science',
];

/** "AT LEAST n verified results": the meter shows how inclusive the rule is (Figma draws 1 result at 86 %). */
export const RESULT_STEPS = [
  { count: 1, label: '1 verified result', meter: 0.86, factor: 1 },
  { count: 2, label: '2 verified results', meter: 0.57, factor: 0.45 },
  { count: 3, label: '3 verified results', meter: 0.29, factor: 0.012 },
];

export const DEFAULT_RULES = {
  yearOn: true,
  forms: ['form-3'],
  studyOn: true,
  study: ['General Science', 'Business', 'General Arts'],
  linkedOn: false,
  resultsOn: true,
  results: 1,
  under18: true,
};

const ROSTER_TOTAL = 847;
const UNDER_18_SHARE = 188 / 247;

/**
 * Mock of GET /institution/programmes/:id/audience. Returns { roster, match, linkedPct, stars }.
 * Counts under 5 are returned raw: the components print them "<5" (formatCount), and "Save and continue" is blocked while fewer than 5 students
 * match ("Groups under 5 can’t be targeted").
 * ⚠️ ASSUMPTION: every factor is sample maths calibrated to the drawn default (247 on the roster in Form 3, 231 matching, 94 % linked).
 */
export const computeAudience = (rules) => {
  const forms = rules.yearOn ? FORMS.filter((f) => rules.forms.includes(f.id)) : FORMS;
  const roster = forms.reduce((a, f) => a + f.students, 0);
  const studyShare =
    rules.studyOn && rules.study.length ? Math.min(1, 0.62 + 0.105 * rules.study.length) : 1;
  const linkedShare = rules.linkedOn ? 0.94 : 1;
  const resultsShare = rules.resultsOn
    ? (RESULT_STEPS.find((s) => s.count === rules.results)?.factor ?? 1)
    : 1;
  const underShare = rules.under18 ? 1 : 1 - UNDER_18_SHARE;
  const match = Math.max(
    0,
    Math.min(roster, Math.round(roster * studyShare * linkedShare * resultsShare * underShare))
  );
  return { roster, match, linkedPct: 94, stars: 4 };
};

export const audienceBlocked = (audience) => isSuppressed(audience.match);

/** The sentence under the stars. */
export const audienceNote = (audience, formatCount) =>
  audienceBlocked(audience)
    ? `Only ${formatCount(audience.match)} students match these rules. Groups under 5 can’t be targeted. Add a year group or ask for fewer verified results.`
    : `About ${formatCount(audience.match)} students will see this programme in their feed.`;

/** ⚠️ ASSUMPTION: the phone number the policy check finds in the description of the scholarship draft (the agency twin 11.5.2i is not drawn for institutions). */
export const POLICY_FINDING = {
  title: 'Remove contact details to publish',
  sentence:
    'Your description includes a phone number (030 •••• 412). Students reach the school through GTH, so contact details can’t go in programmes.',
};

/* ===== BLOCK 4 · your students (Figma 11.3.1a "YOUR STUDENTS") ======================================================= */

/** Under 18 / linked / gender cards. Raw counts are formatted by the component (formatCount). */
export const YOUR_STUDENTS = {
  under18: { count: 188, of: 247, sentence: 'Guardians get a copy of the invite and can say no.' },
  linked: { pct: 94, unlinked: 16, sentence: 'students still need to link before they can apply.' },
  gender: { value: '51% girls', sentence: 'Your rules keep a balanced audience.' },
};

export { ROSTER_TOTAL };

/* ===== BLOCK 5 · student preview + published (Figma 11.3.1b / c) ====================================================== */

export const PREVIEW = {
  school: 'Savannah Hills Senior High School',
  schoolLine: 'SHS · Tamale · your school',
  schoolBadge: 'Verified institution',
  sticker: 'New today',
  title: 'Scholarship Prep Clinic',
  chips: [
    { id: 'where', text: 'School library · In person' },
    { id: 'what', text: '6 Saturdays' },
    { id: 'pay', text: 'Free for students' },
    { id: 'closes', text: 'Closes 8 Nov' },
  ],
  hint: 'Takes 1 minute. Your guardian gets a copy.',
  about: {
    title: 'About the clinic',
    intro:
      'Six Saturday sessions to help Form 3 students apply for university scholarships. Lunch is covered.',
    bullets: [
      'Write a personal statement that stands out',
      'Practise interviews with past scholars',
      'Pick the right scholarships for your results',
      'Finish with a signed certificate on your profile',
    ],
  },
  good: {
    title: 'Good to have',
    summary: 'You have 3 of 4',
    items: [
      { id: 'mock', text: 'WASSCE mock', verified: true },
      { id: 'linked', text: 'Linked profile' },
      { id: 'statement', text: 'Personal statement draft' },
      { id: 'teacher', text: 'Teacher recommendation' },
    ],
    missing: 'Referees',
  },
  match: {
    pct: 78,
    label: 'Good match',
    note: 'Your school picked you for this clinic based on your verified results.',
    rows: [
      { id: 'skills', label: 'Results', value: 'Verified' },
      { id: 'education', label: 'Year group', value: 'Form 3' },
      { id: 'region', label: 'School', value: 'Savannah Hills' },
    ],
  },
  boost: {
    title: 'Boost to ~90%',
    delta: '+12%',
    note: 'Add two referees and your match jumps.',
    have: 'Add referees',
    learn: 'How to ask',
  },
  runner: {
    heading: 'WHO’S RUNNING IT',
    name: 'Iddrisu Abdul-Rahman',
    initials: 'IA',
    role: 'Registrar · Savannah Hills SHS',
    reply: 'Usually replies within 2 days',
  },
};

export const PUBLISHED = {
  sticker: 'Live now',
  title: 'Programme published!',
  body: (count) =>
    `${count} matched students will see Scholarship Prep Clinic in their feed today. Guardians of under-18s get a copy.`,
  next: [
    'Sign-ups land in your applicants board',
    'We email you a daily digest',
    'Message the class from Messages',
  ],
  back: 'Back to programmes',
  view: 'View applicants',
};

/* ===== BLOCK 6 · applicants board (Figma 11.3.1d) ===================================================================== */

export const PIPELINE_COLUMNS = [
  { id: 'signed-up', label: 'Signed up' },
  { id: 'guardian-ok', label: 'Guardian OK' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'session-1', label: 'Session 1' },
  { id: 'attending', label: 'Attending' },
  { id: 'completed', label: 'COMPLETED' },
  { id: 'withdrawn', label: 'withdrawn' },
];

export const APPLICANTS = [
  {
    id: 'a1',
    stage: 'signed-up',
    initials: 'AM',
    tint: '#fae7b5',
    name: 'Abena Mahama',
    sub: 'Form 3 • Science',
    skills: ['WASSCE mock', 'Linked'],
    ago: '2h ago',
    rating: '4.8',
  },
  {
    id: 'a2',
    stage: 'signed-up',
    name: 'Kofi Danso',
    sub: 'Form 3 • Business',
    skills: ['Linked', 'Under 18'],
    ago: '5h ago',
    rating: '3.2',
  },
  {
    id: 'a3',
    stage: 'guardian-ok',
    initials: 'IY',
    tint: '#e6e1fa',
    name: 'Ibrahim Yakubu',
    sub: 'Form 3 • Technical',
    skills: ['Under 18', 'Linked'],
    next: { title: 'Guardian replied', when: 'Yes · 17 Oct' },
  },
  {
    id: 'a4',
    stage: 'confirmed',
    initials: 'AS',
    tint: '#dce7fa',
    name: 'Akosua Sarpong',
    sub: 'Form 3 • Arts',
    skills: ['Debate', 'Linked'],
    invite: 'Add to session 1',
  },
  {
    id: 'a5',
    stage: 'session-1',
    name: 'Esi Quaye',
    sub: 'Sat 24 Oct · 09:00',
    pitch: { tone: 'amber', title: 'Session 1', place: 'Library' },
    primary: null,
    secondary: 'View details',
    badge: 'hourglass',
  },
  {
    id: 'a6',
    stage: 'session-1',
    name: 'Yaw Adomako',
    sub: 'Sat 24 Oct · 09:00',
    pitch: { tone: 'red', title: 'Guardian pending', place: 'Library' },
    primary: 'Mark as attended',
    secondary: 'Remind',
    badge: 'alert',
  },
  {
    id: 'a7',
    stage: 'session-1',
    name: 'Fatima Issah',
    sub: 'Sat 24 Oct · 09:00',
    pitch: { tone: 'green', title: 'Ready', place: 'Library' },
    primary: null,
    secondary: 'View notes',
    badge: 'done',
  },
  {
    id: 'a8',
    stage: 'attending',
    initials: 'KB',
    tint: '#f8dccf',
    name: 'Kwame Boateng',
    sub: 'Coming',
    subTone: 'amber',
  },
  { id: 'a9', stage: 'completed', name: 'Ama Nkansah', sub: 'Certificate issued' },
  { id: 'a10', stage: 'withdrawn', name: 'Kojo Bawa', sub: 'Changed subjects', dim: true },
];

export const APPLICANTS_COPY = {
  title: 'Applicants',
  sentence:
    'Move students from signed up to completed. They’re your students, so you see their names.',
};
