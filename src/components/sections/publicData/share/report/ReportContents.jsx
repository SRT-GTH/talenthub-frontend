import seedling from '../../../../../assets/public-data/share/report-contents-seedling-photo.jpg';
import { REPORT_CONTENTS } from '../data/shareData.js';
import ReportFooter from './ReportFooter.jsx';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportContents — "GTH Report · Page / Contents" (Figma 8898:11667, page 2 = 8898:483523): a 360px green band with the vertical word
 * "Contents", "Inside this snapshot" and the page count, a seedling photo; four columns (big light numeral · section title · items · page
 * reference) split by 1px #c1d4c4 rules; a decorative outlined "Contents" word at 35 %. Props: pages (total).
 */

const D = REPORT_CONTENTS;

const ReportContents = ({ pages }) => (
  <ReportSheet page={2} pages={pages}>
    <div className="bg-[#387440]" style={at(0, 0, 360, 794)} />
    <p
      className="m-0 font-heading text-[46px] leading-[55px] font-semibold tracking-[-0.46px] text-white [writing-mode:vertical-rl] rotate-180"
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
    <ReportFooter text={D.footer} page="02" left={392} />
  </ReportSheet>
);

export default ReportContents;
