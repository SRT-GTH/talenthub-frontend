import schoolPhoto from '../../../../../assets/public-data/share/report-case-school-photo.webp';
import officePhoto from '../../../../../assets/public-data/share/report-case-office-photo.webp';
import graduatePhoto from '../../../../../assets/public-data/share/report-case-graduate-photo.webp';
import { REPORT_FOOTER, REPORT_RESULTS } from '../data/shareData.js';
import ReportCaseBand from './ReportCaseBand.jsx';
import ReportFooter from './ReportFooter.jsx';
import ReportSheet from './ReportSheet.jsx';
import { at } from './reportLayout.js';

/*
 * ReportResultsPage — report page 7 "Results on the ground" (Figma 8898:483775): eyebrow + sub at the left, the big "RESULTS ON THE GROUND"
 * title at the right, then three case bands (Northern · Greater Accra · Volta) built from the kit's Case band. Props: pages (total).
 */

const D = REPORT_RESULTS;
const PHOTOS = { school: schoolPhoto, office: officePhoto, graduate: graduatePhoto };

const ReportResultsPage = ({ pages }) => (
  <ReportSheet page={7} pages={pages}>
    <p
      className="m-0 font-sans text-[10px] leading-[12px] font-bold tracking-[1px] text-[#387440] uppercase"
      style={at(48, 48)}
    >
      {D.eyebrow}
    </p>
    <p
      className="m-0 font-sans text-[12.5px] leading-[19px] text-[#575755]"
      style={at(48, 70, 360)}
    >
      {D.sub}
    </p>
    <h1
      className="m-0 text-right font-heading text-[46px] leading-[44px] font-semibold tracking-[-0.46px] text-[#387440]"
      style={at(515, 36, 560)}
    >
      {D.bigTitle[0]}
      <br />
      {D.bigTitle[1]}
    </h1>
    {D.cases.map((item, index) => (
      <ReportCaseBand
        key={item.id}
        bg={item.bg}
        photo={PHOTOS[item.id]}
        region={item.region}
        chipWidth={item.chipWidth}
        title={item.title}
        text={item.text}
        stats={item.stats}
        top={170 + index * 192}
      />
    ))}
    <ReportFooter text={REPORT_FOOTER} page="07" pageLeft={1061} />
  </ReportSheet>
);

export default ReportResultsPage;
