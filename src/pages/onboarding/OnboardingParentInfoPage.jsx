import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiErrorNote from '../../components/shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { captureStep } from '../../services/onboarding.api.js';
import { splitFullName, toGhanaE164 } from '../../services/onboardingMappers.js';
import Button from '../../components/ui/Button.jsx';
import { TextInput, Select, StickyActionBar } from '../../components/ui/form';
import Field from '../../components/ui/form/Field.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  GhanaFlagRoundIcon,
  LoadingSpinner,
  MailIcon,
  ParentIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersGroupIcon,
} from '../../components/shared/assets.jsx';
import { useOnboarding } from '../../hooks/useOnboarding.js';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import TalentOnboardingPanel from '../../components/sections/talentAuth/TalentOnboardingPanel.jsx';
import { PersonalOverlayCards } from '../../components/sections/talentAuth/TalentPersonalInfoPanelContent.jsx';

const log = debug('OnboardingParentInfoPage');

/*
 * OnboardingParentInfoPage — Step 06 of the talent onboarding flow, but
 * only for below-18 talents. Adult talents skip from Education straight
 * to Review (handled in OnboardingEducationPage.handleContinue).
 *
 * Maps to user story US-1.1.1-06 ("Capture Parent/Guardian Contact").
 * Route: /onboarding/talent/parent-info.
 *
 * Figma source (file Bin8roWL8sloyc36IgFMuT):
 *   2858:28725 / 2858:28726 — default empty state ("Parents Info")
 *   2865:38068 — filled state (all 4 fields populated)
 *   2865:38635 — loader (button-inline submit spinner)
 *   2865:42649 — success popup ("Guardian saved")
 *   2865:39074 / 2865:39075 — error state (frame 8 family)
 *   2865:39313 / 2865:39551 / 2865:40056 / 2865:40323 — input edge cases
 *   2865:40590 — loader 2 (full-screen)
 *
 * Layout:
 *   ┌──────────────────────────────────────────────┐
 *   │ Guardian Name*    │ Relationship To You*    │
 *   │ Phone Number*     │ Email Address* (one-of) │
 *   ├──────────────────────────────────────────────┤
 *   │ Blue legal disclosure banner (one card)      │
 *   └──────────────────────────────────────────────┘
 *
 * Validation rule (per the disclosure banner copy):
 *   - Guardian name + relationship are always required.
 *   - Parent email is required (the opt-out notice goes by email; SMS
 *     isn't live). Phone is optional.
 *
 * Submit flow:
 *   - Disabled CTA → "Fill In Your Guardian Details"
 *   - Valid CTA → "Save And Continue" (Figma 2865:38068 footer)
 *   - On submit: 900ms button-inline spinner → navigate to /review
 *   - Defensive redirect: if the user lands here as an adult (age >= 18)
 *     we send them straight to /review since the page doesn't apply.
 */

// ---- helper-row diamond glyph (re-used from Contact step) -----------

const AlertDiamondIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.075 2.012C8.027 1.997 7.975 1.997 7.927 2.012a.85.85 0 0 0-.148.067 4 4 0 0 0-.307.35L2.43 7.472a4 4 0 0 0-.351.307.85.85 0 0 0-.067.148.108.108 0 0 0 0 .148.85.85 0 0 0 .067.147c.06.07.179.196.351.351l5.043 5.043c.173.174.278.292.351.351a.85.85 0 0 0 .148.067.108.108 0 0 0 .148 0 .85.85 0 0 0 .148-.067c.073-.06.178-.177.351-.351l5.043-5.043a4 4 0 0 0 .351-.307.85.85 0 0 0 .067-.148.108.108 0 0 0 0-.148.85.85 0 0 0-.067-.148 4 4 0 0 0-.351-.351L8.527 2.43a4 4 0 0 0-.307-.351.85.85 0 0 0-.148-.067zM7.555.871a1.55 1.55 0 0 1 .891 0c.202.066.361.178.497.293.126.107.266.247.42.4l5.073 5.074c.154.154.294.294.4.42.116.135.228.295.293.497a1.55 1.55 0 0 1 0 .891c-.066.202-.177.361-.293.497-.107.126-.247.266-.4.42L9.363 14.436c-.154.154-.294.294-.42.4-.135.116-.295.228-.497.293a1.55 1.55 0 0 1-.891 0c-.202-.066-.361-.177-.497-.293-.126-.107-.266-.247-.42-.4L1.566 9.363c-.154-.154-.294-.294-.4-.42-.116-.135-.228-.295-.293-.497a1.55 1.55 0 0 1 0-.891c.066-.202.177-.361.293-.497.107-.126.247-.266.4-.42l5.074-5.073c.154-.154.294-.294.42-.4.135-.116.295-.228.497-.293zM8 4c.331 0 .6.269.6.6v2.8a.6.6 0 1 1-1.2 0V4.6c0-.331.269-.6.6-.6zm0 5.6c.331 0 .6.269.6.6v1.2a.6.6 0 1 1-1.2 0v-1.2c0-.331.269-.6.6-.6z"
      fill="currentColor"
    />
  </svg>
);

