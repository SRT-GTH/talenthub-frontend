import { useCallback, useEffect, useState } from 'react';
import { COUNTS_CHANGED, chromeCounts } from '../../../../services/adminChrome.api.js';

/*
 * Unread notifications and messages for the top-bar badges (GET /admin/chrome/counts). Refreshes every minute, when the
 * tab comes back into view, and when a panel marks something read (COUNTS_CHANGED). null = not loaded / couldn't count.
 */
const EVERY_MS = 60000;

export const useAdminCounts = (enabled = true) => {
  const [counts, setCounts] = useState({ notifications: null, messages: null });
  const refresh = useCallback(async () => {
    if (!enabled) return;
    try {
      const c = await chromeCounts();
      setCounts({ notifications: c?.notifications ?? null, messages: c?.messages ?? null });
    } catch {
      /* keep the last numbers */
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    refresh();
    const t = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, EVERY_MS);
    const onVis = () => document.visibilityState === 'visible' && refresh();
    window.addEventListener(COUNTS_CHANGED, refresh);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(t);
      window.removeEventListener(COUNTS_CHANGED, refresh);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [enabled, refresh]);

  return counts;
};
