import { classNames } from '../../../../utils/classNames.js';
import AgencyReportContents from './AgencyReportContents.jsx';
import AgencyReportCover from './AgencyReportCover.jsx';
import AgencyReportFlow from './AgencyReportFlow.jsx';
import AgencyReportMethod from './AgencyReportMethod.jsx';
import AgencyReportOpener from './AgencyReportOpener.jsx';
import AgencyReportRegions from './AgencyReportRegions.jsx';
import AgencyReportSkills from './AgencyReportSkills.jsx';
import AgencyReportStories from './AgencyReportStories.jsx';
import { AGENCY_REPORT_PAGE_COUNT } from './data/reportData.js';

/*
 * AgencyReportDocument — the 8 pages of the agency report (Figma 11.4.4i–p v2). On screen only `current` is shown (the rest stay mounted but
 * hidden); in print every sheet is shown, one per A4 landscape page (publicPrint.css, shared with Theme 8).
 * Props: current (1-based, null = all), className.
 */

const PAGES = [
  AgencyReportCover,
  AgencyReportContents,
  AgencyReportOpener,
  AgencyReportRegions,
  AgencyReportSkills,
  AgencyReportFlow,
  AgencyReportStories,
  AgencyReportMethod,
];

const AgencyReportDocument = ({ current = null, className }) => (
  <>
    {PAGES.map((Page, index) => {
      const number = index + 1;
      const visible = current === null || current === number;
      return (
        <div
          key={number}
          data-report-page={number}
          className={classNames(visible ? 'block' : 'hidden', className)}
        >
          <Page pages={AGENCY_REPORT_PAGE_COUNT} />
        </div>
      );
    })}
  </>
);

export default AgencyReportDocument;
