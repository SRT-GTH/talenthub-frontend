import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import MainLayout from './layout/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GetStartedPage from './pages/GetStartedPage.jsx';
import OnboardingWelcomePage from './pages/OnboardingWelcomePage.jsx';
import OnboardingDobPage from './pages/OnboardingDobPage.jsx';
import OnboardingPersonalInfoPage from './pages/OnboardingPersonalInfoPage.jsx';
import OnboardingContactPage from './pages/OnboardingContactPage.jsx';
import OnboardingAddressPage from './pages/OnboardingAddressPage.jsx';
import OnboardingEducationPage from './pages/OnboardingEducationPage.jsx';
import OnboardingParentInfoPage from './pages/OnboardingParentInfoPage.jsx';
import OnboardingReviewPage from './pages/OnboardingReviewPage.jsx';
import ProfileEngagementPage from './pages/ProfileEngagementPage.jsx';
import IdentityMapPage from './pages/IdentityMapPage.jsx';
import MilestoneUnlockPage from './pages/MilestoneUnlockPage.jsx';
import Top20MilestonePage from './pages/Top20MilestonePage.jsx';
import AvatarCustomiserPage from './pages/AvatarCustomiserPage.jsx';
import AvatarSkinTonePage from './pages/AvatarSkinTonePage.jsx';
import AvatarHairPage from './pages/AvatarHairPage.jsx';
import AvatarExtrasPage from './pages/AvatarExtrasPage.jsx';
import AvatarOutfitPage from './pages/AvatarOutfitPage.jsx';
import { OnboardingProvider } from './providers/OnboardingProvider.jsx';
import { ROUTES } from './constants/routes.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<LandingPage />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.getStarted} element={<GetStartedPage />} />

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

          {/* Legacy flat onboarding URLs — redirect to the namespaced talent
              flow so any in-progress sessions / external links keep working. */}
          <Route
            path="/onboarding/welcome"
            element={<Navigate to="/onboarding/talent/welcome" replace />}
          />
          <Route
            path="/onboarding/dob"
            element={<Navigate to="/onboarding/talent/dob" replace />}
          />
          <Route
            path="/onboarding/personal-info"
            element={<Navigate to="/onboarding/talent/personal-info" replace />}
          />
          <Route
            path="/onboarding/contact"
            element={<Navigate to="/onboarding/talent/contact" replace />}
          />
          <Route
            path="/onboarding/address"
            element={<Navigate to="/onboarding/talent/address" replace />}
          />
          <Route
            path="/onboarding/education"
            element={<Navigate to="/onboarding/talent/education" replace />}
          />
          <Route
            path="/onboarding/review"
            element={<Navigate to="/onboarding/talent/review" replace />}
          />

          {/* /components hosts the design-system playground (HomePage). */}
          <Route path={ROUTES.components} element={<HomePage />} />
        </Route>

        {/* Profile engagement owns its own top/bottom chrome — mounted outside MainLayout. */}
        <Route path={ROUTES.profileEngagement} element={<ProfileEngagementPage />} />
        <Route path={ROUTES.identityMap} element={<IdentityMapPage />} />
        <Route path={ROUTES.milestoneUnlock} element={<MilestoneUnlockPage />} />
        <Route path={ROUTES.top20Milestone} element={<Top20MilestonePage />} />
        <Route path={ROUTES.avatarCustomiser} element={<AvatarCustomiserPage />} />
        <Route path={ROUTES.avatarSkinTone} element={<AvatarSkinTonePage />} />
        <Route path={ROUTES.avatarHair} element={<AvatarHairPage />} />
        <Route path={ROUTES.avatarExtras} element={<AvatarExtrasPage />} />
        <Route path={ROUTES.avatarOutfit} element={<AvatarOutfitPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
