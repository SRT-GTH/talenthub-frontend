import ParentWelcomeSection from '../../components/sections/parentLogin/ParentWelcomeSection.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('ParentWelcomePage');

/*
 * ParentWelcomePage — thin route wrapper for /onboarding/parent-welcome.
 * Layout shell (BG ellipses + gold right panel) comes from ParentOnboardingLayout.
 * Content is rendered via <Outlet> in the layout.
 */
const ParentWelcomePage = () => {
  log('mount');
  return <ParentWelcomeSection />;
};

export default ParentWelcomePage;
