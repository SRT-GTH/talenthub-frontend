import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  fetchAttempts,
  fetchHub,
  fetchProfileScores,
  saveProfileScore,
} from '../../../services/skillsLab.api.js';
import { fetchWeekly } from '../../../services/skillsLabWeekly.api.js';
import { HUB_ATTEMPTS, HUB_LABS_RESPONSE, HUB_PROFILE_SCORES } from './skillsLabData.js';
import { weeklyCardFrom } from './weekly/weeklyFormat.js';

const log = debug('skillsLabHubData');

/*
 * Where the Skills Lab hub gets its data. Live (the default): GET /skills-lab/labs, /attempts, /profile-scores for the
 * signed-in talent. `?demo=1`: the drawn mock in skillsLabData.js (Kofi's labs, every Figma state).
 * HubScreens read it through useHubData(): { live, status, response, attempts, profileScores, labById, setScoreShown, reload,
 * weekly, setWeekly } — `response` has the HUB_LABS_RESPONSE shape, so every screen renders the same either way.
 * Live, `response.weekly` (the hub card) comes from GET /skills-lab/weekly (skillsLabWeekly.api.js) and `weekly` is that
 * raw payload for the SL-M4 dialog; the mock keeps `weekly: null` and the dialog falls back to the drawn copy.
 */
export const isSkillsLabDemo = (params) => params?.get?.('demo') === '1';

const byId = (labs) => {
  const map = new Map((labs || []).map((l) => [l.id, l]));
  return (id) => map.get(id) ?? null;
};

const MOCK = {
  live: false,
  status: 'ready',
  response: HUB_LABS_RESPONSE,
  attempts: HUB_ATTEMPTS,
  profileScores: HUB_PROFILE_SCORES,
  labById: byId(HUB_LABS_RESPONSE.labs),
  setScoreShown: async () => {},
  reload: () => {},
  weekly: null,
  setWeekly: () => {},
};

export const HubDataContext = createContext(MOCK);
export const MOCK_HUB = MOCK;

export const useHubData = () => useContext(HubDataContext);

/** Live hub data; null when disabled (demo). */
export const useLiveHub = ({ enabled = true } = {}) => {
  const [state, setState] = useState({
    status: enabled ? 'loading' : 'off',
    response: null,
    attempts: [],
    profileScores: [],
    weekly: null,
  });

  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      const [response, attempts, profileScores, weekly] = await Promise.all([
        fetchHub(),
        fetchAttempts(),
        fetchProfileScores(),
        // The weekly card is optional: a failure only hides it.
        fetchWeekly().catch((err) => {
          log('weekly failed', err?.response?.status || err?.message);
          return null;
        }),
      ]);
      setState({ status: 'ready', response, attempts, profileScores, weekly });
    } catch (err) {
      log('hub failed', err?.response?.status || err?.message);
      setState((s) => ({ ...s, status: 'error' }));
    }
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const setScoreShown = useCallback(async (labId, shown) => {
    setState((s) => ({
      ...s,
      profileScores: s.profileScores.map((x) => (x.labId === labId ? { ...x, shown } : x)),
    }));
    try {
      const scores = await saveProfileScore(labId, shown);
      const attempts = await fetchAttempts().catch(() => null);
      setState((s) => ({ ...s, profileScores: scores, attempts: attempts ?? s.attempts }));
    } catch (err) {
      log('score toggle failed', err?.response?.status);
      setState((s) => ({
        ...s,
        profileScores: s.profileScores.map((x) =>
          x.labId === labId ? { ...x, shown: !shown } : x
        ),
      }));
      throw err;
    }
  }, []);

  const setWeekly = useCallback((weekly) => setState((s) => ({ ...s, weekly })), []);

  return useMemo(() => {
    if (!enabled) return null;
    const hub = state.response ?? {
      labs: [],
      summary: {
        ...HUB_LABS_RESPONSE.summary,
        topLine: null,
        bestResult: '—',
        bestResultLab: 'none yet',
        labsTaken: 0,
        verified: 0,
        total: 0,
        xp: 0,
        labsTotal: 0,
        inProgress: 0,
        games: 0,
      },
      weekly: null,
      nudge: null,
      popularForNewTalent: [],
      closeMatches: [],
    };
    const response = { ...hub, weekly: weeklyCardFrom(state.weekly) };
    return {
      live: true,
      status: state.status,
      response,
      attempts: state.attempts,
      profileScores: state.profileScores,
      labById: byId(response.labs),
      setScoreShown,
      reload: load,
      weekly: state.weekly,
      setWeekly,
    };
  }, [enabled, state, setScoreShown, load, setWeekly]);
};
