/*
 * agencyOnboardingData.js — MOCK data of the agency onboarding (Figma 11.4.1a-h; shaped like the future /agency/signup, /agency/mou and /agency/verification responses).
 * Copy is verbatim from the frames (curly quotes, middle dots). Sample content only. One marked block per concern.
 */

/* ===== BLOCK 1 · welcome modal + tour (11.4.1e-h) ====================================================================== */
export const WELCOME = {
  title: ['Akwaaba, {first}. Let’s brief ', 'with better data.'],
  body: 'The {agency} MoU is active. Here’s a quick tour of what your agency can see and do.',
  milestones: [
    { id: 'see', icon: 'eye', title: 'See', text: '4 saved queries' },
    { id: 'query', icon: 'trendUp', title: 'Query', text: 'Cut the data your way' },
    { id: 'brief', icon: 'trophy', title: 'Brief', text: 'Dated, logged packs for ministers' },
  ],
  primary: 'Take the 30-second tour',
  secondary: 'Look around first',
  extras: [
    { id: 'video', icon: 'play', label: 'Watch a 2-minute video' },
    { id: 'language', icon: 'globe', label: 'English (Ghana) · change' },
    { id: 'contrast', icon: 'eye', label: 'Larger text or high contrast' },
  ],
};

// target: the element the spotlight wraps (resolved at runtime, see AgencyTour).
export const TOUR_STEPS = [
  {
    id: 1,
    target: 'quick-query',
    title: 'Start with national data',
    text: 'See every region and district your MoU covers. Groups under 5 stay hidden, and every view is logged.',
    next: 'Next',
  },
  {
    id: 2,
    target: 'rail-nav',
    title: 'Everything lives here',
    text: 'Districts, queries, data requests and programmes. Analysts, MoU and API keys sit under your name, top right.',
    next: 'Next',
  },
  {
    id: 3,
    target: 'checklist',
    title: 'Four steps to get going',
    text: 'Run a query, invite your analysts and post a programme. Each step switches on something new.',
    next: 'Finish tour',
  },
];

/* ===== BLOCK 2 · first-login checklist + locked cards (11.4.0b) ======================================================== */
export const FIRST_LOGIN = {
  checklist: {
    title: 'Get set up',
    subtitle: 'Four quick steps. Do them in any order.',
    badge: '1 of 4 · nice start!',
    pct: 25,
    items: [
      { id: 'mou', title: 'Verify your agency (MoU)', state: 'done', trailing: 'Done' },
      {
        id: 'query',
        title: 'Run and save your first query',
        sub: 'Saved queries rerun on a schedule',
        state: 'todo',
        action: { label: 'Build a query', to: '/agency/queries' },
      },
      {
        id: 'invite',
        title: 'Invite your analysts',
        sub: 'Invite your analysts · 2 seats free',
        state: 'todo',
        trailing: '1 min',
      },
      {
        id: 'programme',
        title: 'Post your first programme',
        sub: 'Eligible talents see it in their feed',
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
        id: 'refresh',
        icon: 'sparkle',
        badge: 'Locked',
        title: 'Saved query refresh',
        text: 'Know when a number moves by more than 5%.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After you save a query',
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
        id: 'packs',
        icon: 'eye',
        badge: 'Locked',
        title: 'Briefing packs',
        text: 'Download dated, logged PDFs for ministers.',
        progressLabel: '0/1',
        fillPct: 61,
        foot: 'After your first programme',
      },
    ],
  },
};

/* ===== BLOCK 3 · MoU status gates (11.4.1c, c2, c3, d) ================================================================= */
// Hero + quick actions + checklist + unlock cards per ?mou= status.
const LOCKED_CARDS = [
  {
    id: 'national',
    icon: 'sparkle',
    title: 'National data',
    text: 'Regional and district aggregates for your MoU categories.',
  },
  {
    id: 'queries',
    icon: 'shield',
    title: 'Queries',
    text: 'Build your own cuts of the data. Groups under 5 stay hidden.',
  },
  {
    id: 'requests',
    icon: 'eye',
    title: 'Data requests',
    text: 'Ask for deeper data. Every request needs approval.',
  },
];
const gateCards = (badge, foot) =>
  LOCKED_CARDS.map((c) => ({ ...c, badge, progressLabel: 'MoU', fillPct: 61, foot }));

