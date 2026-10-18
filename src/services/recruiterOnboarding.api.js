import api from './api.js';
import { getApiErrorCode, getApiErrorMessage } from './apiErrors.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterOnboarding.api');

/*
 * Recruiter self-serve onboarding API (backend: /api/recruiter, 2026-10-18).
 *
 *   POST /recruiter/signup/send-code  { email, firstName, phone } -> emails a 6-digit code
 *        (409 EMAIL_EXISTS / PHONE_EXISTS before any code is sent)
 *   POST /auth/contact-verification/verify { challengeToken, otp } -> verificationToken
 *   POST /recruiter/signup  { fullName, email, phone, password, verificationToken }
 *        -> creates the account (email verified) + returns a login session
 *   then, with the Bearer token:
 *   POST /recruiter/type                        { recruiterType }
 *   GET  /recruiter/organizations/search?q=     -> { status, organizations, suggestion }
 *   POST /recruiter/organizations/request-affiliation { orgId }
 *   POST /recruiter/organizations/create        { name, tradingName, industry, size, ... }
 *   POST /recruiter/plan                        { tier, billing }
 *   POST /recruiter/payment                     { method, last4, network }  (SIMULATED)
 *   POST /recruiter/payment/confirm             { reference }               (MoMo)
 *   POST /recruiter/hiring-preferences          { scope, experienceLevels, industrySectors }
 *   POST /recruiter/activate                    { acceptTerms, acceptPrivacy }
 *   GET  /recruiter/onboarding                  -> state for resume / review
 *
 * Staging: the email code 123456 works while ENABLE_TEST_OTP_BYPASS=1.
 *
 * Failures are re-thrown as { code, message, status } (code = backend `type`,
 * EMAIL_EXISTS is mapped to the UI's EMAIL_TAKEN) and announced through a
 * window event the RecruiterOnboardingShell shows as a banner, so pages only
 * need to reset their busy state.
 */

const BASE = '/recruiter';
export const RECRUITER_API_ERROR_EVENT = 'recruiter-onboarding:api-error';

const fail = (err, { announce = true } = {}) => {
  const rawCode = getApiErrorCode(err);
  const code = rawCode === 'EMAIL_EXISTS' ? 'EMAIL_TAKEN' : rawCode;
  const message = getApiErrorMessage(err);
  const out = Object.assign(new Error(message), {
    code,
    message,
    status: err?.response?.status,
    data: err?.response?.data?.data,
  });
  log.error('failed', out.status, code);
  if (announce && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(RECRUITER_API_ERROR_EVENT, { detail: { code, message } }));
  }
  return out;
};

const post = async (path, body, opts) => {
  try {
    const { data } = await api.post(`${BASE}${path}`, body);
    return data;
  } catch (err) {
    throw fail(err, opts);
  }
};

// ── Sign-up: profile -> email code -> account ──────────────────────────────
// The pending profile (incl. password) lives in module memory only until the
// account is created - never in storage or the onboarding context.
let pendingSignup = null;

export const startSignup = async ({ fullName, email, phone, password }) => {
  const firstName = String(fullName).trim().split(/\s+/)[0];
  log('send-code');
  // EMAIL_TAKEN is shown inline by the profile form, so no banner for it.
  let data;
  try {
    ({ data } = await api.post(`${BASE}/signup/send-code`, {
      email: email.trim(),
      firstName,
      phone,
    }));
  } catch (err) {
    throw fail(err, { announce: getApiErrorCode(err) !== 'EMAIL_EXISTS' });
  }
  pendingSignup = {
    fullName: fullName.trim(),
    email: email.trim(),
    phone,
    password,
    challengeToken: data?.challengeToken,
  };
  return { maskedEmail: data?.maskedEmail, expiresInSeconds: data?.expiresInSeconds };
};

export const resendSignupCode = async () => {
  if (!pendingSignup) throw fail(Object.assign(new Error('Start again'), { code: 'OTP_NOT_SENT' }));
  const { fullName, email, phone, password } = pendingSignup;
  return startSignup({ fullName, email, phone, password });
};

const saveSession = ({ accessToken, refreshToken, user }) => {
  try {
    if (accessToken) localStorage.setItem(STORAGE_KEYS.authToken, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(user));
  } catch {
    // storage blocked - the session lasts until refresh
  }
};

