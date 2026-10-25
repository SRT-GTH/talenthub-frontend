import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('AgencyDialog');

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/*
 * AgencyDialog — the modal shell of the agency onboarding dialogs (welcome 11.4.1e, check-your-inbox 11.4.1a3/a4, email verified 11.4.1a2,
 * agency already registered 11.4.1a5): portal to <body>, #0b1a0f at 60 % scrim (Figma "Scrim"), centred panel, role="dialog" aria-modal.
 * Focus management: focus moves into the panel on open (the element with data-autofocus, else the first control), Tab / Shift+Tab are trapped, Esc closes
 * (unless dismissable is false), the page scroll is locked and the focus returns to the previously focused element on close.
 * Props: label (accessible name), onClose, dismissable (default true: Esc + scrim click), scrimClassName (the sign-up dialogs use #1c2a21 at 70 %), panelClassName, children.
 */

const AgencyDialog = ({
  label,
  onClose,
  dismissable = true,
  scrimClassName = 'bg-[#0b1a0f]/60',
  panelClassName,
  children,
}) => {
  const panelRef = useRef(null);

  useEffect(() => {
    log('open', { label });
    const previous = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector('[data-autofocus]') ?? panel?.querySelector(FOCUSABLE);
    (first ?? panel)?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissable) {
        e.stopPropagation();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previous && typeof previous.focus === 'function') previous.focus();
      log('close', { label });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      className={classNames(
        'fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-[16px]',
        scrimClassName
      )}
      onMouseDown={(e) => {
        if (dismissable && e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={classNames('relative my-auto outline-none', panelClassName)}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default AgencyDialog;
