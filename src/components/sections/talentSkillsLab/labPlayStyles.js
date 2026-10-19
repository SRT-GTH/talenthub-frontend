/*
 * Shared class strings for the Skills Lab lab-flow screens (play chrome, question parts, results dialog, lab details).
 * Focused values are the default; Playful is layered with `playful:` variants only (wiki/playful-mode.md).
 *   card     Focused 1px ink@.10 hairline + two soft shadows     Playful 1.5px ink@.55 + 4px hard shelf + soft lift
 *   sticker  Focused soft green pill (no border)                  Playful #ffd86b + 1.2px ink + 2px shelf
 */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const INK_CARD =
  'border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

export const INK_PILL =
  'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]';

// Figma "genz:doodle star": a 4-point sparkle in a 22x22 box (scale it with the svg size).
export const DOODLE_STAR_PATH =
  'M11 0C12.1 7.7 14.3 9.9 22 11C14.3 12.1 12.1 14.3 11 22C9.9 14.3 7.7 12.1 0 11C7.7 9.9 9.9 7.7 11 0Z';
