import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('completeState');

/*
 * Profile complete URL state (route /profile/filling/complete):
 *   CO-01 Writing your bio   ?state=writing   (pinned: stays on the skeleton)
 *   CO-02 Bio ready          ?state=ready
 *   (no param)               starts writing, flips to ready by itself after a few seconds (simulated Career Buddy)
 * update(patch): null / '' / false remove a key.
 */
export const useCompleteState = () => {
  const [params, setParams] = useSearchParams();
  const raw = params.get('state');
  const pinned = raw === 'writing' || raw === 'ready' ? raw : null;

  const update = useCallback(
    (patch) => {
      log('update', patch);
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => {
          if (v === null || v === '' || v === false || v === undefined) next.delete(k);
          else next.set(k, v === true ? '1' : String(v));
        });
        return next;
      });
    },
    [setParams]
  );

  return useMemo(() => ({ pinned, update }), [pinned, update]);
};
