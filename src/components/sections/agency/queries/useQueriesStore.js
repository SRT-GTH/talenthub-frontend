import { useCallback, useMemo } from 'react';
import {
  agencyDeleteQuery,
  agencyRefreshQuery,
  agencySavedQueries,
  agencyUpdateQuery,
} from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import { toSavedCard } from '../data/queriesData.js';
import { useAgencySessionState } from '../agencySessionStore.js';
import { useAgencyResource } from '../useAgencyResource.js';

const log = debug('savedQueries');

/*
 * useSavedQueries — the agency's saved queries (GET /agency/queries) as cards, with the actions of the Saved queries view:
 *   togglePause(id)  PATCH status scheduled <-> paused
 *   remove(id)       DELETE
 *   refresh(id)      POST /:id/refresh (re-counts now; uses 1 query of the MoU quota)
 * Every action reloads the list and the session (the quota figures in the chrome).
 * Returns { loading, error, reload, items (cards), raw, national, togglePause, remove, refresh }.
 */
export const useSavedQueries = () => {
  const res = useAgencyResource(agencySavedQueries, []);
  const session = useAgencySessionState();
  const raw = res.data?.items;
  const items = useMemo(() => (raw || []).map(toSavedCard), [raw]);
  const { reload } = res;
  const after = useCallback(() => {
    reload();
    session?.reload?.();
  }, [reload, session]);

  const togglePause = useCallback(
    async (id) => {
      const q = (raw || []).find((x) => x.id === id);
      if (!q) return;
      const status = q.status === 'paused' ? 'scheduled' : 'paused';
      log('toggle', id, status);
      await agencyUpdateQuery(id, {
        status,
        ...(status === 'scheduled' && q.cadence === 'none' ? { cadence: 'monthly' } : {}),
      });
      after();
    },
    [raw, after]
  );
  const remove = useCallback(
    async (id) => {
      log('delete', id);
      await agencyDeleteQuery(id);
      after();
    },
    [after]
  );
  const refresh = useCallback(
    async (id) => {
      log('refresh', id);
      const out = await agencyRefreshQuery(id);
      after();
      return out;
    },
    [after]
  );

  return {
    loading: res.loading && !res.data,
    error: res.error,
    reload,
    items,
    raw: raw || [],
    national: res.data?.national ?? null,
    togglePause,
    remove,
    refresh,
  };
};
