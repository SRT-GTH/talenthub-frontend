import ParentLoginSection from '../../components/sections/parentLogin/ParentLoginSection.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('ParentLoginPage');

/*
 * ParentLoginPage — route /onboarding/parent-login.
 *
 * Parent portal login screen (Figma 2884:64759). Thin wrapper; all content
 * and layout live in ParentLoginSection.
 *
 * Chrome: OnboardingNavbar, no Footer (via MainLayout — path starts with
 * /onboarding/ so isOnboardingChromePath = true).
 */
const ParentLoginPage = () => {
  log('mount');
  return <ParentLoginSection />;
};

export default ParentLoginPage;
