import GuidelinesSection from '../../../components/sections/institutionOnboarding/GuidelinesSection.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('InstitutionGuidelinesPage');

/*
 * InstitutionGuidelinesPage — route /onboarding/institution/guidelines.
 *
 * Pre-onboarding guidelines screen shown to institution/school admins
 * before they begin the bulk sign-up flow. Thin wrapper; all content and
 * layout lives in GuidelinesSection.
 *
 * Chrome: OnboardingNavbar (via MainLayout — path starts with /onboarding/).
 * Figma main frame: 2971:65353 ("Bulk Onboarding Sign Up Guidelines Screen
 * for Institutions/Schools").
 */
const InstitutionGuidelinesPage = () => {
  log('mount');
  return <GuidelinesSection />;
};

export default InstitutionGuidelinesPage;
