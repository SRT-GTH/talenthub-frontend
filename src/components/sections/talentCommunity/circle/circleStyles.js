/*
 * My circle shared class strings (kept out of component files: react-refresh/only-export-components).
 * Focused (default): 1px #e7e7e7 hairline + two soft shadows. Playful (`playful:` variants): 1.5px ink@.55 border + 4px hard
 * shadow + soft lift, Bricolage headings, yellow stickers — the same convention as the rest of Community v2.
 */
export const HEADING = 'm-0 font-sans font-semibold text-[#1c2a21] playful:font-heading';

/* White card: r16 hairline (Focused) → r20 ink border + 4px hard shadow (Playful). */
export const CARD =
  'rounded-[16px] border border-solid border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:rounded-[20px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/* Yellow Playful sticker (hidden in Focused unless the caller overrides `hidden`). */
export const STICKER =
  'hidden items-center whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] tracking-normal text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-flex max-lg:text-[12px]';

export const PRIMARY_GRADIENT_TEXT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

/* Small pill chip (13px/600 → Figma `chip · …` 22px, 12px/600). */
export const CHIP =
  'inline-flex h-[22px] shrink-0 items-center gap-[5px] whitespace-nowrap rounded-full px-[10px] font-sans text-[12px] font-semibold leading-[14px]';

/* Muted body text colours of the frames. */
export const MUTED = 'text-[#737373]';
