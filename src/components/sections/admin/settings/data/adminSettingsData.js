/*
 * adminSettingsData — copy of the Staff, roles and platform-settings screens (Figma canvas 8520:12, section 7.5.1-7.5.2: 7.5.1a Staff accounts 8639:8, 7.5.1b Create a staff
 * account 8639:540, 7.5.1c Deactivate 8639:1034, 7.5.1d Last Super Admin blocked 8639:1538, 7.5.1e Roles and permissions 8639:2083, 7.5.2a Feature flags and integrations
 * 8639:2677, 7.5.2b Change a setting 8639:3123, 7.5.2c Feature in use warning 8639:3855). Strings copied from the Figma node text. ⚠️ ASSUMPTION: frontend only, fixed sample staff.
 * Figma quirk kept: the settings nav lists "Notification templates" before "Roles and permissions" only in the Roles frame (NAV_ROLES).
 */

const BASE = [
  { id: 'overview', label: 'Overview', icon: 'user' },
  { id: 'roles', label: 'Roles and permissions', icon: 'shield', to: '/admin/settings/roles' },
  {
    id: 'organisations',
    label: 'Organisations and tenants',
    icon: 'globe',
    to: '/admin/settings/organisations',
  },
  { id: 'templates', label: 'Notification templates', icon: 'bell', to: '/admin/comms/templates' },
  {
    id: 'onboarding',
    label: 'Onboarding templates',
    icon: 'folder',
    to: '/admin/settings/onboarding',
  },
  { id: 'observability', label: 'Observability', icon: 'sliders', to: '/admin/observability' },
  { id: 'accessibility', label: 'Accessibility', icon: 'sliders' },
  { id: 'flags', label: 'Feature flags', icon: 'sliders', to: '/admin/settings' },
  { id: 'integrations', label: 'Integrations', icon: 'globe', to: '/admin/settings#integrations' },
  { id: 'security', label: 'Security', icon: 'lock' },
  {
    id: 'staff',
    label: 'Staff accounts',
    icon: 'users',
    chip: 'Admin',
    to: '/admin/settings/staff',
  },
  { id: 'platform', label: 'Platform settings', icon: 'folder', to: '/admin/settings' },
];

/** The nav of every frame but the Roles one. */
export const NAV = BASE;
/** 7.5.1e draws Notification templates second and Roles and permissions third (selected). */
export const NAV_ROLES = [BASE[0], BASE[2], BASE[1], ...BASE.slice(3)];
export const LOGOUT = 'Log out';

export const SUBTITLE_STAFF = '14 staff · 2 Super Admins · least privilege for every role.';
export const SUBTITLE_PLATFORM =
  'Platform configuration. Super Admins only. Every change needs a reason and is logged.';

export const INFO =
  'Staff accounts must use @ghanatalenthub.com. Accounts unused for 30 days lock automatically.';

export const STAFF = {
  title: 'Staff',
  rows: [
    {
      id: 'nana',
      name: 'Nana Adjei · Super Admin',
      sub: 'nana.adjei@ghanatalenthub.com · you',
      chip: 'Active',
      link: 'You',
    },
    {
      id: 'akua',
      name: 'Akua Sarfo · Senior Admin',
      sub: 'akua.sarfo@ghanatalenthub.com · Trust & Safety · active now',
      chip: 'Active',
      link: 'Change',
    },
    {
      id: 'esi',
      name: 'Esi Darko · Content Moderator',
      sub: 'esi.darko@ghanatalenthub.com · active today',
      chip: 'Active',
      link: 'Change',
    },
    {
      id: 'kweku',
      name: 'kweku.ansah@ghanatalenthub.com',
      sub: 'Support Agent · last sign-in 17 Sep',
      chip: 'Locked · 30 days',
      locked: true,
      link: 'Review',
    },
  ],
};
export const CREATE_ACTION = 'Create a staff account';

export const CREATE = {
  title: 'Create a staff account',
  sub: 'They get a secure set-up link that expires in 24 hours.',
  nameLabel: 'Full name',
  name: 'Yaw Boakye',
  emailLabel: 'Work email',
  email: 'yaw.boakye@ghanatalenthub.com',
  roles: ['Admin', 'Senior Admin', 'Support Agent', 'Content Moderator'],
  send: 'Send set-up link',
  preview: 'Permissions preview: accounts, approvals, escalations',
};

export const ROLE_SUMMARY = {
  title: 'What each role can do',
  sub: 'Least privilege. Changes take effect right away and are logged.',
  rows: [
    {
      title: 'Suspend accounts',
      text: 'Senior Admin and above. Indefinite needs a second approver.',
      control: 'policy',
    },
    {
      title: 'Moderate content',
      text: 'Moderators, Senior Admins and Super Admins.',
      control: 'toggle',
    },
    {
      title: 'External data exports',
      text: 'Super Admins only, with a second approver.',
      control: 'toggle',
    },
  ],
};

