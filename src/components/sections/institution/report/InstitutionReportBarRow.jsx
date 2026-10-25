import { formatCount } from '../../publicData/publicDataFormat.js';
import { at } from '../../publicData/share/report/reportLayout.js';

/*
 * InstitutionReportBarRow — the kit's "GTH Report · Bar row" (Figma 8896:125) as drawn on page 5 of the board report: label (12/14, 600 when
 * emphasised) · track (#ebf1ec, radius 4) with a bar · value (12/14 600) RIGHT-aligned in an 80px box (the Theme 8 row left-aligns it).
 * Props: label, value (count → formatCount), bar (px), left, top, strong (first row: darker bar, semibold label).
 */

const InstitutionReportBarRow = ({ label, value, bar, left, top, strong = false }) => (
  <div style={at(left, top, 582, 14)}>
    <span
      className={`font-sans text-[12px] leading-[14px] text-[#1c2a21] ${strong ? 'font-semibold' : ''}`}
      style={at(0, 0)}
    >
      {label}
    </span>
    <span className="rounded-[4px] bg-[#ebf1ec]" style={at(172, 4, 330, 8)}>
      <span
        className="block h-[8px] rounded-[4px]"
        style={{ width: bar, backgroundColor: strong ? '#2a5730' : '#387440' }}
      />
    </span>
    <span
      className="text-right font-sans text-[12px] leading-[14px] font-semibold text-[#1c2a21]"
      style={at(502, 0, 80)}
    >
      {formatCount(value)}
    </span>
  </div>
);

export default InstitutionReportBarRow;
