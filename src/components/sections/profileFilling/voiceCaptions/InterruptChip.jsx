import CareerBuddyAvatar from '../../../shared/CareerBuddyAvatar.jsx';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * "Buddy interrupted" chip - Figma 9151:450 / 9151:906 (VC-06). Cream #f8f8f4, 1px #e7e7e7, radius 14,
 * padding 8/14/8/10, 10px gap: Buddy avatar at 60%, "Tali paused" pill (#eceee9, 11/600 #737373), the cut-off
 * line in quotes (13 #9a9e98) and the "Let Tali finish" action (13/600 #387440).
 */
const InterruptChip = ({ quote = '', onResume }) => (
  <div className="flex w-[min(549px,100%)] items-center gap-[10px] rounded-[14px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] py-[8px] pl-[10px] pr-[14px]">
    <span className="shrink-0 opacity-60">
      <CareerBuddyAvatar size={24} />
    </span>
    <span className="shrink-0 rounded-full bg-[#eceee9] px-[8px] py-[2px] font-sans text-[11px] font-semibold leading-[13px] text-[#737373] max-lg:text-[12px]">
      {VOICE_COPY.talkPaused}
    </span>
    <span className="min-w-0 flex-1 truncate font-sans text-[13px] leading-[16px] text-[#9a9e98] max-lg:text-[12px]">
      {quote}
    </span>
    <button
      type="button"
      onClick={onResume}
      className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21] max-lg:min-h-11 max-lg:text-[14px]"
    >
      {VOICE_COPY.letFinish}
    </button>
  </div>
);

export default InterruptChip;
