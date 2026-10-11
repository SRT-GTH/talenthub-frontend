/*
 * Phone-scale button classes (below md). Desktop keeps the Figma 56px / 3px-shelf look.
 * Spread onto a `<Button className=...>`; the `!` suffixes beat the Button's own utilities.
 */
export const COMPACT_PRIMARY_BUTTON =
  'max-md:h-11 max-md:min-h-11 max-md:py-0 max-md:px-4 max-md:rounded-[10px] max-md:text-[14px]! max-md:drop-shadow-none! max-md:shadow-none!';

/** Secondary / tertiary buttons: 36px visual. */
export const COMPACT_SECONDARY_BUTTON =
  'max-md:h-9 max-md:min-h-9 max-md:py-0 max-md:px-3 max-md:rounded-[8px] max-md:text-[13px]! max-md:drop-shadow-none! max-md:shadow-none!';
