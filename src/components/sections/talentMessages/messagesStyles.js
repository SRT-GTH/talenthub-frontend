import { FOCUS_RING, HARD_SHADOW, SOFT_SHADOW } from '../talentCommunity/communityStyles.js';

/*
 * Talent Messages (package A) — shared class strings. Focused is the default look; Playful only via `playful:` variants
 * (1.5px ink@.55 border + 4px hard shadow instead of the 1px ink@.10 hairline + soft shadow; Bricolage headings; stickers).
 */
export { FOCUS_RING };

export const PANE_LIST = `rounded-[24px] border-[1px] border-solid border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SOFT_SHADOW} ${HARD_SHADOW}`;

export const PANE_THREAD =
  'rounded-[24px] border-[1.21px] border-solid border-[rgba(0,82,43,0.1)] bg-white';

export const ROW_ACTIVE = `rounded-[16px] border-[1px] border-solid border-[rgba(28,42,33,0.1)] bg-white playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SOFT_SHADOW} playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_12px_rgba(28,42,33,0.06)]`;

export const TAB_BASE =
  'inline-flex h-[33px] shrink-0 cursor-pointer items-center justify-center gap-[4.86px] whitespace-nowrap rounded-full border border-solid px-[14px] py-[4px] font-sans text-[14px] font-semibold leading-[24px] tracking-[0.24px]';
export const TAB_ON =
  'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-[14.588px] text-white playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';
export const TAB_OFF = 'border-[#e1eae2] bg-white text-[#595959]';

export const DATE_PILL =
  'inline-flex shrink-0 items-center justify-center self-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[14px] py-[6px] font-sans text-[13px] font-semibold leading-[16px] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]';

export const BUBBLE_IN =
  'flex w-fit max-w-[min(600px,92%)] flex-col items-end gap-[6px] rounded-[12px] bg-[rgba(229,229,229,0.5)] px-[16px] pb-[8px] pt-[14px]';
export const BUBBLE_OUT =
  'flex w-fit max-w-[min(600px,92%)] flex-col items-end gap-[2.5px] rounded-[12px] bg-[#32683a] px-[16px] pb-[8px] pt-[14px]';

export const NOTICE_TONES = {
  yellow: 'bg-[#faf4e8] text-[#b48617]',
  blue: 'bg-[#eaeffb] text-[#1d3b7f]',
  green: 'bg-[#ebf1ec] text-[#1c4327]',
};
