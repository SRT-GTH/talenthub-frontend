import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDialogBehaviour } from '../../publicData/share/useDialogBehaviour.js';
import { DataRequestIconClose } from './dataRequestIcons.jsx';

/*
 * DataRequestModalShell — the form dialog of the data-request flow (Figma "Modal · Add a certificate" instances 8597:1161 / 8609:2280): 820px card,
 * r28, 1px #1c2a21 at 10 %, padding 36/40/32, on a #0b1a0f scrim at 55 %; 40px round close button (#f3f3ef) at the top right.
 * Behaviour (Theme 8 useDialogBehaviour): focus moves in (the element marked data-autofocus first), Tab is trapped, Esc and the scrim close it, the
 * page scroll is locked; the opener gets focus back from the page that mounts it (data-share-dialog marks the portal for opener tracking).
 * Props: titleId-labelled content in children, label (accessible name fallback), onClose.
 */

const DataRequestModalShell = ({ label, onClose, children }) => {
  const ref = useRef(null);
  const reactId = useId();
  useDialogBehaviour(ref, onClose);
  const onScrim = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };
  return createPortal(
    <div
      data-share-dialog=""
      onMouseDown={onScrim}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#0b1a0f]/55 font-sans"
    >
      <div
        onMouseDown={onScrim}
        className="flex min-h-full items-start justify-center p-[16px] md:items-center md:py-[32px]"
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          aria-describedby={`${reactId}-body`}
          tabIndex={-1}
          className="relative flex w-full max-w-[820px] flex-col gap-[20px] rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white px-[20px] pt-[36px] pb-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)] outline-none md:px-[40px] md:pb-[32px]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-[24px] right-[24px] flex size-[40px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] hover:bg-[#e9e9e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <DataRequestIconClose className="size-[16px]" />
          </button>
          <div id={`${reactId}-body`} className="contents">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DataRequestModalShell;
