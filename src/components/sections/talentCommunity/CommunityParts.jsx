import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { FOCUS_RING, PRIMARY_GRADIENT_TEXT } from './communityStyles.js';

/*
 * Community v2 building blocks (browse screens; the other Community agents may reuse them).
 *
 * CommunityButton — Figma "Button · Join / Joined / Request this community / Clear search" (7624:4363, 7624:4393, 7629:10464, 7629:10470).
 *   tone: 'primary' (green shelf, gradient label: Join, Request this community), 'joined' (soft green, "Joined"),
 *         'secondary' (white, ink 30% border: Clear search). Renders a router <Link> when `to` is set, else a <button>.
 *   Props: tone, to, onClick, disabled, className, children (+ any button/Link attribute).
 * (Figma strokes sit INSIDE the boxes, so the padding here is the drawn padding minus the 2px border.)
 * CommunityChip — Figma "Chip · …" category pill (32px, 13px/600); `on` = the selected (dark) chip. Props: on, onClick, children.
 * CommunitySticker — the yellow Playful sticker / quiet green Focused pill next to a title ("10 communities", "1 joined").
 *   Props: size 'lg' (13px, tilt 6deg) | 'sm' (11px, tilt 3deg), children.
 */
const BUTTON_TONES = {
  primary:
    'min-h-[48px] rounded-[10px] border-[#2a5730] bg-[#387440] px-[16px] py-[10px] shadow-[0_4px_0_#224626] active:translate-y-[2px]',
  joined:
    'min-h-[44px] rounded-[10px] border-[#c1d4c4] bg-[#e1eae2] px-[14px] py-[8px] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)]',
  secondary:
    'min-h-[44px] rounded-[10px] border-[rgba(28,42,33,0.3)] bg-white px-[14px] py-[8px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] active:translate-y-[2px]',
};

export const CommunityButton = ({
  tone = 'primary',
  to,
  onClick,
  disabled,
  className,
  children,
  ...rest
}) => {
  const primary = tone === 'primary';
  const cls = classNames(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border-2 border-solid font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] no-underline transition-transform max-lg:text-[14px]',
    BUTTON_TONES[tone],
    disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    FOCUS_RING,
    className
  );
  const label = (
    <span
      className={primary ? 'bg-clip-text text-transparent' : undefined}
      style={primary ? PRIMARY_GRADIENT_TEXT : undefined}
    >
      {children}
    </span>
  );
  if (to && !disabled) {
    return (
      <Link to={to} onClick={onClick} className={cls} {...rest}>
        {label}
      </Link>
    );
  }
  return (
    <button type="button" disabled={disabled} onClick={onClick} className={cls} {...rest}>
      {label}
    </button>
  );
};

export const CommunityChip = ({ on, onClick, children }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    className={classNames(
      'inline-flex h-[32px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] max-lg:min-h-[32px]',
      on ? 'border-[#1c2a21] bg-[#1c2a21] text-white' : 'border-[#e1eae2] bg-white text-[#595959]',
      FOCUS_RING
    )}
  >
    {children}
  </button>
);

export const CommunitySticker = ({ size = 'lg', children }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-[#ebf1ec] font-sans font-bold text-[#1f4a2b]',
      'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      size === 'lg'
        ? 'px-[11px] py-[5px] text-[13px] leading-[16px] playful:rotate-6'
        : 'px-[10px] py-[5px] text-[11px] leading-[13px] max-lg:text-[12px] playful:rotate-3'
    )}
  >
    {children}
  </span>
);
