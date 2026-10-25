import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { useDialogBehaviour } from '../../publicData/share/useDialogBehaviour.js';

const log = debug('AgencyDialogShell');

/*
 * AgencyDialogShell — the centred modal of the agency screens that draw their own card (Save this query 8597:392937, Programme published,
 * Close this programme?, Remove contact details to publish ...): a portal on a scrim, a labelled role="dialog" aria-modal panel.
 * Behaviour (Theme 8 useDialogBehaviour): focus moves into the panel (the element marked data-autofocus, else the panel), Tab is trapped,
 * Esc and a scrim click call onClose, the page scroll is locked; focus returns to the element that had it when the dialog opened.
 * Props: title (string, used as the accessible name; pass hideTitle to keep it off screen), onClose, scrim (CSS colour class), className
 * (the panel), role ('dialog' | 'alertdialog'), describedBy (id of a description inside), children.
 * The panel is centred vertically; on short viewports the scrim scrolls.
 */

const AgencyDialogShell = ({
  title,
  onClose,
  scrim = 'bg-[#121712]/[0.48]',
  className,
  role = 'dialog',
  describedBy,
  children,
}) => {
  const panelRef = useRef(null);
  const openerRef = useRef(typeof document === 'undefined' ? null : document.activeElement);
  useDialogBehaviour(panelRef, onClose);

  useEffect(() => {
    const opener = openerRef.current;
    log('open', title);
    return () => {
      log('close', title);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [title]);

  const onScrim = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  return createPortal(
    <div
      data-agency-dialog=""
      className={classNames('fixed inset-0 z-[60] overflow-y-auto font-sans', scrim)}
      onMouseDown={onScrim}
    >
      <div className="flex min-h-full items-center justify-center p-[16px]" onMouseDown={onScrim}>
        <div
          ref={panelRef}
          role={role}
          aria-modal="true"
          aria-label={title}
          aria-describedby={describedBy}
          tabIndex={-1}
          className={classNames('w-full outline-none', className)}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AgencyDialogShell;
