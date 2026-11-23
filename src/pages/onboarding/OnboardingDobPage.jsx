import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiErrorNote from '../../components/shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { startOnboarding } from '../../services/onboarding.api.js';
import { toIsoDate } from '../../services/onboardingMappers.js';
import Button from '../../components/ui/Button.jsx';
import { TextInput, StickyActionBar } from '../../components/ui/form';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import StepEyebrow from '../../components/sections/talentAuth/StepEyebrow.jsx';
import {
  ArrowRightIcon,
  GenzDoodleStar,
  LoadingSpinner,
  MortarboardIcon,
} from '../../components/shared/assets.jsx';
import { AlertDiamondIcon } from '../../components/sections/talentAuth/talentIcons.jsx';
import calendarIcon from '../../assets/talent-onboarding/field-calendar.svg';
import minorWarningIcon from '../../assets/talent-onboarding/dob-minor-warning.svg';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import { debug } from '../../utils/debug.js';
import almostStar from '../../assets/talent-onboarding/almost-star.svg';
import almostSpotWard from '../../assets/talent-onboarding/almost-spot-ward.svg';
import almostDoneCheck from '../../assets/talent-onboarding/almost-done-check.svg';
import almostNextArrow from '../../assets/talent-onboarding/almost-next-arrow.svg';
import almostExtraPlus from '../../assets/talent-onboarding/almost-extra-plus.svg';
import almostActivatesCheck from '../../assets/talent-onboarding/almost-activates-check.svg';
import { createPortal } from 'react-dom';
import TalentOnboardingPanel from '../../components/sections/talentAuth/TalentOnboardingPanel.jsx';
import { DobOverlayCards } from '../../components/sections/talentAuth/TalentDobPanelContent.jsx';

const log = debug('OnboardingDobPage');

