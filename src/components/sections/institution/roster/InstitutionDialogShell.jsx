import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useDialogBehaviour } from '../../publicData/share/useDialogBehaviour.js';
import { RosterCloseIcon } from './rosterIcons.jsx';

const log = debug('InstitutionDialogShell');

/*
 * InstitutionDialogShell — the modal card of the roster dialogs (Figma "Modal · …" 8590:384462 etc.): white, 1px #1c2a21 at 10 %, shadow 0 1 2 + 0 2 8, over a #0b1a0f at 55 % scrim
 * (the Remove dialog draws #1c2a21 at 55 %). Sizes drawn: 820 wide r28 p 36/40/32 gap 20 (add student, upload, errors, checking, review, consent), 620 wide r28 (transfer out),
 * 520 wide r24 p 28 gap 16 (remove). The 40 round #f3f3ef close button sits at the top right (24/24) except where `closeButton` is false (Remove draws its own 30 px one in the header).
 * Behaviour: role="dialog" aria-modal, Tab trap, Esc and scrim click close it, page scroll locked, focus moves in (data-autofocus first) and returns to the element that opened it.
 * Props: label, onClose, size ('wide' | 'medium' | 'narrow'), scrim ('green' | 'ink'), closeButton (bool), describedBy, children.
 */

const SIZES = {
  wide: 'max-w-[820px] gap-[20px] rounded-[28px] px-[20px] pt-[36px] pb-[24px] md:px-[40px] md:pb-[32px]',
  medium:
    'max-w-[620px] gap-[32px] rounded-[28px] px-[20px] pt-[36px] pb-[24px] md:px-[40px] md:pb-[32px]',
  narrow: 'max-w-[520px] gap-[16px] rounded-[24px] p-[20px] md:p-[28px]',
};

const InstitutionDialogShell = ({
  label,
  onClose,
  size = 'wide',
  scrim = 'green',
  closeButton = true,
  children,
}) => {
  const ref = useRef(null);
  const reactId = useId();
  const openerRef = useRef(typeof document === 'undefined' ? null : document.activeElement);
  useDialogBehaviour(ref, onClose);

  useEffect(() => {
    log('open', { label });
    const opener = openerRef.current;
    return () => {
      log('close', { label });
      window.requestAnimationFrame(() => {
        if (opener?.isConnected && opener !== document.body) opener.focus({ preventScroll: true });
      });
    };
  }, [label]);

  const onScrim = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };
  return createPortal(
    <div
      data-share-dialog=""
      onMouseDown={onScrim}
      className={classNames(
        'fixed inset-0 z-[60] overflow-y-auto font-sans',
        scrim === 'ink' ? 'bg-[#1c2a21]/55' : 'bg-[#0b1a0f]/55'
      )}
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
          className={classNames(
            'relative flex w-full flex-col border border-solid border-[#1c2a21]/10 bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)] outline-none',
            SIZES[size]
          )}
        >
          {closeButton ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-[24px] right-[24px] z-10 flex size-[40px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f3f3ef] text-[#1c2a21] hover:bg-[#e9e9e4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <RosterCloseIcon className="size-[16px]" />
            </button>
          ) : null}
          <div id={`${reactId}-body`} className="contents">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InstitutionDialogShell;
