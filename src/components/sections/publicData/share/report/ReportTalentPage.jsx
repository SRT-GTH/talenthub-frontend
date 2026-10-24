import ghanaMap from '../../../../../assets/public-data/share/report-ghana-map-labelled.svg';
import { REPORT_FOOTER, REPORT_TALENT } from '../data/shareData.js';
import ReportCallout from './ReportCallout.jsx';
import ReportFooter from './ReportFooter.jsx';
import ReportPageHeader from './ReportPageHeader.jsx';
import ReportRankRow from './ReportRankRow.jsx';
import ReportSheet from './ReportSheet.jsx';
import ReportStatBand from './ReportStatBand.jsx';
import { at } from './reportLayout.js';

/*
 * ReportTalentPage — report page 4 "Every region is on the map" (Figma 8898:483565): page header · labelled Ghana map with its 5-step legend ·
 * "Top five regions" ranked bars · the gold "Where we are thin" callout · the green stat band + dark footer.
 * The map is the Figma vector export (labels outlined); counts go through formatCount. Props: pages (total).
 */

const D = REPORT_TALENT;

const ReportTalentPage = ({ pages }) => (
  <ReportSheet page={4} pages={pages}>
    <ReportPageHeader eyebrow={D.eyebrow} title={D.title} sub={D.sub} width={560} />
    <img
      src={ghanaMap}
      alt="Map of Ghana's 16 regions, darker green where more talents are registered"
      width="306"
      height="442"
      style={at(62, 195, 306, 442)}
    />
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
    <ReportFooter text={REPORT_FOOTER} page="04" theme="dark" />
  </ReportSheet>
);

export default ReportTalentPage;
