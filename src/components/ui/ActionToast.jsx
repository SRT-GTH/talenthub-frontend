import { useEffect, useRef } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import toastCheck from '../../assets/ui/toast-check.svg';

const log = debug('ActionToast');

/*
 * ActionToast — the dark confirmation toast with an optional action (Figma PW-14b 10056:915 "Abena is now hidden from search", PW-15b 10078:26057 "Elliot is no longer linked"):
 * #1c2a21 face, r16, 16 x 12 padding, 12 gap, 20px check circle, message 14/600 over a detail 12/400 at 80 %, action 13/600 #f2c74a ("Undo").
 * Unlike `ui/Toast` (portal + scrim + slide motion + Playful styling) this is a plain inline status line: it positions itself with `placement` and auto-dismisses through `onClose`.
 * Props: message, detail, actionLabel (omit to hide the action), onAction (called, then the toast closes), onClose, duration (ms, default 4000; 0 = stay),
 *        placement ('top-center' default | 'bottom-center'), top (px under the viewport top for 'top-center', default 97), className (extra classes on the fixed wrapper,
 *        e.g. a left offset to centre over a content column).
 * A11y: role="status" in a polite live region; no close button is drawn.
 */
const ActionToast = ({
  message,
  detail,
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
  placement = 'top-center',
  top = 97,
  className,
}) => {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!duration) return undefined;
    log('show', { message, duration });
    const t = setTimeout(() => {
      log('auto-dismiss', { message });
      closeRef.current?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'pointer-events-none fixed left-1/2 z-[80] w-max max-w-[calc(100vw-32px)] -translate-x-1/2',
        placement === 'bottom-center' && 'bottom-[96px]',
        className
      )}
      style={placement === 'top-center' ? { top } : undefined}
    >
      <div className="pointer-events-auto flex items-center gap-[12px] overflow-clip rounded-[16px] bg-[#1c2a21] px-[16px] py-[12px] font-sans shadow-[0_8px_24px_rgba(28,42,33,0.18)]">
        <img src={toastCheck} alt="" aria-hidden="true" className="size-[20px] shrink-0" />
        <div className="flex min-w-0 flex-col gap-[2px] text-white">
          <p className="m-0 text-[14px] leading-[normal] font-semibold">{message}</p>
          {detail ? (
            <p className="m-0 text-[12px] leading-[normal] font-normal opacity-80">{detail}</p>
          ) : null}
        </div>
        {actionLabel ? (
          <button
            type="button"
            onClick={() => {
              log('action', { actionLabel });
              onAction?.();
              onClose?.();
            }}
            className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-[#f2c74a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c74a]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ActionToast;
