import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('auth.api');

/*
 * Login is always two-step on the backend:
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
  return { accessToken: d.accessToken, refreshToken: d.refreshToken, user: d.user };
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
  const { accessToken, refreshToken, user } = pickTokens(data);
  log('verify-otp: token received:', Boolean(accessToken));
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(user));
  }
  return { accessToken, refreshToken, user };
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
  return '/profile/engagement';
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

export const logout = () => {
  log('logout');
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userProfile);
};

export const isLoggedIn = () => Boolean(localStorage.getItem(STORAGE_KEYS.authToken));

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
