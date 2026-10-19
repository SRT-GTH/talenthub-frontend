/* Shared constants + helpers for the Community dialogs (kept out of the component files for fast refresh). */
export const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

// Focused headings are SF Pro Rounded (font-sans); Playful headings are Bricolage Grotesque.
export const HEADING = 'font-sans playful:font-heading';

/*
 * Card chrome of the Community modals / toast (Figma `modal · …`, `toast · posted`): white, r24, p28.
 * Playful = 1.5px ink@.55 border + 4px hard shadow + soft lift; Focused = 1px ink@.10 hairline + two soft shadows.
 */
export const CARD_CHROME =
  'bg-white border border-solid border-[rgba(28,42,33,0.1)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] ' +
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

/* "{community}"-style template fill. */
export const fillCopy = (text, values) =>
  Object.entries(values).reduce((out, [key, value]) => out.replaceAll(`{${key}}`, value), text);
