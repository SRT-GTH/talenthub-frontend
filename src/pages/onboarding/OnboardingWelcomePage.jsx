import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../components/shared/assets.jsx';
import { debug } from '../../utils/debug.js';
import ellipseGold from '../../assets/onboarding/welcome-panel/ellipse-gold.svg';
import ellipseRed from '../../assets/onboarding/welcome-panel/ellipse-red.svg';
import ellipsePhotoOverlay from '../../assets/onboarding/welcome-panel/ellipse-photo-overlay.svg';
import gridTexture from '../../assets/onboarding/welcome-panel/grid-texture.png';
import studentsPhoto from '../../assets/onboarding/welcome-panel/students-gth-phone.png';
import avatar1 from '../../assets/onboarding/welcome-panel/avatar-1.png';
import avatar2 from '../../assets/onboarding/welcome-panel/avatar-2.png';
import avatar3 from '../../assets/onboarding/welcome-panel/avatar-3.png';
import iconSaved from '../../assets/onboarding/welcome-panel/icon-saved.svg';
import iconVerified from '../../assets/onboarding/welcome-panel/icon-verified.svg';
import iconEdit from '../../assets/onboarding/welcome-panel/icon-edit.svg';

const log = debug('OnboardingWelcomePage');

/*
 * OnboardingWelcomePage â€" post-role-selection landing.
 * Figma source: nodes 2858:23640 / 2858:23867 / 2858:24094 (Welcome
 * "Here's what happens next" screen). Two-column layout: left rail
 * carries the welcome message + 3-step preview list + "Let's Begin"
 * CTA; right panel is the brand-green showcase with the big tilted
 * student photo and four floating overlay cards.
 *
 * Visible states:
 *   loading â€" first paint shows the spinner CTA until next-tick mount
 *   idle    â€" default; toast appears for ~3s then auto-hides
 *   submitting â€" user clicked CTA, briefly loading before navigation
 */

// ---- left column primitives -------------------------------------------

const TalentTag = () => (
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
  // 32Ã—32 circle badge â€" Figma spec: bg #EBF1EC, 1px #C1D4C4 inset
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

// ---- right panel: background layer (z below photo) -------------------

const WelcomeRightPanelBg = () => (
  <>
    {/* Gold ellipse gradient — top-right, Figma node 2858:23710 */}
    <img
      aria-hidden="true"
      src={ellipseGold}
      className="pointer-events-none absolute max-w-none"
      style={{ width: 673, height: 673, right: -180, top: -209 }}
    />
    {/* Red-pink ellipse gradient — bottom-left, Figma node 2858:23711 */}
    <img
      aria-hidden="true"
      src={ellipseRed}
      className="pointer-events-none absolute max-w-none"
      style={{ width: 773, height: 773, left: -171, bottom: -238 }}
    />
    {/* Grid texture — bottom-right, rotated + flipped, Figma node 2858:23712 */}
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{ width: 358, height: 405, right: -2, top: 573 }}
    >
      <div
        style={{
          transform: 'rotate(180deg) scaleY(-1)',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <img
          aria-hidden="true"
          src={gridTexture}
          className="absolute max-w-none"
          style={{ width: '280.22%', height: '124.47%', left: '-90.11%', top: 0 }}
        />
      </div>
    </div>
  </>
);

// ---- right panel: floating cards (z above photo) ----------------------

const JobsAvailableCard = () => (
  // "1,580 Jobs Available" — Figma node 2858:23717.
  <div
    className="absolute"
    style={{ top: '28.13%', left: '4.19%', right: '77.67%', bottom: '61.85%' }}
  >
    <div
      className="relative size-full rounded-[18px] bg-white border border-[#FEFCF5] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.1),0px_2px_0px_rgba(0,0,0,0.05)]"
      style={{ transform: 'rotate(4.71deg)' }}
    >
      <p
        className="absolute font-display font-normal text-[#111] leading-[36px]"
        style={{ fontSize: 36, letterSpacing: '-2px', left: 22, top: 18 }}
      >
        1,580
      </p>
      <p
        className="absolute text-[12px] font-medium leading-5 text-[#70706E]"
        style={{ letterSpacing: '0.2px', left: 22, top: 57 }}
      >
        Jobs Available
      </p>
    </div>
  </div>
);

const SavedPill = () => (
  // "Saved" badge — Figma node 2858:23720.
  <div
    className="absolute overflow-hidden rounded-[10px] bg-[#387440] border border-[#2A5730]"
    style={{
      top: '51.07%',
      left: '6.5%',
      right: '80.67%',
      bottom: '44.67%',
      boxShadow: '0 4px 0 0 #2A5730, 0 8px 28px 0 rgba(56,116,64,0.25)',
    }}
  >
    <div className="absolute left-1/2 top-[7px] flex -translate-x-1/2 items-center gap-[7px]">
      <img src={iconSaved} alt="" className="size-[14px] shrink-0" />
      <span
        className="whitespace-nowrap text-[16px] font-medium leading-7 text-white"
        style={{ letterSpacing: '0.2px' }}
      >
        Saved
      </span>
    </div>
  </div>
);

const VerifiedProfilePill = () => (
  // "Verified profile" — Figma node 2858:23725.
  <div
    className="absolute flex items-center gap-2 rounded-[10px] border border-black/5 bg-white px-[10px] py-[8px] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.1),0px_2px_0px_rgba(0,0,0,0.05)]"
    style={{
      left: 'calc(50% - 279.07px)',
      top: 'calc(50% + 182.58px)',
      transform: 'translate(-50%, -50%)',
      width: 132.553,
    }}
  >
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: 13.553, height: 13.553 }}
    >
      <img
        src={iconVerified}
        alt=""
        className="size-[12px]"
        style={{ transform: 'rotate(8deg)' }}
      />
    </div>
    <span
      className="whitespace-nowrap text-[14px] font-semibold leading-6 text-[#387440]"
      style={{ letterSpacing: '0.1px' }}
    >
      Verified profile
    </span>
  </div>
);

