import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShareIconCheckcircle } from '../../publicData/share/shareIcons.jsx';

/*
 * BriefingToast — Figma 11.4.4d "Link copied": a dark pill (#1a1a18, r14) over the page hero — check icon · "Link copied. Only NYA staff with
 * GTH access can open it." · "Undo". Announced politely (role="status"), dismisses itself after `duration` ms.
 * ⚠️ ASSUMPTION: a copy cannot be taken back; Undo reopens the share dialog (same as the Theme 8 toast). Props: text, onUndo(), onDismiss(), duration.
 */

const BriefingToast = ({ text, onUndo, onDismiss, duration = 6000 }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-[104px] z-[70] flex justify-center px-[16px] font-sans lg:pl-[80px] xl:pl-[303px]">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex max-w-full items-center gap-[10px] rounded-[14px] bg-[#1a1a18] px-[18px] py-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
      >
        <ShareIconCheckcircle className="size-[20px] shrink-0 text-white" />
        <p className="m-0 font-sans text-[15px] leading-[18px] font-medium text-white">{text}</p>
        <button
          type="button"
          onClick={onUndo}
          className="cursor-pointer border-0 bg-transparent p-[4px] font-sans text-[14px] leading-[17px] font-semibold text-[#c1d4c4] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Undo
        </button>
      </div>
    </div>,
    document.body
  );
};

export default BriefingToast;
