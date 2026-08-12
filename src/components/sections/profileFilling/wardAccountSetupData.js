/*
 * wardAccountSetupData.js — Parent Career Buddy ward-account setup copy
 * (Figma 5132:80134 details / 5132:80489 password / 5132:80762 success).
 */

export const WARD_SETUP_DETAILS = {
  titleBefore: "Let's set up your ",
  titleAccent: 'ward’s ',
  titleAfter: 'account.',
  subtitle:
    "We noticed your ward's account hasn't been initialized yet — let's fill in their details to get started.",
  autosave: 'Your progress is saved automatically',
  nextCta: 'Next',
};

export const WARD_SETUP_PASSWORD = {
  titleBefore: 'Set a password for your ',
  titleAccent: 'ward’s ',
  titleAfter: 'account.',
  subtitle:
    'This lets your ward log in on their own — choose something you can share with them securely.',
  createCta: "Create Ward's Account",
  laterCta: "I'll do this later",
  passwordPlaceholder: '••••••••••',
  confirmPlaceholder: 'Confirm ward’s password',
};

export const WARD_SETUP_SUCCESS_TOAST = {
  title: "Congratulations, your ward's account has been created successfully",
};

export const WARD_SETUP_PLACEHOLDERS = {
  otherNames: 'e.g. “Kwesi”',
  phone: 'Enter ward’s phone number',
  address: 'e.g. Tema community 22 st.53',
  gender: 'Select Gender',
};

export const WARD_GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not', label: 'Prefer not to say' },
];

export const WARD_COUNTRY_CODE_OPTIONS = [{ value: '+233', label: '+233' }];

export const WARD_GHANA_CARD_MAX_BYTES = 5 * 1024 * 1024;

/** Demo defaults matching Figma filled state (5132:80134). */
export function emptyWardSetupForm() {
  return {
    firstName: 'Elliot',
    lastName: 'Whitmore',
    otherNames: '',
    dobDay: '23',
    dobMonth: '9',
    dobYear: '2004',
    email: 'elliotwhitmore@gmail.com',
    countryCode: '+233',
    phone: '',
    address: '',
    gender: '',
    ghanaFrontName: '',
    ghanaBackName: '',
    password: '',
    confirmPassword: '',
  };
}

export function isWardDetailsComplete(form) {
  return Boolean(
    form.firstName?.trim() &&
    form.lastName?.trim() &&
    form.dobDay?.trim() &&
    form.dobMonth &&
    form.dobYear?.trim() &&
    form.email?.trim() &&
    form.phone?.trim() &&
    form.address?.trim() &&
    form.gender &&
    form.ghanaFrontName &&
    form.ghanaBackName
  );
}

export function isWardPasswordComplete(form) {
  return Boolean(form.password?.length >= 8 && form.password === form.confirmPassword);
}
