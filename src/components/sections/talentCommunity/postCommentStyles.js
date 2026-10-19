import { FOCUS_RING } from './communityDialogUtils.js';

/* GTHInput of the comment composers: white, 1px #ccc, r10, hard 4px shadow + soft lift (Figma draws it in the active state). */
export const INPUT =
  'block min-w-0 flex-1 rounded-[10px] border border-solid border-[#ccc] bg-white py-[13px] pl-[20px] pr-[16px] font-sans font-medium text-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] outline-none placeholder:text-[#595959] max-sm:px-[14px]';

export const LINK_BTN = `cursor-pointer border-0 bg-transparent p-0 font-sans text-[12px] font-semibold leading-[14px] ${FOCUS_RING}`;
