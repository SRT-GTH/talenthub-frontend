import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterCompany.api');

/*
 * Recruiter Career Buddy: company profile and KYB documents (backend recruiterAffiliation).
 *
 *   GET  /recruiter/company       { hasOrganisation, canEdit, company, completion, kyb: { status, verified, label } }
 *   PUT  /recruiter/company       { bio, culture[], address, website, socials{}, ... } (organisation admins)
 *   POST /media/upload            multipart, then
 *   POST /recruiter/kyb/submit    { registrationCertUrl } -> status kyb_submitted (a person reviews it)
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const fetchCompany = async () => {
  const out = unwrap(await api.get('/recruiter/company'));
  log('company', { has: out?.hasOrganisation, completion: out?.completion, kyb: out?.kyb?.status });
  return out;
};

export const saveCompany = async (body) => unwrap(await api.put('/recruiter/company', body));

export const companyErrorText = (err) => {
  const type = err?.response?.data?.type;
  if (type === 'NOT_ORG_ADMIN')
    return 'Only your organisation’s admin can change the company profile.';
  if (type === 'NO_ORGANISATION')
    return 'Your account isn’t linked to an organisation yet, so there’s no company profile to save.';
  if (type === 'VALIDATION_ERROR')
    return 'Some details are too long or not valid. Please check them.';
  return 'That didn’t save. Please try again.';
};

/** Upload one KYB document and submit it for review. Resolves the new KYB status. */
export const uploadKybDocument = async (file) => {
  const form = new FormData();
  // Fields before the file (the backend streams the file as soon as it arrives).
  form.append('type', 'document');
  form.append('entityType', 'recruiter');
  form.append('category', 'kyb');
  form.append('file', file, file.name);
  const res = await api.post('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 5 * 60 * 1000,
  });
  const body = Array.isArray(res?.data) ? res.data[0] : res?.data;
  const data = body?.data !== undefined ? body.data : body;
  const uploaded = data?.file || body?.file;
  if (!uploaded?.url) throw new Error('Upload response has no file url');
  const out = unwrap(
    await api.post('/recruiter/kyb/submit', { registrationCertUrl: uploaded.url })
  );
  log('kyb submitted', out?.affiliationRequest?.status || out?.status);
  return out;
};
