/*
 * profileValidation - pure helpers for the recruiter profile step (R01/R02).
 * Figma 7374:1391 (rules copy "Min 8 characters · 1 uppercase · 1 lowercase · 1 number"),
 * 7374:2036 (error copy), 7374:2524 (masked contact "+233 24 ••• ••67 · k•••e@mtn.com.gh").
 * No React, no API - safe to unit test.
 */

// Demo triggers (documented in the page header + notes): this email always answers "already registered".
export const DEMO_TAKEN_EMAIL = 'taken@example.com';
// Demo OTP accepted by verifyOtp (same as the talent flow).
export const DEMO_VALID_OTP = '123456';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmailValid = (email) => EMAIL_RE.test(email.trim());

export const phoneDigits = (raw) => raw.replace(/\D/g, '').slice(0, 9);

// "241234567" -> "24 123 4567" (Figma 7374:1821 shows the national number grouped 2-3-4).
export const formatPhone = (raw) => {
  const d = phoneDigits(raw);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean);
  return parts.join(' ');
};

export const isPhoneValid = (raw) => phoneDigits(raw).length === 9;

// Missing password requirements, in Figma's wording order.
export const missingPasswordRules = (pw) => {
  const missing = [];
  if (pw.length < 8) missing.push('at least 8 characters');
  if (!/[A-Z]/.test(pw)) missing.push('1 uppercase letter');
  if (!/[a-z]/.test(pw)) missing.push('1 lowercase letter');
  if (!/\d/.test(pw)) missing.push('1 number');
  return missing;
};

// Figma 7374:2036: "Password needs at least 8 characters and 1 uppercase letter".
export const passwordError = (pw) => {
  const missing = missingPasswordRules(pw);
  if (missing.length === 0) return undefined;
  const list =
    missing.length === 1
      ? missing[0]
      : `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}`;
  return `Password needs ${list}`;
};

export const maskPhone = (raw) => {
  const d = phoneDigits(raw);
  if (d.length < 4) return `+233 ${raw}`;
  return `+233 ${d.slice(0, 2)} ••• ••${d.slice(-2)}`;
};

export const maskEmail = (raw) => {
  const [name, host] = raw.trim().split('@');
  if (!name || !host) return raw;
  if (name.length <= 2) return `${name[0]}•••@${host}`;
  return `${name[0]}•••${name[name.length - 1]}@${host}`;
};

export const formatMmSs = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};
