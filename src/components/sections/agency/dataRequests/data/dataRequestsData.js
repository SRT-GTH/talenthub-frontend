/*
 * dataRequestsData.js — MOCK data of the privileged-data request flow (Figma 11.4.3a–i, frames 8597:8 … 8609:1674). Shaped like the future
 * GET /agency/data-requests, GET /agency/data-requests/:id, POST /agency/data-requests and POST /agency/data-requests/:id/appeal responses.
 * A request is approved by a GTH programme manager AND the data protection officer (DPO). Texts verbatim from the frames; where the frames
 * disagree with each other (counts, step labels) the figures are kept as drawn and listed in the package notes.
 */

/* ---- BLOCK 1 · clock (mock "now": 18 Oct 2026, 09:00, the "Data as of" of the national page) ---- */
export const MOCK_NOW = Date.parse('2026-10-18T09:00:00');
export const ACCESS_END = Date.parse('2026-10-24T23:59:00');
export const ACCESS_WINDOW_DAYS = 30;

/* ---- BLOCK 2 · list (11.4.3a) ---- */
export const REQUEST_STATUS_LABEL = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  'needs-detail': 'Needs detail',
  ended: 'Ended',
};

export const REQUESTS = [
  {
    id: 'dr-1042',
    title: 'Youth unemployment by district',
    status: 'approved',
    detail: 'Aggregates · 261 districts · requested 12 Sep',
    icon: 'chart',
    note: { tone: 'access', label: 'Access ends in 6 days' },
    chips: ['Readiness'],
    more: 1,
    action: 'Open data',
  },
  {
    id: 'dr-1043',
    title: 'NSS placements by region',
    status: 'pending',
    detail: 'Aggregates · 16 regions · requested 2 Oct',
    icon: 'map',
    note: { tone: 'access', label: 'In review · day 3 of 10' },
    chips: ['Outcomes'],
    more: 1,
    action: 'Pending',
  },
  {
    id: 'dr-1041',
    title: 'Under-18 skills by school',
    status: 'rejected',
    detail: 'School-level data for minors isn’t allowed under your MoU',
    icon: 'lock',
    chips: ['Minors', 'Outcomes'],
    more: 1,
    action: 'View reason',
    muted: true,
  },
];

// Tab counts exactly as drawn ("Pending 1 · Approved 2 · All 9 · Rejected 1", chips "All 9 · Active 2 · Expired 6"); the rows above are the
// three sample requests the frame lists. A request sent from the form adds one to Pending and All.
export const TAB_COUNTS = { pending: 1, approved: 2, all: 9, rejected: 1 };
export const SCOPE_COUNTS = { all: 9, active: 2, expired: 6 };
export const SORTS = ['Newest first', 'Oldest first'];
export const LIST_COPY = {
  title: 'Data requests',
  subtitle:
    'Ask for data beyond your standard view. A GTH programme manager and the data protection officer approve every request.',
  banner:
    'Access to “Youth unemployment by district” ends in 6 days. Download what you need before then.',
};

/* ---- BLOCK 3 · new request form (11.4.3b) ---- */
export const NEW_REQUEST = {
  title: ['Tell us ', 'what you need and why.'],
  intro:
    'A GTH programme manager and the data protection officer review every request within 10 working days. Approved access lasts 30 days and every download is logged.',
  attachTitle: 'Attach a research brief',
  attachHint: 'PDF · optional · helps the reviewers decide faster',
  attachButton: 'Attach brief',
  divider: 'request details',
  categories: [
    'Readiness · in your MoU',
    // ⚠️ ASSUMPTION: Figma draws one category; the other two are the remaining MoU categories ("3 data categories").
    'Skills · in your MoU',
    'Programme outcomes · in your MoU',
  ],
  levelOfDetail: 'Aggregates only · groups under 5 hidden',
  accessFor: '30 days',
  confirm: 'I confirm this follows MoU clause 4.2 and won’t be shared outside NYA',
  cancel: 'Cancel',
  submit: 'Send for approval',
};

/* ---- BLOCK 4 · request detail states (11.4.3c–g, i) ---- */
export const DETAIL_STATES = ['pending', 'approved', 'rejected', 'ended', 'needs-detail'];

const LOCKED_CARDS = (dataset) => [
  {
    id: 'dataset',
    title: 'Dataset',
    text: dataset,
    icon: 'dataset',
    badge: 'Locked',
    value: '30 days',
    foot: 'Starts at approval',
    fill: 34,
  },
  {
    id: 'window',
    title: 'Access window',
    text: '30 days from approval. Every download is logged.',
    icon: 'shield',
    badge: 'Locked',
    value: '30 days',
    foot: 'Starts at approval',
    fill: 34,
  },
  {
    id: 'audit',
    title: 'Audit log',
    text: 'You, the reviewers and NYA’s DPO can see who opened it.',
    icon: 'audit',
    badge: 'Locked',
    value: '30 days',
    foot: 'Starts at approval',
    fill: 45,
  },
];

