import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { myRequests } from '../../../services/support.api.js';

const log = debug('useMyRequests');

/* Your support requests (GET /api/support/cases) → { rows, loading, error, reload }. `enabled: false` (add-only) skips the call (a caller with its own rows). */
export const useMyRequests = ({ enabled = true } = {}) => {
  const [state, setState] = useState({ rows: null, loading: enabled, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let live = true;
    myRequests()
      .then((rows) => live && setState({ rows: rows || [], loading: false, error: null }))
      .catch((error) => {
        log.error('requests failed', error?.response?.status || error?.message);
        if (live) setState({ rows: null, loading: false, error });
      });
    return () => {
      live = false;
    };
  }, [attempt, enabled]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
};
