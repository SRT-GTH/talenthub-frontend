import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('onboarding.api');

/*
 * Talent onboarding API (backend: /api/v1/onboarding, public, session based).
 *
 * The backend keeps the onboarding state in a server-side session for 48 h.
 * Every call after `start` sends the sessionToken, which we keep in
 * sessionStorage so a page refresh can resume (GET /status).
 *
 * Step order (enforced by the backend):
 *   start -> identity -> contact (+ verify-contact) -> address -> education
 *     -> adult: consent -> activate
 *     -> minor: parent  -> activate
 */

const BASE = '/v1/onboarding';

// Platform tenant the talent signs up under (Ghana Talent Hub on staging).
const TENANT_ORG_ID = import.meta.env.VITE_TENANT_ORG_ID || '';

export const getSessionToken = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.onboardingSession) || null;
  } catch {
    return null;
  }
};

const setSessionToken = (token) => {
  try {
    if (token) sessionStorage.setItem(STORAGE_KEYS.onboardingSession, token);
    else sessionStorage.removeItem(STORAGE_KEYS.onboardingSession);
  } catch {
    // storage unavailable (private mode) - the flow still works until refresh
  }
};

export const clearOnboardingSession = () => setSessionToken(null);

const requireToken = () => {
  const token = getSessionToken();
  if (!token) {
    const err = new Error('Onboarding session missing');
    err.code = 'SESSION_MISSING';
    throw err;
  }
  return token;
};

/** POST /start { organizationId, dob: YYYY-MM-DD } -> { sessionToken, agePath, currentStep } */
export const startOnboarding = async ({ dob }) => {
  log('start: dob=', dob, 'tenant set:', Boolean(TENANT_ORG_ID));
  const { data } = await api.post(`${BASE}/start`, { organizationId: TENANT_ORG_ID, dob });
  log('start response:', { agePath: data?.agePath, currentStep: data?.currentStep });
  setSessionToken(data?.sessionToken);
  return data;
};

/** POST /capture/:stepKey { sessionToken, ...fields } -> { completedStep, currentStep } */
export const captureStep = async (stepKey, fields) => {
  const sessionToken = requireToken();
  log('capture', stepKey, 'fields:', Object.keys(fields));
  const { data } = await api.post(`${BASE}/capture/${stepKey}`, { sessionToken, ...fields });
  log('capture response:', data);
  return data;
};

/** POST /verify-contact { sessionToken, otp } -> { verified } */
export const verifyContactOtp = async (otp) => {
  const sessionToken = requireToken();
  log('verify-contact: code length', String(otp).length);
  const { data } = await api.post(`${BASE}/verify-contact`, { sessionToken, otp: String(otp) });
  log('verify-contact response:', data);
  return data;
};

/** POST /resend-contact-otp { sessionToken } -> { sent, expiresInSeconds } */
export const resendContactOtp = async () => {
  const sessionToken = requireToken();
  log('resend-contact-otp');
  const { data } = await api.post(`${BASE}/resend-contact-otp`, { sessionToken });
  log('resend response:', data);
  return data;
};

/** POST /activate { sessionToken, consentGiven? } -> { userId, entityId } */
export const activateOnboarding = async ({ consentGiven } = {}) => {
  const sessionToken = requireToken();
  log('activate, consent provided:', Boolean(consentGiven));
  const { data } = await api.post(`${BASE}/activate`, {
    sessionToken,
    ...(consentGiven ? { consentGiven } : {}),
  });
  log('activate response:', { userId: data?.userId, entityId: data?.entityId });
  return data;
};

/** GET /status?sessionToken= -> current step info (for resume after refresh) */
export const getOnboardingStatus = async () => {
  const sessionToken = requireToken();
  const { data } = await api.get(`${BASE}/status`, { params: { sessionToken } });
  log('status:', data);
  return data;
};
