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

export const logout = () => {
  log('logout');
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userProfile);
};

export const isLoggedIn = () => Boolean(localStorage.getItem(STORAGE_KEYS.authToken));