const QUICK = (open, query) => [
  { id: 'dataset', label: 'Open dataset', hint: open, icon: 'map', tone: 'green' },
  { id: 'query', label: 'Run a query', hint: query, icon: 'search', tone: 'blue' },
  {
    id: 'viewer',
    label: 'Add a viewer',
    hint: 'Share access with a colleague',
    icon: 'user-plus',
    tone: 'green',
  },
  { id: 'new', label: 'New request', hint: 'Ask for more data', icon: 'suitcase', tone: 'purple' },
];

const STEP_NAMES = [
  'Request sent',
  'Request details',
  'Programme manager review',
  'Data protection officer',
];

export const DETAIL = {
  pending: {
    tone: 'green',
    subject: 'NSS placements by region',
    heroTitle: 'Your request is in review',
    heroText:
      'A programme manager picked up “NSS placements by region” this morning. You’ll hear from us by Friday 30 October.',
    heroAction: { id: 'support', label: 'Contact support' },
    quick: QUICK('Opens after approval', 'Opens after approval'),
    stepsSub: 'Both a programme manager and the data protection officer must approve.',
    stepsBadge: '3 of 4 · in review',
    progress: 50,
    steps: [
      { name: STEP_NAMES[0], done: true, right: 'Done', plain: true },
      { name: STEP_NAMES[1], done: true, sub: 'Uploaded · 17 Oct', action: 'View request' },
      { name: STEP_NAMES[2], sub: 'In review · started 18 Oct, 09:12', right: 'Today' },
      { name: STEP_NAMES[3], sub: 'The GTH DPO checks it follows your MoU', right: 'Next' },
    ],
    sectionTitle: 'Opens when approved',
    sectionSub: 'Everything below opens the moment both reviewers approve.',
    cards: LOCKED_CARDS('NSS placements by region, aggregates only.'),
    locked: true,
  },
  approved: {
    tone: 'green',
    subject: 'Youth unemployment by district',
    heroTitle: 'Request approved',
    heroText:
      '“Youth unemployment by district” is approved. You can open it until 24 Oct 2026. Every view and download is logged.',
    heroAction: { id: 'dataset', label: 'Open dataset' },
    quick: QUICK('Youth unemployment by district', '16 regions · 261 districts'),
    stepsSub: 'Both reviewers signed off on 17 Oct.',
    stepsBadge: '4 of 4 · approved',
    progress: 100,
    steps: [
      { name: STEP_NAMES[0], done: true, right: 'Done', plain: true },
      {
        name: STEP_NAMES[1],
        done: true,
        sub: 'Purpose, scope and viewers',
        action: 'View request',
      },
      { name: STEP_NAMES[2], done: true, sub: 'Approved · 16 Oct', right: 'Done' },
      { name: STEP_NAMES[3], done: true, sub: 'Approved by the GTH DPO', right: 'Done' },
    ],
    sectionTitle: 'Your access',
    sectionSub: 'Open until 24 Oct 2026, 23:59.',
    cards: [
      {
        id: 'dataset',
        title: 'Dataset',
        text: 'Youth unemployment by district, aggregates only.',
        icon: 'dataset',
        badge: 'Open',
        foot: 'Open',
        fill: 34,
        live: true,
      },
      {
        id: 'window',
        title: 'Access window',
        text: '30 days from approval. Every download is logged.',
        icon: 'shield',
        badge: 'Open',
        foot: 'Open',
        fill: 34,
        live: true,
      },
      {
        id: 'audit',
        title: 'Audit log',
        text: 'You, the reviewers and NYA’s DPO can see who opened it.',
        icon: 'audit',
        badge: 'Open',
        foot: 'Open',
        fill: 45,
        live: true,
      },
    ],
    locked: false,
  },
  rejected: {
    tone: 'red',
    subject: 'Under-18 skills by school',
    heroTitle: 'We couldn’t approve this request',
    heroText:
      '“Under-18 skills by school” asks for school-level data on minors. Your MoU only covers aggregates for under-18s. You can appeal within 14 days or ask for regional totals instead.',
    heroAction: { id: 'appeal', label: 'Start an appeal' },
    quick: QUICK('Opens after approval', 'Opens after approval'),
    stepsSub: 'The programme manager stopped the request at review.',
    stepsBadge: 'Not approved · 19 Oct',
    progress: 25,
    steps: [
      { name: STEP_NAMES[0], done: true, right: 'Done', plain: true },
      { name: STEP_NAMES[1], sub: 'Outside your MoU', action: 'Start an appeal' },
      {
        name: STEP_NAMES[2],
        sub: 'Asks for school-level data on minors',
        right: 'Appeal by 2 Nov',
      },
      { name: STEP_NAMES[3], sub: 'Not needed until the appeal', right: '—' },
    ],
    sectionTitle: 'Opens when approved',
    sectionSub: 'Everything below opens the moment both reviewers approve.',
    cards: LOCKED_CARDS('Not available under your MoU. Regional totals are.').map((c, i) =>
      i === 0 ? { ...c, title: 'Under-18 skills by school' } : c
    ),
    locked: true,
  },
  ended: {
    tone: 'red',
    subject: 'Youth unemployment by district',
    heroTitle: 'Your access has ended',
    heroText:
      'Access to “Youth unemployment by district” ended on 24 October. Downloads you made stay logged. Ask to extend for up to 30 more days, with a reason.',
    heroAction: { id: 'extend', label: 'Ask to extend' },
    quick: QUICK('Opens after approval', 'Opens after approval'),
    // Figma keeps the rejected copy in the steps card of this frame ("Not approved · 19 Oct", "Appeal by 2 Nov"); reproduced as drawn.
    stepsSub: 'Both a programme manager and the data protection officer must approve.',
    stepsBadge: 'Not approved · 19 Oct',
    progress: 25,
    steps: [
      { name: STEP_NAMES[0], done: true, right: 'Done', plain: true },
      { name: STEP_NAMES[1], sub: 'Access window closed', action: 'Ask to extend' },
      { name: STEP_NAMES[2], sub: 'Ended 24 Oct, 23:59', right: 'Appeal by 2 Nov' },
      { name: STEP_NAMES[3], sub: 'Not needed until the appeal', right: '—' },
    ],
    sectionTitle: 'Opens when approved',
    sectionSub: 'Everything below opens the moment both reviewers approve.',
    cards: LOCKED_CARDS('The approved slice of data, aggregates only.'),
    locked: true,
  },
  'needs-detail': {
    tone: 'green',
    subject: 'NSS placements by region',
    heroTitle: 'We need more detail on your purpose',
    heroText:
      'The data protection officer asked how NYA will use “NSS placements by region”. “Research” is too broad. Add the policy question and who will see the results.',
    heroAction: { id: 'detail', label: 'Add detail' },
    quick: QUICK('Opens after approval', 'Opens after approval'),
    stepsSub: 'Both a programme manager and the data protection officer must approve.',
    stepsBadge: '3 of 4 · action needed',
    progress: 25,
    steps: [
      { name: STEP_NAMES[0], done: true, right: 'Done', plain: true },
      { name: STEP_NAMES[1], sub: 'Purpose too broad', action: 'Add detail' },
      { name: STEP_NAMES[2], sub: 'Needs more info · proof of address', right: 'Fix now' },
      { name: STEP_NAMES[3], sub: 'Waiting for the check above', right: 'Paused' },
    ],
    sectionTitle: 'Opens when approved',
    sectionSub: 'Everything below opens the moment both reviewers approve.',
    cards: LOCKED_CARDS('The approved slice of data, aggregates only.'),
    locked: true,
  },
};

