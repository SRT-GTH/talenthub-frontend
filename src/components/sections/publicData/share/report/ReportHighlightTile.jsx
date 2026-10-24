import { at } from './reportLayout.js';

/*
 * ReportHighlightTile — "GTH Report · Highlight tile" (Figma 8896:133): #387440 tile, radius 22, a big number (Bricolage 52/62 600, ls -1.04)
 * and one explanatory line (12.5/18, white). Props: value, text, left, top, width (385), height (150).
 */

const ReportHighlightTile = ({ value, text, left, top, width = 385, height = 150 }) => (
  <div className="rounded-[22px] bg-[#387440]" style={at(left, top, width, height)}>
    <p
      className="m-0 font-heading text-[52px] leading-[62px] font-semibold tracking-[-1.04px] text-white"
      style={at(24, 18)}
    >
      {value}
    </p>
    <p className="m-0 font-sans text-[12.5px] leading-[18px] text-white" style={at(24, 90, 330)}>
      {text}
    </p>
  </div>
);

export default ReportHighlightTile;
