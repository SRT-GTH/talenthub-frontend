import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Modal');

/*
 * Modal — generic modal primitive.
 *
 * A centered content box on a semi-transparent overlay. Closes on:
 *   - the X button (top-right)
 *   - the Escape key
 *   - click on the overlay (anywhere outside the content box)
 *
 * Body + <html> scroll are locked while open. The overlay itself does NOT
 * scroll (overflow-hidden) — tall content scrolls inside the content box
 * so the page never gains a viewport scrollbar behind the dialog.
 *
 * Layout (flex column, max-h = available padded viewport):
 *   [optional header]  — pinned, does not scroll
 *   [children]         — flex-1 overflow-y-auto
 *   [optional footer]  — pinned, does not scroll
 *
 * `overflow-hidden` on the content box clips children/footer to
 * `rounded-2xl` so opaque footers don't square off the bottom corners.
 * Callers that need a fixed height (Game Store) pass it via contentClassName.
 *
 * RESPONSIVE: below `sm` (640px) the dialog becomes a bottom sheet — flush to
 * the screen edges, square bottom, capped at 100dvh so the on-screen keyboard
 * and iOS URL bar never push the footer out of reach. >= sm is unchanged.
 */

const SIZE_CLASSES = {
  sm: 'max-w-[420px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[920px]',
  xl: 'max-w-[1100px]',
};

const CloseIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const ScrollDownChevron = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <polyline points="4 6 8 10 12 6" />
  </svg>
);

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Modal = ({
  isOpen,
  onClose,
  size = 'lg',
  ariaLabel,
  showClose = true,
  className,
  contentClassName,
  // Opt-out (default true): the round "scroll down for more" hint above the footer.
  scrollHint = true,
  // (add-only) 'dialog' puts the first focus on the dialog box itself instead of the close button / first control (no focus ring on open; Tab still enters and wraps inside).
  initialFocus = 'auto',
  header,
  footer,
  children,
}) => {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasMore = el.scrollHeight - el.scrollTop - el.clientHeight > 8;
    setCanScrollDown(hasMore);
  }, []);

  const handleScrollClick = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ top: 120, behavior: 'smooth' });
  };

  // ESC to close + document scroll lock while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    log('open');

    // Keyboard containment (WCAG 2.4.3): Tab wraps inside the dialog while focus is in it, and focus returns to where it was on close.
    const opener = document.activeElement;
    const focusables = () =>
      [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])].filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key !== 'Tab') return;
      const nodes = focusables();
      const active = document.activeElement;
      if (!dialogRef.current?.contains(active)) {
        // Focus escaped (or is on <body>): bring it back in.
        e.preventDefault();
        (nodes[0] ?? dialogRef.current)?.focus?.();
        return;
      }
      if (!nodes.length) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey && (active === nodes[0] || active === dialogRef.current)) {
        e.preventDefault();
        nodes[nodes.length - 1].focus();
      } else if (!e.shiftKey && active === nodes[nodes.length - 1]) {
        e.preventDefault();
        nodes[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // First focus: the close button, else the first control, else the dialog itself.
    if (initialFocus === 'dialog') dialogRef.current?.focus?.();
    else (closeButtonRef.current ?? focusables()[0] ?? dialogRef.current)?.focus?.();

    requestAnimationFrame(checkScroll);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus?.();
      log('close');
    };
  }, [isOpen, onClose, checkScroll, initialFocus]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    // Only close when the click originated on the overlay itself —
    // a drag that ends here from inside the content shouldn't dismiss.
    // This check alone is sufficient (a click starting on real content
    // never has target === currentTarget), so the content box does NOT
    // need its own stopPropagation to guard against it — a previous
    // version added one defensively, but that also silently ate the
    // native mousedown for any nested outside-click-to-close component
    // (Select's dropdown, DatePicker's popup) rendered inside a Modal,
    // since React's synthetic stopPropagation calls the underlying
    // native Event.stopPropagation() too. Removed 2026-09-06.
    if (e.target === e.currentTarget) onClose?.();
  };

  return createPortal(
    // Flex centering + overflow-hidden: the dialog is capped to the padded
    // viewport (`max-h-full`), so the overlay never grows a page scrollbar.
    // Internal scroll lives on the children region below.
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={handleOverlayMouseDown}
      className={classNames(
        'fixed inset-0 z-50 flex items-end justify-center overflow-hidden sm:items-center',
        'px-0 pt-[env(safe-area-inset-top)] sm:px-[clamp(12px,2vw,32px)] sm:py-[clamp(16px,3vw,40px)]',
        'bg-black/30 backdrop-blur-[2px] focus:outline-none',
        className
      )}
    >
      <div
        className={classNames(
          'relative flex w-full max-h-full flex-col overflow-hidden rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-bottom-400 sm:rounded-2xl sm:pb-0',
          SIZE_CLASSES[size] || SIZE_CLASSES.lg,
          contentClassName
        )}
      >
        {showClose && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={classNames(
              'absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full sm:right-4 sm:top-4 sm:size-9',
              'border border-border-default bg-white text-content-primary',
              'hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
            )}
          >
            <CloseIcon className="size-4" />
          </button>
        )}

        {header && <div className="shrink-0">{header}</div>}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>

        {footer && (
          <div className="relative shrink-0">
            {scrollHint && canScrollDown && (
              <button
                type="button"
                onClick={handleScrollClick}
                aria-label="Scroll down for more"
                className="absolute left-1/2 -translate-x-1/2 -top-[16px] z-10 size-[32px] rounded-full bg-white border border-[#e0e0e0] shadow-[0px_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-opacity hover:bg-[#f5f5f5]"
              >
                <ScrollDownChevron className="size-[14px] text-[#575755]" />
              </button>
            )}
            {footer}
          </div>
        )}
        {!footer && scrollHint && canScrollDown && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleScrollClick}
              aria-label="Scroll down for more"
              className="absolute left-1/2 -translate-x-1/2 -top-[16px] z-10 size-[32px] rounded-full bg-white border border-[#e0e0e0] shadow-[0px_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer transition-opacity hover:bg-[#f5f5f5]"
            >
              <ScrollDownChevron className="size-[14px] text-[#575755]" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
