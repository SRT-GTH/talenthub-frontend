import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('avatarState');

/*
 * Avatar selection — URL-driven state (Engagement revamp). The step is chosen by the ROUTE (AvatarPage `step` prop); only the
 * overlay lives in the query string:
 *
 *   /profile/engagement/avatar                          Style step            (Figma "Avatar section-style")
 *   /profile/engagement/avatar?modal=switch-modes       "How would you like to add your details" dialog over the Style step
 *                                                       (Figma "Switch Modes"); the same param opens it over any step
 *   /profile/engagement/avatar/skin | /hair | /extras | /outfit    the other four steps
 *
 * The selected skin / hair / extras / outfit values are NOT in the URL: they live in the app-root AvatarSelectionProvider
 * (shared with Career Buddy). Returns { modal, update(patch) } — null / '' / false removes a key.
 */
export const useAvatarState = () => {
  const [params, setParams] = useSearchParams();
  const modal = params.get('modal') === 'switch-modes' ? 'switch-modes' : null;

  const update = useCallback(
    (patch) => {
      log('update', patch);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === '' || v === false || v === undefined) next.delete(k);
            else next.set(k, v === true ? '1' : String(v));
          });
          return next;
        },
        { replace: false }
      );
    },
    [setParams]
  );

  return useMemo(() => ({ modal, update }), [modal, update]);
};
