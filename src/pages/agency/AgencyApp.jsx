import { lazy, Suspense } from 'react';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';

/*
 * AgencyApp — the router of the Theme 11 agency portal (Figma canvas 8605:395409), mounted by App.jsx as /agency/* outside MainLayout.
 * Mock signed-in session only (⚠️ ASSUMPTION: no real auth; see useAgencySession). Every page is a lazy module in this folder; the work
 * packages replace the stubs and add NO route to App.jsx (only here, by the foundation / lead). URL contract: agencyState.js + wiki/agency.md.
 *
 *   /agency                                 11.4.0   home (A)           /agency/welcome  → /agency?modal=welcome (11.4.1e) ; ?tour=1|2|3 (11.4.1f-h)
 *   /agency/sign-up  /agency/mou  /agency/mou/status        11.4.1 sign-up, MoU upload, MoU status (A)
 *   /agency/national                        11.4.2a-j + 11.4.6 national data (B)
 *   /agency/regions[/:regionId[/districts/:districtId]]  /agency/compare  /agency/outcomes[/stories/:storyId]  /agency/trends  /agency/methodology   (B)
 *   /agency/demand                          11.4.5 demand & outcomes ?view=skills|trends|success (B)
 *   /agency/data-requests[/new|/:requestId]  11.4.3 (D)    /agency/briefing  11.4.4a-h (D)    /agency/report  11.4.4i-p v2 A4 print, no chrome (D)
 *   /agency/queries[/saved]                 11.5.1 (C)    /agency/programmes[/new|/:programmeId[/applicants]]  11.5.2 (C)    /agency/applicants  /agency/districts (C)
 *   /agency/settings[/:tab]                 11.6.1a-h (E)    /agency/public-page  11.6.1i (E)    profile menu = ?modal=profile (11.6.0b, E)
 *   /agency/*                               not-found
 */

const AgencyHomePage = lazy(() => import('./AgencyHomePage.jsx'));
const AgencySignUpPage = lazy(() => import('./AgencySignUpPage.jsx'));
const AgencyMouPage = lazy(() => import('./AgencyMouPage.jsx'));
const AgencyMouStatusPage = lazy(() => import('./AgencyMouStatusPage.jsx'));
const AgencyNationalPage = lazy(() => import('./AgencyNationalPage.jsx'));
const AgencyRegionsPage = lazy(() => import('./AgencyRegionsPage.jsx'));
const AgencyComparePage = lazy(() => import('./AgencyComparePage.jsx'));
const AgencyOutcomesPage = lazy(() => import('./AgencyOutcomesPage.jsx'));
const AgencyTrendsPage = lazy(() => import('./AgencyTrendsPage.jsx'));
const AgencyMethodologyPage = lazy(() => import('./AgencyMethodologyPage.jsx'));
const AgencyDemandPage = lazy(() => import('./AgencyDemandPage.jsx'));
const AgencyDataRequestsPage = lazy(() => import('./AgencyDataRequestsPage.jsx'));
const AgencyBriefingPage = lazy(() => import('./AgencyBriefingPage.jsx'));
const AgencyReportPage = lazy(() => import('./AgencyReportPage.jsx'));
const AgencyQueriesPage = lazy(() => import('./AgencyQueriesPage.jsx'));
const AgencyProgrammesPage = lazy(() => import('./AgencyProgrammesPage.jsx'));
const AgencyApplicantsPage = lazy(() => import('./AgencyApplicantsPage.jsx'));
const AgencyDistrictsPage = lazy(() => import('./AgencyDistrictsPage.jsx'));
const AgencySettingsPage = lazy(() => import('./AgencySettingsPage.jsx'));
const AgencyPublicPage = lazy(() => import('./AgencyPublicPage.jsx'));
const AgencyNotFoundPage = lazy(() => import('./AgencyNotFoundPage.jsx'));

const Fallback = () => <PageLoader look="focused" />;

const AgencyApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<AgencyHomePage />} />
      <Route path="welcome" element={<Navigate to="/agency?modal=welcome" replace />} />
      <Route path="sign-up" element={<AgencySignUpPage />} />
      <Route path="mou" element={<AgencyMouPage />} />
      <Route path="mou/status" element={<AgencyMouStatusPage />} />
      <Route path="national" element={<AgencyNationalPage />} />
      <Route path="regions" element={<Navigate to="greater-accra" replace />} />
      <Route path="regions/:regionId" element={<AgencyRegionsPage />} />
      <Route path="regions/:regionId/districts/:districtId" element={<AgencyRegionsPage />} />
      <Route path="compare" element={<AgencyComparePage />} />
      <Route path="outcomes" element={<AgencyOutcomesPage />} />
      <Route path="outcomes/stories/:storyId" element={<AgencyOutcomesPage />} />
      <Route path="trends" element={<AgencyTrendsPage />} />
      <Route path="methodology" element={<AgencyMethodologyPage />} />
      <Route path="demand" element={<AgencyDemandPage />} />
      <Route path="data-requests" element={<AgencyDataRequestsPage />} />
      <Route path="data-requests/new" element={<AgencyDataRequestsPage />} />
      <Route path="data-requests/:requestId" element={<AgencyDataRequestsPage />} />
      <Route path="briefing" element={<AgencyBriefingPage />} />
      <Route path="report" element={<AgencyReportPage />} />
      <Route path="queries" element={<AgencyQueriesPage />} />
      <Route path="queries/saved" element={<AgencyQueriesPage />} />
      <Route path="programmes" element={<AgencyProgrammesPage />} />
      <Route path="programmes/new" element={<AgencyProgrammesPage />} />
      <Route path="programmes/:programmeId" element={<AgencyProgrammesPage />} />
      <Route path="programmes/:programmeId/applicants" element={<AgencyProgrammesPage />} />
      <Route path="applicants" element={<AgencyApplicantsPage />} />
      <Route path="districts" element={<AgencyDistrictsPage />} />
      <Route path="settings" element={<AgencySettingsPage />} />
      <Route path="settings/:tab" element={<AgencySettingsPage />} />
      <Route path="public-page" element={<AgencyPublicPage />} />
      <Route path="*" element={<AgencyNotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AgencyApp;
