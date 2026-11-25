import { useEffect, useMemo, useState } from 'react';
import { cachedJourney, fetchJourney, onJourney } from '../../../services/journey.api.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import { ENGAGEMENT_STAGES } from './engagementShellData.js';

const KNOWN = new Set(ENGAGEMENT_STAGES.map((s) => s.id));

/* Backend journey -> what the engagement screens draw: finished stage ids (journey order) and the stage to do next. */
export const toLiveProgress = (journey) => {
  if (!journey || !Array.isArray(journey.stages)) return null;
  const doneIds = journey.stages.filter((s) => s?.done && KNOWN.has(s.id)).map((s) => s.id);
  const nextId = KNOWN.has(journey.nextStage) ? journey.nextStage : null;
  // jhs: the backend dropped Work and Pitch for this talent; isMinor: under 18 (copy mentions the parent).
  return {
    doneIds,
    nextId,
    milestone: journey.milestone || 'none',
    jhs: Boolean(journey.jhs),
    isMinor: Boolean(journey.isMinor),
    total: journey.total || ENGAGEMENT_STAGES.length,
    doneCount: journey.doneCount ?? doneIds.length,
  };
};

/*
 * The signed-in talent's real journey progress ({ doneIds, nextId, milestone }), or null while loading, when signed out,
 * or when the request fails — callers then keep their demo / URL-driven progress. Refetches on mount so a stage saved
 * on the previous screen shows up when the talent lands back on the map.
 * useLiveJourneyStatus also says whether that first read is still in flight (signed in, nothing cached yet), so the stage
 * bar can show a placeholder instead of the drawn demo progress for a moment.
 */
export const useLiveJourneyStatus = () => {
  const [journey, setJourney] = useState(cachedJourney);
  const [settled, setSettled] = useState(() => Boolean(cachedJourney()) || !isLoggedIn());
  useEffect(() => {
    let alive = true;
    const off = onJourney(setJourney);
    fetchJourney().finally(() => alive && setSettled(true));
    return () => {
      alive = false;
      off();
    };
  }, []);
  const live = useMemo(() => toLiveProgress(journey), [journey]);
  return { live, loading: !settled && !live };
};

export const useLiveJourney = () => useLiveJourneyStatus().live;
