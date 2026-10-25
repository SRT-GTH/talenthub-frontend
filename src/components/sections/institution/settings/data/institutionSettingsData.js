/*
 * institutionSettingsData.js — MOCK data of the Theme 11 institution settings screens (Figma 11.6.0a profile menu, 11.6.1a-g settings, 8597:* and 8746:*).
 * Shaped like the future /institution/settings, /institution/staff, /institution/audit responses. Copy is verbatim from the frames.
 * ⚠️ ASSUMPTION: every value is mock; nothing here is a real call.
 *
 * FIGMA INCONSISTENCY (kept, see wiki paragraph): the 8746:* frames (11.6.1e invite, 11.6.1f remove) are a revised copy of the 8597:* frames (11.6.1b staff,
 * 11.6.1d data): other banner / role / seat / data copy, 32px heading instead of 34px. Each block below holds BOTH versions: `base` = 8597:*, `rev` = 8746:*.
 * The page picks `rev` only while the matching dialog is open (staff + modal=invite, data + modal=remove), so every frame is reproduced as drawn.
 */

/* ---- settings navigation (frame 11.6.1a left sub-nav: 9 items, Staff carries the Admin chip) ---- */
export const SETTINGS_NAV = [
  { id: 'profile', label: 'Institution', icon: 'user', to: '/institution/settings/profile' },
  {
    id: 'public-page',
    label: 'Institution page',
    icon: 'shield',
    to: '/institution/public-page',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'bell',
    to: '/institution/settings/notifications',
  },
  // ⚠️ ASSUMPTION: Accessibility, Appearance and Security and sign-in are in the sub-nav but no frame draws them: rendered inert (aria-disabled).
  { id: 'accessibility', label: 'Accessibility', icon: 'sliders', disabled: true },
  { id: 'appearance', label: 'Appearance', icon: 'star', disabled: true },
  // ⚠️ ASSUMPTION: Accreditation opens the verification status page (11.1.2c).
  {
    id: 'accreditation',
    label: 'Accreditation',
    icon: 'globe',
    to: '/institution/accreditation/status',
  },
  { id: 'security', label: 'Security and sign-in', icon: 'lock', disabled: true },
  {
    id: 'staff',
    label: 'Staff',
    icon: 'users',
    chip: 'Admin',
    to: '/institution/settings/staff',
  },
  { id: 'data', label: 'Data and retention', icon: 'folder', to: '/institution/settings/data' },
];
export const SETTINGS_LOGOUT_LABEL = 'Log out';
export const SETTINGS_TABS = ['profile', 'staff', 'notifications', 'data', 'audit-log'];

export const SETTINGS_SUBTITLE = {
  default: 'Manage Savannah Hills SHS’s account, staff and data.',
  staff: 'Everyone gets their own login. Registrars approve records; teachers view progress.',
  staffRev: (used, cap) => `Everyone gets their own login. ${used} of ${cap} staff seats used.`,
  dataRev: 'Manage Savannah Hills SHS’s staff, data and audit trail.',
};

/* ---- institution profile (11.6.1a) ---- */
export const INSTITUTION_PROFILE = {
  name: 'Savannah Hills Senior High School',
  email: 'registrar@savannahhills.edu.gh',
  phone: '+233 37 209 1180',
  // Figma draws "09 / 1998" under the label "Accredited" (a leftover of the talent date-of-birth field): kept as drawn, read-only.
  accredited: '09 / 1998',
  region: 'Northern',
  town: 'Tamale',
  type: 'Senior high school (public)',
  typeNote: 'Verified 19 Oct 2026. Changing type sends you back through accreditation.',
};

