import schoolPhoto from '../../../../assets/institution/report/report-case-school-photo.webp';
import graduatePhoto from '../../../../assets/institution/report/report-case-graduate-photo.webp';
import officePhoto from '../../../../assets/institution/report/report-case-office-photo.webp';
import ReportCaseBand from '../../publicData/share/report/ReportCaseBand.jsx';
import ReportFooter from '../../publicData/share/report/ReportFooter.jsx';
import ReportSheet from '../../publicData/share/report/ReportSheet.jsx';
import { at } from '../../publicData/share/report/reportLayout.js';
import {
  INSTITUTION_REPORT_FOOTER,
  INSTITUTION_REPORT_STORIES as D,
} from './data/institutionReportData.js';

/*
 * InstitutionReportStories — page 7 (Figma 11.3.5 v2, 8914:404): eyebrow + sub at the left, the big "PROGRAMME STORIES" title at the right and
 * three case bands (Holiday internship · Scholarships · Credentials) from the kit's Case band. Props: pages (total).
 */

const PHOTOS = { school: schoolPhoto, office: officePhoto, graduate: graduatePhoto };

const InstitutionReportStories = ({ pages }) => (
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
    <ReportFooter text={INSTITUTION_REPORT_FOOTER} page="07" pageLeft={1061} />
  </ReportSheet>
);

export default InstitutionReportStories;
