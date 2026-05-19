import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/shared/Navbar.jsx';
import OnboardingNavbar from '../components/shared/OnboardingNavbar.jsx';
import Footer from '../components/shared/Footer.jsx';
import { debug } from '../utils/debug.js';

const log = debug('MainLayout');

// Paths that get the slim onboarding chrome (cream nav, no footer). The
// `/onboarding/` entry covers every step page via startsWith; `/login`
// and `/get-started` are auth-adjacent surfaces that share the same lone
// "Log In" / no-footer treatment as the onboarding flow (the role-select
// page is conceptually step 0 of onboarding even though it lives at the
// top level).
const ONBOARDING_CHROME_PATHS = ['/onboarding/', '/login', '/get-started'];

const isOnboardingChromePath = (pathname) =>
  ONBOARDING_CHROME_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path.endsWith('/') ? path : `${path}/`)
  );

const MainLayout = () => {
  const { pathname } = useLocation();
  const onboarding = isOnboardingChromePath(pathname);
  log('mount; pathname:', pathname, 'onboarding:', onboarding);

  return (
    // Layout-wide max-width cap (matches the 1728-px Figma frame). Nav, main,
    // and footer all sit inside this centered column instead of each page or
    // nav component repeating `mx-auto max-w-[1728px]` internally. On viewports
    // wider than 1728px, the column centres and the surrounding area falls
    // back to the body background.
    <div className="min-h-screen mx-auto flex w-full max-w-[1728px] flex-col">
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
