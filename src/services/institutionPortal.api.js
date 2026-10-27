import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { splitFullName, toGhanaE164 } from './onboardingMappers.js';
import { slugify } from './institution.api.js';

/*
 * Institution (school) portal API (backend services/institution*.service.js).
 *   /institution/me, /settings          the signed-in institution and its staff member
 *   /institution/accreditation/*        accreditation documents (private files, base64 JSON)
 *   /institution/students/*             the roster: list, one student, add, CSV import, reminders, guardian consent, remove, transfer
 *   /admin/institutions/*               GTH staff: accreditation reviews
 *   /school-links                       a student's "is this your school?" requests
 *   /guardian-consent/:token            a guardian's answer (public)
 * The older sign-up / bulk upload flow (/onboarding/institution) stays in institution.api.js and institutionBulk.js.
 */

const body = (res) => (res && res.data && res.data.data !== undefined ? res.data.data : res.data);

/* ---- sign-up (/institution/sign-up): duplicate check, email code, registration ---- */

export const institutionSignupCheck = ({ gesNumber, email }) =>
  api.post('/institution-signup/check', { gesNumber, email }).then(body);

/** POST /auth/contact-verification/send -> { challengeToken, maskedEmail } */
export const sendInstitutionCode = ({ email, firstName }) =>
  api.post('/auth/contact-verification/send', { email, firstName }).then((r) => r.data);

/** POST /auth/contact-verification/verify -> { verificationToken } */
export const verifyInstitutionCode = ({ challengeToken, otp }) =>
  api
    .post('/auth/contact-verification/verify', { challengeToken, otp: String(otp) })
    .then((r) => r.data);

/**
 * POST /auth/register-organization-with-contact (an "education" organisation + its contact as the institution admin). Stores the login
 * session it returns. details: {name, short, gesNumber, type, digitalAddress, region, contactName, contactTitle, email, password}; contact: {phone, office}.
 */
export const registerPortalInstitution = async ({ details, contact, verificationToken }) => {
  const slug = slugify(details.short || details.name);
  const { first, last } = splitFullName(details.contactName);
  const acceptedAt = new Date().toISOString();
  const ges = details.gesNumber.trim();
  const payload = {
    orgPayload: {
      uid: `${slug}-${Date.now().toString(36).slice(-4)}`,
      slug,
      name: details.name.trim(),
      type: import.meta.env.VITE_INSTITUTION_ORG_TYPE || 'education',
      platformTenantId: import.meta.env.VITE_TENANT_ORG_ID,
      metadata: {
        country: 'GH',
        short: details.short?.trim() || null,
        tradingName: details.short?.trim() || null,
        institutionCategory: details.type,
        gesNumber: ges,
        gesNumberKey: ges.toUpperCase().replace(/\s+/g, ''),
        digitalAddress: details.digitalAddress.trim().toUpperCase(),
        region: details.region,
        contactEmail: details.email.trim().toLowerCase(),
        contactPhone: toGhanaE164(contact.phone),
        officePhone: contact.office ? toGhanaE164(contact.office) : null,
        termsAcceptedAt: acceptedAt,
        privacyAcceptedAt: acceptedAt,
        dataProcessingAcceptedAt: acceptedAt,
        termsVersion: '2026-10',
        createdFrom: 'institution-portal',
      },
    },
    contactUser: {
      email: details.email.trim().toLowerCase(),
      firstName: first,
      lastName: last || first,
      phoneNumber: toGhanaE164(contact.phone),
      password: details.password,
      roleAtOrganization: details.contactTitle?.trim() || 'Administrator',
      jobTitle: details.contactTitle?.trim() || 'Administrator',
    },
    ...(verificationToken ? { contactVerificationToken: verificationToken } : {}),
  };
  // Registration creates the organisation, tenant, entities, roles and permissions in sequence: ~20 s against the staging database.
  const { data } = await api.post('/auth/register-organization-with-contact', payload, {
    timeout: 120000,
  });
  const session = data?.session || data?.data?.session;
  if (session?.accessToken) {
    localStorage.setItem(STORAGE_KEYS.authToken, session.accessToken);
    if (session.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
    if (session.user) localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(session.user));
  }
  return {
    organization: data?.organization || data?.data?.organization,
    loggedIn: Boolean(session?.accessToken),
  };
};

/** The crest is public (it appears on the public page): it goes to the media store, and its URL to the profile. */
export const uploadInstitutionCrest = async (file) => {
  const base64String = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error || new Error('Could not read the file'));
    r.readAsDataURL(file);
  });
  const { data } = await api.post(
    '/media/upload-base64',
    { base64String, type: 'image', entityType: 'organization', category: 'institution-crest' },
    { timeout: 60000 }
  );
  const d = data?.data || data || {};
  const url = d.url || d.secure_url || d.secureUrl || d.file?.url;
  if (url) await institutionUpdateProfile({ crestUrl: url });
  return url;
};

export const institutionMe = () => api.get('/institution/me').then(body);
/* ---- Settings: staff, notifications, capabilities, data card, audit log (backend institutionTeam.service.js) ---- */
export const institutionStaff = () => api.get('/institution/staff').then(body);
export const institutionInviteStaff = ({ name, email, role }) =>
  api.post('/institution/staff', { name, email, role }, { timeout: 60000 }).then(body);
export const institutionSetStaffRole = (id, role) =>
  api.patch(`/institution/staff/${id}`, { role }).then(body);
export const institutionResendStaff = (id) =>
  api.post(`/institution/staff/${id}/resend`, {}).then(body);
