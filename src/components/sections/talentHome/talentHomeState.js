import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentHomeState');

/*
 * Talent home — mock progress source (frontend-only; swap `getTalentHomeSnapshot`
 * for an API call later and keep the snapshot shape).
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

const TABS = ['home', 'assessment', 'recruiter'];

export const useTalentHomeState = () => {
  const [params, setParams] = useSearchParams();
  const stateKey = HOME_STATE_KEYS.includes(params.get('state')) ? params.get('state') : 'day1';
  const tab = TABS.includes(params.get('tab')) ? params.get('tab') : 'home';
  const loading = params.get('loading'); // null | '1' | 'empty' | 'error'
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
      snapshot: getTalentHomeSnapshot(stateKey),
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
    };
  }, [
    params,
    setParams,
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
