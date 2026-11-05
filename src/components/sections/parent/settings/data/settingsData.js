/*
 * Copy and mock data of the parent Settings flow (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 11 Settings and account" 10057:67440, persona Emma Mensah).
 * Every string is verbatim from the Figma `characters` (curly quotes and the double space in CLOSED_COPY.body included).
 */

export const PAGE = {
  title: 'Settings',
  subtitle: 'Manage your account, privacy and how GTH works for you.',
};

// Settings nav (PS-01 "Settings nav"). `undrawn`: the canvas has no Accessibility / Language and data screen for the parent, so those two only log.
export const NAV = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'roles', label: 'Your roles', icon: 'users' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'accessibility', label: 'Accessibility', icon: 'sliders', undrawn: true },
  { id: 'language', label: 'Language and data', icon: 'globe', undrawn: true },
  { id: 'security', label: 'Security and sign-in', icon: 'lock' },
  { id: 'data', label: 'Data and account', icon: 'folder' },
];

export const TAB_IDS = ['account', 'roles', 'notifications', 'security', 'data'];

/* ---------------- PS-01 Account ---------------- */
export const ACCOUNT = {
  personal: { title: 'Personal details', desc: 'This is how you appear to your wards and to GTH.' },
  fields: [
    { id: 'fullName', label: 'Full name', value: 'Emma Mensah', autoComplete: 'name' },
    {
      id: 'email',
      label: 'Email',
      value: 'emma.mensah@gmail.com',
      type: 'email',
      autoComplete: 'email',
      verified: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      value: '+233 24 555 0192',
      type: 'tel',
      autoComplete: 'tel',
      verified: true,
    },
    { id: 'dob', label: 'Date of birth', value: '08 / 02 / 1984', autoComplete: 'bday' },
    { id: 'region', label: 'Region', value: 'Greater Accra', autoComplete: 'address-level1' },
    { id: 'city', label: 'City or town', value: 'Accra · Ayawaso', autoComplete: 'address-level2' },
  ],
  type: {
    title: 'Account type',
    role: 'Parent · mother of Abena and Elliot',
    roleDesc: 'You also have a career profile. Manage both in Your roles.',
    roleLink: 'Your roles',
    photo: 'Profile photo',
    photoDesc: 'Your wards see this photo when they link with you.',
    photoCta: 'Change photo',
  },
  cancel: 'Cancel',
  save: 'Save changes',
};

/* ---------------- PS-02 Your roles ---------------- */
export const ROLES = {
  open: {
    title: 'When I sign in, open',
    desc: 'You can switch any time from your profile card.',
    options: [
      {
        id: 'parent',
        title: 'Parent view',
        chip: 'Now',
        desc: 'Opens on your wards, approvals and notifications.',
      },
      { id: 'career', title: 'My career', desc: 'Opens on your own talent home and matches.' },
      { id: 'last', title: 'The space I used last', desc: 'Picks up where you left off.' },
      { id: 'ask', title: 'Ask me each time', desc: 'Shows the switch menu after you sign in.' },
    ],
  },
  separate: {
    title: 'Keep your spaces separate',
    rows: [
      {
        id: 'hideParent',
        title: 'Hide that I’m a parent on my career profile',
        desc: 'Recruiters never see your wards. This also hides the word “parent”.',
        on: true,
      },
      {
        id: 'careerUpdates',
        title: 'Show career updates in Parent view',
        desc: 'A small count on the switch menu, like “2 new”.',
        on: false,
      },
      {
        id: 'approvalsInCareer',
        title: 'Show ward approvals in My career',
        desc: 'Approvals also reach you by WhatsApp and SMS.',
        on: true,
      },
      {
        id: 'learningToo',
        title: 'Let my wards see I’m learning too',
        desc: 'They see a small “Mum is learning too” card on their home.',
        on: true,
      },
    ],
  },
  wards: {
    title: 'Wards linked to you',
    desc: 'Each ward has their own controls. Changes for one don’t affect the other.',
    row: '2 linked · 1 pending',
    rowDesc: 'Abena Mensah · Daughter, 16 · Elliot Mensah · Son, 15',
    cta: 'Manage',
  },
};

