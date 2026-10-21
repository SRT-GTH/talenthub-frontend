/* Shared class strings for the Goals + Profile complete screens (Focused default, `playful:` overrides; Figma GO-01..06, CO-01..02). */
const SOFT = 'shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)]';
const SHELF = 'playful:shadow-[4px_4px_0_rgba(28,42,33,.45),0_10px_24px_rgba(28,42,33,.06)]';

/* White card: 1px ink@.10 + soft shadow (Focused) / 1.5px ink@.55 + hard shelf (Playful). */
export const CARD_BASE = `border border-solid border-[rgba(28,42,33,0.1)] bg-white ${SOFT} playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF}`;
export const CARD = `${CARD_BASE} rounded-[24px]`;
/* Same border + shadow ladder without a fill (for tinted tiles / stats). */
export const LINE_SHADOW = `border border-solid border-[rgba(28,42,33,0.1)] ${SOFT} playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF}`;
export const HEADING_FONT = 'font-sans playful:font-[family-name:var(--font-heading)]';
export const CHIP_LINE =
  'border border-solid border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.35)]';
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';
export const PAGE_X = 'px-4 md:px-[clamp(20px,3.7vw,64px)]';
export const EYEBROW =
  'm-0 font-sans text-[11px] font-bold leading-[13px] tracking-[1.2px] max-lg:text-[12px]';
/* Playful yellow sticker (add the tilt / position classes where it is used). */
export const STICKER =
  'rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]';
