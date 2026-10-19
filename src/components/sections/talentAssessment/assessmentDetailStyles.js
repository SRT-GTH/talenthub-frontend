/*
 * Shared class strings for the My Assessment details + library screens (Figma MA-02 / MA-03 / MA-03b / MA-09).
 * Focused is the default look; Playful is layered with `playful:` variants only (wiki/playful-mode.md).
 *   card     Focused 1px ink@.10 + 0 4 14 .03 shadow       Playful same border + 0 6 20 .06 shadow
 *   chip     Focused 22px flat pill, 12px, no stroke        Playful 32px pill, 13px, 1px stroke
 */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const HEADING = 'm-0 font-sans font-semibold text-[#1c2a21] playful:font-heading';

export const DETAIL_CARD =
  'rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_4px_14px_rgba(28,42,33,0.03)] playful:shadow-[0_6px_20px_rgba(28,42,33,0.06)]';

/* The raised card (Archetype badge, library "Recommended" card): Playful 1.5px ink@.55 + hard 4px shelf. */
export const RAISED =
  'border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

export const PAGE_WRAP =
  'mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] pl-[clamp(12px,2.3vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[clamp(24px,2.5vw,48px)]';

/* Pill chips ("Chip · …" instances). Most chips are 22px flat in Focused and 32px outlined in Playful; `outline` chips
 * (Figma instances that were never restyled for Focused: "AI-validated", "Recommended") keep the Playful look in both. */
export const CHIP_BASE =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-solid font-sans font-semibold';
export const CHIP_SIZES = {
  responsive:
    'h-[22px] gap-[5px] px-[10px] text-[12px] leading-[14px] playful:h-[32px] playful:gap-[6px] playful:px-[14px] playful:text-[13px] playful:leading-[16px]',
  title:
    'h-[23px] gap-[5px] px-[10px] text-[12.5px] leading-[15px] playful:h-[32px] playful:gap-[6px] playful:px-[14px] playful:text-[13px] playful:leading-[16px]',
  fixed: 'h-[32px] gap-[6px] px-[14px] text-[13px] leading-[16px]',
};
export const CHIP_TONES = {
  soft: 'border-0 bg-[#ebf1ec] text-[#2a5730] playful:border playful:border-[#c1d4c4] playful:text-[#387440]',
  neutral:
    'border-0 bg-[#f8f8f4] text-[#595959] playful:border playful:border-[#e1eae2] playful:bg-white',
  dark: 'border-0 bg-[#387440] text-white playful:border playful:border-[#1c2a21] playful:bg-[#1c2a21]',
  pending:
    'border-0 bg-[#faf4e8] text-[#463409] playful:border playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]',
  outline: 'border border-[#e1eae2] bg-white text-[#595959]',
};

/* Mini status chips (Done · You are here · Next · Strong · Review · Self-reported …): 11px, 21-23px high. */
export const MINI_BASE =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-0 border-solid font-sans font-semibold h-[21px] px-[10px] text-[11px] leading-[13px] max-lg:text-[12px]';
export const MINI_TONES = {
  done: 'bg-[#ebf1ec] text-[#2a5730]',
  here: 'bg-[#387440] text-white',
  next: 'border border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:h-[23px] playful:border-[1.2px] playful:border-[#1c2a21]',
  strong:
    'bg-[#ebf1ec] text-[#2a5730] playful:h-[23px] playful:border playful:border-[rgba(28,42,33,0.35)]',
  review:
    'bg-[#faf4e8] text-[#463409] playful:h-[23px] playful:border playful:border-[rgba(28,42,33,0.35)]',
  plain: 'bg-[#f8f8f4] text-[#595959]',
};
