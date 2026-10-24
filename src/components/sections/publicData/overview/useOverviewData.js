import { useCallback, useEffect, useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import { getOverview } from './data/overviewData.js';

const log = debug('useOverviewData');

/*
 * useOverviewData — the page's view of GET /public/overview (mock: data/overviewData.js getOverview).
 * Input: the five filters of the URL and `?state=` (publicDataState.js). Output { status, overview, retry }:
 *   status  'loading'     ?state=loading — skeleton (8.2.1b)
 *           'error'       ?state=error — the Career interests card failed and shows its Retry (8.2.1c); the rest of the page is live
 *           'zero'        no talent matches (8.2.3c)         — natural (count 0) or forced with ?state=zero
 *           'suppressed'  1-4 talents match (8.2.3d)          — natural or forced with ?state=suppressed
 *           'ready'       everything drawn
 *   retry   removes ?state=error (the mock call then succeeds)
 * Forced states keep the filters of the URL: the frames draw zero / suppressed under "Upper West · Technology · 18–24".
 * ⚠️ ASSUMPTION: refetching after a filter change keeps the numbers on screen (no skeleton flash); the mock is synchronous, so the only
 * skeleton is the drawn one (?state=loading).
 */

const FORCED = ['loading', 'error', 'zero', 'suppressed'];

export const useOverviewData = (filters, state, update) => {
  const overview = useMemo(
    () => getOverview(filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.region, filters.edu, filters.interest, filters.age, filters.gender]
  );

  let status = 'ready';
  if (state === 'loading') status = 'loading';
  else if (state === 'zero' || overview.state === 'zero') status = 'zero';
  else if (state === 'suppressed' || overview.state === 'suppressed') status = 'suppressed';
  else if (state === 'error') status = 'error';

  useEffect(() => {
    log('status', status, { count: overview.count });
  }, [status, overview.count]);

  const retry = useCallback(() => {
    log('retry');
    update({ state: null }, { replace: true });
  }, [update]);

  return { status, overview, retry, forced: FORCED.includes(state) };
};
