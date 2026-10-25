/*
 * adminAccountDetailData — copy of the account detail screens (Figma canvas 8520:12, frames 7.1.2a Talent 8623:1242, 7.1.2b Minor 8623:2039, 7.1.2c Super Admin
 * unmasked 8640:418285, 7.1.3a-d suspend / suspended / reactivate / second approval, 7.1.4a delete, 7.1.6a-b override). ⚠️ ASSUMPTION: frontend only, one sample
 * account (Kofi Agyekum, TAL-204-8812); the profile body (About, Top skills, Experience, Portfolio, Badges) is the talent profile demo content.
 */

export const ACCOUNT = {
  id: 'TAL-204-8812',
  name: 'Kofi Agyekum',
  firstName: 'Kofi',
  verified: 'Verified',
  handle: 'he/him · joined Jul 2026',
  headline: 'Aspiring Data Analyst · BSc Statistics, KNUST · Accra, Ghana',
  chips: [
    { label: 'Open to programmes', icon: 'target', tone: 'green' },
    { label: 'Accra · Hybrid or remote', icon: 'pin', tone: 'white' },
    { label: 'English · Twi', icon: 'lang', tone: 'white' },
  ],
  stats: [
    { value: '5', label: 'verified skills' },
    { value: '24', label: 'endorsements' },
    { value: 'Oct 2026', label: 'last active' },
  ],
  sticker: 'Staff view',
  tabs: [
    { key: 'overview', label: 'Overview' },
    { key: 'skills', label: 'Skills', count: '7' },
    { key: 'experience', label: 'Experience', count: '2' },
    { key: 'portfolio', label: 'Portfolio', count: '3' },
    { key: 'certs', label: 'Certs', count: '2' },
    { key: 'about', label: 'About me' },
  ],
};

/* per view: the dark bar, the cover chip and the rail text */
export const VIEWS = {
  talent: {
    bar: {
      title: 'Kofi Agyekum · account TAL-204-8812',
      sub: 'Talent · active · joined 4 Jul 2026 · last active today 09:14. Ghana Card shows as GHA-•••••••••-3 for your role.',
    },
    cover: 'Open to programmes',
    railText:
      'Every action needs a reason and is logged under your name. Suspend, override and merge need Senior Admin or above.',
  },
  minor: {
    bar: {
      title: 'Minor account · Kofi is 17',
      sub: 'Every action on this account notifies his linked parent, Mrs Akosua Agyekum. Contact details stay masked.',
    },
    cover: 'Under 18 · parent-linked',
    railText: 'Parent · Mrs Akosua Agyekum · a•••@gmail.com · linked 4 Jul 2026 · opt-out off',
  },
  suspended: {
    bar: {
      title: 'Kofi Agyekum · account TAL-204-8812',
      sub: 'Talent · active · joined 4 Jul 2026 · last active today 09:14. Ghana Card shows as GHA-•••••••••-3 for your role.',
    },
    cover: 'Suspended',
    railText:
      'Every action needs a reason and is logged under your name. Suspend, override and merge need Senior Admin or above.',
  },
};

export const RECORD = {
  title: 'Account record',
  rows: [
    { icon: 'shield', text: 'Ghana Card · GHA-•••••••••-3' },
    { icon: 'target', text: 'Email · k•••@gmail.com · verified' },
    { icon: 'file', text: 'Phone · +233 •• ••• 4471' },
    { icon: 'voice', text: 'Sign-in · 2-step on · 3 devices' },
    { icon: 'phone', text: 'Flags · 0 in 30 days' },
    { icon: 'wallet', text: 'Admin history · 1 override (Aug)' },
  ],
  link: 'View full activity →',
};

/* The "Admin actions" menu (⚠️ ASSUMPTION: not drawn; it lists the flows Figma draws as dialogs). `minRole`: the lowest role that sees it enabled. */
export const ACTIONS = [
  { id: 'message', label: 'Message user', note: 'Support Agent and above' },
  { id: 'suspend', label: 'Suspend account…', note: 'Senior Admin or above' },
  { id: 'override', label: 'Override a profile field…', note: 'Senior Admin or above' },
  { id: 'merge', label: 'Merge duplicate accounts…', note: 'Senior Admin or above' },
  { id: 'delete', label: 'Permanently delete…', note: 'Super Admin only' },
];

export const SUSPEND = {
  title: 'Suspend Kofi Agyekum’s account?',
  happens: [
    'He’s signed out on every device right away',
    'His profile is hidden from partners and recruiters',
    '2 open applications pause',
    'He gets an email with your reason',
  ],
  info: '7 days, 30 days or indefinite. Indefinite needs a second approver.',
  durations: ['7 days', '30 days', 'Indefinite'],
  reasonPlaceholder: 'Repeated harassment in messages · FL-2291',
  cancel: 'Cancel',
};

export const SECOND_APPROVAL = {
  title: 'Send for a second approval?',
  body: 'Indefinite suspensions need a second Senior Admin. Kofi stays active until Kwame Owusu or another Senior Admin approves. You’ll be notified.',
  primary: 'Send for approval',
  secondary: 'Back',
};

export const REACTIVATE = {
  title: 'Reactivate Kofi’s account?',
  body: 'He can sign in again straight away and gets an email. The suspension stays in his admin history.',
  primary: 'Reactivate',
  secondary: 'Cancel',
};

export const DELETE = {
  title: 'Permanently delete Kofi Agyekum’s account?',
  happens: [
    'Name, photo, Ghana Card, phone, email and address are purged',
    '2 open applications are withdrawn automatically',
    'A record without personal data is kept: ID, date, reason, approvers',
    'This can’t be undone',
  ],
  info: 'Needs a second Super Admin. If a legal hold applies, data is pseudonymised instead.',
  confirmLabel: 'Type the full name to confirm',
  approverLabel: 'Second approver',
  approvers: ['Kwame Owusu · Super Admin'],
  cancel: 'Cancel',
  submit: 'Send to second approver',
};

export const OVERRIDE = {
  chip: 'Override a profile field',
  title: 'Date of birth',
  sub: 'Use this only to correct a mistake. The old value is archived and the change is logged under your name.',
  file: {
    title: 'Kofi Agyekum · TAL-204-8812',
    meta: 'Overrides on this account: 1 (Aug)',
    action: 'View history',
  },
  fields: {
    field: 'Date of birth',
    current: '14 / 03 / 2007',
    newValue: '14 / 03 / 2004',
    document: 'Birth certificate · upload',
    reason: 'Birth certificate shows 2004',
    effective: 'Immediately',
    ticket: 'SUP-10442',
    notify: 'Email + in-platform',
  },
  tell: 'Tell the user what changed and why',
  allowed: 'This field can be overridden by Senior Admins',
  cancelOverride: 'Cancel override',
  cancel: 'Cancel',
  review: 'Review change',
};

export const RECLASSIFY = {
  title: 'This makes Kofi an adult account',
  body: 'Changing date of birth from 14 Mar 2007 to 14 Mar 2004 reclassifies the account from MINOR to ADULT. Parent links end and access changes right away. His parent is told.',
  primary: 'Confirm change',
  secondary: 'Cancel',
};
