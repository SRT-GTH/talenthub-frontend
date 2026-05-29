import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import { TextInput, VerificationCode } from '../../components/ui/form';
import Field from '../../components/ui/form/Field.jsx';
import WavyDivider from '../../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../../components/shared/OnboardingHeader.jsx';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  GhanaFlagRoundIcon,
  LoadingSpinner,
  MailIcon,
  MessageBubbleIcon,
  PhoneIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SuccessCheckIcon,
} from '../../components/shared/assets.jsx';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingContactPage');

/*
 * OnboardingContactPage â€” Step 3 of the talent onboarding flow.
 * Maps to user story US-1.1.1-03 ("Capture Talent Contact Information").
 * Route: /onboarding/contact.
 *
 * Figma source frames:
 *   default        2385:38797
 *   filled         2397:31787
 *   loader         2397:32237   (CTA pressed-state only â€” no full overlay)
 *   otp-modal      2397:32664
 *   otp-error      2403:14917   (red cell variant)
 *   otp-ready      2403:15506   (green cell variant + enabled CTA)
 *   success        2403:26840
 *
 * Flow:
 *   1. Empty form â†’ "Send Verification Code" CTA disabled.
 *   2. User fills phone (required) + optional whatsapp + email (required).
 *      CTA enables.
 *   3. Submit â†’ CTA shows brief pressed-spinner state, then OTP modal mounts.
 *   4. User types 6-digit code. While typing, cells animate to "active".
 *      Demo accepts "123456"; everything else after 6 digits shows error.
 *   5. On valid code â†’ success modal with summary rows.
 *   6. Success modal "Continue To Address" â†’ /address isn't built yet so we
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
// last 2 phone digits visible, masks the middle: "+233 24 â€¢â€¢â€¢ â€¢â€¢67".
const maskPhone = (raw) => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 4) return raw;
  const tail = digits.slice(-2);
  return `+233 ${digits.slice(0, 2)} â€¢â€¢â€¢ â€¢â€¢${tail}`;
};

// Mask an email "kofi@example.com" â†’ "kâ€¢â€¢â€¢i@example.com".
const maskEmail = (raw) => {
  const [name, host] = raw.split('@');
  if (!name || !host) return raw;
  if (name.length <= 2) return `${name[0]}â€¢â€¢â€¢@${host}`;
  return `${name[0]}â€¢â€¢â€¢${name[name.length - 1]}@${host}`;
};

// ---- Helper-row diamond glyph ----------------------------------------

// Design-system canonical helper icon for the Contact step (Figma path
// repeated at every helper-text row in the input-state dump). Renders as
// `fill="currentColor"` so the surrounding wrapper's text color wins.
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
  // Figma 2388:19683 / 2389:19884 â€” country-code prefix (96px) butted up
  // against the number input. The prefix carries radius `10 0 0 10`, the
  // number input radius `0 10 10 0`. Both share the same 51px height,
  // border, and 2.5px shadow.
  //
  // Field-level edge states (raw HTML "input state" dump):
  //   error    â†’ red chrome on both halves, red value/placeholder text,
  //              red trailing-label, diamond-icon helper row in danger.
  //   default  â†’ grey 1px outline, neutral text, focus-within picks up
  //              the brand-green yellow-tinted halo (unchanged from v1).
  //
  // No `filled` boolean is needed for chrome â€” only the trailing-label
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
      label={label}
      htmlFor={id}
      required={required}
      helperText={helperText}
      error={error}
      labelTrailing={trailingLabel}
      labelTrailingClassName={resolvedTrailingClass}
      helperIcon={<AlertDiamondIcon className="size-4 shrink-0" />}
    >
      <div className="flex h-[51px] w-full items-stretch">
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
            'flex h-full flex-1 items-center gap-2 rounded-r-[10px] bg-white pl-5 pr-4',
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
              'min-w-0 flex-1 border-none bg-transparent text-[14px] leading-6 font-medium outline-none placeholder-shown:font-normal placeholder-shown:leading-5 placeholder:font-normal',
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
  <span className="inline-flex items-center gap-2 rounded-[8px] border border-brand-green-light-active bg-[#FFFEFC] px-4 py-1">
    <span
      aria-hidden="true"
      className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-hover"
      style={{ boxShadow: '0 0 4px 0 #006B3F' }}
    />
    <span className="font-display italic text-[16px] text-[#B5B5B5]">03</span>
    <span
      className="text-[12px] leading-[18px] text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Contact Information
    </span>
  </span>
);

// ---- Right panel -----------------------------------------------------

const ContactRightPanel = () => (
  // Brand-green showcase column. Same composition language as the basics
  // and profile steps (orbs + 3 tilted photo placeholders + floating
  // trust badges). Photos use the gradient-placeholder pattern until
  // production-ready imagery lands. Decorative ornaments (sparkles +
  // scribble arrows) are deferred to v2 â€” they are pure decoration that
  // can be added without changing layout.
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    {/* Background orbs */}
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
      style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
    />
    <div
      className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
      style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
    />

    {/* Top-right tilted photo placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        right: '6%',
        top: '6%',
        width: '46%',
        height: '32%',
        transform: 'rotate(5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid #EEDEB8',
        outlineOffset: '-6px',
      }}
    />
    {/* Top-left tilted photo placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '6%',
        top: '12%',
        width: '50%',
        height: '34%',
        transform: 'rotate(-8.5deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid #EBC2BD',
        outlineOffset: '-6px',
      }}
    />
    {/* Bottom photo placeholder */}
    <div
      className="absolute overflow-hidden rounded-[40px] shadow-[0_24px_40px_-8px_rgba(27,36,44,0.30)]"
      style={{
        left: '4%',
        bottom: '8%',
        width: '60%',
        height: '40%',
        transform: 'rotate(-18deg)',
        backgroundImage:
          'linear-gradient(140deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.18) 100%)',
        outline: '6px solid #C1D4C4',
        outlineOffset: '-6px',
      }}
    />

    {/* "OTP sent after this step" badge â€” Figma 2385:38883. Yellow card
        overlaying the top-left photo. */}
    <div
      className="absolute rounded-[13px] border border-accent-light bg-accent shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
      style={{ left: 24, top: 296, width: 267, padding: 12 }}
    >
      <div className="flex items-center gap-[9px]">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-accent-light-active text-accent-darker">
          <span className="text-[10px] font-bold">MTN</span>
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="text-[12px] font-bold leading-[15px] text-white">
            OTP sent after this step
          </p>
          <p className="text-[10px] leading-[14px] text-white opacity-[0.72]">
            SMS + Email Â· expires in 10 min
          </p>
        </div>
      </div>
    </div>

    {/* Compliance pill â€” Figma 2385:38896. Lifted from ProfileRightPanel. */}
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

    {/* Phone preview badge â€” Figma 2396:19978. Cream rotated card mimicking
        an SMS arriving on the user's phone. */}
    <div
      className="absolute rounded-[10px] border border-accent-light-active bg-accent-light p-2"
      style={{
        right: 36,
        bottom: 140,
        width: 230,
        transform: 'rotate(2deg)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 3px 0 #967014, 0 8px 28px rgba(200, 149, 26, 0.14)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-accent-light-active text-accent-darker">
          <span className="text-[9px] font-bold">MTN</span>
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-bold leading-tight text-[#111111]">Phone</p>
          <p
            className="text-[11px] leading-[15px] text-[#70706E]"
            style={{ letterSpacing: '0.1px' }}
          >
            +233 24 123 4567
          </p>
        </div>
      </div>
    </div>

    {/* Watch-tutorial badge (collapsed variant) â€” Figma 2385:38903.
        Only the circular play button is shown on this step. */}
    <button
      type="button"
      aria-label="Watch tutorial for Contact step"
      className="absolute flex size-[72px] items-center justify-center rounded-full text-white"
      style={{ right: 36, bottom: 30, background: 'rgba(235,241,236,0.30)' }}
    >
      <PlayCircleIcon className="size-6" />
    </button>
  </aside>
);

// ---- OTP modal -------------------------------------------------------

const OtpModal = ({ phone, email, onClose, onChangeContact, onVerified, onLockout }) => {
  // Self-contained state machine for the OTP modal. Owns:
  //   - the 6-digit code being typed
  //   - the "wrong code" flash (`hasError`)
  //   - the 09:58 countdown (`secondsLeft`) â€” when this hits 0 the modal
  //     enters the expired state (Figma 2403:31758): cells disabled, amber
  //     outline, expired helper row, resend becomes the primary action
  //   - the 59s resend cooldown (`resendIn`)
  //   - attempts remaining â€” counted down on every wrong submission;
  //     when it hits 1 the modal outline escalates from sage to red
  //     (Figma 2403:31233); at 0 we fire `onLockout` so the parent can
  //     surface the abandon-onboarding pop-up (Figma 2403:24060)
  //
  // Cells render via VerificationCode's existing `state` / `error` props â€”
  // we just toggle them. Outline color, helper-row copy, CTA copy, and the
  // caption tone are all derived from the booleans below.

  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [secondsLeft, setSecondsLeft] = useState(598); // 09:58
  const [resendIn, setResendIn] = useState(59);

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
    if (isExpired) return; // freeze input while expired â€” user must resend
    // Clear the error halo as soon as the user edits â€” whether they
    // delete a digit or overwrite one. Compare against the previous
    // value so retyping the same wrong code keeps the halo on.
    if (hasError && next !== code) setHasError(false);
    setCode(next);
  };

  const isComplete = code.length === 6;
  const isInvalid = isComplete && hasError && !isExpired;
  const isReady = isComplete && !hasError && !isExpired;

  const handleVerify = () => {
    if (!isComplete || isExpired) return;
    if (code === DEMO_VALID_OTP) {
      log('otp valid â†’ verified');
      onVerified();
      return;
    }
    log('otp invalid; attempts before:', attemptsLeft);
    setHasError(true);
    const nextAttempts = Math.max(0, attemptsLeft - 1);
    setAttemptsLeft(nextAttempts);
    // 0 attempts â†’ caller surfaces the abandon-onboarding pop-up.
    if (nextAttempts === 0) onLockout?.();
  };

  const handleResend = () => {
    if (!isExpired && resendIn > 0) return;
    log('resend code; reset to fresh 09:58 + 3 attempts');
    setCode('');
    setHasError(false);
    setAttemptsLeft(3);
    setSecondsLeft(598);
    setResendIn(59);
  };

  // Outline color tiers â€” sage default â†’ red on escalated error
  // (â‰¤1 attempt left + error showing) â†’ amber on expired. Mirrors Figma
  // frames 2403:22869 (default) / 2403:23779 (soft error) /
  // 2403:31233 (escalated error) / 2403:31758 (expired).
  const outlineColor = isExpired
    ? '#C8951A'
    : hasError && attemptsLeft <= 1
      ? '#C0392B'
      : '#C1D4C4';

  // Resend is "ready" (clickable green) when either expired OR cooldown 0.
  const resendReady = isExpired || resendIn === 0;

  // Bottom caption â€” counts attempts; on error/expired it appends
  // " before lockout" and turns red.
  const showLockoutWarning = hasError || isExpired;
  const attemptsLabel = `${attemptsLeft} attempt${
    attemptsLeft === 1 ? '' : 's'
  } remaining${showLockoutWarning ? ' before lockout' : ''}`;

  // CTA copy: ready â†’ verify; complete-but-wrong â†’ re-enter prompt;
  // anything else (incomplete OR expired) â†’ enter-all prompt.
  const ctaCopy = isReady
    ? 'Verify & Continue'
    : isComplete && hasError
      ? 'Re-Enter All 6 Digits To Continue'
      : 'Enter all 6 digits to continue';

  // Hero chip swaps icon + tint based on modal state.
  //   default / soft-error â†’ brand-green-light + message bubble
  //   escalated error      â†’ pink (#f9ebea) + message bubble (red)
  //   expired              â†’ cream (#faf4e8) + clock (amber)
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
          icon: <MessageBubbleIcon />,
        };

  // H2 swap.  default â†’ "Check your messages."
  //          error    â†’ "That code was wrong." (italic red)
  //          expired  â†’ "That code has expired" (italic amber)
  const heading = isExpired ? (
    <>
      That code has{' '}
      <span className="italic" style={{ color: '#B8712A' }}>
        expired.
      </span>
    </>
  ) : hasError ? (
    <>
      That code was <span className="italic text-danger">wrong.</span>
    </>
  ) : (
    <>
      Check your <span className="italic text-brand-green">messages.</span>
    </>
  );

  // Alert-card content below cells â€” replaces the plain helper row.
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
        title: 'This code has expired â€” request a new one to continue',
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
      : hasError
        ? {
            bg: '#f9ebea',
            border: '#ebc2bd',
            iconBg: '#ebc2bd',
            iconColor: '#7B241C',
            titleColor: '#7B241C',
            bodyColor: null,
            title: "That code isn't right â€” double-check and try again",
            body: null,
          }
        : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.30)' }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[24px] bg-white px-8 py-8"
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

        {/* Hero chip â€” bg + icon swap with modal state (default green /
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
            className="font-display font-normal text-[#111111]"
            style={{ fontSize: 28, lineHeight: '30px', letterSpacing: '-1.1px' }}
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
            {maskPhone(phone)} Â· {maskEmail(email)}
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
            paint correctly without VerificationCode â†’ Field also rendering
            its built-in helper text (we render our own styled alert card
            below to match Figma 2403:23779 / 31233 / 31758). */}
        <div className="mt-5 flex justify-center">
          <VerificationCode
            length={6}
            value={code}
            onChange={handleCodeChange}
            state={isExpired ? 'disabled' : isInvalid ? 'error' : undefined}
            autoFocus={!isExpired}
          />
        </div>

        {/* Styled alert card â€” rendered for soft-error / hard-error /
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
                  className="text-[11px] leading-[16px]"
                  style={{ color: alertCard.bodyColor, letterSpacing: '0.2px' }}
                >
                  {alertCard.body}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Timer + resend row. Timer turns red when expired so the user's
            eye snaps to the resend CTA, which has gone from grey â†’ green. */}
        <div className="mt-4 flex items-center justify-between">
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
            'mt-2 text-center text-[10px] leading-4',
            showLockoutWarning ? 'font-medium text-danger' : 'text-[#70706E]'
          )}
          style={{ letterSpacing: '0.2px' }}
        >
          {attemptsLabel}
        </p>

        <p
          className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#959592]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ShieldCheckIcon className="size-3" />
          Data encrypted at rest Â· Ghana Data Protection Act compliant
        </p>
      </div>
    </div>
  );
};

