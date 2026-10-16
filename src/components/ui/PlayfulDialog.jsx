import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('PlayfulDialog');

/*
 * PlayfulDialog — Playful appearance dialog shell (Figma 7887:87553 / 87877 /
 * 88201: scrim rgba(28,42,33,.7), white card r24, 1.5px ink-55 border, shelf shadow).
 *
 * Separate from `Modal` on purpose (Modal is shared by Focused screens and must
 * not change). Adds what the Playful a11y bar needs and Modal lacks:
 *   - role="dialog" | "alertdialog", aria-modal, labelled + described
 *   - focus moves in (data-autofocus → first focusable → card), Tab is trapped,
 *     focus is restored to the opener on close
 *   - the app root is `inert` while open, page scroll is locked
 *   - Esc / scrim click closes
 *   - <sm: bottom sheet with a pinned footer + safe-area padding
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const PlayfulDialog = ({
  open,
  onClose,
  role = 'dialog',
  labelledBy,
  describedBy,
  cardClassName = '',
  bodyClassName = '',
  footer,
  children,
}) => {
  const cardRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const rootEl = document.getElementById('root');
    const prevInert = rootEl?.hasAttribute('inert');
    rootEl?.setAttribute('inert', '');
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    log('open', { role });

    const card = cardRef.current;
    const first = card?.querySelector('[data-autofocus]') ?? card?.querySelector(FOCUSABLE) ?? card;
    first?.focus?.({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        log('branch', { escape: true });
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !card) return;
      const nodes = [...card.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) {
        e.preventDefault();
        return;
      }
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === firstNode || !card.contains(document.activeElement))
      ) {
        e.preventDefault();
        lastNode.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === lastNode || !card.contains(document.activeElement))
      ) {
        e.preventDefault();
        firstNode.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);

    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (!prevInert) rootEl?.removeAttribute('inert');
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      if (opener && document.contains(opener)) opener.focus?.({ preventScroll: true });
      log('close');
    };
  }, [open, role]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden bg-[rgba(28,42,33,0.7)] sm:items-center sm:p-[clamp(12px,2vw,32px)]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCloseRef.current?.();
      }}
    >
      <div
        ref={cardRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        data-ui-style-card=""
        className={classNames(
          'pf-ov-card relative flex max-h-full w-full flex-col overflow-hidden outline-none',
          'max-sm:rounded-b-none max-sm:pb-[env(safe-area-inset-bottom)]',
          cardClassName
        )}
      >
        <div
          className={classNames(
            'min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            bodyClassName
          )}
        >
          {children}
        </div>
        {footer && (
          <div className="shrink-0 max-sm:border-t max-sm:border-[rgba(28,42,33,0.12)] max-sm:bg-white">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PlayfulDialog;
