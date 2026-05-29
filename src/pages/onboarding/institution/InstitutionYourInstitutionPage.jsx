import YourInstitutionSection from '../../../components/sections/institutionOnboarding/YourInstitutionSection.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('InstitutionYourInstitutionPage');

/*
 * InstitutionYourInstitutionPage — route /onboarding/institution/your-institution.
 *
 * Step 1 of 8 in the institution bulk-onboarding wizard. Thin page wrapper;
 * all form content lives in YourInstitutionSection.
 *
 * Chrome: OnboardingNavbar (via MainLayout) + InstitutionOnboardingBreadcrumb
 *         (via InstitutionOnboardingLayout, currentStep=0).
 * Figma main frames: 2972:71456 (empty), 2972:72682 (filled),
 *                    2972:74318 (save-continue), 2972:75943 (modal).
 */
const InstitutionYourInstitutionPage = () => {
  log('mount');
  return <YourInstitutionSection />;
};

export default InstitutionYourInstitutionPage;
