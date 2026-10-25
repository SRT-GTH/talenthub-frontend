import { useCallback } from 'react';
import { useAgencyState } from '../../components/sections/agency/agencyState.js';
import { AGENCY_REPORT_PAGE_COUNT } from '../../components/sections/agency/report/data/reportData.js';
import AgencyReportViewer from '../../components/sections/agency/report/AgencyReportViewer.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AgencyReportPage');

/*
 * AgencyReportPage — /agency/report?page=1…8 (Figma 11.4.4i–p v2): the 8-page A4 landscape agency report "Youth skills and outcomes Q3 2026".
 * No agency chrome: the page is the document. Print = all eight pages. The v1 PDF frames 11.4.4f / g are superseded and not built.
 * URL keys: page (1-based, clamped) · print=1 (open the print dialog on load: the briefing download hands over to it).
 */

const clampPage = (raw) => {
  const n = Number.parseInt(raw ?? '1', 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(AGENCY_REPORT_PAGE_COUNT, Math.max(1, n));
};

const AgencyReportPage = () => {
  const data = useAgencyState();
  const page = clampPage(data.params.get('page'));
  log('render', { page });
  const { update } = data;
  const onPage = useCallback((n) => update({ page: n }, { replace: true }), [update]);
  return (
    <AgencyReportViewer page={page} onPage={onPage} autoPrint={data.params.get('print') === '1'} />
  );
};

export default AgencyReportPage;
