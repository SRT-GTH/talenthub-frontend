import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('media.api');

/*
 * Generic talent file upload (2026-11-01): POST /media/upload (multipart). Fields go BEFORE the file - the backend's
 * multipart parser only sees fields that arrive ahead of it. The backend checks the bytes match `type`.
 * Resolves the stored file's url.
 */
export const uploadTalentFile = async (file, { type, category }) => {
  const form = new FormData();
  form.append('type', type);
  form.append('entityType', 'talent');
  form.append('category', category);
  form.append('file', file, file.name || `${category}-upload`);
  log('upload', { category, type, bytes: file.size });
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

/* The server's message for a refused upload ("This file doesn't look like an image..."), else a plain fallback. */
export const uploadErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  const body = Array.isArray(data) ? data[0] : data;
  const msg = body?.message || body?.error?.message;
  return typeof msg === 'string' && msg.length < 200 ? msg : fallback;
};
