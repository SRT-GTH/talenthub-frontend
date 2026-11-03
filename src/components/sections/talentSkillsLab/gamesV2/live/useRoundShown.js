import { useEffect, useRef } from 'react';
import { debug } from '../../../../../utils/debug.js';

const log = debug('useRoundShown');

/*
 * useRoundShown — tells the server engine that a round is now on screen, so its clock starts then and not while the previous
 * round's feedback (or the page) was still showing: run.act({ type: 'round_shown', round: index }, { quiet: true }).
 * Engines with round clocks: number_sequence, word_scramble, rule_switch, route_planner, chess_tactics. The server ignores a
 * repeat or a stale index, and starts the clock by itself after a short grace if this never arrives.
 *
 *   useRoundShown(run, index, onShown?)
 *     index     the round actually drawn now, or null while none is (feedback / review / loading). Sent once per index.
 *     onShown   optional (result) => void with the server's { round, timeLeftMs, alreadyStarted }, e.g. to re-sync a local clock.
 * Only sent while the live run is 'ready' (never in the `?demo=1` / `?f=` mocks, which have no run).
 */
export const useRoundShown = (run, index, onShown) => {
  const sent = useRef(null);
  const cb = useRef(onShown);
  useEffect(() => {
    cb.current = onShown;
  });
  const ready = run.status === 'ready';
  const { act } = run;
  useEffect(() => {
    if (!ready || index === null || index === undefined || sent.current === index) return;
    sent.current = index;
    log('round shown', index);
    act({ type: 'round_shown', round: index }, { quiet: true }).then((res) => {
      if (res?.result?.roundShown) cb.current?.(res.result);
    });
  }, [ready, index, act]);
};
