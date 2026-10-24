import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShareIconCheckcircle } from './shareIcons.jsx';

/*
 * ShareToast — Figma 8.1.2b "Toast · success" (8500:2066): #1a1a18 pill, radius 14, check icon · "Link copied — anyone with the link can view."
 * · "Undo". Centred in the main column near the bottom of the first 1000px (Figma y 820 of a 1000px design viewport).
 * Announced politely (role="status"); dismisses itself after `duration` ms.
 * ⚠️ ASSUMPTION: Figma draws "Undo" without a behaviour. A copy cannot be taken back, so Undo reopens the Share dialog (to pick another scope).
 * Props: onUndo(), onDismiss(), duration (ms, default 6000), sidebarOffset (px of the left sidebar, so the toast centres on the content).
 */

const ShareToast = ({ onUndo, onDismiss, duration = 6000 }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-[calc(min(100dvh,1000px)-180px)] z-[70] flex justify-center px-[16px] font-sans md:pl-[80px] xl:pl-[288px]">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex max-w-full items-center gap-[10px] rounded-[14px] bg-[#1a1a18] px-[18px] py-[14px] shadow-[0_10px_24px_rgba(0,0,0,0.2)]"
      >
        <ShareIconCheckcircle className="size-[20px] shrink-0 text-white" />
        <p className="m-0 font-sans text-[15px] leading-[18px] font-medium text-white">
          Link copied — anyone with the link can view.
        </p>
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

export default ShareToast;
