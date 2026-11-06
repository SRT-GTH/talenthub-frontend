import { useEffect, useRef } from 'react';
import { debug } from '../utils/debug.js';

const log = debug('useDismissableLayer');

/*
 * useDismissableLayer — close an open popover when the user presses Escape or presses outside it.
 * `ref` is the element that counts as "inside" (the trigger AND the panel, so the trigger's own click still toggles); `onDismiss` is called once per dismissal.
 * Does nothing while `open` is false.
 */
const useDismissableLayer = (ref, open, onDismiss) => {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        log('dismiss: outside press');
        onDismissRef.current?.();
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('dismiss: Escape');
        onDismissRef.current?.();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open]);
};

export default useDismissableLayer;
