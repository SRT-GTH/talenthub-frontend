import api from './api.js';
import { debug } from '../utils/debug.js';
import { readFileAsBase64 } from './cv.api.js';

const log = debug('certificate.api');

/*
 * Certificate file (2026-11-01). The Certifications stage said "upload and we fill in the fields" but threw the file
 * away. Now:
 *   1. POST /media/upload (multipart: type=document|image, entityType=talent, category=certificates) stores the file;
 *      the url is saved as profile.certifications[].certificateFile.secure_url.
 *   2. POST /profiles/cv/extract-certificate { fileBuffer, fileType: 'pdf'|'jpg'|'png', fileName } reads a PDF's text
 *      into suggested fields (nothing is saved by it). Photos come back { readable:false, reason:'PHOTO' } - no OCR yet.
 */
export const CERT_FILE_MAX_BYTES = 10 * 1024 * 1024;

/* 'pdf' | 'jpg' | 'png' | null, by extension then MIME type. */
export const certFileType = (file) => {
  const name = String(file?.name || '').toLowerCase();
  if (name.endsWith('.pdf') || file?.type === 'application/pdf') return 'pdf';
  if (/\.(jpe?g)$/.test(name) || file?.type === 'image/jpeg') return 'jpg';
  if (name.endsWith('.png') || file?.type === 'image/png') return 'png';
  return null;
};

export const certFileProblem = (file) => {
  if (!file) return 'Choose a file to upload.';
  if (!certFileType(file)) return 'Choose a PDF, JPG or PNG file.';
  if (!file.size) return 'That file is empty. Choose another one.';
  if (file.size > CERT_FILE_MAX_BYTES) return 'That file is over 10 MB. Choose a smaller one.';
  return null;
};

export const fileSizeLabel = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/* Stores the file; resolves its url. */
export const uploadCertificateFile = async (file) => {
  const kind = certFileType(file);
  const form = new FormData();
  // Fields go BEFORE the file: the backend's multipart parser only sees fields that arrive ahead of it.
  form.append('type', kind === 'pdf' ? 'document' : 'image');
  form.append('entityType', 'talent');
  form.append('category', 'certificates');
  form.append('file', file, file.name || `certificate.${kind}`);
  log('upload', { bytes: file.size, kind });
  const res = await api.post('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 2 * 60 * 1000,
  });
  const body = Array.isArray(res?.data) ? res.data[0] : res?.data;
  const data = body?.data !== undefined ? body.data : body;
  const uploaded = data?.file || body?.file;
  if (!uploaded?.url) throw new Error('Upload response has no file url');
  return uploaded.url;
};

/* Suggested fields from the file: { readable, reason?, fields? }. Never throws for "couldn't read". */
export const extractCertificate = async (file) => {
  const fileType = certFileType(file);
  const fileBuffer = await readFileAsBase64(file);
  const res = await api.post(
    '/profiles/cv/extract-certificate',
    { fileBuffer, fileType, fileName: file.name },
    { timeout: 90_000 }
  );
  const body = res?.data?.data !== undefined ? res.data.data : res?.data;
  log('extracted', { readable: body?.readable, reason: body?.reason, filled: body?.filled });
  return body || { readable: false, reason: 'EMPTY' };
};

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
/* { value: 'YYYY-MM' } -> 'MM / YYYY' (the form's format); year-only dates are left for the talent to complete. */
export const toFormMonth = (d) => {
  const m = /^(\d{4})-(\d{2})$/.exec(d?.value || '');
  return m && MONTHS.includes(m[2]) ? `${m[2]} / ${m[1]}` : '';
};
