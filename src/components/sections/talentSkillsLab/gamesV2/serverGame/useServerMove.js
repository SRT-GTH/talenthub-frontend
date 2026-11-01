import { useCallback, useEffect, useRef, useState } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { useGameV2Params } from '../gamesV2State.js';

const log = debug('useServerMove');

/*
 * useServerMove — sends one move to the (mock) server and tracks the three states every "server" game needs.
 *   const { busy, send } = useServerMove({ call, onResult })
 *   send(payload)   → busy while the request is in flight; onResult(response, payload) when it succeeds;
 *                     on failure it opens `?modal=offline` and keeps the payload, then re-sends it once the player closes the
 *                     Connection-lost banner (Retry). Nothing is lost, nothing is sent twice.
 */
export const useServerMove = ({ call, onResult }) => {
  const g = useGameV2Params();
  const [busy, setBusy] = useState(false);
  const pendingRef = useRef(null);
  const sawOfflineRef = useRef(false);
  const callRef = useRef(call);
  const resultRef = useRef(onResult);
  useEffect(() => {
    callRef.current = call;
    resultRef.current = onResult;
  }, [call, onResult]);

  const { openModal } = g;
  const send = useCallback(
    async (payload) => {
      pendingRef.current = payload;
      setBusy(true);
      log('send', payload);
      try {
        const response = await callRef.current(payload);
        pendingRef.current = null;
        setBusy(false);
        resultRef.current(response, payload);
      } catch (err) {
        log.error('move failed, keeping it for Retry:', err?.message);
        sawOfflineRef.current = false;
        setBusy(false);
        openModal('offline');
      }
    },
    [openModal]
  );

  useEffect(() => {
    if (g.modal === 'offline') sawOfflineRef.current = true;
    if (!g.modal && sawOfflineRef.current && pendingRef.current) {
      sawOfflineRef.current = false;
      log('retry after Connection lost');
      send(pendingRef.current);
    }
  }, [g.modal, send]);

  return { busy, send };
};
