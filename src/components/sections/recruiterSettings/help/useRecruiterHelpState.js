import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/*
 * useRecruiterHelpState - the Help set's URL state on ANY recruiter page (it only touches its own keys: help, q, modal, ref).
 *   help   page | searching | none | shortcuts | article | report | contact | sent   (see recruiterHelpData.js for the frame of each)
 *   q      the search text of the pop-over (help=searching|none)
 *   modal  feedback | invite   (dialogs; other `modal` values belong to the page and are ignored here)
 * `update(patch, { replace })` merges into the live query string (null / '' removes a key) - the same contract as `useRecruiterSettingsState().update`,
 * so the talent Help components (which call `home.update({ help, q })`) take this object as is.
 */
export const useRecruiterHelpState = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const update = useCallback(
    (patch, { replace = false } = {}) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === '' || v === undefined) next.delete(k);
        else next.set(k, v);
      });
      navigate({ search: next.toString() }, { replace });
    },
    [navigate]
  );

  return {
    help: params.get('help') ?? '',
    q: params.get('q'),
    modal: params.get('modal') ?? '',
    update,
  };
};
