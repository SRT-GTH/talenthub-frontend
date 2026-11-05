import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';

/*
 * PublishButton — the buttons of the publish flow (Figma 7.8.4a-i):
 *   primary  "Btn · Publish" 56 high, p 16/34, r14, 2px #2a5730, bg #387440, shelf 0 4 0 #224626, label 16/700 in a warm-white gradient (#fef1e7 → #e8f2ed)
 *   ghost    "Btn · Cancel" 56 high, white, 2px ink@.30, shelf rgba(17,17,17,.25), label #1c2a21
 *   warn     "Btn · Discard changes" 47 high, p 0/20, #faf4e8, 2px ink@.30, label 15/700 #575755
 *   outline  "Btn · Preview" / "Btn · Discard" of the sticky bar: 44 high, p 12/16, r12, 1px white@.35, label 15/600 white
 * Renders a <Link> when `to` is set. `grow` makes it fill its flex row (dialog button pairs).
 */
const BASE =
  'inline-flex shrink-0 cursor-pointer items-center justify-center font-sans whitespace-nowrap no-underline focus-visible:outline-2 focus-visible:outline-offset-2';

const VARIANTS = {
  primary:
    'min-h-[56px] gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[clamp(16px,2.4vw,34px)] py-[16px] text-[16px] leading-[24px] font-bold tracking-[0.1px] shadow-[0_4px_0_#224626] transition-[transform,box-shadow] duration-100 active:translate-y-[3px] active:shadow-[0_1px_0_#224626] focus-visible:outline-[#387440]',
  ghost:
    'min-h-[56px] gap-[8px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[clamp(16px,2.4vw,34px)] py-[16px] text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)] focus-visible:outline-[#387440]',
  warn: 'min-h-[47px] gap-[8px] rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-[#faf4e8] px-[20px] text-[15px] leading-[24px] font-bold tracking-[0.1px] text-[#575755] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)] focus-visible:outline-[#c8951a]',
  outline:
    'min-h-[44px] gap-[6px] rounded-[12px] border border-solid border-white/35 bg-transparent px-[16px] py-[12px] text-[15px] leading-[18px] font-semibold text-white hover:bg-white/10 focus-visible:outline-white',
};

const GRADIENT_TEXT =
  'bg-[linear-gradient(225deg,#fef1e7_0%,#e8f2ed_20%)] bg-clip-text text-transparent';

const PublishButton = ({
  variant = 'ghost',
  to,
  grow = false,
  leftIcon,
  className,
  children,
  type = 'button',
  ...rest
}) => {
  const classes = classNames(
    BASE,
    VARIANTS[variant],
    grow && 'min-w-0 flex-1 basis-[140px]',
    className
  );
  const label =
    variant === 'primary' ? <span className={GRADIENT_TEXT}>{children}</span> : children;
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {leftIcon}
        {label}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {leftIcon}
      {label}
    </button>
  );
};

export default PublishButton;
