import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('institutionState');

/*
 * institutionState — the URL is the state of every Theme 11 institution screen (Figma canvas 8520:10, 87 frames).
 * Routes live under /institution (see pages/institution/InstitutionApp.jsx and wiki/institution.md). Query keys, shared by all packages:
 *
 *   rail=collapsed          icon rail on desktop (below lg the chrome is the phone top bar, lg..xl always draws the rail)
 *   drawer=1                navigation drawer open (phone / tablet, opened by the menu button)
 *   modal=<name>            dialog / popover / sheet that is open. Reserved by the chrome: profile (11.6.0a, mounted by InstitutionFrame) ·
 *                           help · notifications · messages · a11y · language (not drawn: inert). Pages add their own (welcome, invite, remove,
 *                           add-student, upload, transfer, revoke, approve, reject, flag, download ...) and read them from data.modal.
 *   state=<name>            edge state of a page (page-specific): new (home 11.2.1b) · empty (roster 11.2.2l, messages 11.3.3g) ·
 *                           filled | code-sent | wrong-code | already-registered | success (sign-up) · valid | revoked (public verify) ...
 *   verify=none|under-review|approved|needs-info|not-approved   MOCK override of the accreditation status (see useInstitutionSession)
 *   q=                      search text (top-bar search, roster search ...)
 *   tab=  view=  filter=    section-specific (settings tab, accreditation view list|submitted, roster filter not-linked ...)
 *   tour=1|2|3              welcome tour step over the home page (11.1.3b-d)
 *
 * Every Figma frame is a URL: packages add their own keys but never reuse the ones above for something else, and document them in
 * their page header + wiki/institution.md. Returns the parsed values, `params` (raw URLSearchParams) and update(patch):
 * null / false / '' remove a key, true writes "1".
 */

export const VERIFY_STATUSES = ['none', 'under-review', 'approved', 'needs-info', 'not-approved'];

export const useInstitutionState = () => {
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
      filter: params.get('filter'),
      tour: tour >= 1 && tour <= 3 ? tour : null,
    };
  }, [params, update]);
};
