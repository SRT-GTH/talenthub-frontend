import openerPhoto from '../../../../assets/agency/report/report-section-opener-photo.webp';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import { AGENCY_REPORT_FOOTER, AGENCY_REPORT_OPENER as D } from './data/reportData.js';

/*
 * AgencyReportOpener — page 3 (Figma 11.4.4k v2, 8932:18968): the Theme 8 section-opener layout with the agency copy and photo.
 * Photo 743px at the right with a dark gradient shade and the ultra-light "YOUTH IN NUMBERS"; eyebrow, title, gold rule, body and pull quote
 * at the left. Props: pages (total).
 */

const AgencyReportOpener = ({ pages }) => (
  <ReportSheet page={3} pages={pages}>
    <img
      src={openerPhoto}
      alt="Two colleagues reviewing printed charts together at a desk"
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
    <ReportFooter text={AGENCY_REPORT_FOOTER} page="03" pageLeft={330} />
  </ReportSheet>
);

export default AgencyReportOpener;
