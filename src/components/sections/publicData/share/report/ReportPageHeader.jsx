import { at } from './reportLayout.js';

/*
 * ReportPageHeader — "GTH Report · Page header" (Figma 8896:98): eyebrow (10/12 700, ls 1, #387440) · title (Bricolage 32/37 600, ls -0.32)
 * · sub (12.5/19 #575755), stacked with a 10px gap. Props: eyebrow, title, sub, left (48), top (44), width (640 | 600 | 560).
 */

const ReportPageHeader = ({ eyebrow, title, sub, left = 48, top = 44, width = 640 }) => (
  <header className="flex flex-col gap-[10px]" style={at(left, top, width)}>
    <p className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[1px] text-[#387440] uppercase">
      {eyebrow}
    </p>
    <h1 className="m-0 font-heading text-[32px] leading-[37px] font-semibold tracking-[-0.32px] text-[#1c2a21]">
      {title}
    </h1>
    <p className="m-0 font-sans text-[12.5px] leading-[19px] text-[#575755]">{sub}</p>
  </header>
);

export default ReportPageHeader;
