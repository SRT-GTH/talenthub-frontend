import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';

const log = debug('GameV2DialogShell');

/*
 * GameV2DialogShell — portal + scrim + a11y for the Games v2 dialogs (focus moves in and is restored, Tab trapped, the rest of
 * the page inert, Esc / scrim click close, scroll locked) — the same behaviour as SkillsLabDialogParts.DialogShell, but with the
 * Figma placement: the details panel (GV-02 / GV-03: 640px, scrim ink@.45) sits 44px below the top of the viewport, the small
 * modals (GV-09 / GV-13: 500px, scrim ink@.55) 23 % down. Below `sm` every dialog is a full-width sheet with 12px gutters,
 * vertically centred, and scrolls inside the scrim when taller than the screen.
 * `variant="panel"` = the details panel chrome, `variant="modal"` = the Skills Lab modal chrome (SkillsLabDialogParts CARD_CHROME).
 */
const CHROME = {
  panel:
    'rounded-[20px] border border-solid border-[#dee5e0] bg-white p-[clamp(18px,5vw,28px)] shadow-[0_4px_16px_rgba(31,51,36,0.06)] gap-[28px] ' +
    'playful:gap-[22px] playful:rounded-[28px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] ' +
    'sm:px-[32px]',
  modal:
    'gap-[16px] rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[clamp(18px,5vw,28px)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
    'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
};
const PLACE = {
  panel: 'bg-[rgba(28,42,33,0.45)] sm:items-start sm:pt-[44px] max-sm:items-center',
  modal:
    'bg-[rgba(28,42,33,0.55)] sm:items-start sm:pt-[clamp(12px,23.3vh,248px)] max-sm:items-center',
};

const GameV2DialogShell = ({ variant = 'modal', width, labelId, onClose, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    log('mount', variant, labelId);
  }, [variant, labelId]);
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
      data-gv2-dialog={variant}
      className={classNames(
        'fixed inset-0 z-[60] flex justify-center overflow-y-auto p-[12px] sm:px-[16px] sm:pb-[16px]',
        PLACE[variant]
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
        className={classNames('relative flex w-full flex-col outline-none', CHROME[variant])}
        style={{ maxWidth: width, outline: 'none' }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default GameV2DialogShell;
