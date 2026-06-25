import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { debug } from '../../../utils/debug.js';
import PhoneInput from '../../ui/form/PhoneInput.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import VerificationCode from '../../ui/form/VerificationCode.jsx';

const log = debug('ParentContactSection');

/*
 * ParentContactSection — Step 3 of 8 in the parent sign-up wizard.
 * Figma main frame: 2938:19867. Left content column only.
 *
 * Flow:
 *   1. User fills phone + email → "Send Verification Code" button activates
 *   2. Button click → OtpModal (6-digit code, expiry timer, resend cooldown)
 *   3. Enter correct code → SuccessModal ("You're Verified")
 *   4. "Continue To Security" → /onboarding/parent-security (Step 4)
 */

// ── Caption badge ──────────────────────────────────────────────────────────
const ContactCaptionBadge = () => (
  <div
    className="inline-flex items-center gap-[4px] rounded-[8px] border bg-white"
    style={{ borderColor: '#eedeb8', padding: '4px 16px' }}
  >
    <span
      aria-hidden="true"
      className="shrink-0 rounded-full"
      style={{
        width: 8,
        height: 8,
        backgroundColor: '#eedeb8',
        border: '1.5px solid #c8951a',
        boxShadow: '0px 0px 4px 0px #f5c451',
      }}
    />
    <span className="flex items-center gap-2">
      <span
        className="font-display italic"
        style={{ fontSize: 16, color: '#b5b5b5', lineHeight: 'normal' }}
      >
        03
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 12, color: '#c8951a', letterSpacing: '0.2px', lineHeight: '18px' }}
      >
        Contact Information
      </span>
    </span>
  </div>
);

// ── Icons ──────────────────────────────────────────────────────────────────

/* Email field left icon — 18×14, inherits currentColor */
const MailIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.56424 2.35337L9 6.63457L16.4358 2.35337C16.27 1.85744 15.8017 1.5 15.25 1.5H2.75C2.19828 1.5 1.73005 1.85744 1.56424 2.35337ZM16.5 4.04725L9.37422 8.14997C9.14257 8.28334 8.85743 8.28334 8.62578 8.14997L1.5 4.04725V11.25C1.5 11.9404 2.05964 12.5 2.75 12.5H15.25C15.9404 12.5 16.5 11.9404 16.5 11.25V4.04725ZM0 2.75C0 1.23122 1.23122 0 2.75 0H15.25C16.7688 0 18 1.23122 18 2.75V11.25C18 12.7688 16.7688 14 15.25 14H2.75C1.23122 14 0 12.7688 0 11.25V2.75Z"
      fill="currentColor"
    />
  </svg>
);

/* Close × — 8×8, inherits currentColor. Figma: 2938:27930. */
const CloseIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.175736 0.175736C0.410051-0.0585786 0.78995-0.0585786 1.02426 0.175736L4 3.15147L6.97574 0.175736C7.21005-0.0585786 7.58995-0.0585786 7.82426 0.175736C8.05858 0.410051 8.05858 0.78995 7.82426 1.02426L4.84853 4L7.82426 6.97574C8.05858 7.21005 8.05858 7.58995 7.82426 7.82426C7.58995 8.05858 7.21005 8.05858 6.97574 7.82426L4 4.84853L1.02426 7.82426C0.78995 8.05858 0.410051 8.05858 0.175736 7.82426C-0.0585786 7.58995-0.0585786 7.21005 0.175736 6.97574L3.15147 4L0.175736 1.02426C-0.0585786 0.78995-0.0585786 0.410051 0.175736 0.175736Z"
      fill="currentColor"
    />
  </svg>
);

/* Arrow right — 20×20, inherits currentColor */
const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289L16.7071 9.29289C17.0976 9.68342 17.0976 10.3166 16.7071 10.7071L11.7071 15.7071C11.3166 16.0976 10.6834 16.0976 10.2929 15.7071C9.90237 15.3166 9.90237 14.6834 10.2929 14.2929L13.5858 11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H13.5858L10.2929 5.70711C9.90237 5.31658 9.90237 4.68342 10.2929 4.29289Z"
      fill="currentColor"
    />
  </svg>
);