/*
 * OnboardingDobPage — Step 1 of the talent onboarding flow.
 * Maps to user story US-1.1.1-01 ("Start Self-Onboarding and Choose
 * Age Path"). Route: /onboarding/dob.
 * Figma source (8027 set): 202802 default, 203008 / 203214 verified (adult),
 * 203420 / 203626 / 203832 loading CTA, 204038 loading overlay, 204258
 * under-18 (amber age + notice), 204256 'Almost there.' minor interstitial
 * (bitmap only - transcribed), 204257 label/helper instance. Panel: see
 * TalentDobPanelContent. Headline = Bricolage Grotesque 600 (font-heading). All variants share the
 * same composition; the differences are in input state, CTA copy,
 * and whether the notes banner / loading overlay are rendered.
 *
 * The DOB input drives age computation locally; once a valid DOB
 * verifies the age is rendered as a small green badge in the
 * label row. If age < 18, a soft amber notice appears below the
 * input prompting parental consent.
 *
 * On submit the page shows the full-screen "Building your student
 * profile…" overlay before navigating onward — the next route is
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

// Digits typed one after another ("10052012", the phone keypad): shape them as DD-MM-YYYY while typing,
// including after our own dashes appear. Anything with other separators ("1/5/2012", "1-5-2012") is left as typed.
const shapeDob = (raw) => {
  if (!/^(\d*|\d{2}-\d*|\d{2}-\d{2}-\d*)$/.test(raw)) return raw;
  const d = raw.replace(/-/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 4)}-${d.slice(4)}`;
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

// ---- loading overlay --------------------------------------------------

const LoadingOverlay = () => (
  // Modal that appears after a successful submit. Figma node
  // 2282:23881 — sits below the safari chrome (top 52px) with a
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
      className="flex w-[420px] max-w-[calc(100%-2rem)] flex-col gap-6 rounded-[24px] bg-white px-[49px] max-sm:px-6 py-8 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
      style={{ outline: '3px solid #C1D4C4', outlineOffset: '-3px' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-[47px] items-center justify-center rounded-[10px] bg-brand-green-light">
          <MortarboardIcon />
        </span>
        <div className="flex flex-col items-center gap-1 text-center">
          <p
            id="onboarding-loading-title"
            className="font-heading font-semibold text-[#111111] max-sm:text-[22px]! max-sm:leading-7! max-sm:tracking-normal!"
            style={{ fontSize: 28, lineHeight: '29.4px' }}
          >
            Building your <span className="italic text-brand-green">student profile…</span>
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

    {/* Keyframes for the indeterminate rail — keeps the overlay
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

// ---- minor interstitial -----------------------------------------------

// "Almost There" pop-up, shown after date of birth for under-18s (stays open until they act):
//   Playful: ink edge + hard 4px shadow, tilted gold "FOR YOUR PARENT" sticker, three doodle stars, hearts illustration.
//   Focused: 3px pale green edge, soft shadow, gold star.
// Rows: done (mint check) · next (black arrow) · extra (gold plus + "One extra step"), then the green activation card.
// ⚠️ Figma's button reads "Next up: Education" / "Continue To Education", but Personal info is the next step here,
// so the button names that step.
const ALMOST_ROWS = [
  {
    icon: almostDoneCheck,
    tile: 'border border-[#2a5730] bg-[#cce5cc]',
    title: 'Date of birth',
    sub: 'Done',
  },
  {
    icon: almostNextArrow,
    tile: 'bg-[#1a1a1a]',
    title: 'Personal info · Contact · Address · Education',
    sub: 'Same as everyone else',
  },
  {
    icon: almostExtraPlus,
    tile: 'border-2 border-[#c8951a] bg-white',
    title: 'Parent or guardian contact',
    sub: 'Just a name and number — takes 30 seconds',
    extra: true,
  },
];

const AlmostThereOverlay = ({ onContinue, onClose }) => {
  debug('OnboardingDobPage')('render almost-there pop-up');
  const dialogRef = useRef(null);
  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-almost-title"
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: 'rgba(28, 42, 33, 0.7)' }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative flex max-h-[calc(100dvh-2rem)] w-[440px] max-w-full flex-col items-stretch gap-4 rounded-[24px] border-[3px] border-[#c1d4c4] bg-white px-10 py-8 shadow-[0_2px_2px_rgba(27,35,44,0.04),0_5px_11px_rgba(27,36,44,0.06)] outline-none max-sm:px-5 max-sm:py-6 playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_16px_20px_rgba(28,42,33,0.1),4px_4px_0_rgba(28,42,33,0.45)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-[-17px] hidden rotate-[5deg] whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-3 py-1.5 text-[13px] font-bold tracking-[0.5px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:block"
        >
          FOR YOUR PARENT
        </span>
        <GenzDoodleStar
          size={18}
          color="#C8951A"
          className="absolute hidden playful:block"
          style={{ right: 54, top: 116 }}
        />
        <GenzDoodleStar
          size={11}
          color="#C8951A"
          className="absolute hidden playful:block"
          style={{ right: 85, top: 148 }}
        />
        <GenzDoodleStar
          size={12}
          color="#387440"
          className="absolute hidden playful:block"
          style={{ left: 38, top: 122 }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="no-scrollbar flex min-h-0 flex-col items-center gap-4 overflow-y-auto pt-4">
          <img
            src={almostStar}
            alt=""
            aria-hidden="true"
            className="size-[58px] playful:hidden"
            draggable={false}
          />
          <img
            src={almostSpotWard}
            alt=""
            aria-hidden="true"
            className="hidden size-[88px] playful:block"
            draggable={false}
          />
          <div className="flex flex-col items-center gap-1 text-center">
            <h2
              id="onboarding-almost-title"
              className="font-heading text-[29px] font-semibold leading-[1.2] tracking-[-0.58px] text-[#1c2a21]"
            >
              Almost <span className="text-brand-green">There</span>
            </h2>
            <p className="max-w-[260px] text-[12px] leading-[18px] tracking-[0.2px] text-[#6b6b6b]">
              Here&apos;s exactly what&apos;s coming, then your account is live.
            </p>
          </div>

          <ul className="flex w-full flex-col text-left">
            {ALMOST_ROWS.map((row) => (
              <li
                key={row.title}
                className="flex min-h-14 items-center gap-6 border-b border-[#ebebeb] py-2 max-sm:gap-4"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${row.tile}`}
                >
                  <img
                    src={row.icon}
                    alt=""
                    aria-hidden="true"
                    className="size-[18px]"
                    draggable={false}
                  />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#2a5730]">
                    {row.title}
                    {row.extra ? (
                      <span className="rounded-[4px] border border-[#eedeb8] bg-[#faf4e8] px-2 text-[11px] font-semibold leading-[17px] text-[#8a6010]">
                        One extra step
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[12px] text-[#686f64]">{row.sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex w-full items-center gap-5 rounded-[8px] border border-[#c1d4c4] bg-[#ebf1ec] px-[7px] py-[9px] text-left max-sm:gap-3">
            <span className="flex size-[29px] shrink-0 items-center justify-center rounded-[10px] bg-[#3b7a38]">
              <img
                src={almostActivatesCheck}
                alt=""
                aria-hidden="true"
                className="size-[18px]"
                draggable={false}
              />
            </span>
            <span className="flex flex-col gap-0.5 text-[12px]">
              <span className="font-bold text-[#2a5730]">Your account activates immediately</span>
              <span className="text-brand-green">
                No waiting. No approval needed. You&apos;re in.
              </span>
            </span>
          </div>

          <div className="h-1 w-full rounded-full bg-brand-green-light" aria-hidden="true" />

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onContinue}
            rightIcon={<ArrowRightIcon />}
            className="w-full"
          >
            <span className="playful:hidden">Continue To Personal Info</span>
            <span className="hidden playful:inline">Next up: Personal info</span>
          </Button>
          <p className="flex items-center justify-center gap-1 text-center text-[12px] leading-4 tracking-[0.2px] text-[#6b6b6b]">
            Data encrypted at rest · Ghana Data Protection Act compliant
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ---- page -------------------------------------------------------------

const OnboardingDobPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { setDateOfBirth } = useOnboarding();
  const [dob, setDob] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Derived state — single source of truth for "is this entry valid".
  const parsed = useMemo(() => parseDob(dob), [dob]);
  const age = parsed ? yearsBetween(parsed) : null;
  const isVerified = age !== null && age >= 13 && age <= 99;
  const isUnder18 = isVerified && age < 18;
  // Why a complete date (DD-MM-YYYY) is refused, so Continue is never disabled without a reason.
  const dobProblem = (() => {
    if (isVerified || dob.trim().length < 10) return null;
    if (!parsed) {
      const [d, m, y] = dob.trim().split(/[-/]/).map(Number);
      const date = new Date(y, m - 1, d);
      const real = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
      if (real && date > new Date()) return 'That date is in the future.';
      return "That date doesn't exist. Check the day, month and year.";
    }
    if (age < 13) return 'You need to be 13 or older to join GTH.';
    return 'Check the year: that makes you over 99.';
  })();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isVerified || isSubmitting) return;
    log('submit', { dob, age, isMinor: age < 18 });
    // Persist DOB to the onboarding context so downstream pages (Header
    // breadcrumb, Education page's next-route branch, ParentInfo gate)
    // can read `isMinor` without re-asking.
    setDateOfBirth({ dob, age });
    setApiError('');
    setIsSubmitting(true);
    try {
      // Starts the backend onboarding session (stores the sessionToken).
      const res = await startOnboarding({ dob: toIsoDate(dob) });
      log('session started, agePath:', res?.agePath);
      setShowOverlay(true);
      if (age < 18) {
        log('minor: almost-there pop-up open; waits for the continue button');
        return;
      }
      setTimeout(() => {
        setShowOverlay(false);
        setIsSubmitting(false);
        navigate('/onboarding/talent/personal-info');
      }, 1200);
    } catch (err) {
      log.error('start failed:', err?.response?.status);
      setApiError(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden">
      <OnboardingHeader currentKey="start" />
      {/* Two-column area — left scrolls, right panel stays fixed */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-1 min-h-0 overflow-y-auto no-scrollbar max-md:scroll-pb-28 max-lg:relative max-lg:z-10">
          <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-16 max-md:px-4 max-md:pt-3 max-md:pb-3">
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center max-md:gap-3"
              noValidate
            >
              {/* Eyebrow: Focused pill / Playful gold sticker with stars (StepEyebrow) */}
              <StepEyebrow number="01" label="The Basics" />

              <h1
                className="font-heading font-semibold focused:font-sans text-[#1c2a21] max-md:text-[28px]! max-md:leading-tight!"
                style={{
                  fontSize: 'clamp(2.125rem, 4vw, 3.375rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.54px',
                }}
              >
                When were you <span className="text-brand-green">born?</span>
              </h1>

              <p
                className="max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
                style={{ letterSpacing: '0.2px' }}
              >
                Your age shapes your entire GTH experience. We use it once to make sure everything
                we show you is built for you.
              </p>

              <WavyDivider />

              {/* DOB input + dynamic age badge in the label row: full 698px column (latest date-of-birth frames). */}
              <div className="w-full">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="onboarding-dob"
                    className="text-[14px] font-medium leading-6 text-[#1c2a21]"
                    style={{ letterSpacing: '0.2px' }}
                  >
                    Date of Birth
                    <span
                      aria-hidden="true"
                      className="font-ui ml-0.5 text-[14px] font-semibold leading-none text-[#2e8b57]"
                    >
                      *
                    </span>
                  </label>
                  {/* Figma: 'Age' (#595959 12/500) until verified, then '<n> years old'
                      bold 12 - green for adults (#387440), amber (#c8951a) under 18. */}
                  {isVerified ? (
                    <span
                      aria-live="polite"
                      className={`text-[12px] font-bold leading-5 ${isUnder18 ? 'text-[#c8951a]' : 'text-brand-green'}`}
                      style={{ letterSpacing: '0.1px' }}
                    >
                      {age} years old
                    </span>
                  ) : (
                    <span
                      className="text-[12px] font-medium leading-5 text-[#595959]"
                      style={{ letterSpacing: '0.2px' }}
                    >
                      Age
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
                  onChange={(e) => setDob(shapeDob(e.target.value))}
                  verified={isVerified}
                  aria-invalid={dobProblem ? true : undefined}
                  aria-describedby={dobProblem ? 'onboarding-dob-problem' : undefined}
                  leftIcon={<img src={calendarIcon} alt="" aria-hidden="true" className="size-4" />}
                  required
                  helperIcon={<AlertDiamondIcon className="size-4 shrink-0" />}
                  // One line on desktop; where it must wrap (phones) it reads left-aligned, icon pinned to the first line.
                  helperIconClassName="self-start mt-px"
                  helperTextClassName="text-left md:whitespace-nowrap"
                  helperText="Enter your day, month, then year we'll route you to the right experience."
                />
              </div>

              {dobProblem ? (
                <p
                  id="onboarding-dob-problem"
                  role="alert"
                  className="w-full text-left text-[13px] font-medium leading-5 text-[#c0392b]"
                >
                  {dobProblem}
                </p>
              ) : null}

              {/* Under-18 notice (latest frames): full-width cream card, gold-light edge, amber warning triangle,
                  bold "One more step coming up" over one line of detail, left-aligned. */}
              {isUnder18 && (
                <div
                  role="status"
                  className="flex w-full items-start gap-2 rounded-[10px] border border-[#eedeb8] bg-[#fff8f0] py-2 pl-[3px] pr-3 text-left tracking-[0.2px]"
                >
                  <span className="mt-[3px] flex size-[22px] shrink-0 items-center justify-center rounded-[6px]">
                    <img
                      src={minorWarningIcon}
                      alt=""
                      aria-hidden="true"
                      className="size-[11px]"
                      draggable={false}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[14px] font-semibold leading-6 text-[#8b6813]">
                      One more step coming up
                    </span>
                    <span className="text-[12px] leading-[18px] text-[#8a6712]">
                      We&apos;ll need a parent or guardian&apos;s contact then your account is live
                      instantly.
                    </span>
                  </span>
                </div>
              )}

              <ApiErrorNote message={apiError} className="mx-auto" />
              <StickyActionBar bleed={16}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isVerified || isSubmitting}
                  state={isSubmitting ? 'active' : undefined}
                  leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
                  rightIcon={<ArrowRightIcon />}
                  className="mt-[47px] w-full max-md:mt-1"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? 'Setting Things Up' : 'Continue'}
                </Button>
              </StickyActionBar>

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
            </form>
          </div>
        </div>

        <TalentOnboardingPanel
          photoCards={[]}
          showWatchTutorial={false}
          overlayContent={<DobOverlayCards />}
        />
      </div>
      {showOverlay &&
        (isUnder18 ? (
          <AlmostThereOverlay
            onContinue={() => {
              log('almost-there: continue');
              setShowOverlay(false);
              setIsSubmitting(false);
              navigate('/onboarding/talent/personal-info');
            }}
            onClose={() => {
              log('almost-there: closed, staying on date of birth');
              setShowOverlay(false);
              setIsSubmitting(false);
            }}
          />
        ) : (
          <LoadingOverlay />
        ))}
    </section>
  );
};

export default OnboardingDobPage;
