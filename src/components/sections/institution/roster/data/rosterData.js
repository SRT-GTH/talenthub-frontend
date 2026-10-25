/*
 * rosterData.js — MOCK data of the student roster (Figma 11.2.2a-l, canvas 8520:10; shaped like the future GET /institution/students,
 * GET /institution/students/:id, POST /institution/students, POST /institution/students/import responses). Sample content only.
 * One marked block per concern. Roster rows are the institution's own data and are drawn as in Figma (no "<5" suppression there).
 */

/* ===== BLOCK 1 · class tabs and chip counts (the Figma counts are the base; the in-memory store adds / subtracts its own changes) ===== */
export const FORM_TABS = [
  { id: '1', label: 'Form 1', base: 298 },
  { id: '2', label: 'Form 2', base: 302 },
  { id: '3', label: 'Form 3', base: 247 },
  { id: 'graduates', label: 'Graduates', base: 1204 },
];
export const BASE_COUNTS = { total: 847, linked: 231, notLinked: 16, consentNeeded: 41 };
export const PAGE_SIZE = 6;
export const PROGRAMMES = [
  'General Science',
  'General Arts',
  'Technical',
  'Home Economics',
  'Business',
  'Visual Arts',
];
export const SORTS = [
  { id: 'surname-az', label: 'Surname A–Z' },
  { id: 'surname-za', label: 'Surname Z–A' },
  { id: 'profile', label: 'Profile % high to low' },
];