/* ---- staff (11.6.1b, e, f) ---- */
export const STAFF_DOMAIN = '@savannahhills.edu.gh';
export const STAFF_SEATS = { base: 25, rev: 10 };
// 11.6.1e draws "6 of 10 seats used" over the same four people: the two seats nobody sees in the list are mock (⚠️ ASSUMPTION).
export const STAFF_SEATS_HIDDEN_REV = 2;
// Role vocabulary: the staff list says "Registrar", the invite pills say "Records officer" (Figma inconsistency, both kept). `row` = label in the list.
export const ROLES = [
  { id: 'admin', pill: 'Admin', row: 'Admin' },
  { id: 'records', pill: 'Records officer', row: 'Registrar' },
  { id: 'teacher', pill: 'Teacher', row: 'Teacher' },
];
export const STAFF = [
  {
    id: 'iddrisu-abdul-rahman',
    name: 'Iddrisu Abdul-Rahman',
    role: 'admin',
    email: 'registrar@savannahhills.edu.gh',
    note: 'you',
    status: 'active',
    self: true,
  },
  {
    id: 'kwame-asante',
    name: 'Kwame Asante',
    role: 'records',
    email: 'k.asante@savannahhills.edu.gh',
    note: 'active 2 days ago',
    status: 'active',
    // ⚠️ ASSUMPTION: remove-dialog counts and pronouns are mock (Figma draws them for Kwame only).
    pronoun: { subject: 'He’s', possessive: 'His', he: 'he' },
    drafts: 3,
    revocations: 1,
  },
  {
    id: 'daniel-owusu',
    name: 'Mr Daniel Owusu',
    role: 'teacher',
    email: 'd.owusu@savannahhills.edu.gh',
    note: 'Form 3B · active today',
    status: 'active',
    pronoun: { subject: 'He’s', possessive: 'His', he: 'he' },
    drafts: 0,
    revocations: 0,
  },
  {
    id: 'm-issah',
    name: 'm.issah@savannahhills.edu.gh',
    email: 'm.issah@savannahhills.edu.gh',
    role: 'teacher',
    note: 'Invite sent 17 Oct · expires in 7 days',
    status: 'invited',
  },
];
export const ROLE_INFO = {
  base: 'Admins manage staff. Registrars approve records and credentials. Teachers see their classes’ progress.',
  rev: 'Admins manage staff and settings. Records officers verify records and issue credentials. Teachers see their own classes.',
};
export const ROLE_CAPABILITIES = {
  base: [
    {
      id: 'approve',
      title: 'Approve records',
      desc: 'Admins and registrars only.',
      fixed: 'Always on',
    },
    {
      id: 'issue',
      title: 'Issue credentials',
      desc: 'Registrars issue. Revoking needs two staff.',
      on: true,
    },
    {
      id: 'export',
      title: 'Export progress',
      desc: 'Admins only. Under-18 data never leaves as names.',
      on: true,
    },
  ],
  rev: [
    {
      id: 'approve',
      title: 'Revoke a credential',
      desc: 'Admins and records officers. Every revocation needs two staff.',
      fixed: 'Always on',
    },
    {
      id: 'issue',
      title: 'Post programmes',
      desc: 'Teachers draft, admins publish.',
      on: true,
    },
    {
      id: 'export',
      title: 'Export the roster',
      desc: 'Admins only. Every export is logged with a purpose.',
      on: true,
    },
  ],
};
export const STAFF_SEATS_COPY = {
  base: 'Free for public schools. Ask us if you need more.',
  rev: 'Schools get 10 seats free. Ask your GTH contact if you need more.',
};

