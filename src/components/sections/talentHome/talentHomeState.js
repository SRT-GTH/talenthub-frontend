import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import {
  clearTalentHomeCache,
  fetchTalentAssessment,
  loadTalentHome,
  peekTalentHome,
  rememberTalentAssessment,
} from '../../../services/talentHome.api.js';
import {
  buildAssessmentContent,
  buildLiveContent,
  buildRecruiterActivity,
  stateKeyFor,
} from './talentHomeLive.js';
import { HOME_TABS } from './talentHomeTabsData.js';
import { EMMA, EMMA_CONTENT } from './emmaPersona.js';

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
 *   /home?loading=1             -> HM-04 loading (&loading=empty keeps the skeleton; &loading=error, or a
 *                                  failed live load, shows the error card with "Try again")
 *   /home?new=welcome|tour|chat|gate -> NU-01 / NU-02 / NU-04 / NU-03
 *   &a11y=1                     -> A11Y-02 accessibility mode (also toggled from the top nav)
 *   &notif=open|empty|loading   -> Notifications pop-up N-01 / N-03 / N-04 (&tip=1 = N-02 tooltip)
 *   &help=1                     -> Help pop-over HP (8376:10396)
 *   /notifications              -> N-05 full screen (&filter=unread&read=all = N-06 inbox zero,
 *                                  &rail=expanded = the "e" frames with the full sidebar)
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
  // The backend's stage list decides which stages show (JHS talents have no Work or Pitch); milestone badges sit on
  // the stage that reaches each milestone (a third, two thirds and all of the stages).
  const ids = new Set((j?.stages || []).map((s) => s.id));
  const shown = ids.size ? JOURNEY_STAGES.filter((s) => ids.has(s.id)) : JOURNEY_STAGES;
  const t = shown.length;
  const badgeAt = {
    [Math.round(t / 3) - 1]: 'Discoverable',
    [Math.round((t * 2) / 3) - 1]: 'Top 20%',
    [t - 1]: 'Top Talent',
  };
  const stages = shown.map((s, i) => ({
    ...s,
    badge: badgeAt[i],
    done: Boolean(doneById[s.id]),
  }));
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