const MyExperienceCard = () => (
  // "My Experience" widget — Figma node 2858:23731.
  <div
    className="absolute"
    style={{ top: '18.82%', left: '67.81%', right: '7.12%', bottom: '65.94%' }}
  >
    <div
      className="relative size-full rounded-[18px] bg-white border border-black/5 drop-shadow-[0px_8px_16px_rgba(0,0,0,0.1),0px_2px_0px_rgba(0,0,0,0.05)]"
      style={{ transform: 'rotate(6.59deg)' }}
    >
      <p
        className="absolute whitespace-nowrap text-[14px] font-bold leading-normal text-[#111]"
        style={{ left: 18, top: 'calc(50% - 43.67px)', transform: 'translateY(-50%)' }}
      >
        My Experience
      </p>
      <img
        src={iconEdit}
        alt=""
        className="absolute size-[14px]"
        style={{ left: 137.36, top: 'calc(50% - 42.13px)', transform: 'translateY(-50%)' }}
      />
      <div
        className="absolute h-[6px] rounded-full bg-[#F8F8F4]"
        style={{ left: 18, right: 17.55, top: 44 }}
      />
      <div
        className="absolute h-[6px] rounded-full bg-[#F8F8F4]"
        style={{ left: '10.11%', right: '24.47%', top: 57 }}
      />
      <div
        className="absolute h-[6px] rounded-full bg-[#EBF1EC]"
        style={{ left: '10.11%', right: '43.62%', top: 70 }}
      />
      <div
        className="absolute flex items-center justify-center rounded-[10px] bg-[#387440] drop-shadow-[0px_2px_0px_#2A5730]"
        style={{ left: 18.04, right: 17.5, top: 90.36, height: 30 }}
      >
        <span className="text-center text-[12px] font-bold leading-normal text-white">Submit</span>
      </div>
    </div>
  </div>
);

