import { classNames } from '../../../../utils/classNames.js';
import InstitutionReportContents from './InstitutionReportContents.jsx';
import InstitutionReportCover from './InstitutionReportCover.jsx';
import InstitutionReportFlow from './InstitutionReportFlow.jsx';
import InstitutionReportMethod from './InstitutionReportMethod.jsx';
import InstitutionReportOpener from './InstitutionReportOpener.jsx';
import InstitutionReportRegions from './InstitutionReportRegions.jsx';
import InstitutionReportInterests from './InstitutionReportInterests.jsx';
import InstitutionReportStories from './InstitutionReportStories.jsx';
import { INSTITUTION_REPORT_PAGE_COUNT } from './data/institutionReportData.js';

/*
 * InstitutionReportDocument — the 8 pages of the Board of Governors report (Figma 11.3.5 v2). On screen only `current` is shown (the rest stay mounted but
 * hidden); in print every sheet is shown, one per A4 landscape page (publicPrint.css, shared with Theme 8).
 * Props: current (1-based, null = all), className.
 */

const PAGES = [
  InstitutionReportCover,
  InstitutionReportContents,
  InstitutionReportOpener,
  InstitutionReportRegions,
  InstitutionReportInterests,
  InstitutionReportFlow,
  InstitutionReportStories,
  InstitutionReportMethod,
];

const InstitutionReportDocument = ({ current = null, className }) => (
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
          <Page pages={INSTITUTION_REPORT_PAGE_COUNT} />
        </div>
      );
    })}
  </>
);

export default InstitutionReportDocument;
