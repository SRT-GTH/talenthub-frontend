import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiErrorNote from '../../components/shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { startOnboarding } from '../../services/onboarding.api.js';
import { toIsoDate } from '../../services/onboardingMappers.js';
import Button from '../../components/ui/Button.jsx';
import { TextInput, StickyActionBar } from '../../components/ui/form';
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
import starImg from '../../assets/talent-onboarding/almost-there-star.png';
import doneCheckImg from '../../assets/talent-onboarding/almost-there-done-check.png';
import arrowImg from '../../assets/talent-onboarding/almost-there-arrow.png';
import sparkleImg from '../../assets/talent-onboarding/almost-there-sparkle.png';
import activatesCheckImg from '../../assets/talent-onboarding/almost-there-activates-check.png';
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

// "Almost there." - shown instead of the loader for under-18 entries.
// Figma 8027:204256 (bitmap 'image 2', 562x643): copy transcribed from the
// bitmap; icons are crops of that Figma bitmap (assets/talent-onboarding/almost-there-*.png).
const AlmostThereOverlay = () => {
  debug('OnboardingDobPage')('render almost-there overlay');
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-almost-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(17, 17, 17, 0.70)' }}
    >
      <div className="flex max-h-[calc(100%-2rem)] w-[460px] max-w-full flex-col gap-5 overflow-y-auto no-scrollbar rounded-[28px] bg-white px-11 py-10 shadow-[0_6px_0_#bdbdbd] max-sm:px-5 max-sm:py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={starImg} alt="" draggable={false} className="h-[58px] w-auto" />
          <p
            id="onboarding-almost-title"
            className="font-display text-[36px] leading-none text-[#111111]"
          >
            Almost <span className="italic text-brand-green">there.</span>
          </p>
          <p className="text-[14px] leading-5 text-[#737373]">
            Here&apos;s exactly what&apos;s coming — then your account is live.
          </p>
        </div>
        <ul className="flex flex-col text-left">
          <li className="flex items-start gap-3 border-b border-[#E6E6E6] py-3">
            <img src={doneCheckImg} alt="" draggable={false} className="size-7 shrink-0" />
            <span className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#111111]">Date of birth</span>
              <span className="text-[12px] text-[#737373]">Done</span>
            </span>
          </li>
          <li className="flex items-start gap-3 border-b border-[#E6E6E6] py-3">
            <img src={arrowImg} alt="" draggable={false} className="size-7 shrink-0" />
            <span className="flex flex-col">
              <span className="text-[14px] font-semibold text-[#111111]">
                Personal info · Contact · Address · Education
              </span>
              <span className="text-[12px] text-[#737373]">Same as everyone else</span>
            </span>
          </li>
          <li className="flex items-start gap-3 py-3">
            <img src={sparkleImg} alt="" draggable={false} className="size-7 shrink-0" />
            <span className="flex flex-col">
              <span className="flex flex-wrap items-center gap-2 text-[14px] font-semibold text-[#111111]">
                Parent or guardian contact
                <span className="rounded-full bg-[#eedeb8] px-2 py-0.5 text-[11px] font-bold text-[#8a6410]">
                  One extra step
                </span>
              </span>
              <span className="text-[12px] text-[#737373]">
                Just a name and number — takes 30 seconds
              </span>
            </span>
          </li>
        </ul>
        <div className="flex items-center gap-3 rounded-[12px] border border-[#c1d4c4] bg-[#ebf1ec] p-3 text-left">
          <img
            src={activatesCheckImg}
            alt=""
            draggable={false}
            className="size-[30px] shrink-0 rounded-[8px]"
          />
          <span className="flex flex-col">
            <span className="text-[13px] font-bold text-[#2a5730]">
              Your account activates immediately
            </span>
            <span className="text-[12px] text-[#575755]">
              No waiting. No approval needed. You&apos;re in.
            </span>
          </span>
        </div>
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#EBF1EC]">
          <div className="h-full w-full rounded-full bg-brand-green" />
        </div>
      </div>
    </div>
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
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white">
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
              {/* Eyebrow pill - Figma 8027:203197: 126x27, r8, #c1d4c4 stroke, #fffefc */}
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-[#c1d4c4] bg-[#fffefc] px-4 py-1 max-md:px-3 max-md:py-0.5">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full border-[1.5px] border-[#1d7c4d] bg-[#e1eae2]"
                  style={{ boxShadow: '0 0 4px 0 #006B3F' }}
                />
                <span className="font-heading text-[15px] font-semibold leading-[19px] text-[#b5b5b5]">
                  01
                </span>
                <span
                  className="text-[12px] leading-[18px] text-brand-green"
                  style={{ letterSpacing: '0.2px' }}
                >
                  The Basics
                </span>
              </span>

              <h1
                className="font-heading font-semibold text-[#1c2a21] max-md:text-[28px]! max-md:leading-tight!"
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

              {/* DOB input + dynamic age badge in the label row */}
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
                  leftIcon={<CalendarIcon />}
                  required
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

              {/* Under-18 notice — Figma node 2282:23881 (notes symbol).
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
                    Parent or guardian contact needed . Your account is activated straight after.
                  </p>
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
                  className="mt-1 w-full max-w-[698px]"
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
      {showOverlay && (isUnder18 ? <AlmostThereOverlay /> : <LoadingOverlay />)}
    </section>
  );
};

export default OnboardingDobPage;
