/*
 * agencySettingsData.js — MOCK data of the Theme 11 settings screens (Figma 11.6.1a-h, 11.6.0b). Shaped like the future
 * /agency/settings, /agency/analysts, /agency/api-keys, /agency/audit responses. Copy is verbatim from the frames.
 * ⚠️ ASSUMPTION: every value is mock; nothing here is a real call.
 */

/* ---- settings navigation (frame 11.6.1a left sub-nav) ---- */
export const SETTINGS_NAV = [
  { id: 'profile', label: 'Agency', icon: 'user', to: '/agency/settings' },
  { id: 'public-page', label: 'Agency page', icon: 'shield', to: '/agency/public-page' },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'bell',
    to: '/agency/settings/notifications',
  },
  // ⚠️ ASSUMPTION: Accessibility and Appearance are in the sub-nav but no frame draws them: rendered inert (aria-disabled).
  { id: 'accessibility', label: 'Accessibility', icon: 'sliders', disabled: true },
  { id: 'appearance', label: 'Appearance', icon: 'star', disabled: true },
  { id: 'mou', label: 'MoU and access', icon: 'globe', to: '/agency/settings/mou' },
  { id: 'api-keys', label: 'Security and API keys', icon: 'lock', to: '/agency/settings/api-keys' },
  {
    id: 'analysts',
    label: 'Analysts',
    icon: 'users',
    chip: 'Admin',
    to: '/agency/settings/analysts',
  },
  { id: 'audit-log', label: 'Data and audit', icon: 'folder', to: '/agency/settings/audit-log' },
];
export const SETTINGS_LOGOUT_LABEL = 'Log out';
export const SETTINGS_TABS = [
  'profile',
  'analysts',
  'api-keys',
  'notifications',
  'mou',
  'audit-log',
];

export const SETTINGS_SUBTITLE = {
  default: 'Manage NYA’s access, analysts and audit trail.',
  'api-keys': 'Manage NYA’s access, analysts and API keys.',
};

/* ---- agency profile (11.6.1a) ---- */
export const AGENCY_PROFILE = {
  name: 'National Youth Authority',
  email: 'data@nya.gov.gh',
  phone: '+233 30 266 1084',
  mouSigned: '09 / 2026',
  region: 'Greater Accra',
  town: 'Accra',
  type: 'Government authority · youth',
  typeNote: 'MoU active since 18 Oct 2026. Changing type sends you back through MoU review.',
};

/* ---- analysts (11.6.1b-d) ---- */
export const ANALYST_DOMAIN = '@nya.gov.gh';
export const ANALYST_SEATS = 5;
export const ROLES = ['Admin', 'Analyst', 'Viewer'];
export const ANALYSTS = [
  {
    id: 'efua-owusu',
    name: 'Efua Owusu',
    role: 'Admin',
    email: 'efua.owusu@nya.gov.gh',
    note: 'you',
    status: 'active',
    self: true,
  },
  {
    id: 'kojo-mensah',
    name: 'Kojo Mensah',
    role: 'Analyst',
    email: 'kojo.mensah@nya.gov.gh',
    note: 'active 2 days ago',
    status: 'active',
    // ⚠️ ASSUMPTION: remove-dialog counts and pronouns are mock (Figma draws them for Kojo only).
    pronoun: { subject: 'He’s', possessive: 'His' },
    queries: 2,
    requests: 1,
  },
  {
    id: 'adjoa-boateng',
    name: 'Adjoa Boateng',
    role: 'Viewer',
    email: 'adjoa.boateng@nya.gov.gh',
    note: 'Minister’s office · active today',
    status: 'active',
    pronoun: { subject: 'She’s', possessive: 'Her' },
    queries: 0,
    requests: 0,
  },
  {
    id: 'k-asare',
    name: 'k.asare@nya.gov.gh',
    email: 'k.asare@nya.gov.gh',
    role: 'Analyst',
    note: 'Invite sent 17 Oct · expires in 7 days',
    status: 'invited',
  },
];
export const ROLE_INFO =
  'Admins manage analysts and API keys. Analysts run queries and request data. Viewers see dashboards only.';
