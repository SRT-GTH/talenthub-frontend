/*
 * Community v2 shared class strings (kept out of component files: react-refresh/only-export-components).
 * Focused is the default look; Playful only through `playful:` variants (hard 4px shadows, 1.5px ink borders,
 * stickers, Bricolage headings) — same convention as the Skills Lab / Job Postings sections.
 */
export const HEADING = 'm-0 font-sans font-semibold text-[#1c2a21] playful:font-heading';

export const SOFT_SHADOW = 'shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]';
export const HARD_SHADOW =
  'playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* Emphasis surface (joined card, menu, search input in Playful): Focused hairline + soft shadow, Playful ink border + hard shadow. */
export const EMPHASIS_SURFACE = `${SOFT_SHADOW} ${HARD_SHADOW}`;

export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

export const PRIMARY_GRADIENT_TEXT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};
