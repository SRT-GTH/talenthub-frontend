import api from './api.js';
import { isLoggedIn } from './auth.api.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { refreshJourney } from './journey.api.js';
import { debug } from '../utils/debug.js';

const log = debug('profileStages.api');

/*
 * Engagement stages <-> the talent's profile document.
 *
 *   GET   /profiles/me       { success, profile }            the profile the stage screens load from
 *   PATCH /profiles/fields   { fields: { <field>: value } }  replaces those top-level fields ($set)
 *
 * Fields the journey reads (backend utils/profileJourney.js): avatar | profilePhoto, interests, personalitySnapshot,
 * technicalSkills | softSkills, workExperience, portfolio, certifications, careerGoals | desiredCareers,
 * professionalBio (pitch). Array fields are written whole (the screen's full list), so a screen must only save after
 * its profile load SUCCEEDED — fetchMyProfile rejects on failure for exactly that reason (a failed load must never
 * look like an empty profile, or the next save would wipe the field).
 * Saves are serialised (one PATCH at a time, in call order) so an older list can never land after a newer one.
 * After every save the journey is refetched, so the map / stage bars / dashboard pick up a finished stage.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const token = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.authToken) || '';
  } catch {
    return '';
  }
};

/* True when the stage screens should load and save real data (a signed-in session). */
export const isLiveProfile = () => isLoggedIn();

let queue = Promise.resolve(); // saves in call order (see saveProfileFields)
let inflight = null; // { token, generation, promise }
let generation = 0; // bumped by every save, so a load started before a save is never reused after it

/*
 * The signed-in talent's profile, always read from the server (other surfaces — Career Buddy, Skills Lab — write it
 * too). Resolves null when signed out; REJECTS when the request fails. Concurrent callers share one request as long as
 * it belongs to the same session and no save happened since it started.
 */
export const fetchMyProfile = () => {
  if (!isLoggedIn()) return Promise.resolve(null);
  const t = token();
  if (inflight && inflight.token === t && inflight.generation === generation)
    return inflight.promise;
  // Read after any queued saves land, so a screen opened right after another one saved sees that save.
  const promise = queue
    .then(() => api.get('/profiles/me'))
    .then((res) => {
      const body = unwrap(res);
      const profile = body?.profile || body || null;
      if (!profile || typeof profile !== 'object') throw new Error('Profile unavailable');
      return profile;
    })
    .catch((err) => {
      log.error('profile failed:', err?.response?.status || err?.message);
      throw err;
    })
    .finally(() => {
      if (inflight?.promise === promise) inflight = null;
    });
  inflight = { token: t, generation, promise };
  return promise;
};

/*
 * Save some profile fields. Resolves to the saved fields on success; rejects on failure (callers keep the local edit
 * and show their error). Signed-out (demo) sessions resolve to null without calling the API. Saves run one after
 * another in call order.
 */
export const saveProfileFields = (fields) => {
  if (!isLoggedIn()) return Promise.resolve(null);
  generation += 1;
  const run = queue.then(async () => {
    log('save', Object.keys(fields));
    await api.patch('/profiles/fields', { fields });
    refreshJourney();
    return fields;
  });
  queue = run.catch(() => {}); // a failed save must not block the next one
  return run;
};
