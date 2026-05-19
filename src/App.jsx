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
import { OnboardingProvider } from './providers/OnboardingProvider.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* /admin/* slot is reserved for a future lazy-loaded admin subsystem,
            mirroring the elysium pattern. Add it as:
            <Route path="/admin/*" element={<Suspense ...><AdminApp /></Suspense>} /> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />

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
          <Route path="/components" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
