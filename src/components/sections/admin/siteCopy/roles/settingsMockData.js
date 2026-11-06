import { copyAccess } from '../copyAccess.js';

/*
 * settingsMockData — copy + mock rows of the Settings → Roles / Staff mock screens of Platform Admin 7.8.7a / 7.8.7b / 7.8.7e (Figma file iErYj7O3ft6WAG2FBT6aEw).
 * Text is copied from the Figma node characters. The real Settings pages (pages/admin/AdminSettingsPage.jsx) are wired to the backend by another developer, so these
 * screens are mock copies of their layout that add the 7.8 rows / column / account type; the lead decides how to add the same to the real pages (see the report).
 * ⚠️ ASSUMPTION: every value is mock (frontend only); where a screen needs text the frames do not draw (permission preview of the other roles, "Invited" status,
 * validation messages) it is tagged below.
 */

/** Role ids used by the screens (copyAccess.js COPY_PERMISSIONS keys) → the column / chip label. */
export const SETTINGS_ROLE_LABELS = {
  support: 'Support Agent',
  moderator: 'Content Moderator',
  senior: 'Senior Admin',
  super: 'Super Admin',
  editor: 'Content Editor',
  dpo: 'Data Protection Officer',
};

export const SETTINGS_SUBTITLE =
  '15 staff · 2 Super Admins · 1 Content Editor · least privilege for every role.';
export const SETTINGS_SUBTITLE_CREATE = 'Create a staff account for the product owner';

/** The nine items of the settings nav; the icon follows the POSITION (as in Figma), the label order differs per frame. */
export const NAV_ICONS = [
  'user',
  'shield',
  'bell',
  'sliders',
  'star',
  'globe',
  'lock',
  'users',
  'folder',
];
export const NAV_LABELS_ROLES = [
  'Overview',
  'Notification templates',
  'Roles and permissions',
  'Accessibility',
  'Feature flags',
  'Integrations',
  'Security',
  'Staff accounts',
  'Platform settings',
];
export const NAV_LABELS_STAFF = [
  'Overview',
  'Roles and permissions',
  'Notification templates',
  'Accessibility',
  'Feature flags',
  'Integrations',
  'Security',
  'Staff accounts',
  'Platform settings',
];
export const NAV_LOGOUT = 'Log out';

/** Matrix columns, in the order drawn. `role` maps to COPY_PERMISSIONS for the site content rows. */
export const MATRIX_COLUMNS = [
  { id: 'support', label: 'Support' },
  { id: 'moderator', label: 'Moderator' },
  { id: 'senior', label: 'Senior Admin' },
  { id: 'super', label: 'Super Admin' },
  { id: 'editor', label: 'Content Editor', accent: true },
];

/** The seven existing rows (on: Support, Moderator, Senior Admin, Super Admin; the Content Editor column is off for all of them). */
export const MATRIX_ROWS = [
  {
    id: 'search',
    title: 'Search accounts',
    text: 'Contact details stay masked below Super Admin.',
    on: [true, false, true, true],
  },
  {
    id: 'flags',
    title: 'Resolve flags',
    text: 'Dismiss, remove, warn or escalate.',
    on: [true, true, true, true],
  },
  {
    id: 'suspend',
    title: 'Suspend and reactivate',
    text: 'Indefinite needs a second approver.',
    on: [false, false, true, true],
  },
  {
    id: 'merge',
    title: 'Merge and override',
    text: 'Archived and logged.',
    on: [false, false, true, true],
  },
  {
    id: 'delete',
    title: 'Delete accounts',
    text: 'Dual approval, Super Admins only.',
    on: [false, false, false, true],
  },
  {
    id: 'exports',
    title: 'External exports',
    text: 'Second approver required.',
    on: [false, false, false, true],
  },
  {
    id: 'platform',
    title: 'Platform settings',
    text: 'Reason of 20+ characters required.',
    on: [false, false, false, true],
  },
];

/** The "SITE CONTENT · NEW" rows; `perm` is the COPY_PERMISSIONS key that drives the cells. */
export const SITE_CONTENT = {
  label: 'SITE CONTENT · NEW',
  chip: 'Added 1 Nov 2026',
  rows: [
    {
      id: 'read',
      perm: 'read',
      title: 'Read site copy',
      text: 'See pages, sections, history and the media library.',
    },
    {
      id: 'edit',
      perm: 'edit',
      title: 'Edit site copy',
      text: 'Save drafts of text, images and video links.',
    },
    {
      id: 'publish',
      perm: 'publish',
      title: 'Publish site copy',
      text: 'Make drafts live, with a reason. Restore old versions.',
    },
    {
      id: 'rename',
      perm: 'rename',
      title: 'Rename product names',
      text: 'Publish renames like Career Buddy → Tali.',
    },
  ],
  draftOnly: 'Draft only',
};

export const ROLES_CARD = {
  title: 'Roles and permissions',
  sub: 'What each role can do. Content Editors work on site copy only: no account, moderation or audit access.',
  permission: 'Permission',
};

export const SESSION_CARD = {
  title: 'Session rules',
  sub: 'Applies to every staff account.',
  twoStep: { title: '2-step sign-in required', text: 'For all roles' },
  selects: ['30 days', 'idle lock'],
};
export const INACTIVE_CARD = {
  title: 'Inactive accounts',
  row: { title: 'Lock after 30 days', text: 'Super Admins are told when an account locks.' },
};
export const MATRIX_ACTIONS = { download: 'Download permissions matrix', save: 'Save changes' };

