import { classNames } from '../../../../utils/classNames.js';

/* Small building blocks shared by the P-05 sections (Figma "genz:sticker" + "chip" components). */

/* genz:sticker — 12/700 ink text, tracking .4px, radius 8, 1.2px ink border, hard 2px shadow, px 11 / py 5. Parent positions + rotates it. */
export const StorySticker = ({ children, bg, className, style }) => (
  <span
    style={{ backgroundColor: bg, ...style }}
    className={classNames(
      'absolute z-10 whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.4px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]',
      className
    )}
  >
    {children}
  </span>
);

/* Section-head chip — 13/600, pill, 1px border. tone: gold (on dark / featured) | white (on cream). */
export const SectionChip = ({ children, tone = 'gold' }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full border px-3 py-[5px] font-sans text-[13px] font-semibold leading-[15.5px]',
      tone === 'gold'
        ? 'border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]'
        : 'border-[#c1d4c4] bg-white text-[#387440]'
    )}
  >
    {children}
  </span>
);

export const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';
