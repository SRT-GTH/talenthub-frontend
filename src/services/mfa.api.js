import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('mfa.api');

/*
 * 2-step verification (backend services/mfa.service.js, MFA Phase 1 + 2, 2026-11-09). Never logs codes, keys or tokens.
 *   GET    /security/mfa                         { available, enabled, required, graceUntil, mustSetUpNow, signedInWith2Step,
 *                                                  methods: [{ id, type, label, createdAt, lastUsedAt }], backupCodesLeft }
 *   POST   /security/mfa/totp/setup              { password | code, label? } -> { factorId, secret, otpauthUri, expiresInSeconds }
 *   POST   /security/mfa/totp/confirm            { factorId, code } -> { enabled, factorId, backupCodes | null }
 *   DELETE /security/mfa/factors/:id             { password | code } -> { removed, enabled }
 *   POST   /security/mfa/recovery-codes          { code } -> { backupCodes }
 *   GET    /security/mfa/staff-resets            super admin: { resets: [...] }
 *   POST   /security/mfa/staff-resets            super admin: { userId, reason } -> { approvalId, status, expiresAt }
 *   POST   /security/mfa/staff-resets/:id/decision   a different super admin: { decision: approve|reject, reason? }
 *   POST   /security/step-up                     "Confirm it's you" (Phase 3): { password | code } -> { verified, aal, verifiedAt }
 *   POST   /auth/mfa/verify (public)             { email | phoneNumber, challengeId, code, method? } -> tokens (sign-in second step)
 *
 * The sign-in response's 2-step hint (verify-otp `mfaSetup`: { required, graceUntil, mustSetUpNow }) is kept in localStorage
 * (STORAGE_KEYS.mfaSetup) for the reminder banner; it is cleared when 2-step is turned on and on logout.
 */

const unwrap = (res) => {
  const d = res?.data;
  return d && d.data && !d.type ? d.data : d;
};

export const getMfaStatus = async () => unwrap(await api.get('/security/mfa'));

export const startAppSetup = async ({ password, code, label } = {}) => {
  log('app set-up: start', { with: password ? 'password' : 'code' });
  return unwrap(
    await api.post('/security/mfa/totp/setup', {
      ...(password ? { password } : {}),
      ...(code ? { code: String(code).trim() } : {}),
      ...(label ? { label } : {}),
    })
  );
};

export const confirmAppSetup = async ({ factorId, code }) => {
  log('app set-up: confirm');
  const out = unwrap(
    await api.post('/security/mfa/totp/confirm', { factorId, code: String(code).trim() })
  );
  if (out?.enabled) clearSetupHint();
  return out;
};

export const removeMethod = async (id, { password, code } = {}) => {
  log('remove method');
  return unwrap(
    await api.delete(`/security/mfa/factors/${encodeURIComponent(id)}`, {
      data: { ...(password ? { password } : {}), ...(code ? { code: String(code).trim() } : {}) },
    })
  );
};

export const makeNewBackupCodes = async ({ code }) => {
  log('new backup codes');
  return unwrap(await api.post('/security/mfa/recovery-codes', { code: String(code).trim() }));
};

/** "Confirm it's you" before a sensitive action (MFA Phase 3; StepUpSheet). */
export const confirmStepUp = async ({ password, code } = {}) => {
  log('step-up', { with: code ? 'code' : 'password' });
  return unwrap(
    await api.post('/security/step-up', {
      ...(password ? { password } : {}),
      ...(code ? { code: String(code).trim() } : {}),
    })
  );
};

// ── Staff 2-step resets (two Super Admins) ─────────────────────────────────
export const listStaffResets = async () =>
  unwrap(await api.get('/security/mfa/staff-resets'))?.resets || [];

export const requestStaffReset = async ({ userId, reason }) =>
  unwrap(await api.post('/security/mfa/staff-resets', { userId, reason: String(reason).trim() }));

export const decideStaffReset = async (approvalId, { decision, reason }) =>
  unwrap(
    await api.post(`/security/mfa/staff-resets/${encodeURIComponent(approvalId)}/decision`, {
      decision,
      ...(reason ? { reason } : {}),
    })
  );

