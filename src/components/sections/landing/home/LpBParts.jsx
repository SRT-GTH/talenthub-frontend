import { Link } from 'react-router-dom';
import { LpBIcon } from './LpBIcons.jsx';

/* Shared building blocks for LP-B sections (S5-S9). Values from Figma 7797:13091..14848 (+ tablet/mobile frames). */

/* Hard offset "sticker" card shadow + 1.4px 32% ink border used on cards across S5-S9. */
export const CARD_SHADOW =
  'border-[1.4px] border-solid border-[#1c2a21]/[.32] shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]';

/* Section titles: 32 (mobile frame) -> 40 (tablet) -> 54 (desktop) per the Figma character overrides; lh 1.1. */
export const H2_SIZE = 'text-[32px] md:text-[40px] xl:text-[54px] leading-[1.1]';

/* Two-tone section title (Figma character overrides): `lead` in the base colour, `accent` in gold/green. */
export const AccentTitle = ({ lead, accent, accentClass }) => (
  <>
    {lead}
    <span className={accentClass}>{accent}</span>
  </>
);

export const Chip = ({ children, icon, className = '' }) => (
  <span
    className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-1 font-sans text-[13px] font-semibold leading-[15.5px] ${className}`}
  >
    {icon}
    {children}
  </span>
);

/* Yellow/lime/peach tilted label ("genz:sticker"). `tilt` in degrees (Figma rotation is radians: -0.09 rad ≈ -5.2deg). */
export const Sticker = ({ children, className = '', tilt = -5.2, style }) => (
  <span
    style={{ transform: `rotate(${tilt}deg)`, ...style }}
    className={`absolute z-10 whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] ${className}`}
  >
    {children}
  </span>
);

export const SectionHead = ({ chip, title, sub, titleClass = '', maxW = '' }) => (
  <div className={`relative mx-auto flex w-full flex-col items-center gap-3 text-center ${maxW}`}>
    {chip}
    <h2 className={`m-0 ${H2_SIZE} ${titleClass}`}>{title}</h2>
    {sub}
  </div>
);

/* Primary green button (Figma "Btn · …": r10, 0 4px 0 #224626). `to` renders a router Link, otherwise a button. */
export const GreenButton = ({ children, to, onClick, bordered = false, className = '' }) => {
  const cls = `inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#387440] px-5 py-[14px] font-sans text-[16px] font-bold leading-6 tracking-[0.1px] text-white no-underline shadow-[0_4px_0_#224626] transition-colors hover:bg-[#32683a] md:px-7 ${
    bordered ? 'border-2 border-solid border-[#2a5730]' : 'border-0'
  } ${className}`;
  const inner = (
    <>
      {children}
      <LpBIcon name="arrowRight" size={20} />
    </>
  );
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`cursor-pointer ${cls}`}>
      {inner}
    </button>
  );
};
