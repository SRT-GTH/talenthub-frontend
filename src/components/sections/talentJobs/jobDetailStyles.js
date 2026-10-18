/*
 * Shared class strings + helpers for the Job posting detail / apply flow (Figma J-02 … J-14).
 * Focused values are the default; Playful is added only through `playful:` variants.
 *   card      Focused 1px rgba(ink,.10) + soft shadow      Playful 1.5px ink-55 + 4px shelf + glow
 *   ink pill  Focused none (hairline where the frame has one)  Playful 1.2px ink
 */
export const INK_CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* Hairline-in-Playful / hairline-in-Focused status pills: Playful carries the ink 35% border. */
export const PILL_OUTLINE =
  'playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]';

/* Yellow "ink" chip border + hard shadow used by stickers and the status tag in Playful. */
export const INK_PILL =
  'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const SECTION_CARD =
  'flex min-w-0 flex-col gap-[20px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-[clamp(16px,1.27vw,22px)]';

export const SECTION_TITLE =
  'm-0 font-sans text-[clamp(19px,1.27vw,22px)] leading-[1.27] font-semibold text-[#1c2a21] playful:font-heading';

/* Replace `{token}` slots in a copy template. */
export const fill = (template, vars) =>
  template.replace(/\{(\w+)\}/g, (_, key) => (vars[key] === undefined ? '' : String(vars[key])));
