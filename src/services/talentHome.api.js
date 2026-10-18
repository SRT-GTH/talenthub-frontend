import api from './api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('talentHome.api');

/*
 * Talent dashboard (/home) data, 2026-10-18 (Phase 1).
 *
 *   GET /profiles/journey                 9 stages + milestone (backend #155)
 *   GET /profiles/me                      name, target career
 *   GET /guidance/opportunities           matched roles
 *   GET /applications/my-applications     my applications
 *   GET /notifications                    recent activity
 *   GET /engagement/skills/verifications/me   verified skills count
 *   GET /guidance/readiness/:career       job readiness (only at Top 20%+)
 *
 * Every call is independent: one failing card shows its empty state, the
 * rest still render.
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

// First desired career, as the readiness endpoint expects it ("fashion designer").
export const targetCareerOf = (profile) => {
  const goals = profile?.careerGoals || {};
  if (goals.targetCareer) return goals.targetCareer;
  const first = (profile?.desiredCareers || [])[0];
  if (!first) return null;
  return typeof first === 'string' ? first : first.careerName || first.title || first.name || null;
};

export const fetchTalentHome = async () => {
  const [journey, profileRes, opps, apps, notifs, verifs] = await Promise.all([
    settle('journey', async () => unwrap(await api.get('/profiles/journey'))),
    settle('profile', async () => unwrap(await api.get('/profiles/me'))),
    settle('opportunities', async () =>
      unwrap(await api.get('/guidance/opportunities', { params: { pageSize: 3 } }))
    ),
    settle('applications', async () => unwrap(await api.get('/applications/my-applications'))),
    settle('notifications', async () =>
      unwrap(await api.get('/notifications', { params: { limit: 7 } }))
    ),
    settle('verifications', async () =>
      unwrap(await api.get('/engagement/skills/verifications/me'))
    ),
  ]);
  const profile = profileRes?.profile || profileRes || {};
  const user = storedUser() || {};
  const targetCareer = targetCareerOf(profile);
  const readinessOpen = journey && journey.doneCount >= 6;
  const readiness =
    readinessOpen && targetCareer
      ? await settle('readiness', async () =>
          unwrap(await api.get(`/guidance/readiness/${encodeURIComponent(targetCareer)}`))
        )
      : null;

  const data = {
    firstName: profile.firstName || user.firstName || '',
    lastName: profile.lastName || user.lastName || '',
    city: profile.city || user.locality || user.district || '',
    targetCareer,
    journey,
    matches: { total: opps?.total ?? 0, items: opps?.matches || [] },
    applications: { total: apps?.total ?? apps?.count ?? 0, items: apps?.applications || [] },
    notifications: { unread: notifs?.unreadCount ?? 0, items: notifs?.notifications || [] },
    verifiedSkills: verifs?.total ?? 0,
    readiness,
    loginCount: user.loginCount ?? null,
  };
  log('loaded', {
    stages: journey?.doneCount,
    matches: data.matches.total,
    applications: data.applications.total,
    readiness: Boolean(readiness),
  });
  return data;
};