/*
 * OtpHeaderIcon — document with horizontal lines + checkmark badge at bottom-right.
 * 28×28, amber #b48617. Sits on bg-[#faf4e8] rounded-[10px] at top of OTP modal.
 * Figma: 2938:27933 (container), icon hand-crafted from visual reference.
 */
const OtpHeaderIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    {/* Document body */}
    <rect x="4" y="2" width="16" height="20" rx="2.5" stroke="#b48617" strokeWidth="1.5" />
    {/* Content lines */}
    <path d="M8 9h9M8 13h9M8 17h6" stroke="#b48617" strokeWidth="1.2" strokeLinecap="round" />
    {/* Checkmark badge — bg circle then border circle then check */}
    <circle cx="19.5" cy="19.5" r="4.5" fill="#faf4e8" />
    <circle cx="19.5" cy="19.5" r="4" stroke="#b48617" strokeWidth="1" />
    <path
      d="M17.8 19.5l1.2 1.2 2.2-2.2"
      stroke="#b48617"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * EnvelopeSmIcon — 12×9 envelope, amber #b48617.
 * Used in both SMS pill and Email pill. Figma: 2938:27941, 2938:27948.
 */
const EnvelopeSmIcon = () => (
  <svg width="12" height="9" viewBox="0 0 14 11" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.3 1.65 7 4.75l5.7-3.1A1.25 1.25 0 0 0 11.75.75H2.25C1.79.75 1.38 1.14 1.3 1.65Zm12.2 1.32L7.3 6.07a.68.68 0 0 1-.6 0L.5 2.97V9c0 .69.56 1.25 1.25 1.25h10.5C12.94 10.25 13.5 9.69 13.5 9V2.97Z"
      fill="#b48617"
    />
  </svg>
);

/*
 * ClockSmIcon — 12×12 clock, grey #70706e.
 * Used in timer row. Figma: 2938:27975 area.
 */
const ClockSmIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <circle cx="6" cy="6" r="5" stroke="#70706e" strokeWidth="1.2" />
    <path
      d="M6 3.5V6l1.8 1.8"
      stroke="#70706e"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/*
 * PhoneRowIcon — 12×12 phone handset, amber #b48617.
 * Used in success modal Phone row. Figma: 2938:31784.
 */
const PhoneRowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.2 1.83c.07-.43.43-.63.75-.63H3.6c.26 0 .49.14.61.37l.55 1.04c.14.25.08.56-.13.73l-.63.52c-.08.07-.1.17-.06.26.59 1.02 1.67 2.1 2.7 2.7.1.05.19.03.26-.06l.52-.52c.2-.2.5-.27.73-.14l1.8.96c.24.13.38.37.38.63v1.57c0 .36-.24.67-.63.74-1.16.2-3.82.42-5.58-.3-1.77-.7-3.3-2.04-4.18-3.2C-.88 5.32-.6 3.63.15 1.93L1.2 1.83Z"
      fill="#b48617"
    />
  </svg>
);

/*
 * MailRowIcon — 12×10 envelope, amber #b48617.
 * Used in success modal Email row. Figma: 2938:31789.
 */
const MailRowIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M.94 1.57 6 4.42l5.06-2.85C10.88.23 10.37 0 9.83 0H2.17C1.63 0 1.12.23.94 1.57Zm11.06 1.4L6.25 5.43a.5.5 0 0 1-.5 0L0 2.97v5.13C0 8.65.52 9 1.17 9h9.66c.65 0 1.17-.35 1.17-.9V2.97Z"
      fill="#b48617"
    />
  </svg>
);

/*
 * ShieldSmIcon — 10×12 shield, parameterised fill.
 * OTP modal footer: #b48617. Success modal footer: #387440.
 * Figma: 2938:27924 (amber), 2938:31797 (green).
 */
