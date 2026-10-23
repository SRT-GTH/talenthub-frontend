import { VOICE_COPY } from './voiceCaptionData.js';

/* "YOUR TURN" sticker (Playful only) - Figma 9151:456: #ffd86b, 1.2px ink border, radius 8, hard 2px shadow, rotated +4deg. */
const YourTurnSticker = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -left-[11px] -top-[12px] z-[1] hidden rotate-[4deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[9px] py-[3px] font-sans text-[11px] max-lg:text-[12px] font-bold leading-[13px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
  >
    {VOICE_COPY.yourTurn}
  </span>
);

export default YourTurnSticker;
