import { classNames } from '../../../../utils/classNames.js';

/*
 * Monogram — the coloured initials tile that stands in for a partner logo (Figma "monogram" frames 8498:112 52x52 r14 16/700,
 * detail header 8498:536 96x96 r14 26/700, mobile list 8508:395 44x44 r12 15/700, mobile detail 8516:279 64x64 r16 22/700).
 * The sample data in Figma uses monograms (no uploaded logos), so there is no image asset; the fill is the partner's sample colour.
 * Props: initials, color, size ('list' | 'detail'), className. Decorative: the partner name always sits next to it.
 */

const SIZES = {
  list: 'size-[44px] rounded-[12px] text-[15px] leading-[18px] md:size-[52px] md:rounded-[14px] md:text-[16px] md:leading-[19px]',
  detail:
    'size-[64px] rounded-[16px] text-[22px] leading-[26px] md:size-[96px] md:rounded-[14px] md:text-[26px] md:leading-[31px]',
};

const Monogram = ({ initials, color, size = 'list', className }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'inline-flex shrink-0 items-center justify-center font-sans font-bold text-white',
      SIZES[size],
      className
    )}
    style={{ backgroundColor: color }}
  >
    {initials}
  </span>
);

export default Monogram;
