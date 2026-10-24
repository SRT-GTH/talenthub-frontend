import { useEffect } from 'react';
import { debug } from '../../../../../utils/debug.js';
import Button from '../../../../ui/Button.jsx';
import { REPORT_PAGE_COUNT } from '../data/shareData.js';
import FitToWidth from '../FitToWidth.jsx';
import ReportDocument from './ReportDocument.jsx';
import { REPORT_H, REPORT_W } from './reportLayout.js';
import '../publicPrint.css';

const log = debug('ReportViewer');

/*
 * ReportViewer — the on-screen stage of /data/report (Figma 8.8.1 v2 report kit, 8 pages, A4 landscape).
 * One page at a time at its true 1123×794 size (scaled down on narrow screens); ← / → and the two buttons change the page, which lives in
 * the URL (?page=1…8); "Print" opens the browser print dialog with ALL eight pages, one per A4 landscape sheet (publicPrint.css), which is
 * how the report becomes a PDF without a backend ("Save as PDF").
 * ⚠️ ASSUMPTION: Figma draws the pages only; the three controls under the page (Previous page · Next page · Print) and their wording are
 *   added here, outside the 794px page area, and are hidden when printing.
 * Props: page (1-based), onPage(n).
 */

const ReportViewer = ({ page, onPage }) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.target.closest?.('input,textarea,select')) return;
      if (event.key === 'ArrowLeft' && page > 1) onPage(page - 1);
      if (event.key === 'ArrowRight' && page < REPORT_PAGE_COUNT) onPage(page + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, onPage]);

  return (
    <main
      data-report-stage=""
      className="flex min-h-dvh flex-col items-center bg-[#ecece7] font-sans"
    >
      <h1 className="sr-only">Ghana Talent Hub national talent snapshot, report page {page}</h1>
      <div className="w-full max-w-[1123px]">
        <FitToWidth width={REPORT_W} height={REPORT_H}>
          <ReportDocument current={page} />
        </FitToWidth>
      </div>
      <div
        data-report-controls=""
        className="flex flex-wrap items-center justify-center gap-[12px] px-[16px] py-[20px]"
      >
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <span
          role="status"
          className="font-sans text-[13px] leading-[16px] font-medium text-[#595959]"
        >
          {page} / {REPORT_PAGE_COUNT}
        </span>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          disabled={page >= REPORT_PAGE_COUNT}
          onClick={() => onPage(page + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => {
            log('print');
            window.print();
          }}
        >
          Print
        </Button>
      </div>
    </main>
  );
};

export default ReportViewer;