/* ===== BLOCK 2 · the Form 3 rows drawn in the frames (list 11.2.2a, not-linked filter 11.2.2k) =============================== */
// pill: the amber "why" pill of a linked row. chips: green check chips; more: "+n". note: the grey line after the programme.
const PRONOUN = {
  'abena-mahama': 'she',
  'akosua-sarpong': 'she',
  'ibrahim-yakubu': 'he',
  'esi-quaye': 'she',
  'kofi-danso': 'he',
  'yaw-adomako': 'he',
  'mariam-issah': 'she',
  'joseph-abugri': 'he',
  'fuseini-alhassan': 'he',
  'rahinatu-seidu': 'she',
  'peter-nyaaba': 'he',
};
const row = (id, name, programme, profile, last, extra) => ({
  id,
  pronoun: PRONOUN[id],
  name,
  initials: name
    .split(' ')
    .map((p) => p[0])
    .join(''),
  form: '3',
  programme,
  profile,
  last,
  linked: true,
  cardVerified: true,
  pill: 'Joined 2 Sep 2024',
  chips: ['WASSCE 2027'],
  more: 2,
  ...extra,
});
export const SEED_STUDENTS = [
  row('abena-mahama', 'Abena Mahama', 'General Science', 91, '2d', {}),
  row('akosua-sarpong', 'Akosua Sarpong', 'General Arts', 78, '2d', { pill: 'Joined 4 Sep 2024' }),
  row('ibrahim-yakubu', 'Ibrahim Yakubu', 'Technical', 88, '2d', {}),
  row('esi-quaye', 'Esi Quaye', 'Home Economics', 67, '2d', {}),
  row('kofi-danso', 'Kofi Danso', 'Business', 84, '4d', {
    pill: 'Record pending',
    pillTone: 'plain',
  }),
  row('yaw-adomako', 'Yaw Adomako', 'Visual Arts', 0, '1w', {
    linked: false,
    cardVerified: false,
    note: 'invite sent 9 Oct',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
  row('mariam-issah', 'Mariam Issah', 'General Arts', 0, '1w', {
    linked: false,
    cardVerified: false,
    note: 'invite sent 9 Oct',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
  row('joseph-abugri', 'Joseph Abugri', 'Technical', 0, '1w', {
    linked: false,
    cardVerified: false,
    note: 'invite sent 9 Oct',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
  row('fuseini-alhassan', 'Fuseini Alhassan', 'Business', 0, '2w', {
    linked: false,
    cardVerified: false,
    note: 'invite bounced, check email',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
  row('rahinatu-seidu', 'Rahinatu Seidu', 'Home Economics', 0, '2w', {
    linked: false,
    cardVerified: false,
    note: 'invite sent 2 Oct',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
  row('peter-nyaaba', 'Peter Nyaaba', 'General Science', 0, '2w', {
    linked: false,
    cardVerified: false,
    note: 'invite sent 2 Oct',
    pill: null,
    chips: ['WASSCE 2027', 'Visual Arts'],
    more: 1,
  }),
];
// The Figma "All" list draws the first six rows (the linked five and Yaw); avatar colours are the Figma green for every row.

/* ===== BLOCK 3 · the student record (Figma 11.2.2j, Kofi Danso) ================================================================ */
export const RECORD_KOFI = {
  id: 'kofi-danso',
  name: 'Kofi Danso',
  pronouns: 'he/him',
  firstName: 'Kofi',
  joined: 'Sep 2024',
  line: 'Form 3 · Business · Savannah Hills SHS · Tamale',
  formClass: 'Form 3B',
  indexNo: '0412-24-118',
  open: 'Open to scholarships',
  chips: [
    { id: 'goal', label: 'Scholarships · University', icon: 'target', primary: true },
    { id: 'where', label: 'Tamale · Northern', icon: 'pin' },
    { id: 'lang', label: 'English · Twi', icon: 'voice' },
  ],
  stats: [
    { id: 'skills', value: '1', label: 'verified skills' },
    { id: 'endorse', value: '2', label: 'endorsements' },
    { id: 'active', value: '14 Sep', label: 'last active' },
  ],
  tabs: [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills', count: 7 },
    { id: 'experience', label: 'Experience', count: 2 },
    { id: 'portfolio', label: 'Portfolio', count: 3 },
    { id: 'certs', label: 'Certs', count: 2 },
    { id: 'about', label: 'About me' },
  ],
  about: {
    text: 'Form 3 business student. Interested in accounting and running a small business.',
    vibe: [
      { id: 'analytical', label: 'Analytical', icon: 'bulb' },
      { id: 'calm', label: 'Calm under pressure', icon: 'health' },
      { id: 'team', label: 'Team player', icon: 'users' },
      { id: 'fun', label: 'Football · Afrobeats', icon: 'heart' },
    ],
  },
  skills: {
    more: 'See all 7 →',
    items: [
      {
        id: 'acc',
        name: 'Accounting',
        icon: 'chart',
        chip: 'Assessed',
        chipOn: true,
        bar: 258,
        sub: 'B3 · mock',
      },
      {
        id: 'eco',
        name: 'Economics',
        icon: 'dns',
        chip: 'Skills Lab',
        chipOn: false,
        bar: 234,
        sub: 'B3 · mock',
      },
      {
        id: 'mat',
        name: 'Maths',
        icon: 'fn',
        chip: 'Assessed',
        chipOn: true,
        bar: 186,
        sub: 'C4 · mock',
      },
      {
        id: 'com',
        name: 'Communication',
        icon: 'voice',
        chip: 'Endorsed',
        chipOn: false,
        bar: 210,
        sub: '8 endorsements',
      },
    ],
  },
  experience: {
    more: 'See all 2 →',
    items: [
      {
        id: 'treasurer',
        title: 'Class treasurer',
        meta: 'Savannah Hills SHS · Tamale  ·  Sep 2025 – now',
        text: 'Keeps the class fund records for Form 3B.',
        tags: ['Economics', 'Leadership', 'Events'],
        icon: 'trend',
        tint: '#eaeffb',
      },
      {
        id: 'shop',
        title: 'Weekend shop assistant',
        meta: 'Savannah Hills SHS  ·  Jan 2025 – now',
        text: 'Helps at the family provisions shop on Saturdays.',
        tags: ['Tutoring', 'Public speaking'],
        icon: 'grad',
        tint: '#faf4e8',
      },
    ],
  },
  portfolio: {
    more: 'See all 3 →',
    items: [
      {
        id: 'tracker',
        kind: 'Project',
        title: 'Shop sales tracker',
        meta: 'Personal · 2026',
        cover: 'bars',
      },
      {
        id: 'budget',
        kind: 'Poster',
        title: 'Budget plan',
        meta: 'Personal · 2026',
        cover: 'line',
      },
      {
        id: 'essay',
        kind: 'Essay',
        title: 'Why I want to study accounting',
        meta: 'English · 2026',
        cover: 'dots',
      },
    ],
  },
  enrolment: {
    badge: 'Enrolment',
    title: 'Enrolled · Form 3B',
    text: 'Joined Savannah Hills SHS on 2 Sep 2024. Expected to finish July 2027 (WASSCE).',
  },
  record: [
    { id: 'card', icon: 'video', text: 'Ghana Card verified · 2 Sep 2024', dim: true },
    { id: 'cred', icon: 'target', text: '1 credential issued' },
    { id: 'rec', icon: 'file', text: '1 record waiting for you' },
    { id: 'guardian', icon: 'voice', text: 'Guardian: Mr. Kwame Danso' },
    { id: 'copied', icon: 'phone', text: 'Guardian copied on messages' },
    { id: 'visible', icon: 'wallet', text: 'Profile visible to recruiters (over 18)' },
  ],
  badges: [
    { id: 'first', label: 'First steps', icon: 'trophy', tint: '#faf4e8' },
    { id: 'profile', label: 'Profile started', icon: 'check', tint: '#ebf1ec' },
    { id: 'quiz', label: 'Quiz Ace', icon: 'bulb', tint: '#eaeffb' },
  ],
};

/* ===== BLOCK 4 · CSV samples (Figma 11.2.2c-d, g, h) ============================================================================== */
export const CSV_COLUMNS = [
  { id: 'name', label: 'Full name column', required: true, placeholder: 'student_name' },
  { id: 'card', label: 'Ghana Card column', required: true, placeholder: 'ghana_card' },
  { id: 'programme', label: 'Programme column', required: true, select: true, value: 'programme' },
  { id: 'index', label: 'Index number column', placeholder: 'We use it to spot duplicates' },
  { id: 'dob', label: 'Date of birth column', required: true, placeholder: 'dob' },
  { id: 'year', label: 'Year group column', placeholder: 'year_group' },
  { id: 'guardian', label: 'Guardian phone column', placeholder: 'guardian_phone' },
  { id: 'email', label: 'Email column', placeholder: 'email' },
];
// The sample file drawn in the "Checking" and "Review import" frames (used when "Check file" runs with no file chosen).
export const SAMPLE_REVIEW = {
  fileName: 'form3_2026.csv',
  size: '41 KB',
  rows: 312,
  ready: 298,
  duplicates: 6,
  elsewhere: 3,
  fixes: [
    {
      row: 14,
      student: 'Fuseini Alhassan',
      problem: 'Ghana Card number is 1 digit short',
      action: 'Fix in file',
    },
    {
      row: 57,
      student: 'Mariam Issah',
      problem: 'Date of birth is in the future',
      action: 'Fix in file',
    },
    {
      row: 102,
      student: 'Joseph Abugri',
      problem: 'Guardian phone missing (under 18)',
      action: 'Add phone',
    },
    {
      row: 188,
      student: 'Rahinatu Seidu',
      problem: 'Year group “Form 4” isn’t valid',
      action: 'Fix in file',
    },
    { row: 240, student: 'Peter Nyaaba', problem: 'Name column is empty', action: 'Fix in file' },
  ],
};
// The sample file drawn in the "CSV errors" frame (state=errors without a real file).
export const SAMPLE_ERRORS = {
  fileName: 'form1-2026-intake.csv',
  rows: 312,
  ready: 298,
  failing: 14,
  fields: [
    { id: 'r18', label: 'Row 18 · Ghana Card', required: true, value: 'GHA-71203 is too short' },
    {
      id: 'r42',
      label: 'Row 42 · Duplicate',
      required: true,
      value: 'Kwesi Owusu is also in row 12',
    },
    {
      id: 'r77',
      label: 'Row 77 · Date of birth',
      required: true,
      value: '31 / 02 / 2011 isn’t a real date',
      chevron: true,
    },
    { id: 'r133', label: 'Row 133 · Ghana Card', placeholder: 'Name doesn’t match the NIA record' },
    {
      id: 'r103',
      label: 'Row 103 · Already enrolled',
      required: true,
      value: 'At Tamale SHS · request a transfer',
    },
    {
      id: 'r160',
      label: 'Row 160 · Guardian phone',
      value: 'Missing · student is 15',
      disabled: true,
    },
    {
      id: 'r201',
      label: 'Row 201 · Programme',
      placeholder: '“Gen Sci” isn’t a programme you run',
    },
    {
      id: 'more',
      label: '+ 9 more rows',
      placeholder: 'Download the error report to see them all',
    },
  ],
};
export const CHECK_STEPS = [
  {
    id: 'card',
    label: 'Ghana Card format',
    icon: 'check',
    doneText: 'Done · 184 OK',
    doneTone: 'ok',
  },
  {
    id: 'dup',
    label: 'Duplicates on your roster',
    icon: 'warn',
    doneText: 'Done · 6 found',
    doneTone: 'warn',
  },
  {
    id: 'elsewhere',
    label: 'Already at another institution',
    icon: 'hourglass',
    doneText: 'Checking…',
    doneTone: 'wait',
  },
  {
    id: 'guardian',
    label: 'Guardian details for under-18s',
    icon: 'hourglass',
    doneText: 'Waiting',
    doneTone: 'wait',
  },
];

/* ===== BLOCK 5 · guardian consent (Figma 11.2.2i) ================================================================================ */
export const CONSENT_ROWS = [
  {
    id: 'mariam-issah',
    name: 'Mariam Issah',
    age: 16,
    guardian: 'Mrs. Hawa Issah · +233 24 ••• 118',
    status: 'none',
  },
  {
    id: 'joseph-abugri',
    name: 'Joseph Abugri',
    age: 17,
    guardian: 'Mr. Daniel Abugri · +233 20 ••• 554',
    status: 'none',
  },
  {
    id: 'fuseini-alhassan',
    name: 'Fuseini Alhassan',
    age: 16,
    guardian: 'Mr. Ibrahim Alhassan · +233 55 ••• 902',
    status: 'sent',
    date: '12 Oct',
  },
  {
    id: 'rahinatu-seidu',
    name: 'Rahinatu Seidu',
    age: 17,
    guardian: 'Mrs. Salamatu Seidu · +233 24 ••• 371',
    status: 'agreed',
    date: '9 Oct',
  },
];
export const CONSENT_TOTAL = 41;
// ⚠️ ASSUMPTION: "See all" lists the other 37 under-18s; Figma draws only the first four, so these are deterministic sample rows.
const FIRST = ['Adwoa', 'Kwame', 'Ama', 'Yaw', 'Abiba', 'Issah', 'Naa', 'Samira', 'Musah'];
const LAST = ['Boateng', 'Mensah', 'Tetteh', 'Wuni', 'Zakaria', 'Dauda', 'Laari', 'Amoah'];
export const CONSENT_MORE = Array.from({ length: 37 }, (_, i) => ({
  id: `consent-more-${i}`,
  name: `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`,
  age: 15 + (i % 3),
  guardian: `Guardian on file · +233 2${i % 10} ••• ${100 + i * 7}`,
  status: i % 5 === 0 ? 'agreed' : i % 3 === 0 ? 'sent' : 'none',
  date: i % 5 === 0 ? '9 Oct' : '12 Oct',
}));

/* ===== BLOCK 6 · home page (Figma 11.2.1a-c) ======================================================================================== */
export const HOME_HERO = {
  default: {
    title: 'Welcome back, {first}',
    subtitle:
      '{short} on GTH: {students} students on the roster, {pending} records waiting for your check and {scholarships} scholarships live.',
  },
  fresh: {
    title: 'Welcome to GTH, {first}',
    subtitle:
      '{short} is verified. Add your students first, then verify their records and issue credentials.',
  },
};
export const HOME_ACTIONS = {
  default: [
    {
      id: 'add',
      title: 'Add students',
      meta: 'One by one or a CSV',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/students?modal=add-student',
    },
    {
      id: 'verify',
      title: 'Verify records',
      meta: '{pending} waiting for you',
      icon: 'search',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/institution/records',
    },
    {
      id: 'issue',
      title: 'Issue a credential',
      meta: '{credentials} issued so far',
      icon: 'users',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/credentials/new',
    },
    {
      id: 'scholarship',
      title: 'Post a scholarship',
      meta: '{scholarships} live',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/institution/programmes/new',
    },
  ],
  fresh: [
    {
      id: 'add',
      title: 'Add students',
      meta: 'One by one or a CSV',
      icon: 'search',
      tint: '#ebf1ec',
      ink: '#244a9f',
      to: '/institution/students?modal=add-student',
    },
    {
      id: 'regional',
      title: 'See regional data',
      meta: 'How the North compares',
      icon: 'map',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/institution/progress/class-outcomes',
    },
    {
      id: 'staff',
      title: 'Invite your staff',
      meta: 'Teachers and counsellors',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/settings/staff?modal=invite',
    },
    {
      id: 'scholarship',
      title: 'Post a scholarship',
      meta: 'Your students or all GTH',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/institution/programmes/new',
    },
  ],
};
export const HOME_READINESS = {
  eyebrow: 'STUDENT READINESS',
  title: '61% of Form 3 students are Discoverable',
  line: 'Science A 82% · Science B 74% · Business 69% · General Arts 61% · Visual Arts 55%',
  action: 'Open progress',
  to: '/institution/progress',
};
export const HOME_TERM = {
  title: 'This term',
  stats: [
    { id: 'students', label: 'Students on GTH', value: 847, ink: '#1f4a2b' },
    { id: 'labs', label: 'Finished a Skills Lab', value: 1204, ink: '#32683a' },
    { id: 'placements', label: 'Placements', value: 31, ink: '#32683a' },
  ],
};
export const HOME_NEXT = {
  eyebrow: 'Next step',
  title: '{pending} records need your check',
  body: 'Mostly WASSCE results and club certificates sent this week. Approving them adds an “Institution verified” badge to each profile.',
};
// Three pages of the home table: page 1 is drawn; ⚠️ ASSUMPTION: pages 2-3 are sample rows (Figma draws the pager, not their content).
export const HOME_TABLE_TOTAL = 847;
export const HOME_TABLE_PAGES = [
  [
    {
      id: 'abena-mahama',
      initials: 'AM',
      name: 'Abena Mahama',
      klass: 'Form 3 · Science A',
      activity: 'Got an interview',
      tone: 'plain',
      readiness: 92,
      last: 'Today',
      chip: ['#c1e9c9', '#32683a'],
      bar: '#00522b',
      ink: '#1f4a2b',
    },
    {
      id: 'yaw-dery',
      initials: 'YD',
      name: 'Yaw Dery',
      klass: 'Form 3 · Science B',
      activity: 'Finished a Skills Lab',
      tone: 'plain',
      readiness: 88,
      last: 'Yesterday',
      chip: ['#a7f4bb', '#1f4a2b'],
      bar: '#43664d',
      ink: '#32683a',
    },
    {
      id: 'fatima-issah',
      initials: 'FI',
      name: 'Fatima Issah',
      klass: 'Form 2 · General Arts',
      activity: 'Applied for a scholarship',
      tone: 'green',
      readiness: 84,
      last: '12 Oct',
      chip: ['#ffddb6', '#5a430c'],
      bar: '#00522b',
      ink: '#1f4a2b',
    },
    {
      id: 'kwesi-owusu',
      initials: 'KO',
      name: 'Kwesi Owusu',
      klass: 'Form 3 · Business',
      activity: 'Inactive 30 days',
      tone: 'red',
      readiness: 61,
      last: '17 Sep',
      chip: ['#e4e2dd', '#716e65'],
      bar: '#b23b3b',
      ink: '#ad3327',
    },
  ],
  [
    {
      id: 'ama-boateng',
      initials: 'AB',
      name: 'Ama Boateng',
      klass: 'Form 3 · Science A',
      activity: 'Finished a Skills Lab',
      tone: 'plain',
      readiness: 90,
      last: 'Today',
      chip: ['#c1e9c9', '#32683a'],
      bar: '#00522b',
      ink: '#1f4a2b',
    },
    {
      id: 'issah-wuni',
      initials: 'IW',
      name: 'Issah Wuni',
      klass: 'Form 3 · Technical',
      activity: 'Got an interview',
      tone: 'plain',
      readiness: 79,
      last: 'Yesterday',
      chip: ['#a7f4bb', '#1f4a2b'],
      bar: '#43664d',
      ink: '#32683a',
    },
    {
      id: 'naa-tetteh',
      initials: 'NT',
      name: 'Naa Tetteh',
      klass: 'Form 2 · Home Economics',
      activity: 'Applied for a scholarship',
      tone: 'green',
      readiness: 73,
      last: '14 Oct',
      chip: ['#ffddb6', '#5a430c'],
      bar: '#43664d',
      ink: '#32683a',
    },
    {
      id: 'musah-dauda',
      initials: 'MD',
      name: 'Musah Dauda',
      klass: 'Form 3 · Visual Arts',
      activity: 'Inactive 30 days',
      tone: 'red',
      readiness: 55,
      last: '20 Sep',
      chip: ['#e4e2dd', '#716e65'],
      bar: '#b23b3b',
      ink: '#ad3327',
    },
  ],
  [
    {
      id: 'samira-zakaria',
      initials: 'SZ',
      name: 'Samira Zakaria',
      klass: 'Form 3 · General Arts',
      activity: 'Finished a Skills Lab',
      tone: 'plain',
      readiness: 86,
      last: '2 days ago',
      chip: ['#c1e9c9', '#32683a'],
      bar: '#00522b',
      ink: '#1f4a2b',
    },
    {
      id: 'adwoa-mensah',
      initials: 'AM',
      name: 'Adwoa Mensah',
      klass: 'Form 2 · Science B',
      activity: 'Got an interview',
      tone: 'plain',
      readiness: 81,
      last: '3 days ago',
      chip: ['#a7f4bb', '#1f4a2b'],
      bar: '#43664d',
      ink: '#32683a',
    },
    {
      id: 'kwame-laari',
      initials: 'KL',
      name: 'Kwame Laari',
      klass: 'Form 1 · Business',
      activity: 'Applied for a scholarship',
      tone: 'green',
      readiness: 70,
      last: '11 Oct',
      chip: ['#ffddb6', '#5a430c'],
      bar: '#43664d',
      ink: '#32683a',
    },
    {
      id: 'abiba-amoah',
      initials: 'AA',
      name: 'Abiba Amoah',
      klass: 'Form 3 · Technical',
      activity: 'Inactive 30 days',
      tone: 'red',
      readiness: 58,
      last: '22 Sep',
      chip: ['#e4e2dd', '#716e65'],
      bar: '#b23b3b',
      ink: '#ad3327',
    },
  ],
];
export const HOME_GLANCE = {
  title: 'This term at a glance',
  subtitle: 'How Savannah Hills compares with senior high schools across the Northern Region.',
  cards: [
    {
      id: 'students',
      icon: 'eye',
      badge: 'This term',
      title: 'Students on GTH',
      text: '61% of students are Discoverable or above.',
      progressLabel: '61%',
      fillPct: 61,
      foot: 'Regional SHS average 48%',
    },
    {
      id: 'labs',
      icon: 'shield',
      badge: 'This term',
      title: 'Skills Lab activity',
      text: '412 labs finished this term.',
      progressLabel: '49%',
      fillPct: 49,
      foot: 'Regional SHS average 48%',
    },
    {
      id: 'apps',
      icon: 'sparkle',
      badge: 'This term',
      title: 'Scholarship applications',
      text: '58 applications this term.',
      progressLabel: '16%',
      fillPct: 16,
      foot: '9 awarded so far',
    },
  ],
};
export const HOME_FRESH = {
  checklist: {
    title: 'Get set up',
    subtitle: 'Four quick steps. Do them in any order.',
    badge: '1 of 4 · nice start!',
    pct: 25,
    items: [
      { id: 'verify', title: 'Verify your institution', state: 'done', trailing: 'Done' },
      {
        id: 'students',
        title: 'Add your students',
        sub: 'Upload your roster as a CSV with Ghana Card numbers',
        state: 'todo',
        action: { label: 'Upload roster', to: '/institution/students?modal=upload' },
      },
      {
        id: 'staff',
        title: 'Invite your staff',
        sub: 'Registrar, guidance and heads of department',
        state: 'todo',
        trailing: '1 min',
      },
      {
        id: 'credential',
        title: 'Issue your first credential',
        sub: 'Signed certificates students can share',
        state: 'todo',
        trailing: '5 min',
      },
    ],
  },
  cards: {
    title: 'Get more from GTH',
    subtitle: 'These switch on as you finish setting up.',
    cards: [
      {
        id: 'records',
        icon: 'sparkle',
        badge: 'Locked',
        title: 'Records to verify',
        text: 'Students send results and certificates for you to check.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After you add students',
      },
      {
        id: 'progress',
        icon: 'shield',
        badge: 'Locked',
        title: 'Student progress',
        text: 'See who is stuck and flag them for coaching.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After you add students',
      },
      {
        id: 'messages',
        icon: 'eye',
        badge: 'Locked',
        title: 'Messages',
        text: 'Send announcements to a class or the whole school.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After you add students',
      },
    ],
  },
};