// Before the data arrives (or if it failed) the chrome shows the signed-in user's
// own name with no numbers, never the Figma demo person.
export const placeholderFromStoredUser = () => {
  try {
    const u = JSON.parse(localStorage.getItem('th:user-profile') || 'null') || {};
    return {
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      city: u.locality || '',
      placeholder: true,
    };
  } catch {
    return { firstName: '', lastName: '', city: '', placeholder: true };
  }
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
  // `?as=emma` (Figma canvas "Parent who is also a talent"): the Discoverable demo home with Emma's details (emmaPersona.js).
  const asEmma = params.get('as') === 'emma';
  const demoState = HOME_STATE_KEYS.includes(params.get('state'))
    ? params.get('state')
    : asEmma
      ? 'discoverable'
      : null;
  const navigate = useNavigate();
  // null = loading, false = failed. Starts from this tab's cached copy when
  // there is one, so returning to /home shows the data at once.
  const [live, setLive] = useState(() => (demoState ? null : (peekTalentHome()?.data ?? null)));
  // Bumped by retry() after a failed load (the error state's "Try again") to re-run the loader.
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (demoState) return undefined;
    let alive = true;
    const hadCache = Boolean(peekTalentHome()?.data);
    loadTalentHome({
      // First load: render as soon as the core is in, then let sections fill in.
      // With a cached copy on screen, wait for the complete refresh instead of
      // swapping finished cards back to skeletons.
      onUpdate: (data) => {
        if (alive && !hadCache) setLive(data);
      },
    })
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
        log.error('home data failed:', err?.code || err?.message);
        if (!alive) return;
        // Expired session: sign in again rather than showing anyone else's (demo) data.
        if (err?.code === 'UNAUTHORIZED') {
          clearTalentHomeCache();
          navigate('/login', { replace: true });
        } else if (!hadCache) {
          setLive(false);
        }
        // Otherwise keep showing the cached copy; only the refresh failed.
      });
    return () => {
      alive = false;
    };
  }, [demoState, setParams, navigate, attempt]);
  const stateKey = demoState || (live ? stateKeyFor(live) : 'day1');
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'home';
  // MyAssessment data: shown from this tab's cache at once, and fetched the first
  // time the tab opens, once the verified skills (which it uses) have arrived.
  // Later sections arriving must not restart the fetch.
  const [assessment, setAssessment] = useState(() =>
    demoState ? null : (peekTalentHome()?.assessment ?? null)
  );
  const liveRef = useRef(live);
  liveRef.current = live;
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const assessmentReady = Boolean(live) && !live.pending?.verifiedSkills;
  const assessmentFetched = useRef(false);
  useEffect(() => {
    if (demoState || !assessmentReady || tab !== 'assessment' || assessmentFetched.current) {
      return;
    }
    assessmentFetched.current = true;
    fetchTalentAssessment(liveRef.current)
      .then((a) => {
        rememberTalentAssessment(a);
        if (mounted.current) setAssessment(a);
      })
      .catch((err) => {
        assessmentFetched.current = false;
        log.error('assessment data failed:', err?.message);
      });
  }, [demoState, assessmentReady, tab]);
  // Real data: spinner while loading, the designed error state if it failed (never the demo).
  const loading =
    params.get('loading') ||
    (!demoState && live === null ? '1' : !demoState && live === false ? 'error' : null); // null | '1' | 'empty' | 'error'
  const newUser = params.get('new'); // null | welcome | tour | chat | gate
  const journeyMin = params.get('journey') === 'min';
  const searchOpen = params.get('search') === '1';
  const editOpen = params.get('edit') === '1';
  const a11yMode = params.get('a11y') === '1';
  // Notifications (Figma 7471:53182): pop-up state, tooltip, help overlay, full-screen filter/rail.
  const notif = ['open', 'empty', 'loading'].includes(params.get('notif'))
    ? params.get('notif')
    : null;
  const notifTip = params.get('tip') === '1';
  const helpOpen = params.get('help') === '1';
  const filter = params.get('filter') || 'all';
  const readAll = params.get('read') === 'all';
  const rail = params.get('rail') === 'expanded' ? 'expanded' : 'collapsed';

  return useMemo(() => {
    log('state', {
      stateKey,
      tab,
      loading,
      newUser,
      journeyMin,
      searchOpen,
      editOpen,
      a11yMode,
      notif,
      helpOpen,
      filter,
      rail,
    });
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
      snapshot:
        live && !demoState
          ? liveSnapshot(stateKey, live)
          : asEmma
            ? { ...getTalentHomeSnapshot(stateKey), profile: EMMA.profile }
            : getTalentHomeSnapshot(stateKey),
      content: live && !demoState ? buildLiveContent(stateKey, live) : asEmma ? EMMA_CONTENT : null,
      persona: asEmma ? EMMA : null,
      // MyAssessment content (null in demo mode or while loading).
      assessment:
        live && !demoState && assessment ? buildAssessmentContent({ ...live, assessment }) : null,
      // Recruiter activity tab: who viewed you this week (/activity/me), real data only.
      recruiterActivity:
        live && !demoState && !live.pending?.views ? buildRecruiterActivity(live.views) : null,
      // True while the views call is still on the way (the tab shows a skeleton).
      recruiterPending: Boolean(live && !demoState && live.pending?.views),
      tabs:
        live && !demoState
          ? HOME_TABS.map((t) => ({
              ...t,
              chip:
                t.id === 'recruiter' && live.views?.uniqueViewers
                  ? String(live.views.uniqueViewers)
                  : null,
            }))
          : HOME_TABS,
      live: demoState ? null : live || placeholderFromStoredUser(),
      stateKey,
      tab,
      loading,
      newUser,
      journeyMin,
      searchOpen,
      editOpen,
      a11yMode,
      notif,
      notifTip,
      helpOpen,
      filter,
      readAll,
      rail,
      update,
      // Re-run the /home loader after a failure: back to the loading skeleton, then data or the error state again.
      retry: () => {
        log('retry load');
        setLive(null);
        setAttempt((n) => n + 1);
      },
    };
  }, [
    params,
    setParams,
    asEmma,
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
    notif,
    notifTip,
    helpOpen,
    filter,
    readAll,
    rail,
  ]);
};
