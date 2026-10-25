import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';
import { perfRequest, perfResponse } from '../utils/perf.js';

const log = debug('api');

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
log('baseURL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach auth token if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  log('→', config.method?.toUpperCase(), config.url);
  return perfRequest(config); // no-op unless ?perf=1
});

// Response: log, and renew an expired access token once with the stored refresh
// token (POST /auth/refresh-token -> { accessToken }), then retry the request.
// Calls that fail together share one refresh. If the refresh itself fails the
// session is over: tokens are cleared and the original 401 is passed on, so the
// page can send the user to login.
const NO_REFRESH = [
  '/auth/login',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/refresh-token',
  '/auth/register',
];
let refreshing = null;

const refreshAccessToken = () => {
  if (!refreshing) {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    refreshing = (
      refreshToken
        ? axios.post(`${baseURL}/auth/refresh-token`, { refreshToken }, { timeout: 15_000 })
        : Promise.reject(new Error('No refresh token'))
    )
      .then(({ data }) => {
        const token = data?.accessToken || data?.data?.accessToken;
        if (!token) throw new Error('No access token in refresh response');
        localStorage.setItem(STORAGE_KEYS.authToken, token);
        log('access token renewed');
        return token;
      })
      .catch((err) => {
        log.error('refresh failed; session over:', err?.response?.status || err?.message);
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
        throw err;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

/**
 * The access token for a call made outside axios (Career Buddy's agent uses fetch), renewed first
 * when it expires within a minute. 2026-10-25: the agent now checks this token on every turn.
 * Never throws: with no usable token it returns what is stored (or '') and the call goes ahead.
 */
export const freshAccessToken = async () => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken) || '';
  try {
    const part = token.split('.')[1];
    const { exp } = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof exp === 'number' && exp * 1000 - Date.now() < 60_000 && localStorage.getItem(STORAGE_KEYS.refreshToken)) {
      return await refreshAccessToken();
    }
  } catch {
    // not a JWT, or the refresh failed: use what is stored
  }
  return localStorage.getItem(STORAGE_KEYS.authToken) || token;
};

api.interceptors.response.use(
  (response) => {
    log('←', response.status, response.config.url);
    perfResponse(response);
    return response;
  },
  async (error) => {
    const { config, response } = error;
    const url = config?.url || '';
    const canRefresh =
      response?.status === 401 &&
      config &&
      !config._retried &&
      !NO_REFRESH.some((p) => url.includes(p)) &&
      Boolean(localStorage.getItem(STORAGE_KEYS.refreshToken));
    perfResponse(error, true, { retrying: canRefresh });
    if (canRefresh) {
      try {
        const token = await refreshAccessToken();
        config._retried = true;
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
        return api(config);
      } catch {
        // fall through with the original 401
        perfResponse(error, true, { counted: true });
      }
    }
    log.error('×', response?.status, url, error.message);
    return Promise.reject(error);
  }
);

export default api;