// ── Sign-in second step ────────────────────────────────────────────────────
export const verifyMfaSignIn = async ({ identity, challengeId, code, method }) => {
  log('sign-in: 2-step code', { method: method || 'auto' });
  const res = await api.post('/auth/mfa/verify', {
    ...identity,
    challengeId,
    code: String(code).trim(),
    ...(method ? { method } : {}),
  });
  const d = unwrap(res) || {};
  if (d.accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, d.accessToken);
    if (d.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, d.refreshToken);
    if (d.user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(d.user));
    clearSetupHint();
  }
  return {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    user: d.user,
    mfa: d.mfa || null,
  };
};

// ── The reminder hint ──────────────────────────────────────────────────────
export const saveSetupHint = (hint) => {
  try {
    if (hint && hint.required) localStorage.setItem(STORAGE_KEYS.mfaSetup, JSON.stringify(hint));
    else localStorage.removeItem(STORAGE_KEYS.mfaSetup);
  } catch {
    // storage blocked: the banner just doesn't show
  }
};

export const readSetupHint = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.mfaSetup) || 'null');
  } catch {
    return null;
  }
};

export function clearSetupHint() {
  try {
    localStorage.removeItem(STORAGE_KEYS.mfaSetup);
  } catch {
    // ignore
  }
}

/** "16 Nov" for a date (en-GB). */
export const shortDate = (iso) => {
  const t = new Date(iso);
  return Number.isNaN(t.getTime())
    ? ''
    : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/** The path of the 2-step page, keeping where to go afterwards. */
export const twoStepPath = ({ required = false, next } = {}) => {
  const q = new URLSearchParams();
  if (required) q.set('required', '1');
  if (next && next.startsWith('/') && !next.startsWith('//')) q.set('next', next);
  const s = q.toString();
  return `/security/2-step${s ? `?${s}` : ''}`;
};

/** Copy for the 2-step error codes the backend sends. */
export const MFA_ERRORS = {
  INVALID_MFA_CODE: 'That code didn’t match. Check the time on your phone and try the newest code.',
  MFA_CODE_REQUIRED: 'Enter a code from your authenticator app (or a backup code).',
  PASSWORD_REQUIRED: 'Enter your password to continue.',
  INVALID_PASSWORD: 'That password isn’t right.',
  MFA_SETUP_EXPIRED: 'This set-up took too long. Start again.',
  MFA_SETUP_NOT_FOUND: 'This set-up has ended. Start again.',
  MFA_NOT_AVAILABLE: '2-step verification isn’t available yet.',
  MFA_CHALLENGE_INVALID: 'Your sign-in has expired. Enter your password again.',
  TOO_MANY_ATTEMPTS: 'Too many wrong codes. For your safety, sign in again with your password.',
  MFA_SIGN_IN_REQUIRED: 'Sign out, then sign in again with your 2-step code to do this.',
  SUPER_ADMIN_ONLY: 'Only a Super Admin can do this.',
  SELF_TARGET_BLOCKED: 'You can’t reset or decide a reset of your own 2-step verification.',
  SELF_APPROVAL_BLOCKED: 'A different Super Admin must approve your request.',
  RESET_ALREADY_PENDING: 'A reset for this person is already waiting for approval.',
  NO_SECOND_APPROVER:
    'No other Super Admin can approve this. Use the break-glass procedure in the security runbook.',
  MFA_NOT_ENABLED: 'This person hasn’t set up 2-step verification, so there’s nothing to reset.',
  APPROVAL_EXPIRED: 'That request has expired. Ask again.',
  APPROVAL_ALREADY_RESOLVED: 'That request was already decided.',
  STAFF_NOT_FOUND: 'That staff account wasn’t found.',
  RATE_LIMITED: 'Too many attempts. Wait a few minutes and try again.',
  SESSION_REQUIRED: 'Sign out and sign in again to do this.',
  STEP_UP_REQUIRED: 'Confirm it’s you to continue.',
};

export const mfaErrorType = (err) => {
  const d = err?.response?.data;
  return d?.type || d?.code || d?.data?.code || null;
};

export const mfaError = (err, fallback = 'Something went wrong. Try again.') => {
  const type = mfaErrorType(err);
  if (type && MFA_ERRORS[type]) return MFA_ERRORS[type];
  if (err?.response?.status === 429) return MFA_ERRORS.RATE_LIMITED;
  if (!err?.response) return 'We could not reach the server. Check your connection and try again.';
  return fallback;
};
