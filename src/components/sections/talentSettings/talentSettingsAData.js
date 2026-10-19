/*
 * Talent settings · A — mock data (frontend-only; swap for an API later, keep the shapes).
 * Every string / value below is copied verbatim from the Figma frames:
 *   ST-01 Account, ST-01b Email error, ST-02 Profile and privacy, ST-02b Hidden, ST-02c Manage blocked,
 *   ST-03 Notifications, ST-03b Paused, ST-04 Accessibility, ST-09 Unsaved changes, ST-09b Saved toast.
 * (Figma file Bin8roWL8sloyc36IgFMuT, wiki/talent-settings.md has the node ids.)
 */

export const SETTINGS_HEADING = 'Settings';
export const SETTINGS_SUBHEADING = 'Manage your account, privacy and how GTH works for you.';

// Section nav (ST-01 "Settings nav"). `id` is the `/settings/:section` path segment.
export const SETTINGS_NAV = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'privacy', label: 'Profile and privacy', icon: 'shield' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'accessibility', label: 'Accessibility', icon: 'sliders' },
  { id: 'appearance', label: 'Appearance', icon: 'star' },
  { id: 'language', label: 'Language and data', icon: 'globe' },
  { id: 'security', label: 'Security and sign-in', icon: 'lock' },
  { id: 'guardian', label: 'Parent or guardian', icon: 'users', chip: 'Under 18' },
  { id: 'data', label: 'Data and account', icon: 'folder' },
];
export const SETTINGS_LOGOUT_LABEL = 'Log out';

/* ---------------- ST-01 Account ---------------- */
export const ACCOUNT_INTRO = {
  title: 'Personal details',
  desc: 'This is how you appear to recruiters and schools.',
};

// `verified` = the green-bordered inputs in the frame (Email, Phone).
export const ACCOUNT_FIELDS = [
  { id: 'fullName', label: 'Full name', value: 'Kofi Agyekum', type: 'text', autoComplete: 'name' },
  {
    id: 'email',
    label: 'Email',
    value: 'kofi.agyekum@gmail.com',
    type: 'email',
    autoComplete: 'email',
    verified: true,
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+233 24 412 3456',
    type: 'tel',
    autoComplete: 'tel',
    verified: true,
  },
  { id: 'dob', label: 'Date of birth', value: '14 / 03 / 2004', type: 'text' },
  { id: 'region', label: 'Region', value: 'Greater Accra', type: 'text' },
  { id: 'city', label: 'City or town', value: 'Accra', type: 'text' },
];

// ST-01b: the value drawn in the error frame, and its hint line.
export const ACCOUNT_EMAIL_ERROR_VALUE = 'kofi.agyekum@gmail';
export const ACCOUNT_EMAIL_ERROR_HINT = 'Add the end of the email, for example @gmail.com';

export const ACCOUNT_TYPE = {
  title: 'Account type',
  rows: [
    {
      id: 'type',
      title: 'Talent · Tertiary student',
      desc: 'BSc Statistics, KNUST. This decides which labs, courses and roles we show you.',
      link: 'Change',
    },
    {
      id: 'photo',
      title: 'Profile photo',
      desc: 'Recruiters see your avatar until you add a photo.',
      button: 'Change avatar',
    },
  ],
};
export const ACCOUNT_ACTIONS = { cancel: 'Cancel', save: 'Save changes' };

/* ---------------- ST-02 Profile and privacy ---------------- */
export const PRIVACY_VISIBILITY = {
  title: 'Who can see your profile',
  desc: 'You can change this any time. Recruiters you have applied to can always see your application.',
  options: [
    {
      id: 'verified',
      title: 'Verified recruiters only',
      chip: 'Recommended',
      desc: 'Recommended. Only companies GTH has checked can find you.',
    },
    {
      id: 'everyone',
      title: 'Everyone on GTH',
      desc: 'Recruiters, schools and other talents can see your public profile.',
    },
    {
      id: 'applied',
      title: 'Only roles I apply to',
      desc: 'You stay hidden from search. Great if you are just exploring.',
    },
    {
      id: 'hidden',
      title: 'Hidden',
      desc: 'Nobody can find you. Your applications still go through.',
    },
  ],
  hiddenWarning: {
    title: 'Recruiters will not find you',
    desc: 'You will stop getting new matches until you change this. Applications you send still go through.',
  },
};

