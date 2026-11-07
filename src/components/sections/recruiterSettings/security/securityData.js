/*
 * Recruiter Settings & Account - Security, Language and data, profile menu, log out and logged out (Figma "Recruiter - Settings & Account" 10161:75722).
 * All copy is VERBATIM from the frame nodes' `characters` (SR-13 10161:81691, SR-23 10161:84939, SR-24 10161:85278, SR-25 10161:85618, SR-26 10161:85946, SR-17 10161:83001,
 * SR-18 10161:83309, SR-14 10161:82623, SR-16 10161:82353, SR-27 10161:86281). Mock data only, shaped like a future API payload.
 *
 * URL contract (on /recruiter/settings, see recruiterSettingsState.js; every frame reproduces from a fresh load):
 *   ?tab=security                                 SR-13
 *   ?tab=security&modal=change-password           SR-23 (the three fields are seeded as drawn; the checkbox is ticked)
 *   ?tab=security&modal=two-step                  SR-24 (code 4 8 2 9 seeded as drawn, Verify disabled until six digits)
 *   ?tab=security&toast=device-logged-out         SR-25 (the toast about Windows . Edge; the rows stay as drawn)
 *   ?tab=security&removed=<device id>[,<id>]      the rows that were logged out (set when "Log out" is pressed on a row)
 *   ?tab=security&modal=delete-account[&confirm=DELETE]   SR-26 (the typed word is in the URL, like the parent "Close account" dialog)
 *   ?tab=language                                 SR-17
 *   ?tab=language&toast=export-requested          SR-18
 *   ?menu=open                                    SR-14 (the profile menu, any tab)
 *   ?modal=logout                                 SR-16 (any tab)
 *   ?state=logged-out                             SR-27 (rendered instead of the shell)
 * Keys other builders own and that the profile menu only sets: ?modal=feedback, ?modal=invite, ?help=page.
 */

export const SECURITY_COPY = {
  signIn: {
    title: 'Sign-in',
    password: {
      title: 'Password',
      description: 'Last changed 3 months ago',
      cta: 'Change password',
    },
    twoStep: {
      title: 'Two-step verification',
      description: 'Required for Admins · code by SMS to •••• 3456',
      chip: 'On',
      manage: 'Manage',
    },
    sso: {
      title: 'Single sign-on (Google Workspace)',
      description: 'silverrock.tech',
    },
  },
  devices: {
    title: 'Where you’re signed in',
    thisDevice: 'This device',
    logOut: 'Log out',
  },
  danger: {
    title: 'Danger zone',
    leave: {
      title: 'Leave Silver Rock Technology',
      description: 'You’ll lose access to its jobs and candidates',
      cta: 'Leave organisation',
    },
    delete: {
      title: 'Delete my recruiter account',
      description: 'Your team keeps the jobs and candidate history',
      cta: 'Delete account',
    },
  },
};

// "Where you’re signed in": the three rows of SR-13. `city` is the part of the meta line before " · " (the toast repeats it).
export const DEVICES = [
  {
    id: 'macbook-chrome',
    name: 'MacBook Pro · Chrome',
    city: 'Accra',
    meta: 'Accra · now',
    current: true,
  },
  {
    id: 'iphone-gth-app',
    name: 'iPhone 14 · GTH app',
    city: 'Accra',
    meta: 'Accra · 2 hours ago',
    current: false,
  },
  {
    id: 'windows-edge',
    name: 'Windows · Edge',
    city: 'Kumasi',
    meta: 'Kumasi · 5 days ago',
    current: false,
  },
];

// SR-25 toast: drawn for "Windows · Edge" (Kumasi).
export const DEVICE_TOAST_DEFAULT_ID = 'windows-edge';
export const deviceToast = (device) => ({
  title: `Success - Logged out of ${device.name}`,
  message: `${device.city} · that device needs to sign in again`,
});

// SR-23 "Change password". The three values are the dots of the frame (10 / 12 / 12 characters); a ⚠️ ASSUMPTION of strings that satisfy the drawn "Strong" state.
export const PASSWORD_COPY = {
  title: 'Change password',
  subtitle: 'You’ll stay signed in on this device.',
  current: 'Current password',
  next: 'New password',
  confirm: 'Confirm new password',
  strong: 'Strong · 12+ characters with a number and symbol',
  // ⚠️ ASSUMPTION (not drawn): the helper line while the new password is not strong yet, and the mismatch line.
  weak: 'Not strong yet · 12+ characters with a number and symbol',
  mismatch: 'The two passwords don’t match',
  logOutOthers: (count) => `Log out of my other ${count} ${count === 1 ? 'device' : 'devices'}`,
  cancel: 'Cancel',
  submit: 'Update password',
  // ⚠️ ASSUMPTION (not drawn): the toast after "Update password".
  updated: { title: 'Success - Password updated', message: 'Use it next time you log in.' },
};
export const PASSWORD_SEED = {
  current: 'old-pass-1',
  next: 'N3w-Secure#2',
  confirm: 'N3w-Secure#2',
};

