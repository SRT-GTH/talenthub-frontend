import { useCallback } from 'react';
import { useInstitutionState } from '../../components/sections/institution/institutionState.js';
import { INSTITUTION_REPORT_PAGE_COUNT } from '../../components/sections/institution/report/data/institutionReportData.js';
import InstitutionReportViewer from '../../components/sections/institution/report/InstitutionReportViewer.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('InstitutionReportPage');

/*
 * InstitutionReportPage — /institution/report?page=1…8 (Figma 11.3.5 v2, 8914:100 … 8914:452): the 8-page A4 landscape "Board of Governors report ·
 * Term 1, 2026/27" of Savannah Hills SHS. No institution chrome: the page is the document. Print = all eight pages. The v1 PDF cover 11.3.2f is
 * superseded and not built.
 * URL keys: page (1-based, clamped) · print=1 (open the print dialog on load: "Download outcomes report" 11.3.2e hands over to it).
 */

const clampPage = (raw) => {
  const n = Number.parseInt(raw ?? '1', 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(INSTITUTION_REPORT_PAGE_COUNT, Math.max(1, n));
};

const InstitutionReportPage = () => {
  const data = useInstitutionState();
  const page = clampPage(data.params.get('page'));
  log('render', { page });
  const { update } = data;
  const onPage = useCallback((n) => update({ page: n }, { replace: true }), [update]);
  return (
    <InstitutionReportViewer
      page={page}
      onPage={onPage}
      autoPrint={data.params.get('print') === '1'}
    />
  );
};

export default InstitutionReportPage;
