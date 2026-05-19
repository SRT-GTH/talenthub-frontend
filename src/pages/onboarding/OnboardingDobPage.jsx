import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { TextInput } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  CalendarIcon,
  LoadingSpinner,
  MortarboardIcon,
  UsersGroupIcon,
} from '../../components/shared/assets.jsx';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingDobPage');

/*
 * OnboardingDobPage â€” Step 1 of the talent onboarding flow.
 * Maps to user story US-1.1.1-01 ("Start Self-Onboarding and Choose
 * Age Path"). Route: /onboarding/dob.
 * Figma source: nodes 2236:830 (default), 2282:7563 / 8944 / 9846
 * (filled-default), 2282:8435 (verified), 2282:9302 / 10259 (loading
 * overlay), 2282:10628 (under-18 notice). All variants share the
 * same composition; the differences are in input state, CTA copy,
 * and whether the notes banner / loading overlay are rendered.
 *
 * The DOB input drives age computation locally; once a valid DOB
 * verifies the age is rendered as a small green badge in the
 * label row. If age < 18, a soft amber notice appears below the
 * input prompting parental consent.
 *
 * On submit the page shows the full-screen "Building your student
 * profileâ€¦" overlay before navigating onward â€” the next route is
 * not yet wired, so the placeholder timeout returns to /welcome
 * for now.
 */

// ---- age helper -------------------------------------------------------

// Parse the user-entered string into a Date. We accept the design
// placeholder format DD-MM-YYYY and tolerate slashes too. Returns null
// when the input is incomplete or doesn't represent a real date.
const parseDob = (raw) => {
  const trimmed = raw.trim();
  if (trimmed.length < 8) return null;
  const parts = trimmed.split(/[-/]/);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map((s) => Number(s));
  if (!d || !m || !y || y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  if (String(y).length !== 4) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  if (date > new Date()) return null;
  return date;
};

const yearsBetween = (date) => {
  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  const hasHadBirthday =
    now.getMonth() > date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() >= date.getDate());
  if (!hasHadBirthday) years -= 1;
  return years;
};

// ---- right panel ------------------------------------------------------

const DataProtectedCard = () => (
  // Trust banner sitting in the upper-left of the right panel â€” Figma
  // node 2282:9030. Cream tint, hairline white outline, MTN-like square
  // icon plus two lines of copy.
  <div
    className="absolute rounded-[13px] bg-[#EBF1EC] p-[14px] shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{
      left: 24,
      top: 320,
      width: 268,
      outline: '1px solid #FFFEFC',
      outlineOffset: '-1px',
    }}
  >
    <div className="flex items-center gap-[9px]">
      <span className="flex size-9 items-center justify-center rounded-[9px] bg-brand-green text-white">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M9 1.5l6.5 2.5v4c0 4-2.5 6.5-6.5 8-4-1.5-6.5-4-6.5-8V4L9 1.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 9l1.7 1.7L11.5 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-bold leading-[15px] text-[#595959]">Data Protected</p>
        <p className="text-[10px] leading-[14px] text-[#595959] opacity-[0.72]">
          Encrypted Â· Never shared without consent
        </p>
      </div>
    </div>
  </div>
);

const CompliancePill = () => (
  // Top-right pill â€” Figma node 2282:9043. White rounded pill with
  // green check + Ghana Data Protection Act compliance copy.
  <div
    className="absolute inline-flex items-center gap-2 rounded-[10px] border border-black/5 bg-white px-2.5 py-2 shadow-[0_2px_0_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.1)]"
    style={{ right: 24, top: 200 }}
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
      Ghana Data Protection Act compliant
    </span>
  </div>
);

