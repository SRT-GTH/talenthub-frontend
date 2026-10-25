import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';

/*
 * AgencyButton — the white "shelf" button of the agency screens (Figma "Btn · Customize" 8597:398327 / "Btn · Sort by Match" 8597:398359 /
 * "Btn · Preview as talent" 8597:398719): white face, 2px border rgba(28,42,33,.3), r14, 0 4px 0 rgba(17,17,17,.25) shelf, label #1c2a21.
 * size: xs 36 high · 13/700 (rail card) · sm 38 high · 14/700 (hero actions) · md 42 high · 16/600 (cards). Renders a <Link> when `to` is set.
 * Props: size, to, leftIcon, rightIcon, className, ...button props. Reuse it for every secondary action on a white or green surface.
 */

const SIZES = {
  xs: 'h-[36px] px-[12px] text-[13px] font-bold',
  sm: 'h-[38px] pr-[14px] pl-[12px] text-[14px] font-bold',
  md: 'h-[42px] px-[16px] text-[16px] font-semibold',
};

const AgencyButton = ({
  size = 'sm',
  to,
  type = 'button',
  leftIcon,
  rightIcon,
  className,
  children,
  ...rest
}) => {
  const classes = classNames(
    'inline-flex shrink-0 items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white font-sans leading-[24px] tracking-[0.1px] whitespace-nowrap text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 hover:shadow-[0_5px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)] disabled:cursor-not-allowed disabled:opacity-50',
    SIZES[size] ?? SIZES.sm,
    className
  );
  const content = (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
};

export default AgencyButton;
