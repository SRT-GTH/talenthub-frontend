import { classNames } from '../../../../../utils/classNames.js';
import { REPORT_PAGE_COUNT } from '../data/shareData.js';
import ReportContents from './ReportContents.jsx';
import ReportCover from './ReportCover.jsx';
import ReportHowPage from './ReportHowPage.jsx';
import ReportInterestsPage from './ReportInterestsPage.jsx';
import ReportMethod from './ReportMethod.jsx';
import ReportOpener from './ReportOpener.jsx';
import ReportResultsPage from './ReportResultsPage.jsx';
import ReportTalentPage from './ReportTalentPage.jsx';

/*
 * ReportDocument — the 8 pages of the GTH national report (Figma 8.8.1 v2 report kit), composed from the kit components.
 *   1 Cover · 2 Contents · 3 Section opener · 4 Where the talent is · 5 What they want to do · 6 How GTH works · 7 Results on the ground · 8 How we count
 * On screen only `current` is shown (the other sheets stay mounted but hidden); in print every sheet is shown, one per A4 landscape page.
 * Props: current (1-based page shown on screen; null shows all), className (wrapper of each page).
 */

const PAGES = [
  ReportCover,
  ReportContents,
  ReportOpener,
  ReportTalentPage,
  ReportInterestsPage,
  ReportHowPage,
  ReportResultsPage,
  ReportMethod,
];

const ReportDocument = ({ current = null, className }) => (
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
          <Page pages={REPORT_PAGE_COUNT} />
        </div>
      );
    })}
  </>
);

export default ReportDocument;
