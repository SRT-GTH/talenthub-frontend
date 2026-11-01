import { classNames } from '../../../../utils/classNames.js';
import { FOCUS_RING } from '../skillsLabDialogUtils.js';

/*
 * GameV2Button — the 15/18 600 button of the Games v2 cards and details dialog (Figma `Btn · Play ranked / Practice / Back to
 * games / Start ranked game`). primary = green, secondary = white. Playful: 1.5px border (green #27522e / ink@.55), hard 3px
 * shadow, r14, 45px high. Focused: no border on primary / 1px #dee5e0 hairline on secondary, r12, 42 / 44px high.
 * `icon` is the leading glyph, `trailing` the trailing glyph (arrow); `grow` makes the button take the free row space.
 */
const BASE =
  'inline-flex min-h-[24px] min-w-0 cursor-pointer items-center justify-center gap-[8px] rounded-[12px] px-[20px] py-[12px] font-sans text-[15px] font-semibold leading-[18px] transition-[transform,filter] hover:brightness-[0.97] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 playful:rounded-[14px] playful:py-[12.5px] playful:border-[1.5px] playful:border-solid motion-reduce:transition-none';
const VARIANTS = {
  primary:
    'border-0 bg-[#387440] text-white playful:border-[#27522e] playful:shadow-[0_3px_0_#27522e]',
  secondary:
    'border border-solid border-[#dee5e0] bg-white text-[#1c2a21] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_3px_0_rgba(28,42,33,0.45)]',
};

const GameV2Button = ({
  variant = 'primary',
  icon = null,
  trailing = null,
  grow = false,
  className = '',
  children,
  ...rest
}) => (
  <button
    type="button"
    {...rest}
    className={classNames(
      BASE,
      VARIANTS[variant],
      grow && 'flex-1',
      FOCUS_RING,
      'max-sm:whitespace-normal sm:whitespace-nowrap',
      className
    )}
  >
    {icon}
    <span className="min-w-0">{children}</span>
    {trailing}
  </button>
);

export default GameV2Button;
