import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentProfileState');

/*
 * Talent profile — mock state source (frontend-only; swap for an API later and keep the shape).
 * Every Figma frame is reachable with query params on `/profile`:
 *
 *   /profile                          P-01 Overview            (tab=overview)
 *   /profile?tab=skills|experience|portfolio|certs|about        P-02 .. P-06
 *   /profile?empty=1                  P-10 New profile (mostly empty)
 *   /profile?edit=about               P-08 Edit About (in place)
 *   /profile?modal=experience         P-09 Add experience (modal)
 *   /profile?view=recruiter           P-07 Preview as recruiter
 *   /profile?view=public              PR-02 Public link (logged out)  — rendered WITHOUT the talent shell
 *   /profile?view=public&manage=1     PR-03 Manage what's visible (drawer)
 *   /profile?view=public&updated=1    PR-04 Preview updated (pitch hidden)
 *   /profile?share=open|copied|link|link-available|pdf|card|card-midnight|card-sunshine|card-making|card-saved|whatsapp
 *                                     SH-01, 02, 04, 04b, 05, 03, 03b, 03c, 03d, 03e, 03f
 *   /profile?card=pick|customise|text|post|banner|making|ready|error
 *                                     SC-01 .. SC-08 (Create share card builder)
 *   /profile?ax=panel|calm|contrast|aloud|pitch|images|alt|focus|landmarks|share-modal
 *                                     AX-01 .. AX-08 (+ AX-06b = `ax=alt`, AX-07a/b = `focus`/`landmarks`)
 *   /profile?help=1                   HP help pop-over overlay
 *
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */

export const PROFILE_TABS = ['overview', 'skills', 'experience', 'portfolio', 'certs', 'about'];
export const SHARE_STATES = [
  'open',
  'copied',
  'link',
  'link-available',
  'pdf',
  'card',
  'card-midnight',
  'card-sunshine',
  'card-making',
  'card-saved',
  'whatsapp',
];
export const CARD_STEPS = [
  'pick',
  'customise',
  'text',
  'post',
  'banner',
  'making',
  'ready',
  'error',
];
export const AX_STATES = [
  'panel',
  'calm',
  'contrast',
  'aloud',
  'pitch',
  'images',
  'alt',
  'focus',
  'landmarks',
  'share-modal',
];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useTalentProfileState = () => {
  const [params, setParams] = useSearchParams();
  const tab = pick(params.get('tab'), PROFILE_TABS, 'overview');
  const view = pick(params.get('view'), ['recruiter', 'public']);
  const share = pick(params.get('share'), SHARE_STATES);
  const card = pick(params.get('card'), CARD_STEPS);
  const ax = pick(params.get('ax'), AX_STATES);
  const edit = params.get('edit') === 'about' ? 'about' : null;
  const modal = params.get('modal') === 'experience' ? 'experience' : null;
  const empty = params.get('empty') === '1';
  const manage = params.get('manage') === '1';
  const updated = params.get('updated') === '1';
  const help = params.get('help') === '1';
  // Accessibility mode (shared with the talent home shell; toggled from the nav button).
  const a11yMode = params.get('a11y') === '1' || Boolean(ax && ax !== 'panel');

  return useMemo(() => {
    log('state', { tab, view, share, card, ax, edit, modal, empty, manage, updated, help });
    // Merge a patch into the query string (null/undefined/false removes a key).
    const update = (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) next.delete(k);
        else next.set(k, v === true ? '1' : String(v));
      });
      setParams(next, { replace: true });
    };
    return {
      // `stateKey` / `tab` mirror the talent-home contract so the shared shell keeps working.
      stateKey: 'top',
      tab,
      profileTab: tab,
      view,
      share,
      card,
      ax,
      edit,
      modal,
      empty,
      manage,
      updated,
      help,
      a11yMode,
      update,
      // The shell's search / edit hooks (unused on the profile, present for the shared nav).
      searchOpen: params.get('search') === '1',
      editOpen: false,
      loading: null,
      newUser: null,
      journeyMin: false,
    };
  }, [
    params,
    setParams,
    tab,
    view,
    share,
    card,
    ax,
    edit,
    modal,
    empty,
    manage,
    updated,
    help,
    a11yMode,
  ]);
};
