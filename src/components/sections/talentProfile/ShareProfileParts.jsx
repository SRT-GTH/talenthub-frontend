import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import {
  ProfileGhanaFlagIcon,
  ShareAlertDiamondIcon,
  ShareArrowLeftIcon,
  ShareCheckWhiteIcon,
  ShareCloseIcon,
} from '../../shared/assets.jsx';
import { QR_ROWS, QR_SIZE } from './talentProfileShareData.js';
import { FOCUS_RING } from './ShareProfileUi.js';

const log = debug('ShareProfileParts');

/*
 * Shared building blocks for the Share profile flow (SH-01 … SH-05, SH-03b-f).
 * Focused values are the default; Playful is added only through `playful:` classes. The Playful
 * additions follow the existing Playful overlay system (1.5px ink-55 border, "shelf" shadow, Bricolage
 * headings, scrim rgba(28,42,33,.7)).
 */

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)]';
const PLAYFUL_CARD_SHADOW =
  'playful:shadow-[0_10px_24px_0_rgba(28,42,33,0.06),5px_5px_0_0_rgba(28,42,33,0.55)]';

/* -------------------------------------------------------------------------- dialog shell */

/*
 * ShareDialog — portal + scrim + dialog card. role="dialog", aria-modal, focus moves in / trapped / restored,
 * app root inert, Esc and scrim click close (usePlayfulDialogA11y). Focused scrim colour measured from
 * the frame overlay: rgba(28,42,33,.55); Playful scrim .7.
 */
export const ShareDialog = ({
  onClose,
  titleId,
  maxWidth = 720,
  toast,
  liveMessage,
  busy = false,
  children,
}) => {
  const dialogRef = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: onClose,
    lockScroll: true,
    initialFocus: () => dialogRef.current?.querySelector('[data-autofocus]'),
  });

  useEffect(() => {
    log('mount', { maxWidth });
  }, [maxWidth]);

  return createPortal(
    <div data-pf-portal="">
      <div
        className="fixed inset-0 z-[60] overflow-y-auto bg-[rgba(28,42,33,0.55)] playful:bg-[rgba(28,42,33,0.7)]"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget || e.target.dataset.shareWrap === '') onClose?.();
        }}
      >
        <div
          data-share-wrap=""
          className="flex min-h-full items-center justify-center p-[clamp(8px,2vw,32px)]"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-busy={busy || undefined}
            tabIndex={-1}
            style={{ '--share-w': `${maxWidth}px` }}
            className={classNames(
              'leading-[normal] relative flex w-full max-w-[var(--share-w)] flex-col gap-[clamp(14px,1.16vw,20px)] rounded-[clamp(18px,1.39vw,24px)] border border-[rgba(28,42,33,0.1)] bg-white p-[clamp(14px,1.62vw,28px)] outline-none',
              SOFT_SHADOW,
              'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)]',
              PLAYFUL_CARD_SHADOW
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {liveMessage ? (
        <p role="status" aria-live="polite" className="sr-only">
          {liveMessage}
        </p>
      ) : null}
      {toast}
    </div>,
    document.body
  );
};

/* Square 36px (or 44px) bordered icon button used for back / close. */
export const ShareIconButton = ({ label, onClick, children, size = 36 }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={classNames(
      'flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#e6e6e6] bg-transparent p-0',
      size === 44 ? 'size-[44px]' : 'size-[36px]',
      FOCUS_RING
    )}
  >
    {children}
  </button>
);

export const ShareCloseButton = ({ onClose, size = 36 }) => (
  <ShareIconButton label="Close" onClick={onClose} size={size}>
    <ShareCloseIcon className={size === 44 ? 'size-[18px]' : 'size-[16px]'} />
  </ShareIconButton>
);

export const ShareBackButton = ({ onBack, size = 36 }) => (
  <ShareIconButton label="Back" onClick={onBack} size={size}>
    <ShareArrowLeftIcon className="size-[18px]" />
  </ShareIconButton>
);

/* Title block: 29px semibold title (+ optional sticker) over a 14px #737373 subtitle. */
export const ShareHead = ({
  titleId,
  title,
  sticker,
  subtitle,
  onBack,
  onClose,
  iconSize = 36,
  gap = 10,
}) => (
  <div className="flex w-full items-start" style={{ gap: `${gap === 12 ? 12 : 10}px` }}>
    {onBack ? <ShareBackButton onBack={onBack} size={iconSize} /> : null}
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px]">
        <h2
          id={titleId}
          className="m-0 text-[clamp(22px,1.68vw,29px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading"
        >
          {title}
        </h2>
        {sticker ? (
          <span className="inline-flex shrink-0 items-center rounded-full bg-brand-green-light px-[10px] py-[5px] text-[12px] font-bold whitespace-nowrap text-[#1f4d26] playful:px-[11px] playful:py-[6px] playful:font-heading">
            {sticker}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <p className="m-0 text-[clamp(12px,0.81vw,14px)] text-[#737373]">{subtitle}</p>
      ) : null}
    </div>
    <ShareCloseButton onClose={onClose} size={iconSize} />
  </div>
);

