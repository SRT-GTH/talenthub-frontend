import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AdminFrame from '../../components/sections/admin/AdminFrame.jsx';
import { useAdminState } from '../../components/sections/admin/adminState.js';
import AdminConfirmDialog from '../../components/sections/admin/ui/AdminConfirmDialog.jsx';
import AdminHealthReport from '../../components/sections/admin/reports/AdminHealthReport.jsx';
import AdminReportsOverview from '../../components/sections/admin/reports/AdminReportsOverview.jsx';
import { BLOCKED } from '../../components/sections/admin/reports/data/adminReportsData.js';
import ExportReadyDialog from '../../components/sections/admin/reports/ExportReadyDialog.jsx';
import {
  BuildingReportDialog,
  ChooseReportDialog,
  ExportRequestDialog,
} from '../../components/sections/admin/reports/ReportDialogs.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('AdminReportsPage');

/*
 * AdminReportsPage — /admin/reports/* (Figma 7.3.1-7.3.2). Routes and URL states (shared keys in adminState.js):
 *   /admin/reports                         the national overview with a "Generate report" action (the page behind 7.3.1b / 7.3.1c)
 *     ?modal=choose                        "Choose a report" (7.3.1b)    ?modal=building   "Building this report in the background" (7.3.1c)
 *   /admin/reports/health                  Platform health report (7.3.1a)
 *     ?modal=export (?role=super)          "For a formal request from an authorised organisation" (7.3.2a)
 *     ?modal=blocked                       "Identifiable export blocked" (7.3.2b)      ?modal=ready   "Export ready" (7.3.2c)
 *   /admin/reports?view=exports            the DPO / Super Admin home links land on the health report with the export request open
 * Real flow (⚠️ ASSUMPTION: mock only): Generate report → Platform health opens the health report, Trust & Safety / Verification queue the background build; the export request
 * with "Identifiable" is blocked, any other level goes straight to "Export ready" (the approval is not simulated).
 */

const AdminReportsPage = () => {
  const data = useAdminState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/reports\/?/, '');
  const modal = data.modal;

  useEffect(() => {
    log('mount', { sub, modal });
  }, [sub, modal]);

  const close = () => data.update({ modal: null });

  if (!sub && data.view === 'exports') {
    return <Navigate to="/admin/reports/health?modal=export" replace />;
  }

  if (sub === 'health') {
    return (
      <AdminFrame data={data} title="Platform health report">
        <AdminHealthReport onDownload={() => log('download PDF (no file in the mock)')} />
        {modal === 'export' ? (
          <ExportRequestDialog
            onClose={close}
            onSubmit={({ level }) =>
              data.update({ modal: level === 'Identifiable' ? 'blocked' : 'ready' })
            }
          />
        ) : null}
        {modal === 'blocked' ? (
          <AdminConfirmDialog
            title={BLOCKED.title}
            body={BLOCKED.body}
            primary={{ label: BLOCKED.primary, tone: 'red' }}
            secondary={BLOCKED.secondary}
            onPrimary={() => data.update({ modal: 'export' })}
            onClose={close}
          />
        ) : null}
        {modal === 'ready' ? (
          <ExportReadyDialog
            onBack={() => navigate('/admin/reports')}
            onDownload={() => {
              log('download CSV (no file in the mock)');
              close();
            }}
          />
        ) : null}
      </AdminFrame>
    );
  }

  return (
    <AdminFrame data={data} title="Reports">
      <AdminReportsOverview onGenerate={() => data.update({ modal: 'choose' })} />
      {modal === 'choose' ? (
        <ChooseReportDialog
          onClose={close}
          onGenerate={(id) =>
            id === 'health' ? navigate('/admin/reports/health') : data.update({ modal: 'building' })
          }
        />
      ) : null}
      {modal === 'building' ? <BuildingReportDialog onClose={close} /> : null}
    </AdminFrame>
  );
};

export default AdminReportsPage;