/** Verify the email code, then create the account and log in. */
export const verifySignupCode = async (otp) => {
  if (!pendingSignup?.challengeToken) {
    throw fail(Object.assign(new Error('No code sent'), { code: 'OTP_NOT_SENT' }));
  }
  let verificationToken;
  try {
    const { data } = await api.post('/auth/contact-verification/verify', {
      challengeToken: pendingSignup.challengeToken,
      otp: String(otp),
    });
    verificationToken = data?.verificationToken;
  } catch (err) {
    // A wrong code is shown in the code cells, not as a banner.
    throw fail(err, { announce: getApiErrorCode(err) !== 'OTP_INVALID' });
  }
  const { fullName, email, phone, password } = pendingSignup;
  const data = await post('/signup', { fullName, email, phone, password, verificationToken });
  pendingSignup = null;
  saveSession(data || {});
  log('account created', Boolean(data?.accessToken));
  return data;
};

// ── Steps after sign-up (Bearer token) ─────────────────────────────────────
export const setRecruiterType = (recruiterType) => post('/type', { recruiterType });

/** -> { status: idle | results | suggestion | notFound, results, suggestion } */
export const searchOrganisations = async (query) => {
  const q = String(query || '').trim();
  if (!q) return { status: 'idle', results: [], suggestion: null };
  try {
    const { data } = await api.get(`${BASE}/organizations/search`, { params: { q } });
    return {
      status: data?.status || 'notFound',
      results: data?.organizations || [],
      suggestion: data?.suggestion || null,
    };
  } catch (err) {
    throw fail(err);
  }
};

export const requestAffiliation = async (orgId) => {
  await post('/organizations/request-affiliation', { orgId });
  return { orgId, status: 'pending' };
};

export const createOrganisation = async (payload) => {
  const data = await post('/organizations/create', {
    name: payload.legalName,
    tradingName: payload.tradingName || '',
    industry: payload.industry || '',
    size: payload.size || '',
    website: payload.website || '',
    region: payload.region || '',
    district: payload.district || '',
  });
  return { id: data?.organization?.id, ...payload, role: 'primary_admin' };
};

export const selectPlan = ({ tier, billing }) => post('/plan', { tier, billing });

/** SIMULATED payment -> { status: paid | declined | pending, reference, last4 } */
export const recordPayment = ({ method, last4, network }) =>
  post('/payment', { method, last4, ...(network ? { network } : {}) }, { announce: true });

export const confirmPayment = (reference) => post('/payment/confirm', { reference });

export const savePreferences = ({ scope, experience = [], industries = [] }) =>
  post('/hiring-preferences', { scope, experienceLevels: experience, industrySectors: industries });

export const activateAccount = () => post('/activate', { acceptTerms: true, acceptPrivacy: true });

export const getOnboarding = async () => {
  try {
    const { data } = await api.get(`${BASE}/onboarding`);
    return data?.onboarding || null;
  } catch (err) {
    throw fail(err, { announce: false });
  }
};

/** Map the backend onboarding view to the provider's sections (resume after refresh). */
export const onboardingToSections = (o) => {
  if (!o) return {};
  const out = {};
  if (o.profile?.email) out.profile = { ...o.profile, passwordSet: true, verified: true };
  if (o.recruiterType) out.recruiterType = o.recruiterType;
  if (o.organisation?.id) {
    out.organisation = {
      mode: o.organisation.affiliation === 'admin' ? 'new' : 'existing',
      id: o.organisation.id,
      name: o.organisation.name,
      tradingName: o.organisation.tradingName || '',
      primaryAdmin: o.organisation.primaryAdmin || '',
      affiliation: o.organisation.affiliation,
    };
  }
  if (o.plan?.tier) out.plan = { tier: o.plan.tier, billing: o.plan.billing };
  if (o.payment?.status) {
    out.payment = { method: o.payment.method, status: o.payment.status, last4: o.payment.last4 };
  }
  if (o.preferences?.scope) {
    out.preferences = {
      scope: o.preferences.scope,
      experience: o.preferences.experienceLevels || [],
      industries: o.preferences.industrySectors || [],
    };
  }
  if (o.termsAcceptedAt) out.terms = { accepted: true };
  return out;
};
