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
 *   GET /activity/me?period=7d            who viewed me this week (backend #156)
 *
 * MyAssessment tab (fetchTalentAssessment, loaded when the tab opens):
 *   GET /engagement/summary                    Big Five + RIASEC summary
 *   GET /engagement/assessments/results/me     assessment results (+ required types)
 *   GET /engagement/games/sessions/me          Skills Lab games
 *
 * Every call is independent: one failing card shows its empty state, the
 * rest still render.
 *
 * Loading (2026-10-19): the page no longer waits for every call. It renders
 * once the journey, the profile and the applications are back (those decide
 * which layout state shows) and the other sections fill in as their calls
 * land. Until then a section is listed in `data.pending` and shows a skeleton,
 * never a made-up zero. The last complete result is kept in memory for this
 * tab, so going back to /home shows it at once and refreshes in the background.
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

/**
 * 2026-10-21: the name the chrome shows before /home data arrives comes from the stored
 * user (saved at login). When the profile's name differs (renamed since login), update the
 * stored copy so the next page load starts on the right name instead of flashing the old one.
 */
export const rememberDisplayName = (firstName, lastName) => {
  try {
    const first = typeof firstName === 'string' ? firstName.trim() : '';
    const last = typeof lastName === 'string' ? lastName.trim() : '';
    if (!first) return;
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
    if (!user || (user.firstName === first && (user.lastName || '') === last)) return;
    localStorage.setItem(
      STORAGE_KEYS.userProfile,
      JSON.stringify({ ...user, firstName: first, lastName: last })
    );
  } catch {
    /* storage unavailable: the placeholder just shows the login-time name */
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

/** Sections that can still be loading after the page first renders. */
export const PENDING_SECTIONS = [
  'matches',
  'notifications',
  'verifiedSkills',
  'views',
  'readiness',
];

/* ---------------- In-memory cache (this tab only) ---------------- */

// Keyed to the signed-in person, so after a logout or an account switch the
// previous person's data can never be shown. Memory only: nothing is written
// to localStorage, and a reload starts fresh.
let cache = null; // { key, data?, assessment? }

const sessionKey = () => {
  let token = null;
  try {
    token = localStorage.getItem(STORAGE_KEYS.authToken);
  } catch {
    return null;
  }
  if (!token) return null;
  const user = storedUser() || {};
  const id = user.id || user._id || user.userId || user.entityId;
  return id ? `user:${id}` : `token:${token}`;
};

/** Cached /home data for the signed-in person, or null. */
export const peekTalentHome = () => {
  const key = sessionKey();
  return key && cache?.key === key ? cache : null;
};

export const clearTalentHomeCache = () => {
  cache = null;
};

const remember = (patch) => {
  const key = sessionKey();
  if (!key) return;
  cache = cache?.key === key ? { ...cache, ...patch } : { key, ...patch };
};

export const rememberTalentAssessment = (assessment) => remember({ assessment });

/* ---------------- Loading ---------------- */

const buildHomeData = (r, pendingSet) => {
  const profile = r.profile?.profile || r.profile || {};
  const user = storedUser() || {};
  const { opps, apps, notifs, verifs, activity } = r;
  return {
    firstName: profile.firstName || user.firstName || '',
    lastName: profile.lastName || user.lastName || '',
    city: profile.city || user.locality || user.district || '',
    targetCareer: targetCareerOf(profile),
    journey: r.journey,
    matches: { total: opps?.total ?? 0, items: opps?.matches || [] },
    applications: { total: apps?.total ?? apps?.count ?? 0, items: apps?.applications || [] },
    notifications: { unread: notifs?.unreadCount ?? 0, items: notifs?.notifications || [] },
    verifiedSkills: verifs?.total ?? 0,
    // Profile views this week (company level on the free tier); null if it failed.
    views: activity || null,
    readiness: r.readiness ?? null,
    loginCount: user.loginCount ?? null,
    // Kept for the MyAssessment tab (fetchTalentAssessment adds the rest).
    profileSkills: {
      technicalSkills: profile.technicalSkills || [],
      softSkills: profile.softSkills || [],
      desiredCareers: profile.desiredCareers || [],
      lastAssessedAt: profile.personalitySnapshot?.lastAssessedAt || null,
    },
    verifications: verifs?.rows || [],
    // { matches: true, ... } for each section whose call has not returned yet.
    pending: Object.fromEntries([...pendingSet].map((k) => [k, true])),
  };
};

/**
 * Loads /home data. `onUpdate(data)` is called as soon as the journey, the
 * profile and the applications are in, then again each time another section
 * arrives (`data.pending` lists what is still loading). Resolves with the
 * complete data, which is also cached for this tab.
 *
 * The journey is the one call the page cannot do without: a 401 rejects with
 * code UNAUTHORIZED (session expired), any other failure with UNAVAILABLE.
 */
export const loadTalentHome = ({ onUpdate } = {}) =>
  new Promise((resolve, reject) => {
    const r = {};
    const pending = new Set(PENDING_SECTIONS);
    let coreReady = false;
    let settled = false;

    const emit = () => {
      if (!coreReady || settled) return;
      const data = buildHomeData(r, pending);
      if (pending.size === 0) {
        settled = true;
        remember({ data });
        log('loaded', {
          stages: data.journey?.doneCount,
          matches: data.matches.total,
          applications: data.applications.total,
          readiness: Boolean(data.readiness),
        });
        onUpdate?.(data);
        resolve(data);
        return;
      }
      onUpdate?.(data);
    };

    const arrive = (section, field) => (value) => {
      r[field] = value;
      pending.delete(section);
      emit();
    };

    // Sections that fill in after the first render.
    settle('opportunities', async () =>
      unwrap(await api.get('/guidance/opportunities', { params: { pageSize: 3 } }))
    ).then(arrive('matches', 'opps'));
    settle('notifications', async () =>
      unwrap(await api.get('/notifications', { params: { limit: 7 } }))
    ).then(arrive('notifications', 'notifs'));
    settle('verifications', async () =>
      unwrap(await api.get('/engagement/skills/verifications/me'))
    ).then(arrive('verifiedSkills', 'verifs'));
    settle('activity', async () =>
      unwrap(await api.get('/activity/me', { params: { verb: 'view', period: '7d' } }))
    ).then(arrive('views', 'activity'));

    // The core: these decide the layout state, so the page waits for them.
    const journeyP = api.get('/profiles/journey').then(unwrap);
    const profileP = settle('profile', async () => unwrap(await api.get('/profiles/me')));
    const appsP = settle('applications', async () =>
      unwrap(await api.get('/applications/my-applications'))
    );

    // Readiness needs only the journey and the profile, so it starts as soon as
    // those two are in, without waiting for the applications.
    Promise.all([journeyP, profileP])
      .then(([journey, profile]) => {
        const targetCareer = targetCareerOf(profile?.profile || profile || {});
        if (journey && journey.doneCount >= 6 && targetCareer) {
          return settle('readiness', async () =>
            unwrap(await api.get(`/guidance/readiness/${encodeURIComponent(targetCareer)}`))
          ).then(arrive('readiness', 'readiness'));
        }
        pending.delete('readiness');
        emit();
        return undefined;
      })
      .catch(() => {
        // The journey failed; the core handler below reports it.
      });

    Promise.all([journeyP, profileP, appsP])
      .then(([journey, profile, apps]) => {
        if (!journey) throw new Error('Empty journey');
        Object.assign(r, { journey, profile, apps });
        const p = profile?.profile || profile || {};
        rememberDisplayName(p.firstName, p.lastName);
        coreReady = true;
        emit();
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        log.error('journey failed:', err?.response?.status || err?.message);
        const e = new Error('Talent home data unavailable');
        e.code = err?.response?.status === 401 ? 'UNAUTHORIZED' : 'UNAVAILABLE';
        if (e.code === 'UNAUTHORIZED') clearTalentHomeCache();
        reject(e);
      });
  });

/** Complete /home data in one promise (no progressive updates). */
export const fetchTalentHome = () => loadTalentHome();

/** MyAssessment tab data; merges into the home data as `assessment`. */
export const fetchTalentAssessment = async (home) => {
  const [summary, results, games] = await Promise.all([
    settle('summary', async () => unwrap(await api.get('/engagement/summary'))),
    settle('assessment results', async () =>
      unwrap(await api.get('/engagement/assessments/results/me'))
    ),
    settle('games', async () => unwrap(await api.get('/engagement/games/sessions/me'))),
  ]);
  const assessment = {
    ...(home?.profileSkills || {}),
    summary,
    results: results?.rows || [],
    required: results?.required || null,
    games: games?.rows || [],
    verifications: home?.verifications || [],
  };
  log('assessment loaded', { results: assessment.results.length, games: assessment.games.length });
  return assessment;
};
