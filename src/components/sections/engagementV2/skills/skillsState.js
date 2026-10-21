import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('skillsState');

/*
 * Skills stage URL state (route /profile/filling/skills). Frames:
 *   SK-01  /profile/filling/skills                    first visit, empty state (no skills yet)
 *   SK-02  /profile/filling/skills?state=list         "Your skills" list (the six drawn skills)
 *   SK-03  /profile/filling/skills?modal=add          list behind the "Add a skill" dialog, filled as drawn (Tableau)
 *          /profile/filling/skills?modal=add&blank=1  same dialog opened by the buttons: empty form
 *   SK-04  /profile/filling/skills?view=lab           Skills Lab hub inside the engagement flow
 * `update(patch)`: null / '' / false removes a key. Debug scope: skillsState.
 */
export const useSkillsState = () => {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'lab' ? 'lab' : 'skills';
  const list = params.get('state') === 'list';
  const modal = params.get('modal') === 'add' ? 'add' : null;
  const blank = params.get('blank') === '1';

  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '' || value === false) {
              next.delete(key);
            } else {
              next.set(key, value === true ? '1' : String(value));
            }
          });
          log('update', patch, '->', next.toString());
          return next;
        },
        { replace: false }
      );
    },
    [setParams]
  );

  return useMemo(() => ({ view, list, modal, blank, update }), [view, list, modal, blank, update]);
};