// ---- composite phone input (Ghana prefix) ----------------------------
// Mirrors OnboardingContactPage's PhoneNumberInput. We re-declare it
// here rather than extracting to /components because the chrome carries
// brand-green focus styles that don't make sense outside the onboarding
// step pages — TextInput is the right shape for everywhere else.
const PhoneNumberInput = ({
  id,
  label,
  required = false,
  trailingLabel,
  placeholder = '23 533 45',
  value,
  onChange,
  onBlur,
  helperText,
  error,
}) => {
  const hasError = Boolean(error);
  const prefixBoxClasses = hasError
    ? 'border border-r-0 border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]'
    : 'border border-r-0 border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)]';
  const prefixTextColor = hasError ? 'text-danger' : 'text-[#575755]';
  const numberBoxClasses = hasError
    ? 'border border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]'
    : 'border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus-within:bg-yellow-light focus-within:border-brand-green-light-active focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';
  const inputTextClasses = hasError
    ? 'text-danger placeholder:text-danger'
    : 'text-[#111111] placeholder:text-[#575755]';
  const resolvedTrailingClass = hasError ? 'text-danger' : 'text-brand-green';

  return (
    <Field
      label={label}
      htmlFor={id}
      required={required}
      helperText={helperText}
      error={error}
      labelTrailing={trailingLabel}
      labelTrailingClassName={resolvedTrailingClass}
      helperIcon={<AlertDiamondIcon className="size-4 shrink-0" />}
    >
      <div className="flex h-[51px] w-full items-stretch max-md:h-11 max-md:[&_*]:shadow-none!">
        <button
          type="button"
          className={classNames(
            'flex h-full w-[96px] shrink-0 items-center gap-2 rounded-l-[10px] bg-white pl-[9px] pr-3 focus:outline-none',
            prefixBoxClasses
          )}
          aria-label="Country code +233"
        >
          <span className="inline-flex size-5 shrink-0">
            <GhanaFlagRoundIcon />
          </span>
          <ChevronDownIcon className="size-2 shrink-0 text-[#575755]" />
          <span
            className={classNames('text-[14px] font-medium leading-6', prefixTextColor)}
            style={{ letterSpacing: '0.2px' }}
          >
            +233
          </span>
        </button>

        <div
          className={classNames(
            'flex h-full min-w-0 flex-1 items-center gap-2 rounded-r-[10px] bg-white pl-5 pr-4',
            numberBoxClasses
          )}
        >
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={hasError || undefined}
            className={classNames(
              'w-0 min-w-0 flex-1 border-none bg-transparent text-[14px] leading-6 font-medium outline-none placeholder-shown:font-normal placeholder-shown:leading-5 placeholder:font-normal',
              inputTextClasses
            )}
            style={{ letterSpacing: '0.2px' }}
          />
        </div>
      </div>
    </Field>
  );
};

// ---- options data -----------------------------------------------------

const RELATIONSHIP_OPTIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'stepfather', label: 'Stepfather' },
  { value: 'stepmother', label: 'Stepmother' },
  { value: 'grandparent', label: 'Grandparent' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'sibling', label: 'Elder sibling' },
  { value: 'guardian', label: 'Legal guardian' },
  { value: 'other', label: 'Other relative' },
];

// ---- eyebrow ----------------------------------------------------------

