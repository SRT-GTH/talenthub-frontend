import openerPhoto from '../../../../../assets/public-data/share/report-section-opener-photo.jpg';
import { REPORT_OPENER } from '../data/shareData.js';
import ReportFooter from './ReportFooter.jsx';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportOpener — "GTH Report · Page / Section opener" (Figma 8898:11681, page 3 = 8898:483552): a 743px photo on the right with a dark
 * gradient shade (#142917 at 55 % → 0 by 45 % of its height) and the ultra-light headline "RISING TALENT"; at the left the section eyebrow,
 * "Yɛn daakye" (Akan: our future), a gold rule, two paragraphs and a pull quote. Props: pages (total).
 */

const D = REPORT_OPENER;

const ReportOpener = ({ pages }) => (
  <ReportSheet page={3} pages={pages}>
    <img
      src={openerPhoto}
      alt="Four young colleagues smiling around laptops in a bright office"
      width="743"
      height="794"
      style={at(380, 0, 743, 794)}
    />
    <span
      aria-hidden="true"
      style={{
        ...at(380, 0, 743, 794),
        background: 'linear-gradient(180deg, rgba(20,41,23,0.55) 0%, rgba(20,41,23,0) 45%)',
      }}
    />
    <p
      aria-hidden="true"
      className="m-0 font-heading text-[84px] leading-[81px] font-extralight tracking-[-1.68px] text-white"
      style={at(428, 52)}
    >
      {D.photoHeadline[0]}
      <br />
      {D.photoHeadline[1]}
    </p>
    <div className="flex flex-col gap-[14px]" style={at(48, 64, 300)}>
      <p className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[1px] text-[#387440] uppercase">
        {D.eyebrow}
      </p>
      <h1 className="m-0 font-heading text-[46px] leading-[48px] font-semibold tracking-[-0.92px] text-[#387440]">
        {D.title}
      </h1>
      <p className="m-0 font-heading text-[18px] leading-[22px] font-medium">{D.subtitle}</p>
      <span aria-hidden="true" className="h-[3px] w-[40px] rounded-[2px] bg-[#c8951a]" />
      <p className="m-0 font-sans text-[12.5px] leading-[19px] whitespace-pre-line text-[#575755]">
        {D.body.join('\n\n')}
      </p>
    </div>
    <blockquote
      className="m-0 font-heading text-[17px] leading-[23px] font-medium text-[#387440]"
      style={at(48, 560, 290)}
    >
      {D.quote}
    </blockquote>
    <p className="m-0 font-sans text-[10px] leading-[12px] text-[#575755]" style={at(48, 640)}>
      {D.quoteBy}
    </p>
    <ReportFooter text={D.footer} page="03" pageLeft={330} />
  </ReportSheet>
);

export default ReportOpener;
