import { useCallback, useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Presentational a11y helper for the onboarding dialogs: moves focus into the
 * dialog when it mounts, keeps Tab / Shift+Tab inside it, and returns focus to
 * the element that opened it on unmount. Attach the returned ref to the element
 * that has role="dialog".
 */
const useDialogFocus = () => {
  const nodeRef = useRef(null);
  const openerRef = useRef(typeof document === 'undefined' ? null : document.activeElement);

  const setRef = useCallback((node) => {
    nodeRef.current = node;
    if (node && !node.contains(document.activeElement)) {
      const first = node.querySelector(FOCUSABLE);
      (first || node).focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    const opener = openerRef.current;
    const onKeyDown = (e) => {
      const node = nodeRef.current;
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!node.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    };
  }, []);

  return setRef;
};

export default useDialogFocus;
