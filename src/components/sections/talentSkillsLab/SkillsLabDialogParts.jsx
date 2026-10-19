import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import Button from '../../ui/Button.jsx';
import { SkillsLabCloseGlyph, SkillsLabToastCheckGlyph } from './SkillsLabDialogIcons.jsx';
import { SKILLS_LAB_TOASTS } from './skillsLabData.js';
import { FOCUS_RING, HEADING } from './skillsLabDialogUtils.js';

const log = debug('SkillsLabDialogParts');

/*
 * Shared pieces of the Skills Lab dialogs + toasts (Figma SL-M1 … SL-M6, SL-T1 … SL-T4; Playful 7853:13027 …, Focused 8110:490041 …).
 * Card chrome: white, r24, p28, gap16. Playful = 1.5px ink@.55 border + 4px hard shadow + soft lift; Focused = 1px ink@.10
 * hairline + two soft shadows. Scrim #1c2a21@.55 in both styles.
 */
const CARD_CHROME =
  'bg-white border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/*
 * DialogShell — portal + scrim + a11y (focus moves in and is restored, Tab trapped, rest of the page inert, Esc / scrim click
 * close). `width` is the Figma card width in px at lg+; below that the card is full width minus the 12px gutters.
 */
export const DialogShell = ({ width, onClose, labelId, children }) => {
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
          'relative m-auto flex w-full flex-col gap-[16px] rounded-[24px] p-[clamp(18px,5vw,28px)] outline-none',
          CARD_CHROME
        )}
        style={{ maxWidth: width, outline: 'none' }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

/* Header row: 44px tile + title + 30px close. `tile` colours are per dialog / style (see SkillsLabDialogs). */
export const DialogHeader = ({ id, title, tileClass, icon, onClose }) => (
  <div className="flex items-center gap-[12px]">
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[44px] shrink-0 items-center justify-center rounded-[13px] text-[#1c2a21]',
        tileClass
      )}
    >
      {icon}
    </span>
    <h2
      id={id}
      className={classNames(
        HEADING,
        'm-0 min-w-0 flex-1 text-[clamp(20px,5.5vw,24px)] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1c2a21]'
      )}
    >
      {title}
    </h2>
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className={classNames(
        'flex size-[30px] shrink-0 items-center justify-center rounded-full border-0 bg-[#f8f8f4] p-0 text-[#1c2a21]',
        FOCUS_RING
      )}
    >
      <SkillsLabCloseGlyph className="size-[18px]" />
    </button>
  </div>
);

/*
 * Buttons row. Figma draws the pair with fixed (hug) heights — tertiary lg 56, primary sm 48 (or lg 56 for the weekly
 * challenge) — top aligned, widths split `a : b`. Below sm they stack.
 */
export const ButtonRow = ({ a, b, children }) => {
  const [first, second] = children;
  return (
    <div className="flex items-start gap-[12px] max-sm:flex-col max-sm:items-stretch">
      <div className="min-w-0 max-sm:w-full" style={{ flex: `${a} 1 0%` }}>
        {first}
      </div>
      <div className="min-w-0 max-sm:w-full" style={{ flex: `${b} 1 0%` }}>
        {second}
      </div>
    </div>
  );
};

export const SecondaryButton = ({ onClick, children }) => (
  <Button
    variant="tertiary"
    size="lg"
    onClick={onClick}
    className="w-full max-lg:whitespace-normal"
  >
    {children}
  </Button>
);

export const PrimaryButton = ({ size = 'sm', onClick, disabled, rightIcon, children }) => (
  <Button
    variant="primary"
    size={size}
    onClick={onClick}
    disabled={disabled}
    rightIcon={rightIcon}
    className="w-full max-lg:whitespace-normal"
  >
    {children}
  </Button>
);

// How long a toast stays up. Not drawn in Figma → ASSUMPTION (same as the Job Postings toast); pauses while hovered / focused.
const TOAST_MS = 8000;

/*
 * Toast — SL-T1 … SL-T4 (Playful 7854:15536 · 7854:16109 · 7854:16556 · 7854:17127, Focused 8110:492276 · 8110:492710 ·
 * 8110:493046 · 8110:493480). White card r16 p14/18 gap12 at the top-right of the page (x = viewport right − 56, y 104).
 * Playful = 1.5px ink border + hard shadow, Focused = hairline + soft shadows and a solid green check disc (Playful: #ebf1ec).
 */
export const SkillsLabToast = ({ kind, topic, onDismiss }) => {
  const copy = SKILLS_LAB_TOASTS[kind];
  const timer = useRef(null);

  const arm = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      log('toast auto-dismiss', kind);
      onDismiss();
    }, TOAST_MS);
  };
  const hold = () => clearTimeout(timer.current);

  useEffect(() => {
    log('toast mount', kind);
    arm();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  if (!copy) return null;
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      data-skills-lab-toast={kind}
      onMouseEnter={hold}
      onMouseLeave={arm}
      onFocus={hold}
      onBlur={arm}
      className={classNames(
        'fixed z-[70] flex w-max max-w-[calc(100vw-24px)] items-center gap-[12px] rounded-[16px] px-[18px] py-[14px]',
        'right-[12px] top-[76px] lg:right-[56px] lg:top-[104px]',
        CARD_CHROME
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-[#1c2a21] playful:bg-[#ebf1ec]"
      >
        <SkillsLabToastCheckGlyph className="size-[16px]" />
      </span>
      <span className="flex min-w-0 flex-col gap-px">
        <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
          {copy.title}
        </span>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
          {copy.body.replace('{topic}', topic ?? '')}
        </span>
      </span>
      <button
        type="button"
        onClick={() => {
          log('toast undo', kind);
          onDismiss();
        }}
        className={classNames(
          'shrink-0 rounded-[8px] border-0 bg-transparent px-[10px] py-[6px] font-sans text-[14px] font-semibold leading-[17px] text-[#387440] underline',
          FOCUS_RING
        )}
      >
        {SKILLS_LAB_TOASTS.undo}
      </button>
    </div>,
    document.body
  );
};
