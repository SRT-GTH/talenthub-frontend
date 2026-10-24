import { useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { ShareIconClose } from './shareIcons.jsx';
import { useDialogBehaviour } from './useDialogBehaviour.js';

/*
 * ShareDialogShell — the frame of every Theme 8 dialog and bottom sheet (Figma 8500:205 and siblings, sheets 8515:742 / 8515:2637).
 *   dialog : white card, radius 24, shadow 0 24 64 rgba(0,0,0,.2) on a #121712 scrim at 48 %; header (22/26 title + 14/20 description +
 *            34px round close) · body (p 16/28/20) · footer (border-top, buttons right-aligned, gap 12)
 *   sheet  : phone bottom sheet (scrim 50 %, radius 24 24 0 0, grabber 40x5, title 20/24 + close, description 13/19) — footer lives in the body
 * Figma draws the dialogs centred in a ~1000px design viewport, so on taller screens they stay centred in the first 1000px.
 * Props: title, description, onClose, variant ('dialog' | 'sheet'), width (dialog width in px: 600 | 560), footer (node, dialog only),
 *        bodyClassName, children. The element marked data-autofocus receives the first focus; Esc, Tab trap and scroll lock come from
 *        useDialogBehaviour. The shell is rendered in a portal on document.body (data-share-dialog marks it for opener tracking).
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const CloseButton = ({ onClose, className, iconClassName }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label="Close"
    className={classNames(
      'flex shrink-0 items-center justify-center rounded-full bg-[#f2f2ee] text-[#1a1a18] hover:bg-[#e7e7e3]',
      FOCUS,
      className
    )}
  >
    <ShareIconClose className={iconClassName} />
  </button>
);

const ShareDialogShell = ({
  title,
  description,
  onClose,
  variant = 'dialog',
  width = 600,
  footer,
  bodyClassName,
  children,
}) => {
  const containerRef = useRef(null);
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descId = `${reactId}-desc`;
  useDialogBehaviour(containerRef, onClose);

  const onScrimMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  if (variant === 'sheet') {
    return createPortal(
      <div
        data-share-dialog=""
        className="fixed inset-0 z-[60] bg-[#121712]/50 font-sans"
        onMouseDown={onScrimMouseDown}
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[100dvh] w-full max-w-[640px] flex-col gap-[14px] overflow-y-auto rounded-t-[24px] bg-white px-[20px] pt-[12px] pb-[28px] outline-none"
        >
          <span
            aria-hidden="true"
            className="mx-auto h-[5px] w-[40px] rounded-[3px] bg-[#d9d9d4]"
          />
          <div className="flex items-center gap-[8px]">
            <h2
              id={titleId}
              className="m-0 flex-1 font-sans text-[20px] leading-[24px] font-semibold text-[#1c2a21]"
            >
              {title}
            </h2>
            <CloseButton
              onClose={onClose}
              className="size-[28px] !bg-transparent"
              iconClassName="size-[22px]"
            />
          </div>
          {description ? (
            <p id={descId} className="m-0 font-sans text-[13px] leading-[19px] text-[#595959]">
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      data-share-dialog=""
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#121712]/[0.48] font-sans"
      onMouseDown={onScrimMouseDown}
    >
      <div
        className="flex min-h-[min(100dvh,1000px)] items-center justify-center p-[16px]"
        onMouseDown={onScrimMouseDown}
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
          style={{ maxWidth: width }}
          className="flex w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)] outline-none"
        >
          <div className="flex items-start gap-[8px] px-[28px] pt-[24px] pb-[8px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
              <h2
                id={titleId}
                className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]"
              >
                {title}
              </h2>
              {description ? (
                <p id={descId} className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
                  {description}
                </p>
              ) : null}
            </div>
            <CloseButton onClose={onClose} className="size-[34px]" iconClassName="size-[18px]" />
          </div>
          <div
            className={classNames(
              'flex flex-col gap-[16px] px-[28px] pt-[16px] pb-[20px]',
              bodyClassName
            )}
          >
            {children}
          </div>
          {footer ? (
            <div className="flex flex-wrap items-center justify-end gap-[12px] border-t border-solid border-[#e7e7e7] px-[28px] py-[18px]">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareDialogShell;
