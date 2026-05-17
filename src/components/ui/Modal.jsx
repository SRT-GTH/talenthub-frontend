import { useEffect, useRef } from 'react';
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
 * The component does not handle focus-trapping or scroll-locking via a
 * library — body scroll is locked while open via `document.body.style.overflow`,
 * and the close button is auto-focused on open so keyboard users land
 * somewhere sensible. Drop in a focus-trap helper later if we adopt one.
 *
 * Sizing: a `size` prop drives the max-width. The content box is
 * vertically capped to ~90vh and scrolls internally if its body
 * overflows, so the modal never spills off-screen on small viewports.
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

const Modal = ({
  isOpen,
  onClose,
  size = 'lg',
  ariaLabel,
  showClose = true,
  className,
  contentClassName,
  children,
}) => {
  const closeButtonRef = useRef(null);

  // ESC to close + body-scroll lock while open.
  useEffect(() => {
    if (!isOpen) return undefined;
    log('open');

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeButtonRef.current?.focus?.();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      log('close');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (e) => {
    // Only close when the click originated on the overlay itself —
    // a drag that ends here from inside the content shouldn't dismiss.
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={handleOverlayMouseDown}
      className={classNames(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/30 backdrop-blur-[2px]',
        'px-[clamp(12px,2vw,32px)] py-[clamp(12px,2vw,32px)]',
        className
      )}
    >
      <div
        className={classNames(
          'relative w-full bg-white rounded-2xl shadow-bottom-400',
          'max-h-[90vh] overflow-y-auto',
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
              'absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full',
              'border border-border-default bg-white text-content-primary',
              'hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
            )}
          >
            <CloseIcon className="size-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
