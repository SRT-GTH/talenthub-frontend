import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { JobsCheckGlyph, JobsCloseGlyph } from './JobsDialogIcons.jsx';
import { FOCUS_RING, INK_CHIP } from './jobsDialogUtils.js';

/*
 * JobsDialogParts — shared pieces of the Job Postings dialogs (Figma "Talent Job Postings" J-06 … J-21).
 * Card chrome (Playful 7511:2457 / Focused 8110:417137): #fffefc, r28, Playful = 1.5px ink@.55 border +
 * 4px hard shadow + soft lift, Focused = 1px ink@.10 hairline + two soft shadows.
 */
const CARD_CHROME =
  'bg-[#fffefc] border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/*
 * DialogFrame — portal + scrim + a11y (focus moves in and is restored, Tab trapped, rest of the page
 * inert, Esc / scrim click close). Two kinds:
 *   modal    centred card on the #1c2a21@.45 scrim (J-16, J-17, J-20)
 *   popover  lg+: no scrim, the card is placed with `--jd-top/--jd-right` (J-06, J-15); below lg it
 *            becomes a centred sheet on the scrim, since the anchors are not on screen then.
 */
export const DialogFrame = ({ kind, onClose, labelId, cardClassName, cardStyle, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    initialFocus: () => ref.current,
    lockScroll: true,
  });
  const modal = kind === 'modal';
  return createPortal(
    <div
      data-pf-portal=""
      className={classNames(
        'fixed inset-0 z-[60] flex overflow-y-auto p-[12px]',
        modal
          ? 'bg-[rgba(28,42,33,0.45)] sm:p-[16px]'
          : 'bg-[rgba(28,42,33,0.45)] lg:overflow-visible lg:bg-transparent lg:p-0'
      )}
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
          'relative m-auto flex w-full flex-col outline-none',
          CARD_CHROME,
          cardClassName
        )}
        style={{ outline: 'none', ...cardStyle }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogClose = ({ onClose, label = 'Close' }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClose}
    className={classNames(
      'flex size-[36px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-transparent text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]',
      FOCUS_RING
    )}
  >
    <JobsCloseGlyph className="size-[16px]" />
  </button>
);

// Cancel / confirm row. `pad` is the Playful wrapper padding that makes room for the 4px button shelf.
export const DialogActions = ({ pad = 'playful:py-[7px]', children }) => (
  <div className={classNames('flex gap-[10px] max-sm:flex-col', pad)}>{children}</div>
);

export const ActionButton = ({
  variant = 'tertiary',
  size = 'sm',
  className,
  onClick,
  disabled,
  children,
}) => (
  <div className="min-w-0 flex-1">
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={classNames('w-full max-lg:whitespace-normal', className)}
    >
      {children}
    </Button>
  </div>
);

// Pill choice (J-16 "Not for you?" / J-20 withdraw reasons).
export const ReasonChip = ({ selected, onToggle, gap = 'gap-[10px]', children }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={classNames(
      'inline-flex items-center rounded-full border border-solid py-[8px] pl-[12px] pr-[14px] text-left font-sans text-[14px] leading-[17px] text-[#1c2a21]',
      gap,
      FOCUS_RING,
      selected
        ? classNames('border-[rgba(28,42,33,0.12)] bg-[#ebf1ec] font-semibold', INK_CHIP)
        : 'border-[#e1eae2] bg-white font-medium'
    )}
  >
    {selected && <JobsCheckGlyph className="size-[13px] shrink-0 text-[#387440]" />}
    {children}
  </button>
);
