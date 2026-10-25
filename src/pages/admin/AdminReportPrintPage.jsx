import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ContentsPage,
  CoverPage,
  MethodPage,
  OpenerPage,
} from '../../components/sections/admin/report/ReportFramePages.jsx';
import {
  FunnelPage,
  GrowthPage,
  SafetyPage,
  StoriesPage,
} from '../../components/sections/admin/report/ReportDataPages.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminReportPrintPage');

const PAGES = [
  CoverPage,
  ContentsPage,
  OpenerPage,
  GrowthPage,
  SafetyPage,
  FunnelPage,
  StoriesPage,
  MethodPage,
];

/*
 * AdminReportPrintPage — /admin/report (Figma 7.3.1 v2 "GTH Report kit", eight 1123 x 794 A4 landscape pages, no admin chrome).
 *   /admin/report            all eight pages stacked        /admin/report?page=4   one page (1-8)
 * The print rules below make every sheet exactly one landscape A4 page (Ctrl+P / "Download PDF"). ⚠️ ASSUMPTION: frontend only; the figures are the Figma copy and the
 * "Download PDF" button of the health report does not open this page (no link is drawn).
 */
const AdminReportPrintPage = () => {
  const [params] = useSearchParams();
  const raw = Number.parseInt(params.get('page') ?? '', 10);
  const page = raw >= 1 && raw <= PAGES.length ? raw : null;
  useEffect(() => {
    log('mount', { page: page ?? 'all' });
  }, [page]);
  const numbers = page ? [page] : PAGES.map((_, i) => i + 1);
  return (
    <main
      aria-label="Platform health report"
      className="min-h-screen bg-[#e9ece9] py-[24px] print:bg-white print:py-0"
    >
      <style>{`@page { size: 297mm 210mm; margin: 0 } @media print { .report-sheet { break-after: page; zoom: 0.9505 } }`}</style>
      <div className="mx-auto flex w-fit flex-col gap-[24px] print:gap-0">
        {numbers.map((n) => {
          const Sheet = PAGES[n - 1];
          return <Sheet key={n} />;
        })}
      </div>
    </main>
  );
};

export default AdminReportPrintPage;
