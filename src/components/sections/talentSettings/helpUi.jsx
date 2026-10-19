import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { HelpFileDocumentIcon } from '../../shared/assets.jsx';
import rowHelp from '../../../assets/notifications/help/row-help.svg';
import rowShield from '../../../assets/notifications/help/row-shield.svg';
import rowInfo from '../../../assets/notifications/help/row-info.svg';
import rowVerified from '../../../assets/notifications/help/row-verified.svg';
import rowChevron from '../../../assets/notifications/help/row-chevron.svg';

const log = debug('helpUi');

/*
 * Shared building blocks of the Help set (HS-01, HP-01…HP-08, FB-01, IV-01). Focused values are the
 * default; Playful is added ONLY through `playful:` variants. Figma component names are noted per piece.
 */

// Headings: SF Pro Rounded Semibold (Focused) / Bricolage Grotesque SemiBold (Playful).
export const HEADING = 'font-sans font-semibold playful:font-heading';

// Page cards (HP-04 Article / HP-05 Form / side cards): Focused 1px line + soft shadow; Playful 1.5px ink-55 + 4px shelf.
export const PAGE_CARD =
  'rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

// Floating-modal cards (FB-01 / IV-01).
export const DIALOG_CARD =
  'rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),4px_4px_0_rgba(28,42,33,0.45)]';

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

/* ---- GTH · Button (Btn · …) ---- */
const BTN_SIZES = {
  sm: 'h-[36px] px-[14px] text-[13px]',
  md: 'h-[40px] px-[16px] text-[14px]',
  lg: 'h-[44px] px-[18px] text-[14px]',
  xl: 'h-[56px] px-[18px] text-[16px]',
};

const PRIMARY_LABEL = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

export const HelpButton = ({
  tone = 'secondary',
  size = 'lg',
  icon,
  iconAfter,
  disabled = false,
  className,
  children,
  ...rest
}) => {
  const primary = tone === 'primary';
  return (
    <button
      type="button"
      aria-disabled={disabled || undefined}
      {...rest}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        rest.onClick?.(e);
      }}
      className={classNames(
        'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] whitespace-nowrap border-b-2 border-l-2 border-r-2 border-t border-solid font-sans font-bold leading-[24px] tracking-[0.1px] transition-transform active:translate-y-[2px]',
        FOCUS_RING,
        primary
          ? 'rounded-[10px] border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626]'
          : 'rounded-[14px] border-[rgba(28,42,33,0.3)] bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]',
        disabled && 'cursor-not-allowed opacity-60',
        BTN_SIZES[size],
        className
      )}
    >
      {icon}
      {primary ? <span style={PRIMARY_LABEL}>{children}</span> : children}
      {iconAfter}
    </button>
  );
};

/* ---- GTH · Chip ---- */
export const HelpChip = ({
  selected = false,
  soft = false,
  tone,
  onClick,
  children,
  className,
}) => {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      {...(onClick ? { type: 'button', onClick, 'aria-pressed': selected } : {})}
      className={classNames(
        'inline-flex h-[32px] items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[1.2]',
        onClick && `cursor-pointer ${FOCUS_RING}`,
        tone === 'status'
          ? // Request status: ink-filled in Focused (8166:48124), white + line in Playful (8166:42442).
            'border-[#1c2a21] bg-[#1c2a21] text-white playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]'
          : selected
            ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
            : soft
              ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
              : 'border-[#e1eae2] bg-white text-[#595959]',
        className
      )}
    >
      {children}
    </Tag>
  );
};

/* ---- GTH · Kbd ---- */
export const Kbd = ({ children }) => (
  <kbd className="inline-flex min-w-[22px] items-center justify-center rounded-[6px] border border-solid border-[rgba(28,42,33,0.2)] bg-white px-[7px] py-[2px] font-sans text-[12px] font-semibold leading-[1.2] text-[#1c2a21] shadow-[0_1.5px_0_rgba(28,42,33,0.18)]">
    {children}
  </kbd>
);

