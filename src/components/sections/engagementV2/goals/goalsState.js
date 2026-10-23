import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('goalsState');

/*
 * Goals URL state (route /profile/filling/goals):
 *   GO-01 First visit (empty)  /profile/filling/goals
 *   GO-02 Your goals           ?state=list
 *   GO-03 Add a goal           ?modal=add
 *   GO-04 Edit goal            ?modal=edit            (&goal=<id>, default: the primary goal)
 *   GO-05 Delete goal          ?modal=delete          (&goal=<id>, default: the primary goal)
 *   GO-06 Stage complete       ?state=complete
 * Signed out (demo), frames other than GO-01 start with the three seed goals; GO-01 starts with none. Signed in, every frame
 * shows the talent's real goals (possibly none). update(patch): null / '' / false remove a key.
 */
export const useGoalsState = () => {
  const [params, setParams] = useSearchParams();
  const state = params.get('state') || null;
  const modal = params.get('modal') || null;
  const goalId = params.get('goal') || null;

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

  return useMemo(
    () => ({ state, modal, goalId, complete: state === 'complete', update }),
    [state, modal, goalId, update]
  );
};
