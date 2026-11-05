import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('recruiterJobs.api');

/*
 * Recruiter Career Buddy job post (Figma "Post a Job": conversation, file upload or manual form,
 * then "Confirm & Post Job"). Backend: opportunity.service postFromBuddy / extractFromDocument.
 *
 *   POST /opportunities/from-buddy          { form }  → creates and publishes; 422 JOB_POST_INVALID
 *                                                       with data.problems naming the fields to fix
 *   POST /opportunities/extract-document    { fileBuffer (base64), fileType: pdf | docx }
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const postJobFromBuddy = async (form) => {
  const out = unwrap(await api.post('/opportunities/from-buddy', { form }));
  log('posted', out?.opportunity?.id);
  return out;
};

/** File types the backend can read a job description from. */
export const jdFileType = (name) => {
  const ext = String(name || '')
    .split('.')
    .pop()
    .toLowerCase();
  return ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : null;
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error || new Error('read failed'));
    reader.readAsDataURL(file);
  });

export const extractJobDocument = async (file) => {
  const fileType = jdFileType(file?.name);
  if (!fileType) throw Object.assign(new Error('unsupported'), { code: 'UNSUPPORTED_FILE' });
  const fileBuffer = await toBase64(file);
  const out = unwrap(await api.post('/opportunities/extract-document', { fileBuffer, fileType }));
  log(
    'extracted',
    Object.keys(out?.fields || {}).filter((k) => out.fields[k])
  );
  return out?.fields || {};
};

const FIELD_LABEL = {
  jobTitle: 'a job title (3 to 200 characters)',
  description: 'a job description',
  companyName: 'the company name',
  deadline: 'an application deadline',
  deadline_past: 'a deadline in the future',
  salary: 'a valid salary (the minimum can’t be above the maximum)',
  category: 'a job type',
};

/** Human copy for a failed post. */
export const jobPostErrorText = (err) => {
  const data = err?.response?.data;
  const type = data?.type || data?.code;
  if (type === 'JOB_POST_INVALID') {
    const problems = data?.data?.problems || [];
    // Fair-hiring check: wording that limits who can apply by age, gender, religion and so on.
    const flags = data?.data?.flags || [];
    const reword = flags.length
      ? `Please reword ${flags.map((f) => `"${f.phrase}" (${f.reason})`).join(', ')}. Job posts can\u2019t limit who applies by ${[...new Set(flags.map((f) => f.reason))].join(' or ')}.`
      : '';
    const parts = problems.map((p) => FIELD_LABEL[p]).filter(Boolean);
    const add = parts.length ? `Please add ${parts.join(', ')}.` : '';
    return [add, reword].filter(Boolean).join(' ') || 'Some job details need fixing.';
  }
  if (type === 'ACCOUNT_SUSPENDED')
    return 'Your account is suspended, so jobs can\u2019t be posted.';
  if (type === 'POSTING_LIMIT_EXCEEDED')
    return 'You can post up to 10 jobs a day. Please try again tomorrow.';
  if (type === 'RECRUITER_ONLY') return 'Only recruiter accounts can post jobs.';
  return 'The job couldn’t be posted. Please try again.';
};
