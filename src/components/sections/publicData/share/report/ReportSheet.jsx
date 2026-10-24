import { classNames } from '../../../../../utils/classNames.js';
import { REPORT_H, REPORT_W } from './reportLayout.js';

/*
 * ReportSheet — one page of the GTH report kit (Figma 8.8.1 v2): a 1123×794 canvas = A4 landscape at 96 dpi, white, clipped.
 * In print each sheet is its own A4 landscape page (publicPrint.css: named page "report-landscape", one sheet per page).
 * Props: page (1-based number, for the accessible name), pages (total), className, children.
 */

const ReportSheet = ({ page, pages, className, children }) => (
  <section
    data-report-sheet=""
    aria-label={`Report page ${page} of ${pages}`}
    className={classNames('relative overflow-hidden bg-white font-sans text-[#1c2a21]', className)}
    style={{ width: REPORT_W, height: REPORT_H }}
  >
    {children}
  </section>
);

export default ReportSheet;