export const ROLE_CAPABILITIES = [
  {
    id: 'privileged',
    title: 'Request privileged data',
    desc: 'Admins and analysts. Every request needs PM + DPO approval.',
    fixed: 'Always on',
  },
  { id: 'post', title: 'Post programmes', desc: 'Analysts draft, admins publish.', on: true },
  {
    id: 'export',
    title: 'Export CSV',
    desc: 'Admins and analysts. Every export is logged with a purpose.',
    on: true,
  },
];

/* ---- API keys (11.6.1e) ---- */
export const API_KEYS = [
  {
    id: 'research-dashboard',
    name: 'research-dashboard · live',
    prefix: 'gth_live_',
    last4: '4f2a',
    created: '2 Sep',
    by: 'Efua Owusu',
    lastUsed: 'today',
  },
];
export const TEST_KEY = {
  name: 'staging · test',
  title: 'Key active',
  prefix: 'gth_test_',
  last4: '91cc',
  note: 'sandbox data only · last used 3 Oct',
  active: false,
};
export const KEYS_EXPIRY = '18 Oct 2027';

/* ---- notifications (11.6.1f) ---- */
export const NOTIF_CHANNELS = ['In GTH', 'Email', 'SMS', 'WhatsApp'];
export const NOTIF_ROWS = [
  {
    id: 'saved-query',
    title: 'Saved query changes',
    desc: 'A saved query moves by more than 5%.',
    on: [true, true, false, true],
  },
  {
    id: 'decisions',
    title: 'Data request decisions',
    desc: 'Approvals, rejections and questions from reviewers.',
    on: [true, true, true, true],
  },
  {
    id: 'applicants',
    title: 'Programme applicants',
    desc: 'People applying to your programmes.',
    on: [true, true, true, true],
  },
  {
    id: 'quota',
    title: 'Quota alerts',
    desc: 'When you reach 80% of a MoU limit.',
    on: [true, false, false, false],
  },
  {
    id: 'window',
    title: 'Access window',
    desc: 'Access ending, expired and MoU renewal.',
    on: [true, true, false, false],
  },
  {
    id: 'team',
    title: 'Team activity',
    desc: 'New members and role changes.',
    on: [true, false, false, false],
  },
  {
    id: 'news',
    title: 'News from GTH',
    desc: 'New features and events. About once a month.',
    on: [false, true, false, false],
  },
];
export const NOTIF_QUIET = { from: '10:00 pm', to: '7:00 am' };

/* ---- MoU and access (11.6.1g) ---- */
export const MOU_SUMMARY =
  'GTH-MOU-2026-004 · signed 2 Sep 2026 · ends 18 Oct 2027. We remind you 60 days before.';
export const MOU_CATEGORIES = [
  { id: 'skills', title: 'Skills and readiness', note: 'Active' },
  {
    id: 'outcomes',
    title: 'Programme outcomes',
    note: 'Aggregates · district level',
    chip: 'Active',
  },
  {
    id: 'school',
    title: 'School-level data',
    note: 'Not in your MoU',
    chip: 'Request',
    request: true,
  },
];
export const MOU_QUOTA = {
  chip: '220 queries a month',
  desc: '142 used this month. Resets on the 1st.',
};
export const MOU_DPO = {
  chip: 'Ama Darko · dpo@nya.gov.gh',
  legal: 'Data Protection Act 2012 (Act 843), MoU clause 4.2',
};

