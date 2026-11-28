import api from './api.js';
import { mapGender, toGhanaE164, toIsoDate } from './onboardingMappers.js';
import { debug } from '../utils/debug.js';

const log = debug('parentSignup.api');

/*
 * Self-serve parent sign-up (flow A, /onboarding/parent-welcome … /parent-done).
 *
 *   Identity, Verification -> saveSignupDraft() (sessionStorage, this tab only)
 *   Contact   -> sendContactCode():   POST /auth/contact-verification/send { email, firstName }
 *                                      -> { challengeToken, maskedEmail, expiresInSeconds }
 *                verifyContactCode(): POST /auth/contact-verification/verify { challengeToken, otp }
 *                                      -> { verified, verificationToken }
 *                (the code goes by email; SMS is not live, as in the talent sign-up)
 *   Security  -> setSignupPassword() (module memory only, never stored)
 *   Link ward -> nothing sent: no endpoint finds the wards whose registration named this
 *                parent before the account exists (the screen keeps its Figma sample).
 *   Review    -> registerParent(): POST /auth/register
 *                { email, password, entityType: 'parent', organizationId, userData: {…} }
 *                The account is created without a session, so the parent then logs in
 *                (POST /auth/login + the emailed code) from /onboarding/parent-login.
 *                The relationship is not accepted by /auth/register (unknown field); it is
 *                given again when a ward is linked (POST /parent/link-with-code).
 *
 * Staging accepts the code 123456 while the backend's test bypass is on.
 */

const DRAFT_KEY = 'th:parent-signup';
const TENANT_ORG_ID = import.meta.env.VITE_TENANT_ORG_ID || '';
let passwordInMemory = null;

const readDraft = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null') || {};
  } catch {
    return {};
  }
};
const writeDraft = (value) => {
  try {
    if (value == null) sessionStorage.removeItem(DRAFT_KEY);
    else sessionStorage.setItem(DRAFT_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable: this tab still works until a refresh */
  }
};

export const getSignupDraft = () => readDraft();
export const saveSignupDraft = (patch) => {
  const next = { ...readDraft(), ...patch };
  writeDraft(next);
  log('draft saved:', Object.keys(patch));
  return next;
};
export const clearSignup = () => {
  writeDraft(null);
  passwordInMemory = null;
};

export const setSignupPassword = (pw) => {
  passwordInMemory = pw || null;
};
export const hasSignupPassword = () => Boolean(passwordInMemory);

const fail = (code, message) => Object.assign(new Error(message), { code });

/** Emails a 6-digit code to the parent. Keeps the challenge in the draft. */
export const sendContactCode = async ({ email, firstName }) => {
  const clean = String(email || '')
    .trim()
    .toLowerCase();
  log('send code →', clean.replace(/^(.).*@/, '$1***@'));
  const { data } = await api.post('/auth/contact-verification/send', {
    email: clean,
    firstName: firstName || readDraft().firstName || undefined,
  });
  saveSignupDraft({ challengeToken: data?.challengeToken, verificationToken: null });
  log('code sent; expires in', data?.expiresInSeconds, 's');
  return { maskedEmail: data?.maskedEmail, expiresInSeconds: data?.expiresInSeconds };
};

/** Checks the code. Throws OTP_INVALID (with data.attemptsRemaining), OTP_EXPIRED, OTP_LOCKED… */
export const verifyContactCode = async (otp) => {
  const { challengeToken } = readDraft();
  if (!challengeToken) throw fail('OTP_NOT_SENT', 'No code sent');
  const { data } = await api.post('/auth/contact-verification/verify', {
    challengeToken,
    otp: String(otp),
  });
  saveSignupDraft({ verificationToken: data?.verificationToken || null, contactVerified: true });
  log('code verified; test bypass:', Boolean(data?.viaTestBypass));
  return data;
};

// UI gender labels on the identity step -> mapGender keys.
const GENDER_KEYS = {
  Male: 'male',
  Female: 'female',
  'Non-binary': 'non-binary',
  'Prefer not to say': 'prefer-not',
};
export const toGenderKey = (label) => GENDER_KEYS[label] || '';

/** Creates the parent account. Returns { email } — the parent logs in next. */
export const registerParent = async () => {
  const d = readDraft();
  if (!passwordInMemory) throw fail('PASSWORD_MISSING', 'Please set your password again.');
  if (!d.contactVerified) throw fail('CONTACT_NOT_VERIFIED', 'Please confirm your email first.');
  const email = String(d.email || '')
    .trim()
    .toLowerCase();
  const userData = {
    firstName: d.firstName?.trim(),
    middleName: d.middleName?.trim() || undefined,
    lastName: d.lastName?.trim(),
    gender: mapGender(toGenderKey(d.gender)) || undefined,
    dateOfBirth: toIsoDate(d.dateOfBirth) || undefined,
    nationality: d.nationality || undefined,
    phoneNumber: toGhanaE164(d.phone),
    whatsappNumber: toGhanaE164(d.whatsapp) || undefined,
    ghanaCardNumber: d.ghanaCardNumber?.trim() || undefined,
  };
  log('register parent', {
    hasPhone: Boolean(userData.phoneNumber),
    fields: Object.keys(userData),
  });
  const { data } = await api.post('/auth/register', {
    email,
    password: passwordInMemory,
    entityType: 'parent',
    organizationId: TENANT_ORG_ID,
    userData,
  });
  passwordInMemory = null;
  const result = { email, entityId: data?.user?.entityId || data?.entity?.id || null };
  // Keep only what the done page needs; drop the personal details from storage.
  writeDraft({ created: result, firstName: d.firstName });
  log('parent account created', { entityType: data?.user?.entityType });
  return result;
};
