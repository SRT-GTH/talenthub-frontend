import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/*
 * useReviewState — URL state of /parent/review (every Figma frame is a URL, and a frame reproduces from a fresh load). Keys:
 *   tab=all|certificates|evaluations|corrections|payments   the tab (default all)
 *   view=assessment                                         PR-04 / PR-04b: the personality results page (⚠️ ASSUMPTION: no queue row opens it, so it is URL-only)
 *   modal=certificate|decline|hide|flag-result              PR-02 / PR-02b / PR-03b / PR-04b
 *   toast=certificate-approved|evaluation-sent              PR-06 / PR-03c
 *   done=<list>   what the parent has already dealt with: certificate | certificate-declined | evaluation | evaluation-hidden (a toast URL carries the state it shows)
 *   flagged=<list> assessment traits already flagged; trait=<id> the trait the flag dialog is about
 *   state=caught-up                                         PR-05 (the queue is empty)
 *   reason, note, check=1                                   seeds for the two reason-and-note dialogs
 * `update(patch, { replace })` merges into the query string (null / '' removes a key); `urlFor(patch)` returns the query string a link would carry.
 */
const TABS = ['all', 'certificates', 'evaluations', 'corrections', 'payments'];
const MODALS = ['certificate', 'decline', 'hide', 'flag-result'];
const TOASTS = ['certificate-approved', 'evaluation-sent'];

const list = (v) => (v ? v.split(',').filter(Boolean) : []);

export const useReviewState = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const state = useMemo(() => {
    const tab = params.get('tab');
    const modal = params.get('modal');
    const toast = params.get('toast');
    return {
      tab: TABS.includes(tab) ? tab : 'all',
      view: params.get('view') === 'assessment' ? 'assessment' : '',
      modal: MODALS.includes(modal) ? modal : '',
      toast: TOASTS.includes(toast) ? toast : '',
      done: list(params.get('done')),
      flagged: list(params.get('flagged')),
      trait: params.get('trait') ?? '',
      caughtUp: params.get('state') === 'caught-up',
      reason: params.get('reason') ?? '',
      note: params.get('note') ?? '',
      check: params.get('check') === '1',
      rail: params.get('rail') === 'collapsed' ? 'collapsed' : '',
    };
  }, [params]);

  const apply = (base, patch) => {
    const next = new URLSearchParams(base);
    Object.entries(patch).forEach(([k, v]) => {
      const value = Array.isArray(v) ? v.join(',') : v;
      if (value === null || value === '' || value === undefined) next.delete(k);
      else next.set(k, value);
    });
    return next;
  };

  /* A click can run two updates in a row (the toast's Undo, then its own close). Router 6 does not queue setSearchParams, so each update starts from the live address bar (history changes are
     synchronous) and the second one sees the first's result instead of the render's stale snapshot. */
  const update = useCallback(
    (patch, { replace = false } = {}) =>
      navigate(
        { search: apply(new URLSearchParams(window.location.search), patch).toString() },
        { replace }
      ),
    [navigate]
  );

  const urlFor = useCallback((patch) => `?${apply(params, patch).toString()}`, [params]);

  return { ...state, update, urlFor };
};

export default useReviewState;
