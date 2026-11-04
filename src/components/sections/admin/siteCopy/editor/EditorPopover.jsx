import { useEffect, useRef } from 'react';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * EditorPopover — the floating card of the rich-text toolbar (link popover 7.8.2d, product-name menu 7.8.2f): white, r20, border #1c2a21 at
 * 10 %, shadow 0 10 28. It sits absolutely under the toolbar (`pos` = { left, top } inside the field box), Esc and a click outside close it
 * (clicks on the toolbar are left to the toolbar's own buttons), focus moves to the first `[data-autofocus]` / control.
 * Props: label (accessible name), pos, width (px on wide screens; capped to the box), onClose, className, children.
 */
const FOCUSABLE = 'input,button:not([disabled]),[tabindex="0"]';

const EditorPopover = ({ label, pos, width, onClose, className, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    (el?.querySelector('[data-autofocus]') ?? el?.querySelector(FOCUSABLE))?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const onDown = (e) => {
      if (el && !el.contains(e.target) && !e.target.closest('[data-editor-toolbar]')) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      style={{ left: pos.left, top: pos.top, width: `min(${width}px, 100%)` }}
      className={classNames(
        'absolute z-30 rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white shadow-[0_10px_28px_rgba(28,42,33,0.16)]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default EditorPopover;
