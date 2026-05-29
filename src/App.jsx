import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GetStartedPage from './pages/GetStartedPage.jsx';
import OnboardingWelcomePage from './pages/onboarding/OnboardingWelcomePage.jsx';
import OnboardingDobPage from './pages/onboarding/OnboardingDobPage.jsx';
import OnboardingPersonalInfoPage from './pages/onboarding/OnboardingPersonalInfoPage.jsx';
import OnboardingContactPage from './pages/onboarding/OnboardingContactPage.jsx';
import OnboardingAddressPage from './pages/onboarding/OnboardingAddressPage.jsx';
import OnboardingEducationPage from './pages/onboarding/OnboardingEducationPage.jsx';
import OnboardingParentInfoPage from './pages/onboarding/OnboardingParentInfoPage.jsx';
import OnboardingReviewPage from './pages/onboarding/OnboardingReviewPage.jsx';
import ProfileEngagementPage from './pages/engagement/ProfileEngagementPage.jsx';
import IdentityMapPage from './pages/engagement/IdentityMapPage.jsx';
import MilestoneUnlockPage from './pages/engagement/MilestoneUnlockPage.jsx';
import Top20MilestonePage from './pages/engagement/Top20MilestonePage.jsx';
import TopTalentMilestonePage from './pages/engagement/TopTalentMilestonePage.jsx';
import AvatarCustomiserPage from './pages/engagement/AvatarCustomiserPage.jsx';
import AvatarSkinTonePage from './pages/engagement/AvatarSkinTonePage.jsx';
import AvatarHairPage from './pages/engagement/AvatarHairPage.jsx';
import AvatarExtrasPage from './pages/engagement/AvatarExtrasPage.jsx';
import AvatarOutfitPage from './pages/engagement/AvatarOutfitPage.jsx';
import AvatarFlowLayout from './layout/AvatarFlowLayout.jsx';
import ScrollToTop from './components/ui/ScrollToTop.jsx';
import { OnboardingProvider } from './providers/OnboardingProvider.jsx';
function App() {
  return (
    <BrowserRouter>
      {/* Reset window scroll on every route change so each new page
          starts at the top instead of inheriting the previous scroll. */}
      <ScrollToTop />
      <Routes>
        {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
        <Route element={<MainLayout />}>
          <Route path={'/'} element={<LandingPage />} />
          <Route path={'/login'} element={<LoginPage />} />
          <Route path={'/get-started'} element={<GetStartedPage />} />

          {/* Talent onboarding flow. Wrapped in OnboardingProvider so DOB
              captured on step 01 propagates to every downstream page (drives
              the Parent step in the breadcrumb + the under-18 branch out of
              the Education page). */}
          <Route
            path="/onboarding/talent/*"
            element={
              <OnboardingProvider>
                <Routes>
                  <Route path="welcome" element={<OnboardingWelcomePage />} />
                  <Route path="dob" element={<OnboardingDobPage />} />
                  <Route path="personal-info" element={<OnboardingPersonalInfoPage />} />
                  <Route path="contact" element={<OnboardingContactPage />} />
                  <Route path="address" element={<OnboardingAddressPage />} />
                  <Route path="education" element={<OnboardingEducationPage />} />
                  <Route path="parent-info" element={<OnboardingParentInfoPage />} />
                  <Route path="review" element={<OnboardingReviewPage />} />
                </Routes>
              </OnboardingProvider>
            }
          />

          {/* /components hosts the design-system playground (HomePage). */}
          <Route path={'/components'} element={<HomePage />} />
        </Route>

        {/* Profile engagement owns its own top/bottom chrome — mounted outside MainLayout. */}
        <Route path={'/profile/engagement'} element={<ProfileEngagementPage />} />
        <Route path={'/profile/engagement/identity'} element={<IdentityMapPage />} />
        <Route path={'/profile/engagement/milestone'} element={<MilestoneUnlockPage />} />
        <Route path={'/profile/engagement/milestone/top-20'} element={<Top20MilestonePage />} />
        <Route
          path={'/profile/engagement/milestone/top-talent'}
          element={<TopTalentMilestonePage />}
        />
        {/* All 5 avatar steps share one AvatarSelectionProvider so the
            user's picks survive navigation between Style → Skin → Hair →
            Extras → Outfit. Without this layout, the provider would
            re-mount per page and selections would reset. */}
        <Route element={<AvatarFlowLayout />}>
          <Route path={'/profile/engagement/avatar'} element={<AvatarCustomiserPage />} />
          <Route path={'/profile/engagement/avatar/skin'} element={<AvatarSkinTonePage />} />
          <Route path={'/profile/engagement/avatar/hair'} element={<AvatarHairPage />} />
          <Route path={'/profile/engagement/avatar/extras'} element={<AvatarExtrasPage />} />
          <Route path={'/profile/engagement/avatar/outfit'} element={<AvatarOutfitPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
