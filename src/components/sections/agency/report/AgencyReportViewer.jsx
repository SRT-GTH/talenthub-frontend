import { useEffect, useMemo } from 'react';
import { debug } from '../../../../utils/debug.js';
import { agencyHome, agencyReport } from '../../../../services/agency.api.js';
import { useAgencyResource } from '../useAgencyResource.js';
import { ReportContext } from './reportContext.js';
import Button from '../../../ui/Button.jsx';
import FitToWidth from '../../publicData/share/FitToWidth.jsx';
import '../../publicData/share/publicPrint.css';
import { REPORT_H, REPORT_W } from '../../publicData/share/report/reportLayout.js';
import AgencyReportDocument from './AgencyReportDocument.jsx';
import { AGENCY_REPORT_PAGE_COUNT, buildReport } from './data/reportData.js';

const log = debug('AgencyReportViewer');

/*
 * AgencyReportViewer — on-screen stage of /agency/report (Figma 11.4.4i–p v2, 8 pages, A4 landscape, no agency chrome). One page at a time at
 * 1123×794 (scaled down on narrow screens); ← / → and the two buttons change the page (?page=1…8); "Print" opens the browser print dialog with
 * all eight pages, one per A4 landscape sheet ("Save as PDF"). The figures are live: GET /agency/report (+ GET /agency/home for the map), built
 * each time the page opens; the view is logged in the agency audit log. ⚠️ ASSUMPTION: the controls under the page are
 * not drawn in Figma; they follow the Theme 8 report viewer and are hidden when printing. ?print=1 opens the print dialog on load. Props: page, onPage(n), autoPrint.
 */

const AgencyReportViewer = ({ page, onPage, autoPrint = false }) => {
  const res = useAgencyResource(
    () => Promise.all([agencyReport(), agencyHome().catch(() => null)]),
    []
  );
  const report = useMemo(
    () => (res.data ? buildReport(res.data[0], res.data[1]?.national?.regionCounts ?? []) : null),
    [res.data]
  );

  useEffect(() => {
    if (!autoPrint || !report) return undefined;
    log('auto print');
    const timer = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(timer);
  }, [autoPrint, report]);

  useEffect(() => {
    log('mount', { page });
    const onKey = (event) => {
      if (event.target.closest?.('input,textarea,select')) return;
      if (event.key === 'ArrowLeft' && page > 1) onPage(page - 1);
      if (event.key === 'ArrowRight' && page < AGENCY_REPORT_PAGE_COUNT) onPage(page + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, onPage]);

  if (!report) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-[12px] bg-[#ecece7] px-[16px] font-sans">
        {res.error ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            Could not build the report. {res.error?.response?.data?.message || res.error.message}{' '}
            <button
              type="button"
              onClick={res.reload}
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
            >
              Try again
            </button>
          </p>
        ) : (
          <p className="m-0 text-[14px] text-[#575755]" aria-busy="true">
            Building your report from the live figures…
          </p>
        )}
      </main>
    );
  }

  return (
    <ReportContext.Provider value={report}>
      <main
        data-report-stage=""
        className="flex min-h-dvh flex-col items-center bg-[#ecece7] font-sans"
      >
        <h1 className="sr-only">
          Agency report, {res.data[0].title}, page {page} of {AGENCY_REPORT_PAGE_COUNT}
        </h1>
        <div className="w-full max-w-[1123px]">
          <FitToWidth width={REPORT_W} height={REPORT_H}>
            <AgencyReportDocument current={page} />
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
            {page} / {AGENCY_REPORT_PAGE_COUNT}
          </span>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            disabled={page >= AGENCY_REPORT_PAGE_COUNT}
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
    </ReportContext.Provider>
  );
};

export default AgencyReportViewer;