const ExperiencePickerCard = () => (
  // "Adult experience / Youth experience" floating selector â€” Figma
  // node 2282:9050. The Adult row is the active option (green/600);
  // Youth is muted grey. Each row carries a 6Ã—6 dot indicator.
  <div
    className="absolute rounded-[12px] bg-white p-4 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ right: 24, top: 500, width: 235 }}
  >
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
      <span className="text-[12px] font-semibold leading-tight text-brand-green">
        Adult experience
      </span>
    </div>
    <div className="mt-3 flex items-center gap-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#D6D6D2]" />
      <span className="text-[12px] font-normal leading-tight text-[#959592]">Youth experience</span>
    </div>
  </div>
);

const WatchTutorialCard = () => (
  // "Watch tutorial" instance â€” Figma 2282:9059. Small card with a
  // play glyph and a short copy block describing the current step.
  <button
    type="button"
    className="absolute inline-flex items-center gap-3 rounded-[12px] border border-black/5 bg-white px-4 py-3 shadow-[0_8px_16px_-4px_rgba(27,36,44,0.16)]"
    style={{ right: 24, bottom: 30, width: 211 }}
  >
    <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M5 4l5 3-5 3V4z" fill="currentColor" />
      </svg>
    </span>
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-medium uppercase tracking-wider text-[#959592]">
        Watch tutorial
      </span>
      <span
        className="text-[14px] font-semibold capitalize leading-tight text-brand-green"
        style={{ letterSpacing: '0.14px' }}
      >
        Start (Date of Birth)
      </span>
    </div>
  </button>
);

const BasicsRightPanel = () => (
  // Right showcase panel â€” Figma Frame 141 (2282:9014). 42% of the
  // outer width to match the rest of the marketing screens. We keep
  // the brand-green base + the cream/pink orbs + a single rotated
  // photo placeholder, with the trust badges and pickers stacked on
  // top. The full 3-photo composition is deferred â€” once a final
  // panel image lands we can swap this for a single `<img>` the way
  // we did on LoginPage.
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
      style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
    />
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
      style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
    />

    {/* Big tilted photo placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '14%',
        top: '8%',
        width: '60%',
        height: '38%',
        transform: 'rotate(5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid rgba(255,255,255,0.18)',
        outlineOffset: '-6px',
      }}
    />

    <DataProtectedCard />
    <CompliancePill />
    <ExperiencePickerCard />
    <WatchTutorialCard />
  </aside>
);

// ---- loading overlay --------------------------------------------------

const LoadingOverlay = () => (
  // Modal that appears after a successful submit. Figma node
  // 2282:23881 â€” sits below the safari chrome (top 52px) with a
  // dim backdrop and a centered white card with the mortarboard
  // icon, two-toned headline and a 3px progress rail.
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="onboarding-loading-title"
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(17, 17, 17, 0.70)' }}
  >
    <div
      className="flex w-[420px] flex-col gap-6 rounded-[24px] bg-white px-[49px] py-8 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
      style={{ outline: '3px solid #C1D4C4', outlineOffset: '-3px' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-[47px] items-center justify-center rounded-[10px] bg-brand-green-light">
          <MortarboardIcon />
        </span>
        <div className="flex flex-col items-center gap-1 text-center">
          <p
            id="onboarding-loading-title"
            className="font-display font-normal text-[#111111]"
            style={{ fontSize: 28, lineHeight: '29.4px' }}
          >
            Building your <span className="italic text-brand-green">student profileâ€¦</span>
          </p>
          <p className="text-[14px] leading-5 text-[#70706E]" style={{ letterSpacing: '0.2px' }}>
            Personalising your GTH experience. Just a moment.
          </p>
        </div>
      </div>

      {/* 3px animated progress rail */}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#EBF1EC]">
        <div
          className="h-full rounded-full bg-brand-green"
          style={{ width: '40%', animation: 'onboardingLoaderSlide 1.6s ease-in-out infinite' }}
        />
      </div>
    </div>

    {/* Keyframes for the indeterminate rail â€” keeps the overlay
        self-contained without polluting global CSS. */}
    <style>{`
      @keyframes onboardingLoaderSlide {
        0%   { transform: translateX(-100%); }
        50%  { transform: translateX(20%); }
        100% { transform: translateX(220%); }
      }
    `}</style>
  </div>
);

// ---- page -------------------------------------------------------------

const OnboardingDobPage = () => {
  log('mount');
  const navigate = useNavigate();
  const { setDateOfBirth } = useOnboarding();
  const [dob, setDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Derived state â€” single source of truth for "is this entry valid".
  const parsed = useMemo(() => parseDob(dob), [dob]);
  const age = parsed ? yearsBetween(parsed) : null;
  const isVerified = age !== null && age >= 13 && age <= 99;
  const isUnder18 = isVerified && age < 18;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isVerified || isSubmitting) return;
    log('submit', { dob, age, isMinor: age < 18 });
    // Persist DOB to the onboarding context so downstream pages (Header
    // breadcrumb, Education page's next-route branch, ParentInfo gate)
    // can read `isMinor` without re-asking.
    setDateOfBirth({ dob, age });
    setIsSubmitting(true);
    // Brief inline loading before the overlay takes over â€” gives the
    // CTA's pressed state a moment to read before the modal mounts.
    setTimeout(() => {
      setShowOverlay(true);
      setTimeout(() => {
        // Next route isn't built yet; bounce back to welcome so the
        // user can navigate intentionally instead of getting stranded.
        setShowOverlay(false);
        setIsSubmitting(false);
        navigate('/onboarding/talent/personal-info');
      }, 2400);
    }, 400);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] flex-col bg-white">
      <OnboardingHeader currentKey="start" percent={78} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-16">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[554px] flex-col items-center gap-6 text-center"
            noValidate
          >
            {/* Eyebrow â€” "01" italic ordinal + "The Basics" label */}
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand-green" />
              <span
                className="font-display italic text-[#B5B5B5]"
                style={{ fontSize: 16, fontStyle: 'italic' }}
              >
                01
              </span>
              <span
                className="text-[12px] leading-[18px] text-brand-green"
                style={{ letterSpacing: '0.2px' }}
              >
                The Basics
              </span>
            </div>

            <h1
              className="font-display font-normal text-black"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              When were you <span className="italic text-brand-green">born?</span>
            </h1>

            <p
              className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              Your age shapes your entire GTH experience. We use it once to make sure everything we
              show you is built for you.
            </p>

            <WavyDivider />

            {/* DOB input + dynamic age badge in the label row */}
            <div className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="onboarding-dob"
                  className="text-[14px] font-medium leading-6 text-[#111111]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  Date of Birth
                </label>
                {isVerified && (
                  <span
                    className="text-[12px] font-bold leading-5 text-brand-green"
                    style={{ letterSpacing: '0.1px' }}
                  >
                    {age} years old
                  </span>
                )}
              </div>
              <TextInput
                id="onboarding-dob"
                type="text"
                inputMode="numeric"
                placeholder="DD-MM-YYYY"
                autoComplete="bday"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                verified={isVerified}
                leftIcon={<CalendarIcon />}
                helperText="Enter your day, month, then year â€” we'll route you to the right experience."
              />
            </div>

            {/* Under-18 notice â€” Figma node 2282:23881 (notes symbol).
                Translucent cream bg with a 1px gold-light outline. */}
            {isUnder18 && (
              <div
                role="status"
                className="flex w-full items-center justify-center gap-[10px] rounded-[10px] px-[10px] py-3"
                style={{
                  background: 'rgba(250, 244, 232, 0.50)',
                  outline: '1px solid #EEDEB8',
                  outlineOffset: '-1px',
                }}
              >
                <UsersGroupIcon />
                <p
                  className="text-[12px] leading-[18px] text-[#B48617]"
                  style={{ letterSpacing: '0.2px' }}
                >
                  Parent or guardian contact needed. Your account is activated straight after.
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isVerified || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-1 w-full max-w-[420px]"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Setting Things Up' : 'Continue'}
            </Button>

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
          </form>
        </div>

        <BasicsRightPanel />
      </section>

      {showOverlay && <LoadingOverlay />}
    </div>
  );
};

export default OnboardingDobPage;