const ShieldSmIcon = ({ fill = '#b48617' }) => (
  <svg width="10" height="12" viewBox="0 0 16 18" fill="none" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.247 1.526A.9.9 0 007.754 1.526C7.597 1.559 7.432 1.642 6.825 1.987L1.947 4.756c-.158.09-.248.141-.313.183-.05.032-.062.045-.062.044L1.575 4.983a1.01 1.01 0 00-.06.103A.9.9 0 001.5 5.444V8.688C1.5 10.997 2.66 13.133 4.552 14.34l3.008 1.921c.161.103.253.16.324.2.042.023.061.031.067.033a.9.9 0 00.098 0c.006-.002.025-.01.067-.033.071-.04.163-.097.324-.2l3.008-1.921C13.34 13.133 14.5 10.997 14.5 8.688V5.444c0-.304-.008-.34-.014-.358a1.01 1.01 0 00-.06-.103l-.002.002c-.004.004-.018.015-.06.04-.065.042-.155.094-.313.183L9.175 1.987c-.607-.345-.772-.428-.928-.461zM7.445.058A2.4 2.4 0 018.555.058c.416.087.796.303 1.276.576l.079.046 4.877 2.768.079.046c.24.135.495.279.689.495.168.187.295.408.372.647.088.274.087.567.087.849V8.688C16 11.496 14.59 14.114 12.255 15.605L9.248 17.525l-.079.05c-.241.155-.501.322-.796.39a2.4 2.4 0 01-.746 0c-.295-.068-.555-.235-.796-.39l-.079-.05-3.007-1.92C1.41 14.114 0 11.496 0 8.688V5.444c0-.282-.001-.575.087-.849A2 2 0 01.459 3.98c.194-.216.449-.36.689-.495L1.227 3.44 6.104.672l.08-.046C6.648.361 7.029.145 7.445.058z"
      fill={fill}
    />
  </svg>
);

// ── OTP input length ───────────────────────────────────────────────────────
const OTP_LENGTH = 6;

// ── Countdown timer hook ───────────────────────────────────────────────────
const useCountdown = (initialSeconds, active) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (!active) {
      setSeconds(initialSeconds);
      return;
    }
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [active, seconds, initialSeconds]);

  const reset = useCallback(() => setSeconds(initialSeconds), [initialSeconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return { display: `${mm}:${ss}`, expired: seconds <= 0, reset, seconds };
};

// ── Mask helpers ───────────────────────────────────────────────────────────
const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return `+233 ${phone}`;
  const last2 = digits.slice(-2);
  const dots = '•'.repeat(Math.max(0, digits.length - 4));
  return `+233 ${digits.slice(0, 2)} ${dots} ••${last2}`;
};

const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  if (!domain || local.length < 3) return email;
  return `${local[0]}${'•'.repeat(local.length - 2)}${local.slice(-1)}@${domain}`;
};

// ── OTP Verification Modal ─────────────────────────────────────────────────
/*
 * Figma: code-input state 2938:27930 → 2938:27992.
 * Two separate countdown timers:
 *   expiry   — 600 s (10 min) overall OTP expiry, shown as MM:SS
 *   resend   — 60 s cooldown before "Resend code" becomes active
 */
