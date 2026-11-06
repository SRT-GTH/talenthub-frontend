import { classNames } from '../../../../../utils/classNames.js';

/*
 * EditorButton — the two shelf buttons of the section editor's popovers, banners and dialogs (Figma "Btn · Cancel / Keep my words / Try again"
 * and "Btn · Add link / Reset / Keep mine"): 44 high, px 18, r14, 2 px border, 16/700, 4 px shelf.
 *   secondary  white, border #1c2a21 at 30 %, shelf rgba(17,17,17,.25)        primary  #387440, border #2a5730, shelf #224626, white text
 * Props: variant ('secondary' | 'primary'), className, ...button props.
 */
const VARIANTS = {
  secondary:
    'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] hover:shadow-[0_5px_0_rgba(17,17,17,0.25)] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]',
  primary:
    'border-[#2a5730] bg-[#387440] text-white shadow-[0_4px_0_#224626] hover:shadow-[0_5px_0_#224626] active:shadow-[0_1px_0_#224626]',
};

const EditorButton = ({ variant = 'secondary', type = 'button', className, children, ...rest }) => (
  <button
    type={type}
    className={classNames(
      'inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid px-[18px] py-[10px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] disabled:cursor-not-allowed disabled:opacity-50 max-lg:text-[14px]',
      VARIANTS[variant] ?? VARIANTS.secondary,
      className
    )}
    {...rest}
  >
    {children}
  </button>
);

export default EditorButton;
