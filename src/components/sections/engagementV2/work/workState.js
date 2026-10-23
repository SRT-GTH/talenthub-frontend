import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('workState');

/*
 * Work stage URL state (route /profile/filling/work). Every Figma frame is reachable by URL AND by interaction:
 *   WK-01 First visit (empty) ........ /profile/filling/work
 *   WK-02 Your roles ................. /profile/filling/work?state=list
 *   WK-03 Add a role ................. /profile/filling/work?modal=add
 *   WK-04 Edit role .................. /profile/filling/work?modal=edit&role=r1&unsaved=1
 *   WK-05 Delete role ................ /profile/filling/work?modal=delete&role=r1
 *   WK-06 Stage complete ............. /profile/filling/work?state=complete
 * Params: state ('list' | 'complete'), modal ('add' | 'edit' | 'delete'), role (role id for edit / delete, default first),
 * unsaved ('1' = show the "unsaved changes" banner at open, as drawn in WK-04; it also appears on its own once the form is dirty).
 * Signed out (demo), mock-seeded roles are used for every URL except the bare base (empty first visit); signed in, the
 * talent's own roles are shown on every URL (empty profile = first visit). Returns { state, modal, role,
 * unsaved, update(patch) }; null / '' / false in a patch removes the key.
 */
const MODALS = ['add', 'edit', 'delete'];
const STATES = ['list', 'complete'];

export const useWorkState = () => {
  const [params, setParams] = useSearchParams();
  const rawState = params.get('state');
  const rawModal = params.get('modal');
  const state = STATES.includes(rawState) ? rawState : null;
  const modal = MODALS.includes(rawModal) ? rawModal : null;
  const role = params.get('role') || null;
  const unsaved = params.get('unsaved') === '1';

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

  return useMemo(
    () => ({ state, modal, role, unsaved, update }),
    [state, modal, role, unsaved, update]
  );
};