/* ---- audit log (11.6.1h) ---- */
export const AUDIT_TABS = [
  { id: 'overview', label: 'Overview', count: 1284, countLabel: '1,284 events' },
  { id: 'downloads', label: 'Downloads', count: 18, countLabel: '18' },
  { id: 'requests', label: 'Requests', count: 3, countLabel: '3', accent: true },
  { id: 'quota', label: 'Quota', count: 142, countLabel: '64%' },
];
export const AUDIT_BANNER = 'Your DPO gets the next access report on 1 Nov 2026.';
export const AUDIT_DRAWN = [
  {
    id: 'ev-1',
    kind: 'download',
    title: 'Downloaded “Youth unemployment by district” (CSV)',
    meta: '18 Oct 2026, 09:41 · Efua Owusu · purpose: YouthStart 2027 planning',
    badge: 'Logged',
    privileged: true,
    chip: 'Details',
    more: '+2',
    rows: '252 rows',
    strong: true,
    day: '18 Oct',
    href: '/agency/queries/saved',
  },
  {
    id: 'ev-2',
    kind: 'query',
    title: 'Ran query “Volta tech, 18–24”',
    meta: '17 Oct 2026, 16:02 · Kojo Mensah · 237 talents',
    privileged: true,
    chip: 'Query',
    more: '+2',
    rows: '252 rows',
    day: '17 Oct',
    href: '/agency/queries?state=results&region=volta&interest=technology&age=18-24',
  },
  {
    id: 'ev-3',
    kind: 'request',
    title: 'Requested “Under-18 skills by school”',
    meta: '12 Oct 2026, 11:20 · Efua Owusu · rejected by DPO on 19 Oct',
    badge: 'Rejected',
    chip: 'Details',
    chip2: 'Query',
    more: '+1',
    rows: '—',
    day: '12 Oct',
    href: '/agency/data-requests/dr-1042?state=rejected',
    dim: true,
  },
];
const WHO = ['Efua Owusu', 'Kojo Mensah', 'Adjoa Boateng'];
const TITLES = {
  download: [
    'Youth unemployment by district',
    'Skills readiness by region',
    'Programme outcomes 2026',
  ],
  query: ['Volta tech, 18–24', 'NEET by district', 'Women in agribusiness'],
  request: ['Under-18 skills by school', 'District access extension', 'Programme applicants list'],
};
// ⚠️ ASSUMPTION: only the 3 drawn events are real copy; the rest are generated sample rows so filters and pagination work.
const makeEvent = (kind, i) => {
  const t = TITLES[kind][i % 3];
  const who = WHO[i % 3];
  const d = 1 + (i % 28);
  const verb = kind === 'download' ? 'Downloaded' : kind === 'query' ? 'Ran query' : 'Requested';
  const label = kind === 'download' ? `“${t}” (CSV)` : `“${t}”`;
  return {
    id: `gen-${kind}-${i}`,
    kind,
    title: `${verb} ${label}`,
    meta: `${d} Oct 2026, 1${i % 10}:0${i % 6} · ${who}${kind === 'query' ? ` · ${100 + i} talents` : ''}`,
    privileged: kind !== 'query' && i % 2 === 0,
    chip: kind === 'download' ? 'Details' : 'Query',
    more: '+1',
    rows: kind === 'request' ? '—' : `${100 + i * 3} rows`,
    day: `${d} Oct`,
    href: kind === 'request' ? '/agency/data-requests/dr-1042' : '/agency/queries/saved',
  };
};
const KINDS = ['download', 'query', 'request'];
export const buildAuditEvents = (tab) => {
  if (tab === 'requests') return AUDIT_DRAWN;
  if (tab === 'downloads')
    return [AUDIT_DRAWN[0], ...Array.from({ length: 17 }, (_, i) => makeEvent('download', i))];
  if (tab === 'quota')
    return [AUDIT_DRAWN[1], ...Array.from({ length: 141 }, (_, i) => makeEvent('query', i))];
  return [...AUDIT_DRAWN, ...Array.from({ length: 1281 }, (_, i) => makeEvent(KINDS[i % 3], i))];
};
export const AUDIT_PAGE_SIZE = 10;

/* ---- copy of toasts and dialogs (⚠️ ASSUMPTION unless quoted from a frame) ---- */
export const TOASTS = {
  saved: { title: 'Saved' },
  invited: { title: 'Invite sent' },
  roleChanged: { title: 'Role updated' },
  removed: { title: 'Access removed' },
  copied: { title: 'Copied' },
  keyRevoked: { title: 'All keys revoked' },
  exported: { title: 'Export CSV', body: 'Every export is logged with a purpose.' },
  quota: { title: 'Query quota', body: 'Set by your MoU. Ask your GTH contact to change them.' },
  muted: { title: 'Everything off for 24 hours' },
};
