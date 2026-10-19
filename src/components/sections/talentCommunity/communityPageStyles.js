/*
 * Community v2 detail-page class strings (kept out of the component files: react-refresh/only-export-components).
 * Focused is the default look; Playful only through `playful:` variants. Values are the Figma ones (C-04…C-14).
 */
export { FOCUS_RING, HEADING, PRIMARY_GRADIENT_TEXT } from './communityStyles.js';

/* White card of the side columns / feed (Figma `card · …`, `post · …`): r20, #e6e6e6 hairline, no shadow. */
export const CARD = 'rounded-[20px] border border-solid border-[#e6e6e6] bg-white';

/* Card title (Figma 21/26 600): Bricolage in Playful. */
export const CARD_TITLE =
  'm-0 font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading';

/* Hero card (Figma `community hero`): Focused hairline + two soft shadows, Playful ink border + hard shadow. */
export const HERO_CHROME =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* Sticker (Figma `sticker`): soft green pill in Focused, gold ink-bordered sticker with a hard 2px shadow in Playful. */
export const STICKER_BASE =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#ebf1ec] px-[10px] font-sans font-bold text-[#1f4a2b] ' +
  'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

/* Green hashtag / topic chip (Figma `Chip · #ReactGh`): 32px, #ebf1ec fill, #c1d4c4 hairline, #387440 label. */
export const TAG_CHIP =
  'inline-flex h-[32px] items-center whitespace-nowrap rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[14px] font-sans text-[13px] font-semibold leading-[16px] text-[#387440] no-underline';

/* Outline chip (Figma `Chip · Achievements`): white, #e1eae2 hairline, #595959 label; `on` = ink fill (selected). */
export const OUTLINE_CHIP =
  'inline-flex h-[32px] shrink-0 cursor-pointer select-none items-center whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px]';
export const OUTLINE_CHIP_OFF = 'border-[#e1eae2] bg-white text-[#595959]';
export const OUTLINE_CHIP_ON = 'border-[#1c2a21] bg-[#1c2a21] text-white';

/* Shared page column widths (Figma body: 300 | flex 798 | 360, gap 24). */
export const SIDE_LEFT = 'xl:w-[clamp(240px,17.37vw,300px)]';
export const SIDE_RIGHT = 'xl:w-[clamp(280px,20.84vw,360px)]';
