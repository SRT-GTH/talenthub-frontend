import { lazy, Suspense } from 'react';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';

/*
 * PublicDataApp — the router of the Theme 8 public dashboards (Figma canvas 8477:209484), mounted by App.jsx as /data/* outside MainLayout.
 * No sign-in, no talent shell, Focused style only. Every page is a lazy module in this folder; the work packages replace the stubs
 * and add NO route to App.jsx (only here). URL contract: components/sections/publicData/publicDataState.js and wiki/public-data.md.
 *
 *   /data                                   8.1.1  landing
 *   /data/overview                          8.2    national overview (filters, map)
 *   /data/regions[/:regionId[/districts/:districtId]]   8.3  region + district       /data/compare   8.3.3
 *   /data/showcase[/:profileId]             8.4    talent showcase
 *   /data/outcomes[/stories/:storyId]       8.5.1  outcomes + case study             /data/outcomes/trends  8.5.2
 *   /data/partners[/:partnerId]  /data/opportunities[/:opportunityId]               8.6
 *   /data/methodology                       8.7
 *   /data/report                            8.8.1 v2 A4 landscape report (print)
 *   /data/digest/unsubscribed               8.8.3f
 *   /data/error  /data/maintenance  /data/*   8.9.3  500 / maintenance / 404
 * Share, Download PDF and the digest are modals (?modal=share|download|digest) mounted by the pages that draw them.
 */

const PublicLandingPage = lazy(() => import('./PublicLandingPage.jsx'));
const PublicOverviewPage = lazy(() => import('./PublicOverviewPage.jsx'));
const PublicRegionsPage = lazy(() => import('./PublicRegionsPage.jsx'));
const PublicComparePage = lazy(() => import('./PublicComparePage.jsx'));
const PublicShowcasePage = lazy(() => import('./PublicShowcasePage.jsx'));
const PublicOutcomesPage = lazy(() => import('./PublicOutcomesPage.jsx'));
const PublicTrendsPage = lazy(() => import('./PublicTrendsPage.jsx'));
const PublicPartnersPage = lazy(() => import('./PublicPartnersPage.jsx'));
const PublicOpportunitiesPage = lazy(() => import('./PublicOpportunitiesPage.jsx'));
const PublicMethodologyPage = lazy(() => import('./PublicMethodologyPage.jsx'));
const PublicReportPage = lazy(() => import('./PublicReportPage.jsx'));
const PublicDigestUnsubscribedPage = lazy(() => import('./PublicDigestUnsubscribedPage.jsx'));
const PublicStatusPage = lazy(() => import('./PublicStatusPage.jsx'));
// Dev-only gallery of the shared primitives (never part of the production routes).
const PublicUiGalleryPage = import.meta.env.DEV
  ? lazy(() => import('./PublicUiGalleryPage.jsx'))
  : null;

const Fallback = () => <PageLoader />;

const PublicDataApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<PublicLandingPage />} />
      <Route path="overview" element={<PublicOverviewPage />} />
      {/* 8.3.1a opens on Greater Accra: the regions index has no screen of its own */}
      <Route path="regions" element={<Navigate to="greater-accra" replace />} />
      <Route path="regions/:regionId" element={<PublicRegionsPage />} />
      <Route path="regions/:regionId/districts/:districtId" element={<PublicRegionsPage />} />
      <Route path="compare" element={<PublicComparePage />} />
      <Route path="showcase" element={<PublicShowcasePage />} />
      <Route path="showcase/:profileId" element={<PublicShowcasePage />} />
      <Route path="outcomes" element={<PublicOutcomesPage />} />
      <Route path="outcomes/stories/:storyId" element={<PublicOutcomesPage />} />
      <Route path="outcomes/trends" element={<PublicTrendsPage />} />
      <Route path="partners" element={<PublicPartnersPage />} />
      <Route path="partners/:partnerId" element={<PublicPartnersPage />} />
      <Route path="opportunities" element={<PublicOpportunitiesPage />} />
      <Route path="opportunities/:opportunityId" element={<PublicOpportunitiesPage />} />
      <Route path="methodology" element={<PublicMethodologyPage />} />
      <Route path="report" element={<PublicReportPage />} />
      <Route path="digest/unsubscribed" element={<PublicDigestUnsubscribedPage />} />
      {PublicUiGalleryPage ? <Route path="_ui" element={<PublicUiGalleryPage />} /> : null}
      <Route path="error" element={<PublicStatusPage kind="500" />} />
      <Route path="maintenance" element={<PublicStatusPage kind="maintenance" />} />
      <Route path="*" element={<PublicStatusPage kind="404" />} />
    </Routes>
  </Suspense>
);

export default PublicDataApp;
