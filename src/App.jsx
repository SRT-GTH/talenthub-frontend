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
import InstitutionGuidelinesPage from './pages/onboarding/institution/InstitutionGuidelinesPage.jsx';
import InstitutionYourInstitutionPage from './pages/onboarding/institution/InstitutionYourInstitutionPage.jsx';
import InstitutionContactPage from './pages/onboarding/institution/InstitutionContactPage.jsx';
import InstitutionActivatePage from './pages/onboarding/institution/InstitutionActivatePage.jsx';
import InstitutionTemplatePage from './pages/onboarding/institution/InstitutionTemplatePage.jsx';
import InstitutionTemplateGuidePage from './pages/onboarding/institution/InstitutionTemplateGuidePage.jsx';
import InstitutionUploadPage from './pages/onboarding/institution/InstitutionUploadPage.jsx';
import InstitutionValidatePage from './pages/onboarding/institution/InstitutionValidatePage.jsx';
import InstitutionConfirmPage from './pages/onboarding/institution/InstitutionConfirmPage.jsx';
import InstitutionReportPage from './pages/onboarding/institution/InstitutionReportPage.jsx';
import InstitutionOnboardingLayout from './layout/InstitutionOnboardingLayout.jsx';
import AvatarFlowLayout from './layout/AvatarFlowLayout.jsx';
import ScrollToTop from './components/ui/ScrollToTop.jsx';
import ParentOnboardingLayout from './layout/ParentOnboardingLayout.jsx';
import ParentLoginPage from './pages/parentLogin/ParentLoginPage.jsx';
import ParentWelcomePage from './pages/parentLogin/ParentWelcomePage.jsx';
import ParentIdentityPage from './pages/parentLogin/ParentIdentityPage.jsx';
import ParentVerificationPage from './pages/parentLogin/ParentVerificationPage.jsx';
import ParentContactPage from './pages/parentLogin/ParentContactPage.jsx';
import ParentSecurityPage from './pages/parentLogin/ParentSecurityPage.jsx';
import ParentLinkWardPage from './pages/parentLogin/ParentLinkWardPage.jsx';
import ParentReviewPage from './pages/parentLogin/ParentReviewPage.jsx';
import ParentDonePage from './pages/parentLogin/ParentDonePage.jsx';
import { OnboardingProvider } from './providers/OnboardingProvider.jsx';
import DemoNavigator from './components/shared/DemoNavigator.jsx';
function App() {
  return (
    <BrowserRouter>
      {/* Reset window scroll on every route change so each new page
          starts at the top instead of inheriting the previous scroll. */}
      <ScrollToTop />
      <DemoNavigator />
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

          {/* Institution bulk-onboarding flow.
              All steps share InstitutionOnboardingLayout which renders the
              page bg ellipses, the shared right panel, and (for non-guidelines
              routes) the 8-step breadcrumb at the top. */}
          <Route element={<InstitutionOnboardingLayout />}>
            <Route
              path="/onboarding/institution/guidelines"
              element={<InstitutionGuidelinesPage />}
            />
            <Route
              path="/onboarding/institution/your-institution"
              element={<InstitutionYourInstitutionPage />}
            />
            <Route path="/onboarding/institution/contact" element={<InstitutionContactPage />} />
            <Route path="/onboarding/institution/activate" element={<InstitutionActivatePage />} />
            {/* Template Guide — part of Phase 4 "Bulk Upload".
                Comes BEFORE /template in the flow: activate → template-guide → template → upload.
                Has right panel (does not end with '/activate' or '/template').
                Automatically gets breadcrumb step 3 "Template" via startsWith match
                against STEP_PATHS[3] = '/onboarding/institution/template'. */}
            <Route
              path="/onboarding/institution/template-guide"
              element={<InstitutionTemplateGuidePage />}
            />
            <Route path="/onboarding/institution/template" element={<InstitutionTemplatePage />} />
            <Route path="/onboarding/institution/upload" element={<InstitutionUploadPage />} />
            <Route path="/onboarding/institution/validate" element={<InstitutionValidatePage />} />
            <Route path="/onboarding/institution/confirm" element={<InstitutionConfirmPage />} />
            <Route path="/onboarding/institution/report" element={<InstitutionReportPage />} />
          </Route>

          {/* Parent portal onboarding — shared layout provides BG ellipses + gold right panel.
              Layout swaps the right panel based on the active route:
                parent-welcome → ParentWelcomeRightPanel (single large photo + Ward Status overlay)
                parent-login   → ParentLoginRightPanel   (two photo cards + Error callout) */}
          <Route element={<ParentOnboardingLayout />}>
            <Route path={'/onboarding/parent-welcome'} element={<ParentWelcomePage />} />
            <Route path={'/onboarding/parent-login'} element={<ParentLoginPage />} />
            <Route path={'/onboarding/parent-identity'} element={<ParentIdentityPage />} />
            <Route path={'/onboarding/parent-verification'} element={<ParentVerificationPage />} />
            <Route path={'/onboarding/parent-contact'} element={<ParentContactPage />} />
            <Route path={'/onboarding/parent-security'} element={<ParentSecurityPage />} />
            <Route path={'/onboarding/parent-link-ward'} element={<ParentLinkWardPage />} />
            <Route path={'/onboarding/parent-review'} element={<ParentReviewPage />} />
            <Route path={'/onboarding/parent-done'} element={<ParentDonePage />} />
          </Route>

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
