import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * MediaButton — the two buttons of the Media library (Figma "Btn · Upload" 7.8.9a, "Btn · Cancel" / "Btn · Replace file" of the dialogs):
 * primary = #387440 face, 2px #2a5730 border, 0 4px 0 #234626 shelf, r10 (header, 44 high) / r14 (dialogs, 56 high), label white 14/600 or 16/700;
 * secondary = white face, 2px ink@.30 border, 0 4px 0 shelf r14, label #1c2a21 16/700.
 * Props: variant 'primary' | 'secondary', size 'header' | 'dialog', to (renders a <Link>), ...button props.
 */
const BASE =
  'inline-flex shrink-0 items-center justify-center gap-[8px] border-2 border-solid font-sans whitespace-nowrap no-underline transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_#234626] disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 cursor-pointer';
const VARIANT = {
  primary: 'border-[#2a5730] bg-[#387440] text-white shadow-[0_4px_0_#234626]',
  secondary:
    'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]',
};
const SIZE = {
  header:
    'min-h-[44px] rounded-[10px] px-[18px] py-[10px] text-[14px] leading-[24px] font-semibold tracking-[0.1px]',
  dialog:
    'min-h-[56px] rounded-[14px] px-[clamp(8px,2.4vw,30px)] py-[16px] text-[16px] leading-[24px] font-bold tracking-[0.1px]',
};

const MediaButton = ({
  variant = 'primary',
  size = 'dialog',
  to,
  className,
  children,
  type = 'button',
  ...rest
}) => {
  const classes = classNames(
    BASE,
    VARIANT[variant],
    SIZE[size],
    variant === 'secondary' && size === 'header' && 'rounded-[14px]',
    className
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default MediaButton;
