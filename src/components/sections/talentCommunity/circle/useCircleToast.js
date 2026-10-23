import { useCallback, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useCircleToast');

/*
 * useCircleToast — one toast at a time for a My circle page.
 * Returns { toast, show({ text, actionLabel, onAction }), hide }. `toast` is null or { id, text, actionLabel, onAction }.
 */
export const useCircleToast = () => {
  const [toast, setToast] = useState(null);
  const show = useCallback((next) => {
    log('show', next.text);
    setToast({ id: Date.now(), ...next });
  }, []);
  const hide = useCallback(() => setToast(null), []);
  return { toast, show, hide };
};
