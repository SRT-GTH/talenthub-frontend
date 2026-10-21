import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('interestsState');

/*
 * Interests URL state (route /profile/filling/interests):
 *   IN-01 Pick your areas   /profile/filling/interests
 *   IN-02 Your areas        ?step=areas
 *   IN-03 Add specifics     ?step=specifics            (&area=<id>, default technology: the open card)
 *   IN-04 Add an area       ?step=areas&modal=add-area (&pick=<id> preselects an area in the dialog; IN-04 = &pick=development)
 *   IN-05 Stage complete    ?step=areas&state=complete
 * update(patch): null / '' / false remove a key.
 */
export const useInterestsState = () => {
  const [params, setParams] = useSearchParams();
  const step = params.get('step') || 'pick';
  const area = params.get('area') || null;
  const modal = params.get('modal') || null;
  const pick = params.get('pick') || null;
  const complete = params.get('state') === 'complete';

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
    () => ({ step, area, modal, pick, complete, update }),
    [step, area, modal, pick, complete, update]
  );
};
