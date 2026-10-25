import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  fetchAttempts,
  fetchHub,
  fetchProfileScores,
  saveProfileScore,
} from '../../../services/skillsLab.api.js';
import { HUB_ATTEMPTS, HUB_LABS_RESPONSE, HUB_PROFILE_SCORES } from './skillsLabData.js';

const log = debug('skillsLabHubData');

/*
 * Where the Skills Lab hub gets its data. Live (the default): GET /skills-lab/labs, /attempts, /profile-scores for the
 * signed-in talent. `?demo=1`: the drawn mock in skillsLabData.js (Kofi's labs, every Figma state).
 * HubScreens read it through useHubData(): { live, status, response, attempts, profileScores, labById, setScoreShown, reload }
 * — `response` has the HUB_LABS_RESPONSE shape, so every screen renders the same either way.
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
  });

  const load = useCallback(async () => {
    if (!enabled) return;
    try {
      const [response, attempts, profileScores] = await Promise.all([
        fetchHub(),
        fetchAttempts(),
        fetchProfileScores(),
      ]);
      setState({ status: 'ready', response, attempts, profileScores });
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

  return useMemo(() => {
    if (!enabled) return null;
    const response = state.response ?? {
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
    return {
      live: true,
      status: state.status,
      response,
      attempts: state.attempts,
      profileScores: state.profileScores,
      labById: byId(response.labs),
      setScoreShown,
      reload: load,
    };
  }, [enabled, state, setScoreShown, load]);
};
