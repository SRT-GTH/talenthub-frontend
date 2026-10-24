import { formatCount } from '../publicDataFormat.js';

/*
 * PrintBarRow — "T8 · Bar row (detached)" of the A4 print layouts (Figma 8503:398 / 8503:531): label 190 · track (#efefea, radius 4, 14px)
 * with the bar in #387440 · value (14/17 600, right-aligned in 64px). Props: label, value (a count, goes through formatCount), bar (px of
 * the bar), track (px of the track: 156 on the overview, 436 on the outcomes page).
 */

const PrintBarRow = ({ label, value, bar, track }) => (
  <div className="flex h-[27px] items-center gap-[12px] py-[5px]">
    <span className="w-[190px] shrink-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
      {label}
    </span>
    <span
      className="h-[14px] shrink-0 overflow-hidden rounded-[4px] bg-[#efefea]"
      style={{ width: track }}
    >
      <span className="block h-full rounded-[4px] bg-[#387440]" style={{ width: bar }} />
    </span>
    <span className="w-[64px] shrink-0 text-right font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
      {formatCount(value)}
    </span>
  </div>
);

export default PrintBarRow;
