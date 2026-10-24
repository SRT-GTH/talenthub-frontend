/*
 * shareButtonClasses — size overrides that make the shared <Button> match the Figma buttons of the Theme 8 dialogs.
 * Figma draws the button stroke INSIDE a 48px box (padding 12 + 24 line + 12); the primitive adds its 1/2/2/2px border on top (51px),
 * so the vertical padding drops by 1.5px and the horizontal padding by the 2+2px border (primary 18 → 16, tertiary 22 → 20).
 */
export const PRIMARY_BUTTON = '!px-[16px] !py-[10.5px]';
export const TERTIARY_BUTTON = '!rounded-[14px] !px-[20px] !py-[10.5px]';
