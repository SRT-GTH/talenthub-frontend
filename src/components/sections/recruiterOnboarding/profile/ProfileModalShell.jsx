import { useEffect, useRef } from 'react';
import { ModalCloseGlyph, ShieldGlyph } from './profileIcons.jsx';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ProfileModalShell');

/*
 * ProfileModalShell - the dialog chrome shared by the three R01/R02 modals.
 * Figma: loader card 7374:2251 (440x645), OTP modal 7374:2524 (460x576),
 * verified card 7374:3466 (440x553). Common: white, 24px radius, 3px #c1d4c4
 * ring, drop shadows, 28px close chip top-right (#ebf1ec), page overlay
 * #1c2a21 @ 70% (Figma "Frame 152" 7374:2251), footer note
 * "Data encrypted at rest · Ghana Data Protection Act compliant".
 *
 * a11y: role=dialog aria-modal aria-labelledby, focus moves in, Tab is
 * trapped, Esc closes, focus is restored to the opener on unmount.
 */
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

const ProfileModalShell = ({
  labelledBy,
  onClose,
  maxWidth = 440,
  closeLabel = 'Close',
  footer = true,
  children,
}) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    log('mount; focus into dialog');
    const dialog = dialogRef.current;
    const first = dialog?.querySelector('input,[data-autofocus]') || dialog;
    first?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        log('esc');
        closeRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const items = [...dialog.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === dialog)) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      log('unmount; restore focus');
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
      style={{ background: 'rgba(28, 42, 33, 0.7)' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={classNames(
          'relative max-h-[calc(100dvh-24px)] w-full overflow-y-auto overscroll-contain no-scrollbar rounded-[24px] bg-white px-[clamp(1rem,5vw,2.5rem)] pt-8 pb-8',
          'max-sm:max-h-[92dvh] max-sm:rounded-b-none max-sm:pt-4 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]'
        )}
        style={{
          maxWidth,
          outline: '3px solid #C1D4C4',
          outlineOffset: '-3px',
          boxShadow: '0 16px 32px -2px rgba(27,36,44,0.16), 0 2px 2px -1px rgba(27,36,44,0.04)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-[clamp(0.75rem,3vw,2rem)] top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:size-11"
        >
          <ModalCloseGlyph />
        </button>
        {children}
        {footer && (
          <p
            className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#959592] max-lg:text-[12px]"
            style={{ letterSpacing: '0.2px' }}
          >
            <ShieldGlyph className="size-3 shrink-0" />
            Data encrypted at rest · Ghana Data Protection Act compliant
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileModalShell;
