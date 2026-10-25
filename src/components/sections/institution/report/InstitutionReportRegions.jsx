import ghanaMap from '../../../../assets/institution/report/report-ghana-map.svg';
import ReportCallout from '../../publicData/share/report/ReportCallout.jsx';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportPageHeader from '../../publicData/share/report/ReportPageHeader.jsx';
import ReportRankRow from '../../publicData/share/report/ReportRankRow.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import ReportStatBand from '../../publicData/share/report/ReportStatBand.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import {
  INSTITUTION_REPORT_FOOTER,
  INSTITUTION_REPORT_REGIONS as D,
} from './data/institutionReportData.js';

/*
 * InstitutionReportRegions — page 4 (Figma 11.3.5 v2, 8914:160): header, the labelled Ghana map (Figma instance exported as SVG, region fills as
 * drawn) with its 5-step legend, the top five regions, the gold "Where we’re thin" callout, the green stat band + dark footer.
 * Text equivalent of the map: the ranked list + the alt text. Props: pages (total).
 */

const InstitutionReportRegions = ({ pages }) => (
  <ReportSheet page={4} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={560} />
    <img src={ghanaMap} alt={D.mapAlt} width="301" height="440" style={at(64, 196, 301, 440)} />
    <p
      className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[0.8px] text-[#575755] uppercase"
      style={at(400, 192)}
    >
      {D.legendTitle}
    </p>
    {D.legend.map((bin, index) => (
      <div key={bin.label}>
        <span
          aria-hidden="true"
          className="rounded-[4px]"
          style={{ ...at(400, 214 + index * 26, 14, 14), backgroundColor: bin.swatch }}
        />
        <span
          className="font-sans text-[11px] leading-[13px] whitespace-nowrap text-[#1c2a21]"
          style={at(422, 214 + index * 26)}
        >
          {bin.label}
        </span>
      </div>
    ))}
    <h2 className="m-0 font-heading text-[18px] leading-[22px] font-semibold" style={at(640, 196)}>
      {D.topTitle}
    </h2>
    {D.top.map((row, index) => (
      <ReportRankRow
        key={row.rank}
        rank={row.rank}
        name={row.name}
        value={row.value}
        bar={row.bar}
        strong={row.tone === 'dark'}
        top={232 + index * 54}
      />
    ))}
    <ReportCallout eyebrow={D.calloutEyebrow} text={D.calloutText} left={640} top={512} />
    <ReportStatBand stats={D.stats} />
    <ReportFooter text={INSTITUTION_REPORT_FOOTER} page="04" theme="dark" />
  </ReportSheet>
);

export default InstitutionReportRegions;