const OtpModal = ({ phone, email, onClose, onVerified }) => {
  const DEMO_CODE = '123456';
  const [otp, setOtp] = useState('');
  const [hasError, setHasError] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const expiry = useCountdown(600, true);
  const resend = useCountdown(60, true);

  log('OtpModal mount:', { phone, email });

  const handleVerify = () => {
    log('OtpModal verify attempt:', otp);
    if (otp === DEMO_CODE) {
      log('OtpModal: correct — verified');
      onVerified();
    } else {
      const left = attemptsLeft - 1;
      log('OtpModal: wrong code — attempts left:', left);
      setHasError(true);
      setAttemptsLeft(left);
      setOtp('');
    }
  };

  const handleResend = () => {
    if (!resend.expired) return;
    log('OtpModal: resend requested');
    expiry.reset();
    resend.reset();
    setOtp('');
    setHasError(false);
    setAttemptsLeft(3);
  };

  const filled = otp.length === OTP_LENGTH;
  const canSubmit = filled && attemptsLeft > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl bg-white"
        style={{
          boxShadow:
            '0px 24px 64px 0px rgba(0,0,0,0.12), 0px 4px 0px 0px rgba(0,0,0,0.07), 0px 0px 0px 1px rgba(0,0,0,0.04)',
          padding: '32px 28px 28px',
        }}
      >
        {/* ── Close — Figma 2938:27930 */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#b48617] transition-colors hover:bg-[#faf4e8]"
        >
          <CloseIcon />
        </button>

        {/* ── Top icon: document + checkmark badge — Figma 2938:27933 */}
        <div className="mb-4 flex justify-center">
          <div
            style={{
              backgroundColor: '#faf4e8',
              borderRadius: 10,
              padding: '6px 5px 5px 6px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <OtpHeaderIcon />
          </div>
        </div>

        {/* ── Channel pills: SMS · Email — Figma 2938:27941 + 2938:27948 */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span
            className="inline-flex items-center gap-1 font-sans"
            style={{
              fontSize: 10,
              color: '#b48617',
              backgroundColor: '#faf4e8',
              border: '1px solid #f7efdd',
              borderRadius: 4,
              padding: '4px 11px',
              lineHeight: '16px',
              letterSpacing: '0.2px',
            }}
          >
            <EnvelopeSmIcon />
            SMS
          </span>
          <span style={{ fontSize: 10, color: '#b48617', lineHeight: '16px' }}>·</span>
          <span
            className="inline-flex items-center gap-1 font-sans"
            style={{
              fontSize: 10,
              color: '#b48617',
              backgroundColor: '#faf4e8',
              border: '1px solid #f7efdd',
              borderRadius: 4,
              padding: '4px 11px',
              lineHeight: '16px',
              letterSpacing: '0.2px',
            }}
          >
            <EnvelopeSmIcon />
            Email
          </span>
        </div>

        {/* ── Headline — Figma 2938:27955 */}
        <h2
          className="mb-2 text-center font-display font-normal"
          style={{ fontSize: 28, color: '#111', letterSpacing: '-1.1px', lineHeight: '30px' }}
        >
          Check your{' '}
          <span className="italic" style={{ color: '#b48617' }}>
            messages.
          </span>
        </h2>

        {/* ── Subtitle — Figma 2938:27957 */}
        <p
          className="mb-3 text-center font-sans"
          style={{ fontSize: 14, color: '#70706e', lineHeight: '20px', letterSpacing: '0.2px' }}
        >
          We sent a 6-digit code to confirm your contact details.
        </p>

        {/* ── Masked contact — Figma 2938:27958 */}
        <p
          className="mb-1 text-center font-sans font-semibold"
          style={{ fontSize: 12, color: '#575755', lineHeight: '20px', letterSpacing: '0.2px' }}
        >
          {maskPhone(phone)}&nbsp;&nbsp;·&nbsp;&nbsp;{maskEmail(email)}
        </p>

        {/* ── Change contact details — Figma 2938:27959 */}
        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={() => {
              log('change contact details clicked');
              onClose();
            }}
            className="font-sans font-medium underline"
            style={{
              fontSize: 12,
              color: '#b48617',
              lineHeight: '20px',
              letterSpacing: '0.2px',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Change contact details
          </button>
        </div>

        {/* ── OTP boxes — Figma 2938:27964–27969 (62px native, 52px in modal) */}
        <div className="mb-5 flex justify-center">
          <VerificationCode
            length={OTP_LENGTH}
            value={otp}
            onChange={(code) => {
              log('OtpModal otp changed:', code.length, 'digits');
              setOtp(code);
              if (hasError && code.length === 0) setHasError(false);
            }}
            state={hasError ? 'error' : undefined}
            autoFocus
            boxSize={52}
          />
        </div>

        {/* ── Timer row — Figma 2938:27975 clock + 2938:27978 label + 2938:27979 countdown */}
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <ClockSmIcon />
          <span
            className="font-sans"
            style={{ fontSize: 12, color: '#70706e', lineHeight: '20px' }}
          >
            Code expires in
          </span>
          <span
            className="font-sans font-semibold"
            style={{ fontSize: 12, color: '#b48617', letterSpacing: '0.2px', lineHeight: '20px' }}
          >
            {expiry.display}
          </span>
        </div>

        {/* ── Resend row — Figma 2938:27982 + 2938:27984 */}
        <div className="mb-5 flex items-center justify-center gap-1">
          <span
            className="font-sans"
            style={{ fontSize: 12, color: '#70706e', lineHeight: '20px' }}
          >
            Didn&apos;t receive it?
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!resend.expired}
            className="font-sans font-semibold"
            style={{
              fontSize: 12,
              color: resend.expired ? '#387440' : '#babab7',
              letterSpacing: '0.2px',
              lineHeight: '20px',
              cursor: resend.expired ? 'pointer' : 'default',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            {resend.expired ? 'Resend code' : `Resend code (${resend.seconds}s)`}
          </button>
        </div>

        {/* ── CTA — Figma 2938:27987 (grey=disabled, amber=active) */}
        <button
          type="button"
          onClick={canSubmit ? handleVerify : undefined}
          disabled={!canSubmit}
          className="w-full font-sans font-bold transition-colors"
          style={{
            height: 56,
            borderRadius: 14,
            fontSize: 16,
            letterSpacing: '0.1px',
            lineHeight: '24px',
            color: '#fff',
            backgroundColor: canSubmit ? '#c8951a' : '#bfbfbf',
            borderTop: `1px solid ${canSubmit ? '#a07715' : '#ccc'}`,
            borderLeft: `2px solid ${canSubmit ? '#a07715' : '#ccc'}`,
            borderRight: `2px solid ${canSubmit ? '#a07715' : '#ccc'}`,
            borderBottom: `2px solid ${canSubmit ? '#a07715' : '#ccc'}`,
            boxShadow: `0px 4px 0px ${canSubmit ? 'rgba(160,119,21,0.8)' : 'rgba(191,191,191,0.8)'}`,
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          Enter all 6 digits to continue
        </button>

        {/* ── Attempts remaining — Figma 2938:27992, always visible */}
        <p
          className="mt-2 text-center font-sans"
          style={{ fontSize: 10, color: '#70706e', lineHeight: '16px', letterSpacing: '0.2px' }}
        >
          {attemptsLeft > 0
            ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining`
            : 'No attempts remaining — request a new code'}
        </p>

        {/* ── Footer: shield + compliance — Figma 2938:27924 (#b48617) + 2938:27925 */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <ShieldSmIcon fill="#b48617" />
          <p
            className="text-center font-sans"
            style={{ fontSize: 10, color: '#959592', lineHeight: '16px', letterSpacing: '0.2px' }}
          >
            Data encrypted at rest · Ghana Data Protection Act compliant
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Success / "You're Verified" modal ─────────────────────────────────────
/*
 * Figma: success state 2938:31765 → 2938:31797.
 * Amber check icon at top, Phone-first summary card, progress bar, green CTA,
 * green shield footer.
 */
const SuccessModal = ({ phone, email, onClose, onContinue }) => {
  log('SuccessModal mount');
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl bg-white"
        style={{
          boxShadow:
            '0px 24px 64px 0px rgba(0,0,0,0.12), 0px 4px 0px 0px rgba(0,0,0,0.07), 0px 0px 0px 1px rgba(0,0,0,0.04)',
          padding: '32px 28px 28px',
        }}
      >
        {/* ── Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#b48617] transition-colors hover:bg-[#faf4e8]"
        >
          <CloseIcon />
        </button>

        {/* ── Amber check icon — Figma 2938:31772 */}
        <div className="mb-4 flex justify-center">
          <div
            style={{
              width: 48,
              height: 48,
              backgroundColor: '#faf4e8',
              borderRadius: 10,
              boxShadow: '0px 1px 2px rgba(27,36,44,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="#b48617"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ── "Contact verified" Captions badge — Figma 2938:31775 */}
        <div className="mb-3 flex justify-center">
          <span
            className="inline-flex items-center gap-[6px] font-sans"
            style={{
              fontSize: 12,
              color: '#999',
              backgroundColor: 'rgba(235,241,236,0.5)',
              border: '1px solid #faf4e8',
              padding: '10px 32px',
              borderRadius: 6,
              lineHeight: '18px',
              letterSpacing: '0.2px',
            }}
          >
            <span
              className="shrink-0 rounded-full"
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#faf4e8',
                border: '1.5px solid #c8951a',
                boxShadow: '0px 0px 4px 0px #f5c451',
              }}
            />
            Contact verified
          </span>
        </div>

        {/* ── Headline — Figma 2938:31778 */}
        <h2
          className="mb-2 text-center font-display font-normal"
          style={{ fontSize: 32, color: '#111', letterSpacing: '-1.2px', lineHeight: '32px' }}
        >
          You&apos;re{' '}
          <span className="italic" style={{ color: '#b48617' }}>
            Verified
          </span>
        </h2>

        {/* ── Subtitle — Figma 2938:31779 */}
        <p
          className="mb-4 text-center font-sans"
          style={{ fontSize: 12, color: '#959592', lineHeight: '18px', letterSpacing: '0.2px' }}
        >
          Your phone and email have been confirmed. Here&apos;s what we verified.
        </p>

        {/* ── Summary card — Figma 2938:31780 */}
        {/* Phone first, Email second — amber tint bg, amber border */}
        <div
          className="mb-4 rounded-[16px] border px-4 py-1"
          style={{ backgroundColor: 'rgba(250,244,232,0.3)', borderColor: '#f7efdd' }}
        >
          {/* Phone row */}
          <div
            className="flex items-center justify-between border-b py-2"
            style={{ borderColor: '#f7efdd' }}
          >
            <div className="flex items-center gap-3">
              <PhoneRowIcon />
              <span
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#575755',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                Phone
              </span>
            </div>
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: '#b48617', letterSpacing: '0.2px', lineHeight: '20px' }}
            >
              {maskPhone(phone)}
            </span>
          </div>
          {/* Email row */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <MailRowIcon />
              <span
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#575755',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                Email
              </span>
            </div>
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: '#b48617', letterSpacing: '0.2px', lineHeight: '20px' }}
            >
              {maskEmail(email)}
            </span>
          </div>
        </div>

        {/* ── Progress bar — Figma 2938:31793 (step 3 of 8 ≈ 37.5%) */}
        <div
          className="mb-4 w-full overflow-hidden rounded-[4px]"
          style={{ height: 6, backgroundColor: '#ebf1ec' }}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-[6px]"
            style={{ width: '37.5%', backgroundColor: '#387440' }}
          />
        </div>

        {/* ── CTA — Figma 2938:31796 (green bg, gradient text) */}
        <button
          type="button"
          onClick={() => {
            log('SuccessModal continue clicked');
            onContinue();
          }}
          className="flex w-full items-center justify-center gap-2 font-sans font-bold"
          style={{
            height: 56,
            borderRadius: 14,
            fontSize: 16,
            letterSpacing: '0.1px',
            lineHeight: '24px',
            backgroundColor: '#387440',
            borderTop: '1px solid #2a5730',
            borderLeft: '2px solid #2a5730',
            borderRight: '2px solid #2a5730',
            borderBottom: '2px solid #2a5730',
            boxShadow: '0px 4px 0px #224626',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              background: 'linear-gradient(188.377deg, #fef1e7 0%, #e8f2ed 20.192%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Continue To Security
          </span>
          <span style={{ color: '#e8f2ed', display: 'flex', alignItems: 'center' }}>
            <ArrowRightIcon />
          </span>
        </button>

        {/* ── Footer: shield + compliance — Figma 2938:31797 (green shield #387440) */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <ShieldSmIcon fill="#387440" />
          <p
            className="text-center font-sans"
            style={{ fontSize: 10, color: '#959592', lineHeight: '16px', letterSpacing: '0.2px' }}
          >
            Data encrypted at rest · Ghana Data Protection Act compliant
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const ParentContactSection = () => {
  log('mount');
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [verified, setVerified] = useState(false);

  const isFormReady = phone.trim().length >= 7 && email.trim().includes('@');

  const handleSend = () => {
    if (!isFormReady) return;
    log('send verification code clicked — phone:', maskPhone(phone), 'email:', maskEmail(email));
    setShowOtpModal(true);
  };

  const handleVerified = () => {
    log('contact verified — showing success card');
    setShowOtpModal(false);
    setVerified(true);
  };

  const handleContinue = () => {
    log('continue to security — navigating to /onboarding/parent-security');
    navigate('/onboarding/parent-security');
  };

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-20">
      <div className="flex w-full max-w-[762px] flex-col items-center gap-6">
        {/* Step badge */}
        <ContactCaptionBadge />

        {/* Headline */}
        <h1
          className="max-w-[554px] text-center font-display font-normal text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Tell us about{' '}
          <span className="italic" style={{ color: '#c8951a' }}>
            yourself.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-[542px] text-center font-sans"
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
            color: '#737373',
            lineHeight: '24px',
            letterSpacing: '0.2px',
          }}
        >
          We&apos;ll send a quick code to confirm it&apos;s really you — keeping your account secure
          and your ward&apos;s profile protected.
        </p>

        <WavyDivider />

        {/* Form fields */}
        <div
          className="flex w-full flex-wrap justify-center gap-x-4 gap-y-4"
          style={{ maxWidth: 720 }}
        >
          {/* Phone Number */}
          <div style={{ width: 340 }}>
            <PhoneInput
              label="Phone Number"
              required
              labelTrailing="SMS verification"
              value={phone}
              onChange={(e) => {
                log('phone changed:', e.target.value);
                setPhone(e.target.value);
              }}
              placeholder="24 000 0000"
            />
          </div>

          {/* WhatsApp Number */}
          <div style={{ width: 340 }}>
            <PhoneInput
              label="WhatsApp Number"
              optional
              helperText="Leave blank if same as your phone number above"
              value={whatsapp}
              onChange={(e) => {
                log('whatsapp changed:', e.target.value);
                setWhatsapp(e.target.value);
              }}
              placeholder="24 000 0000"
            />
          </div>

          {/* Email Address */}
          <div style={{ width: '100%', maxWidth: 700 }}>
            <TextInput
              label="Email Address"
              required
              labelTrailing="Email verification"
              labelTrailingClassName="text-[#595959]"
              leftIcon={<MailIcon />}
              leftIconClassName="text-brand-green"
              type="email"
              placeholder="you@example.com"
              helperText="Important updates, job matches, will be sent here"
              value={email}
              onChange={(e) => {
                log('email changed:', e.target.value);
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex w-full max-w-[698px] flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={!isFormReady}
            className="flex w-full items-center justify-center gap-2 font-sans font-bold transition-all"
            style={{
              height: 56,
              borderRadius: 14,
              fontSize: 16,
              letterSpacing: '0.1px',
              lineHeight: '24px',
              color: '#fff',
              backgroundColor: isFormReady ? '#c8951a' : '#bfbfbf',
              border: `2px solid ${isFormReady ? '#a07715' : '#ccc'}`,
              borderBottom: `4px solid ${isFormReady ? '#a07715' : 'rgba(191,191,191,0.8)'}`,
              cursor: isFormReady ? 'pointer' : 'not-allowed',
            }}
          >
            Send Verification Code
            <ArrowRightIcon />
          </button>

          <div className="flex items-center gap-1">
            <span
              className="font-sans"
              style={{ fontSize: 14, color: '#737373', letterSpacing: '0.2px', lineHeight: '20px' }}
            >
              Already Have an account?
            </span>
            <Link
              to="/onboarding/parent-login"
              className="font-sans font-semibold"
              style={{ fontSize: 14, color: '#387440', letterSpacing: '0.1px', lineHeight: '24px' }}
            >
              Log in Instead
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showOtpModal && (
        <OtpModal
          phone={phone}
          email={email}
          onClose={() => {
            log('OTP modal closed');
            setShowOtpModal(false);
          }}
          onVerified={handleVerified}
        />
      )}
      {verified && (
        <SuccessModal
          phone={phone}
          email={email}
          onClose={handleContinue}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default ParentContactSection;
