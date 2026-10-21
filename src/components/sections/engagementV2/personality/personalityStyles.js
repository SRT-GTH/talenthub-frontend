/*
 * Shared class strings for the Personality package. Focused = 1px ink@.10 border + soft shadow;
 * Playful = 1.5px ink@.55 border + hard shadow (wiki/playful-mode.md).
 */
export const CARD_EDGE =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';
export const CARD = `rounded-[24px] bg-white ${CARD_EDGE}`;
export const CARD_SM = `rounded-[16px] bg-white ${CARD_EDGE}`;

/* Playful display face for headings (Figma swaps SF Pro Rounded for Bricolage Grotesque in Playful). */
export const DISPLAY = 'playful:font-[family-name:var(--pf-font-display)]';

/* Page gutter anchored on the 1728 frame (64px). */
export const GUTTER = 'px-[clamp(16px,3.7vw,64px)]';

/* Pill chip: white, 1px #e1eae2, 13/600 #595959 */
export const CHIP =
  'inline-flex min-h-[32px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] max-lg:text-[12px]';

export const KICKER =
  'font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] max-lg:text-[12px]';
