import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiErrorNote from '../../components/shared/ApiErrorNote.jsx';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { getApiErrorCode } from '../../services/apiErrors.js';
import { captureStep, verifyContactOtp, resendContactOtp } from '../../services/onboarding.api.js';
import { toGhanaE164 } from '../../services/onboardingMappers.js';
import Button from '../../components/ui/Button.jsx';
import { TextInput, VerificationCode, StickyActionBar } from '../../components/ui/form';
import Field from '../../components/ui/form/Field.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import TalentOnboardingPanel from '../../components/sections/talentAuth/TalentOnboardingPanel.jsx';
import {
  TALENT_CONTACT_PHOTO_CARDS,
  TalentContactOverlay,
} from '../../components/sections/talentAuth/TalentContactPanelContent.jsx';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  LoadingSpinner,
  MessageBubbleIcon,
} from '../../components/shared/assets.jsx';
import {
  AlertDiamondIcon,
  CloseIcon,
  ClockIcon,
  GhanaFlagRoundIcon,
  MailIcon,
  MailRowIcon,
  PhoneRowIcon,
  ShieldCheckIcon,
  SuccessCheckIcon,
  TALENT_ASTERISK,
} from '../../components/sections/talentAuth/talentIcons.jsx';
import otpSms from '../../assets/talent-onboarding/otp-sms.svg';
import otpEmail from '../../assets/talent-onboarding/otp-email.svg';
import otpHero from '../../assets/talent-onboarding/otp-hero.svg';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingContactPage');

/*
 * OnboardingContactPage — Step 3 of the talent onboarding flow.
 * Maps to user story US-1.1.1-03 ("Capture Talent Contact Information").
 * Route: /onboarding/contact.
 *
 * Figma source frames:
 *   default        2385:38797
 *   filled         2397:31787
 *   loader         2397:32237   (CTA pressed-state only — no full overlay)
 *   otp-modal      2397:32664
 *   otp-error      2403:14917   (red cell variant)
 *   otp-ready      2403:15506   (green cell variant + enabled CTA)
 *   success        2403:26840
 *
 * Flow:
 *   1. Empty form → "Send Verification Code" CTA disabled.
 *   2. User fills phone (required) + optional whatsapp + email (required).
 *      CTA enables.
 *   3. Submit → CTA shows brief pressed-spinner state, then OTP modal mounts.
 *   4. User types 6-digit code. While typing, cells animate to "active".
 *      Demo accepts "123456"; everything else after 6 digits shows error.
 *   5. On valid code → success modal with summary rows.
 *   6. Success modal "Continue To Address" → /address isn't built yet so we
 *      bounce to /welcome instead (TODO: swap to '/onboarding/talent/address'
 *      when the route ships).
 */

// ---- local helpers ---------------------------------------------------

const DEMO_VALID_OTP = '123456';

// Format MM:SS for the OTP timer.
const formatMmSs = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// Light masking helper used in the success modal summary rows. Keeps the
// last 2 phone digits visible, masks the middle: "+233 24 ••• ••67".
const maskPhone = (raw) => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return raw;
  const tail = digits.slice(-2);
  return `+233 ${digits.slice(0, 2)} ••• ••${tail}`;
};

// Mask an email "kofi@example.com" → "k•••i@example.com".
const maskEmail = (raw) => {
  const [name, host] = raw.split('@');
  if (!name || !host) return raw;
  if (name.length <= 2) return `${name[0]}•••@${host}`;
  return `${name[0]}•••${name[name.length - 1]}@${host}`;
};

// ---- Helper-row diamond glyph ----------------------------------------

// Design-system canonical helper icon for the Contact step (Figma path
// repeated at every helper-text row in the input-state dump). Renders as
// `fill="currentColor"` so the surrounding wrapper's text color wins.

// ---- Phone number input (composite) ----------------------------------

