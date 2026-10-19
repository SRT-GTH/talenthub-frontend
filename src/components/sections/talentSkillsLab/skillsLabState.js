import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('skillsLabState');

/*
 * Talent Skills Lab — mock state source (frontend-only; swap for an API later and keep the shape).
 * Figma canvas "Talent - Skills Lab" 7500:92564 (Playful 78xx:*, Focused 8110:4xxxxx). Frame → URL table: wiki/talent-skills-lab.md.
 *
 *   /skills-lab                              SL-01 hub (returning)         tab=all (default)
 *   /skills-lab?tab=progress|verified|history|games      SL-01b / SL-01c / SL-07 / SL-G01
 *   /skills-lab?cat=design&q=…               SL-01d filtered / SL-01e search with no lab yet
 *   /skills-lab?state=empty|loading          SL-08 / SL-09
 *   /skills-lab?modal=how|add|suggest|weekly SL-M1 / M2 / M3 / M4;   ?toast=suggestion|hidden|reminder|pdf   SL-T1..T4
 *   /skills-lab/lab/:labId                   SL-02 / 02b / 02c lab details (data-driven per lab)
 *   /skills-lab/lab/:labId/play?q=&s=        lab flow (SL-L05..L18h) — q = challenge number, s = state
 *   /skills-lab/games/:gameId?…              games (SL-GS*, SL-GP*)
 *   &rail=collapsed | &help=1                icon rail / Help pop-over (HP)
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */
export const LAB_TABS = ['all', 'progress', 'verified', 'history', 'games'];
export const LAB_CATS = ['data', 'design', 'business', 'people'];
export const LAB_MODALS = ['how', 'add', 'suggest', 'weekly', 'restart', 'leave'];
export const LAB_TOASTS = ['suggestion', 'hidden', 'reminder', 'pdf'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useSkillsLabState = () => {
  const [params, setParams] = useSearchParams();
  const tab = pick(params.get('tab'), LAB_TABS, 'all');
  const cat = pick(params.get('cat'), LAB_CATS);
  const q = params.get('q') ?? '';
  const state = pick(params.get('state'), ['empty', 'loading']);
  const modal = pick(params.get('modal'), LAB_MODALS);
  const toast = pick(params.get('toast'), LAB_TOASTS);
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { tab, cat, q, state, modal, toast, rail });
    // Merge a patch into the query string (null/undefined/false removes a key).
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
      labTab: tab,
      cat,
      q,
      state,
      modal,
      toast,
      rail,
      help,
      a11yMode: a11yParam,
      a11yParam,
      update,
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [params, setParams, tab, cat, q, state, modal, toast, rail, help, a11yParam]);
};
