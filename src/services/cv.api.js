import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('cv.api');

/*
 * Upload my CV — read a CV into profile suggestions (nothing is saved by this call).
 *
 *   POST /profiles/cv/extract   { fileBuffer: <base64, no data: prefix>, fileType: 'pdf'|'docx', fileName }
 *     200 { success, data: { roles:[{ company, position, location, startDate:'YYYY-MM'|null, endDate:'YYYY-MM'|null,
 *                                     isCurrent, description }],
 *                            education:[{ institution, degree, fieldOfStudy, startYear, endYear }],
 *                            skills:[{ name, kind:'technical'|'soft' }],
 *                            certifications:[{ name, issuingOrganization, issueDate:'YYYY-MM'|null }],
 *                            warnings:[string] } }
 *     422 CV_UNREADABLE (scanned / empty) · 503 CV_EXTRACTION_UNAVAILABLE · 400/413 VALIDATION_ERROR (type / size)
 *
 * extractCv rejects with a CvError whose `code` is one of CV_ERROR (below); the page picks its error screen from it.
 * Saving the picked items is the page's job (profileStages.api saveProfileFields).
 */
export const CV_MAX_BYTES = 10 * 1024 * 1024;
const EXTRACT_TIMEOUT_MS = 90_000; // reading a CV can take a while server-side

export const CV_ERROR = {
  UNREADABLE: 'CV_UNREADABLE',
  UNAVAILABLE: 'CV_EXTRACTION_UNAVAILABLE',
  TOO_LARGE: 'CV_TOO_LARGE',
  UNSUPPORTED: 'CV_UNSUPPORTED',
  RATE_LIMITED: 'CV_RATE_LIMITED',
  CANCELLED: 'CV_CANCELLED',
  FAILED: 'CV_FAILED',
};

export class CvError extends Error {
  constructor(code, message, status = null) {
    super(message || code);
    this.name = 'CvError';
    this.code = code;
    this.status = status;
  }
}

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/* 'pdf' | 'docx' | null — by extension first, then MIME type. */
export const cvFileType = (file) => {
  const name = String(file?.name || '').toLowerCase();
  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.docx')) return 'docx';
  if (file?.type === 'application/pdf') return 'pdf';
  if (file?.type === DOCX_MIME) return 'docx';
  return null;
};

/* Client-side check before anything is sent: { ok } | { ok:false, code: TOO_LARGE | UNSUPPORTED }. */
export const checkCvFile = (file) => {
  if (!file) return { ok: false, code: CV_ERROR.UNSUPPORTED };
  if (!cvFileType(file)) return { ok: false, code: CV_ERROR.UNSUPPORTED };
  if (file.size > CV_MAX_BYTES) return { ok: false, code: CV_ERROR.TOO_LARGE };
  return { ok: true };
};

/* File -> base64 string without the "data:...;base64," prefix. */
export const readFileAsBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const comma = text.indexOf(',');
      resolve(comma >= 0 ? text.slice(comma + 1) : text);
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read the file'));
    reader.readAsDataURL(file);
  });

const list = (value) => (Array.isArray(value) ? value : []);

const toCvError = (err) => {
  if (err instanceof CvError) return err;
  if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') {
    return new CvError(CV_ERROR.CANCELLED, 'Cancelled');
  }
  const status = err?.response?.status ?? null;
  const data = err?.response?.data || {};
  // Moleculer errors carry the string code in `type` (`code` is the numeric HTTP status); detail in data.reason.
  const code =
    [data.type, data.code, data.error?.code].find((c) => typeof c === 'string' && c) || null;
  const reason = data.data?.reason || null;
  const message = data.message || err?.message;
  if (code === CV_ERROR.UNREADABLE || status === 422)
    return new CvError(CV_ERROR.UNREADABLE, message, status);
  if (code === CV_ERROR.UNAVAILABLE || status === 503)
    return new CvError(CV_ERROR.UNAVAILABLE, message, status);
  if (status === 429 || code === 'RATE_LIMITED')
    return new CvError(CV_ERROR.RATE_LIMITED, message, status);
  if (status === 413 || reason === 'FILE_TOO_LARGE')
    return new CvError(CV_ERROR.TOO_LARGE, message, status);
  if (status === 400 || code === 'VALIDATION_ERROR')
    return new CvError(CV_ERROR.UNSUPPORTED, message, status);
  return new CvError(CV_ERROR.FAILED, message, status);
};

/*
 * Read a CV file into suggestions. Options: signal (AbortSignal, to cancel), onUploadProgress(percent 0-100).
 * Resolves { roles, education, skills, certifications, warnings } (arrays always present).
 */
export const extractCv = async (file, { signal, onUploadProgress } = {}) => {
  const check = checkCvFile(file);
  if (!check.ok) throw new CvError(check.code, 'File rejected before upload');
  const fileType = cvFileType(file);
  try {
    const fileBuffer = await readFileAsBase64(file);
    if (signal?.aborted) throw new CvError(CV_ERROR.CANCELLED, 'Cancelled');
    log('extract', { fileType, bytes: file.size });
    const res = await api.post(
      '/profiles/cv/extract',
      { fileBuffer, fileType, fileName: file.name },
      {
        timeout: EXTRACT_TIMEOUT_MS,
        signal,
        onUploadProgress: (e) => {
          if (!onUploadProgress || !e.total) return;
          onUploadProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
        },
      }
    );
    const body = res?.data?.data !== undefined ? res.data.data : res?.data;
    const out = {
      roles: list(body?.roles),
      education: list(body?.education),
      skills: list(body?.skills),
      certifications: list(body?.certifications),
      warnings: list(body?.warnings).filter((w) => typeof w === 'string' && w.trim()),
    };
    log('extracted', {
      roles: out.roles.length,
      education: out.education.length,
      skills: out.skills.length,
      certifications: out.certifications.length,
      warnings: out.warnings.length,
    });
    return out;
  } catch (err) {
    const e = toCvError(err);
    if (e.code !== CV_ERROR.CANCELLED) log.error('extract failed:', e.code, e.status, e.message);
    throw e;
  }
};
