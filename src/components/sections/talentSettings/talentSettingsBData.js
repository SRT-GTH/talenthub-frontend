/*
 * Mock data + verbatim copy for the Settings-B pages (Language and data, Security and sign-in,
 * Data and account, Parent or guardian, Appearance). Every string is copied from the Figma
 * `characters` of the frames listed in wiki/talent-settings.md. Frontend-only — swap for an API later.
 */

// ---- ST-05 Language and data ------------------------------------------------------------------
export const LANGUAGES = [
  { id: 'en', name: 'English (Ghana)', native: 'Default', beta: false },
  { id: 'tw', name: 'Twi', native: 'Akan kasa', beta: true },
  { id: 'ga', name: 'Ga', native: 'Gã wiemɔ', beta: true },
  { id: 'ee', name: 'Ewe', native: 'Eʋegbe', beta: true },
  { id: 'dag', name: 'Dagbani', native: 'Dagbanli', beta: true },
  { id: 'ha', name: 'Hausa', native: 'Harshen Hausa', beta: true },
];

export const VIDEO_OPTIONS = ['Ask first', 'Always', 'Never'];

export const LANGUAGE_COPY = {
  appLanguage: {
    title: 'App language',
    description:
      'Career Buddy replies in this language too. Beta languages are checked by native speakers.',
    beta: 'Beta',
  },
  lightOnData: {
    title: 'Light on data',
    description: 'For slow networks and small data bundles.',
    dataSaver: {
      title: 'Data saver',
      chip: 'Saves about 60%',
      description: 'Smaller images, no autoplay and fewer background updates.',
    },
    wifiOnly: {
      title: 'Load photos on Wi-Fi only',
      description: 'Shows a tap-to-load placeholder on mobile data.',
    },
    videos: { title: 'Videos', description: 'Pitch videos and course lessons.' },
  },
  formats: {
    title: 'Formats',
    currency: {
      title: 'Currency',
      description: 'Salaries and stipends.',
      value: 'GH₵ Ghana cedi',
    },
    dateFormat: {
      title: 'Date format',
      description: 'Today shows as 15/10/2026.',
      value: 'DD/MM/YYYY',
    },
  },
  save: 'Save changes',
};

export const LANGUAGE_DEFAULTS = {
  language: 'en',
  dataSaver: true,
  wifiOnly: false,
  videos: 'Ask first',
};

// ---- ST-06 Security and sign-in ---------------------------------------------------------------
export const DEVICES = [
  {
    id: 'chrome-windows',
    name: 'Chrome on Windows',
    meta: 'Accra · active now',
    kind: 'laptop',
    thisDevice: true,
  },
  {
    id: 'gth-android',
    name: 'GTH app on Android',
    meta: 'Kumasi · 2 days ago',
    kind: 'mobile',
    thisDevice: false,
  },
  {
    id: 'safari-ipad',
    name: 'Safari on iPad',
    meta: 'Accra · 3 weeks ago',
    kind: 'tablet',
    thisDevice: false,
  },
];

export const SECURITY_COPY = {
  signIn: {
    title: 'Sign-in',
    password: {
      title: 'Password',
      description: 'Last changed 3 months ago.',
      cta: 'Change password',
    },
    twoStep: {
      title: 'Two-step verification',
      chip: 'On',
      description: 'We text a 6-digit code to +233 24 ••• 3456 when you sign in on a new device.',
    },
    google: { title: 'Sign in with Google', email: 'kofi.agyekum@gmail.com', cta: 'Disconnect' },
  },
  devices: {
    title: 'Where you are logged in',
    description: 'If you do not recognise a device, log it out and change your password.',
    thisDevice: 'This device',
    logOut: 'Log out',
    logOutAll: 'Log out of all other devices',
  },
};

export const PASSWORD_COPY = {
  title: 'Change password',
  current: 'Current password',
  next: 'New password',
  confirm: 'Confirm new password',
  logOutOthers: 'Log out of my other devices',
  cancel: 'Cancel',
  submit: 'Update password',
  strong: 'Strong',
  rules: {
    length: 'At least 8 characters',
    symbol: 'A number or symbol',
    different: 'Not the same as your old password',
  },
};

// Seed values for `?state=password` (the Figma frame draws 10 / 12 / 12 masked characters).
export const PASSWORD_SEED = {
  current: 'gth@kofi24',
  next: 'gth@kofi2026',
  confirm: 'gth@kofi2026',
};

export const TWO_STEP_COPY = {
  title: 'Enter the 6-digit code',
  body: 'We sent it by SMS to +233 24 ••• 3456. It expires in 10 minutes.',
  didNotGet: 'Did not get it?',
  resend: 'Resend in',
  another: 'Use another way',
  verify: 'Verify',
};
export const TWO_STEP_SEED = '4829';
export const TWO_STEP_RESEND_SECONDS = 42;

export const DEVICE_TOAST = (deviceName) => ({
  title: `Logged out of ${deviceName}`,
  body: 'That device will need your password to get back in.',
});

