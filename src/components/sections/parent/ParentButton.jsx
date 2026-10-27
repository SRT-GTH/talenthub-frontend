import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';

/*
 * ParentButton — the 3D button of the parent screens (Figma "Frame" button instances: 10034:3223 primary "Find my ward", secondary "I have a link code"): 2px border, r14, 34 x 16 padding, 16/700 label,
 * a 4px shelf under it. primary = #387440 face, #2a5730 border, #224626 shelf, label in the cream-to-mint gradient; secondary = white face, border rgba(28,42,33,.3), shelf rgba(17,17,17,.25), ink label.
 * Props: variant ('primary' | 'secondary'), to (renders a <Link>), className, ...button props.
 */
const FACE = {
  primary:
    'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#224626] hover:shadow-[0_5px_0_#224626] active:shadow-[0_1px_0_#224626]',
  secondary:
    'border-[#1c2a21]/30 bg-white shadow-[0_4px_0_rgba(17,17,17,0.25)] hover:shadow-[0_5px_0_rgba(17,17,17,0.25)] active:shadow-[0_1px_0_rgba(17,17,17,0.25)]',
};
const LABEL = {
  primary:
    'bg-[linear-gradient(188.38deg,#fef1e7_0%,#e8f2ed_20.192%)] bg-clip-text text-transparent',
  secondary: 'text-[#1c2a21]',
};

const ParentButton = ({
  variant = 'primary',
  to,
  type = 'button',
  className,
  children,
  ...rest
}) => {
  const classes = classNames(
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid px-[34px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap no-underline transition-[transform,box-shadow] duration-100 active:translate-y-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-50',
    FACE[variant] ?? FACE.primary,
    className
  );
  const label = <span className={LABEL[variant] ?? LABEL.primary}>{children}</span>;
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {label}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {label}
    </button>
  );
};

export default ParentButton;