const ChannelBadge = ({ label }) => (
  // Small cream-green pill carrying the channel name â€” SMS / Email.
  // Reuses the eyebrow chassis from `ContactEyebrow` at smaller size.
  <span className="inline-flex items-center gap-1 rounded-[6px] border border-brand-green-light-hover bg-brand-green-light px-2 py-0.5">
    <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
    <span className="text-[11px] font-medium text-brand-green" style={{ letterSpacing: '0.2px' }}>
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
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    style={{ background: 'rgba(0, 0, 0, 0.30)' }}
  >
    <div
      className="relative w-full max-w-[440px] rounded-[24px] bg-white px-8 py-8"
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
          className="font-display font-normal text-[#111111]"
          style={{ fontSize: 32, lineHeight: '32px', letterSpacing: '-1.2px' }}
        >
          You&apos;re <span className="italic text-brand-green">Verified.</span>
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
            <PhoneIcon className="size-3 text-[#575755]" />
            Phone
          </span>
          <span className="font-semibold text-brand-green">{maskPhone(phone)}</span>
        </li>
        <li className="flex items-center justify-between border-t border-brand-green-light-hover px-4 py-3 text-[12px] leading-5">
          <span className="flex items-center gap-2 text-[#575755]">
            <MailIcon className="size-3 text-[#575755]" />
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
        className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#959592]"
        style={{ letterSpacing: '0.2px' }}
      >
        <ShieldCheckIcon className="size-3" />
        Data encrypted at rest Â· Ghana Data Protection Act compliant
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
        className="text-[11px] leading-[16px]"
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
  // is always available â€” it returns the user to the Contact form.
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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.30)' }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[24px] bg-white px-8 py-8"
        style={{
          outline: '3px solid #C0392B',
          outlineOffset: '-3px',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.14), 0 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Red error medallion â€” 72px circle, 32px alert triangle, 2px
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
              className="text-[10px] font-bold uppercase leading-[14px]"
              style={{ color: '#C0392B', letterSpacing: '0.5px' }}
            >
              Verification failed
            </span>
          </span>

          <h2
            id="lockout-title"
            className="font-display font-normal text-[#111111]"
            style={{ fontSize: 30, lineHeight: '32px', letterSpacing: '-1.1px' }}
          >
            Something went <span className="italic text-danger">wrong.</span>
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
            body="OTP codes are valid for 10 minutes only â€” this one has expired."
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

        {/* Primary CTA â€” disabled while cooldown active. */}
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

        {/* Secondary â€” always enabled. */}
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
          className="mt-4 text-center text-[11px] leading-4"
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
  //   whatsapp: optional â€” must be 9 digits IF present.
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
      log('submit blocked â€” invalid', { isPhoneValid, isWhatsappValid, isEmailValid });
      return;
    }
    log('submit', { phone, whatsapp, email });
    setIsSubmitting(true);
    // Pressed-state spinner reads for ~600ms before the modal mounts.
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtp(true);
    }, 600);
  };

  const markTouched = (key) => () => setTouched((prev) => ({ ...prev, [key]: true }));

  const handleVerified = () => {
    log('contact verified');
    setShowOtp(false);
    setShowSuccess(true);
  };

  const handleContinueToAddress = () => {
    setShowSuccess(false);
    // /address isn't built yet â€” bounce to welcome so the user isn't
    // stranded. Swap to '/onboarding/talent/address' when the route ships.
    navigate('/onboarding/talent/welcome');
  };

  return (
    <div className="mx-auto flex w-full min-h-[calc(100vh-160px)] flex-col bg-white">
      <OnboardingHeader currentKey="contact" percent={78} />

      <section className="flex flex-1">
        {/* Left form column */}
        <div className="flex flex-1 items-start justify-center px-6 pt-12 pb-12 md:pt-14">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center"
            noValidate
          >
            <ContactEyebrow />

            <h1
              className="font-display font-normal text-black"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.64px',
              }}
            >
              How do we <span className="italic text-brand-green">reach you?</span>
            </h1>

            <p
              className="max-w-[482px] text-[16px] leading-6 text-[#737373]"
              style={{ letterSpacing: '0.2px' }}
            >
              We&apos;ll send a quick verification code to confirm it&apos;s really you. Keeping
              your profile secure and your opportunities real.
            </p>

            <WavyDivider />

            <div className="flex w-full flex-col gap-4 text-left">
              <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
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
                  emailError ? undefined : isEmailVerified ? 'text-success' : 'text-neutral-darker'
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
              className="mt-2 w-full max-w-[420px]"
              aria-busy={isSubmitting}
            >
              Send Verification Code
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

        <ContactRightPanel />
      </section>

      {showOtp && (
        <OtpModal
          phone={phone}
          email={email}
          onClose={() => setShowOtp(false)}
          onChangeContact={() => setShowOtp(false)}
          onVerified={handleVerified}
          onLockout={() => {
            log('lockout â†’ surfacing abandon-onboarding pop-up');
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
            log('lockout â†’ change contact details');
            setShowLockout(false);
          }}
          onContactSupport={() => {
            log('lockout â†’ contact support');
            // No support route yet â€” sink to /login as a stand-in.
            navigate('/login');
          }}
        />
      )}
    </div>
  );
};

export default OnboardingContactPage;
