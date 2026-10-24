import { formatCount } from '../../publicDataFormat.js';
import { at } from './reportLayout.js';

/*
 * ReportRankRow — one line of the "Top five regions" list (Figma 8898:66916…, bar instances 8916:485297…): rank (Bricolage 22/26 300,
 * #387440) · name (12.5/15 600) · value (Bricolage 15/18 600, right-aligned to x 1075) · a 330×6 bar under the name.
 * Props: rank ("01"), name, value (count → formatCount), bar (px), strong (darker bar for the first two), top (y of the rank).
 */

const ReportRankRow = ({ rank, name, value, bar, strong = false, top }) => (
  <div>
    <span
      className="font-heading text-[22px] leading-[26px] font-light text-[#387440]"
      style={at(640, top)}
    >
      {rank}
    </span>
    <span
      className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#1c2a21]"
      style={at(684, top + 4)}
    >
      {name}
    </span>
    <span
      className="text-right font-heading text-[15px] leading-[18px] font-semibold text-[#1c2a21]"
      style={at(985, top + 2, 90)}
    >
      {formatCount(value)}
    </span>
    <span className="rounded-[4px] bg-[#ebf1ec]" style={at(684, top + 26, 330, 6)}>
      <span
        className="block h-[6px] rounded-[4px]"
        style={{ width: bar, backgroundColor: strong ? '#2a5730' : '#387440' }}
      />
    </span>
  </div>
);

export default ReportRankRow;
