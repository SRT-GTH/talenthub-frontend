import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { CARD_BASE, FOCUS_RING } from './interestsStyles.js';
import * as Icons from './interestsIcons.jsx';

/*
 * InterestsDialogShell: scrim (#0b1a0f @ 55%, Figma "Scrim") + centred white card r28 for the Add-an-area and Stage-complete
 * dialogs. role="dialog" aria-modal, labelled; focus moves in / is trapped / restored, Esc and scrim click close, backdrop inert.
 * Props: open, onClose, labelledBy, widthClass, cardClassName, closeSize ('40' | '36'), closeClassName, children.
 */
const InterestsDialogShell = ({
  open,
  onClose,
  labelledBy,
  widthClass,
  cardClassName = '',
  closeSize = 40,
  closeClassName = '',
  children,
}) => {
  const cardRef = useRef(null);
  usePlayfulDialogA11y({ open, dialogRef: cardRef, onEscape: onClose, lockScroll: true });
  if (!open) return null;
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-[rgba(11,26,15,0.55)]"
        onClick={onClose}
      />
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative my-auto w-full overflow-hidden rounded-[28px] outline-none ${widthClass} ${CARD_BASE} ${cardClassName}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{ width: closeSize, height: closeSize }}
          className={`absolute z-10 grid min-h-[24px] min-w-[24px] cursor-pointer place-items-center rounded-full border-0 bg-[#f3f3ef] p-0 text-[#387440] ${FOCUS_RING} ${closeClassName}`}
        >
          <span className="text-[20px]">
            <Icons.CloseIcon />
          </span>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default InterestsDialogShell;
