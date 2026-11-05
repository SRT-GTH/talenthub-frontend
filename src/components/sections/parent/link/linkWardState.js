import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/*
 * useLinkWardState — URL state of /parent/link-ward (every Figma frame is a URL). Keys:
 *   name, dob (8 digits), rel (relationship id)   the search form
 *   result=none                                    forces the "No match yet" block (PW-07c draws the same inputs as PW-07)
 *   step=sent                                      PW-08 "Request sent to Kwesi"
 *   modal=code | code-error | code-expired | institution     PW-07b / PW-07e / PW-07f / PW-07d
 *   code                                           the characters typed in the link-code boxes
 * `update(patch)` merges into the query string; null / '' removes a key. Typing uses replace so the back button is not flooded.
 */
const MODALS = ['code', 'code-error', 'code-expired', 'institution'];

export const useLinkWardState = () => {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const modal = params.get('modal');
    return {
      name: params.get('name') ?? '',
      dob: (params.get('dob') ?? '').replace(/\D/g, '').slice(0, 8),
      rel: params.get('rel') ?? '',
      result: params.get('result') === 'none' ? 'none' : '',
      step: params.get('step') === 'sent' ? 'sent' : 'search',
      modal: MODALS.includes(modal) ? modal : '',
      code: (params.get('code') ?? '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6),
    };
  }, [params]);

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '' || v === undefined) next.delete(k);
            else next.set(k, v);
          });
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  return { ...state, update };
};

export default useLinkWardState;
