import { useCallback, useEffect, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { myRequests } from '../../../services/support.api.js';

const log = debug('useMyRequests');

/* Your support requests (GET /api/support/cases) → { rows, loading, error, reload }. */
export const useMyRequests = () => {
  const [state, setState] = useState({ rows: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
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
  }, [attempt]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
};
