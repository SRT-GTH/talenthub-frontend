/*
 * institutionHomeData.js — MOCK data of the institution home (Figma 11.2.1a default 8585:9, 11.2.1b new institution 8588:479, 11.2.1c mobile 8588:960, and the first-login body
 * behind the welcome modal / tour 11.1.3a-d 8744:428914 / 429486 / 430003 / 430559). Shaped like the future GET /institution/home (+ /institution/students?limit=4, /institution/records?status=waiting,
 * /institution/programmes?limit=4, /institution/pipeline?window=30d, /institution/top-students, /institution/skills/in-demand) responses. Sample content only.
 * Copy is verbatim from the frames (curly quotes, middle dots). Placeholders {first} {institution} {students} {pending} {credentials} {scholarships} are filled from useInstitutionSession().
 * One marked block per concern. Icon names refer to the agency icon set (AgencyQuickActions / AgencyFeatureCards, identical Figma components).
 */

/* ===== BLOCK 1 · hero ============================================================================================================ */
export const HOME_HERO = {
  default: {
    title: 'Welcome back, {first}',
    subtitle:
      '{institution} on GTH: {students} students on the roster, {pending} records waiting for your check and {scholarships} scholarships live.',
    action: 'Customise',
  },
  // 11.2.1b: verified, roster still empty.
  firstLogin: {
    title: 'Welcome to GTH, {first}',
    subtitle:
      '{institution} is verified. Add your students first, then verify their records and issue credentials.',
    action: 'Customise',
  },
  // 11.1.3a-d (welcome modal + tour): same hero, another sentence.
  firstLoginOverlay: {
    title: 'Welcome to GTH, {first}',
    subtitle:
      '{institution} is verified. Most schools add their students within a day. Here’s where to start.',
    action: 'Customise',
  },
};

