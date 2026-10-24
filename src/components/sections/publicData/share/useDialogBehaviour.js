import { useEffect, useRef } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('useDialogBehaviour');

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const isVisible = (el) => el.offsetParent !== null || el.getClientRects().length > 0;

/*
 * useDialogBehaviour — the behaviour every share / download / digest dialog and sheet shares (Theme 8).
 *   - moves focus into the dialog on mount (the element marked data-autofocus, else the dialog itself — a labelled, focusable container, so Tab starts at the first control)
 *   - traps Tab / Shift+Tab inside the dialog
 *   - closes on Escape through onClose()
 *   - locks the page scroll behind the scrim
 * Restoring focus to the opener is done by PublicDataModals (it knows the opener; a dialog that swaps for another one keeps it).
 */
export const useDialogBehaviour = (containerRef, onClose) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    log('mount');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const target = el.querySelector('[data-autofocus]') ?? el;
    target.focus({ preventScroll: true });

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        log('escape');
        closeRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...el.querySelectorAll(FOCUSABLE)].filter(isVisible);
      if (!items.length) {
        event.preventDefault();
        el.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === el)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!el.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      log('unmount');
    };
  }, [containerRef]);
};
