import { VOICE_COPY } from './voiceCaptionData.js';

/* Dark tooltip "Buddy stopped so you can talk · it will pick up after you" - Figma 9152:527 (304x26, #1c2a21, 12/500 white). */
const InterruptNote = () => (
  <p
    role="status"
    className="m-0 rounded-full bg-[#1c2a21] px-[12px] py-[6px] text-center font-sans text-[12px] font-medium leading-[14px] text-white"
  >
    {VOICE_COPY.pauseNote}
  </p>
);

export default InterruptNote;
