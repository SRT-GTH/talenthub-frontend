import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { toGhanaE164, splitFullName } from './onboardingMappers.js';
import { debug } from '../utils/debug.js';

const log = debug('institution.api');

/*
 * Institution onboarding (registration part).
 *
 *   1. Your institution  -> saved to the draft (sessionStorage)
 *   2. Contact           -> draft + POST /auth/contact-verification/send
 *      code modal        -> POST /auth/contact-verification/verify -> verificationToken
 *   3. Activate          -> POST /auth/register-organization-with-contact
 *                           (with the verificationToken; returns a login session)
 *
 * The password is never written to storage: it lives in memory until the
 * account is created. After a page refresh the contact step asks for it
 * again. On staging the code 123456 works while ENABLE_TEST_OTP_BYPASS=1.
 */

const DRAFT_KEY = 'th:institution-draft';
const ORG_KEY = 'th:institution-org';
// Organization-type code for schools on the backend (GET /organization-types).
const ORG_TYPE = import.meta.env.VITE_INSTITUTION_ORG_TYPE || 'education';

let passwordInMemory = null;

const readJson = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
};
const writeJson = (key, value) => {
  try {
    if (value == null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the in-memory flow still works this session */
  }
};

export const getInstitutionDraft = () => readJson(DRAFT_KEY) || {};

export const saveInstitutionDraft = (patch) => {
  const next = { ...getInstitutionDraft(), ...patch };
  writeJson(DRAFT_KEY, next);
  log('draft saved; sections:', Object.keys(next));
  return next;
};

export const setContactPassword = (password) => {
  passwordInMemory = password || null;
};
export const hasContactPassword = () => Boolean(passwordInMemory);

/** The registered organization (for the bulk-upload steps). */
export const getRegisteredInstitution = () => readJson(ORG_KEY);

export const clearInstitutionOnboarding = () => {
  writeJson(DRAFT_KEY, null);
  passwordInMemory = null;
};

/** "Accra Technical College" -> "accra-technical-college" */
export const slugify = (name) =>
  String(name || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** POST /auth/contact-verification/send -> { maskedEmail } */
export const sendContactCode = async ({ email, firstName }) => {
  log('send contact code');
  const { data } = await api.post('/auth/contact-verification/send', { email, firstName });
  saveInstitutionDraft({ challengeToken: data.challengeToken, verificationToken: null });
  return data;
};

/** POST /auth/contact-verification/verify -> stores the verificationToken */
export const verifyContactCode = async (otp) => {
  const { challengeToken } = getInstitutionDraft();
  if (!challengeToken) {
    const err = new Error('Request a new code first');
    err.code = 'OTP_NOT_SENT';
    throw err;
  }
  const { data } = await api.post('/auth/contact-verification/verify', {
    challengeToken,
    otp: String(otp),
  });
  saveInstitutionDraft({
    verificationToken: data.verificationToken,
    contactVerifiedAt: new Date().toISOString(),
  });
  log('contact verified');
  return data;
};

/**
 * POST /auth/register-organization-with-contact.
 * Builds the payload from the draft; on success stores the login session
 * and the new organization, and clears the draft.
 */
export const registerInstitution = async ({ termsVersion = '2026-10' } = {}) => {
  const draft = getInstitutionDraft();
  const inst = draft.institution || {};
  const contact = draft.contact || {};
  if (!passwordInMemory) {
    const err = new Error('Please re-enter your password on the contact step.');
    err.code = 'PASSWORD_MISSING';
    throw err;
  }
  const slug = slugify(inst.legalName);
  const { first, last } = splitFullName(contact.fullName);
  const acceptedAt = new Date().toISOString();

  const payload = {
    orgPayload: {
      uid: slug,
      slug,
      name: inst.legalName.trim(),
      type: ORG_TYPE,
      platformTenantId: import.meta.env.VITE_TENANT_ORG_ID,
      metadata: {
        country: 'GH',
        tradingName: inst.tradingName?.trim() || null,
        institutionCategory: inst.institutionType || null,
        region: inst.region || null,
        district: inst.district || null,
        termsAcceptedAt: acceptedAt,
        privacyAcceptedAt: acceptedAt,
        dataProcessingAcceptedAt: acceptedAt,
        termsVersion,
      },
    },
    contactUser: {
      email: contact.email.trim(),
      firstName: first,
      lastName: last || first,
      phoneNumber: toGhanaE164(contact.phoneNumber),
      password: passwordInMemory,
      roleAtOrganization: contact.roleTitle,
      jobTitle: contact.roleTitle,
    },
    ...(draft.verificationToken ? { contactVerificationToken: draft.verificationToken } : {}),
  };

  log('register institution:', slug);
  const { data } = await api.post('/auth/register-organization-with-contact', payload);
  const session = data?.session;
  if (session?.accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, session.accessToken);
    if (session.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    if (session.user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(session.user));
  }
  writeJson(ORG_KEY, {
    id: data?.organization?.id,
    name: data?.organization?.name,
    slug: data?.organization?.slug,
    contactEmail: contact.email.trim(),
    loggedIn: Boolean(session?.accessToken),
  });
  clearInstitutionOnboarding();
  log('registered; logged in:', Boolean(session?.accessToken));
  return data;
};
