import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';

const log = debug('useScreeningFlowParams');

/*
 * useScreeningFlowParams — the screening flow keeps every state in the query string (see the header of JobScreeningSection.jsx for the keys).
 * `patch({ key: value })` merges into the LIVE address (not the render-time copy, which goes stale when two writes land in one tick),
 * a `null` / `undefined` / `false` value removes the key, `true` writes "1". `replace` keeps typing out of the history.
 */
const useScreeningFlowParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const patch = useCallback(
    (changes, { replace = false } = {}) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined || value === false) next.delete(key);
        else next.set(key, value === true ? '1' : String(value));
      });
      log('patch', changes, '->', next.toString());
      setSearchParams(next, { replace });
    },
    [setSearchParams]
  );

  return { searchParams, patch };
};

export default useScreeningFlowParams;
