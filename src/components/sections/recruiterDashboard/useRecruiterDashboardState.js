import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { ORGS } from './recruiterDashboardData.js';

const log = debug('RecruiterDashboardState');

/*
 * useRecruiterDashboardState — every Figma state of the recruiter dashboard lives in the URL (mock data, no route guards).
 *
 *   ?org=mtn | hubtel | single | pending | none   which organisation the recruiter is acting for (default mtn)
 *        single  = one affiliation only (no switcher chevron, D05) · pending = read-only Zeepay (D06) · none = no affiliation (D07)
 *   ?panel=org                                    the organisation switcher is open (D02)
 *   ?loading=1                                    the whole page as skeletons (D03: switching to the org in ?org)
 *   ?toast=switched | revoked                     the org-switch toasts (D04, D08)
 *   ?view=setup                                   the earlier "Let's get you ready" home (kept, see wiki/recruiter-dashboard.md)
 *
 * The widget states (job sort / pause / close, talents, funnel, verification, heat map, feedback) and the top-bar panels (notifications, search, language, accessibility)
 * add their own keys; see wiki/recruiter-dashboard.md for the full table. Setting a key to '' removes it from the URL.
 */
export const useRecruiterDashboardState = () => {
  const [params, setParams] = useSearchParams();

  const get = (key, fallback = '') => params.get(key) ?? fallback;

  // Built from the live URL, not from the render's `params`: a timer (the org switch) or a second set() in the same tick would otherwise write over a stale copy.
  const set = useCallback(
    (patch) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) next.delete(key);
        else next.set(key, String(value));
      });
      log('url state ->', Object.fromEntries(next.entries()));
      setParams(next, { replace: true });
    },
    [setParams]
  );

  const orgKey = get('org', 'mtn');
  const org = useMemo(() => {
    if (orgKey === 'single') return ORGS[0];
    return ORGS.find((item) => item.id === orgKey) ?? ORGS[0];
  }, [orgKey]);

  return {
    params,
    get,
    set,
    orgKey,
    org,
    single: orgKey === 'single',
    pending: org.status === 'pending',
    noOrg: org.id === 'none',
    loading: get('loading') === '1',
    panel: get('panel'),
    toast: get('toast'),
  };
};

export default useRecruiterDashboardState;
