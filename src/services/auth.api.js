import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';
import { clearSetupHint, saveSetupHint } from './mfa.api.js';

const log = debug('auth.api');

/*
 * Login is always two-step on the backend (accounts with 2-step verification on answer { requiresMfa, challengeId } instead of
 * emailing a code; the second step is mfa.api verifyMfaSignIn, POST /auth/mfa/verify):
 *   POST /auth/login      { email | phoneNumber, password } -> code emailed (15 min)
 *   POST /auth/verify-otp { email | phoneNumber, otp }      -> { accessToken, refreshToken, user }
 *   POST /auth/resend-otp { email | phoneNumber }
 * The code always goes to the account email, even for phone logins
 * (SMS isn't live). On staging the fixed code 123456 works while
 * ENABLE_TEST_OTP_BYPASS=1.
 *
 * Password reset (public, email-only — phone-only accounts can't reset):
 *   POST /auth/request-password-reset { email } -> always the same neutral
 *        { success, message } so it never reveals whether the email exists.
 *        The email links to /reset-password?token=… (valid 60 min).
 *   POST /auth/reset-password { token, newPassword } -> success, or 400
 *        INVALID_TOKEN for a bad / expired / already-used token.
 *
 * VITE_LOGIN_IDENTIFIER picks what the login screen offers:
 *   email | phone | both (default both). The backend has a matching
 *   LOGIN_IDENTIFIER_MODE that it enforces.
 */

const VALID_MODES = ['email', 'phone', 'both'];
export const LOGIN_MODE = (() => {
  const mode = String(import.meta.env.VITE_LOGIN_IDENTIFIER || 'both')
    .trim()
    .toLowerCase();
  return VALID_MODES.includes(mode) ? mode : 'both';
})();

const pickTokens = (data) => {
  const d = data?.data || data || {};
  return {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    user: d.user,
    mfaSetup: d.mfaSetup || null,
  };
};

// `identity` is { email } or { phoneNumber } (E.164, e.g. +233241234567).
const describe = (identity) => (identity?.email ? 'email' : 'phone');

export const requestLoginOtp = async ({ identity, password }) => {
  log('login: requesting code via', describe(identity));
  const { data } = await api.post('/auth/login', { ...identity, password });
  log('login response keys:', Object.keys(data || {}));
  return data;
};

export const verifyLoginOtp = async ({ identity, otp }) => {
  log('verify-otp via', describe(identity));
  const { data } = await api.post('/auth/verify-otp', { ...identity, otp: String(otp) });
  const { accessToken, refreshToken, user, mfaSetup } = pickTokens(data);
  log('verify-otp: token received:', Boolean(accessToken));
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(user));
    // Accounts that must use 2-step and haven't set it up: { required, graceUntil, mustSetUpNow } (the reminder banner).
    saveSetupHint(mfaSetup);
  }
  return { accessToken, refreshToken, user, mfaSetup };
};

/**
 * Where a user lands after login: talents on their dashboard, recruiters on
 * the recruiter home. Other account types keep the engagement hub until they
 * have a home of their own.
 */
export const homePathFor = (user) => {
  const type = String(user?.entityType || user?.type || '').toLowerCase();
  if (type === 'talent') return '/home';
  if (type === 'recruiter') return '/recruiter/home';
  // Government agencies: a temporary password from the GTH team must be replaced first.
  if (type === 'government_institution' || type === 'government') {
    return user?.metadata?.mustChangePassword ? '/agency/set-password' : '/agency';
  }
  // Parents and guardians have their own dashboard (they used to land on the talent engagement flow).
  if (type === 'parent' || type === 'guardian') return '/parent';
  return '/profile/engagement';
};

/**
 * homePathFor, plus the one case it can't tell from the login response: a school's staff member is a talent account that belongs to an
 * education organisation. When the user has an organisation, GET /institution/me decides (403 for the school's students).
 */
export const resolveHomePath = async (user) => {
  const type = String(user?.entityType || user?.type || '').toLowerCase();
  const m = user?.metadata || {};
  if (type === 'talent' && (user?.organizationId || m.isPrimaryContact || m.institutionRole)) {
    try {
      await api.get('/institution/me');
      return '/institution';
    } catch {
      // not an institution's staff member
    }
  }
  return homePathFor(user);
};

export const resendLoginOtp = async ({ identity }) => {
  log('resend-otp via', describe(identity));
  const { data } = await api.post('/auth/resend-otp', { ...identity });
  return data;
};

