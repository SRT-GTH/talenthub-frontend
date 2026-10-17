import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { CloseTileIcon } from './billingIcons.jsx';

const log = debug('BillingDialog');

/*
 * BillingDialog - the centred result card of the Payment step.
 * Figma R06 7374:8437 (awaiting approval) / 7374:8715 (successful):
 * overlay #1c2a21 @ 70%, card 440 wide, r24, 3px #c1d4c4 border, white, shadow
 * 0 8 16 rgba(27,36,44,.12) + 0 2 2 rgba(27,35,44,.04), inner padding 40,
 * 28px circular close (#ebf1ec, green x) top-right.
 *
 * a11y: role="dialog" aria-modal aria-labelledby; focus moves in (to the first
 * focusable), is trapped with Tab/Shift+Tab, Esc closes, focus returns to the
 * trigger on unmount; page scroll locked while open.
 *
 * Props: open, onClose, labelledBy (id of the heading), children.
 */
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const BillingDialog = ({ open, onClose, labelledBy, children }) => {
  const cardRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    log('open');
    const previouslyFocused = document.activeElement;
    const card = cardRef.current;
    const first = card?.querySelector(FOCUSABLE);
    (first || card)?.focus?.();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !card) return;
      const items = [...card.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const head = items[0];
      const tail = items[items.length - 1];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      } else if (!card.contains(document.activeElement)) {
        e.preventDefault();
        head.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus?.();
      log('close');
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1c2a21]/70 p-4">
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={classNames(
          'relative my-auto w-full max-w-[440px] rounded-3xl border-[3px] border-[#c1d4c4] bg-white px-10 pb-8 pt-[29px] outline-none max-sm:px-5',
          'shadow-[0_8px_16px_rgba(27,36,44,0.12),0_2px_2px_rgba(27,35,44,0.04)]'
        )}
      >
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="relative -mb-1 inline-flex size-7 items-center justify-center self-end rounded-full before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <CloseTileIcon className="size-7" />
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BillingDialog;
