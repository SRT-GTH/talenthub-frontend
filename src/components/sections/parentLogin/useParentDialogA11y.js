import { useEffect, useRef } from 'react';
import { debug } from '../../../utils/debug.js';

const log = debug('useParentDialogA11y');

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const visibleFocusables = (root) =>
  [...root.querySelectorAll(FOCUSABLE)].filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'
  );

/*
 * useParentDialogA11y — small dialog-behaviour hook for the Path A parent
 * onboarding dialogs (identity captured, contact success, security, review
 * dialogs, tutorial). Lives next to them on purpose: shared hooks used by other
 * flows are not touched.
 *
 *   • on mount: remembers the opener, moves focus inside (initial target or the
 *     first focusable element) and locks body scroll
 *   • Tab / Shift+Tab are trapped inside `dialogRef`
 *   • Escape calls `onClose` (skipped when `closeOnEscape` is false)
 *   • on unmount: focus returns to the opener
 *
 * The listener is on `document` (capture) so it works wherever focus is.
 * Only the top-most open dialog reacts, via a module-level stack.
 */
const stack = [];

export function useParentDialogA11y({
  dialogRef,
  onClose,
  initialFocusSelector,
  closeOnEscape = true,
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return undefined;
    const token = Symbol('dialog');
    stack.push(token);
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInitial = () => {
      const target =
        (initialFocusSelector && root.querySelector(initialFocusSelector)) ||
        visibleFocusables(root)[0] ||
        root;
      if (target === root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      log('focus moved in', target.tagName);
    };
    const raf = requestAnimationFrame(focusInitial);

    const onKeyDown = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape' && closeOnEscape) {
        e.stopPropagation();
        log('escape');
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = visibleFocusables(root);
      if (!nodes.length) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!root.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const i = stack.indexOf(token);
      if (i >= 0) stack.splice(i, 1);
      document.body.style.overflow = prevOverflow;
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
      log('closed, focus returned');
    };
    // dialogRef / initialFocusSelector are stable for a mounted dialog
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useParentDialogA11y;
