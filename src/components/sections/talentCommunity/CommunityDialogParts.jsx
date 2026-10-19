import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import { TalentSidebarProfileAvatarIllustration } from '../../shared/assets.jsx';
import { CommunityCloseGlyph } from './CommunityDialogIcons.jsx';
import { CARD_CHROME, FOCUS_RING, HEADING } from './communityDialogUtils.js';

const log = debug('CommunityDialogParts');

/*
 * Shared pieces of the Community dialogs (create post, report post, leave, milestone share).
 * DialogShell = portal + scrim #1c2a21@.55 + a11y (focus in / restored, Tab trapped, page inert, Esc + scrim close).
 * `width` is the Figma card width at lg+ (create 680, report 560, leave 520, milestone 560); below that the card is
 * the viewport minus the 12px gutters. `gap` = the Figma auto-layout gap (18, milestone 16).
 */
export const DialogShell = ({ width, gap = 18, onClose, labelId, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    log('dialog mount', labelId);
  }, [labelId]);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    initialFocus: () => ref.current,
    lockScroll: true,
  });
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(28,42,33,0.55)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={classNames(
          'relative m-auto flex w-full flex-col rounded-[24px] p-[clamp(18px,5vw,28px)] outline-none',
          CARD_CHROME
        )}
        style={{ maxWidth: width, gap, outline: 'none' }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

/* 40px square close button (white, 1px #e6e6e6, r10, 16px glyph #595959). */
export const CloseButton = ({ onClose }) => (
  <button
    type="button"
    aria-label="Close"
    onClick={onClose}
    className={classNames(
      'flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e6e6e6] bg-white p-0 text-[#595959]',
      FOCUS_RING
    )}
  >
    <CommunityCloseGlyph className="size-[16px]" />
  </button>
);

/* Heading 27/32 (Bricolage in Playful, SF Pro Rounded in Focused). */
export const DialogTitle = ({ id, children, size = 27, lineHeight = 32 }) => (
  <h2
    id={id}
    className={classNames(HEADING, 'm-0 min-w-0 font-semibold tracking-normal text-[#1c2a21]')}
    style={{ fontSize: `clamp(20px,6vw,${size}px)`, lineHeight: `${lineHeight}px` }}
  >
    {children}
  </h2>
);

/* Labelled text field of the frames: label 14/24 + green asterisk + the trailing grey "*" Figma draws at the far right. */
export const FieldLabel = ({ htmlFor, children }) => (
  <div className="flex items-center justify-between">
    <label
      htmlFor={htmlFor}
      className="font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]"
    >
      {children}
      <span aria-hidden="true" className="font-ui text-[14px] font-semibold text-[#2e8b57]">
        *
      </span>
    </label>
    <span
      aria-hidden="true"
      className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#595959]"
    >
      *
    </span>
  </div>
);

/* GTHInput textarea: white, 1px #ccc, r10, p13/16/13/20, 2.5px #bfbfbf shelf, 14/24 text, 112px tall. */
export const TextArea = ({ id, value, onChange, label, rows = 4 }) => (
  <textarea
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label={label}
    rows={rows}
    className={classNames(
      'block h-[112px] w-full resize-none rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pl-[20px] pr-[16px] font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none',
      FOCUS_RING
    )}
  />
);

/* Kofi's round avatar (green face; Playful: green -> sage gradient). `size` = diameter in px. */
export const KofiFace = ({ size = 36, className = '' }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'relative block shrink-0 overflow-hidden rounded-full bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.6%,#7aa870_85.4%)]',
      className
    )}
    style={{ width: size, height: size }}
  >
    <span
      className="absolute block"
      style={{ top: -size * 0.054, left: -size * 0.054, width: size * 1.107, height: size * 1.125 }}
    >
      <TalentSidebarProfileAvatarIllustration className="block h-full w-full max-w-none" />
    </span>
  </span>
);

/* Post-type sticker (Achievement gold in Playful with the 2px hard shadow; Focused: #ebf1ec, no shadow). */
export const PostSticker = ({ children, tone = 'gold', small = false }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center rounded-full font-sans font-bold text-[#1f4a2b] playful:text-[#1c2a21]',
      'bg-[#ebf1ec] px-[10px] py-[4px]',
      tone === 'gold' ? 'playful:bg-[#ffd86b]' : 'playful:bg-[#ebf1ec]',
      'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:py-[5px] playful:shadow-[2px_2px_0_#1c2a21]',
      small
        ? 'text-[10px] leading-[12px] max-lg:text-[12px]'
        : 'text-[11px] leading-[13px] max-lg:text-[12px]'
    )}
  >
    {children}
  </span>
);
