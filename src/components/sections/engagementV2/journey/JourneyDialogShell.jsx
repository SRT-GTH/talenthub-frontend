import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { Close16Icon } from './JourneyIcons.jsx';

/*
 * JourneyDialogShell — scrim (#0b1a0f @ .55, Figma "Scrim") + centred dialog card. Focus trap, Esc, focus restore and
 * background inert come from usePlayfulDialogA11y; clicking the scrim closes. The caller draws the card chrome via `className`.
 */
const JourneyDialogShell = ({ labelId, onClose, className, closeClass, closeIcon, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({ open: true, dialogRef: ref, onEscape: onClose, lockScroll: true });
  const Glyph = closeIcon ?? Close16Icon;
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0b1a0f]/55 px-3 py-6 sm:items-center sm:py-8"
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
        className={classNames('relative w-full outline-none', className)}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={classNames(
            'absolute z-10 flex cursor-pointer items-center justify-center rounded-full border-0 p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            closeClass
          )}
        >
          <Glyph className="size-[14px]" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default JourneyDialogShell;
