/*
 * adminAuthData — mock data and copy of the Platform Admin staff sign-in (Figma canvas 8520:12, frames 7.0.1a-d). ⚠️ ASSUMPTION: frontend only, there is no
 * real authentication; the "account" is the staff email's first name part, any non-empty password passes and the 2-step code is the demo code below
 * (never shown in the UI).
 */

export const STAFF_DOMAIN = 'ghanatalenthub.com';
export const SAMPLE_EMAIL = `akua.sarfo@${STAFF_DOMAIN}`;

/** The 2-step code the mock accepts (⚠️ ASSUMPTION: the authenticator app is not simulated). */
export const DEMO_CODE = '123456';
export const ATTEMPTS = 5;
export const RESEND_IN = 59;
export const CODE_EXPIRES_IN = 598;

/** Which role home a mock staff email lands on (the five persona accounts of the 7.0.2 frames; any other staff email lands on Senior Admin). */
export const ROLE_BY_EMAIL = {
  [`akua.sarfo@${STAFF_DOMAIN}`]: 'senior',
  [`kweku.ansah@${STAFF_DOMAIN}`]: 'support',
  [`esi.darko@${STAFF_DOMAIN}`]: 'moderator',
  [`nana.adjei@${STAFF_DOMAIN}`]: 'super',
  [`kwabena.ofori@${STAFF_DOMAIN}`]: 'dpo',
};

export const maskEmail = (email) => {
  const [local = '', domain = STAFF_DOMAIN] = email.trim().toLowerCase().split('@');
  if (local.length < 2) return `${local}•••@${domain}`;
  return `${local[0]}•••${local[local.length - 1]}@${domain}`;
};

export const NOTICES = {
  locked: {
    title: 'Your staff account is locked',
    body: 'Staff accounts lock after 30 days without a sign-in. A Super Admin has been told and can unlock it.',
    primary: 'Contact a Super Admin',
  },
  expired: {
    title: 'This set-up link has expired',
    body: 'Set-up links last 24 hours. Ask the Super Admin who invited you to send a new one.',
    primary: 'Ask for a new link',
  },
};
