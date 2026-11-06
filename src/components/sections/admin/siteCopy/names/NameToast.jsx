import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { CheckCircleFillIcon } from './NameIcons.jsx';

const log = debug('NameToast');

/*
 * NameToast — the dark confirmation pill of the Product names screens (Figma 7.8.6i "toast": 384 x 42, #1c2a21, r14, 12/16/12/14 padding, 10 gap,
 * check-circle #ebf1ec 18, "Renamed to Tali · live in about a minute" 14/600 white, "View history" 14/700 #ebf1ec). Drawn at the top of the main
 * column, centred over it. It closes itself after 8 s unless `sticky` (the frame URL), and on Esc.
 * Props: message, action { label, to } (optional link), sticky, onDismiss.
 */
const NameToast = ({ message, action, sticky = false, onDismiss }) => {
  useEffect(() => {
    log('show', message, { sticky });
    if (sticky) return undefined;
    const t = window.setTimeout(() => onDismiss?.(), 8000);
    return () => window.clearTimeout(t);
  }, [message, sticky]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onDismiss?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed top-[76px] left-1/2 z-[60] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 justify-center lg:top-[188px] lg:ml-[24px] xl:ml-[143px]"
    >
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-x-[10px] gap-y-[4px] rounded-[14px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
        <CheckCircleFillIcon className="size-[18px] shrink-0 text-[#ebf1ec]" />
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-white">
          {message}
        </span>
        {action ? (
          <Link
            to={action.to}
            onClick={() => onDismiss?.()}
            className="-my-[4px] inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[17px] font-bold text-[#ebf1ec] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ebf1ec]"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default NameToast;
