import { debug } from '../utils/debug.js';

const log = debug('apiErrors');

/*
 * One place that turns backend errors into copy the user can act on.
 * Backend errors (moleculer-web) look like { name, message, code, type, data };
 * field validation sometimes comes back as { errors: { field: message } }.
 * Design can replace any string here without touching the pages.
 */
const MESSAGES = {
  SESSION_INVALID: 'Your sign-up session has expired. Please start again.',
  SESSION_MISSING: 'Your sign-up session was lost. Please start again from your date of birth.',
  STEP_OUT_OF_ORDER: 'Please complete the previous step first.',
  STEP_NOT_APPLICABLE: 'This step does not apply to your account.',
  ONBOARDING_INCOMPLETE: 'Some steps are not finished yet. Please complete them before activating.',
  EMAIL_ALREADY_REGISTERED: 'An account with this email already exists. Please log in instead.',
  PHONE_ALREADY_REGISTERED: 'An account with this phone number already exists.',
  EDUCATION_LEVEL_INELIGIBLE: 'Primary school students cannot sign up yet.',
  OTP_INVALID: 'That code is not correct. Please check it and try again.',
  OTP_EXPIRED: 'That code has expired. Request a new one.',
  OTP_LOCKED: 'Too many attempts. Request a new code.',
  OTP_NOT_SENT: 'We have not sent you a code yet. Request one.',
  OTP_RESEND_TOO_SOON: 'Please wait a moment before requesting another code.',
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  INVALID_PHOTO_TYPE: 'Upload a JPG, PNG or WebP image.',
  PHOTO_TOO_LARGE: 'Your photo must be 5 MB or smaller.',
  PHOTO_UPLOAD_FAILED: 'We could not upload your photo. Please try again.',
  INVALID_GRADUATION_YEAR: 'Pick a valid expected graduation year.',
  INVALID_INSTITUTION: 'That institution name is too long.',
  NETWORK: 'We could not reach the server. Check your connection and try again.',
  WAKING_UP: 'The server is starting up. Please try again in a minute.',
  RATE_LIMITED: 'Too many attempts. Please wait a few minutes and try again.',
};

export const getApiErrorCode = (error) => {
  const data = error?.response?.data;
  return data?.type || data?.code || error?.code || null;
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.code === 'SESSION_MISSING') return MESSAGES.SESSION_MISSING;
  // Client-side checks (e.g. photo type/size) throw with a known code and no response.
  if (!error?.response && error?.code && MESSAGES[error.code]) return MESSAGES[error.code];
  const status = error?.response?.status;
  const data = error?.response?.data;
  log.error('API error:', status, data?.type || data?.code, data?.message);

  if (!error?.response) return MESSAGES.NETWORK;
  // Render free instance cold start: gateway answers 503 { status: 'booting' }
  if (status === 503 || data?.status === 'booting') return MESSAGES.WAKING_UP;

  const code = data?.type || data?.code;
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (status === 429) return MESSAGES.RATE_LIMITED;

  // Field validation: { errors: { field: msg } } or { data: [{ field, message }] }
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0];
    if (typeof first === 'string') return first;
  }
  if (Array.isArray(data?.data) && data.data[0]?.message) return data.data[0].message;
  if (Array.isArray(data?.data?.errors) && data.data.errors[0]?.message) {
    return data.data.errors[0].message;
  }
  return data?.message || fallback;
};
