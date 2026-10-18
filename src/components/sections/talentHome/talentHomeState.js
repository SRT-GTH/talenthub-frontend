import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { fetchTalentAssessment, fetchTalentHome } from '../../../services/talentHome.api.js';
import { buildAssessmentContent, buildLiveContent, stateKeyFor } from './talentHomeLive.js';
import { HOME_TABS } from './talentHomeTabsData.js';

const log = debug('talentHomeState');

/*
 * Talent home — progress source. Since 2026-10-18 the page loads real data
 * (services/talentHome.api.js -> talentHomeLive.js) and picks the home state
 * from the real journey. An explicit `?state=` still shows the Figma demo state
 * with mock content (design review), as below.
 *
 * Which Figma state renders is chosen with the URL, so every frame is reachable:
 *   /home                       -> day1
 *   /home?state=discoverable    -> HM-02 (5 of 9)
 *   /home?state=discoverable&journey=min   -> HM-02b (journey minimised)
 *   /home?state=complete        -> HM-03a (just completed, 9 of 9)
 *   /home?state=top             -> HM-03  (Top Talent, active job seeker)
 *   /home?tab=assessment        -> HM-06 MyAssessment
 *   /home?tab=recruiter         -> HM-07 Recruiter activity
 *   /home?search=1              -> HM-08 global search open
 *   /home?edit=1                -> HM-05 edit home (customise)
 *   /home?loading=1             -> HM-04 loading (+ &loading=empty|error for the card states)
 *   /home?new=welcome|tour|chat|gate -> NU-01 / NU-02 / NU-04 / NU-03
 *   &a11y=1                     -> A11Y-02 accessibility mode (also toggled from the top nav)
 *
 * Ownership: the lead owns this file. Section agents may ADD fields to a snapshot
 * but must not rename existing ones (others render from them).
 */

export const HOME_STATE_KEYS = ['day1', 'discoverable', 'complete', 'top'];

// 9 journey stages (Figma "Your profile journey" stepper, HM-01).
export const JOURNEY_STAGES = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'interests', label: 'Interests' },
  { id: 'personality', label: 'Personality', badge: 'Discoverable' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'portfolio', label: 'Portfolio', badge: 'Top 20%' },
  { id: 'certs', label: 'Certs' },
  { id: 'goals', label: 'Goals' },
  { id: 'pitch', label: 'Pitch', badge: 'Top Talent' },
];

const PROFILE = {
  name: 'Kofi Agyekum',
  headline: 'Frontend developer · Accra',
  firstName: 'Kofi',
};

// doneCount = stages completed. Section agents fill in state-specific copy/numbers
// from the matching Figma frame inside their own components.
const SNAPSHOTS = {
  day1: { key: 'day1', frame: 'HM-01', doneCount: 1 },
  discoverable: { key: 'discoverable', frame: 'HM-02', doneCount: 5 },
  complete: { key: 'complete', frame: 'HM-03a', doneCount: 9 },
  top: { key: 'top', frame: 'HM-03', doneCount: 9 },
};

export const getTalentHomeSnapshot = (stateKey = 'day1') => {
  const base = SNAPSHOTS[stateKey] ?? SNAPSHOTS.day1;
  return {
    ...base,
    profile: PROFILE,
    stages: JOURNEY_STAGES,
    currentStageIndex: Math.min(base.doneCount, JOURNEY_STAGES.length - 1),
  };
};

// Snapshot from the real journey (GET /api/profiles/journey).
const liveSnapshot = (stateKey, data) => {
  const j = data.journey;
  const doneById = Object.fromEntries((j?.stages || []).map((s) => [s.id, s.done]));
  // The stepper fills stages in order, so stages done = the leading run of done stages
  // shown as doneCount; the real per-stage flags ride along as `done`.
  const stages = JOURNEY_STAGES.map((s) => ({ ...s, done: Boolean(doneById[s.id]) }));
  const doneCount = j?.doneCount ?? 0;
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ');
  return {
    ...(SNAPSHOTS[stateKey] ?? SNAPSHOTS.day1),
    doneCount,
    profile: {
      name,
      firstName: data.firstName,
      headline: [data.targetCareer, data.city].filter(Boolean).join(' · '),
    },
    stages,
    currentStageIndex: Math.max(
      0,
      stages.findIndex((s) => !s.done)
    ),
    live: true,
  };
};

