import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { isLoggedIn } from '../../../../services/auth.api.js';

const log = debug('circleState');

/*
 * My circle (networking) — URL contract. Frontend-only; mock data in circleData.js, session actions in circleStore.js.
 * Figma canvas "Talent - community Engagement" 5456:19207 — Playful section 9187:27436, Focused twin 9187:30373 (NW-01 … NW-11)
 * and the flow section 9210:36124 ("HOW TALENTS GET TO MY CIRCLE": Community is the ONE door).
 *
 * HOW A TALENT GETS HERE (flow steps 1-6)
 *   1  sidebar "Community" (badge 3 = people waiting to link up)  →  /community
 *   2  top of Community: segmented switch [Communities | My circle ·3]  →  /community?view=circle
 *   3  Discover: invitations first, then "People to link up with"
 *   4  Link up (or the note button) on a card → "Say why you want to link up with …" dialog → Send link-up / Send without a note
 *   5  the card changes to "Link-up sent" and a toast confirms it (Undo)
 *   6  tab "Invitations · 3" → Accept / Ignore
 *
 * MY CIRCLE  (one page, URL-driven; rendered by CommunityBrowsePage when ?view=circle)
 *   /community?view=circle                          NW-01 Discover ("Grow")
 *   &modal=connect&person=abena-owusu[&draft=1]     NW-02 "Add a note" (draft=1 = the drawn note typed in)
 *   &state=sent                                     NW-03 Abena's link-up was just sent (toast + "Link-up sent" card)
 *   &tab=invitations[&sub=received|sent]            NW-04 Invitations   (&state=accepted = Nana Yaw just accepted, toast)
 *   &tab=circle[&menu=<personId>]                   NW-05 Connections   (&menu=yaw-darko = the "…" menu open)
 *   &tab=following                                  ⚠️ ASSUMPTION: opens the NW-09 feed "From your circle" (Figma draws no tab for it)
 *   &tab=feed                                       NW-09 Feed · From your network
 *   &state=minor                                    NW-10 under 18 (Ama, 15): classmates + verified mentors only
 *   &state=empty                                    NW-11 new talent: "Start your circle"
 *   &q=<text>                                       the "Search people by name, skill or school" field
 *   &rail=collapsed | &help=1                       icon rail / Help pop-over (default Help copy)
 *
 * TALENT PROFILE  (/community/people/:personId — another talent's profile; the frames draw Yaw Darko)
 *   /community/people/yaw-darko                     NW-06  connected (1st): Message · In your circle · Follow · endorse, recommend
 *   /community/people/yaw-darko?state=not-connected NW-06b not connected (2nd): Link up · Follow · Message, endorse locked
 *   &modal=endorse[&skills=figma,user-research]     NW-07  "Endorse Yaw’s skills" (skills = ticked skill ids)
 *   &modal=recommend[&draft=1]                      NW-08  "Recommend Yaw" (draft=1 = the drawn recommendation typed in)
 *   &modal=connect[&draft=1]                        the same "Add a note" dialog from the profile's Link up button
 *
 * The lead owns the shell; this file is new (circle/) and read by the circle pages only.
 */
export const CIRCLE_TABS = ['discover', 'invitations', 'circle', 'following', 'feed'];
export const CIRCLE_MODALS = ['connect', 'endorse', 'recommend'];
export const CIRCLE_DEMO_STATES = ['sent', 'accepted', 'minor', 'empty', 'not-connected'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const COMMUNITY_HREF = '/community';
export const CIRCLE_HREF = '/community?view=circle';
export const CREATE_COMMUNITY_HREF = '/community/create';
export const personHref = (id) => `/community/people/${id}`;

/* Same query string with the rail choice kept (so the switch / links never drop `rail=collapsed`). */
export const withRail = (path, rail) =>
  rail === 'collapsed' ? `${path}${path.includes('?') ? '&' : '?'}rail=collapsed` : path;

export const useCircleState = () => {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'circle' ? 'circle' : null;
  const tab = pick(params.get('tab'), CIRCLE_TABS, 'discover');
  const sub = pick(params.get('sub'), ['received', 'sent'], 'received');
  const demoState = pick(params.get('state'), CIRCLE_DEMO_STATES);
  const modal = pick(params.get('modal'), CIRCLE_MODALS);
  const person = params.get('person');
  const draft = params.get('draft') === '1';
  const menu = params.get('menu');
  const q = params.get('q') ?? '';
  const skillsParam = params.get('skills') ?? '';
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { view, tab, sub, demoState, modal, person, menu, rail });
    // Merge a patch into the query string (null/undefined/false/'' removes a key).
    const update = (patch, options = { replace: true }) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, options);
    };
    return {
      // Same shell contract as communityState (the talent shell reads these).
      stateKey: 'top',
      tab,
      communityTab: 'feed',
      view,
      sub,
      demoState,
      modal,
      person,
      draft,
      menu,
      q,
      skills: skillsParam.split(',').filter(Boolean),
      rail,
      help,
      // The drawn Kofi shell only for design frames and signed-out visits; a signed-in talent gets their own.
      demo: Boolean(demoState) || params.get('demo') === '1' || !isLoggedIn(),
      a11yMode: a11yParam,
      a11yParam,
      update,
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [
    params,
    setParams,
    view,
    tab,
    sub,
    demoState,
    modal,
    person,
    draft,
    menu,
    q,
    skillsParam,
    rail,
    help,
    a11yParam,
  ]);
};
