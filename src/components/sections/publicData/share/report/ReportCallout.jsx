import { at } from './reportLayout.js';

/*
 * ReportCallout — "GTH Report · Callout" (Figma 8896:130): #faf4e8 box, radius 14, gold eyebrow (10/12 700, ls 0.8) and one short insight
 * (11.5/17). Props: eyebrow, text, left, top, width (435), height (92).
 */

const ReportCallout = ({ eyebrow, text, left, top, width = 435, height = 92 }) => (
  <div className="rounded-[14px] bg-[#faf4e8]" style={at(left, top, width, height)}>
    <p
      className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[0.8px] text-[#c8951a] uppercase"
      style={at(18, 16)}
    >
      {eyebrow}
    </p>
    <p
      className="m-0 font-sans text-[11.5px] leading-[17px] text-[#1c2a21]"
      style={at(18, 34, 400)}
    >
      {text}
    </p>
  </div>
);

export default ReportCallout;
