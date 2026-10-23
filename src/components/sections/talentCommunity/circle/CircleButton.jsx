import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { FOCUS_RING, PRIMARY_GRADIENT_TEXT } from './circleStyles.js';

/*
 * CircleButton — the buttons of the My circle frames (Figma `Btn · Link up`, `Btn · Accept`, `Btn · Ignore`, `Btn · Message` …).
 *   tone 'primary'  green shelf, gradient label, 48px  (Link up, Accept, Message, Send link-up, Congratulate, Endorse N skills)
 *   tone 'soft'     soft green, 2px #c1d4c4 border, 56px (Ignore, Cancel, Follow, Endorse, Write a recommendation, Learn from)
 *   tone 'ghost'    white hairline pill, 34px            (Send without a note uses soft; ghost is the "…" / add-note square)
 * Renders a router <Link> when `to` is set, else a <button>. Strokes sit INSIDE the Figma boxes, so the padding here is the drawn
 * padding minus the 2px border. Props: tone, to, disabled, className, children (+ any button / Link attribute).
 */
const TONES = {
  primary:
    'min-h-[48px] rounded-[10px] border-[#2a5730] bg-[#387440] px-[16px] py-[10px] shadow-[0_4px_0_#224626] active:translate-y-[2px]',
  soft: 'min-h-[56px] rounded-[14px] border-[#c1d4c4] bg-[#e1eae2] px-[32px] py-[14px] text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)] max-lg:min-h-[48px] max-lg:px-[20px] max-lg:py-[10px]',
};

const CircleButton = forwardRef(function CircleButton(
  { tone = 'primary', to, disabled, className, children, type = 'button', ...rest },
  ref
) {
  const primary = tone === 'primary';
  const cls = classNames(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border-2 border-solid font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] no-underline transition-transform max-lg:text-[14px]',
    TONES[tone],
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
      <Link ref={ref} to={to} className={cls} {...rest}>
        {label}
      </Link>
    );
  }
  return (
    <button ref={ref} type={type} disabled={disabled} className={cls} {...rest}>
      {label}
    </button>
  );
});

export default CircleButton;
