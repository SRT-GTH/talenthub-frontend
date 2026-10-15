import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('auth.api');

/*
 * Login is always two-step on the backend:
 *   POST /auth/login { email, password }      -> OTP emailed (15 min)
 *   POST /auth/verify-otp { email, otp }       -> { accessToken, refreshToken, user }
 * On staging the fixed code 123456 works while ENABLE_TEST_OTP_BYPASS=1.
 */

const pickTokens = (data) => {
  const d = data?.data || data || {};
  return { accessToken: d.accessToken, refreshToken: d.refreshToken, user: d.user };
};

export const requestLoginOtp = async ({ email, password }) => {
  log('login: requesting OTP for', email);
  const { data } = await api.post('/auth/login', { email, password });
  log('login response keys:', Object.keys(data || {}));
  return data;
};

export const verifyLoginOtp = async ({ email, otp }) => {
  log('verify-otp for', email);
  const { data } = await api.post('/auth/verify-otp', { email, otp: String(otp) });
  const { accessToken, refreshToken, user } = pickTokens(data);
  log('verify-otp: token received:', Boolean(accessToken));
  if (accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(user));
  }
  return { accessToken, refreshToken, user };
};

export const logout = () => {
  log('logout');
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.refreshToken);
  localStorage.removeItem(STORAGE_KEYS.userProfile);
};

export const isLoggedIn = () => Boolean(localStorage.getItem(STORAGE_KEYS.authToken));
