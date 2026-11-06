/*
 * institutionHomeData.js — copy of the institution home (live figures: GET /institution/home and /institution/me) (Figma 11.2.1a default 8585:9, 11.2.1b new institution 8588:479, 11.2.1c mobile 8588:960, and the first-login body
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
      '{institution} on GTH: {studentsText} on the roster, {pendingText} waiting for your check and {scholarshipsText} live.',
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
      meta: 'Registrar, guidance, teachers',
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
        sub: 'Registrar, guidance and heads of department',
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
// Live figures come from GET /institution/home; only copy lives here.
export const READINESS_CARD = {
  eyebrow: 'STUDENT READINESS',
  title: '{pct}% of your students have linked their GTH profile',
  empty: 'No students on the roster yet.',
  action: 'Open students',
  to: '/institution/students',
};

export const TERM_STATS = {
  title: 'Your roster',
  labels: {
    students: 'Students on the roster',
    linked: 'Linked to GTH',
    profile: 'Average profile',
  },
  // Mini bar glyph (Figma Group 41232, 266 x 64): three bars.
  bars: [
    { x: 0, y: 32, w: 128, h: 32, fill: '#f3f8f4', opacity: 1 },
    { x: 32, y: 16, w: 128, h: 48, fill: '#a7f4bb', opacity: 0.5 },
    { x: 137, y: 0, w: 128, h: 64, fill: '#00522b', opacity: 0.2 },
  ],
};

// {n} = the count, {s} = plural "s".
export const NEXT_STEP = {
  eyebrow: 'Next step',
  consent: {
    title: '{n} student{s} under 18 need guardian consent',
    body: 'Their profiles stay hidden from employers until a parent or guardian agrees.',
    to: '/institution/students?modal=consent',
  },
  invite: {
    title: '{n} student{s} not invited yet',
    body: 'Add an email address so they get an invite to join GTH and link to your school.',
    to: '/institution/students',
  },
  waiting: {
    title: '{n} student{s} still to confirm',
    body: 'They have an invite or a link request. Send a reminder from the roster.',
    to: '/institution/students',
  },
  add: {
    title: 'Add more students',
    body: 'Everyone on your roster has linked. Add the next class one by one or with a CSV.',
    to: '/institution/students?modal=upload',
  },
};

/* ===== BLOCK 5 · students table (rows: home.recent from GET /institution/home) ===================================================== */
export const STUDENT_TABLE = {
  columns: ['Student', 'Activity', 'Readiness', 'Last active', 'Actions'],
  shown: 'Showing {shown} of {students} students',
  empty: 'No students yet. Add them one by one or upload a CSV from Students.',
  all: 'Open the roster',
  rosterTo: '/institution/students',
};

/* ===== BLOCK 6 · "At a glance" cards (11.2.1a, solid cards), built from GET /institution/home ======================================= */
// The words of the cards (Site copy: Institution › Home › Overview); {school} is the school's short name. The numbers come from the API.
export const GLANCE_TEXT = {
  title: 'Your school at a glance',
  subtitle: 'How {school} is doing on GTH right now.',
  cards: {
    linked: { badge: 'Roster', title: 'Students on GTH' },
    consent: { badge: 'Under 18', title: 'Guardian consent' },
    profiles: { badge: 'Linked students', title: 'Profile completion' },
  },
};

export const glanceFor = (home, short) => {
  const h = home || {};
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const t = GLANCE_TEXT.cards;
  return {
    title: GLANCE_TEXT.title,
    subtitle: GLANCE_TEXT.subtitle.replace('{school}', short || 'your school'),
    cards: [
      {
        id: 'linked',
        icon: 'eye',
        badge: t.linked.badge,
        title: t.linked.title,
        text: `${h.linked ?? 0} of ${h.total ?? 0} students have linked their GTH account.`,
        progressLabel: `${h.linkedPct ?? 0}%`,
        fillPct: h.linkedPct ?? 0,
        foot: `${h.addedThisMonth ?? 0} added in the last 30 days`,
      },
      {
        id: 'consent',
        icon: 'shield',
        badge: t.consent.badge,
        title: t.consent.title,
        text: h.under18
          ? `${h.consentAgreed ?? 0} of ${h.under18} under-18s have a guardian’s agreement.`
          : 'No students under 18 on the roster.',
        progressLabel: `${pct(h.consentAgreed ?? 0, h.under18 ?? 0)}%`,
        fillPct: pct(h.consentAgreed ?? 0, h.under18 ?? 0),
        foot: `${h.consentNeeded ?? 0} still to agree`,
      },
      {
        id: 'profiles',
        icon: 'sparkle',
        badge: t.profiles.badge,
        title: t.profiles.title,
        text: h.linked
          ? 'Average GTH profile completion of linked students.'
          : 'Shown once students link their accounts.',
        progressLabel: `${h.avgProfile ?? 0}%`,
        fillPct: h.avgProfile ?? 0,
        foot: `${h.waitingToConfirm ?? 0} invited, not confirmed yet`,
      },
    ],
  };
};
