import { useCallback } from 'react';
import { usePublicDataState } from '../../components/sections/publicData/publicDataState.js';
import ReportViewer from '../../components/sections/publicData/share/report/ReportViewer.jsx';
import { REPORT_PAGE_COUNT } from '../../components/sections/publicData/share/data/shareData.js';
import { debug } from '../../utils/debug.js';

const log = debug('PublicReportPage');

/*
 * PublicReportPage — Figma 8.8.1 v2 report kit, route /data/report?page=1…8: the 8-page GTH report, A4 landscape.
 * No site chrome: the page is the document (cover, contents, section opener, four content pages, method and back cover). The page number
 * is the `page` query key; printing (the Print button or Ctrl/⌘ + P) prints all eight pages, one per A4 landscape sheet.
 * The v1 PDF frames (8503:9 / 8503:69 / 8503:551) are superseded and not built.
 */

const clampPage = (raw) => {
  const n = Number.parseInt(raw ?? '1', 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(REPORT_PAGE_COUNT, Math.max(1, n));
};

const PublicReportPage = () => {
  const data = usePublicDataState();
  const page = clampPage(data.params.get('page'));
  log('mount', { page });
  const { update } = data;
  const onPage = useCallback((n) => update({ page: n }, { replace: true }), [update]);
  return <ReportViewer page={page} onPage={onPage} />;
};

export default PublicReportPage;
