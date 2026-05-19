import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { TextInput, VerificationCode } from '../components/ui/form';
import Field from '../components/ui/form/Field.jsx';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import OnboardingHeader from '../components/shared/OnboardingHeader.jsx';
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
} from '../components/shared/assets.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

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
 *      bounce to /welcome instead (TODO: swap to ROUTES.onboardingAddress
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

// ---- Phone number input (composite) ----------------------------------

const PhoneNumberInput = ({
  id,
  label,
  required = false,
  trailingLabel,
  trailingLabelClassName = 'text-brand-green',
  placeholder = '23 533 45',
  value,
  onChange,
  helperText,
  error,
  countryCode = '+233',
  flag = <GhanaFlagRoundIcon />,
}) => {
  // Figma 2388:19683 / 2389:19884 — country-code prefix (96px) butted up
  // against the number input. The prefix carries radius `10 0 0 10`, the
  // number input radius `0 10 10 0`. Both share the same 51px height,
  // border, and 2.5px shadow.

  return (
    <Field
      label={label}
      htmlFor={id}
      required={required}
      helperText={helperText}
      error={error}
      labelTrailing={trailingLabel}
      labelTrailingClassName={trailingLabelClassName}
    >
      <div className="flex h-[51px] w-full items-stretch">
        {/* Country-code prefix (left, 96px, rounded-left) */}
        <button
          type="button"
          className="flex h-full w-[96px] shrink-0 items-center gap-2 rounded-l-[10px] border border-r-0 border-[#cccccc] bg-white pl-[9px] pr-3 shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus:outline-none"
          aria-label={`Country code ${countryCode}`}
        >
          <span className="inline-flex size-5 shrink-0">{flag}</span>
          <ChevronDownIcon className="size-2 shrink-0 text-[#575755]" />
          <span
            className="text-[14px] font-medium leading-6 text-[#575755]"
            style={{ letterSpacing: '0.2px' }}
          >
            {countryCode}
          </span>
        </button>

        {/* Number input (right, flex-1, rounded-right) */}
        <div className="flex h-full flex-1 items-center gap-2 rounded-r-[10px] border border-[#cccccc] bg-white pl-5 pr-4 shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] focus-within:bg-yellow-light focus-within:border-brand-green-light-active focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]">
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-w-0 flex-1 border-none bg-transparent text-[14px] leading-5 text-[#111111] outline-none placeholder:text-[#575755] placeholder:font-normal"
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
  // scribble arrows) are deferred to v2 — they are pure decoration that
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

    {/* "OTP sent after this step" badge — Figma 2385:38883. Yellow card
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
            SMS + Email · expires in 10 min
          </p>
        </div>
      </div>
    </div>

    {/* Compliance pill — Figma 2385:38896. Lifted from ProfileRightPanel. */}
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

    {/* Phone preview badge — Figma 2396:19978. Cream rotated card mimicking
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

    {/* Watch-tutorial badge (collapsed variant) — Figma 2385:38903.
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

const OtpModal = ({ phone, email, onClose, onChangeContact, onVerified }) => {
  // Self-contained: owns the 6-digit code, the "wrong code" flash, the
  // 09:58 countdown, and the resend cooldown. When the code passes
  // validation (`DEMO_VALID_OTP`) we call `onVerified`. Until then the
  // CTA disables. Cell colors are driven entirely by VerificationCode's
  // existing `error`/active states — no new component needed.

  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(598); // 09:58
  const [resendIn, setResendIn] = useState(59);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setResendIn((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleCodeChange = (next) => {
    log('otp change:', next.length);
    // Clear the error halo as soon as the user edits — whether they
    // delete a digit or overwrite one. Compare against the previous
    // value so retyping the same wrong code keeps the halo on.
    if (hasError && next !== code) setHasError(false);
    setCode(next);
  };

  const isComplete = code.length === 6;
  const isInvalid = isComplete && hasError;
  const isReady = isComplete && !hasError;

  const handleVerify = () => {
    if (!isComplete) return;
    if (code === DEMO_VALID_OTP) {
      log('otp valid → verified');
      onVerified();
    } else {
      log('otp invalid');
      setHasError(true);
    }
  };

  const resendDisabled = resendIn > 0;

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
          outline: '3px solid #C1D4C4',
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

        {/* Hero chip */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-16 items-center justify-center rounded-[10px] bg-brand-green-light">
            <MessageBubbleIcon />
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
            Check your <span className="italic text-brand-green">messages.</span>
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

        {/* OTP cells */}
        <div className="mt-5 flex justify-center">
          <VerificationCode
            length={6}
            value={code}
            onChange={handleCodeChange}
            error={isInvalid ? 'Invalid code. Try again.' : undefined}
            autoFocus
          />
        </div>

        {/* Timer + resend row */}
        <div className="mt-4 flex items-center justify-between">
          <div
            className="inline-flex items-center gap-1.5 text-[12px] text-[#70706E]"
            style={{ letterSpacing: '0.2px' }}
          >
            <ClockIcon className="size-4" />
            <span>Code expires in</span>
            <span className="font-semibold text-brand-green">{formatMmSs(secondsLeft)}</span>
          </div>
          <button
            type="button"
            disabled={resendDisabled}
            onClick={() => setResendIn(59)}
            className="text-[12px] font-medium leading-tight text-brand-green underline-offset-2 hover:underline disabled:text-neutral-dark disabled:no-underline disabled:cursor-not-allowed"
          >
            Resend code{resendDisabled ? ` (${resendIn}s)` : ''}
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
          {isReady ? 'Verify & Continue' : 'Enter all 6 digits to continue'}
        </Button>

        <p
          className="mt-2 text-center text-[10px] leading-4 text-[#70706E]"
          style={{ letterSpacing: '0.2px' }}
        >
          3 attempts remaining
        </p>

        <p
          className="mt-3 flex items-center justify-center gap-1 text-center text-[10px] leading-4 text-[#959592]"
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
        Data encrypted at rest · Ghana Data Protection Act compliant
      </p>
    </div>
  </div>
);

// ---- main page -------------------------------------------------------

const OnboardingContactPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Light validation only — phone is a non-empty value (real validation
  // will live in zod once the contract is final). Email needs an @.
  const isValid = useMemo(
    () => phone.trim().length >= 4 && /.+@.+\..+/.test(email),
    [phone, email]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    log('submit', { phone, whatsapp, email });
    setIsSubmitting(true);
    // Pressed-state spinner reads for ~600ms before the modal mounts.
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOtp(true);
    }, 600);
  };

  const handleVerified = () => {
    log('contact verified');
    setShowOtp(false);
    setShowSuccess(true);
  };

  const handleContinueToAddress = () => {
    setShowSuccess(false);
    // /address isn't built yet — bounce to welcome so the user isn't
    // stranded. Swap to ROUTES.onboardingAddress when the route ships.
    navigate(ROUTES.onboardingWelcome);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] flex-col bg-white">
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
                />
                <PhoneNumberInput
                  id="contact-whatsapp"
                  label="Whatsapp Number"
                  trailingLabel="Optional"
                  value={whatsapp}
                  onChange={setWhatsapp}
                  helperText="Leave blank if same as your phone number above"
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
                leftIcon={<MailIcon />}
                helperText="Important updates, job matches, and your verification code will be sent here"
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
                to={ROUTES.login}
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
    </div>
  );
};

export default OnboardingContactPage;