export const SUPER_ADMINS = {
  title: 'Super Admins',
  row: {
    title: '2 active Super Admins',
    text: 'There must always be at least one. The last one can’t be deactivated.',
  },
};

export const LAST_SUPER = {
  title: 'You can’t deactivate the last Super Admin',
  body: 'Make another staff member a Super Admin first. The platform always needs at least one.',
  primary: 'Change a role',
  secondary: 'Close',
};

/* 7.5.1c — "Platform settings" with the staff-data groups, and the deactivate dialog drawn over it. */
export const STAFF_DATA = {
  data: {
    title: 'Staff data',
    sub: 'Staff accounts follow least privilege.',
    rows: [
      {
        title: 'Download staff list',
        text: 'Staff list, roles and permissions as a CSV.',
        action: 'Download',
      },
      {
        title: 'Access review',
        text: 'Quarterly review of who can do what.',
        action: 'Download PDF',
      },
    ],
  },
  lock: {
    title: 'Lock staff account',
    row: { title: 'Lock now', text: 'They can’t sign in until a Super Admin unlocks them.' },
  },
  danger: {
    title: 'Deactivate staff account',
    sub: 'Signs them out everywhere and removes access.',
    row: {
      title: 'Their actions stay in the audit log for 7 years.',
      text: 'Pick a reason: resigned, terminated, role change or leave.',
    },
    action: 'Deactivate',
  },
};

export const DEACTIVATE = {
  title: 'Deactivate Kweku Ansah?',
  happens: [
    'Every session ends right away',
    'His 2 open tickets move to Akua Sarfo',
    'Claimed flags go back to the queue',
    'His past actions stay in the audit log',
  ],
  info: 'Reason is required: resigned, terminated, role change or leave.',
  cancel: 'Cancel',
  submit: 'Deactivate',
};

export const ROLES = {
  title: 'Roles and permissions',
  sub: 'What each role can do. Changes apply right away and are logged.',
  columns: ['Support', 'Moderator', 'Senior Admin', 'Super Admin'],
  head: 'Permission',
  rows: [
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
  ],
  session: {
    title: 'Session rules',
    sub: 'Applies to every staff account.',
    twoStep: { title: '2-step sign-in required', text: 'For all roles' },
    selects: ['30 days', 'idle lock'],
  },
  inactive: {
    title: 'Inactive accounts',
    row: { title: 'Lock after 30 days', text: 'Super Admins are told when an account locks.' },
  },
  download: 'Download permissions matrix',
  save: 'Save changes',
};

export const FLAGS = {
  title: 'Feature flags',
  sub: 'Turn features on or off for everyone. Each change needs a reason.',
  rows: [
    { id: 'posts', title: 'Community posts', text: 'On · 1,200 daily users', action: 'Turn off' },
    { id: 'games', title: 'Skills Lab games', text: 'On · 4,800 daily users', action: 'Turn off' },
  ],
  maintenance: {
    title: 'Maintenance mode',
    row: { title: 'Show maintenance page', text: 'Scheduled for Sun 25 Oct, 01:00–03:00.' },
  },
  credentials: {
    title: 'Integration credentials',
    sub: 'Paystack, SMS gateway, NIA Ghana Card check. Values stay masked.',
    row: { title: 'Paystack secret · ••••••••4f2a', text: 'Rotated 2 Sep by Nana Adjei' },
    action: 'Rotate key',
  },
};

export const FLAG_IN_USE = {
  title: 'About 1,200 people use this every day',
  body: 'Turning off Community posts affects them straight away. All Senior Admins are told, and you can roll back from the history.',
  primary: 'Turn off',
  secondary: 'Cancel',
};

export const CHANGE_SETTING = {
  chip: 'Change a setting',
  title: ['Maintenance', 'mode'],
  sub: 'Every change is logged with the old value, the new value and your reason.',
  file: {
    title: 'Maintenance mode',
    meta: 'Last changed 2 Aug by Nana Adjei',
    action: 'View history',
  },
  rows: [
    [
      { id: 'setting', label: 'Setting', value: 'Maintenance mode', ro: true, required: true },
      { id: 'current', label: 'Current value', value: 'Off', ro: true, required: true },
    ],
    [
      { id: 'new', label: 'New value', select: ['On', 'Off'], required: true },
      { id: 'reference', label: 'Reference', placeholder: 'Ticket reference', ro: true },
    ],
    [
      {
        id: 'reason',
        label: 'Reason (20+ characters)',
        required: true,
        value: 'Planned database upgrade on Sunday night',
      },
      { id: 'when', label: 'When', value: 'Scheduled · Sun 25 Oct, 01:00', ro: true, tint: true },
    ],
    [
      { id: 'ticket', label: 'Ticket reference', optional: true, value: 'OPS-2207' },
      { id: 'notify', label: 'Notify', optional: true, value: 'All Senior Admins', ro: true },
    ],
  ],
  tell: 'Show a banner to users 24 hours before',
  allowed: 'You can roll back from the history',
  cancelLink: 'Cancel change',
  cancel: 'Cancel',
  primary: 'Schedule change',
};