export const requestPasswordReset = async ({ email }) => {
  log('request-password-reset');
  const { data } = await api.post('/auth/request-password-reset', { email: String(email).trim() });
  return data;
};

export const resetPassword = async ({ token, newPassword }) => {
  log('reset-password');
  const { data } = await api.post('/auth/reset-password', { token, newPassword });
  return data;
};

/*
 * Logging out (ADR-08 "Logout Revokes the Server Session for Every Role").
 *
 * endSession() is what every Log out button calls, for every role: the server ends this login session
 * first (POST /users/logout, sent while the token is still attached so the api client can renew an expired
 * access token and retry), then logout() clears this browser. After it, the old access token gets 401 and
 * the refresh token can't mint a new one. `otherDevices: true` also ends the account's other sessions
 * first (POST /settings/sessions/revoke-others, the "Also log out on my other devices" box).
 *
 * logout() only clears this browser: the tokens and profile, the 2-step hint, and personal data other
 * screens keep here (Career Buddy chats and notes, everything in sessionStorage such as bulk-upload rows),
 * so the next person on a shared computer sees none of it. Before clearing it keeps the first name in
 * memory (never stored) for the logged-out pages: loggedOutFirstName().
 */
const LOGOUT_TIMEOUT_MS = 8000;
const PERSONAL_KEY_PREFIXES = [
  'careerBuddy.threads.',
  'careerBuddy.chatMeta.',
  'careerBuddy.personality.',
];
let lastFirstName = null;

const storedFirstName = () => {
  try {
    const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null') || {};
    const first = u.firstName || u.metadata?.firstName || u.profile?.firstName || '';
    return typeof first === 'string' && first.trim() ? first.trim() : null;
  } catch {
    return null;
  }
};

const clearPersonalData = () => {
  try {
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const key = localStorage.key(i);
      if (key && PERSONAL_KEY_PREFIXES.some((p) => key.startsWith(p))) localStorage.removeItem(key);
    }
  } catch {
    // storage unavailable: nothing to clear
  }
  try {
    sessionStorage.clear();
  } catch {
    // storage unavailable: nothing to clear
  }
};

/** First name of the person who just logged out in this tab, or null (unknown, or the page was reloaded). */
export const loggedOutFirstName = () => lastFirstName;

export const logout = () => {
  log('logout');
  if (
    localStorage.getItem(STORAGE_KEYS.authToken) ||
    localStorage.getItem(STORAGE_KEYS.userProfile)
  ) {
    lastFirstName = storedFirstName();
  }
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userProfile);
  clearSetupHint();
  clearPersonalData();
};

/** Ends this login session on the server, then clears this browser. Never throws; waits at most a few seconds. */
export const endSession = async ({ otherDevices = false } = {}) => {
  const signedIn = Boolean(
    localStorage.getItem(STORAGE_KEYS.authToken) || localStorage.getItem(STORAGE_KEYS.refreshToken)
  );
  if (signedIn) {
    if (otherDevices) {
      try {
        await api.post('/settings/sessions/revoke-others', null, { timeout: LOGOUT_TIMEOUT_MS });
        log('other devices logged out');
      } catch (err) {
        log('other devices not logged out', err?.response?.status);
      }
    }
    try {
      await api.post('/users/logout', null, { timeout: LOGOUT_TIMEOUT_MS });
      log('server session ended');
    } catch (err) {
      log('server logout failed', err?.response?.status);
    }
  }
  logout();
};

// Site copy → Preview (`?copyPreview=`): pages show their sample account, never the staff member's own session.
const inCopyPreview = () => {
  try {
    return new URLSearchParams(window.location.search).has('copyPreview');
  } catch {
    return false;
  }
};
export const isLoggedIn = () =>
  !inCopyPreview() && Boolean(localStorage.getItem(STORAGE_KEYS.authToken));

/* entityType from the stored access token, for sessions whose stored profile lacks it. */
const tokenEntityType = () => {
  try {
    const part = (localStorage.getItem(STORAGE_KEYS.authToken) || '').split('.')[1];
    if (!part) return null;
    return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))).entityType || null;
  } catch {
    return null;
  }
};

/**
 * Where the navbar logo goes: the signed-in user's own home (homePathFor — a talent's
 * dashboard, the recruiter home …), or the public landing page when nobody is signed in.
 */
export const logoHomePath = () => {
  if (!isLoggedIn()) return '/';
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
  } catch {
    user = null;
  }
  const entityType = user?.entityType || user?.type || tokenEntityType();
  return homePathFor({ ...(user || {}), entityType });
};
