import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { apiMessage, institutionReport } from '../../../../services/institutionPortal.api.js';
import Button from '../../../ui/Button.jsx';
import FitToWidth from '../../publicData/share/FitToWidth.jsx';
import '../../publicData/share/publicPrint.css';
import { REPORT_H, REPORT_W } from '../../publicData/share/report/reportLayout.js';
import InstitutionReportDocument from './InstitutionReportDocument.jsx';
import { InstitutionReportContext } from './reportContext.js';
import { INSTITUTION_REPORT_PAGE_COUNT, buildReport } from './data/institutionReportData.js';

const log = debug('InstitutionReportViewer');

/*
 * InstitutionReportViewer — on-screen stage of /institution/report (Figma 11.3.5 v2, 8 pages, A4 landscape, no institution chrome). One page at a time at
 * 1123×794 (scaled down on narrow screens); ← / → and the two buttons change the page (?page=1…8); "Print" opens the browser print dialog with
 * all eight pages, one per A4 landscape sheet ("Save as PDF"). The figures are live: GET /institution/report, built each time the page opens;
 * the view is logged in the school's audit log. ⚠️ ASSUMPTION: the controls under the page are not drawn in Figma; they follow the Theme 8
 * report viewer and are hidden when printing. "Back to the portal" returns to Class outcomes. ?print=1 opens the print dialog once the
 * figures are in. Props: page, onPage(n), autoPrint.
 */

const InstitutionReportViewer = ({ page, onPage, autoPrint = false }) => {
  const [api, setApi] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    setApi(null);
    institutionReport()
      .then((data) => {
        log('loaded', { generatedAt: data?.generatedAt });
        setApi(data);
      })
      .catch((err) => setError(apiMessage(err)));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const report = useMemo(() => (api ? buildReport(api) : null), [api]);

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
      if (event.key === 'ArrowRight' && page < INSTITUTION_REPORT_PAGE_COUNT) onPage(page + 1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [page, onPage]);

  if (!report) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-[12px] bg-[#ecece7] px-[16px] font-sans">
        {error ? (
          <p role="alert" className="m-0 text-[14px] leading-[20px] text-[#902b20]">
            Could not build the report. {error}{' '}
            <button
              type="button"
              onClick={load}
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
        <Link
          to="/institution/progress/class-outcomes"
          className="font-sans text-[13px] font-semibold text-[#387440]"
        >
          Back to the portal
        </Link>
      </main>
    );
  }

  return (
    <InstitutionReportContext.Provider value={report}>
      <main
        data-report-stage=""
        className="flex min-h-dvh flex-col items-center bg-[#ecece7] font-sans"
      >
        <h1 className="sr-only">
          {report.TITLE}, page {page} of {INSTITUTION_REPORT_PAGE_COUNT}
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
          <Link
            to="/institution/progress/class-outcomes"
            className="mr-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#387440]"
          >
            ← Back to the portal
          </Link>
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
    </InstitutionReportContext.Provider>
  );
};

export default InstitutionReportViewer;
