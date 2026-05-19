import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../components/shared/assets.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('OnboardingWelcomePage');

/*
 * OnboardingWelcomePage — post-role-selection landing.
 * Figma source: nodes 2858:23640 / 2858:23867 / 2858:24094 (Welcome
 * "Here's what happens next" screen). Two-column layout: left rail
 * carries the welcome message + 3-step preview list + "Let's Begin"
 * CTA; right panel is the brand-green showcase with the big tilted
 * student photo and four floating overlay cards.
 *
 * Visible states:
 *   loading — first paint shows the spinner CTA until next-tick mount
 *   idle    — default; toast appears for ~3s then auto-hides
 *   submitting — user clicked CTA, briefly loading before navigation
 */

// ---- left column primitives -------------------------------------------

const TalentTag = () => (
  // "Talent" eyebrow pill — Figma node 2858:24046 family.
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
  // 32×32 circle badge — Figma spec: bg #EBF1EC, 1px #C1D4C4 inset
  // outline, italic Instrument Serif numeral in dark green.
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

// ---- right panel: floating cards --------------------------------------

const JobsAvailableCard = () => (
  // "1,580 Jobs Available" — Figma node 2858:23717. Soft white card with
  // big serif number and a small body label.
  <div
    className="absolute rounded-[14px] bg-white px-5 py-4 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ left: 24, top: 168, width: 144 }}
  >
    <p className="font-display font-normal leading-none text-[#111111]" style={{ fontSize: 36 }}>
      1,580
    </p>
    <p
      className="mt-1 text-[12px] font-medium leading-5 text-[#70706E]"
      style={{ letterSpacing: '0.2px' }}
    >
      Jobs Available
    </p>
  </div>
);

const SavedPill = () => (
  // "Saved" floating badge — Figma node 2858:23720. Green pill with
  // bookmark glyph + "Saved" label, sits below the Jobs Available card.
  <div
    className="absolute inline-flex items-center gap-2 rounded-[10px] bg-brand-green px-3 py-2 shadow-[0_8px_16px_-2px_rgba(27,36,44,0.18)]"
    style={{ left: 36, top: 372, height: 42 }}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 1.5h8a1 1 0 0 1 1 1V12l-5-3-5 3V2.5a1 1 0 0 1 1-1z" fill="white" />
    </svg>
    <span
      className="text-[16px] font-medium leading-7 text-white"
      style={{ letterSpacing: '0.2px' }}
    >
      Saved
    </span>
  </div>
);

const VerifiedProfilePill = () => (
  // "Verified profile" — Figma node 2858:23725. White rounded pill with
  // a check glyph + green label. Sits in the lower-left of the panel.
  <div
    className="absolute inline-flex items-center gap-2 rounded-[10px] border border-black/5 bg-white px-3 py-2 shadow-[0_2px_0_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.1)]"
    style={{ left: 24, top: 525, height: 40 }}
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="#387440" />
      <path
        d="M4.5 7l1.7 2 3.3-3.2"
        stroke="#387440"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span
      className="text-[14px] font-semibold leading-6 text-brand-green"
      style={{ letterSpacing: '0.1px' }}
    >
      Verified profile
    </span>
  </div>
);

const MyExperienceCard = () => (
  // "My Experience" widget — Figma node 2858:23731. White card with
  // heading + 3 stacked grey placeholder rows + green Submit button.
  <div
    className="absolute rounded-[12px] bg-white p-4 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ right: 24, top: 60, width: 186 }}
  >
    <p className="text-[14px] font-bold leading-tight text-[#111111]">My Experience</p>
    <div className="mt-3 flex flex-col gap-2">
      <span className="h-[10px] w-[132px] rounded-full bg-[#EEE7DA]" aria-hidden="true" />
      <span className="h-[10px] w-[111px] rounded-full bg-[#EEE7DA]" aria-hidden="true" />
      <span className="h-[10px] w-[79px] rounded-full bg-[#EEE7DA]" aria-hidden="true" />
    </div>
    <button
      type="button"
      className="mt-3 inline-flex h-[36px] w-full items-center justify-center rounded-[8px] bg-brand-green text-[12px] font-bold text-white shadow-[0_3px_0_#224626]"
    >
      Submit
    </button>
  </div>
);

const InstitutionCard = () => (
  // "Accra Girls Senior High" institution card — Figma 2858:23740.
  // Dark green card with a verified-institution pill, school name,
  // region line and a row of 3 student avatars.
  <div
    className="absolute overflow-hidden rounded-[14px] shadow-[0_16px_24px_-6px_rgba(27,36,44,0.20),0_2px_2px_-1px_rgba(27,36,44,0.06)]"
    style={{
      right: 24,
      bottom: 30,
      width: 220,
      height: 144,
      backgroundImage: 'linear-gradient(160deg, rgba(56,116,64,0.92) 0%, rgba(27,52,29,0.92) 100%)',
    }}
  >
    <div className="p-4 text-white">
      <span className="inline-flex items-center rounded-[6px] bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.3px] text-white backdrop-blur-sm">
        ✓ Verified Institution
      </span>
      <p
        className="mt-2 font-display font-normal leading-tight text-white"
        style={{ fontSize: 21, lineHeight: '23.1px' }}
      >
        Accra Girls Senior High
      </p>
      <p className="mt-1 text-[10px] font-normal leading-tight text-white/60">
        Greater Accra · GES-Accredited
      </p>
      <div className="mt-3 flex -space-x-2">
        {['#EAB69A', '#B59F88', '#7E6852'].map((c) => (
          <span
            key={c}
            aria-hidden="true"
            className="size-7 rounded-full border-2 border-white/30"
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  </div>
);

const WelcomeRightPanel = ({ showToast }) => (
  // Right showcase panel — Figma Frame 141 (2858:23709). 42% width to
  // mirror the rest of the marketing-style screens. Brand-green base
  // with two big blurred orbs, a single tilted student photo (rendered
  // as a styled placeholder until a real asset lands), and the four
  // floating cards layered on top.
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    {/* Soft cream orb — top-right */}
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
      style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
    />
    {/* Soft pink orb — bottom-left */}
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
      style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
    />

    {/* Big tilted "Students using GTH on phone" placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '14%',
        top: '12%',
        width: '60%',
        height: '70%',
        transform: 'rotate(4deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid rgba(255,255,255,0.18)',
        outlineOffset: '-6px',
      }}
    />

    <JobsAvailableCard />
    <SavedPill />
    <VerifiedProfilePill />
    <MyExperienceCard />
    <InstitutionCard />

    {/* Welcome toast — Figma node 2858:23758. Floats top-center while
        visible; auto-hides after 3s on first paint. */}
    {showToast && (
      <div
        role="status"
        aria-live="polite"
        className="absolute left-1/2 top-6 w-[309px] -translate-x-1/2 rounded-[14px] border border-black/5 bg-white p-3 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.18)]"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" />
              <path
                d="M4.5 7l1.7 2 3.3-3.2"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold leading-tight text-[#111111]">
              Welcome to GTH, Student!
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[#70706E]">
              Your profile is live. Start exploring opportunities.
            </p>
          </div>
        </div>
      </div>
    )}
  </aside>
);

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
    setTimeout(() => navigate(ROUTES.onboardingDob), 600);
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] bg-white">
      {/* Left content column. Centered within the available space. */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:py-20">
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

          {/* Wavy Ghana-flag divider — Figma vector 2858:24050.
              Sits between the headline block and the "About 4 minutes"
              meta pill on the welcome screen. */}
          <WavyDivider />

          {/* "About 4 minutes" meta pill — Figma node 2858:23824.
              The dot is a 16×16 SVG (filter id 2858:23829): a soft
              #E1EAE2 fill with a 1.5px #1D7C4D ring and a green-glow
              drop shadow rather than a plain bg pill. */}
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

          {/* 3-step preview list. Each row is the 70px Figma row
              (Frame 145 children): badge on the left, two-line copy on
              the right, separated by a hairline #E6E6E6 divider that
              drops on the last item. */}
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
              to={ROUTES.login}
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </div>
      </div>

      <WelcomeRightPanel showToast={showToast} />
    </section>
  );
};

export default OnboardingWelcomePage;
