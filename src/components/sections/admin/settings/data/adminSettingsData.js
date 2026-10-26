/*
 * adminSettingsData — copy of the Staff, roles and platform-settings screens (Figma canvas 8520:12, section 7.5.1-7.5.2: 7.5.1a Staff accounts 8639:8, 7.5.1b Create a staff
 * account 8639:540, 7.5.1c Deactivate 8639:1034, 7.5.1d Last Super Admin blocked 8639:1538, 7.5.1e Roles and permissions 8639:2083, 7.5.2a Feature flags and integrations
 * 8639:2677, 7.5.2b Change a setting 8639:3123, 7.5.2c Feature in use warning 8639:3855). Strings copied from the Figma node text. ⚠️ ASSUMPTION: frontend only, fixed sample staff.
 * Figma quirk kept: the settings nav lists "Notification templates" before "Roles and permissions" only in the Roles frame (NAV_ROLES).
 */

const BASE = [
  { id: 'overview', label: 'Overview', icon: 'user', to: '/admin/settings/overview' },
  { id: 'roles', label: 'Roles and permissions', icon: 'shield', to: '/admin/settings/roles' },
  {
    id: 'organisations',
    label: 'Organisations and tenants',
    icon: 'globe',
    to: '/admin/settings/organisations',
  },
  {
    id: 'notifications',
    label: 'System notifications',
    icon: 'bell',
    to: '/admin/settings/notifications',
  },
  { id: 'templates', label: 'Message templates', icon: 'bell', to: '/admin/comms/templates' },
  { id: 'reference', label: 'Reference data', icon: 'folder', to: '/admin/settings/reference' },
  {
    id: 'onboarding',
    label: 'Onboarding templates',
    icon: 'folder',
    to: '/admin/settings/onboarding',
  },
  { id: 'observability', label: 'Observability', icon: 'sliders', to: '/admin/observability' },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: 'sliders',
    to: '/admin/settings/accessibility',
  },
  { id: 'flags', label: 'Feature flags', icon: 'sliders', to: '/admin/settings#feature_flag' },
  { id: 'integrations', label: 'Integrations', icon: 'globe', to: '/admin/settings#integration' },
  { id: 'security', label: 'Security', icon: 'lock', to: '/admin/settings/security' },
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

export const SUBTITLE_PLATFORM =
  'Platform configuration. Super Admins only. Every change needs a reason and is logged.';

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
