import ContactInfoSection from '../../../components/sections/institutionOnboarding/ContactInfoSection.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('InstitutionContactPage');

/*
 * InstitutionContactPage — route /onboarding/institution/contact.
 *
 * Step 2 of 8 in the institution bulk-onboarding wizard. Thin page wrapper;
 * all form content and the ContactVerificationModal live in ContactInfoSection.
 *
 * Chrome: OnboardingNavbar (via MainLayout) + InstitutionOnboardingBreadcrumb
 *         (via InstitutionOnboardingLayout, currentStep=1).
 * Figma main frames: 2972:76072 (form), 2972:76088 (modal open).
 */
const InstitutionContactPage = () => {
  log('mount');
  return <ContactInfoSection />;
};

export default InstitutionContactPage;
