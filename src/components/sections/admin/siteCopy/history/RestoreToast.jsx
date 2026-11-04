import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import { PreviewCheckFilledIcon } from '../preview/PreviewIcons.jsx';

const log = debug('RestoreToast');

/*
 * RestoreToast — the dark toast after a restore (Figma 7.8.5d: #1c2a21, r14, p 12/16/12/14, gap10, shadow 0 8 20): the filled check, "Version 6 is live · restored from
 * version 4" 14/600 white and "Undo" 14/700 #ebf1ec. It sits at the top centre of the page and closes itself after 8 s.
 * ⚠️ ASSUMPTION: "Undo" takes the restore back (the new version disappears and the previous text is live again). Props: version, from, onUndo, onClose.
 */
const RestoreToast = ({ version, from, onUndo, onClose }) => {
  useEffect(() => {
    log('shown', { version, from });
    const id = setTimeout(onClose, 8000);
    return () => clearTimeout(id);
  }, [version, from, onClose]);
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-[16px] left-1/2 z-[40] flex w-max max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-[10px] rounded-[14px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
    >
      <PreviewCheckFilledIcon className="size-[18px] shrink-0 text-[#ebf1ec]" />
      <span className="font-sans text-[14px] leading-[17px] font-semibold text-white">
        {`Version ${version} is live · restored from version ${from}`}
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="min-h-[24px] shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] font-bold text-[#ebf1ec] underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Undo
      </button>
    </div>
  );
};

export default RestoreToast;