/* ---- GTH · Help row (Link + Result) ---- */
const ROW_ICONS = { help: rowHelp, shield: rowShield, info: rowInfo, verified: rowVerified };

const RowIcon = ({ name }) =>
  name === 'file' ? (
    <HelpFileDocumentIcon className="size-[16px] shrink-0" />
  ) : (
    <img
      src={ROW_ICONS[name] ?? rowHelp}
      alt=""
      aria-hidden="true"
      className="size-[16px] shrink-0"
    />
  );

// Matched part of `text` in bold brand green (Figma: "highlight the matched word in bold green").
export const Highlight = ({ text, query }) => {
  const q = query.trim();
  if (!q) return text;
  const at = text.toLowerCase().indexOf(q.toLowerCase());
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="font-bold text-[#387440]">{text.slice(at, at + q.length)}</span>
      {text.slice(at + q.length)}
    </>
  );
};

export const HelpRow = ({ icon, title, preview, category, query = '', onClick, className }) => (
  <button
    type="button"
    aria-label={preview ? `${title}. ${preview}` : title}
    onClick={onClick}
    className={classNames(
      'flex w-full cursor-pointer gap-[10px] rounded-[12px] border border-solid border-[#387440] bg-[#f7f8f4] py-[10px] pl-[12px] pr-[10px] text-left transition-colors hover:bg-[#ebf1ec]',
      preview ? 'items-start' : 'items-center',
      FOCUS_RING,
      className
    )}
  >
    <span className={classNames('flex h-[16px] shrink-0 items-center', preview && 'mt-[2px]')}>
      <RowIcon name={icon} />
    </span>
    <span
      className={classNames(
        'flex min-w-0 flex-1 flex-col items-start',
        preview ? 'gap-[4px]' : 'gap-[2px]'
      )}
    >
      {query ? (
        <span className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21]">
          <Highlight text={title} query={query} />
        </span>
      ) : (
        <span
          aria-hidden="true"
          data-count={title}
          className="font-sans text-[14px] font-medium leading-[1.2] text-[#1c2a21] after:content-[attr(data-count)]"
        />
      )}
      {preview && (
        <span className="font-sans text-[12px] leading-[1.2] text-[#595959]">{preview}</span>
      )}
      {category && <HelpChip soft>{category}</HelpChip>}
    </span>
    <img
      src={rowChevron}
      alt=""
      aria-hidden="true"
      className={classNames('size-[16px] shrink-0', preview && 'mt-[0px]')}
    />
  </button>
);

/* ---- Modal shell (scrim + focus trap + inert backdrop + Esc) ---- */
export const HelpModal = ({
  onClose,
  labelledBy,
  describedBy,
  scrim = 'rgba(28,42,33,0.45)',
  role = 'dialog',
  cardClassName,
  children,
}) => {
  const dialogRef = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef, onEscape: onClose, lockScroll: true });
  log('mount modal', { labelledBy });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-[12px] sm:items-center sm:p-[clamp(12px,2vw,32px)]"
      style={{ backgroundColor: scrim }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={classNames('relative my-auto w-full outline-none', cardClassName)}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

// Page title + subtitle block shared by HS-01 / HP-04 / HP-05 (title row 41px, 34px; subtitle 16/24).
export const PageHeader = ({ title, subtitle, preserveSpaces = false }) => (
  <div className="flex flex-col gap-[3px]">
    <h1
      className={classNames(
        'm-0 text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.68px] text-[#1c2a21]',
        HEADING
      )}
    >
      {title}
    </h1>
    <p
      className={classNames(
        'm-0 font-sans text-[clamp(14px,0.93vw,16px)] leading-[24px] tracking-[0.2px] text-[#595959]',
        preserveSpaces && 'whitespace-pre-wrap'
      )}
    >
      {subtitle}
    </p>
  </div>
);
