import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../components/shared/assets.jsx';
import OnboardingRightPanel from '../../components/shared/OnboardingRightPanel.jsx';
import TalentWelcomePanelContent from '../../components/sections/talentAuth/TalentWelcomePanelContent.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingWelcomePage');

/*
 * OnboardingWelcomePage — post-role-selection landing.
 * Figma source: nodes 2858:23640 / 2858:23867 / 2858:24094 (Welcome
 * "Here's what happens next" screen). Two-column layout: left rail
 * carries the welcome message + 3-step preview list + "Let's Begin"
 * CTA; right panel is OnboardingRightPanel with TalentWelcomePanelContent
 * (big tilted student photo + 5 floating overlay cards).
 *
 * Visible states:
 *   idle      — default; welcome toast appears for ~3s then auto-hides
 *   submitting — user clicked CTA, briefly loading before navigation
 */

// ---- left column primitives -------------------------------------------

const TalentTag = () => (
  // "Talent" eyebrow pill â€" Figma node 2858:24046 family.
  // "Talent" eyebrow pill â€" Figma node 2858:24046 family.
  // bg #EBF1EC, 1px #387440 inset outline, radius 5, padding 4/12.
  <span
    className="inline-flex items-center gap-1 rounded-[5px] bg-brand-green-light px-3 py-1"
    style={{ outline: '1px solid #387440', outlineOffset: '-1px' }}
  >
    <span
      className="text-[10px] font-medium leading-4 text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Talent
    </span>
  </span>
);

const StepNumberBadge = ({ n }) => (
  <span
    aria-hidden="true"
    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-green-light font-display italic text-[#2A5730]"
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

const OnboardingWelcomePage = () => {
  log('mount');
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Auto-dismiss the success toast 3s after entry (Figma title:
    // "toast message-3seconds").
    const id = setTimeout(() => setShowToast(false), 3000);
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
      <div className="flex flex-1 min-h-0 items-center justify-center overflow-y-auto no-scrollbar px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[554px] flex-col items-center gap-6 text-center">
          <TalentTag />

          <h1
            className="font-display font-normal text-black"
            style={{ fontSize: 'clamp(2rem, 4.4vw, 4rem)', lineHeight: 1.1 }}
          >
            <span className="block">Welcome. Here&apos;s what</span>
            <span className="block">
              happens <span className="italic text-brand-green">next.</span>
            </span>
          </h1>

          <p
            className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
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
                  className={`relative flex h-[70px] items-start ${isLast ? '' : 'border-b border-[#E6E6E6]'}`}
                >
                  <span aria-hidden="true" className="absolute left-0 top-[19px]">
                    <StepNumberBadge n={idx + 1} />
                  </span>
                  <div className="absolute left-[58px] top-[17px] flex flex-col gap-2">
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
            className="mt-3 w-full max-w-[420px]"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Setting Things Up' : "Let's Begin"}
          </Button>

          {/* Already-have-account link */}
          <div className="flex items-center gap-2 text-[14px] leading-6">
            <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to={'/login'}
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
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
      <OnboardingRightPanel
        bgColor="#FFFEFC"
        panelContent={<TalentWelcomePanelContent showToast={showToast} />}
      />
    </section>
  );
};

export default OnboardingWelcomePage;