export const STATE_FOR_STATUS = {
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
  ended: 'ended',
  'needs-detail': 'needs-detail',
};

/* ---- BLOCK 5 · appeal (11.4.3i) ---- */
export const APPEAL = {
  chip: 'Appeal this decision',
  title: ['Appeal this ', 'decision'],
  intro: 'A different reviewer looks at appeals. Most decisions come within 10 working days.',
  file: {
    title: 'Under-18 skills by school · rejected 19 Oct',
    reason: 'Reason: school-level data on minors',
    button: 'View decision',
  },
  defaults: {
    accept: 'Regional totals only',
    why: 'Plan 2027 school-to-work grants',
    detail: 'District totals, ages 14–17',
    policy: 'Cabinet memo CM/2026/114',
    range: 'Jan 2025 – Oct 2026',
    link: '',
    viewers: 'Efua Owusu, Kojo Mensah',
  },
  levels: ['District totals, ages 14–17', 'Regional totals only', 'National totals only'],
  verified: 'District totals are inside your MoU',
  confirm: 'I confirm results will only be shared as aggregates',
  withdraw: 'Withdraw request',
  cancel: 'Cancel',
  submit: 'Send appeal',
};

/* ---- BLOCK 6 · approved dataset (11.4.3h): header copy + audit numbers ---- */
export const DATASET = {
  heroTitle: 'Youth unemployment · Accra Metro',
  heroText:
    'Approved dataset · access ends 24 Oct 2026, 23:59 · every view and download is logged under your name.',
  download: 'Download CSV (logged)',
  eyebrow: 'Not in work or training · Accra Metro',
  logged: {
    eyebrow: 'For your agency',
    title: 'Logged view',
    text: 'You opened this dataset 4 times and downloaded it once. The DPO can see this log.',
    action: 'View access log',
  },
  csvName: 'youth-unemployment-accra-metro.csv',
};

/* ---- BLOCK 7 · mock API calls ---- */
let submitted = [];

export const listRequests = () => [...submitted, ...REQUESTS];
export const getRequest = (id) => listRequests().find((r) => r.id === id) ?? null;

export const submitRequest = (form) =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const request = {
        id: `dr-${1050 + submitted.length + 1}`,
        title: form.what.trim(),
        status: 'pending',
        detail: `Aggregates · ${form.regions.trim() || 'All 16 regions'} · requested 18 Oct`,
        icon: 'map',
        note: { tone: 'access', label: 'In review · day 1 of 10' },
        chips: [form.category.split(' · ')[0]],
        more: 0,
        action: 'Pending',
        submitted: true,
      };
      submitted = [request, ...submitted];
      resolve(request);
    }, 500);
  });

export const submitAppeal = (payload) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ ok: true, payload }), 500);
  });
