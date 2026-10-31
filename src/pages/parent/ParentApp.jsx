import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';

const ParentHomePage = lazy(() => import('./ParentHomePage.jsx'));
const ParentWardsPage = lazy(() => import('./ParentWardsPage.jsx'));
const ParentWardPage = lazy(() => import('./ParentWardPage.jsx'));
const ParentEvaluatePage = lazy(() => import('./ParentEvaluatePage.jsx'));
const ParentEvaluateQuestionPage = lazy(() => import('./ParentEvaluateQuestionPage.jsx'));
const ParentEvaluateResultPage = lazy(() => import('./ParentEvaluateResultPage.jsx'));
// Flags and corrections canvas (Figma 10057:604): the Profile and Flags tabs live on ParentWardPage (?tab=profile | flags); /profile and /flags redirect there. To review is its own page.
const ParentWardTabRedirect = lazy(() => import('./ParentWardTabRedirect.jsx'));
const ParentReviewPage = lazy(() => import('./ParentReviewPage.jsx'));
// Link a ward canvas (Figma 10057:1093): search, link code, request sent, 100+ children dialog.
const ParentLinkWardPage = lazy(() => import('./ParentLinkWardPage.jsx'));
// Help and guides (drawn behind the report dialogs of the Opt out and restore canvas, Figma 10057:1302).
const ParentHelpPage = lazy(() => import('./ParentHelpPage.jsx'));
// Notifications and milestones canvas (Figma 10057:67396): the page (PN-04) and a milestone shared with the parent (PN-03 / PN-03b).
const ParentNotificationsPage = lazy(() => import('./ParentNotificationsPage.jsx'));
const ParentMilestonePage = lazy(() => import('./ParentMilestonePage.jsx'));
const ParentSettingsPage = lazy(() => import('./ParentSettingsPage.jsx'));
const ParentHelpArticlePage = lazy(() => import('./ParentHelpArticlePage.jsx'));
// Ward wallets canvas (Figma 10057:66889): the wallets page with approve, decline, limits, top-up and open-wallet dialogs.
const ParentWalletsPage = lazy(() => import('./ParentWalletsPage.jsx'));
// Messages (top bar): the parent's conversations with their wards (not drawn in Figma).
const ParentMessagesPage = lazy(() => import('./ParentMessagesPage.jsx'));

/*
 * ParentApp — the /parent/* router (Theme: Parents, Figma file SCXc457vwiq6o7d9g4jVbh). Outside MainLayout, like /admin and /agency; the chrome is ParentFrame.
 * Built so far: /parent (home, 7 states), /parent/wards (PW-01), /parent/wards/:wardId (ward page, tabs, dialogs). The other sidebar pages (My wards, To review, Evaluate, Ward wallets, Notifications, Settings, Help) are later canvases: they land on a short
 * "not designed yet" note inside the chrome so the nav never dead-ends. Mock session: Emma Mensah, no auth gate yet.
 */
const Fallback = () => <PageLoader look="focused" />;

const NotBuilt = () => {
  const { pathname } = useLocation();
  const name = pathname.replace('/parent/', '').replace(/-/g, ' ');
  return (
    <ParentFrame>
      <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[8px]">
        <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] capitalize">
          {name}
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999]">
          This screen is not designed yet. It arrives with the next parent canvas.
        </p>
      </div>
    </ParentFrame>
  );
};

const ParentApp = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      <Route index element={<ParentHomePage />} />
      <Route path="wards" element={<ParentWardsPage />} />
      <Route path="wards/:wardId" element={<ParentWardPage />} />
      <Route path="wards/:wardId/profile" element={<ParentWardTabRedirect tab="profile" />} />
      <Route path="wards/:wardId/flags" element={<ParentWardTabRedirect tab="flags" />} />
      <Route path="evaluate" element={<ParentEvaluatePage />} />
      <Route path="evaluate/questions" element={<ParentEvaluateQuestionPage />} />
      <Route path="evaluate/result" element={<ParentEvaluateResultPage />} />
      <Route path="review" element={<ParentReviewPage />} />
      <Route path="link-ward" element={<ParentLinkWardPage />} />
      <Route path="wallets" element={<ParentWalletsPage />} />
      <Route path="help" element={<ParentHelpPage />} />
      <Route path="notifications" element={<ParentNotificationsPage />} />
      <Route path="notifications/milestone" element={<ParentMilestonePage />} />
      <Route path="settings" element={<ParentSettingsPage />} />
      <Route path="messages" element={<ParentMessagesPage />} />
      <Route path="help/:topicId" element={<ParentHelpArticlePage />} />
      <Route path="*" element={<NotBuilt />} />
    </Routes>
  </Suspense>
);

export default ParentApp;
