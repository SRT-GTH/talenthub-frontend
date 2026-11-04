import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import { TOAST_MS } from './publishData.js';

const log = debug('PublishToast');

/*
 * PublishToast — the dark pill under the page header (Figma "toast" 11023:79056 "Live · users will see this within a minute" + "View history",
 * 11024:46889 "2 changes discarded · Hero shows the published text again"): #1c2a21, r14, p 12/16/12/14, gap 10, 14/600 white, shadow 0 8 20 black@.20,
 * a 18px glyph (#ebf1ec) and an optional 14/700 #ebf1ec link. Centred over the main column; role="status" so it is announced.
 * Props: icon (component), text, action { label, to } (the link keeps the toast open: it is excluded from the leave guard), onClose,
 * hold (no auto-dismiss: frame URLs), ms (⚠️ ASSUMPTION: 8 s).
 */
const PublishToast = ({ icon, text, action, onClose, hold = false, ms = TOAST_MS }) => {
  const Glyph = icon;
  useEffect(() => {
    log('show', { text, hold });
    if (hold) return undefined;
    const t = window.setTimeout(() => {
      log('auto-dismiss', { ms });
      onClose?.();
    }, ms);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, hold, ms]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[72px] z-[80] flex justify-center px-[12px] lg:top-[136px] xl:pl-[288px]"
    >
      <div className="pointer-events-auto inline-flex max-w-full flex-wrap items-center gap-x-[10px] gap-y-[4px] rounded-[14px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
        <Glyph className="size-[18px] shrink-0 text-[#ebf1ec]" />
        <span className="font-sans text-[14px] leading-[17px] font-semibold text-white">
          {text}
        </span>
        {action ? (
          <Link
            to={action.to}
            data-leave-ok=""
            className="inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[17px] font-bold text-[#ebf1ec] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PublishToast;