const WELCOMED_KEY = 'th:home-welcomed';
const welcomedAlready = () => {
  try {
    return localStorage.getItem(WELCOMED_KEY) === '1';
  } catch {
    return true;
  }
};

const TABS = ['home', 'assessment', 'recruiter'];

export const useTalentHomeState = () => {
  const [params, setParams] = useSearchParams();
  const demoState = HOME_STATE_KEYS.includes(params.get('state')) ? params.get('state') : null;
  const [live, setLive] = useState(null); // null = loading, false = failed
  useEffect(() => {
    if (demoState) return undefined;
    let alive = true;
    fetchTalentHome()
      .then((data) => {
        if (!alive) return;
        setLive(data);
        // First visit after the first login: open the NU-01 welcome once (via the URL, so
        // the existing welcome -> tour -> close flow works unchanged).
        if (data.loginCount !== null && data.loginCount <= 1 && !welcomedAlready()) {
          try {
            localStorage.setItem(WELCOMED_KEY, '1');
          } catch {
            /* private mode: the welcome may show again */
          }
          setParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (!next.get('new')) next.set('new', 'welcome');
              return next;
            },
            { replace: true }
          );
        }
      })
      .catch((err) => {
        log.error('home data failed:', err?.message);
        if (alive) setLive(false);
      });
    return () => {
      alive = false;
    };
  }, [demoState, setParams]);
  const stateKey = demoState || (live ? stateKeyFor(live) : 'day1');
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'home';
  // MyAssessment data loads the first time the tab opens (real data only).
  const [assessment, setAssessment] = useState(null);
  useEffect(() => {
    if (demoState || !live || tab !== 'assessment' || assessment) return undefined;
    let alive = true;
    fetchTalentAssessment(live)
      .then((a) => alive && setAssessment(a))
      .catch((err) => log.error('assessment data failed:', err?.message));
    return () => {
      alive = false;
    };
  }, [demoState, live, tab, assessment]);
  const loading = params.get('loading') || (!demoState && live === null ? '1' : null); // null | '1' | 'empty' | 'error'
  const newUser = params.get('new'); // null | welcome | tour | chat | gate
  const journeyMin = params.get('journey') === 'min';
  const searchOpen = params.get('search') === '1';
  const editOpen = params.get('edit') === '1';
  const a11yMode = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { stateKey, tab, loading, newUser, journeyMin, searchOpen, editOpen, a11yMode });
    // Merge a patch into the query string (null/undefined removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      snapshot: live && !demoState ? liveSnapshot(stateKey, live) : getTalentHomeSnapshot(stateKey),
      content: live && !demoState ? buildLiveContent(stateKey, live) : null,
      // MyAssessment content (null in demo mode or while loading).
      assessment:
        live && !demoState && assessment ? buildAssessmentContent({ ...live, assessment }) : null,
      // Tabs: on real data the Recruiter activity tab waits for phase 3 (no backend yet).
      tabs:
        live && !demoState
          ? HOME_TABS.filter((t) => t.id !== 'recruiter').map((t) => ({ ...t, chip: null }))
          : HOME_TABS,
      live: !demoState && live ? live : null,
      stateKey,
      tab,
      loading,
      newUser,
      journeyMin,
      searchOpen,
      editOpen,
      a11yMode,
      update,
    };
  }, [
    params,
    setParams,
    live,
    demoState,
    assessment,
    stateKey,
    tab,
    loading,
    newUser,
    journeyMin,
    searchOpen,
    editOpen,
    a11yMode,
  ]);
};
