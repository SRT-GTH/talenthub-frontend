import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * useAgencyResource(fetcher, deps): { loading, data, error, status, reload } for one agency API call.
 * The previous data stays on screen while a new key loads (no flash); a response for an old key is ignored.
 */
export const useAgencyResource = (fetcher, deps) => {
  const [state, setState] = useState({ loading: true, data: null, error: null, status: null });
  const [attempt, setAttempt] = useState(0);
  const seq = useRef(0);
  useEffect(() => {
    const mine = ++seq.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve()
      .then(fetcher)
      .then(
        (data) =>
          mine === seq.current && setState({ loading: false, data, error: null, status: 200 })
      )
      .catch(
        (err) =>
          mine === seq.current &&
          setState({ loading: false, data: null, error: err, status: err?.response?.status || 0 })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);
  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
};
