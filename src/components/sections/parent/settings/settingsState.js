import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TAB_IDS } from './data/settingsData.js';

/*
 * useSettingsState — URL state of /parent/settings (every Figma frame is a URL, and a frame reproduces from a fresh load). Keys:
 *   tab=account|roles|notifications|security|data    PS-01 … PS-05 (default account)
 *   modal=logout|close-account                       PS-06 (over the Account page) / PS-07 (over Data and account, drawn behind it)
 *   confirm=<text>                                   what is typed in the close-account box (PS-07 draws "CLO")
 *   state=logged-out|closed                          PS-06b / PS-07b (the full-page result screens)
 * `update(patch, { replace })` merges into the query string (null / '' removes a key). It reads the live address bar, as in parent/review/reviewState.js.
 */
const MODALS = ['logout', 'close-account'];
const STATES = ['logged-out', 'closed'];

export const useSettingsState = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const state = useMemo(() => {
    const tab = params.get('tab');
    const modal = params.get('modal');
    const result = params.get('state');
    return {
      tab: TAB_IDS.includes(tab) ? tab : 'account',
      modal: MODALS.includes(modal) ? modal : '',
      confirm: params.get('confirm') ?? '',
      result: STATES.includes(result) ? result : '',
    };
  }, [params]);

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '' || v === undefined) next.delete(k);
        else next.set(k, v);
      });
      navigate({ search: next.toString() }, { replace });
    },
    [navigate]
  );

  return { ...state, update };
};