/* ---- notifications (11.6.1c) ---- */
export const NOTIF_CHANNELS = ['In GTH', 'Email', 'SMS', 'WhatsApp'];
export const NOTIF_ROWS = [
  {
    id: 'records',
    title: 'Records to verify',
    desc: 'Students send a result, certificate or award.',
    on: [true, true, false, true],
  },
  {
    id: 'transfers',
    title: 'Transfer requests',
    desc: 'Another school asks to move a student.',
    on: [true, true, true, true],
  },
  {
    id: 'signups',
    title: 'Programme sign-ups',
    desc: 'Students joining your programmes.',
    on: [true, true, true, true],
  },
  {
    id: 'revocations',
    title: 'Revocations',
    desc: 'A colleague starts a revocation that needs you.',
    on: [true, false, false, false],
  },
  {
    id: 'accreditation',
    title: 'Accreditation',
    desc: 'Licence renewals and checks.',
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

/* ---- data and retention (11.6.1d base copy, 11.6.1f revised copy) ---- */
export const DATA_COPY = {
  base: {
    hold: {
      title: 'Student data you hold',
      desc: 'Records stay while students are enrolled. Graduates keep their own copies.',
      download: {
        title: 'Download your records',
        desc: 'Roster, verified records, credentials and messages as a ZIP.',
        cta: 'Request download',
      },
      audit: {
        title: 'Audit log',
        desc: 'Every approval, revocation and export, with who did it.',
        cta: 'Download PDF',
      },
    },
    pause: {
      title: 'Pause the account',
      row: 'Pause institution account',
      desc: 'Programmes stop showing. Credentials you issued stay valid.',
    },
    close: {
      title: 'Close the account',
      desc: 'This closes the institution account for all your staff.',
      row: 'Students keep their verified records and credentials.',
      rowDesc: 'Download your audit log first if you need it.',
      cta: 'Close account',
    },
  },
  // 11.6.1f (8746:688): the Data tab behind the "Remove staff access" dialog. Its "Close the account" button reads "Remove access" (a leftover instance
  // label of the dialog button) — kept as drawn, only while this dialog is open.
  rev: {
    hold: {
      title: 'Data you hold',
      desc: 'CSV exports must be deleted when the purpose ends.',
      download: {
        title: 'Download your records',
        desc: 'Roster, records, credentials and programmes as a ZIP.',
        cta: 'Request download',
      },
      audit: {
        title: 'Export log',
        desc: 'Every CSV export, who made it, the purpose and when it must be deleted.',
        cta: 'Download PDF',
      },
    },
    pause: {
      title: 'Pause the account',
      row: 'Pause institution account',
      desc: 'Programmes stop showing. Your roster stays.',
    },
    close: {
      title: 'Close the account',
      desc: 'This closes the institution account for all your staff.',
      row: 'Students keep their own profiles and credentials. The audit log is kept for 7 years.',
      rowDesc: 'Download your records first if you need them.',
      cta: 'Remove access',
    },
  },
};

/* ---- audit log (11.6.1g) ---- */
export const AUDIT_TABS = [
  { id: 'all', label: 'All', count: 2946, countLabel: '2,946' },
  { id: 'roster', label: 'Roster', count: 1204, countLabel: '1,204' },
  { id: 'records', label: 'Records', count: 1318, countLabel: '1,318', accent: true },
  { id: 'credentials', label: 'Credentials', count: 424, countLabel: '424' },
];
export const AUDIT_TOTAL = '2,946 events';
export const AUDIT_BANNER = 'Your head of school gets the next summary on 1 Nov 2026.';
export const AUDIT_DRAWN = [
  {
    id: 'ev-1',
    kind: 'download',
    area: 'credentials',
    title: 'Revoked credential GTH-CR-0412-00203 (Yaw Adomako)',
    meta: '18 Oct 2026, 09:41 · Iddrisu Abdul-Rahman and Kwame Asante · reason: issued to the wrong student',
    badge: 'Logged',
    flag: 'Two approvals',
    chip: 'Credential',
    rows: '1 credential',
    strong: true,
    day: '18 Oct',
    href: '/institution/credentials/cred-1?state=revoked',
  },
  {
    id: 'ev-2',
    kind: 'change',
    area: 'roster',
    title: 'Uploaded class list “form3_2026.csv”',
    meta: '17 Oct 2026, 16:02 · Kwame Asante · 298 students added',
    flag: 'One approver',
    chip: 'Roster',
    rows: '298 students',
    day: '17 Oct',
    href: '/institution/students',
  },
  {
    id: 'ev-3',
    kind: 'request',
    area: 'records',
    title: 'Rejected record “Sports prefect letter”',
    meta: '12 Oct 2026, 11:20 · Iddrisu Abdul-Rahman · reason: unsigned copy',
    badge: 'Rejected',
    chip: 'Details',
    chip2: 'Roster',
    rows: '—',
    day: '12 Oct',
    href: '/institution/records/rec-1',
    dim: true,
  },
];
const WHO = ['Iddrisu Abdul-Rahman', 'Kwame Asante', 'Mr Daniel Owusu'];
// ⚠️ ASSUMPTION: only the 3 drawn events are real copy; the rest are generated sample rows so tabs, filters and pagination work.
const SAMPLES = {
  roster: [
    { kind: 'change', verb: 'Uploaded class list', obj: 'form2_2026.csv', chip: 'Roster' },
    { kind: 'change', verb: 'Transferred out 1 student to', obj: 'Tamale SHS', chip: 'Roster' },
    { kind: 'download', verb: 'Exported roster', obj: 'Form 3 (CSV)', chip: 'Roster' },
  ],
  records: [
    { kind: 'change', verb: 'Approved record', obj: 'WASSCE result', chip: 'Records' },
    { kind: 'request', verb: 'Rejected record', obj: 'Club certificate', chip: 'Records' },
    { kind: 'change', verb: 'Approved record', obj: 'Sports award', chip: 'Records' },
  ],
  credentials: [
    { kind: 'change', verb: 'Issued credential', obj: 'Form 3 Science', chip: 'Credential' },
    {
      kind: 'download',
      verb: 'Downloaded credential copy',
      obj: 'Form 3 Arts',
      chip: 'Credential',
    },
    { kind: 'change', verb: 'Issued to a whole class', obj: 'Form 3 Business', chip: 'Credential' },
  ],
};
const countLabel = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;
const makeEvent = (area, i) => {
  const s = SAMPLES[area][i % 3];
  const d = 1 + (i % 28);
  return {
    id: `gen-${area}-${i}`,
    kind: s.kind,
    area,
    title: `${s.verb} “${s.obj}”`,
    meta: `${d} Oct 2026, 1${i % 10}:0${i % 6} · ${WHO[i % 3]}`,
    flag: i % 2 === 0 ? 'One approver' : null,
    chip: s.chip,
    rows:
      s.kind === 'request'
        ? '—'
        : countLabel(1 + (i % 40), area === 'credentials' ? 'credential' : 'item'),
    day: `${d} Oct`,
    href: `/institution/${area === 'credentials' ? 'credentials' : area === 'records' ? 'records' : 'students'}`,
  };
};
const COUNTS = { roster: 1204, records: 1318, credentials: 424 };
// Drawn rows come first on the tab they belong to (Records = the frame); the "Records" tab shows the 3 drawn rows then samples.
export const buildAuditEvents = (tab) => {
  if (tab === 'all') {
    const areas = ['roster', 'records', 'credentials'];
    return [...AUDIT_DRAWN, ...Array.from({ length: 2943 }, (_, i) => makeEvent(areas[i % 3], i))];
  }
  const own = AUDIT_DRAWN.filter((e) => e.area === tab);
  // The frame (Records tab) draws all three rows, including the roster and credential ones.
  const drawn = tab === 'records' ? AUDIT_DRAWN : own;
  return [
    ...drawn,
    ...Array.from({ length: COUNTS[tab] - drawn.length }, (_, i) => makeEvent(tab, i)),
  ];
};
export const AUDIT_PAGE_SIZE = 10;
export const AUDIT_KINDS = [
  { id: 'all', label: 'All' },
  { id: 'download', label: 'Downloads' },
  { id: 'request', label: 'Requests' },
];

/* ---- copy of toasts and dialogs (⚠️ ASSUMPTION unless quoted from a frame) ---- */
export const TOASTS = {
  saved: { title: 'Saved' },
  invited: { title: 'Invite sent' },
  roleChanged: { title: 'Role updated' },
  removed: { title: 'Access removed' },
  exported: { title: 'Export CSV', body: 'Every export is logged with a purpose.' },
  muted: { title: 'Everything off for 24 hours' },
  downloadRequested: {
    title: 'Download requested',
    body: 'We will email a ZIP of your records to the registrar address.',
  },
  pdf: { title: 'Audit log PDF', body: 'Your download is starting.' },
  paused: { title: 'Account paused', body: 'Programmes stop showing until you switch it back on.' },
  resumed: { title: 'Account back on', body: 'Your programmes show again.' },
  closed: {
    title: 'Close request received',
    body: 'Nothing is closed in this preview. Your GTH contact confirms the request first.',
  },
};

/* ---- verification chip of the profile menu header (Figma draws "Verified institution"; the other gates are ⚠️ ASSUMPTIONS) ---- */
export const VERIFY_CHIP = {
  approved: 'Verified institution',
  'under-review': 'In review',
  'needs-info': 'Action needed',
  'not-approved': 'Not approved',
  none: 'Not verified',
};
