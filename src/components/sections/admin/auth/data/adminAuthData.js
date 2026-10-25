/*
 * adminAuthData — copy and limits of the Platform Admin staff sign-in (Figma canvas 8520:12, frames 7.0.1a-d).
 * Sign-in is the normal two-step login (auth.api: password, then a 6-digit code emailed to the account).
 * VITE_ADMIN_STAFF_DOMAIN (e.g. ghanatalenthub.com) turns on the work-email check in the form; without it any email may try,
 * and the backend decides who is staff.
 */

export const STAFF_DOMAIN = String(import.meta.env.VITE_ADMIN_STAFF_DOMAIN || 'ghanatalenthub.com').trim();
export const STAFF_DOMAIN_REQUIRED = Boolean(import.meta.env.VITE_ADMIN_STAFF_DOMAIN);

export const ATTEMPTS = 5;
export const RESEND_IN = 59;
/** The emailed code lasts 15 minutes (auth.service). */
export const CODE_EXPIRES_IN = 15 * 60;

export const maskEmail = (email) => {
  const [local = '', domain = STAFF_DOMAIN] = String(email || '').trim().toLowerCase().split('@');
  if (local.length < 2) return `${local}•••@${domain}`;
  return `${local[0]}•••${local[local.length - 1]}@${domain}`;
};

export const NOTICES = {
  locked: {
    title: 'Your staff account is locked',
    body: 'Too many wrong codes, or the account is suspended. A Super Admin can unlock it.',
    primary: 'Contact a Super Admin',
  },
  expired: {
    title: 'This set-up link has expired',
    body: 'Set-up links last 24 hours. Ask the Super Admin who invited you to send a new one.',
    primary: 'Ask for a new link',
  },
};