const GATE_ACTIONS = (third, fourth) => [
  {
    id: 'national',
    title: 'See national data',
    meta: 'Open to everyone',
    icon: 'map',
    tint: '#ebf1ec',
    ink: '#244a9f',
    to: '/agency/national',
  },
  {
    id: 'query',
    title: 'Run a query',
    meta: third,
    icon: 'search',
    tint: '#eaeffb',
    ink: '#244a9f',
    to: '/agency/queries',
  },
  {
    id: 'invite',
    title: 'Invite your analysts',
    meta: 'Set up seats now',
    icon: 'userPlus',
    tint: '#ebf1ec',
    ink: '#2d5d33',
    to: '/agency/settings?tab=analysts',
  },
  {
    id: 'programme',
    title: 'Post a programme',
    meta: fourth,
    icon: 'suitcase',
    tint: '#f5f3ff',
    ink: '#6d28d9',
    to: '/agency/programmes',
  },
];

const gateItems = (
  mouSub,
  mouTrailing,
  legalSub,
  legalTrailing,
  ceoSub,
  ceoTrailing,
  mouAction
) => [
  { id: 'account', title: 'Account and agency', state: 'done', trailing: 'Done' },
  {
    id: 'mou',
    title: 'MoU',
    sub: mouSub,
    state: mouAction ? 'todo' : 'done',
    trailing: mouTrailing,
    action: mouAction,
  },
  {
    id: 'legal',
    title: 'Legal team check',
    sub: legalSub,
    state: legalTrailing === 'Done' ? 'done' : 'todo',
    trailing: legalTrailing,
  },
  {
    id: 'ceo',
    title: 'Chief Executive’s confirmation',
    sub: ceoSub,
    state: ceoTrailing === 'Done' ? 'done' : 'todo',
    trailing: ceoTrailing,
  },
];

