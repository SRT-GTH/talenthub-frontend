import { REPORT_FOOTER, REPORT_INTERESTS } from '../data/shareData.js';
import ReportBarRow from './ReportBarRow.jsx';
import ReportFooter from './ReportFooter.jsx';
import ReportHighlightTile from './ReportHighlightTile.jsx';
import ReportPageHeader from './ReportPageHeader.jsx';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportInterestsPage — report page 5 "Technology leads. Health and business are close behind." (Figma 8898:483661): the top-10 career
 * interests as bar rows (first row emphasised), the green "1 in 5" highlight tile and the three education levels with their share bars,
 * then the note about multiple interests. Props: pages (total).
 */

const D = REPORT_INTERESTS;

const ReportInterestsPage = ({ pages }) => (
  <ReportSheet page={5} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={640} />
    {D.interests.map((row, index) => (
      <ReportBarRow
        key={row.label}
        label={row.label}
        value={row.value}
        bar={row.bar}
        left={48}
        top={196 + index * 44}
        strong={index === 0}
      />
    ))}
    <ReportHighlightTile value={D.highlightValue} text={D.highlightText} left={690} top={196} />
    <h2 className="m-0 font-heading text-[18px] leading-[22px] font-semibold" style={at(690, 378)}>
      {D.peopleTitle}
    </h2>
    {D.people.map((row, index) => {
      const top = 416 + index * 78;
      return (
        <div key={row.label}>
          <p
            className="m-0 font-heading text-[30px] leading-[36px] font-semibold tracking-[-0.3px] text-[#387440]"
            style={at(690, top)}
          >
            {row.pct}%
          </p>
          <p
            className="m-0 font-sans text-[12.5px] leading-[15px] font-semibold"
            style={at(782, top + 4)}
          >
            {row.label}
          </p>
          <p
            className="m-0 font-sans text-[11px] leading-[13px] text-[#575755]"
            style={at(782, top + 22)}
          >
            {row.hint}
          </p>
          <span className="rounded-[4px] bg-[#ebf1ec]" style={at(782, top + 44, 293, 6)}>
            <span className="block h-[6px] rounded-[4px] bg-[#387440]" style={{ width: row.bar }} />
          </span>
        </div>
      );
    })}
    <p className="m-0 font-sans text-[10.5px] leading-[13px] text-[#575755]" style={at(48, 650)}>
      {D.note}
    </p>
    <ReportFooter text={REPORT_FOOTER} page="05" />
  </ReportSheet>
);

export default ReportInterestsPage;
