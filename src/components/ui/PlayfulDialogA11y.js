import { useEffect, useRef } from 'react';
import { debug } from '../../utils/debug.js';

const log = debug('PlayfulDialogA11y');

/*
 * usePlayfulDialogA11y — modal-dialog behaviour for the Playful game surfaces
 * (Game Store dialog, Escape Room board). Gives them what ui/Modal.jsx does not:
 *  - focus moves into the dialog on open and is restored to the opener on close
 *  - Tab / Shift+Tab are trapped inside the dialog
 *  - every other child of <body> is made `inert` + aria-hidden (backdrop inert)
 *  - Esc closes — but only the TOPMOST open Playful dialog reacts (the Escape Room opens
 *    over the Game Store, which stays mounted underneath)
 *  - optional document scroll lock
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const stack = [];
// Ref-counted inert state per element: two Playful dialogs can be open at once (Escape Room over
// the Game Store) and close in either order — only the last release restores the original state.
const inertHolds = new Map();
const holdInert = (el) => {
  const hold = inertHolds.get(el) ?? {
    count: 0,
    inert: el.inert,
    ariaHidden: el.getAttribute('aria-hidden'),
  };
  hold.count += 1;
  inertHolds.set(el, hold);
  el.inert = true;
  el.setAttribute('aria-hidden', 'true');
};
const releaseInert = (el) => {
  const hold = inertHolds.get(el);
  if (!hold) return;
  hold.count -= 1;
  if (hold.count > 0) return;
  inertHolds.delete(el);
  el.inert = hold.inert;
  if (hold.ariaHidden === null) el.removeAttribute('aria-hidden');
  else el.setAttribute('aria-hidden', hold.ariaHidden);
};

export const usePlayfulDialogA11y = ({
  open,
  dialogRef,
  onEscape,
  initialFocus,
  lockScroll = false,
}) => {
  const onEscapeRef = useRef(onEscape);
  const initialFocusRef = useRef(initialFocus);
  useEffect(() => {
    onEscapeRef.current = onEscape;
    initialFocusRef.current = initialFocus;
  });

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    log('open', { lockScroll });

    const opener = document.activeElement;
    const token = {};
    stack.push(token);

    // Backdrop inert: everything in <body> except the portal subtree holding this dialog.
    const host = dialog.closest('[data-pf-portal]') ?? dialog;
    const touched = [];
    Array.from(document.body.children).forEach((el) => {
      if (el === host || el.contains(host) || el.tagName === 'SCRIPT') return;
      touched.push(el);
      holdInert(el);
    });

    let prevBody;
    let prevHtml;
    if (lockScroll) {
      prevBody = document.body.style.overflow;
      prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    const focusables = () =>
      Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );

    const target = initialFocusRef.current?.() ?? focusables()[0] ?? dialog;
    requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));

    const onKey = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        log('branch', { escape: true });
        onEscapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialog.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      const i = stack.indexOf(token);
      if (i >= 0) stack.splice(i, 1);
      touched.forEach(releaseInert);
      if (lockScroll) {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      }
      if (opener && opener.isConnected) opener.focus?.({ preventScroll: true });
      log('close');
    };
  }, [open, dialogRef, lockScroll]);
};