/* -------------------------------------------------------------------------- form bits */

/* Label row ("Your link *   hint") exactly as the design-system input draws it. */
export const ShareFieldLabel = ({ htmlFor, children, required, hint, fixedHint = false }) => (
  <div
    className={classNames(
      'flex h-[21px] items-center justify-between gap-[8px]',
      fixedHint ? 'w-[427px] max-w-full' : 'w-full'
    )}
  >
    <label
      htmlFor={htmlFor}
      className="flex items-start gap-px text-[14px] leading-6 font-medium tracking-[0.2px] whitespace-nowrap text-[#1c2a21]"
    >
      {children}
      {required ? (
        <span
          aria-hidden="true"
          className="h-[14px] w-[6px] font-ui text-[14px] leading-[21px] font-semibold text-[#2e8b57]"
        >
          *
        </span>
      ) : null}
    </label>
    {hint ? (
      <span className="text-[12px] leading-[18px] tracking-[0.2px] whitespace-nowrap text-[#595959]">
        {hint}
      </span>
    ) : null}
  </div>
);

/* Small helper line under an input: 16px diamond icon + 12px #575755 text. */
export const ShareFieldHelper = ({ id, children, pad = 8 }) => (
  <div
    id={id}
    className="flex items-center gap-[8px] text-[12px] leading-[18px] tracking-[0.2px] text-[#575755]"
    style={{ paddingInline: pad }}
  >
    <ShareAlertDiamondIcon className="size-[16px] shrink-0" />
    <span>{children}</span>
  </div>
);

/* 20px checkbox (Figma `box`): green + white tick when on, white with a 1.5px #bfbfbf border when off. */
export const ShareCheck = ({ checked, onChange, children, className = '' }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={classNames(
      'flex cursor-pointer items-center gap-[10px] bg-transparent p-0 text-left text-[14px] leading-[normal] font-medium',
      checked ? 'text-[#1c2a21]' : 'text-[#595959]',
      FOCUS_RING,
      className
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[20px] shrink-0 items-center justify-center overflow-hidden rounded-[6px] border-solid',
        checked
          ? 'border border-brand-green bg-brand-green'
          : 'border-[1.5px] border-[#bfbfbf] bg-white'
      )}
    >
      {checked ? <ShareCheckWhiteIcon className="size-[13px]" /> : null}
    </span>
    <span>{children}</span>
  </button>
);

/* 40 × 24 switch (Figma `switch`). */
export const ShareSwitch = ({ checked, onChange, labelledBy }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-labelledby={labelledBy}
    onClick={() => onChange(!checked)}
    className={classNames(
      'relative h-[24px] w-[40px] shrink-0 cursor-pointer rounded-full border-0 p-0 motion-safe:transition-colors motion-safe:duration-150',
      checked ? 'bg-brand-green' : 'bg-[#e6e6e6]',
      FOCUS_RING
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'absolute top-[3px] size-[18px] rounded-full bg-white motion-safe:transition-[left] motion-safe:duration-150',
        checked ? 'left-[19px]' : 'left-[3px]'
      )}
    />
  </button>
);

/* -------------------------------------------------------------------------- QR (Figma rectangles) */

const QR_PATH = QR_ROWS.map((cols, row) =>
  cols.map((col) => `M${col} ${row}h1v1h-1z`).join('')
).join('');

/*
 * The Figma "QR code" art: a 25 × 25 module matrix with the Ghana-flag logo in the middle. `outer` is the
 * outer box (border included); the modules fill the outer box exactly as the frames draw them.
 */
export const ShareQr = ({
  size,
  border = 1,
  borderColor = '#1c2a21',
  logo,
  logoBorder,
  logoRadius,
  flag,
  className = '',
}) => (
  <div
    className={classNames('relative shrink-0 overflow-hidden bg-white', className)}
    style={{ width: size, height: size }}
  >
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className="absolute inset-0"
    >
      <path d={QR_PATH} fill="#1c2a21" />
    </svg>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 border-solid"
      style={{ borderWidth: border, borderColor }}
    />
    <span
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden border-solid border-white bg-brand-green"
      style={{ width: logo, height: logo, borderWidth: logoBorder, borderRadius: logoRadius }}
    >
      <span className="flex shrink-0" style={{ width: flag, height: flag }}>
        <ProfileGhanaFlagIcon className="size-full" />
      </span>
    </span>
  </div>
);

/* -------------------------------------------------------------------------- misc */

/* Bottom-centre dark toast (copied / +10 pts). role="status", click to dismiss, auto-hides after 8s. */
export const ShareToast = ({ onDismiss, className = '', children }) => {
  useEffect(() => {
    const t = setTimeout(() => onDismiss?.(), 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      role="status"
      onClick={onDismiss}
      className={classNames(
        'fixed bottom-[clamp(12px,2.3vw,40px)] left-1/2 z-[70] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 cursor-pointer items-center bg-[#1c2a21] text-white',
        SOFT_SHADOW,
        className
      )}
    >
      {children}
    </div>
  );
};
