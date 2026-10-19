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
