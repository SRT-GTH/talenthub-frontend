import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { CARD_CHROME } from '../communityDialogUtils.js';
import CircleAvatar from './CircleAvatar.jsx';
import { CircleCloseIcon } from './circleIcons.jsx';
import { FOCUS_RING, HEADING, STICKER } from './circleStyles.js';

const log = debug('CircleDialogShell');

/*
 * CircleDialogShell — the My circle modal (Figma `Add a note modal` 520, `Endorse modal` 560, `Recommendation modal` 560):
 * #000 @35% scrim, white r24 card (Focused hairline + soft shadows, Playful 1.5px ink border + 4px hard shadow), p24, gap 16-24.
 * Header = 48px avatar + title 20-21/600 + 13px subtitle + the 26px grey close disc. a11y: focus in / restored, Tab trapped, page
 * inert, Esc + scrim close (usePlayfulDialogA11y).
 * Props: personId (header avatar), title, subtitle, titleId, width, gap, titleSize (class string), sticker ({ text, className }),
 * onClose, children.
 */
const CircleDialogShell = ({
  personId,
  title,
  subtitle,
  titleId,
  width = 560,
  gap = 16,
  titleSize = 'text-[21px] leading-[25px] max-sm:text-[19px] max-sm:leading-[23px]',
  sticker,
  onClose,
  children,
}) => {
  const ref = useRef(null);
  useEffect(() => {
    log('dialog mount', titleId);
  }, [titleId]);
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
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(0,0,0,0.35)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classNames(
          'relative m-auto flex w-full flex-col rounded-[24px] p-[24px] outline-none',
          CARD_CHROME
        )}
        style={{ maxWidth: width, gap }}
      >
        {sticker && (
          <span className={classNames(STICKER, 'absolute z-10 -rotate-[4deg]', sticker.className)}>
            {sticker.text}
          </span>
        )}
        <div className="flex items-center gap-[12px]">
          {personId && <CircleAvatar id={personId} size={48} ring={false} />}
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <h2 id={titleId} className={classNames(HEADING, titleSize)}>
              {title}
            </h2>
            {subtitle && (
              <p className="m-0 font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[14px] max-lg:leading-[18px]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={classNames(
              'flex size-[26px] shrink-0 cursor-pointer items-center justify-center self-start rounded-full border-0 bg-[#f8f8f4] p-[6px] text-[#595959] max-lg:size-[32px]',
              FOCUS_RING
            )}
          >
            <CircleCloseIcon className="size-[14px]" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default CircleDialogShell;
