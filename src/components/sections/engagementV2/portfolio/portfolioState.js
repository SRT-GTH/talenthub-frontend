import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('portfolioState');

/*
 * Portfolio stage URL state (route /profile/filling/portfolio). Every Figma frame is reachable by URL AND by interaction:
 *   PF-01 First visit (empty) ........ /profile/filling/portfolio
 *   PF-02 Your projects .............. /profile/filling/portfolio?state=list
 *   PF-03 Add a project .............. /profile/filling/portfolio?modal=add
 *   PF-04 Edit project ............... /profile/filling/portfolio?modal=edit&project=p1
 *   PF-05 Delete project ............. /profile/filling/portfolio?modal=delete&project=p2
 *   PF-06 Stage complete ............. /profile/filling/portfolio?state=complete
 * Params: state ('list' | 'complete'), modal ('add' | 'edit' | 'delete'), project (project id for edit / delete; default
 * first). Mock-seeded projects are used for every URL except the bare base (empty first visit).
 * Returns { state, modal, project, update(patch) }; null / '' / false in a patch removes the key.
 */
const MODALS = ['add', 'edit', 'delete'];
const STATES = ['list', 'complete'];

export const usePortfolioState = () => {
  const [params, setParams] = useSearchParams();
  const rawState = params.get('state');
  const rawModal = params.get('modal');
  const state = STATES.includes(rawState) ? rawState : null;
  const modal = MODALS.includes(rawModal) ? rawModal : null;
  const project = params.get('project') || null;

  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '' || v === false) next.delete(k);
            else next.set(k, v === true ? '1' : String(v));
          });
          log('update', patch);
          return next;
        },
        { replace: false }
      );
    },
    [setParams]
  );

  return useMemo(() => ({ state, modal, project, update }), [state, modal, project, update]);
};
