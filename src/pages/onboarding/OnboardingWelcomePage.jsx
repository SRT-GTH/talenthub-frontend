import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../../components/ui/form/mobileScale.js';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, GenzDoodleStar, LoadingSpinner } from '../../components/shared/assets.jsx';
import TalentOnboardingPanel from '../../components/sections/talentAuth/TalentOnboardingPanel.jsx';
import { WelcomePanelArt } from '../../components/sections/talentAuth/TalentWelcomePanelContent.jsx';
import Toast from '../../components/ui/Toast.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingWelcomePage');

/*
 * OnboardingWelcomePage — post-role-selection landing.
 * Figma source: 8027:202121 (toast, 3 s) / 202348 (role flow) / 202575 (loader)
 * - Welcome "Here's what happens next" screen. Right panel: TalentWelcomePanelContent. Two-column layout: left rail
 * carries the welcome message + 3-step preview list + "Let's Begin"
 * CTA; right panel is TalentOnboardingPanel (variant simple) with TalentWelcomePanelContent
 * (big tilted student photo + 5 floating overlay cards).
 *
 * Visible states:
 *   idle      — default; welcome toast appears for ~3s then auto-hides
 *   submitting — user clicked CTA, briefly loading before navigation
 */

// ---- left column primitives -------------------------------------------

// "Talent" eyebrow. Focused: mint pill, 1px green inset outline, radius 5, padding 4/12.
// Playful: gold sticker tilted 4deg (1.2px ink border, hard 2px ink shadow, 12px ink text) with three doodle stars,
// placed from the sticker's edges like the sign-up step eyebrows.
const TalentTag = () => (
  <span className="relative inline-flex">
    <span className="inline-flex items-center gap-1 rounded-[5px] bg-brand-green-light px-3 py-1 outline-1 -outline-offset-1 outline-brand-green max-md:px-3 max-md:py-0.5 playful:rotate-[4deg] playful:rounded-[8px] playful:border-[1.2px] playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:px-[18px] playful:py-1 playful:shadow-[2px_2px_0_#1c2a21] playful:outline-0">
      <span className="text-[10px] font-medium leading-4 tracking-[0.2px] text-brand-green max-lg:text-[12px] playful:text-[12px] playful:text-[#1c2a21]">
        Talent
      </span>
    </span>
    <GenzDoodleStar
      size={16}
      color="#C8951A"
      className="absolute hidden playful:block"
      style={{ left: 'calc(100% + 9px)', top: -12 }}
    />
    <GenzDoodleStar
      size={10}
      color="#C8951A"
      className="absolute hidden playful:block"
      style={{ left: 'calc(100% + 31px)', top: 6 }}
    />
    <GenzDoodleStar
      size={9}
      color="#387440"
      className="absolute hidden playful:block"
      style={{ left: -21, top: 10 }}
    />
  </span>
);

