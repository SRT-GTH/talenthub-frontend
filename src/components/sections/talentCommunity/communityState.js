import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('communityState');

/*
 * Talent Community v2 — mock state source (frontend-only; swap for an API later and keep the shape).
 * Figma canvas "Talent - community Engagement" 5456:19207, section "Community v2 · Talent (updated 14 Oct 2026)"
 * (Playful 7025:85166 / Focused 8110:460140). Frame → URL table: wiki/talent-community.md.
 *
 *   /community                                C-01 Communities · find your people
 *   /community?menu=joined&cat=…              C-02 filtered + "Joined" menu
 *   /community?view=all                       C-03 all communities (full page)
 *   /community?state=loading                  C-15 loading            ·  /community?q=<no match>  C-16 no results
 *   /community/:communityId                   C-04 preview (not joined) · C-06 feed when joined (`?joined=1` demo flag)
 *   /community/:communityId?joined=1&welcome=1   C-05 just joined + guidelines
 *   /community/:communityId?tab=about|members    C-11 About tab · C-12 Members tab
 *   /community/:communityId?state=empty          C-14 empty feed (new community)
 *   /community/:communityId?pending=1            C-13 post pending review
 *   /community/:communityId/post/:postId         C-07 post + comments
 *   &modal=create|report|leave|milestone|reclassify   C-08 create post · C-10 report post · C-17 leave confirm · C-09 milestone share · moderator changes a post's purpose (US-5.2.2-01)
 *   &rail=collapsed | &help=1                    icon rail / Help pop-over (HP)
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */
export const COMMUNITY_TABS = ['feed', 'about', 'members'];
export const COMMUNITY_MODALS = ['create', 'report', 'leave', 'milestone', 'reclassify'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useCommunityState = () => {
  const [params, setParams] = useSearchParams();
  const cat = params.get('cat');
  const q = params.get('q') ?? '';
  const menu = params.get('menu') === 'joined' ? 'joined' : null;
  const view = params.get('view') === 'all' ? 'all' : null;
  const state = pick(params.get('state'), ['loading', 'empty']);
  const tab = pick(params.get('tab'), COMMUNITY_TABS, 'feed');
  const joined = params.get('joined') === '1';
  const welcome = params.get('welcome') === '1';
  const pending = params.get('pending') === '1';
  const modal = pick(params.get('modal'), COMMUNITY_MODALS);
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';
  // Demo = GubliAS's drawn mock (Figma states driven by the URL). Live data otherwise; the demo-only state keys switch it on
  // so every frame URL in wiki/talent-community.md keeps rendering the drawn screen.
  const demo =
    params.get('demo') === '1' ||
    params.has('state') ||
    params.get('joined') === '1' ||
    params.get('pending') === '1';

  return useMemo(() => {
    log('state', { demo, cat, q, menu, view, state, tab, joined, modal, rail });
    // Merge a patch into the query string (null/undefined/false/'' removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false || v === '') next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab,
      communityTab: tab,
      cat,
      q,
      menu,
      view,
      state,
      joined,
      welcome,
      pending,
      modal,
      rail,
      help,
      demo,
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
    cat,
    q,
    menu,
    view,
    state,
    tab,
    joined,
    welcome,
    pending,
    modal,
    rail,
    help,
    demo,
    a11yParam,
  ]);
};
