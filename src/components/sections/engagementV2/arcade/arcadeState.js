import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEMO_PLAYED, FILTERS, GAME_BY_ID } from './arcadeData.js';

/*
 * Arcade hub URL state (route /profile/filling/personality/arcade):
 *   PA-01  /profile/filling/personality/arcade                          hub, nothing played yet
 *   PA-02  ?modal=details                                               Makola Haggle details over the hub (&game=<id>)
 *   PA-13  ?played=3&modal=archetype                                    3 games played, "Your archetype is ready"
 *          ?played=3                                                    hub with the three drawn games played
 *          ?filter=<Strategy|Social|Decisions|Planning|Speed|Logic|Creativity>
 * `played` overrides the saved progress: a number (0..3 -> the first drawn games) or a comma list of game ids.
 * update(patch): null / '' / false remove a key.
 */
export const useArcadeState = () => {
  const [params, setParams] = useSearchParams();
  const modal = ['details', 'archetype'].includes(params.get('modal')) ? params.get('modal') : null;
  const game = GAME_BY_ID[params.get('game')] ? params.get('game') : 'makola-haggle';
  const filter = FILTERS.includes(params.get('filter')) ? params.get('filter') : null;
  const rawPlayed = params.get('played');
  let playedOverride = null;
  if (rawPlayed !== null && rawPlayed !== '') {
    playedOverride = /^\d+$/.test(rawPlayed)
      ? DEMO_PLAYED.slice(0, Math.min(3, Number(rawPlayed)))
      : rawPlayed.split(',').filter((id) => GAME_BY_ID[id]);
  }

  const update = useCallback(
    (patch) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => {
          if (v === null || v === '' || v === false || v === undefined) next.delete(k);
          else next.set(k, String(v));
        });
        return next;
      });
    },
    [setParams]
  );

  return { modal, game, filter, playedOverride, update };
};
