import { lazy, Suspense } from 'react';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { readStaffSession } from '../../services/adminSession.js';

/*
 * AdminApp — the router of the Theme 7 Platform Admin (GTH staff back office, Figma canvas 8520:12), mounted by App.jsx as /admin/*
 * outside MainLayout. Real staff sign-in: every route except /admin/sign-in needs a staff session (RequireStaff, services/adminSession.js);
 * the role comes from the account, not the URL. Every page is a lazy module in this folder. URL contract: adminState.js + wiki/admin.md.
 *
 *   /admin/sign-in                         7.0.1a-d staff sign-in (?state=code|locked|expired)
 *   /admin                                 7.0.2a-e staff home, one per role (?role=support|moderator|senior|super|dpo)
 *   /admin/accounts[/merge|/:accountId]    7.1 accounts
 *   /admin/moderation[/...]                7.2 moderation (flags, removed content, community posts, community reviews)
 *   /admin/verification[/...]              7.6 verification and approvals (+ data requests, appeals)
 *   /admin/reports[/...]                   7.3.1-2 reports and external exports       /admin/live-ops  7.3.3 live ops
 *   /admin/comms[/...]                     7.4 comms (+ message a user, bulk notification, templates)
 *   /admin/support[/:queryId]              7.7 support queries
 *   /admin/staff  /admin/settings[/...]    7.5.1-2 staff accounts, roles, feature flags and integrations
 *   /admin/audit-log[/:eventId]            7.5.3 audit log
 *   /admin/report                          7.3.1d v2 A4 report pages (no chrome)
 *   /admin/*                               not-found
 */

const AdminHomePage = lazy(() => import('./AdminHomePage.jsx'));
const AdminSignInPage = lazy(() => import('./AdminSignInPage.jsx'));
const AdminAccountsPage = lazy(() => import('./AdminAccountsPage.jsx'));
const AdminModerationPage = lazy(() => import('./AdminModerationPage.jsx'));
const AdminVerificationPage = lazy(() => import('./AdminVerificationPage.jsx'));
const AdminReportsPage = lazy(() => import('./AdminReportsPage.jsx'));
const AdminLiveOpsPage = lazy(() => import('./AdminLiveOpsPage.jsx'));
const AdminObservabilityPage = lazy(() => import('./AdminObservabilityPage.jsx'));
const AdminCommsPage = lazy(() => import('./AdminCommsPage.jsx'));
const AdminSupportPage = lazy(() => import('./AdminSupportPage.jsx'));
const AdminSettingsPage = lazy(() => import('./AdminSettingsPage.jsx'));
const AdminAuditPage = lazy(() => import('./AdminAuditPage.jsx'));
const AdminReportPrintPage = lazy(() => import('./AdminReportPrintPage.jsx'));
const AdminNotFoundPage = lazy(() => import('./AdminNotFoundPage.jsx'));

const Fallback = () => <PageLoader look="focused" />;

/** Sends anyone without a staff session to the sign-in, remembering where they were going. */
const RequireStaff = () => {
  const { pathname, search } = useLocation();
  if (readStaffSession()) return <Outlet />;
  const next = encodeURIComponent(`${pathname}${search}`);
  return <Navigate to={`/admin/sign-in?next=${next}`} replace />;
};

const AdminApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route path="sign-in" element={<AdminSignInPage />} />
      <Route element={<RequireStaff />}>
      <Route index element={<AdminHomePage />} />
      <Route path="accounts" element={<AdminAccountsPage />} />
      <Route path="accounts/merge" element={<AdminAccountsPage />} />
      <Route path="accounts/:accountId" element={<AdminAccountsPage />} />
      <Route path="moderation/*" element={<AdminModerationPage />} />
      <Route path="verification/*" element={<AdminVerificationPage />} />
      <Route path="reports/*" element={<AdminReportsPage />} />
      <Route path="live-ops" element={<AdminLiveOpsPage />} />
          <Route path="observability" element={<AdminObservabilityPage />} />
      <Route path="comms/*" element={<AdminCommsPage />} />
      <Route path="support" element={<AdminSupportPage />} />
      <Route path="support/:queryId" element={<AdminSupportPage />} />
      <Route path="staff" element={<Navigate to="/admin/settings/staff" replace />} />
      <Route path="settings" element={<AdminSettingsPage />} />
      <Route path="settings/:tab" element={<AdminSettingsPage />} />
      <Route path="audit-log" element={<AdminAuditPage />} />
      <Route path="audit-log/:eventId" element={<AdminAuditPage />} />
      <Route path="report" element={<AdminReportPrintPage />} />
      <Route path="*" element={<AdminNotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AdminApp;
