import api from './api.js';
import { isLoggedIn } from './auth.api.js';
import { debug } from '../utils/debug.js';

const log = debug('journey.api');

/*
 * GET /profiles/journey — the talent's 9-stage profile journey (backend utils/profileJourney.js):
 *   { stages: [{ id, label, done }], doneCount, total, percent, milestone, nextMilestone, nextStage }
 * Stage ids match engagementShellData.js ENGAGEMENT_STAGES. One request at a time is shared by every caller, and the
 * last good answer is cached for the session so screens can paint progress immediately while a refresh runs.
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

let cached = null;
let inflight = null;
const listeners = new Set();

export const cachedJourney = () => cached;

export const fetchJourney = () => {
  if (!isLoggedIn()) return Promise.resolve(null);
  if (!inflight) {
    inflight = api
      .get('/profiles/journey')
      .then((res) => {
        const journey = unwrap(res);
        if (!journey || !Array.isArray(journey.stages)) return null;
        cached = journey;
        log('journey', { doneCount: journey.doneCount, nextStage: journey.nextStage });
        listeners.forEach((fn) => fn(journey));
        return journey;
      })
      .catch((err) => {
        log.error('journey failed:', err?.response?.status || err?.message);
        return null;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

/* Refetch after a save: waits for any request already in flight (it may predate the save), then asks again. */
export const refreshJourney = () => (inflight || Promise.resolve()).then(() => fetchJourney());

/* Subscribe to fresh journeys (returns the unsubscribe function). */
export const onJourney = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
