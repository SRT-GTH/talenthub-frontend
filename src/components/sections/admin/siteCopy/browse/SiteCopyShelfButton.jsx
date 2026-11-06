import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * SiteCopyShelfButton — the "shelf" buttons of the Site copy screens (Figma "Btn · Open" / "Btn · Clear search" / "Btn · Browse Public site"):
 *   tone  white  #fff, 2px border ink@.30, 0 4px 0 rgba(17,17,17,.25) shelf, label #1c2a21        (same look as agency/AgencyButton)
 *         green  #387440, 2px border #2a5730, 0 4px 0 #2a5730 shelf, label #e8f2ed (the drawn label gradient #fef1e7 to #e8f2ed ends on #e8f2ed)
 *   size  lg 56 high (py16 px34)   md 44 high (py10 px18), 16/700, r14
 * Renders a <Link> when `to` is set. The horizontal padding of `lg` shrinks on phones so two buttons fit a row.
 */
const TONES = {
  white:
    'border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] hover:shadow-[0_5px_0_rgba(17,17,17,0.25)] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]',
  green:
    'border-[#2a5730] bg-[#387440] text-[#e8f2ed] shadow-[0_4px_0_#2a5730] hover:shadow-[0_5px_0_#2a5730] active:shadow-[0_1px_0_#2a5730]',
};
const SIZES = {
  lg: 'min-h-[56px] px-[clamp(16px,4vw,34px)] py-[16px]',
  md: 'min-h-[44px] px-[18px] py-[10px]',
};

const SiteCopyShelfButton = ({
  tone = 'white',
  size = 'lg',
  to,
  type = 'button',
  className,
  children,
  ...rest
}) => {
  const classes = classNames(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap no-underline transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px]',
    TONES[tone] ?? TONES.white,
    SIZES[size] ?? SIZES.lg,
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

export default SiteCopyShelfButton;
