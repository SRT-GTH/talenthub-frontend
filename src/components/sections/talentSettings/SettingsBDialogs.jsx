import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { SettingsCheckIcon, SettingsCloseXIcon } from '../../shared/assets.jsx';

const log = debug('SettingsBDialogs');

/*
 * Settings-B overlays: the modal shell (Change password, Two-step code, Delete account) and the
 * toast (Device logged out, Download requested). Scrim rgba(28,42,33,.55); Focused panel = hairline
 * border + soft drop; Playful panel = 1.5px ink border + 4px "shelf" (Figma modals 8110:51289 /
 * 7856:232932). Focus moves in, is trapped and restored; Esc closes; the page behind is inert.
 */

const PANEL_FOCUSED =
  'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]';
const PANEL_PLAYFUL =
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

// The Playful variants only apply while <html data-ui-style="playful"> is set (UiStyleScope); the
// portal renders into <body>, which is still under <html>, so the selectors match.
export const SettingsDialog = ({
  open,
  title,
  icon,
  iconTone = 'bg-[#ebf1ec]',
  onClose,
  widthClass = 'w-[520px]',
  topOffset = false,
  initialFocus,
  children,
  closeLabel = 'Close',
  gap = 'gap-[16px]',
  testId,
}) => {
  const dialogRef = useRef(null);
  const titleId = useId();
  usePlayfulDialogA11y({ open, dialogRef, onEscape: onClose, initialFocus, lockScroll: true });

  useEffect(() => {
    if (open) log('open', { title });
  }, [open, title]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      data-pf-portal=""
      data-settings-dialog={testId}
      className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-[rgba(28,42,33,0.55)] p-[12px] sm:p-[16px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={topOffset ? { marginTop: 'max(0px, calc(min(12dvh, 128px) - 16px))' } : undefined}
        className={classNames(
          'my-auto flex max-w-full flex-col rounded-[24px] bg-white p-[clamp(18px,2vw,28px)] outline-none',
          gap,
          PANEL_FOCUSED,
          PANEL_PLAYFUL,
          widthClass
        )}
      >
        <div className="flex w-full items-center gap-[12px]">
          <span
            aria-hidden="true"
            className={classNames(
              'flex size-[44px] shrink-0 items-center justify-center rounded-[13px]',
              iconTone
            )}
          >
            {icon}
          </span>
          <h2
            id={titleId}
            className="min-w-0 flex-1 font-sans text-[clamp(18px,1.7vw,24px)] leading-[1.2] font-semibold tracking-[-0.24px] text-[#1c2a21] playful:font-heading"
          >
            {title}
          </h2>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="flex shrink-0 cursor-pointer items-start rounded-full bg-[#f8f8f4] p-[6px] text-[#1c2a21]"
          >
            <SettingsCloseXIcon className="size-[18px]" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

// Toast (Figma `Toast · …`): 28px check disc + two text lines, pinned under the nav on the right.
// `elevated` = the Focused soft drop / Playful shelf that ST-07b draws (ST-06d draws a flat toast).
export const SettingsToast = ({
  open,
  title,
  body,
  onDismiss,
  elevated = false,
  duration = 8000,
}) => {
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return undefined;
    log('toast', { title });
    const timer = window.setTimeout(() => dismissRef.current?.(), duration);
    const onKey = (event) => {
      if (event.key === 'Escape') dismissRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, title, duration]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      data-settings-toast=""
      onClick={() => dismissRef.current?.()}
      className={classNames(
        'fixed top-[clamp(72px,6vw,104px)] right-[clamp(12px,3.3vw,57px)] z-[1900] flex max-w-[calc(100vw-24px)] cursor-pointer items-center gap-[12px] rounded-[16px] bg-white px-[18px] py-[14px] max-lg:px-[14px] max-lg:py-[12px]',
        'border border-[rgba(28,42,33,0.1)]',
        elevated && 'shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]',
        elevated
          ? 'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]'
          : 'playful:border-[1.4px] playful:border-[rgba(28,42,33,0.32)]'
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-[#1c2a21] playful:bg-[#ebf1ec]"
      >
        <SettingsCheckIcon className="size-[16px]" />
      </span>
      <div className="flex min-w-0 flex-col items-start gap-px leading-[normal]">
        <p className="text-[15px] font-semibold text-[#1c2a21] lg:whitespace-nowrap">{title}</p>
        <p className="text-[13px] text-[#595959] lg:whitespace-nowrap">{body}</p>
      </div>
    </div>,
    document.body
  );
};