/* ---------------- PS-03 Notifications ---------------- */
export const NOTIFICATIONS = {
  matrix: {
    title: 'What we tell you about',
    desc: 'Pick where each update reaches you. SMS and WhatsApp may use a little data or airtime.',
    update: 'Update',
    channels: ['In GTH', 'Email', 'SMS', 'WhatsApp'],
    rows: [
      {
        id: 'approvals',
        title: 'Approvals needed',
        desc: 'Certificates, teacher evaluations and payments over your limit.',
        on: [true, true, false, true],
      },
      {
        id: 'milestones',
        title: 'Milestones your wards share',
        desc: 'Badges, finished courses and other wins they send you.',
        on: [true, true, true, true],
      },
      {
        id: 'flags',
        title: 'Flags and corrections',
        desc: 'When a ward fixes something you flagged.',
        on: [true, true, true, true],
      },
      {
        id: 'activity',
        title: 'Ward activity',
        desc: 'Assessments, courses and clubs they join.',
        on: [true, false, false, false],
      },
      {
        id: 'links',
        title: 'Link requests',
        desc: 'A child asks to link with you, or accepts your request.',
        on: [true, true, false, false],
      },
      {
        id: 'turning18',
        title: 'Turning 18',
        desc: 'A month before a ward turns 18.',
        on: [true, false, false, false],
      },
      {
        id: 'news',
        title: 'News from GTH',
        desc: 'New features and events. About once a month.',
        on: [false, true, false, false],
      },
    ],
  },
  quiet: {
    title: 'Quiet hours',
    desc: 'We hold everything except payment approvals until quiet hours end.',
    row: 'Quiet hours on',
    rowDesc: 'Every day',
    from: '10:00 pm',
    to: '7:00 am',
    toWord: 'to',
  },
  weekly: {
    title: 'Weekly summary',
    row: 'Your wards’ week',
    rowDesc: 'What Abena and Elliot did this week, every Sunday at 6 pm on WhatsApp.',
  },
  pauseAll: 'Turn everything off for 24 hours',
  save: 'Save changes',
};

/* ---------------- PS-04 Security and sign-in ---------------- */
export const SECURITY = {
  signIn: {
    title: 'Sign-in',
    password: { title: 'Password', desc: 'Last changed 3 months ago.', cta: 'Change password' },
    twoStep: {
      title: 'Two-step verification',
      chip: 'On',
      desc: 'We text a 6-digit code to +233 24 ••• 0192 when you sign in on a new device.',
    },
    google: { title: 'Sign in with Google', email: 'emma.mensah@gmail.com', cta: 'Disconnect' },
  },
  devices: {
    title: 'Where you are logged in',
    desc: 'If you do not recognise a device, log it out and change your password.',
    thisDevice: 'This device',
    logOut: 'Log out',
    logOutAll: 'Log out of all other devices',
    list: [
      {
        id: 'chrome',
        kind: 'laptop',
        name: 'Chrome on Windows',
        meta: 'Accra · active now',
        current: true,
      },
      { id: 'android', kind: 'mobile', name: 'GTH app on Android', meta: 'Accra · 2 days ago' },
      { id: 'ipad', kind: 'tablet', name: 'Safari on iPad', meta: 'Accra · 3 weeks ago' },
    ],
  },
};

/* ---------------- PS-05 Data and account ---------------- */
export const DATA = {
  yourData: {
    title: 'Your data',
    desc: 'You own it. Download a copy any time.',
    download: {
      title: 'Download my data',
      desc: 'Your details, approvals, flags and the evaluations you wrote, as a ZIP. Ready within 24 hours.',
      cta: 'Request download',
    },
    report: {
      title: 'Ward progress report',
      desc: 'A PDF of each ward’s progress this term, for school meetings.',
      cta: 'Download PDF',
    },
  },
  pause: {
    title: 'Take a break',
    row: 'Pause non-urgent notifications',
    desc: 'We stop everything except payment approvals for up to 30 days.',
  },
  close: {
    title: 'Close my parent account',
    desc: 'Your wards keep their accounts and data. Your flags and evaluations stay on their profiles.',
    row: 'Opt-outs you set are lifted and your wards are told. My career is not affected.',
    rowDesc: 'Download your data first if you want to keep a copy.',
    cta: 'Close parent account',
  },
};

/* ---------------- PS-06 Log out (confirm) / PS-06b Logged out ---------------- */
export const LOGOUT = {
  title: 'Log out of GTH?',
  body: 'You’ll still get approval messages on WhatsApp and SMS, so nothing is missed.',
  stay: 'Stay',
  confirm: 'Log out',
};

export const LOGGED_OUT = {
  page: 'You’re logged out',
  title: 'See you soon, Emma',
  body: 'Approvals will still reach you on WhatsApp and SMS. Log back in any time to see your wards.',
  cta: 'Log in again',
};

/* ---------------- PS-07 Close parent account (confirm) / PS-07b Parent account closed ---------------- */
export const CLOSE = {
  title: 'Close your parent account?',
  intro: 'Abena and Elliot keep their accounts. Here’s what happens.',
  points: [
    'Your link to both wards ends, and they’re told.',
    'Payments over the limit go to a GTH safety reviewer instead of you.',
    'Evaluations you wrote stay on their profiles.',
    'My career stays open. Close it separately if you want.',
  ],
  label: 'Type CLOSE to confirm',
  word: 'CLOSE',
  keep: 'Keep my account',
  confirm: 'Close parent account',
};

export const CLOSED = {
  page: 'Parent account closed',
  title: 'Your parent account is closed',
  body: 'Abena and Elliot were told and keep their accounts. You have 30 days to change your mind  log in and we’ll restore your links.',
  career: 'Go to My career',
  undo: 'Undo within 30 days',
};
