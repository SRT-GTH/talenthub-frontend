import { Link } from 'react-router-dom';
import gthLogoStacked from '../../../../assets/brand/gth-logo-stacked.webp';
import OnboardingHeader from '../../../shared/OnboardingHeader.jsx';
import { OnboardingProvider } from '../../../../providers/OnboardingProvider.jsx';
import { useIsDesktop } from '../../../../hooks/useMediaQuery.js';
import AgencyOnboardingPanel from './AgencyOnboardingPanel.jsx';
import { SIGNUP } from './data/agencyOnboardingData.js';

/*
 * AgencySignUpLayout — the page of the agency sign-up (Figma 11.4.1a-a5): NOT the rail chrome (the visitor is not signed in yet), the onboarding layout of the
 * talent / recruiter flows: cream nav (#f8f8f4, 90 high, logo left, "Log In" right) · breadcrumb + completion header (the shared OnboardingHeader, 7 steps) ·
 * the form column (left, scrolls) · the green panel (right, 739 of 1728, >= lg).
 * Props: stepKey ('agency' | 'verify'), variant (panel copy), children (the form column content).
 */

const AgencySignUpLayout = ({ stepKey, variant, children }) => {
  const isDesktop = useIsDesktop();
  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <header className="sticky top-0 z-40 w-full shrink-0 border-b border-solid border-[#e7e7e7] bg-[#f8f8f4] shadow-[0_1px_2px_rgba(27,36,44,0.12)]">
        <div className="flex items-center justify-between px-4 py-3 max-md:py-1.5 md:px-16">
          <Link to="/agency" aria-label="Ghana Talent Hub, agency home">
            <img
              src={gthLogoStacked}
              alt="Ghana Talent Hub"
              className="h-[66px] w-[71px] max-md:h-10 max-md:w-[43px]"
            />
          </Link>
          <Link
            to="/agency"
            className="inline-flex min-h-[24px] items-center px-[8px] text-[14px] leading-[24px] font-semibold tracking-[0.1px] text-[#387440] underline decoration-[#387440]/60 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            Log In
          </Link>
        </div>
      </header>
      <OnboardingProvider>
        <OnboardingHeader
          steps={SIGNUP.steps}
          currentKey={stepKey}
          percent={SIGNUP.percent[stepKey]}
        />
      </OnboardingProvider>
      <main className="flex min-h-0 flex-1" aria-label="Agency sign-up">
        <div className="relative flex min-w-0 flex-1 items-center justify-center bg-[radial-gradient(circle_at_20%_0%,#eef3ea,transparent_55%)] px-[16px] py-[24px] md:px-[24px] md:py-[34px]">
          {children}
        </div>
        {isDesktop ? <AgencyOnboardingPanel variant={variant} /> : null}
      </main>
    </div>
  );
};

export default AgencySignUpLayout;
