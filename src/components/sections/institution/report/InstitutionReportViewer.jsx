import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import FitToWidth from '../../publicData/share/FitToWidth.jsx';
import '../../publicData/share/publicPrint.css';
import { REPORT_H, REPORT_W } from '../../publicData/share/report/reportLayout.js';
import InstitutionReportDocument from './InstitutionReportDocument.jsx';
import {
  INSTITUTION_REPORT_PAGE_COUNT,
  INSTITUTION_REPORT_TITLE,
} from './data/institutionReportData.js';

const log = debug('InstitutionReportViewer');

/*
 * InstitutionReportViewer — on-screen stage of /institution/report (Figma 11.3.5 v2, 8 pages, A4 landscape, no institution chrome). One page at a time at
 * 1123×794 (scaled down on narrow screens); ← / → and the two buttons change the page (?page=1…8); "Print" opens the browser print dialog with
 * all eight pages, one per A4 landscape sheet ("Save as PDF"; real PDF generation is MOCKED). ⚠️ ASSUMPTION: the controls under the page are
 * not drawn in Figma; they follow the Theme 8 report viewer and are hidden when printing. ?print=1 opens the print dialog on load. Props: page, onPage(n), autoPrint.
 */

const InstitutionReportViewer = ({ page, onPage, autoPrint = false }) => {
  useEffect(() => {
    if (!autoPrint) return undefined;
    log('auto print');
    const timer = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(timer);
  }, [autoPrint]);

  useEffect(() => {
    log('mount', { page });
    const onKey = (event) => {
      if (event.target.closest?.('input,textarea,select')) return;
      if (event.key === 'ArrowLeft' && page > 1) onPage(page - 1);
      if (event.key === 'ArrowRight' && page < INSTITUTION_REPORT_PAGE_COUNT) onPage(page + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, onPage]);

  return (
    <main
      data-report-stage=""
      className="flex min-h-dvh flex-col items-center bg-[#ecece7] font-sans"
    >
      <h1 className="sr-only">
        {INSTITUTION_REPORT_TITLE}, page {page} of {INSTITUTION_REPORT_PAGE_COUNT}
      </h1>
      <div className="w-full max-w-[1123px]">
        <FitToWidth width={REPORT_W} height={REPORT_H}>
          <InstitutionReportDocument current={page} />
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
          {page} / {INSTITUTION_REPORT_PAGE_COUNT}
        </span>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          disabled={page >= INSTITUTION_REPORT_PAGE_COUNT}
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

export default InstitutionReportViewer;
