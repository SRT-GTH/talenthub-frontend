import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('talentProfile.api');

/*
 * Talent profile page (/profile) data, 2026-10-18. Every call is independent: a failing call
 * leaves its section in an honest empty state (never the Figma demo data).
 *
 *   GET /profiles/me                         the profile document
 *   GET /profiles/journey                    9 stages + milestone (profile strength)
 *   GET /engagement/skills/verifications/me  skill verification rows (Verified / Endorsed / Self-added)
 *   GET /activity/me?verb=view&period=7d     who viewed me this week
 *   GET /engagement/assessments/results/me   Big Five / RIASEC results (How I work)
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const settle = async (label, fn) => {
  try {
    return await fn();
  } catch (err) {
    log.error(`${label} failed:`, err?.response?.status || err?.message);
    return null;
  }
};

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
  } catch {
    return null;
  }
};

export const fetchTalentProfile = async () => {
  const [profileRes, journey, verifs, views, results] = await Promise.all([
    settle('profile', async () => unwrap(await api.get('/profiles/me'))),
    settle('journey', async () => unwrap(await api.get('/profiles/journey'))),
    settle('verifications', async () =>
      unwrap(await api.get('/engagement/skills/verifications/me'))
    ),
    settle('activity', async () =>
      unwrap(await api.get('/activity/me', { params: { verb: 'view', period: '7d' } }))
    ),
    settle('assessments', async () => unwrap(await api.get('/engagement/assessments/results/me'))),
  ]);
  const profile = profileRes?.profile || profileRes || null;
  if (!profile) {
    const err = new Error('Profile unavailable');
    err.code = 'UNAVAILABLE';
    throw err;
  }
  const data = {
    profile,
    user: storedUser() || {},
    journey: journey || null,
    verifications: verifs?.rows || [],
    views: views || null,
    assessments: results?.rows || [],
  };
  log('loaded', {
    stages: journey?.doneCount,
    verifications: data.verifications.length,
    assessments: data.assessments.length,
  });
  return data;
};

/*
 * Profile photo (2026-10-31): POST /media/upload (multipart: type=image, entityType=talent, category=profile_photo;
 * the backend takes jpg / jpeg / png / gif / webp up to 10 MB), then the caller saves the url as profile.profilePhoto.
 * Fields go BEFORE the file: the backend's multipart parser only sees fields that arrive ahead of the file.
 */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

export const photoFileProblem = (file) => {
  if (!file) return 'Choose a photo to upload.';
  if (!PHOTO_TYPES.includes(file.type)) return 'Choose a JPG, PNG, WebP or GIF image.';
  if (file.size > PHOTO_MAX_BYTES) return 'That photo is over 10 MB. Choose a smaller one.';
  if (!file.size) return 'That file is empty. Choose another photo.';
  return null;
};

/* Profile photo and banner (2026-11-01) go up the same way; the category picks the folder and the size cap. */
const uploadProfileImage = async (file, category) => {
  const form = new FormData();
  form.append('type', 'image');
  form.append('entityType', 'talent');
  form.append('category', category);
  form.append('file', file, file.name || `${category}.jpg`);
  log('image upload', { category, bytes: file.size, type: file.type });
  const res = await api.post('/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 2 * 60 * 1000,
  });
  // A moleculer-web multipart alias answers with one result per file (an array).
  const body = Array.isArray(res?.data) ? res.data[0] : res?.data;
  const data = body?.data !== undefined ? body.data : body;
  const uploaded = data?.file || body?.file;
  if (!uploaded?.url) throw new Error('Upload response has no file url');
  return uploaded.url;
};

export const uploadProfilePhoto = (file) => uploadProfileImage(file, 'profile_photo');

/* The banner across the top of the profile; the caller saves the url as profile.bannerImage. */
export const uploadProfileBanner = (file) => uploadProfileImage(file, 'profile_banner');
