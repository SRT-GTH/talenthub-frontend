import { formatCount } from '../../publicDataFormat.js';
import { at } from './reportLayout.js';

/*
 * ReportBarRow — "GTH Report · Bar row" (Figma 8896:125): label (12/14, 600 when emphasised) · track (#ebf1ec, radius 4) with a bar ·
 * value (12/14 600). Placed by its Figma coordinates. Props: label, value (count → formatCount), bar (px of the bar), left, top,
 * labelWidth (172), trackWidth (330), barHeight (8), strong (first row: darker bar #2a5730 and semibold label).
 */

const ReportBarRow = ({
  label,
  value,
  bar,
  left,
  top,
  labelWidth = 172,
  trackWidth = 330,
  barHeight = 8,
  strong = false,
}) => (
  <div style={at(left, top, labelWidth + trackWidth + 80, 14)}>
    <span
      className={`font-sans text-[12px] leading-[14px] text-[#1c2a21] ${strong ? 'font-semibold' : ''}`}
      style={at(0, 0)}
    >
      {label}
    </span>
    <span className="rounded-[4px] bg-[#ebf1ec]" style={at(labelWidth, 4, trackWidth, barHeight)}>
      <span
        className="block rounded-[4px]"
        style={{ width: bar, height: barHeight, backgroundColor: strong ? '#2a5730' : '#387440' }}
      />
    </span>
    <span
      className="font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21]"
      style={at(labelWidth + trackWidth, 0)}
    >
      {formatCount(value)}
    </span>
  </div>
);

export default ReportBarRow;
