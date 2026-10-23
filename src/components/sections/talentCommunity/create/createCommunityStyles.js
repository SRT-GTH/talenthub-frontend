/*
 * Create-your-own-community class strings (kept out of component files: react-refresh/only-export-components).
 * Focused is the default look, Playful only through `playful:` variants. Values are the Figma ones (CC-02 … CC-17b).
 */
export { FOCUS_RING } from '../communityStyles.js';
export { OUTLINE_CHIP, OUTLINE_CHIP_OFF, OUTLINE_CHIP_ON } from '../communityPageStyles.js';

/* GTHInput (Figma): white, r10, p13/16/13/20, 2.5px #bfbfbf shelf, 14/24 text. */
export const INPUT_BASE =
  'box-border block w-full rounded-[10px] border border-solid bg-white py-[13px] pl-[20px] pr-[16px] font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#1c2a21] shadow-[0_2.5px_0_rgba(191,191,191,0.8)] outline-none placeholder:text-[#595959]';
export const INPUT_OK = 'border-[#ccc]';
export const INPUT_FILLED = 'border-[1.5px] border-[#c1d4c4] font-medium';
export const INPUT_ERROR = 'border-[1.5px] border-[#ebc2bd] font-normal text-[#c0392b]';

/* Field label (Figma 14/24 500, ls .2) and the 12/18 help line under a field. */
export const LABEL_TEXT =
  'font-sans text-[14px] font-medium leading-[24px] tracking-[0.2px] text-[#1c2a21]';
export const HELP_TEXT =
  'font-sans text-[12px] font-normal leading-[18px] tracking-[0.2px] text-[#575755]';

/* Section label inside a dialog (Figma 14/17 600). */
export const SECTION_LABEL =
  'm-0 font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]';

/* Callout (Figma `Callout · …`): r12, p14/16, gap 12. Tones: neutral · amber · red. */
export const CALLOUT_BASE =
  'flex items-start gap-[12px] rounded-[12px] border border-solid px-[16px] py-[14px]';
export const CALLOUT_TONES = {
  neutral: {
    box: 'border-[rgba(28,42,33,0.25)] bg-[#f7f8f4]',
    title: 'text-[#1c2a21]',
    icon: 'text-[#1c2a21]',
  },
  amber: {
    box: 'border-[rgba(160,112,10,0.25)] bg-[#fdf5e0]',
    title: 'text-[#a0700a]',
    icon: 'text-[#a0700a]',
  },
  red: {
    box: 'border-[rgba(192,57,43,0.25)] bg-[#fcece9]',
    title: 'text-[#c0392b]',
    icon: 'text-[#c0392b]',
  },
};

/* Icon tile (Figma `icon tile`): 40px, r12, #ebf1ec (white when the row is selected, #faf4e8 for the warning rows). */
export const TILE_BASE = 'flex size-[40px] shrink-0 items-center justify-center rounded-[12px]';
export const TILE_TONES = { green: 'bg-[#ebf1ec]', white: 'bg-white', amber: 'bg-[#faf4e8]' };

/* Option card (Figma `option · …`): r16, p16, gap 14; selected = #ebf1ec + 2px #387440. */
export const OPTION_BASE =
  'box-border flex w-full cursor-pointer items-center gap-[14px] rounded-[16px] border-solid bg-white p-[16px] text-left';
export const OPTION_OFF = 'border border-[#e6e6e6]';
export const OPTION_ON = 'border-2 border-[#387440] bg-[#ebf1ec]';

/* Small pill (Figma `pill · Always on` / `Invited` / `Invite sent`). */
export const PILL_BASE =
  'inline-flex shrink-0 items-center rounded-full px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px]';

/* "Edit" / "Approve all" / "Add a rule" text action (13/16 600 #387440). */
export const TEXT_ACTION =
  'inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#387440] max-lg:min-h-[24px] max-lg:text-[12px]';