// SR-24 "Enter the 6-digit code" (code 4 8 2 9 typed, "Resend code in 0:42", Verify grey).
export const TWO_STEP_COPY = {
  title: 'Enter the 6-digit code',
  body: 'We sent a code to •••• 3456. It expires in 5 minutes.',
  resend: 'Resend code in',
  resendNow: 'Resend code',
  cancel: 'Cancel',
  verify: 'Verify',
};
export const TWO_STEP_SEED = '4829';
export const TWO_STEP_RESEND_SECONDS = 42;
// ⚠️ ASSUMPTION (not drawn): the toast after Verify.
export const TWO_STEP_VERIFIED_TOAST = {
  title: 'Success - Two-step verification confirmed',
  message: 'Codes are sent by SMS to •••• 3456.',
};

// SR-26 "Delete your recruiter account?".
export const DELETE_COPY = {
  title: 'Delete your recruiter account?',
  body: 'Your jobs, pipelines and candidate history stay with Silver Rock Technology. You’ll lose access straight away.',
  banner: {
    title: 'You’re the only Admin',
    body: 'Make someone else an Admin first, or the organisation can’t manage billing or verification.',
    link: 'Go to Team and roles',
  },
  label: 'Type DELETE to confirm',
  word: 'DELETE',
  placeholder: 'DELETE',
  cancel: 'Cancel',
  confirm: 'Delete account',
};

// SR-16 "Log out of GTH?".
export const LOGOUT_COPY = {
  title: 'Log out of GTH?',
  body: 'Your hiring streak and drafts are saved. Candidates can still message you.',
  stay: 'Stay',
  confirm: 'Log out',
};

// SR-27 "Logged out". ⚠️ ASSUMPTION: "Log back in" and "Not Joel? Use a different account" go to /login (no destination is drawn).
export const LOGGED_OUT_COPY = {
  title: 'You’re logged out, Joel.',
  body: 'Your drafts, notes and hiring streak are saved.',
  cta: 'Log back in',
  other: 'Not Joel? Use a different account',
  shared: 'On a shared computer? Close this browser window too.',
};

// SR-17 / SR-18 "Language and data".
export const LANGUAGE_COPY = {
  language: {
    title: 'Language',
    app: { title: 'App language', description: 'Candidates still see jobs in their own language' },
    soon: {
      title: 'Twi, Ga, Ewe, Dagbani, Hausa',
      description: 'Coming soon. We’ll tell you when they’re ready.',
      chip: 'Coming soon',
    },
    assistant: {
      title: 'Hiring Assistant language',
      description: 'Used for reply ideas and summaries',
    },
  },
  data: {
    title: 'Candidate data',
    description: 'You’re responsible for candidate data under Ghana’s Data Protection Act.',
    keep: {
      title: 'Keep candidate data for',
      description: 'After a job closes. Candidates are told when their data is removed.',
    },
    export: {
      title: 'Export candidates',
      description: 'Download applicants and pipeline stages as CSV',
      cta: 'Export CSV',
    },
    download: {
      title: 'Download my data',
      description: 'Your messages, notes and activity as a ZIP',
      cta: 'Request download',
    },
  },
  pause: {
    title: 'Pause hiring',
    description: 'Hide all your jobs from Opportunities without closing them.',
    row: {
      title: 'Pause all hiring at Silver Rock Technology',
      description: 'Candidates already in your pipelines aren’t affected',
      cta: 'Pause hiring',
    },
  },
  exportToast: {
    title: 'Success - Your export is being prepared',
    message: 'We’ll email joel.kofie@silverrock.tech in about 10 minutes',
  },
};

// The dropdown values drawn in SR-17. ⚠️ ASSUMPTION: the other options of each list are not drawn (only the selected value is), so each list holds the drawn value plus the obvious neighbours.
export const APP_LANGUAGE_OPTIONS = [{ value: 'en-GH', label: 'English (Ghana)' }];
export const ASSISTANT_LANGUAGE_OPTIONS = [{ value: 'en', label: 'English' }];
export const RETENTION_OPTIONS = [
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '24', label: '24 months' },
];
export const LANGUAGE_DEFAULTS = { appLanguage: 'en-GH', assistantLanguage: 'en', retention: '12' };

// SR-14 profile menu (recruiter, no mode switch). Mock account shaped for an API.
export const MENU_ACCOUNT = {
  name: 'Kwame Asante',
  email: 'k.asante89@silverrocktech.com',
  strength: 100,
  tier: 'Top Recruiter',
  applicants: 4,
  savedTalents: 3,
  language: 'English (GH)',
  inviteReward: '+50pts',
};
