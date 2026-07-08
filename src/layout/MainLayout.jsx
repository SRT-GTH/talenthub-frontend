import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/shared/Navbar.jsx';
import OnboardingNavbar from '../components/shared/OnboardingNavbar.jsx';
import Footer from '../components/shared/Footer.jsx';
import { classNames } from '../utils/classNames.js';
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

// Two-column auth flows that lock to the viewport: the shell is exactly screen
// height and never scrolls, so the navbar (and the decorative right panel) stay
// fixed while only the form column scrolls internally. Other onboarding-chrome
// pages (/login, /get-started, talent steps) keep the normal page-scroll model
// with a sticky navbar.
const isFixedShellPath = (pathname) =>
  pathname.startsWith('/onboarding/institution') ||
  pathname.startsWith('/onboarding/parent') ||
  pathname.startsWith('/onboarding/talent') ||
  pathname === '/login';

// Returns a stable key for the current layout family. Using the full pathname as
// the key would force-remount layouts (and destroy OnboardingProvider state) on
// every talent step. Grouping by family keeps each sub-layout mounted for the
// full flow; only cross-family transitions trigger the entry animation here.
const getLayoutFamily = (pathname) => {
  if (pathname.startsWith('/onboarding/institution')) return 'institution';
  if (pathname.startsWith('/onboarding/parent')) return 'parent';
  if (pathname.startsWith('/onboarding/talent')) return 'talent';
  return pathname;
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const onboarding = isOnboardingChromePath(pathname);
  const fixedShell = isFixedShellPath(pathname);
  log('mount; pathname:', pathname, 'onboarding:', onboarding, 'fixedShell:', fixedShell);

  return (
    // Layout-wide column. Fixed-shell auth flows lock to `h-screen` + overflow-
    // hidden so the page itself never scrolls (navbar + right panel stay put,
    // content column scrolls internally). Everything else uses `min-h-screen`
    // with normal page scroll (sticky navbar keeps the header visible).
    <div
      className={classNames(
        'mx-auto flex w-full flex-col',
        fixedShell ? 'h-screen overflow-hidden' : 'min-h-screen'
      )}
    >
      {onboarding ? <OnboardingNavbar /> : <Navbar />}
      <main className={classNames('flex flex-1 flex-col', fixedShell && 'min-h-0')}>
        <div
          key={getLayoutFamily(pathname)}
          className={classNames('page-fade-in flex flex-1 flex-col', fixedShell && 'min-h-0')}
        >
          <Outlet />
        </div>
      </main>
      {/* Onboarding pages have no footer per Figma node 2849:66712 family —
          the auth flow stands alone on the page so the footer's marketing
          links don't pull the user out mid-flow. */}
      {onboarding ? null : <Footer />}
    </div>
  );
};

export default MainLayout;