const StepNumberBadge = ({ n }) => (
  <span
    aria-hidden="true"
    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light font-heading font-semibold text-[#2A5730]"
    style={{
      fontSize: 16,
      outline: '1px solid #C1D4C4',
      outlineOffset: '-1px',
    }}
  >
    {n}
  </span>
);

const STEPS = [
  {
    title: 'Your Basics',
    description: 'Date of birth, full name, and contact details fast and secure.',
  },
  {
    title: 'Your Location',
    description: 'Region and school so we match you to the right opportunities nearby.',
  },
  {
    title: 'Your Education',
    description: 'Level and subjects this powers your talent score and your matching engine.',
  },
];

// ---- page -------------------------------------------------------------

const TOAST_DELAY_MS = 1500;

const OnboardingWelcomePage = () => {
  log('mount');
  const navigate = useNavigate();
  // The welcome toast waits a beat after the page loads (TOAST_DELAY_MS) so it is noticed, not lost in the first paint.
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      log('welcome toast shown after', TOAST_DELAY_MS, 'ms');
      setShowToast(true);
    }, TOAST_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  const handleBegin = () => {
    if (isSubmitting) return;
    log('begin clicked');
    setIsSubmitting(true);
    // Short delay so the loading state is visible before nav; replace
    // with a real network/persist call when wired in.
    setTimeout(() => navigate('/onboarding/talent/dob'), 600);
  };

  return (
    <section className="relative flex w-full flex-1 min-h-0 overflow-hidden">
      {/* Left content column — scrolls independently within the fixed shell */}
      <div className="flex flex-1 min-h-0 items-start justify-center max-lg:relative max-lg:z-10 overflow-y-auto no-scrollbar px-6 py-12 md:py-20 max-md:px-4 max-md:py-4">
        {/* my-auto centres when there is room; on short screens it collapses to 0 so the top never clips. */}
        <div className="my-auto flex w-full max-w-[554px] flex-col items-center gap-6 text-center max-md:gap-3">
          <TalentTag />

          <h1
            className="font-heading font-semibold focused:font-sans text-[#1c2a21] max-md:text-[28px]! max-md:leading-tight!"
            style={{
              fontSize: 'clamp(2.125rem, 4vw, 3.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.54px',
            }}
          >
            <span className="block">Welcome. Here&apos;s what</span>
            <span className="block">
              happens <span className="text-brand-green">next.</span>
            </span>
          </h1>

          <p
            className="max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
            style={{ letterSpacing: '0.2px' }}
          >
            Just a few questions. We&apos;ll use your answers to build a profile that works hard for
            you.
          </p>

          {/* Wavy Ghana-flag divider — Figma vector 2858:24050 */}
          <WavyDivider />

          {/* "About 4 minutes" meta pill — Figma node 2858:23824 */}
          <div className="inline-flex items-center gap-2 rounded-[10px] border border-[#E7E7E7] bg-white px-3 py-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <g filter="url(#about-4-min-dot-glow)">
                <circle cx="8" cy="8" r="4" fill="#E1EAE2" />
                <circle cx="8" cy="8" r="3.25" stroke="#1D7C4D" strokeWidth="1.5" />
              </g>
              <defs>
                <filter
                  id="about-4-min-dot-glow"
                  x="0"
                  y="0"
                  width="16"
                  height="16"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0.419608 0 0 0 0 0.247059 0 0 0 1 0"
                  />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
            <span
              className="text-[12px] leading-[18px] text-[#70706E]"
              style={{ letterSpacing: '0.2px' }}
            >
              About 4 minutes to complete
            </span>
          </div>

          {/* 3-step preview list */}
          <ol className="mt-2 flex w-full max-w-[511px] flex-col text-left">
            {STEPS.map((step, idx) => {
              const isLast = idx === STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className={`relative flex h-[70px] max-md:h-auto max-md:min-h-[70px] max-md:py-4 items-start ${isLast ? '' : 'border-b border-[#E6E6E6]'}`}
                >
                  <span aria-hidden="true" className="absolute left-0 top-[19px] max-md:top-4">
                    <StepNumberBadge n={idx + 1} />
                  </span>
                  <div className="absolute left-[58px] top-[17px] flex flex-col gap-2 max-md:static max-md:ml-[58px]">
                    <p className="text-[16px] font-semibold leading-[18px] text-brand-green">
                      {step.title}
                    </p>
                    <p className="text-[14px] leading-[18px] text-[#575755]">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Primary CTA — "Let's Begin" */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleBegin}
            state={isSubmitting ? 'active' : undefined}
            disabled={isSubmitting}
            leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            rightIcon={<ArrowRightIcon />}
            className={`mt-3 w-full max-w-[542px] ${COMPACT_PRIMARY_BUTTON}`}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Setting Things Up' : "Let's Begin"}
          </Button>

          {/* Already-have-account link */}
          <div className="flex items-center gap-2 text-[14px] leading-6 max-md:text-[13px] max-md:leading-5">
            <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to={'/login'}
              className="font-semibold text-brand-green underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </div>
      </div>

      {/* Right panel — shared shell with welcome-specific foreground content.
          Photo + all 5 overlay cards live inside one container in
          TalentWelcomePanelContent so they stay in formation together. */}
      <TalentOnboardingPanel
        variant="simple"
        bgColor="#FFFEFC"
        centerContent={<WelcomePanelArt />}
      />
      {/* Welcome toast: the shared toast system in its "welcome-card" look; auto-dismisses 3s after entry (the design
          names it "toast message - 3 seconds"). Sits just below the nav, over the right panel's top-right corner. */}
      {showToast && (
        <Toast
          variant="welcome-card"
          title="Welcome to GTH, Student!"
          body="Taking you to your personalized setup"
          duration={3000}
          offsetClassName="top-[115px]! right-12! max-md:top-[68px]! max-md:right-4!"
          onDismiss={() => {
            log('welcome toast dismissed');
            setShowToast(false);
          }}
        />
      )}
    </section>
  );
};

export default OnboardingWelcomePage;