/* ===== BLOCK 2 · quick actions (id "students" is the tour spotlight target: data-tour-target="students") ============================= */
export const QUICK_ACTIONS = {
  default: [
    {
      id: 'students',
      title: 'Add students',
      meta: 'One by one or a CSV',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/students/new',
    },
    {
      id: 'records',
      title: 'Verify records',
      meta: '{pending} waiting for you',
      icon: 'search',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/institution/records',
    },
    {
      id: 'credentials',
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
  firstLogin: [
    {
      id: 'students',
      title: 'Add students',
      meta: 'One by one or a CSV',
      icon: 'search',
      tint: '#ebf1ec',
      ink: '#244a9f',
      to: '/institution/students/new',
    },
    {
      id: 'regional',
      title: 'See regional data',
      meta: 'How the North compares',
      icon: 'map',
      tint: '#eaeffb',
      ink: '#244a9f',
      // ⚠️ ASSUMPTION: no regional-data page is drawn; the class-outcomes page of Progress is the nearest "how do we compare" screen.
      to: '/institution/progress/class-outcomes',
    },
    {
      id: 'staff',
      title: 'Invite your staff',
      meta: 'Teachers and counsellors',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/settings/staff',
    },
    {
      id: 'programme',
      title: 'Post a scholarship',
      meta: 'Your students or all GTH',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/institution/programmes/new',
    },
  ],
  firstLoginOverlay: [
    {
      id: 'students',
      title: 'Add your students',
      meta: 'CSV or one at a time',
      icon: 'search',
      tint: '#ebf1ec',
      ink: '#244a9f',
      to: '/institution/students/new',
    },
    {
      id: 'records',
      title: 'Verify student records',
      meta: '{pending} waiting for you',
      icon: 'map',
      tint: '#eaeffb',
      ink: '#244a9f',
      to: '/institution/records',
    },
    {
      id: 'staff',
      title: 'Invite your staff',
      meta: '3 staff seats free',
      icon: 'userPlus',
      tint: '#ebf1ec',
      ink: '#2d5d33',
      to: '/institution/settings/staff',
    },
    {
      id: 'programme',
      title: 'Post a programme',
      meta: 'Reach your students',
      icon: 'suitcase',
      tint: '#f5f3ff',
      ink: '#6d28d9',
      to: '/institution/programmes/new',
    },
  ],
};

/* ===== BLOCK 3 · first-login checklist + locked cards (11.2.1b, and the overlay variant 11.1.3a-d) ================================= */
export const FIRST_LOGIN = {
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

// The welcome modal / tour frames draw other rows and cards behind the overlay (kept as drawn).
export const FIRST_LOGIN_OVERLAY = {
  checklist: {
    ...FIRST_LOGIN.checklist,
    items: [
      { id: 'verify', title: 'Verify your institution (GES)', state: 'done', trailing: 'Done' },
      {
        id: 'students',
        title: 'Upload your student roster',
        sub: 'Every Ghana Card is checked',
        state: 'todo',
        action: { label: 'Upload CSV', to: '/institution/students?modal=upload' },
      },
      {
        id: 'staff',
        title: 'Invite your staff',
        sub: 'Invite your staff · 3 seats free',
        state: 'todo',
        trailing: '1 min',
      },
      {
        id: 'programme',
        title: 'Post your first programme',
        sub: 'Your students see it in their feed',
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
        id: 'credentials',
        icon: 'sparkle',
        badge: 'Locked',
        title: 'Credentials',
        text: 'Sign certificates anyone can check at gth.com/verify.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After your first roster upload',
      },
      {
        id: 'pipeline',
        icon: 'shield',
        badge: 'Locked',
        title: 'Applicant pipeline',
        text: 'Track everyone who applies, stage by stage.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After your first programme',
      },
      {
        id: 'reports',
        icon: 'eye',
        badge: 'Locked',
        title: 'Outcome reports',
        text: 'Class outcome reports for your board and GES.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After your first programme',
      },
    ],
  },
};

/* ===== BLOCK 4 · readiness, this term, next step (11.2.1a) ======================================================================== */
export const READINESS_CARD = {
  eyebrow: 'STUDENT READINESS',
  title: '{pct}% of Form 3 students are Discoverable',
  pct: 61,
  classes: [
    { name: 'Science A', pct: 82 },
    { name: 'Science B', pct: 74 },
    { name: 'Business', pct: 69 },
    { name: 'General Arts', pct: 61 },
    { name: 'Visual Arts', pct: 55 },
  ],
  action: 'Open progress',
  to: '/institution/progress',
};

export const TERM_STATS = {
  title: 'This term',
  // students comes from the session (847); the other two are home-only counts.
  skillsLabs: 1204,
  placements: 31,
  labels: { students: 'Students on GTH', labs: 'Finished a Skills Lab', placements: 'Placements' },
  // Mini bar glyph (Figma Group 41232, 266 x 64): three bars.
  bars: [
    { x: 0, y: 32, w: 128, h: 32, fill: '#f3f8f4', opacity: 1 },
    { x: 32, y: 16, w: 128, h: 48, fill: '#a7f4bb', opacity: 0.5 },
    { x: 137, y: 0, w: 128, h: 64, fill: '#00522b', opacity: 0.2 },
  ],
};

export const NEXT_STEP = {
  eyebrow: 'Next step',
  title: '{pending} records need your check',
  body: 'Mostly WASSCE results and club certificates sent this week. Approving them adds an “Institution verified” badge to each profile.',
  to: '/institution/records',
};

/* ===== BLOCK 5 · students table (GET /institution/students?limit=4&sort=activity) ================================================== */
// Figma inconsistency kept: the readiness bar fills are drawn at 87 / 77 / 94 / 25 % of the track, the labels read 92 / 88 / 84 / 61 %.
export const STUDENT_ROWS = [
  {
    id: 'abena-mahama',
    initials: 'AM',
    avatar: { bg: '#c1e9c9', ink: '#32683a' },
    name: 'Abena Mahama',
    cohort: 'Form 3 · Science A',
    activity: { label: 'Got an interview', tone: 'grey' },
    readiness: 92,
    barFill: 87,
    barColor: '#00522b',
    readinessInk: '#1f4a2b',
    lastActive: 'Today',
  },
  {
    id: 'yaw-dery',
    initials: 'YD',
    avatar: { bg: '#a7f4bb', ink: '#1f4a2b' },
    name: 'Yaw Dery',
    cohort: 'Form 3 · Science B',
    activity: { label: 'Finished a Skills Lab', tone: 'grey' },
    readiness: 88,
    barFill: 77,
    barColor: '#43664d',
    readinessInk: '#32683a',
    lastActive: 'Yesterday',
  },
  {
    id: 'fatima-issah',
    initials: 'FI',
    avatar: { bg: '#ffddb6', ink: '#5a430c' },
    name: 'Fatima Issah',
    cohort: 'Form 2 · General Arts',
    activity: { label: 'Applied for a scholarship', tone: 'green' },
    readiness: 84,
    barFill: 94,
    barColor: '#00522b',
    readinessInk: '#1f4a2b',
    lastActive: '12 Oct',
  },
  {
    id: 'kwesi-owusu',
    initials: 'KO',
    avatar: { bg: '#e4e2dd', ink: '#716e65' },
    name: 'Kwesi Owusu',
    cohort: 'Form 3 · Business',
    activity: { label: 'Inactive 30 days', tone: 'red' },
    readiness: 61,
    barFill: 25,
    barColor: '#b23b3b',
    readinessInk: '#ad3327',
    lastActive: '17 Sep',
  },
];

export const STUDENT_TABLE = {
  columns: ['Student', 'Activity', 'Readiness', 'Last active', 'Actions'],
  // ⚠️ ASSUMPTION: only the first page of the roster is drawn; the pager points at the roster for the rest.
  pages: [1, 2, 3],
  shown: 'Showing 1 to 4 of {students} students',
  rosterTo: '/institution/students',
};

/* ===== BLOCK 6 · "This term at a glance" (11.2.1a, solid cards) ====================================================================== */
// Figma inconsistency kept: the bar fills are drawn at 61 / 61 / 80 % of the track, the labels read 61 / 49 / 16 %.
export const GLANCE = {
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
      fillPct: 61,
      foot: 'Regional SHS average 48%',
    },
    {
      id: 'scholarships',
      icon: 'sparkle',
      badge: 'This term',
      title: 'Scholarship applications',
      text: '58 applications this term.',
      progressLabel: '16%',
      fillPct: 80,
      foot: '9 awarded so far',
    },
  ],
};

/* ===== BLOCK 7 · phone home (11.2.1c 8588:960, 360 wide; the top bar is the chrome's) ============================================== */
// Figma inconsistencies kept: the phone bar monogram reads "AK" (chrome draws IA), the first record avatar reads "KA" for Abena Mahama,
// the GES accreditation row is drawn in the amber "in review" palette but labelled "Verified", and the third talent chip row repeats "Excel".
export const MOBILE_HOME = {
  greeting: ['Good morning, ', '{first}'],
  sub: 'Here’s what needs you at Savannah Hills today.',
  verification: {
    title: 'Verification',
    sub: 'Your institution is verified',
    head: { title: 'Head · Mrs Salamatu Yakubu', sub: 'Confirmed on 19 Oct', chip: 'Verified' },
    ges: { title: 'GES accreditation', sub: 'Verified on 19 Oct', chip: 'Verified' },
    docsLabel: 'ACCREDITATION',
    docs: [
      { name: 'Registration certificate', chip: 'Verified', tone: 'ok' },
      { name: 'Ministry registration', chip: 'Accepted', tone: 'mint' },
      { name: 'Letter on letterhead', chip: 'Accepted', tone: 'mint' },
    ],
    note: 'Renewal due in October 2027.',
    action: 'View documents',
    to: '/institution/accreditation?view=list',
  },
  records: {
    title: 'Records to verify',
    sub: 'Sent by your students this week',
    tabs: [
      { id: 'waiting', label: 'Waiting · 23' },
      { id: 'approved', label: 'Approved · 41' },
    ],
    items: [
      {
        id: 'r-abena',
        initials: 'KA',
        tint: '#ebf1ec',
        ink: '#2a5730',
        title: 'Abena Mahama · WASSCE results',
        sent: 'Sent today',
        late: false,
      },
      {
        id: 'r-yaw',
        initials: 'YD',
        tint: '#f5f3ff',
        ink: '#6d28d9',
        title: 'Yaw Dery · Coding club certificate',
        sent: 'Sent 2 days ago',
        late: true,
      },
      {
        id: 'r-fatima',
        initials: 'FI',
        tint: '#faf4e8',
        ink: '#463409',
        title: 'Fatima Issah · Debate award',
        sent: 'Sent today',
        late: true,
      },
    ],
    action: 'Review',
    all: 'View all records',
    to: '/institution/records',
  },
  programmes: {
    title: 'Your programmes',
    count: '4',
    sub: 'Scholarships and clubs',
    items: [
      {
        id: 'science-scholarship-2027',
        name: 'Science scholarship 2027',
        meta: 'Scholarship · closes 30 Nov',
        chips: ['58 applicants', '+27 new'],
      },
      {
        id: 'coding-club-term-1',
        name: 'Coding club, Term 1',
        meta: 'Club · weekly',
        chips: ['36 members', '+6 new'],
      },
      {
        id: 'university-fair',
        name: 'University fair',
        meta: 'Event · 14 Nov',
        chips: ['31 applicants', '+2 new'],
      },
      {
        id: 'mock-interviews',
        name: 'Mock interviews',
        meta: 'Event · 21 Nov',
        chips: ['120 RSVPs', '+11 new'],
      },
    ],
    all: 'View all programmes',
    to: '/institution/programmes',
  },
  journey: {
    title: 'Student journey',
    sub: 'All opportunities · last 30 days',
    windows: ['7d', '30d', '90d'],
    activeWindow: '30d',
    // bar width = n / 45 of the 294 px track, the first bar is drawn at 278 px (94.6 %)
    total: 45,
    fullPct: 94.6,
    stages: [
      { label: 'On roster', n: 45 },
      { label: 'Profile started', n: 22, from: '49% from prev.' },
      { label: 'Discoverable', n: 12, from: '55% from prev.' },
      { label: 'Assessed', n: 8, from: '67% from prev.' },
      { label: 'Applied', n: 2, from: '25% from prev.' },
      { label: 'Placed', n: 1, from: '50% from prev.' },
    ],
    inactive: 'Inactive · 14',
    withdrawn: 'Withdrawn · 4',
  },
  top: {
    title: 'Top students',
    sub: 'Your Form 3 students closest to being job-ready.',
    select: 'Form 3 · all classes',
    all: 'See all matches',
    groupLabel: 'Most ready',
    groupChip: 'Form 3',
    to: '/institution/progress',
    review: 'Review',
    message: 'Message',
    // photo: key into the component's avatar map; null = identity hidden.
    items: [
      {
        id: 'akua',
        photo: 'akua',
        fit: '92% fit',
        name: 'Akua M.',
        meta: 'BSc Computer Science · UDS',
        tags: ['SQL', 'Excel', 'Lives in Tamale'],
      },
      {
        id: 'fati',
        photo: 'fati',
        fit: '87% fit',
        name: 'Fati B.',
        meta: 'HND Statistics · TaTU',
        tags: ['R', 'Survey design'],
      },
      {
        id: 'hidden-4821',
        photo: null,
        fit: '84% fit',
        name: 'Student #4821',
        meta: 'Identity hidden until they respond',
        tags: ['Python', 'Data viz'],
      },
      {
        id: 'akosua',
        photo: 'akosua',
        fit: '81% fit',
        name: 'Akosua S.',
        meta: 'WASSCE · GTH Data Track',
        tags: ['Excel', 'Excel'],
      },
      {
        id: 'yaw',
        photo: 'yaw',
        fit: '78% fit',
        name: 'Yaw D.',
        meta: 'BSc Agric · UDS',
        tags: ['KoBoToolbox', 'GIS'],
      },
    ],
  },
  skills: {
    title: 'In-demand skills',
    sub: 'Northern · all skills',
    legend: [
      { label: 'Hot', tone: 'hot' },
      { label: 'Warm', tone: 'warm' },
      { label: 'Cooling', tone: 'cool' },
    ],
    rows: [
      { name: 'Data Analysis', students: 1206, delta: '+32%' },
      { name: 'Agriculture', students: 980, delta: '+27%' },
      { name: 'Customer service', students: 812, delta: '+22%' },
      { name: 'Solar installation', students: 402, delta: '+18%' },
      { name: 'Teaching', students: 688, delta: '+15%' },
    ],
    foot: 'Aggregated and anonymised — groups smaller than 5 people are never shown.',
  },
};
