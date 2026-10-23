import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import { CircleCheckIcon } from './circleIcons.jsx';
import { FOCUS_RING } from './circleStyles.js';

const log = debug('CircleToast');

// How long the toast stays. Not drawn in Figma → ⚠️ ASSUMPTION (same 6s as the Community toasts).
const TOAST_MS = 6000;

/*
 * CircleToast — Figma `Toast` (Link-up sent to Abena · Undo / Nana Yaw is now in your circle · Message): dark #1c2a21 pill,
 * 16px check, 14/500 white label and a 14/600 yellow action, centred near the bottom of the viewport.
 * Props: text, actionLabel, onAction (called, then the toast closes), onDone (called when it closes by itself).
 */
const CircleToast = ({ text, actionLabel, onAction, onDone }) => {
  useEffect(() => {
    log('toast mount', text);
    const timer = window.setTimeout(() => onDone?.(), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [text, onDone]);
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[64px] left-1/2 z-[70] flex w-max max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-[10px] rounded-full bg-[#1c2a21] py-[10px] pl-[12px] pr-[16px] shadow-[0_8px_24px_rgba(28,42,33,0.25)] playful:border-[1.5px] playful:border-solid playful:border-[rgba(255,255,255,0.18)] lg:ml-[63px]"
    >
      <CircleCheckIcon className="size-[16px] text-white" />
      <span className="font-sans text-[14px] font-medium leading-[17px] text-white">{text}</span>
      {actionLabel && (
        <button
          type="button"
          onClick={() => {
            log('toast action', actionLabel);
            onAction?.();
            onDone?.();
          }}
          className={`cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold leading-[17px] text-[#ffd86b] ${FOCUS_RING}`}
        >
          {actionLabel}
        </button>
      )}
    </div>,
    document.body
  );
};

export default CircleToast;
