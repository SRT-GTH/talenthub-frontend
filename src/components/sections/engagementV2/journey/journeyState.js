import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';

const log = debug('journeyState');

/*
 * Journey hub URL state (Figma J-01 … J-07). One hook; every frame is reachable by URL and by interaction.
 *
 *   /profile/engagement                         J-01  map, 1 of 9 done, Interests in progress
 *   /profile/engagement?hover=skills            J-02  map with the tooltip of that stage forced open (any stage id with copy)
 *   /profile/engagement?modal=add-work          J-03  the "How would you like to add your details" mode picker
 *   /profile/engagement?done=3&toast=1          J-05  map, 3 of 9 done, Discoverable unlocked toast
 *   /profile/engagement/milestone               J-04  map (done=3) + Milestone 1 celebration modal
 *   /profile/engagement/milestone/top-20        J-06  map (done=6) + Milestone 2 modal
 *   /profile/engagement/milestone/top-talent    J-07  map (done=9) + Milestone 3 modal
 *
 * Params: done (0..9 stages finished, in order; default 1 — for a signed-in talent the live journey from
 * GET /profiles/journey is used instead unless ?done= is in the URL), hover (stage id), modal ('add-work'), toast ('1'),
 * milestone (1|2|3, opens the celebration modal; the milestone routes default it).
 * `update(patch)` merges into the query string; null / '' / false remove a key.
 */
export const DEFAULT_DONE = 1;

const toInt = (v, fallback) => {
  const n = Number.parseInt(v ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
};

export const useJourneyState = ({ defaults = {} } = {}) => {
  const [params, setParams] = useSearchParams();

  const state = useMemo(() => {
    const done = Math.min(9, Math.max(0, toInt(params.get('done'), defaults.done ?? DEFAULT_DONE)));
    const milestoneRaw = toInt(params.get('milestone'), defaults.milestone ?? 0);
    return {
      done,
      // true when the URL pins the progress (?done=n: design / demo frames); otherwise live progress wins when present
      doneFromUrl: params.has('done'),
      hover: params.get('hover') || null,
      modal: params.get('modal') || null,
      toast: params.get('toast') === '1',
      milestone: [1, 2, 3].includes(milestoneRaw) ? milestoneRaw : 0,
    };
  }, [params, defaults.done, defaults.milestone]);

  const update = useCallback(
    (patch) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(patch).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '' || v === false) next.delete(k);
            else next.set(k, v === true ? '1' : String(v));
          });
          log('update', patch, '->', next.toString());
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  return { ...state, update };
};