export const PRIVACY_SEE = {
  title: 'What recruiters can see',
  employer: {
    id: 'employer',
    title: 'Hide my profile from my current employer',
    desc: 'We hide you from recruiters at the companies you list here.',
    companies: ['Hubtel'],
    addLabel: 'Add a company',
  },
  toggles: [
    {
      id: 'salary',
      title: 'Show my salary expectations',
      desc: 'Shown as a range, for example GH₵ 4,000 to 6,000 a month.',
    },
    {
      id: 'city',
      title: 'Show my city',
      desc: 'Recruiters see your region either way. Turn this off to hide the city.',
    },
    {
      id: 'message',
      title: 'Let recruiters message me first',
      desc: 'Only verified recruiters. You can block anyone from the chat.',
    },
  ],
  scores: {
    id: 'scores',
    title: 'Show Skills Lab scores',
    desc: 'The Verified badge always shows. This adds the score.',
    link: 'Choose per skill',
  },
  defaults: { employer: true, salary: false, city: true, message: true },
};

export const PRIVACY_BLOCKED = {
  title: 'Blocked recruiters and companies',
  desc: 'They cannot see your profile or message you. They are not told.',
  summary: '2 blocked',
  names: 'Ama Darko · Sample Ventures Ltd',
  manage: 'Manage',
  dialog: {
    title: 'Blocked recruiters and companies',
    desc: 'They cannot see your profile or message you. They are not told.',
    people: [
      { id: 'ama', kind: 'user', name: 'Ama Darko', meta: 'Recruiter · blocked 12 Sep' },
      {
        id: 'sample',
        kind: 'company',
        name: 'Sample Ventures Ltd',
        meta: 'Company · blocked 3 Aug',
      },
    ],
    unblock: 'Unblock',
    add: 'Block someone else',
    done: 'Done',
  },
  unsavedBar: 'You have 1 unsaved change',
  discard: 'Discard',
  save: 'Save changes',
};

/* ---------------- ST-03 Notifications ---------------- */
export const NOTIF_MATRIX = {
  title: 'What we tell you about',
  desc: 'Pick where each update reaches you. SMS and WhatsApp may use a little data or airtime.',
  head: { update: 'Update', channels: ['In GTH', 'Email', 'SMS', 'WhatsApp'] },
  // `on` is [In GTH, Email, SMS, WhatsApp] exactly as drawn.
  rows: [
    {
      id: 'matches',
      title: 'New matches',
      desc: 'Roles that fit your profile and goals.',
      on: [true, true, false, true],
    },
    {
      id: 'recruiter',
      title: 'Recruiter messages',
      desc: 'When a recruiter writes to you.',
      on: [true, true, true, true],
    },
    {
      id: 'applications',
      title: 'Application updates',
      desc: 'Interviews, offers and status changes.',
      on: [true, true, true, true],
    },
    {
      id: 'streak',
      title: 'Streak reminders',
      desc: 'A nudge at 7 pm if you have not done anything today.',
      on: [true, false, false, false],
    },
    {
      id: 'skills',
      title: 'Skills Lab and courses',
      desc: 'New labs, weekly challenges and course reminders.',
      on: [true, true, false, false],
    },
    {
      id: 'community',
      title: 'Community replies',
      desc: 'Replies and mentions in Community.',
      on: [true, false, false, false],
    },
    {
      id: 'news',
      title: 'News from GTH',
      desc: 'New features and events. About once a month.',
      on: [false, true, false, false],
    },
  ],
};

