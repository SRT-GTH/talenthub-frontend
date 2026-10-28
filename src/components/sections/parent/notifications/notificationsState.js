import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/*
 * useNotificationsState — URL state of the parent notification screens (every Figma frame is a URL). Keys:
 *   notif=open                    PN-01  the bell panel over any parent page (the frame draws it over the home: /parent?notif=open)
 *   tab=approvals | milestones | ward-activity | from-gth   /parent/notifications  PN-04 draws "All" (no `tab`); the other tabs are not drawn (⚠️ ASSUMPTION: they filter the same rows)
 *   reaction=<id>                 /parent/notifications/milestone  PN-03 the selected quick reaction (default well-done)
 *   toast=sent                    /parent/notifications/milestone?toast=sent  PN-03b "Sent to Abena"
 *   notice=abena-joined           /parent?notice=abena-joined  PN-05b the in-app notice over the home
 * `update(patch)` merges into the query string; null / '' removes a key.
 */
export const NOTIF_TABS = ['all', 'approvals', 'milestones', 'ward-activity', 'from-gth'];
export const REACTIONS = ['well-done', 'so-proud', 'keep-going', 'write-my-own'];

export const useNotificationsState = () => {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const tab = params.get('tab');
    const reaction = params.get('reaction');
    return {
      panelOpen: params.get('notif') === 'open',
      tab: NOTIF_TABS.includes(tab) ? tab : 'all',
      reaction: REACTIONS.includes(reaction) ? reaction : 'well-done',
      toast: params.get('toast') === 'sent' ? 'sent' : '',
      notice: params.get('notice') === 'abena-joined' ? 'abena-joined' : '',
    };
  }, [params]);

  const update = useCallback(
    (patch, { replace = true } = {}) => {
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

export default useNotificationsState;
