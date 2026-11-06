/*
 * institutionSettingsData.js — copy of the Theme 11 institution settings screens (Figma 11.6.0a profile menu, 11.6.1a-g settings, 8597:* and 8746:*).
 * Live data comes from the API (services/institutionPortal.api.js): GET /institution/settings (profile), /institution/staff, /institution/settings/notifications,
 * /institution/settings/data, /institution/audit. Only labels, descriptions and toasts live here.
 *
 * FIGMA INCONSISTENCY (kept): the 8746:* frames (11.6.1e invite, 11.6.1f remove) are a revised copy of the 8597:* frames (11.6.1b staff, 11.6.1d data) with
 * other banner / data copy. `base` = 8597:*, `rev` = 8746:*; the page picks `rev` only while the matching dialog is open.
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
  default: (name) => `Manage ${name || 'your institution'}’s account, staff and data.`,
  staff: 'Everyone gets their own login. Records officers verify records; teachers view progress.',
  staffRev: (used, cap) => `Everyone gets their own login. ${used} of ${cap} staff seats used.`,
  dataRev: (name) => `Manage ${name || 'your institution'}’s staff, data and audit trail.`,
};

/* ---- staff (11.6.1b, e, f) ---- */
// Role vocabulary: one label everywhere (Figma says "Registrar" in the list and "Records officer" on the invite pills).
export const ROLES = [
  { id: 'admin', pill: 'Admin', row: 'Admin' },
  { id: 'records', pill: 'Records officer', row: 'Records officer' },
  { id: 'teacher', pill: 'Teacher', row: 'Teacher' },
];
export const ROLE_INFO = {
  base: 'Admins manage staff and settings. Records officers manage the roster, verify records and issue credentials. Teachers see their classes’ progress.',
  rev: 'Admins manage staff and settings. Records officers verify records and issue credentials. Teachers see their own classes.',
};
// `id` is the stored capability (PATCH /institution/settings/capabilities); `fixed` rows can't be switched off.
export const ROLE_CAPABILITIES = [
  {
    id: 'approve',
    title: 'Approve records',
    desc: 'Admins and records officers only.',
    fixed: 'Always on',
  },
  {
    id: 'issue',
    title: 'Issue credentials',
    desc: 'Records officers issue. Revoking needs two staff.',
  },
  {
    id: 'export',
    title: 'Records officers can export the roster',
    desc: 'Admins can always export. Under-18s without a guardian’s agreement leave as initials.',
  },
];
export const STAFF_SEATS_COPY = 'Schools get 10 seats free. Ask your GTH contact if you need more.';

/* ---- notifications (11.6.1c) ---- */
export const NOTIF_CHANNELS = ['In GTH', 'Email', 'SMS', 'WhatsApp'];
export const NOTIF_ROWS = [
  {
    id: 'records',
    title: 'Records to verify',
    desc: 'Students send a result, certificate or award.',
  },
  { id: 'transfers', title: 'Transfer requests', desc: 'Another school asks to move a student.' },
  { id: 'signups', title: 'Programme sign-ups', desc: 'Students joining your programmes.' },
  {
    id: 'revocations',
    title: 'Revocations',
    desc: 'A colleague starts a revocation that needs you.',
  },
  { id: 'accreditation', title: 'Accreditation', desc: 'Licence renewals and checks.' },
  { id: 'team', title: 'Team activity', desc: 'New members and role changes.' },
  { id: 'news', title: 'News from GTH', desc: 'New features and events. About once a month.' },
];

/* ---- data and retention (11.6.1d base copy, 11.6.1f revised copy) ---- */
export const DATA_COPY = {
  base: {
    hold: {
      title: 'Student data you hold',
      desc: 'Records stay while students are enrolled. Graduates keep their own copies.',
      download: {
        title: 'Download your roster',
        desc: 'Every student on your roster as a CSV. The export is logged.',
        cta: 'Download CSV',
      },
      audit: {
        title: 'Audit log',
        desc: 'Every roster change, approval and export, with who did it.',
        cta: 'Download CSV',
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
  rev: {
    hold: {
      title: 'Data you hold',
      desc: 'CSV exports must be deleted when the purpose ends.',
      download: {
        title: 'Download your roster',
        desc: 'Every student on your roster as a CSV. The export is logged.',
        cta: 'Download CSV',
      },
      audit: {
        title: 'Export log',
        desc: 'Every CSV export, who made it and when.',
        cta: 'Download CSV',
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
      cta: 'Close account',
    },
  },
};

/* ---- audit log (11.6.1g) ---- */
export const AUDIT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'roster', label: 'Roster' },
  { id: 'records', label: 'Records', accent: true },
  { id: 'credentials', label: 'Credentials' },
];
export const AUDIT_KINDS = [
  { id: 'all', label: 'All' },
  { id: 'download', label: 'Downloads' },
  { id: 'request', label: 'Removals and requests' },
];

/* ---- toasts ---- */
export const TOASTS = {
  saved: { title: 'Saved' },
  invited: { title: 'Invite sent' },
  resent: { title: 'Invite sent again', body: 'The link works for another 7 days.' },
  roleChanged: { title: 'Role updated' },
  removed: { title: 'Access removed' },
  cancelled: { title: 'Invite cancelled' },
  exported: { title: 'Export ready', body: 'Every export is logged.' },
  muted: { title: 'Everything off for 24 hours' },
  paused: { title: 'Account paused', body: 'Programmes stop showing until you switch it back on.' },
  resumed: { title: 'Account back on', body: 'Your programmes show again.' },
  closed: {
    title: 'Close request sent',
    body: 'The GTH team confirms with you before anything is closed.',
  },
  failed: { title: 'That didn’t work' },
};

/* ---- verification chip of the profile menu header ---- */
export const VERIFY_CHIP = {
  approved: 'Verified institution',
  'under-review': 'In review',
  'needs-info': 'Action needed',
  'not-approved': 'Not approved',
  none: 'Not verified',
};
