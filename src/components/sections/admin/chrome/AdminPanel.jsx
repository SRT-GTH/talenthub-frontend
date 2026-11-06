import { useEffect, useRef } from 'react';
import { classNames } from '../../../../utils/classNames.js';

/*
 * AdminPanel — the card the admin top bar opens (notifications, messages, help, language, accessibility, profile).
 *   >= lg : hangs under the top bar, right-aligned with the page gutter, `width` wide, max 70vh tall (scrolls).
 *   <  lg : full-width sheet under the 73px phone bar.
 * Esc and a click outside close it; focus moves into it on open and back to whatever had it (the top-bar button) on close.
 * Props: label (accessible name), onClose, width (px, desktop), title, actions (header right), footer, children.
 */
const AdminPanel = ({
  label,
  onClose,
  width = 380,
  title,
  actions,
  footer,
  children,
  className,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const onDown = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      // Clicks on the top-bar buttons toggle via the URL; ignore them here so the panel doesn't close and reopen.
      if (e.target.closest?.('[data-admin-topbar-button]')) return;
      onClose();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      style={{ '--panel-w': `${width}px` }}
      className={classNames(
        'fixed inset-x-0 top-[73px] z-40 flex max-h-[calc(100dvh-73px)] flex-col overflow-hidden border-b border-solid border-[#e7e7e7] bg-white font-sans text-[#1c2a21] shadow-[0_12px_32px_rgba(15,15,10,0.14)] outline-none',
        'lg:top-[80px] lg:right-[clamp(24px,3.24vw,56px)] lg:left-auto lg:max-h-[70vh] lg:w-[var(--panel-w)] lg:max-w-[calc(100vw-48px)] lg:rounded-[20px] lg:border',
        className
      )}
    >
      {title ? (
        <div className="flex shrink-0 items-center justify-between gap-[12px] border-b border-solid border-[#efefec] px-[18px] py-[14px]">
          <h2 className="m-0 text-[16px] leading-[22px] font-semibold">{title}</h2>
          <div className="flex items-center gap-[10px]">
            {actions}
            <button
              type="button"
              onClick={onClose}
              aria-label={`Close ${label}`}
              className="grid size-[30px] cursor-pointer place-items-center rounded-full border-0 bg-[#f4f6f3] text-[16px] leading-none text-[#1c2a21] hover:bg-[#e9eee8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer ? (
        <div className="shrink-0 border-t border-solid border-[#efefec] px-[18px] py-[12px]">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export const PanelLink = ({ children, onClick, ...rest }) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13.5px] font-semibold whitespace-nowrap text-[#387440] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    {...rest}
  >
    {children}
  </button>
);

export default AdminPanel;
