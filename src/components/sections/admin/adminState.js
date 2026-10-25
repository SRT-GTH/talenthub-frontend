import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('adminState');

/*
 * adminState — the URL is the state of every Theme 7 admin screen (Figma canvas 8520:12, 84 screens, Focused only).
 * Routes live under /admin (see pages/admin/AdminApp.jsx and wiki/admin.md). Query keys, shared by all screens:
 *
 *   role=support|moderator|senior|super|dpo   MOCK session role (default senior; remembered for the tab, see useAdminSession)
 *   rail=collapsed          icon rail on desktop (below lg the chrome is the phone / tablet top bar, lg..xl always draws the rail)
 *   drawer=1                navigation drawer open (phone / tablet)
 *   modal=<name>            dialog / popover that is open. Reserved by the chrome: profile · help · notifications · messages · a11y ·
 *                           language (all inert for now). Pages add their own (suspend, merge, dismiss ...) and read them from data.modal.
 *   state=<name>            edge state of a screen (empty | error | locked | expired | blocked ...), page-specific
 *   q=                      search text      tab=  view=   section-specific
 *
 * Every Figma frame is a URL: pages add their own keys but never reuse the ones above for something else, and document them in their
 * page header + wiki/admin.md. Returns the parsed values, `params` (raw URLSearchParams) and update(patch): null / false / '' remove a
 * key, true writes "1".
 */

export const useAdminState = () => {
  const [params, setParams] = useSearchParams();

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      log('update', patch);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || value === false || value === '') {
              next.delete(key);
            } else {
              next.set(key, value === true ? '1' : String(value));
            }
          });
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  return useMemo(
    () => ({
      params,
      update,
      rail: params.get('rail') === 'collapsed' ? 'collapsed' : null,
      drawer: params.get('drawer') === '1',
      modal: params.get('modal'),
      state: params.get('state'),
      q: params.get('q') ?? '',
      tab: params.get('tab'),
      view: params.get('view'),
    }),
    [params, update]
  );
};
