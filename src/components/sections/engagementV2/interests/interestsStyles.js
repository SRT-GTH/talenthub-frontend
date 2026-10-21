/* Shared class strings for the Interests screens (Focused default, `playful:` overrides; Figma IN-01..IN-05). */
const SOFT = 'shadow-[0_1px_2px_rgba(28,42,33,.04),0_2px_8px_rgba(28,42,33,.04)]';
const SHELF = 'playful:shadow-[4px_4px_0_rgba(28,42,33,.45),0_10px_24px_rgba(28,42,33,.06)]';

/* White card: 1px ink@.10 + soft shadow (Focused) / 1.5px ink@.55 + hard shelf (Playful). */
export const CARD_BASE = `border border-solid border-[rgba(28,42,33,0.1)] bg-white ${SOFT} playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] ${SHELF}`;
export const CARD = `${CARD_BASE} rounded-[24px]`;
export const SHELF_ONLY = SHELF;

export const HEADING_FONT = 'font-sans playful:font-[family-name:var(--font-heading)]';
export const CHIP_LINE =
  'border border-solid border-[rgba(28,42,33,0.1)] playful:border-[rgba(28,42,33,0.35)]';
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';
export const PAGE_X = 'px-4 md:px-[clamp(20px,3.7vw,64px)]';