export const MOU_GATES = {
  pending: {
    hero: {
      title: 'We’re checking your documents',
      subtitle:
        'A reviewer picked up your application this morning. You’ll hear from us by Tuesday 20 October.',
      action: { label: 'Contact support', to: '/agency/settings?tab=support' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: 'National data opens once all four checks pass.',
      badge: '3 of 4 · in review',
      pct: 50,
      items: gateItems(
        'Uploaded · 17 Oct',
        null,
        'In review · started 18 Oct, 09:12',
        'Today',
        'We’ll email the Chief Executive to confirm',
        'Next',
        null
      ).map((it) =>
        it.id === 'mou'
          ? {
              ...it,
              state: 'done',
              action: { label: 'View documents', to: '/agency/mou?view=list' },
              trailing: undefined,
            }
          : it
      ),
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: 'Everything below opens the moment you’re approved.',
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
  'needs-info': {
    hero: {
      title: 'We need one more detail',
      subtitle:
        'Your MoU names a data protection officer, but you didn’t add one. Add their name and email to keep your place in the queue.',
      action: { label: 'Upload document', to: '/agency/mou?view=list' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: 'National data opens once all four checks pass.',
      badge: '3 of 4 · action needed',
      pct: 25,
      items: gateItems(
        'Name a data protection officer',
        null,
        'Needs more info · proof of address',
        'Fix now',
        'Waiting for the check above',
        'Paused',
        { label: 'Upload document', to: '/agency/mou?view=list' }
      ),
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: 'Everything below opens the moment you’re approved.',
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
  'not-approved': {
    tone: 'danger',
    hero: {
      title: 'We couldn’t verify your MoU',
      subtitle:
        'We couldn’t find MoU GTH-MOU-2026-004 in our signed records. Check the reference on page 1, or ask your legal team for the countersigned copy. You can appeal within 14 days.',
      action: { label: 'Start an appeal', to: '/agency/mou?view=list' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: 'National data opens once all four checks pass.',
      badge: 'Not approved · 19 Oct',
      pct: 25,
      items: gateItems(
        'MoU reference not found',
        null,
        'Not found in GTH’s signed MoUs',
        'Appeal by 2 Nov',
        'Not needed until the appeal',
        '—',
        { label: 'Start an appeal', to: '/agency/mou?view=list' }
      ),
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: 'Everything below opens the moment you’re approved.',
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
  approved: {
    hero: {
      title: 'You’re approved, {first}',
      subtitle:
        'The {agency} MoU is active. You can see national data, run queries and post programmes.',
      action: { label: 'Start the tour', to: '/agency?modal=welcome' },
    },
    actions: [
      {
        id: 'national',
        title: 'See national data',
        meta: 'Open to everyone',
        icon: 'map',
        tint: '#ebf1ec',
        ink: '#244a9f',
        to: '/agency/national',
      },
      {
        id: 'query',
        title: 'Run a query',
        meta: '16 regions · 261 districts',
        icon: 'search',
        tint: '#eaeffb',
        ink: '#244a9f',
        to: '/agency/queries',
      },
      {
        id: 'invite',
        title: 'Invite your analysts',
        meta: 'Set up seats now',
        icon: 'userPlus',
        tint: '#ebf1ec',
        ink: '#2d5d33',
        to: '/agency/settings?tab=analysts',
      },
      {
        id: 'programme',
        title: 'Post a programme',
        meta: 'Ready to post',
        icon: 'suitcase',
        tint: '#f5f3ff',
        ink: '#6d28d9',
        to: '/agency/programmes',
      },
    ],
    checklist: {
      title: 'Your verification',
      subtitle: 'National data opens once all four checks pass.',
      badge: '4 of 4 · approved',
      pct: 100,
      items: [
        { id: 'account', title: 'Account and agency', state: 'done', trailing: 'Done' },
        {
          id: 'mou',
          title: 'MoU',
          sub: 'All 4 accepted',
          state: 'done',
          action: { label: 'View documents', to: '/agency/mou?view=list' },
        },
        {
          id: 'legal',
          title: 'Legal team check',
          sub: 'Matched · 19 Oct',
          state: 'done',
          trailing: 'Done',
        },
        {
          id: 'ceo',
          title: 'Chief Executive’s confirmation',
          sub: 'Confirmed by the Chief Executive',
          state: 'done',
          trailing: 'Done',
        },
      ],
    },
    cards: {
      title: 'Now unlocked',
      subtitle: 'You can use all of these now.',
      dashed: false,
      cards: gateCards('Unlocked', 'Ready now'),
    },
  },
};

/* ===== BLOCK 4 · sign-up (11.4.1a, a2-a5) ============================================================================== */
export const SIGNUP = {
  eyebrow: '03',
  eyebrowLabel: 'Agency sign-up',
  title: ['Tell us about your ', 'agency.'],
  lead: 'Ministries, authorities and district assemblies register here to see national data, run queries and post programmes. Access follows your signed MoU.',
  agencyTypes: ['Government authority', 'Ministry', 'District assembly', 'Regulator'],
  dataNeeds: [
    'Skills, readiness, programme outcomes',
    'Regional talent supply',
    'Programme outcomes only',
  ],
  regions: ['Northern, Savannah, North East', 'Greater Accra', 'All 16 regions'],
  // The already-registered frame draws a different seal file + "Regions you work in" in place of "Data you need".
  values: {
    seal: 'nya-seal.png (120KB)',
    name: 'National Youth Authority',
    short: 'NYA',
    mouRef: 'GTH-MOU-2026-004',
    type: 'Government authority',
    email: 'efua.owusu@nya.gov.gh',
    password: '••••••••••••',
  },
  alreadySeal: 'northern-skills-logo.png (84KB)',
  registeredOn: '2 Sep',
  // Heading + steps of the progress header (Figma 11.4.1a breadcrumbs).
  steps: [
    { key: 'role', label: 'Role' },
    { key: 'get-started', label: 'Get started' },
    { key: 'agency', label: 'Agency' },
    { key: 'verify', label: 'Verify email' },
    { key: 'mou', label: 'MoU' },
    { key: 'review', label: 'Review' },
    { key: 'approved', label: 'Approved' },
  ],
  percent: { agency: 29, verify: 43 },
};

export const VERIFY = {
  eyebrow: '04',
  eyebrowLabel: 'Verify your email',
  title: ['Confirm ', 'your email.'],
  lead: 'We’ll send a 6-digit code to make sure this inbox belongs to your agency.',
  phone: { code: '+233', value: '23 533 45' },
  office: { code: '+233', value: '23 533 45' },
  email: 'efua.owusu@nya.gov.gh',
  masked: 'e•••s@nya.gov.gh',
  domainNote: 'We only accept your agency’s own email domain',
  expires: '09:58',
  resendIn: 59,
  attempts: 3,
  // ⚠️ ASSUMPTION: the demo code. It is documented here only; the UI never shows it.
  demoCode: '482913',
};

/* ===== BLOCK 5 · MoU upload (11.4.1b, b2) ============================================================================== */
export const MOU_UPLOAD = {
  stepChip: 'STEP 5 OF 7',
  stepName: 'MoU',
  progress: '4 of 7 done · 57%',
  eyebrow: 'MEMORANDUM OF UNDERSTANDING',
  title: ['Upload ', 'your signed MoU.'],
  lead: 'Upload the MoU you signed with GTH, a letter of authority and your director’s staff ID. Name a data protection officer. We review within 5 working days.',
  checks: [
    {
      id: 'ref',
      icon: 'fileCheck',
      title: 'MoU reference',
      text: 'We match it with the copy GTH signed',
    },
    {
      id: 'who',
      icon: 'calendar',
      title: 'Who signed it',
      text: 'The agency head confirms the account',
    },
    {
      id: 'see',
      icon: 'label',
      title: 'What you can see',
      text: 'Data categories and how long access lasts',
    },
  ],
  badges: [
    {
      id: 'verified',
      icon: 'checkFill',
      title: 'Verified',
      text: 'We matched it with the signed copy. Your agency shows as MoU active.',
    },
    {
      id: 'pending',
      icon: 'timeClock',
      title: 'Pending',
      text: 'Most reviews take 5 working days.',
    },
    {
      id: 'needs',
      icon: 'user',
      title: 'Needs more info',
      text: 'We email you exactly what to fix.',
    },
  ],
  renewals: {
    title: 'Renewals',
    icon: 'bell',
    itemTitle: 'MoU renewal',
    text: 'We remind you 60 days before it ends.',
  },
  empty: {
    title: ['Nothing ', 'uploaded yet.'],
    text: 'Upload a PDF or photo of each document. We read the details for you.',
    upload: 'Upload a document',
    manual: 'Enter details manually',
    help: 'Stuck? Talk to the public sector team',
    how: [
      { id: 'u', icon: 'upload', title: '1. Upload', text: 'PDF, JPG or PNG up to 10 MB.' },
      { id: 'c', icon: 'eye', title: '2. Check the details', text: 'Fix anything we got wrong.' },
      {
        id: 'v',
        icon: 'checkFill',
        title: '3. Get verified',
        text: 'We confirm with the GTH legal team.',
      },
    ],
    needLabel: 'WHAT WE NEED FROM YOU',
    need: {
      title: 'Signed MoU',
      badge: 'Required',
      meta: ['GTH × National Youth Authority', 'Signed 2 Sep 2026', 'GTH-MOU-2026-004'],
      tags: ['3 categories', 'Aggregate only', '12 months'],
      action: 'Upload',
    },
  },
  list: {
    title: 'Your documents',
    count: '3 of 4 documents',
    docs: [
      {
        id: 'mou',
        title: 'Signed MoU',
        status: 'Verified',
        tone: 'ok',
        meta: ['GTH × National Youth Authority', 'Signed 2 Sep 2026', 'GTH-MOU-2026-004'],
        tags: ['3 categories', 'Required', '12 months'],
        link: 'View file',
      },
      {
        id: 'id',
        title: 'Director’s staff ID',
        status: 'Verified',
        tone: 'ok',
        meta: ['Efua Owusu · Director, Research & Data', 'Expires Mar 2031', 'GHA-•••••••••-3'],
        tags: ['Identity', 'Agency head'],
        link: 'View file',
      },
      {
        id: 'loa',
        title: 'Letter of authority',
        status: 'Pending check',
        tone: 'warn',
        meta: ['Signed by the Chief Executive', 'Issued Sep 2026'],
        tags: ['Authority', 'Accra'],
      },
      {
        id: 'dpo',
        title: 'Data protection officer',
        status: 'Needs more info',
        tone: 'plain',
        meta: ['Missing · name your DPO', 'Upload now'],
        tags: ['Required'],
      },
    ],
    upload: 'Upload a document',
    manual: 'Enter details manually',
  },
  back: 'Back: Verify email',
  next: 'Next: Review',
  checklist: 'MoU checklist',
  mockDocs: [
    // ⚠️ ASSUMPTION: mock "upload" (no file leaves the browser). The dropzone adds one of these rows.
    {
      id: 'upl',
      title: 'Uploaded document',
      status: 'Pending check',
      tone: 'warn',
      meta: ['Uploaded just now'],
      tags: ['Pending'],
    },
  ],
};
