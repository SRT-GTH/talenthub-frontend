import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { FILTER_KEYS } from '../publicData/publicDataState.js';

const log = debug('agencyState');

/*
 * agencyState — the URL is the state of every Theme 11 agency screen (Figma canvas 8605:395409, 114 frames).
 * Routes live under /agency (see pages/agency/AgencyApp.jsx and wiki/agency.md). Query keys, shared by all packages:
 *
 *   rail=collapsed          icon rail on desktop (below lg the chrome is the phone / tablet top bar, lg..xl always draws the rail)
 *   drawer=1                navigation drawer open (phone / tablet, opened by the menu button)
 *   modal=<name>            dialog / popover / sheet that is open. Reserved by the chrome: profile (11.6.0b, mounted by AgencyFrame) ·
 *                           help · notifications · messages · a11y (not drawn: inert). Pages add their own (welcome, share, download,
 *                           digest, save-query, export, filters, invite, remove ...) and read them from data.modal.
 *   state=<name>            edge state: loading | error | empty | low-data | suppressed | offline ... (page-specific, same words as Theme 8)
 *   region= edu= interest= age= gender=   the five shared filter keys (Theme 8 names; value = option id, absent = all)
 *   q=                      search text (top-bar search, saved-query search ...)
 *   tab=  view=  range=     section-specific (settings tab, demand view skills|trends|success, trends range ...)
 *   tour=1|2|3              welcome tour step over the home page (11.4.1f-h)
 *   mou=none|pending|needs-info|not-approved|approved   MOCK session override of the MoU status (see useAgencySession)
 *   quota=<0-100>           MOCK session override of the query-quota percentage (11.4.0c uses 92)
 *
 * Every Figma frame is a URL: packages add their own keys but never reuse the ones above for something else, and document them in
 * their page header + wiki/agency.md. Returns the parsed values, `params` (raw URLSearchParams) and update(patch):
 * null / false / '' remove a key, true writes "1".
 */

export { FILTER_KEYS };

export const MOU_STATUSES = ['none', 'pending', 'needs-info', 'not-approved', 'approved'];

export const useAgencyState = () => {
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

  return useMemo(() => {
    const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k)]));
    const activeFilters = FILTER_KEYS.filter((k) => filters[k]);
    const tour = Number(params.get('tour'));
    return {
      params,
      update,
      rail: params.get('rail') === 'collapsed' ? 'collapsed' : null,
      drawer: params.get('drawer') === '1',
      modal: params.get('modal'),
      state: params.get('state'),
      q: params.get('q') ?? '',
      tab: params.get('tab'),
      view: params.get('view'),
      range: params.get('range'),
      tour: tour >= 1 && tour <= 3 ? tour : null,
      filters,
      activeFilters,
    };
  }, [params, update]);
};