export const NOTIF_QUIET = {
  title: 'Quiet hours',
  desc: 'We hold everything except interview reminders until quiet hours end.',
  rowTitle: 'Quiet hours on',
  rowDesc: 'Every day',
  from: '10:00 pm',
  to: '7:00 am',
  joiner: 'to',
};

export const NOTIF_WEEKLY = {
  title: 'Weekly summary',
  rowTitle: 'Your week on GTH',
  rowDesc: 'Profile views, new matches and your streak, every Sunday at 6 pm by email.',
};

export const NOTIF_ACTIONS = { pause: 'Turn everything off for 24 hours', save: 'Save changes' };

export const NOTIF_PAUSED = {
  title: 'All notifications paused until tomorrow, 8:41 am',
  desc: 'Interview reminders still come through.',
  resume: 'Resume now',
};

/* ---------------- ST-04 Accessibility (+ ST-09 / ST-09b) ---------------- */
export const A11Y_READING = {
  title: 'Reading',
  desc: 'Changes apply across GTH on this account, on every device.',
  textSize: { title: 'Text size', small: 'A', large: 'A' },
  rows: [
    {
      id: 'contrast',
      title: 'High contrast',
      desc: 'Stronger colours and borders. Meets WCAG AAA for text.',
    },
    {
      id: 'dyslexia',
      title: 'Dyslexia-friendly font',
      desc: 'Wider letters and more space between lines.',
    },
    {
      id: 'links',
      title: 'Underline all links',
      desc: 'Makes links easy to spot without relying on colour.',
    },
  ],
};

export const A11Y_MOVEMENT = {
  title: 'Movement and sound',
  rows: [
    {
      id: 'motion',
      title: 'Reduce motion',
      desc: 'Turns off confetti, bouncing stickers and page slides.',
    },
    {
      id: 'aloud',
      title: 'Read aloud',
      desc: 'Adds a Listen button to messages, questions and job posts.',
    },
    {
      id: 'captions',
      title: 'Captions on videos',
      desc: 'Always show captions on pitch videos and courses.',
    },
  ],
};

export const A11Y_QUIZ = {
  title: 'Skills Lab and quizzes',
  extraTime: {
    title: 'Extra time',
    desc: 'More time for each challenge. Recruiters never see this setting.',
    options: ['Off', '1.5×', '2×'],
  },
  keyboard: {
    id: 'keyboard',
    title: 'Keyboard shortcuts',
    desc: 'Press 1 to 4 to pick an answer and Enter to check it.',
  },
};

export const A11Y_PREVIEW = {
  label: 'PREVIEW',
  chip: 'Updates as you change',
  title: 'Data Analyst Intern',
  meta: 'MTN Ghana · Accra · On-site',
  body: 'You match 94% of what this team is looking for.',
  link: 'Read the full post',
  listen: 'Listen',
  tip: 'Shortcut: the accessibility button in the top bar opens these settings from any page.',
};

export const A11Y_ACTIONS = { reset: 'Reset to default', save: 'Save changes' };
export const A11Y_CHANGED = 'Changed';
export const A11Y_TOAST = {
  title: 'Accessibility settings saved',
  body: 'High contrast is on across GTH.',
  undo: 'Undo',
};

// Defaults = ST-04 as drawn. Text size 115 % (chip + slider), Extra time 1.5×.
export const A11Y_DEFAULTS = {
  textSize: 115,
  contrast: false,
  dyslexia: false,
  links: true,
  motion: false,
  aloud: true,
  captions: true,
  extraTime: '1.5×',
  keyboard: true,
};
// Text-size slider range ⚠️ ASSUMPTION: Figma draws 115 % with fill 150px of a 583px track.
export const A11Y_TEXT_MIN = 100;
export const A11Y_TEXT_MAX = 158;
