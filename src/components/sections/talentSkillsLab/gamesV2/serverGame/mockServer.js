import { debug } from '../../../../../utils/debug.js';

const log = debug('mockServer');

/*
 * mockServer — a tiny stand-in for the "server decides" games (Crisis Room, Makola Haggle: every move is validated on GTH's
 * servers). ⚠️ ASSUMPTION: the endpoints, payloads and delay are invented; each game's data file shapes its handler like the
 * future `POST /skills-lab/games/:id/...` response and calls `callServer(label, handler)`.
 *   - resolves after SERVER_DELAY_MS (the "checking" state of the game);
 *   - rejects with { offline: true } when the browser is offline, or ONCE per page load when the URL has `?sim=offline`
 *     (so the Connection-lost path can be exercised without cutting the network). The game then opens `?modal=offline` and
 *     re-sends the move when the player presses Retry.
 */
export const SERVER_DELAY_MS = 650;

let simulatedFailureUsed = false;

const shouldFail = () => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  if (simulatedFailureUsed) return false;
  const sim = new URLSearchParams(window.location.search).get('sim') === 'offline';
  if (sim) simulatedFailureUsed = true;
  return sim;
};

export const callServer = (label, handler, delay = SERVER_DELAY_MS) => {
  log('request', label);
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail()) {
        log('response', label, 'offline');
        reject(Object.assign(new Error('Connection lost'), { offline: true }));
        return;
      }
      const data = handler();
      log('response', label, data && Object.keys(data));
      resolve(data);
    }, delay);
  });
};