const PhoneNumberInput = ({
  id,
  label,
  required = false,
  trailingLabel,
  trailingLabelClassName,
  placeholder = '23 533 45',
  value,
  onChange,
  onBlur,
  helperText,
  error,
  countryCode = '+233',
  flag = <GhanaFlagRoundIcon />,
}) => {
  // Figma 2388:19683 / 2389:19884 — country-code prefix (96px) butted up
  // against the number input. The prefix carries radius `10 0 0 10`, the
  // number input radius `0 10 10 0`. Both share the same 51px height,
  // border, and 2.5px shadow.
  //
  // Field-level edge states (raw HTML "input state" dump):
  //   error    → red chrome on both halves, red value/placeholder text,
  //              red trailing-label, diamond-icon helper row in danger.
  //   default  → grey 1px outline, neutral text, focus-within picks up
  //              the brand-green yellow-tinted halo (unchanged from v1).
  //
  // No `filled` boolean is needed for chrome — only the trailing-label
  // color flips when filled, which the caller drives via
  // `trailingLabelClassName`.

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

  // Trailing-label color resolution: explicit caller override wins; else
  // red on error, brand-green default. (The "filled" trailing color is
  // also brand-green, so callers do nothing extra when the field fills.)
  const resolvedTrailingClass =
    trailingLabelClassName ?? (hasError ? 'text-danger' : 'text-brand-green');

  return (
    <Field
      asteriskClassName={TALENT_ASTERISK}
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
        {/* Country-code prefix (left, 96px, rounded-left) */}
        <button
          type="button"
          className={classNames(
            'flex h-full w-[96px] shrink-0 items-center gap-2 rounded-l-[10px] bg-white pl-[9px] pr-3 focus:outline-none',
            prefixBoxClasses
          )}
          aria-label={`Country code ${countryCode}`}
        >
          <span className="inline-flex size-5 shrink-0">{flag}</span>
          <ChevronDownIcon className="size-2 shrink-0 text-[#575755]" />
          <span
            className={classNames('text-[14px] font-medium leading-6', prefixTextColor)}
            style={{ letterSpacing: '0.2px' }}
          >
            {countryCode}
          </span>
        </button>

        {/* Number input (right, flex-1, rounded-right) */}
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

// ---- Eyebrow pill (step 03 / Contact Information) --------------------

const ContactEyebrow = () => (
  // Figma node 2385:38983. Single 1px border, leading 8px dot with halo,
  // serif italic "03" + body label.
  <span className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-2 rounded-[8px] border border-brand-green-light-active bg-[#FFFEFC] px-4 py-1">
    <span
      aria-hidden="true"
      className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-hover"
      style={{ boxShadow: '0 0 4px 0 #006B3F' }}
    />
    <span className="font-heading text-[15px] font-semibold text-[#B5B5B5]">03</span>
    <span
      className="text-[12px] leading-[18px] text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Contact Information
    </span>
  </span>
);

// ---- OTP modal -------------------------------------------------------

const OtpModal = ({ phone, email, onClose, onChangeContact, onVerified, onLockout }) => {
  // Self-contained state machine for the OTP modal. Owns:
  //   - the 6-digit code being typed
  //   - the "wrong code" flash (`hasError`)
  //   - the 09:58 countdown (`secondsLeft`) — when this hits 0 the modal
  //     enters the expired state (Figma 2403:31758): cells disabled, amber
  //     outline, expired helper row, resend becomes the primary action
  //   - the 59s resend cooldown (`resendIn`)
  //   - attempts remaining — counted down on every wrong submission;
  //     when it hits 1 the modal outline escalates from sage to red
  //     (Figma 2403:31233); at 0 we fire `onLockout` so the parent can
  //     surface the abandon-onboarding pop-up (Figma 2403:24060)
  //
  // Cells render via VerificationCode's existing `state` / `error` props —
  // we just toggle them. Outline color, helper-row copy, CTA copy, and the
  // caption tone are all derived from the booleans below.

  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(598); // 09:58
  const [resendIn, setResendIn] = useState(59);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setResendIn((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const isExpired = secondsLeft === 0;

  const handleCodeChange = (next) => {
    log('otp change:', next.length);
    if (isExpired) return; // freeze input while expired — user must resend
    // Clear the error halo as soon as the user edits — whether they
    // delete a digit or overwrite one. Compare against the previous
    // value so retyping the same wrong code keeps the halo on.
    if (hasError && next !== code) setHasError(false);
    setCode(next);
  };

  const isComplete = code.length === 6;
  const isInvalid = isComplete && hasError && !isExpired;
  const isReady = isComplete && !hasError && !isExpired;

  const handleVerify = async () => {
    if (!isComplete || isExpired || verifying) return;
    setVerifying(true);
    try {
      // Backend checks the code it emailed at the contact step
      // (staging accepts 123456 while the test bypass is on).
      await verifyContactOtp(code);
      log('otp verified by backend');
      onVerified();
    } catch (err) {
      const errCode = getApiErrorCode(err);
      log('otp rejected:', errCode, 'attempts before:', attemptsLeft);
      setHasError(true);
      if (errCode === 'OTP_EXPIRED') {
        setSecondsLeft(0);
        return;
      }
      const nextAttempts = Math.max(0, attemptsLeft - 1);
      setAttemptsLeft(nextAttempts);
      // 0 attempts (or backend lock) -> caller surfaces the abandon-onboarding pop-up.
      if (nextAttempts === 0 || errCode === 'OTP_LOCKED') onLockout?.();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!isExpired && resendIn > 0) return;
    log('resend code requested');
    try {
      await resendContactOtp();
    } catch (err) {
      const errCode = getApiErrorCode(err);
      log.error('resend failed:', errCode);
      if (errCode === 'OTP_RESEND_TOO_SOON') return;
    }
    setCode('');
    setHasError(false);
    setAttemptsLeft(3);
    setSecondsLeft(598);
    setResendIn(59);
  };

  // Outline color tiers — sage default → red on escalated error
  // (≤1 attempt left + error showing) → amber on expired. Mirrors Figma
  // frames 2403:22869 (default) / 2403:23779 (soft error) /
  // 2403:31233 (escalated error) / 2403:31758 (expired).
  const outlineColor = isExpired
    ? '#C8951A'
    : hasError && attemptsLeft <= 1
      ? '#C0392B'
      : '#C1D4C4';

  // Resend is "ready" (clickable green) when either expired OR cooldown 0.
  const resendReady = isExpired || resendIn === 0;

  // Bottom caption — counts attempts; on error/expired it appends
  // " before lockout" and turns red.
  const showLockoutWarning = (hasError && attemptsLeft <= 1) || isExpired;
  const attemptsLabel = `${attemptsLeft} attempt${
    attemptsLeft === 1 ? '' : 's'
  } remaining${showLockoutWarning ? ' before lockout' : ''}`;

  // CTA copy: ready → verify; complete-but-wrong → re-enter prompt;
  // anything else (incomplete OR expired) → enter-all prompt.
  const ctaCopy = isReady
    ? 'Verify & Continue'
    : isComplete && hasError && attemptsLeft <= 1
      ? 'Re-Enter All 6 Digits To Continue'
      : isComplete
        ? 'Verify & Continue'
        : 'Enter all 6 digits to continue';

  // Hero chip swaps icon + tint based on modal state.
  //   default / soft-error → brand-green-light + message bubble
  //   escalated error      → pink (#f9ebea) + message bubble (red)
  //   expired              → cream (#faf4e8) + clock (amber)
  const heroVariant = isExpired
    ? {
        bg: '#faf4e8',
        color: '#B8712A',
        icon: <ClockIcon className="size-7" />,
      }
    : hasError && attemptsLeft <= 1
      ? {
          bg: '#f9ebea',
          color: '#C0392B',
          icon: <MessageBubbleIcon />,
        }
      : {
          bg: '#ebf1ec',
          color: '#387440',
          icon: <img src={otpHero} alt="" aria-hidden="true" className="size-7" />,
        };

  // H2 swap.  default → "Check your messages."
  //          error    → "That code was wrong." (italic red)
  //          expired  → "That code has expired" (italic amber)
  const heading = isExpired ? (
    <>
      That code has <span style={{ color: '#B8712A' }}>expired.</span>
    </>
  ) : hasError && attemptsLeft <= 1 ? (
    <>
      That code was <span className="text-danger">wrong.</span>
    </>
  ) : (
    <>
      Check your <span className="text-brand-green">messages.</span>
    </>
  );

  // Alert-card content below cells — replaces the plain helper row.
  // Figma 2403:23779 (soft) is single-line; 2403:31233 (hard) and
  // 2403:31758 (expired) stack title + body.
  const alertCard = isExpired
    ? {
        bg: '#f7efdd',
        border: '#fcdec1',
        iconBg: '#fcdec1',
        iconColor: '#B8712A',
        titleColor: '#7B241C',
        bodyColor: '#A93226',
        title: 'This code has expired — request a new one to continue',
        body: 'Codes are valid for 10 minutes. A fresh code will be sent to the same phone and email.',
      }
    : hasError && attemptsLeft <= 1
      ? {
          bg: '#f9ebea',
          border: '#ebc2bd',
          iconBg: '#ebc2bd',
          iconColor: '#7B241C',
          titleColor: '#7B241C',
          bodyColor: '#A93226',
          title: 'Maximum attempts reached',
          body: 'You entered an incorrect code 3 times. A 15-minute cooldown has been applied.',
        }
      : null; // Figma 8027:207212: soft error = red cells only, no alert card

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
      style={{ background: 'rgba(28, 42, 33, 0.7)' }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[24px] bg-white px-8 py-9 max-sm:px-4 max-sm:pt-4 max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:overscroll-contain max-sm:[&_button.w-full]:h-11 max-sm:[&_button.w-full]:min-h-11 max-sm:[&_button.w-full]:py-0 max-sm:[&_button.w-full]:rounded-[10px] max-sm:[&_button.w-full]:text-[14px]! max-sm:[&_button.w-full]:whitespace-nowrap max-sm:[&_button.w-full]:drop-shadow-none! max-sm:[&_button.w-full]:shadow-none! max-sm:rounded-b-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          outline: `3px solid ${outlineColor}`,
          outlineOffset: '-3px',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.14), 0 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover"
        >
          <CloseIcon />
        </button>

        {/* Hero chip — bg + icon swap with modal state (default green /
            pink on hard-error / cream + clock on expired). */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="flex size-16 items-center justify-center rounded-[10px]"
            style={{ background: heroVariant.bg, color: heroVariant.color }}
          >
            {heroVariant.icon}
          </span>

          {/* Channel badges row */}
          <div className="flex items-center gap-1.5">
            <ChannelBadge label="SMS" />
            <span aria-hidden="true" className="text-[12px] text-neutral-dark">
              +
            </span>
            <ChannelBadge label="Email" />
          </div>

          <h2
            id="otp-modal-title"
            className="font-heading font-semibold text-[#1C2A21] max-sm:text-[22px]! max-sm:leading-7! max-sm:tracking-normal!"
            style={{ fontSize: 28, lineHeight: '33.6px', letterSpacing: '-0.56px' }}
          >
            {heading}
          </h2>

          <p className="text-[14px] leading-5 text-[#70706E]" style={{ letterSpacing: '0.2px' }}>
            We sent a 6-digit code to confirm your contact details.
          </p>

          <p
            className="text-[12px] font-semibold leading-5 text-[#575755]"
            style={{ letterSpacing: '0.1px' }}
          >
            {maskPhone(phone)} · {maskEmail(email)}
          </p>

          <button
            type="button"
            onClick={onChangeContact}
            className="text-[12px] font-medium leading-tight text-brand-green underline underline-offset-2"
          >
            Change contact details
          </button>
        </div>

        {/* OTP cells. We force the per-box state with `state=` so the cells
            paint correctly without VerificationCode → Field also rendering
            its built-in helper text (we render our own styled alert card
            below to match Figma 2403:23779 / 31233 / 31758). */}
        <div className="mt-5 flex justify-center">
          <VerificationCode
            length={6}
            value={code}
            onChange={handleCodeChange}
            state={isExpired ? 'disabled' : isInvalid ? 'error' : undefined}
            autoFocus={!isExpired}
            cellGap={4}
            emptyPlaceholder="-"
          />
        </div>

        {/* Styled alert card — rendered for soft-error / hard-error /
            expired. Single-line for soft error; title + body for the
            other two. Replaces the plain helper row from v1. */}
        {alertCard && (
          <div
            role="alert"
            className="mt-3 flex w-full items-start gap-3 rounded-[8px] border px-3 py-2.5"
            style={{ background: alertCard.bg, borderColor: alertCard.border }}
          >
            <span
              className="mt-[2px] inline-flex size-[18px] shrink-0 items-center justify-center rounded-[6px]"
              style={{ background: alertCard.iconBg, color: alertCard.iconColor }}
              aria-hidden="true"
            >
              <AlertDiamondIcon className="size-3" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5 text-left">
              <p
                className="text-[12px] font-semibold leading-5"
                style={{ color: alertCard.titleColor, letterSpacing: '0.2px' }}
              >
                {alertCard.title}
              </p>
              {alertCard.body && (
                <p
                  className="text-[11px] max-lg:text-[12px] leading-[16px]"
                  style={{ color: alertCard.bodyColor, letterSpacing: '0.2px' }}
                >
                  {alertCard.body}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timer + resend row. Timer turns red when expired so the user's
            eye snaps to the resend CTA, which has gone from grey → green. */}
        <div className="mt-5 flex flex-col items-center gap-1">
          <div
            className="inline-flex items-center gap-1.5 text-[12px] text-[#70706E]"
            style={{ letterSpacing: '0.2px' }}
          >
            <ClockIcon className="size-4" />
            <span>Code expires in</span>
            <span
              className={classNames(
                'font-semibold',
                isExpired ? 'text-danger' : 'text-brand-green'
              )}
            >
              {formatMmSs(secondsLeft)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[12px] text-[#70706E]">
            Didn&apos;t receive it?
            <button
              type="button"
              disabled={!resendReady}
              onClick={handleResend}
              className={classNames(
                'text-[12px] font-medium leading-tight underline-offset-2 hover:underline disabled:no-underline disabled:cursor-not-allowed',
                resendReady ? 'text-brand-green' : 'text-[#BABAB7]'
              )}
            >
              Resend code{!resendReady ? ` (${resendIn}s)` : ''}
            </button>
          </span>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!isReady}
          onClick={handleVerify}
          rightIcon={<ArrowRightIcon />}
          className="mt-4 w-full"
        >
          {ctaCopy}
        </Button>

        <p
          className={classNames(
            'mt-2 text-center text-[10px] max-lg:text-[12px] leading-4',
            showLockoutWarning ? 'font-medium text-danger' : 'text-[#70706E]'
          )}
          style={{ letterSpacing: '0.2px' }}
        >
          {attemptsLabel}
        </p>

        <p
          className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] max-lg:text-[12px] leading-4 text-[#959592]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ShieldCheckIcon className="size-3" />
          Data encrypted at rest · Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

const ChannelBadge = ({ label }) => (
  // Small cream-green pill carrying the channel name — SMS / Email.
  // Reuses the eyebrow chassis from `ContactEyebrow` at smaller size.
  <span className="inline-flex items-center gap-1 rounded-[6px] border border-brand-green-light-hover bg-brand-green-light px-2 py-0.5">
    <img src={label === 'SMS' ? otpSms : otpEmail} alt="" aria-hidden="true" className="size-3" />
    <span
      className="text-[11px] max-lg:text-[12px] font-medium text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      {label}
    </span>
  </span>
);

// ---- Success modal ---------------------------------------------------

const ContactVerifiedModal = ({ phone, email, onClose, onContinue }) => (
  // Figma 2403:26840. Same shell shape as IdentityCapturedModal but with
  // a softer outer shadow and a "Contact verified" caption pill instead
  // of the section-complete chip.
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="contact-verified-title"
    className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
    style={{ background: 'rgba(28, 42, 33, 0.7)' }}
  >
    <div
      className="relative w-full max-w-[440px] rounded-[24px] bg-white px-8 py-8 max-sm:px-4 max-sm:pt-4 max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:overscroll-contain max-sm:[&_button.w-full]:h-11 max-sm:[&_button.w-full]:min-h-11 max-sm:[&_button.w-full]:py-0 max-sm:[&_button.w-full]:rounded-[10px] max-sm:[&_button.w-full]:text-[14px]! max-sm:[&_button.w-full]:whitespace-nowrap max-sm:[&_button.w-full]:drop-shadow-none! max-sm:[&_button.w-full]:shadow-none! max-sm:rounded-b-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      style={{
        outline: '3px solid #C1D4C4',
        outlineOffset: '-3px',
        boxShadow:
          '0 24px 64px rgba(0,0,0,0.12), 0 4px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-7 items-center justify-center rounded-full bg-brand-green-light text-brand-green transition-colors hover:bg-brand-green-light-hover"
      >
        <CloseIcon />
      </button>

      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className="flex size-16 items-center justify-center rounded-[10px] bg-brand-green-light-hover"
          style={{ boxShadow: '0 1px 1px rgba(27,36,44,0.12)' }}
        >
          <SuccessCheckIcon />
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-[6px] border border-brand-green-light-active px-3 py-1"
          style={{ background: 'rgba(235, 241, 236, 0.50)' }}
        >
          <span
            aria-hidden="true"
            className="size-2 rounded-full border-[1.5px] border-success bg-white"
            style={{ boxShadow: '0 0 4px 0 #387440' }}
          />
          <span
            className="text-[12px] leading-[18px] text-[#999999]"
            style={{ letterSpacing: '0.2px' }}
          >
            Contact verified
          </span>
        </span>
        <h2
          id="contact-verified-title"
          className="font-heading font-semibold text-[#1C2A21] max-sm:text-[22px]! max-sm:leading-7! max-sm:tracking-normal!"
          style={{ fontSize: 29, lineHeight: '34.8px', letterSpacing: '-0.64px' }}
        >
          You’re <span className="text-brand-green">Verified</span>
        </h2>
        <p className="text-[12px] leading-[18px] text-[#959592]" style={{ letterSpacing: '0.2px' }}>
          Your phone and email have been confirmed. Here&apos;s what we verified.
        </p>
      </div>

      {/* Summary card */}
      <ul
        className="mt-5 flex flex-col rounded-[16px] border border-brand-green-light-hover"
        style={{ background: 'rgba(235, 241, 236, 0.30)' }}
      >
        <li className="flex items-center justify-between px-4 py-3 text-[12px] leading-5">
          <span className="flex items-center gap-2 text-[#575755]">
            <PhoneRowIcon className="size-3" />
            Phone
          </span>
          <span className="font-semibold text-brand-green">{maskPhone(phone)}</span>
        </li>
        <li className="flex items-center justify-between border-t border-brand-green-light-hover px-4 py-3 text-[12px] leading-5">
          <span className="flex items-center gap-2 text-[#575755]">
            <MailRowIcon className="size-3" />
            Email
          </span>
          <span className="font-semibold text-brand-green">{maskEmail(email)}</span>
        </li>
      </ul>

      {/* Slim progress rail (Figma shows ~16%) */}
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-brand-green-light">
        <div className="h-full rounded-full bg-brand-green" style={{ width: '16%' }} />
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={onContinue}
        rightIcon={<ArrowRightIcon />}
        className="mt-5 w-full"
      >
        Continue To Address
      </Button>

      <p
        className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] max-lg:text-[12px] leading-4 text-[#959592]"
        style={{ letterSpacing: '0.2px' }}
      >
        <ShieldCheckIcon className="size-3" />
        Data encrypted at rest · Ghana Data Protection Act compliant
      </p>
    </div>
  </div>
);

// ---- Lockout modal ---------------------------------------------------

const COOLDOWN_SECONDS = 898; // 14:58 per Figma 2403:24342 caption

// Single row in the LockoutModal's "what happened" card.
const LockoutDetailRow = ({ icon, title, body, withTopBorder }) => (
  <li
    className="flex items-start gap-2 px-4 py-3"
    style={withTopBorder ? { borderTop: '1px solid rgba(192,57,43,0.12)' } : undefined}
  >
    <span
      className="mt-[2px] inline-flex size-[18px] shrink-0 items-center justify-center rounded-[6px]"
      style={{ background: '#EBC2BD', color: '#C0392B' }}
      aria-hidden="true"
    >
      {icon}
    </span>
    <div className="flex flex-col gap-0.5 text-left">
      <p
        className="text-[12px] font-semibold leading-5"
        style={{ color: '#7B241C', letterSpacing: '0.2px' }}
      >
        {title}
      </p>
      <p
        className="text-[11px] max-lg:text-[12px] leading-[16px]"
        style={{ color: '#A93226', letterSpacing: '0.2px' }}
      >
        {body}
      </p>
    </div>
  </li>
);

const LockoutModal = ({ onSendNewCode, onChangeContact, onContactSupport }) => {
  // Figma 2403:24342. Terminal state after the user burns all 3 OTP
  // attempts. Locks the flow for 15 minutes; "Send a new code" is
  // disabled until the cooldown elapses. "Change contact details"
  // is always available — it returns the user to the Contact form.
  log('LockoutModal mount; cooldown:', COOLDOWN_SECONDS);

  const [cooldownLeft, setCooldownLeft] = useState(COOLDOWN_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setCooldownLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const cooldownReady = cooldownLeft === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lockout-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 max-sm:items-end max-sm:px-0"
      style={{ background: 'rgba(28, 42, 33, 0.7)' }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[24px] bg-white px-8 py-8 max-sm:px-4 max-sm:pt-4 max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:overscroll-contain max-sm:[&_button.w-full]:h-11 max-sm:[&_button.w-full]:min-h-11 max-sm:[&_button.w-full]:py-0 max-sm:[&_button.w-full]:rounded-[10px] max-sm:[&_button.w-full]:text-[14px]! max-sm:[&_button.w-full]:whitespace-nowrap max-sm:[&_button.w-full]:drop-shadow-none! max-sm:[&_button.w-full]:shadow-none! max-sm:rounded-b-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        style={{
          outline: '3px solid #C0392B',
          outlineOffset: '-3px',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.14), 0 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Red error medallion — 72px circle, 32px alert triangle, 2px
            halo. */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span
            className="relative flex size-[72px] items-center justify-center rounded-full text-white"
            style={{
              background: '#C0392B',
              boxShadow: 'inset 0 0 0 2px #E8A49D, 0 3px 0 #922B21',
            }}
          >
            <AlertDiamondIcon className="size-8" />
          </span>

          {/* VERIFICATION FAILED badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1"
            style={{ background: '#FDECEA', borderColor: '#E8A49D' }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: '#C0392B' }}
            />
            <span
              className="text-[10px] max-lg:text-[12px] font-bold uppercase leading-[14px]"
              style={{ color: '#C0392B', letterSpacing: '0.5px' }}
            >
              Verification failed
            </span>
          </span>

          <h2
            id="lockout-title"
            className="font-heading font-semibold text-[#1C2A21] max-sm:text-[22px]! max-sm:leading-7! max-sm:tracking-normal!"
            style={{ fontSize: 29, lineHeight: '34.8px', letterSpacing: '-0.64px' }}
          >
            Something went <span className="text-danger">wrong.</span>
          </h2>

          <p
            className="max-w-[360px] text-[13px] leading-[20.8px] text-[#70706E]"
            style={{ letterSpacing: '0.2px' }}
          >
            We couldn&apos;t verify your contact details. Here&apos;s what happened.
          </p>
        </div>

        {/* What-happened details card */}
        <ul
          className="mt-5 flex flex-col rounded-[16px] border"
          style={{ background: '#FDECEA', borderColor: '#E8A49D' }}
        >
          <LockoutDetailRow
            icon={<AlertDiamondIcon className="size-3" />}
            title="Maximum attempts reached"
            body="You entered an incorrect code 3 times. A 15-minute cooldown has been applied."
          />
          <LockoutDetailRow
            icon={<ClockIcon className="size-3" />}
            title="Verification window expired"
            body="OTP codes are valid for 10 minutes only — this one has expired."
            withTopBorder
          />
        </ul>

        {/* Cooldown timer card */}
        <div
          className="mt-4 flex items-center gap-3 rounded-[10px] border px-3 py-2.5"
          style={{ background: '#F8F8F4', borderColor: 'rgba(0,0,0,0.07)' }}
        >
          <span
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px]"
            style={{ background: '#C6C6C3', color: 'white' }}
            aria-hidden="true"
          >
            <ClockIcon className="size-4" />
          </span>
          <span
            className="flex-1 text-[12px] font-semibold text-[#70706E]"
            style={{ letterSpacing: '0.2px' }}
          >
            You can request a new code in
          </span>
          <span
            className="text-[14px] font-bold tabular-nums text-[#111111]"
            style={{ letterSpacing: '0.2px' }}
          >
            {formatMmSs(cooldownLeft)}
          </span>
        </div>

        {/* Primary CTA — disabled while cooldown active. */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!cooldownReady}
          onClick={onSendNewCode}
          rightIcon={cooldownReady ? <ArrowRightIcon /> : undefined}
          className="mt-4 w-full"
        >
          Send a new code
        </Button>

        {/* Secondary — always enabled. */}
        <button
          type="button"
          onClick={onChangeContact}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border bg-white py-3 text-[14px] font-semibold leading-tight text-[#70706E]"
          style={{ borderColor: '#C6C6C3' }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M11.5 2.5l2 2L5 13l-3 .5.5-3z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          Change contact details
        </button>

        {/* Help footer */}
        <p
          className="mt-4 text-center text-[11px] max-lg:text-[12px] leading-4"
          style={{ color: '#BABAB7', letterSpacing: '0.2px' }}
        >
          Still having trouble?{' '}
          <button
            type="button"
            onClick={onContactSupport}
            className="font-bold underline underline-offset-2"
            style={{ color: '#387440' }}
          >
            Contact support
          </button>{' '}
          or check that your phone and email are correct.
        </p>
      </div>
    </div>
  );
};

// ---- main page -------------------------------------------------------

const OnboardingContactPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState({ phone: false, whatsapp: false, email: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Surfaces the abandon-onboarding pop-up (Figma 2403:24060) when the
  // user burns through all 3 OTP attempts inside the modal.
  const [showLockout, setShowLockout] = useState(false);

  // Per-field validation. Real schema-level validation will live in zod
  // once the contract is final; for now keep it inline so the edge-case
  // visual states (error / filled / verified) fire predictably.
  //
  //   phone:    9-digit Ghana mobile (after +233 prefix), required.
  //   whatsapp: optional — must be 9 digits IF present.
  //   email:    standard local@host.tld, required.
  const phoneDigits = phone.replace(/\D/g, '');
  const whatsappDigits = whatsapp.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 9;
  const isWhatsappValid = whatsapp === '' || whatsappDigits.length === 9;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValid = isPhoneValid && isWhatsappValid && isEmailValid;

  const showFieldError = (key) => touched[key] || submitAttempted;

  const phoneError =
    showFieldError('phone') && !isPhoneValid
      ? phone === ''
        ? 'Phone number is required'
        : 'Enter a valid 9-digit Ghana number'
      : undefined;

  const whatsappError =
    showFieldError('whatsapp') && whatsapp !== '' && !isWhatsappValid
      ? 'Enter a valid 9-digit Ghana number'
      : undefined;

  const emailError =
    showFieldError('email') && !isEmailValid
      ? email === ''
        ? 'Email address is required'
        : 'Enter a valid email address'
      : undefined;

  // "Verrifed input" state (raw HTML block 4): email passes format check
  // AND the user has interacted with the field. Drives a green leading
  // mail icon + green helper-row + the verified box outline.
  const isEmailVerified = isEmailValid && touched.email;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitAttempted(true);
    if (!isValid) {
      log('submit blocked — invalid', { isPhoneValid, isWhatsappValid, isEmailValid });
      return;
    }
    log('submit', { phone, whatsapp, email });
    setApiError('');
    setIsSubmitting(true);
    captureStep('contact', {
      email: email.trim(),
      phoneNumber: toGhanaE164(phone),
      ...(whatsapp ? { whatsappNumber: toGhanaE164(whatsapp) } : {}),
    })
      .then(() => {
        log('contact captured, verification code issued');
        setShowOtp(true);
      })
      .catch((err) => setApiError(getApiErrorMessage(err)))
      .finally(() => setIsSubmitting(false));
  };

  const markTouched = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  const handleVerified = () => {
    log('contact verified');
    setShowOtp(false);
    setShowSuccess(true);
  };

  const handleContinueToAddress = () => {
    setShowSuccess(false);
    // /address isn't built yet — bounce to welcome so the user isn't
    // stranded. Swap to '/onboarding/talent/address' when the route ships.
    navigate('/onboarding/talent/address');
  };

  return (
    <section className="relative flex w-full flex-1 min-h-0 flex-col overflow-hidden bg-white">
      <OnboardingHeader currentKey="contact" />
      {/* Two-column area — left scrolls, right panel stays fixed */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-1 min-h-0 overflow-y-auto no-scrollbar max-md:scroll-pb-28 max-lg:relative max-lg:z-10">
          <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-16 max-md:px-4 max-md:pt-3 max-md:pb-3">
            <form
              onSubmit={handleSubmit}
              className="my-auto flex w-full max-w-[739px] flex-col items-center gap-6 text-center max-md:gap-3"
              noValidate
            >
              <ContactEyebrow />

              <h1
                className="max-w-[554px] font-heading font-semibold text-[#1C2A21] max-md:text-[24px]! max-md:leading-tight!"
                style={{
                  fontSize: 'clamp(2.25rem, 5vw, 3.375rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.64px',
                }}
              >
                How do we <span className="text-brand-green">reach you?</span>
              </h1>

              <p
                className="max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
                style={{ letterSpacing: '0.2px' }}
              >
                We&apos;ll send a quick verification code to confirm it&apos;s really you. Keeping
                your profile secure and your opportunities real.
              </p>

              <WavyDivider />

              <div className="flex w-full flex-col gap-4 text-left md:px-5 max-md:gap-3">
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 max-md:gap-y-3">
                  <PhoneNumberInput
                    id="contact-phone"
                    label="Phone Number"
                    required
                    trailingLabel="SMS verification"
                    value={phone}
                    onChange={setPhone}
                    onBlur={markTouched('phone')}
                    error={phoneError}
                  />
                  <PhoneNumberInput
                    id="contact-whatsapp"
                    label="Whatsapp Number"
                    trailingLabel="Optional"
                    value={whatsapp}
                    onChange={setWhatsapp}
                    onBlur={markTouched('whatsapp')}
                    error={whatsappError}
                    helperText={
                      whatsappError ? undefined : 'Leave blank if same as your phone number above'
                    }
                  />
                </div>

                <TextInput
                  asteriskClassName={TALENT_ASTERISK}
                  id="contact-email"
                  label="Email Address"
                  required
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={markTouched('email')}
                  error={emailError}
                  verified={isEmailVerified}
                  leftIcon={<MailIcon />}
                  leftIconClassName={
                    isEmailVerified
                      ? 'text-success'
                      : email
                        ? 'text-brand-green'
                        : 'text-content-tertiary'
                  }
                  labelTrailing="Email verification"
                  labelTrailingClassName={
                    emailError
                      ? 'text-danger'
                      : isEmailVerified
                        ? 'text-success'
                        : email
                          ? 'text-[#595959]'
                          : 'text-brand-green'
                  }
                  helperText={
                    emailError
                      ? undefined
                      : isEmailVerified
                        ? 'Email format verified'
                        : 'Important updates, job matches, and your verification code will be sent here'
                  }
                  helperIcon={<AlertDiamondIcon className="size-4 shrink-0" />}
                  helperIconClassName={
                    emailError ? undefined : isEmailVerified ? 'text-success' : 'text-brand-green'
                  }
                  helperTextClassName={
                    emailError
                      ? undefined
                      : isEmailVerified
                        ? 'text-success'
                        : 'text-neutral-darker'
                  }
                />
              </div>

              <ApiErrorNote message={apiError} className="mx-auto" />
              <StickyActionBar bleed={16}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isValid || isSubmitting}
                  state={isSubmitting ? 'active' : undefined}
                  leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
                  rightIcon={<ArrowRightIcon />}
                  className="mt-2 w-full"
                  aria-busy={isSubmitting}
                >
                  Send Verification Code
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
          photoCards={TALENT_CONTACT_PHOTO_CARDS}
          overlayContent={<TalentContactOverlay />}
          showWatchTutorial={false}
        />
      </div>

      {showOtp && (
        <OtpModal
          phone={phone}
          email={email}
          onClose={() => setShowOtp(false)}
          onChangeContact={() => setShowOtp(false)}
          onVerified={handleVerified}
          onLockout={() => {
            log('lockout → surfacing abandon-onboarding pop-up');
            setShowOtp(false);
            setShowLockout(true);
          }}
        />
      )}
      {showSuccess && (
        <ContactVerifiedModal
          phone={phone}
          email={email}
          onClose={() => setShowSuccess(false)}
          onContinue={handleContinueToAddress}
        />
      )}
      {showLockout && (
        <LockoutModal
          onSendNewCode={() => {
            log('lockout cooldown done; re-opening OTP with fresh code');
            setShowLockout(false);
            setShowOtp(true);
          }}
          onChangeContact={() => {
            log('lockout → change contact details');
            setShowLockout(false);
          }}
          onContactSupport={() => {
            log('lockout → contact support');
            // No support route yet — sink to /login as a stand-in.
            navigate('/login');
          }}
        />
      )}
    </section>
  );
};

export default OnboardingContactPage;
