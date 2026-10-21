import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('certsState');

/*
 * URL-driven state for /profile/filling/certs (frames CE-01..CE-06).
 *   /profile/filling/certs                  CE-01 first visit (empty state, the drawn example)
 *   /profile/filling/certs?state=list       CE-02 your certifications
 *   /profile/filling/certs?modal=add        CE-03 add a certification (list behind)
 *   /profile/filling/certs?modal=edit       CE-04 edit certification (Google Data Analytics; &id=<cert id> for another)
 *   /profile/filling/certs?modal=delete     CE-05 delete certification (AWS Cloud Practitioner; &id=<cert id> for another)
 *   /profile/filling/certs?state=complete   CE-06 stage complete (list behind)
 * update(patch): null / '' / false remove a key.
 */
export const useCertsState = () => {
  const [params, setParams] = useSearchParams();
  const state = params.get('state');
  const modal = params.get('modal');
  const id = params.get('id');

  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '' || v === false || v === undefined) next.delete(k);
            else next.set(k, String(v));
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
    () => ({
      state: state === 'list' || state === 'complete' ? state : null,
      modal: ['add', 'edit', 'delete'].includes(modal) ? modal : null,
      id,
      update,
    }),
    [state, modal, id, update]
  );
};