/** 7.8.7b — Create a staff account. */
export const CREATE_ACCOUNT = {
  info: 'Staff accounts must use @ghanatalenthub.com. Accounts unused for 30 days lock automatically.',
  title: 'Create a staff account',
  sub: 'They get a secure set-up link that expires in 24 hours.',
  nameLabel: 'Full name',
  name: 'Ama Owusu',
  emailLabel: 'Work email',
  email: 'ama.owusu@ghanatalenthub.com',
  roles: [
    { id: 'support', label: 'Support Agent' },
    { id: 'moderator', label: 'Content Moderator' },
    { id: 'senior', label: 'Senior Admin' },
    { id: 'editor', label: 'Content Editor' },
    { id: 'super', label: 'Super Admin' },
  ],
  send: 'Send set-up link',
  domain: '@ghanatalenthub.com',
  // ⚠️ ASSUMPTION: the two validation messages (the frames draw none): the info banner above states the domain rule.
  nameError: 'Add their full name.',
  emailError: 'Use a work email that ends in @ghanatalenthub.com.',
};

export const EDITOR_CAN_DO = {
  title: 'What a Content Editor can do',
  sub: 'Made for the product owner. Changes take effect at their next sign-in.',
  rows: [
    {
      id: 'copy',
      title: 'Edit and publish site copy',
      text: 'Every portal, emails and the media library. Every publish needs a reason and is logged.',
      control: 'policy',
    },
    {
      id: 'names',
      title: 'Draft product names',
      text: 'Renames are published by a super admin, with a confirmation.',
      control: 'toggle-on',
    },
    {
      id: 'noaccess',
      title: 'No account, moderation or audit access',
      text: 'They can’t see talents’ personal data, flags or the audit log.',
      control: 'toggle-locked',
    },
  ],
  policy: 'Policy',
};

export const SUPER_ADMINS_CARD = {
  title: 'Super Admins',
  row: {
    title: '2 active Super Admins',
    text: 'There must always be at least one. The last one can’t be deactivated.',
  },
};

/** 7.8.7e — Staff accounts list. */
export const STAFF_LIST = {
  action: 'Create a staff account',
  columns: ['NAME', 'ROLE', 'LAST SIGN-IN', 'STATUS'],
  rows: [
    {
      id: 'ama',
      initials: 'AO',
      name: 'Ama Owusu',
      role: 'Content Editor · new',
      last: 'Today 14:40',
      status: 'Active',
      fresh: true,
    },
    {
      id: 'nana',
      initials: 'NA',
      name: 'Nana Adjei',
      role: 'Super Admin',
      last: 'Today 09:12',
      status: 'Active',
    },
    {
      id: 'akua',
      initials: 'AS',
      name: 'Akua Sarfo',
      role: 'Senior Admin',
      last: 'Today 08:55',
      status: 'Active',
    },
    {
      id: 'esi',
      initials: 'ED',
      name: 'Esi Darko',
      role: 'Content Moderator',
      last: 'Yesterday',
      status: 'Active',
    },
    {
      id: 'kweku',
      initials: 'KA',
      name: 'Kweku Ansah',
      role: 'Support Agent',
      last: 'Today 10:03',
      status: 'Active',
    },
    {
      id: 'kwabena',
      initials: 'KO',
      name: 'Kwabena Ofori',
      role: 'Data Protection Officer',
      last: '2 days ago',
      status: 'Active',
    },
  ],
  // The drawn line is for Ama Owusu ("She’ll … when she signs in"). ⚠️ ASSUMPTION: any other new account reads "They’ll … when they sign in".
  sentBanner: (name) =>
    name === 'Ama Owusu'
      ? 'Set-up link sent to Ama Owusu. She’ll see Site copy, Product names and Media library when she signs in.'
      : `Set-up link sent to ${name}. They’ll see Site copy, Product names and Media library when they sign in.`,
};

/**
 * The checkbox state of the matrix: the seven existing rows as drawn (Content Editor off), the site content rows from COPY_PERMISSIONS (copyAccess.js).
 * Keys are `${rowId}:${columnId}`.
 */
export const buildInitialCells = () => {
  const cells = {};
  MATRIX_ROWS.forEach((row) => {
    MATRIX_COLUMNS.forEach((col, i) => {
      cells[`${row.id}:${col.id}`] = col.id === 'editor' ? false : row.on[i];
    });
  });
  SITE_CONTENT.rows.forEach((row) => {
    MATRIX_COLUMNS.forEach((col) => {
      cells[`${row.id}:${col.id}`] = Boolean(copyAccess(col.id)[row.perm]);
    });
  });
  return cells;
};

/** The permission preview line of the create form: only the site copy part is derived (⚠️ ASSUMPTION: the other permissions of the role are not listed). */
export const permissionPreview = (roleId) => {
  const a = copyAccess(roleId);
  const verbs = [a.read && 'read', a.edit && 'edit', a.publish && 'publish'].filter(Boolean);
  const copyPart =
    verbs.length === 0
      ? ''
      : `${verbs.length > 1 ? `${verbs.slice(0, -1).join(', ')} and ${verbs.at(-1)}` : verbs[0]} site copy`;
  const names = a.rename ? 'rename product names' : a.renameDraft ? 'draft product names' : '';
  const joined = [copyPart, names].filter(Boolean).join(' · ');
  return `Permissions preview: ${joined || 'no site copy access'}`;
};
