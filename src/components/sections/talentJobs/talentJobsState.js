import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('talentJobsState');

/*
 * Talent Job Postings — mock state source (frontend-only; swap for an API later and keep the shape).
 * Figma "Talent Job Postings" (canvas 7503…; Playful 75xx:*, Focused 8110:*). Every frame is a URL on
 * `/job-postings`:
 *
 *   /job-postings                          J-01  Matched to you (cards)
 *   /job-postings?view=list                J-01L Matched to you (list)
 *   /job-postings?tab=browse[&view=cards]  J-18  Browse all (list) / J-18G (cards)
 *   /job-postings?tab=saved[&view=list]    J-19  Saved (cards) / J-19L (list)
 *   /job-postings?tab=applied              J-10  Applied
 *   /job-postings?state=empty|loading      J-07 empty matches / J-13 loading
 *   /job-postings?rail=collapsed           the "c" frames (icon rail); default is the opened sidebar
 *   /job-postings?help=1                   HP help pop-over
 *
 * Pass (b)/(c) keys (reserved here so every pass shares one hook): job, apply, modal, withdrawn.
 * The lead owns this file. Section agents may ADD derived fields but must not rename existing ones.
 */
export const JOB_TABS = ['matched', 'browse', 'saved', 'applied'];
export const JOB_VIEWS = ['cards', 'list'];
export const JOB_STATES = ['empty', 'loading', 'offline'];

const pick = (value, allowed, fallback = null) => (allowed.includes(value) ? value : fallback);

export const useTalentJobsState = () => {
  const [params, setParams] = useSearchParams();
  const tab = pick(params.get('tab'), JOB_TABS, 'matched');
  const viewParam = pick(params.get('view'), JOB_VIEWS);
  // Figma default per tab: Matched + Saved open as cards, Browse all + Applied as a list.
  const view = viewParam ?? (tab === 'browse' || tab === 'applied' ? 'list' : 'cards');
  const state = pick(params.get('state'), JOB_STATES);
  const rail = params.get('rail') === 'collapsed' ? 'collapsed' : 'expanded';
  const sub = params.get('sub');
  const job = params.get('job');
  const apply = params.get('apply');
  const modal = params.get('modal');
  const withdrawn = params.get('withdrawn') === '1';
  // `wd` keeps the withdrawn Applied row after the toast is dismissed; `dismiss` = card the "Not for you?" dialog is about;
  // `hidden` = comma list of matches the talent hid.
  const wd = params.get('wd') === '1';
  const dismiss = params.get('dismiss');
  const hiddenKey = params.get('hidden') ?? '';
  const help = params.get('help') === '1';
  const a11yParam = params.get('a11y') === '1';

  return useMemo(() => {
    log('state', { tab, view, state, rail, sub, job, apply, modal });
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
      jobsTab: tab,
      view,
      state,
      rail,
      sub,
      job,
      apply,
      modal,
      withdrawn,
      wd,
      dismiss,
      hidden: hiddenKey ? hiddenKey.split(',') : [],
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
  }, [
    params,
    setParams,
    tab,
    view,
    state,
    rail,
    sub,
    job,
    apply,
    modal,
    withdrawn,
    wd,
    dismiss,
    hiddenKey,
    help,
    a11yParam,
  ]);
};