// ---- ST-07 Data and account -------------------------------------------------------------------
export const DATA_COPY = {
  yourData: {
    title: 'Your data',
    description: 'You own it. Download a copy any time.',
    download: {
      title: 'Download my data',
      description:
        'Profile, applications, messages and Skills Lab results as a ZIP. Ready in about 10 minutes; we email you a link.',
      cta: 'Request download',
    },
    pdf: {
      title: 'Verified skills PDF',
      description: 'A one-page summary for schools and scholarship forms.',
      cta: 'Download PDF',
    },
  },
  takeABreak: {
    title: 'Take a break',
    pause: {
      title: 'Pause my profile',
      description:
        'Recruiters cannot find you while paused. Your streak freezes too. Come back any time.',
    },
  },
  paused: {
    title: 'Your profile is paused',
    description: 'Recruiters cannot find you and your 12-day streak is frozen. Unpause any time.',
    cta: 'Unpause',
  },
  danger: {
    title: 'Delete account',
    description:
      'This permanently removes your profile, applications and messages after 30 days. You can cancel within those 30 days by logging back in.',
    rowTitle: 'Verified skills and certificates are deleted too.',
    rowDescription: 'Download your data first if you want to keep a copy.',
    cta: 'Delete my account',
  },
};

export const DOWNLOAD_TOAST = {
  title: 'Download requested',
  body: 'We will email kofi.agyekum@gmail.com in about 10 minutes.',
};

export const DELETE_COPY = {
  title: 'Delete your account?',
  intro: 'After 30 days we permanently delete:',
  // Focused says "pts", Playful says "XP" (Figma ST-10 Focused 8110:52950 / Playful 7845:15045).
  items: [
    'Your profile, avatar and pitch video',
    '4 applications and all your messages',
    '3 Verified skills and 2 certificates',
  ],
  streakFocused: 'Your 12-day streak and 1,240 pts',
  streakPlayful: 'Your 12-day streak and 1,240 XP',
  info: 'Changed your mind? Log back in within 30 days and everything comes back.',
  confirmLabel: 'Type DELETE to confirm',
  confirmWord: 'DELETE',
  keep: 'Keep my account',
  confirm: 'Delete my account',
};

// ---- ST-08 Parent or guardian -----------------------------------------------------------------
export const GUARDIAN_COPY = {
  subtitle:
    'Shown to talents under 18. Your parent or guardian is kept informed and can opt you out.',
  example: 'Example for Ama, 16, SHS 2 in Kumasi. Talents 18 and over do not see this section.',
  linked: {
    title: 'Linked parent or guardian',
    name: 'Akosua Mensah · Mother',
    chip: 'Linked',
    meta: '+233 20 ••• 7781 · gets SMS approvals',
    change: 'Change',
  },
  invite: {
    title: 'Link a parent or guardian',
    description:
      'Talents under 18 need a parent or guardian before recruiters can contact them. They get a text and approve with one tap. No app needed.',
    nameLabel: 'Their name',
    phoneLabel: 'Phone number',
    cta: 'Send invite',
    note: 'They have 7 days to say yes.',
  },
  approves: {
    title: 'What your guardian can do',
    description: 'Your account works now. Your guardian is told and can step in.',
    certificates: {
      title: 'Certificates you upload',
      description: 'Your guardian checks them before they show on your profile.',
      chip: 'Always on',
    },
    wallet: {
      title: 'Starter wallet payments',
      description: 'Payments over GHS 50 need your guardian’s OK.',
    },
    flags: {
      title: 'Flags and opt-out',
      description:
        'They can flag details for you to fix, or pause your account. Never your messages.',
    },
  },
  turning18: {
    title: 'Turning 18',
    rowTitle: 'These controls end on your 18th birthday',
    rowDescription:
      'We will remind you both a week before. You can keep your guardian linked if you like.',
  },
};
export const RELATIONS = ['Mother', 'Father', 'Guardian', 'Other'];
export const INVITE_SEED = { name: 'Akosua Mensah', phone: '+233 20 123 7781', relation: 'Mother' };

// ---- ST-09 Appearance -------------------------------------------------------------------------
export const APPEARANCE_COPY = {
  style: {
    title: 'Style',
    description: 'Pick how GTH looks. Your jobs, profile and progress stay exactly the same.',
    playful: {
      id: 'playful',
      label: 'Playful',
      description: 'Stickers, bold cards, XP and celebrations. The full Gen Z vibe.',
    },
    focused: {
      id: 'focused',
      label: 'Focused',
      description: 'Calm cards, no stickers, points instead of XP. Good for work hours.',
    },
  },
  celebrations: {
    title: 'Celebrations',
    stickers: {
      title: 'Stickers and doodles',
      description: 'Show playful stickers on cards and headings.',
    },
    xp: {
      title: 'Show progress as XP',
      description: 'Turn off to show points instead. Your progress stays the same.',
    },
    popups: {
      title: 'Celebration pop-ups',
      description: 'Confetti and pop-ups when you finish a stage or win a game.',
    },
  },
  switching: {
    title: 'Switching',
    workHours: {
      title: 'Focused during work hours',
      description: 'Switch to Focused on weekdays, 9am to 5pm. Playful the rest of the time.',
      options: ['Off', 'Weekdays', 'Always'],
    },
    sync: {
      title: 'Same style on all my devices',
      description: 'Your choice syncs to the phone app too.',
    },
  },
  preview: {
    label: 'PREVIEW',
    chip: 'Updates as you change',
    jobTitle: 'Data Analyst Intern',
    company: 'MTN Ghana · Accra · On-site',
    match: 'You match 94% of what this team is looking for.',
    link: 'Read the full post',
    listen: 'Listen',
    tip: 'Shortcut: the Playful / Focused switch in the top bar changes this from any page.',
  },
  reset: 'Reset to default',
  save: 'Save changes',
};
export const APPEARANCE_DEFAULTS = {
  stickers: true,
  xp: true,
  popups: true,
  workHours: 'Weekdays',
  sync: true,
};