const ParentEyebrow = () => (
  // Figma 2858:28741 family — cream-amber pill with leading dot, italic
  // "06b" ordinal + "Parent / Guardian" label. Amber palette
  // distinguishes this step from the green-eyebrowed talent-side steps.
  <span
    className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-2 rounded-[8px] border px-4 py-1"
    style={{ background: '#FFFEFC', borderColor: '#EEDEB8' }}
  >
    <span
      aria-hidden="true"
      className="size-2 rounded-full"
      style={{
        background: '#FAF4E8',
        border: '1.5px solid #C8951A',
        boxShadow: '0 0 4px #C8951A',
      }}
    />
    <span
      className="font-display italic text-[#B5B5B5]"
      style={{ fontSize: 16, lineHeight: 'normal' }}
    >
      06b
    </span>
    <span
      className="text-[12px] leading-[18px]"
      style={{ color: '#C8951A', letterSpacing: '0.2px' }}
    >
      Parent / Guardian
    </span>
  </span>
);

// ---- legal disclosure banner -----------------------------------------

const LegalDisclosureBanner = () => (
  // Figma 2858:28854 (default frame). Blue-tinted rounded card with an
  // icon + two-line disclosure copy. Same chassis as the Review page's
  // DPA banner but with copy specific to the under-18 parent flow.
  <div
    className="flex w-full items-start gap-3 rounded-[12px] px-5 py-4"
    style={{ background: 'rgba(234,239,251,0.4)', border: '1px solid #E0E7F9' }}
  >
    <span
      className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: '#3062D4' }}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M6 8.5V5.5M6 3.7v.1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
    <p
      className="text-left text-[12px] leading-[18px] text-[#3062D4]"
      style={{ letterSpacing: '0.2px' }}
    >
      The notification tells your parent/guardian about GTH and their right to opt you out within 7
      days if they have concerns. We send it to their email, so an email address is required. Your
      account opens immediately regardless.
    </p>
  </div>
);

// ---- page -------------------------------------------------------------

const OnboardingParentInfoPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const { isMinor } = useOnboarding();

  // Defensive redirect — adults shouldn't see this page (Education
  // page already short-circuits them past it). If they land here via
  // direct URL, bounce them to /review so the flow stays coherent.
  // `isMinor === null` means DOB hasn't been captured yet — also send
  // them back rather than block the page on incomplete state.
  useEffect(() => {
    if (isMinor === false) {
      log('not a minor — redirecting to /review');
      navigate('/onboarding/talent/review', { replace: true });
    }
  }, [isMinor, navigate]);

  const [guardianName, setGuardianName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({
    guardianName: false,
    relationship: false,
    phone: false,
    email: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markTouched = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  // Per-field validation: name, relationship and email are required;
  // phone is optional.
  const phoneDigits = phone.replace(/\D/g, '');
  const isPhoneFilled = phone !== '';
  const isPhoneValid = isPhoneFilled ? phoneDigits.length === 9 : true;
  const isEmailFilled = email !== '';
  const isEmailValid = isEmailFilled ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true;
  // Email is required: it's how the parent gets the opt-out notice (SMS isn't
  // live yet), and the backend rejects the step without it. Phone is optional.

  const showFieldError = (key) => touched[key] || submitAttempted;

  const guardianNameError =
    showFieldError('guardianName') && guardianName.trim().length === 0
      ? 'Guardian name is required'
      : undefined;
  const relationshipError =
    showFieldError('relationship') && relationship === '' ? 'Pick a relationship' : undefined;
  const phoneError =
    showFieldError('phone') && isPhoneFilled && !isPhoneValid
      ? 'Enter a valid 9-digit Ghana number'
      : undefined;
  const emailError = !showFieldError('email')
    ? undefined
    : !isEmailFilled
      ? "Your parent or guardian's email is required"
      : !isEmailValid
        ? 'Enter a valid email address'
        : undefined;

  const isValid = useMemo(
    () =>
      guardianName.trim().length > 0 &&
      relationship !== '' &&
      isEmailFilled &&
      isPhoneValid &&
      isEmailValid,
    [guardianName, relationship, isEmailFilled, isPhoneValid, isEmailValid]
  );

  // CTA copy mirrors Figma 2858:28741 (disabled prompt) → 2865:38068
  // (filled "Save And Continue"). The submitting label re-uses the
  // disabled string so the spinner reads cleanly against it.
  const ctaLabel = isValid ? 'Save And Continue' : 'Fill In Your Guardian Details';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);
    if (!isValid) {
      log('submit blocked — invalid', {
        guardianName: !!guardianName,
        relationship: !!relationship,
        hasEmail: isEmailFilled,
        isPhoneValid,
        isEmailValid,
      });
      return;
    }
    log('submit', { guardianName, relationship, hasPhone: isPhoneFilled, hasEmail: isEmailFilled });
    setApiError('');
    setIsSubmitting(true);
    const { first, last } = splitFullName(guardianName);
    captureStep('parent', {
      parentFirstName: first,
      ...(last ? { parentLastName: last } : {}),
      parentRelationship: relationship,
      ...(isPhoneFilled ? { parentPhone: toGhanaE164(phone) } : {}),
      parentEmail: email.trim(),
    })
      .then(() => navigate('/onboarding/talent/review'))
      .catch((err) => setApiError(getApiErrorMessage(err)))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="mx-auto flex w-full min-h-[calc(100vh-160px)] flex-1 flex-col overflow-y-auto no-scrollbar bg-white max-md:scroll-pb-28">
      <OnboardingHeader currentKey="parent" />

      <section className="relative flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center max-lg:relative max-lg:z-10 px-6 pt-12 pb-12 md:pt-14 max-md:px-4 max-md:pt-3 max-md:pb-3">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center max-md:gap-3"
            noValidate
            aria-busy={isSubmitting}
          >
            <ParentEyebrow />

            <h1
              className="font-display font-normal text-black max-md:text-[24px]! max-md:leading-tight!"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1 }}
            >
              Your <span className="italic text-brand-green">parent</span> or guardian.
            </h1>

            <p
              className="max-w-[520px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
              style={{ letterSpacing: '0.2px' }}
            >
              We need a parent or guardian contact. Required for students under 18 by Ghanaian law —
              we&apos;ll notify them after registration, not now.
            </p>

            <WavyDivider />

            <div className="flex w-full flex-col gap-4 text-left max-md:gap-3">
              <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 max-md:gap-y-3">
                <TextInput
                  id="parent-guardian-name"
                  label="Guardian Name"
                  required
                  placeholder="Enter their full name"
                  autoComplete="name"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  onBlur={markTouched('guardianName')}
                  error={guardianNameError}
                  verified={guardianName.trim().length > 0 && !guardianNameError}
                  leftIcon={<UserIcon />}
                />
                <Select
                  label="Relationship To You"
                  required
                  placeholder="Select Relationship"
                  options={RELATIONSHIP_OPTIONS}
                  value={relationship}
                  onChange={(v) => {
                    setRelationship(v);
                    markTouched('relationship')();
                  }}
                  leftIcon={<ParentIcon />}
                  error={relationshipError}
                  verified={Boolean(relationship)}
                />
                <PhoneNumberInput
                  id="parent-phone"
                  label="Phone Number"
                  trailingLabel="Optional"
                  value={phone}
                  onChange={setPhone}
                  onBlur={markTouched('phone')}
                  error={phoneError}
                  helperText={
                    phoneError ? undefined : 'Optional. Lets us reach them by phone if we need to'
                  }
                />
                <TextInput
                  id="parent-email"
                  label="Email Address"
                  type="email"
                  trailingLabel="Required"
                  trailingLabelClassName={emailError ? 'text-danger' : 'text-brand-green'}
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={markTouched('email')}
                  error={emailError}
                  helperText={emailError ? undefined : 'We email the opt-out notice here'}
                  verified={isEmailFilled && isEmailValid}
                  leftIcon={<MailIcon />}
                />
              </div>

              <LegalDisclosureBanner />
            </div>

            <ApiErrorNote message={apiError} className="mx-auto" />
            <StickyActionBar bleed={16}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                state={isSubmitting ? 'active' : undefined}
                leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
                rightIcon={<ArrowRightIcon />}
                className="mt-2 w-full max-w-[420px]"
                aria-busy={isSubmitting}
              >
                {isValid ? (
                  ctaLabel
                ) : (
                  <>
                    <span className="max-sm:hidden">{ctaLabel}</span>
                    <span className="sm:hidden">Fill In Details</span>
                  </>
                )}
              </Button>
            </StickyActionBar>

            <p
              className="flex items-center justify-center gap-1.5 text-[10px] max-lg:text-[12px] leading-4 text-[#959592]"
              style={{ letterSpacing: '0.2px' }}
            >
              <ShieldCheckIcon className="text-[#959592]" />
              Data encrypted at rest · Ghana Data Protection Act compliant
            </p>

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

        {/* No Figma frame for this step: reuses the Personal-info panel art
            (8027:204534) on the shared responsive panel. */}
        <TalentOnboardingPanel
          photoCards={[]}
          showWatchTutorial={false}
          overlayContent={<PersonalOverlayCards />}
        />
      </section>
    </div>
  );
};

export default OnboardingParentInfoPage;
