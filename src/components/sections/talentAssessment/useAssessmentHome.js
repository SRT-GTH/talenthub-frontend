import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { fetchTalentAssessment } from '../../../services/talentHome.api.js';
import { useTalentHomeState } from '../talentHome/talentHomeState.js';

const log = debug('useAssessmentHome');

/*
 * The signed-in talent's home data (sidebar, nav, bell) + their assessment data (results, games, verifications,
 * skills) for the My Assessment pages. One fetch per page; pass `home` to AssessmentFrame for the live shell.
 * `assessment` is null while loading; `failed` is true if it could not load. Disabled in demo mode.
 */
export const useAssessmentHome = ({ enabled = true } = {}) => {
  const home = useTalentHomeState();
  const live = home?.live && !home.live.placeholder ? home.live : null;
  const [assessment, setAssessment] = useState(null);
  // Wait for the verified skills (the assessment uses them). Later /home
  // sections arriving update `live` but must not restart this fetch.
  const ready = Boolean(live) && !live.pending?.verifiedSkills;
  const liveRef = useRef(live);
  liveRef.current = live;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || !ready || assessment) return undefined;
    let alive = true;
    fetchTalentAssessment(liveRef.current)
      .then((a) => {
        log('assessment', { results: a.results.length, games: a.games.length });
        if (alive) setAssessment(a);
      })
      .catch((err) => {
        log.error('assessment failed:', err?.message);
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [enabled, ready, assessment]);
  return { home, live, assessment, failed, reload: () => setAssessment(null) };
};
