import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * FieldButton — the "shelf" buttons of the Site copy fields, dialogs and screens (Figma "Btn · …": r14, 2 px border, 4 px shelf, 16 / 700 label).
 * tone: primary (#387440 face, #2a5730 border + shelf, white label) · secondary (white face, ink 30 % border, rgba(17,17,17,.25) shelf).
 * size: lg 56 high (dialogs, 34 px side padding) · md 44 high (field actions, 18 px) · sm 48 high, r10 (Settings "Save changes") · xs 24 high (the compact "Upload new" of the image field).
 * Renders a <Link> when `to` is set. Targets stay at least 24 px high. Props: tone, size, to, className, ...button props.
 */
const TONE = {
  primary:
    'border-[#2a5730] bg-[#387440] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-[#387440]',
  secondary:
    'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-[#387440]',
};
const SIZE = {
  lg: 'min-h-[56px] rounded-[14px] px-[34px] max-sm:px-[16px]',
  md: 'min-h-[44px] rounded-[14px] px-[18px]',
  sm: 'min-h-[48px] rounded-[10px] px-[18px]',
  xs: 'h-[24px] rounded-[14px] px-[18px]',
};

const FieldButton = forwardRef(function FieldButton(
  { tone = 'secondary', size = 'md', to, type = 'button', className, children, ...rest },
  ref
) {
  const classes = classNames(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] border-2 border-solid font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap no-underline transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
    TONE[tone],
    SIZE[size],
    className
  );
  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  );
});

export default FieldButton;
