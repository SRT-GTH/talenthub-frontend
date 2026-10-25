import ReportBarRow from '../../publicData/share/report/ReportBarRow.jsx';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportHighlightTile from '../../publicData/share/report/ReportHighlightTile.jsx';
import ReportPageHeader from '../../publicData/share/report/ReportPageHeader.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import { AGENCY_REPORT_FOOTER, AGENCY_REPORT_SKILLS as D } from './data/reportData.js';

/*
 * AgencyReportSkills — page 5 (Figma 11.4.4m v2, 8932:19136): top-10 skills as bar rows (first emphasised), the green "3.1" highlight tile
 * and the three supply-vs-demand groups with their bars, then the multiple-skills note. Props: pages (total).
 */

const AgencyReportSkills = ({ pages }) => (
  <ReportSheet page={5} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={640} />
    {D.rows.map((row, index) => (
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
      {D.supplyTitle}
    </h2>
    {D.supply.map((row, index) => {
      const top = 416 + index * 78;
      return (
        <div key={row.label}>
          <p
            className="m-0 font-heading text-[30px] leading-[36px] font-semibold tracking-[-0.3px] text-[#387440]"
            style={at(690, top)}
          >
            {row.count}
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
    <ReportFooter text={AGENCY_REPORT_FOOTER} page="05" />
  </ReportSheet>
);

export default AgencyReportSkills;