export const institutionRemoveStaff = (id) => api.delete(`/institution/staff/${id}`).then(body);
export const institutionNotifications = () =>
  api.get('/institution/settings/notifications').then(body);
export const institutionUpdateNotifications = (patch) =>
  api.patch('/institution/settings/notifications', patch).then(body);
export const institutionUpdateCapabilities = (patch) =>
  api.patch('/institution/settings/capabilities', patch).then(body);
export const institutionDataState = () => api.get('/institution/settings/data').then(body);
export const institutionSetPaused = (paused) =>
  api.patch('/institution/settings/pause', { paused }).then(body);
export const institutionCloseRequest = (reason) =>
  api.post('/institution/settings/close-request', { reason }).then(body);
export const institutionAudit = ({ tab, kind, page }) =>
  api.get('/institution/audit', { params: { tab, kind, page } }).then(body);
/** -> { fileName, mime, content (base64) } */
export const institutionAuditExport = (tab) =>
  api.post('/institution/audit/export', { tab }, { timeout: 60000 }).then(body);
export const institutionRosterExport = () =>
  api.post('/institution/roster/export', {}, { timeout: 60000 }).then(body);

export const institutionHome = () => api.get('/institution/home', { timeout: 60000 }).then(body);
export const institutionWelcomeSeen = () =>
  api.post('/institution/home/welcome-seen', {}).then(body);
export const institutionSettings = () => api.get('/institution/settings').then(body);
export const institutionUpdateProfile = (patch) =>
  api.patch('/institution/settings/profile', patch).then(body);

export const institutionAccreditation = () => api.get('/institution/accreditation').then(body);
export const institutionAccreditationUpload = (payload) =>
  api.post('/institution/accreditation/documents', payload, { timeout: 120000 }).then(body);
export const institutionAccreditationDetails = (kind, details) =>
  api.put(`/institution/accreditation/details/${kind}`, { details }).then(body);
export const institutionAccreditationRemove = (id) =>
  api.delete(`/institution/accreditation/documents/${id}`).then(body);
export const institutionAccreditationFile = (id) =>
  api.get(`/institution/accreditation/documents/${id}/file`, { timeout: 120000 }).then(body);
export const institutionAccreditationSubmit = () =>
  api.post('/institution/accreditation/submit', {}).then(body);

export const institutionStudents = () =>
  api.get('/institution/students', { timeout: 60000 }).then(body);
export const institutionStudent = (id) => api.get(`/institution/students/${id}`).then(body);
export const institutionUpdateStudent = (id, patch) =>
  api.patch(`/institution/students/${id}`, patch).then(body);
export const institutionAddStudent = (payload) =>
  api.post('/institution/students', payload, { timeout: 60000 }).then(body);
export const institutionImportStudents = (rows, commit, invite = true) =>
  api
    .post('/institution/students/import', { rows, commit, invite }, { timeout: 300000 })
    .then(body);
export const institutionRemindStudents = (ids) =>
  api.post('/institution/students/remind', ids ? { ids } : {}, { timeout: 60000 }).then(body);
export const institutionSendConsent = (ids) =>
  api.post('/institution/students/consent', ids ? { ids } : {}, { timeout: 60000 }).then(body);
export const institutionRemoveStudent = (id, reason) =>
  api.post(`/institution/students/${id}/remove`, { reason }).then(body);
export const institutionTransferStudent = (id, to, note) =>
  api.post(`/institution/students/${id}/transfer`, { to, note }).then(body);

export const adminAccreditationQueue = () =>
  api.get('/admin/institutions/accreditation').then(body);
export const adminAccreditationOf = (orgId) =>
  api.get(`/admin/institutions/${orgId}/accreditation`).then(body);
export const adminAccreditationFile = (orgId, docId) =>
  api
    .get(`/admin/institutions/${orgId}/accreditation/documents/${docId}/file`, { timeout: 120000 })
    .then(body);
export const adminAccreditationReviewDoc = (orgId, docId, payload) =>
  api
    .post(`/admin/institutions/${orgId}/accreditation/documents/${docId}/review`, payload)
    .then(body);
export const adminAccreditationDecide = (orgId, payload) =>
  api.post(`/admin/institutions/${orgId}/accreditation/decide`, payload).then(body);

export const mySchoolLinks = () => api.get('/school-links').then(body);
export const answerSchoolLink = (id, accept) =>
  api.post(`/school-links/${id}/${accept ? 'accept' : 'decline'}`, {}).then(body);

/* ---- organisation invites (the link in the invite email: /auth/complete-invite/:token) ---- */
export const inviteInfo = (token) =>
  api.get(`/institution-signup/invite/${encodeURIComponent(token)}`).then(body);
/** Finishes the invite: creates the account with the invitee's password (and phone when the invite has none). */
export const completeInvite = (token, { password, phoneNumber }) =>
  api
    .post(
      `/users/complete-invite/${encodeURIComponent(token)}`,
      {
        password,
        ...(phoneNumber ? { additionalData: { phoneNumber: toGhanaE164(phoneNumber) } } : {}),
      },
      { timeout: 120000 }
    )
    .then(body);

export const guardianConsentInfo = (token) => api.get(`/guardian-consent/${token}`).then(body);
export const guardianConsentAnswer = (token, decision) =>
  api.post(`/guardian-consent/${token}`, { decision }).then(body);

/** The server's message for a failed call (axios hides it under response.data). */
export const apiMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Try again.';
