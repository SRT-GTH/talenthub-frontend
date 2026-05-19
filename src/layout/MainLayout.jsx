import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/shared/Navbar.jsx';
import OnboardingNavbar from '../components/shared/OnboardingNavbar.jsx';
import Footer from '../components/shared/Footer.jsx';
import { debug } from '../utils/debug.js';

const log = debug('MainLayout');

// Paths that get the slim onboarding chrome (cream nav, no footer). The
// `/onboarding/` entry covers every step page via startsWith; `/login`
// is an exact match — auth-adjacent surface that shares the same lone
// "Log In" / no-footer treatment as the onboarding flow.
const ONBOARDING_CHROME_PATHS = ['/onboarding/', '/login'];

const isOnboardingChromePath = (pathname) =>
  ONBOARDING_CHROME_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path.endsWith('/') ? path : `${path}/`)
  );

const MainLayout = () => {
  const { pathname } = useLocation();
  const onboarding = isOnboardingChromePath(pathname);
  log('mount; pathname:', pathname, 'onboarding:', onboarding);

  return (
    <div className="min-h-screen flex flex-col">
      {onboarding ? <OnboardingNavbar /> : <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Onboarding pages have no footer per Figma node 2849:66712 family —
          the auth flow stands alone on the page so the footer's marketing
          links don't pull the user out mid-flow. */}
      {onboarding ? null : <Footer />}
    </div>
  );
};

export default MainLayout;
