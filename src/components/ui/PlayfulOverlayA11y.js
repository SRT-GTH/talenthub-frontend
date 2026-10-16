import { useEffect, useRef } from 'react';
import { debug } from '../../utils/debug.js';

const log = debug('PlayfulOverlayA11y');

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Makes an inline `role="dialog" aria-modal` overlay (voice call / voice settings)
 * honest for keyboard + assistive tech:
 *  - everything outside the overlay becomes `inert` (siblings of each ancestor;
 *    #toast-root is left alone so toasts stay reachable)
 *  - focus moves in (`[data-autofocus]` → first focusable), Tab is trapped,
 *    Esc calls `onEscape`
 *  - focus is restored to the opener on close
 */
export default function usePlayfulOverlayA11y({ open, enabled = true, rootRef, onEscape }) {
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;

  useEffect(() => {
    const root = rootRef.current;
    if (!open || !enabled || !root) return undefined;
    const opener = document.activeElement;
    const marked = [];
    for (let node = root; node && node !== document.body; node = node.parentElement) {
      const parent = node.parentElement;
      if (!parent) break;
      [...parent.children].forEach((sib) => {
        if (sib === node || sib.id === 'toast-root' || sib.hasAttribute('inert')) return;
        if (['SCRIPT', 'STYLE', 'LINK'].includes(sib.tagName)) return;
        sib.setAttribute('inert', '');
        marked.push(sib);
      });
    }
    log('open', { inertSiblings: marked.length });

    const first = root.querySelector('[data-autofocus]') ?? root.querySelector(FOCUSABLE);
    first?.focus?.({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        log('branch', { escape: true });
        escapeRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = [...root.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) {
        e.preventDefault();
        return;
      }
      const a = nodes[0];
      const z = nodes[nodes.length - 1];
      const inside = root.contains(document.activeElement);
      if (e.shiftKey && (!inside || document.activeElement === a)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && (!inside || document.activeElement === z)) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      marked.forEach((n) => n.removeAttribute('inert'));
      if (opener && document.contains(opener)) opener.focus?.({ preventScroll: true });
      log('close');
    };
  }, [open, enabled, rootRef]);
}
