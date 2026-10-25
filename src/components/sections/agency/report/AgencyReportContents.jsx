import seedling from '../../../../assets/public-data/share/report-contents-seedling-photo.jpg';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import { AGENCY_REPORT_CONTENTS as D, AGENCY_REPORT_FOOTER } from './data/reportData.js';

/*
 * AgencyReportContents — page 2 (Figma 11.4.4j v2, 8932:18939): green 360px band with the vertical "Contents", seedling photo, four numbered
 * columns split by 1px rules and the outlined "Contents" word at 35 %. Same layout as the Theme 8 kit. Props: pages (total).
 */

const AgencyReportContents = ({ pages }) => (
  <ReportSheet page={2} pages={pages}>
    <div className="bg-[#387440]" style={at(0, 0, 360, 794)} />
    <p
      className="m-0 rotate-180 font-heading text-[46px] leading-[55px] font-semibold tracking-[-0.46px] text-white [writing-mode:vertical-rl]"
      style={at(48, 48, 55, 192)}
    >
      {D.vertical}
    </p>
    <p
      className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-white"
      style={at(120, 56)}
    >
      {D.inside}
    </p>
    <p className="m-0 font-sans text-[11px] leading-[16px] text-white/80" style={at(120, 76, 200)}>
      {D.meta[0]}
      <br />
      {D.meta[1]}
    </p>
    <img
      src={seedling}
      alt="A seedling growing from soil"
      width="360"
      height="364"
      style={at(0, 430, 360, 364)}
    />
    <p
      aria-hidden="true"
      className="m-0 font-heading text-[168px] leading-[202px] font-semibold tracking-[-5.04px] whitespace-nowrap text-transparent opacity-35 [-webkit-text-stroke:1.2px_#387440]"
      style={at(404, 520)}
    >
      {D.outline}
    </p>
    <ol className="m-0 list-none p-0">
      {D.sections.map((section) => (
        <li key={section.title}>
          <span
            aria-hidden="true"
            className="bg-[#c1d4c4]"
            style={at(section.x - 16, 64, 1, 380)}
          />
          <p
            className="m-0 font-heading text-[120px] leading-[120px] font-extralight text-[#387440]"
            style={at(section.x, 56)}
          >
            <span className="sr-only">Section </span>
            {section.numeral}
          </p>
          <h2
            className="m-0 font-heading text-[16px] leading-[20px] font-semibold"
            style={at(section.x, 206, 138)}
          >
            {section.title}
          </h2>
          <p
            className="m-0 font-sans text-[11px] leading-[19px] whitespace-pre-line text-[#575755]"
            style={at(section.x, 258, 140)}
          >
            {section.items.join('\n')}
          </p>
          <p
            className="m-0 font-sans text-[10px] leading-[12px] font-bold text-[#387440]"
            style={at(section.x, 410)}
          >
            {section.ref}
          </p>
        </li>
      ))}
    </ol>
    <ReportFooter text={AGENCY_REPORT_FOOTER} page="02" left={392} />
  </ReportSheet>
);

export default AgencyReportContents;