const InstitutionCard = () => (
  // "Accra Girls Senior High" — Figma node 2858:23740.
  <div
    className="absolute overflow-hidden rounded-[20px] bg-[#387440] border border-black/10"
    style={{
      top: '61.89%',
      bottom: '24.14%',
      right: 57.61,
      width: 222.391,
      boxShadow: '0 2px 2px -1px rgba(27,35,44,0.04), 0 8px 16px -2px rgba(27,36,44,0.12)',
    }}
  >
    <div
      className="absolute overflow-hidden bg-[#387440]"
      style={{ left: -0.93, right: 1.47, top: 2.31, height: 140.618 }}
    >
      <div
        className="absolute rounded-full bg-white/40"
        style={{ left: 18, top: 14.95, width: 115.371, height: 16.999 }}
      >
        <span className="absolute left-[9px] top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-[0.3px] text-white">
          ✓ Verified Institution
        </span>
      </div>
      <p
        className="absolute font-display font-normal text-white"
        style={{
          fontSize: 21,
          lineHeight: '23.1px',
          letterSpacing: '-0.5px',
          left: 18,
          top: 50.95,
          transform: 'translateY(-50%)',
        }}
      >
        Accra Girls Senior High
      </p>
      <p
        className="absolute text-[10px] font-normal leading-normal text-white/60"
        style={{ left: 18, top: 74.54, transform: 'translateY(-50%)' }}
      >
        Greater Accra · GES-Accredited
      </p>
      <div className="absolute flex" style={{ left: 18, top: 91.04 }}>
        {[avatar1, avatar2, avatar3].map((src, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-[14px] border-2 border-white/30"
            style={{ width: 28, height: 28, marginLeft: i === 0 ? 0 : 2 }}
          >
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---- right panel shell ------------------------------------------------

const WelcomeRightPanel = ({ showToast }) => (
  // Right showcase panel — Figma frame 2858:23709.
  // Layer 1 (bg): cream base #FFFEFC + gold ellipse top-right + red ellipse bottom-left + grid texture.
  // Layer 2 (img group): tilted student photo frame 2858:23713 + five floating cards above.
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-[#FFFEFC] lg:block"
  >
    {/* Layer 1 — background */}
    <WelcomeRightPanelBg />

    {/* Layer 2 — main photo frame, Figma node 2858:23714 */}
    <div
      className="absolute flex items-center justify-center"
      style={{
        width: 573.583,
        height: 634.782,
        left: 'calc(50% - 23.32px)',
        top: 'calc(50% + 0.39px)',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div style={{ transform: 'rotate(4deg)' }}>
        <div
          className="relative overflow-hidden rounded-[26px] bg-transparent"
          style={{
            width: 533.094,
            height: 599.054,
            border: '10px solid #EEDEB8',
            boxShadow: '0 2px 2px -1px rgba(27,36,44,0.04), 0 16px 24px -6px rgba(27,36,44,0.16)',
          }}
        >
          <div
            className="absolute overflow-hidden"
            style={{ inset: '-10px -9.91px -9.95px -10px' }}
          >
            <img
              src={studentsPhoto}
              alt=""
              className="absolute inset-0 size-full max-w-none object-cover pointer-events-none"
            />
            {/* Small ellipse overlay — top-left corner of photo */}
            <div
              className="absolute flex items-center justify-center"
              style={{ width: 238.012, height: 238.012, left: -75.84, top: -85.44 }}
            >
              <div style={{ transform: 'rotate(-4deg)' }}>
                <img
                  aria-hidden="true"
                  src={ellipsePhotoOverlay}
                  className="pointer-events-none"
                  style={{ width: 223, height: 223 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Layer 2 — floating cards */}
    <JobsAvailableCard />
    <SavedPill />
    <VerifiedProfilePill />
    <MyExperienceCard />
    <InstitutionCard />

    {/* Welcome toast — Figma node 2858:23758. Auto-hides after 3 s. */}
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
    setTimeout(() => navigate('/onboarding/talent/dob'), 600);
  };

  return (
    <section className="mx-auto flex w-full min-h-[calc(100vh-160px)] bg-white">
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

          {/* Wavy Ghana-flag divider â€" Figma vector 2858:24050.
              Sits between the headline block and the "About 4 minutes"
              meta pill on the welcome screen. */}
          <WavyDivider />

          {/* "About 4 minutes" meta pill â€" Figma node 2858:23824.
              The dot is a 16Ã—16 SVG (filter id 2858:23829): a soft
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

          {/* Primary CTA â€" "Let's Begin" */}
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

      <WelcomeRightPanel showToast={showToast} />
    </section>
  );
};

export default OnboardingWelcomePage;
