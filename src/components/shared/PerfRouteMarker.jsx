import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { markNavigation } from '../../utils/perf.js';

/**
 * Starts a new page in the timing recorder on every route change, before the
 * page's own effects fetch anything. Mounted when RUM (Faro) is on and the
 * ?perf=1 panel (which does the same itself) is not.
 */
export default function PerfRouteMarker() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    markNavigation(pathname);
  }, [pathname]);
  return null;
}
