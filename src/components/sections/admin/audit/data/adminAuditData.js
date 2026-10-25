/*
 * adminAuditData — copy of the Platform audit log screens (Figma canvas 8520:12, section 7.5.3: 7.5.3a Platform audit log 8639:4341, 7.5.3b Event detail 8639:4848, 7.5.3c Export
 * the log 8639:5521, 7.5.3d Senior Admin view (masked) 8666:11438). Strings copied from the Figma node text. ⚠️ ASSUMPTION: frontend only, fixed sample events.
 * Figma quirk kept: the "Exports" tab is the selected one in every frame, but the list under it mixes admin, setting and export events.
 * Role rule: the Senior Admin view (?role=senior, the default role) hides the third event and masks IPs (7.5.3d); Super Admin and the other roles see 7.5.3a.
 */

export const AUDIT = {
  title: 'Audit log',
  sticker: 'Immutable',
  subtitle:
    'Every user action, system event and admin operation. This log can’t be edited or deleted.',
  tabs: [
    { id: 'all', label: 'All events', count: '1.2M' },
    { id: 'admin', label: 'Admin actions', count: '4,812' },
    { id: 'exports', label: 'Exports', count: '38' },
    { id: 'logins', label: 'Logins', count: '9,204' },
  ],
  defaultTab: 'exports',
  chips: [
    { id: 'all', label: 'All' },
    { id: 'admin', label: 'Admin' },
    { id: 'system', label: 'System' },
  ],
  banner:
    'IP addresses are masked for Senior Admins. Exports over 10,000 rows need a second Super Admin.',
  bannerSenior:
    'You’re viewing as a Senior Admin. IP addresses are masked and events with raw personal data are hidden. Exports need a Super Admin.',
};

/** `restricted` is the Senior Admin copy of the same row (7.5.3d). */
export const EVENTS = [
  {
    id: 'suspend',
    icon: 'user',
    title: 'Suspended account TAL-311-0442',
    sticker: 'Admin',
    sub: '18 Oct 2026, 09:31 · Akua Sarfo · reason: harassment · 7 days',
    chips: [
      { label: 'Account', tone: 'amber' },
      { label: 'Details', tone: 'green' },
      { label: '+2', tone: 'grey' },
    ],
    pill: { label: '7 days', strong: true },
    age: '09:31',
  },
  {
    id: 'setting',
    icon: 'settings',
    title: 'Changed setting “Maintenance mode”',
    sub: '18 Oct 2026, 09:12 · Nana Adjei · Off → Scheduled',
    chips: [
      { label: 'Account', tone: 'amber' },
      { label: 'Setting', tone: 'green' },
      { label: '+2', tone: 'grey' },
    ],
    pill: { label: '7 days', strong: false },
    age: '09:12',
  },
  {
    id: 'export',
    icon: 'download',
    title: 'Exported “Youth sign-ups by district”',
    sticker: 'Dual approval',
    sub: '18 Oct 2026, 08:40 · Nana Adjei + Kwame Owusu · file hash 9f2c…',
    chips: [
      { label: 'Details', tone: 'green' },
      { label: 'Setting', tone: 'green' },
      { label: '+1', tone: 'grey' },
    ],
    pill: { label: '252 rows', strong: false },
    age: '08:40',
    muted: true,
    button: 'Details',
    restricted: {
      title: 'Restricted event',
      sub: 'Hidden for your role · contains personal data',
    },
  },
];

/* 7.5.3b — "Event detail" (the talent "Edit certification" record dialog, read-only). */
export const EVENT_DETAIL = {
  chip: 'Event AUD-88123041',
  title: ['Akua Sarfo · Senior', 'Admin'],
  sub: 'Read-only. This record can’t be edited or deleted.',
  file: {
    title: 'Suspended account TAL-311-0442',
    meta: 'admin.account.suspend · 18 Oct 2026, 09:31:07',
    action: 'Copy JSON',
  },
  rows: [
    [
      {
        id: 'actor',
        label: 'Actor',
        value: 'Akua Sarfo · Senior Admin',
        ro: true,
        required: true,
      },
      { id: 'before', label: 'Before', value: 'status: active', ro: true, required: true },
    ],
    [
      {
        id: 'after',
        label: 'After',
        select: ['status: suspended · ends 25 Oct'],
        required: true,
      },
      { id: 'ip', label: 'IP address', placeholder: 'IP address', ro: true },
    ],
    [
      {
        id: 'reason',
        label: 'Reason',
        value: 'Harassment in messages · FL-2291',
        ro: true,
        required: true,
      },
      {
        id: 'trace',
        label: 'Trace',
        value: 'trace-7f21c9 · auth, profile, audit',
        ro: true,
        tint: true,
      },
    ],
    [
      {
        id: 'device',
        label: 'Device',
        optional: true,
        placeholder: '102.176.•••.•• (masked)',
        ro: true,
      },
      {
        id: 'notified',
        label: 'Notified',
        optional: true,
        placeholder: 'User by email · no parent link',
        ro: true,
      },
    ],
  ],
  linked: 'Linked to flag FL-2291',
  integrity: 'Integrity check passed',
  closeLink: 'Close',
  close: 'Close',
  primary: 'Open account',
};

/* 7.5.3c — "Export the audit log". */
export const EXPORT = {
  title: 'Export the audit log',
  sub: 'Exports over 10,000 rows need a second Super Admin. The export itself is logged.',
  options: [
    {
      id: 'view',
      title: 'Current filters',
      meta: 'Admin actions · last 30 days · 4,812 rows · CSV',
    },
    {
      id: 'range',
      title: 'Everything in range',
      meta: '1.2M rows · needs a second approver',
    },
    {
      id: 'json',
      title: 'JSON for investigators',
      meta: 'Full payloads · Super Admins only',
    },
  ],
  reasonLabel: 'Reason (logged)',
  reason: 'Quarterly access review for the DPO',
  reasonMax: 200,
  cancel: 'Cancel',
  submit: 'Export CSV',
};
