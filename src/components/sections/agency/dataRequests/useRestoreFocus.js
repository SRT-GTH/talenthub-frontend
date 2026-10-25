import { useCallback, useEffect, useRef } from 'react';

/*
 * useRestoreFocus — remembers the last element focused outside the dialogs (portals marked data-share-dialog) and returns restore(): call it when a
 * dialog closes so the focus goes back to the control that opened it (if it is still on the page).
 */

export const useRestoreFocus = () => {
  const openerRef = useRef(null);

  useEffect(() => {
    const onFocusIn = (event) => {
      if (!event.target.closest?.('[data-share-dialog]')) openerRef.current = event.target;
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  return useCallback(() => {
    window.requestAnimationFrame(() => {
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }, []);
};
