import { lazy, Suspense } from 'react';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { Route, Routes } from 'react-router-dom';

/*
 * InstitutionApp — the router of the Theme 11 institution portal (Figma canvas 8520:10), mounted by App.jsx as /institution/* outside MainLayout.
 * Mock signed-in session only (⚠️ ASSUMPTION: no real auth; see useInstitutionSession). Every page is a lazy module in this folder; the work
 * packages replace the stubs and add NO route to App.jsx (only here, by the foundation / lead). URL contract: institutionState.js + wiki/institution.md.
 *
 *   /institution                            11.2.1a-c home (B)   ?state=new = 11.2.1b · ?modal=welcome = 11.1.3a, ?tour=1|2|3 = 11.1.3b-d (overlay, A)
 *   /institution/sign-up                    11.1.1a-d + b2 sign-up (A)    ?state=filled|code-sent|wrong-code|already-registered|success
 *   /institution/accreditation              11.1.2a-a3 upload / list / submitted (A)    ?view=list|submitted
 *   /institution/accreditation/status       11.1.2b-e verification status (A)           ?verify=under-review|approved|needs-info|not-approved
 *   /institution/students[/new|/:studentId] 11.2.2a-l roster (B)         ?modal=add-student|upload|transfer|remove|consent ... ?filter=not-linked ?state=empty
 *   /institution/records[/:recordId]        11.2.3a-f record verification (C)
 *   /institution/credentials[/new|/:credentialId]  11.2.4a-h credentials (C)
 *   /institution/verify/:credentialId       11.2.4i,j PUBLIC "Verify a credential", no institution chrome (C)   ?state=valid|revoked
 *   /institution/programmes[/new|/:programmeId[/applicants]]   11.3.1 + 11.3.4 (D1)
 *   /institution/messages[/new|/:threadId]  11.3.3a-g (D1)
 *   /institution/progress[/students/:studentId|/class-outcomes]  11.3.2a-e (D2)
 *   /institution/report                     11.3.5 v2 A4 board report, no chrome (D2)   ?page=1-8
 *   /institution/settings[/:tab]            11.6.1a-g (E)     ?modal=invite|remove      profile menu = ?modal=profile (11.6.0a, E)
 *   /institution/public-page                11.6.1h (E)
 *   /institution/*                          not-found
 */

const InstitutionHomePage = lazy(() => import('./InstitutionHomePage.jsx'));
const InstitutionSignUpPage = lazy(() => import('./InstitutionSignUpPage.jsx'));
const InstitutionAccreditationPage = lazy(() => import('./InstitutionAccreditationPage.jsx'));
const InstitutionAccreditationStatusPage = lazy(
  () => import('./InstitutionAccreditationStatusPage.jsx')
);
const InstitutionStudentsPage = lazy(() => import('./InstitutionStudentsPage.jsx'));
const InstitutionRecordsPage = lazy(() => import('./InstitutionRecordsPage.jsx'));
const InstitutionCredentialsPage = lazy(() => import('./InstitutionCredentialsPage.jsx'));
const InstitutionVerifyPage = lazy(() => import('./InstitutionVerifyPage.jsx'));
const InstitutionProgrammesPage = lazy(() => import('./InstitutionProgrammesPage.jsx'));
const InstitutionMessagesPage = lazy(() => import('./InstitutionMessagesPage.jsx'));
const InstitutionProgressPage = lazy(() => import('./InstitutionProgressPage.jsx'));
const InstitutionReportPage = lazy(() => import('./InstitutionReportPage.jsx'));
const InstitutionSettingsPage = lazy(() => import('./InstitutionSettingsPage.jsx'));
const InstitutionPublicPage = lazy(() => import('./InstitutionPublicPage.jsx'));
const InstitutionNotFoundPage = lazy(() => import('./InstitutionNotFoundPage.jsx'));

const Fallback = () => <PageLoader look="focused" />;

const InstitutionApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<InstitutionHomePage />} />
      <Route path="sign-up" element={<InstitutionSignUpPage />} />
      <Route path="accreditation" element={<InstitutionAccreditationPage />} />
      <Route path="accreditation/status" element={<InstitutionAccreditationStatusPage />} />
      <Route path="students" element={<InstitutionStudentsPage />} />
      <Route path="students/new" element={<InstitutionStudentsPage />} />
      <Route path="students/:studentId" element={<InstitutionStudentsPage />} />
      <Route path="records" element={<InstitutionRecordsPage />} />
      <Route path="records/:recordId" element={<InstitutionRecordsPage />} />
      <Route path="credentials" element={<InstitutionCredentialsPage />} />
      <Route path="credentials/new" element={<InstitutionCredentialsPage />} />
      <Route path="credentials/:credentialId" element={<InstitutionCredentialsPage />} />
      <Route path="verify/:credentialId" element={<InstitutionVerifyPage />} />
      <Route path="programmes" element={<InstitutionProgrammesPage />} />
      <Route path="programmes/new" element={<InstitutionProgrammesPage />} />
      <Route path="programmes/:programmeId" element={<InstitutionProgrammesPage />} />
      <Route path="programmes/:programmeId/applicants" element={<InstitutionProgrammesPage />} />
      <Route path="messages" element={<InstitutionMessagesPage />} />
      <Route path="messages/new" element={<InstitutionMessagesPage />} />
      <Route path="messages/:threadId" element={<InstitutionMessagesPage />} />
      <Route path="progress" element={<InstitutionProgressPage />} />
      <Route path="progress/class-outcomes" element={<InstitutionProgressPage />} />
      <Route path="progress/students/:studentId" element={<InstitutionProgressPage />} />
      <Route path="report" element={<InstitutionReportPage />} />
      <Route path="settings" element={<InstitutionSettingsPage />} />
      <Route path="settings/:tab" element={<InstitutionSettingsPage />} />
      <Route path="public-page" element={<InstitutionPublicPage />} />
      <Route path="*" element={<InstitutionNotFoundPage />} />
    </Routes>
  </Suspense>
);

export default InstitutionApp;
