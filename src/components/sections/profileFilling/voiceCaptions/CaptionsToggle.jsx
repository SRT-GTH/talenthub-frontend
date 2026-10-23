import { classNames } from '../../../../utils/classNames.js';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * "Captions off · tap to show" pill - Figma 9149:85264 (Playful) / 9149:88068 (Focused). 194x33, padding 7/12,
 * 6px gap, white. Playful: border 1.5 #1c2a21@55% + 3px hard shadow; Focused: border 1 #e7e7e7, no shadow.
 * "CC" 12/700 #737373, label 13/500 #595959.
 */
const CaptionsToggle = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed="false"
    className={classNames(
      'inline-flex cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[12px] py-[7px] font-sans max-lg:min-h-11',
      'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[3px_3px_0_rgba(28,42,33,0.45)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]',
      className
    )}
  >
    <span className="text-[12px] font-bold leading-[14px] text-[#737373]">{VOICE_COPY.cc}</span>
    <span className="whitespace-nowrap text-[13px] font-medium leading-[16px] text-[#595959]">
      {VOICE_COPY.captionsOff}
    </span>
  </button>
);

export default CaptionsToggle;
