import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import VerificationCode from '../../ui/form/VerificationCode.jsx';
import {
  ArrowRightIcon,
  MessageBubbleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SuccessCheckIcon,
  UserIcon,
  BriefcaseIcon,
  PhoneIcon,
  MailIcon,
  CloseIcon,
} from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('ContactVerificationModal');

/*
 * ContactVerificationModal — dual-channel OTP verification modal for the
 * institution contact step (step 2 of 8).
 *
 * Stage machine:
 *   'otp'     → shows 6-box OTP entry, SMS/Email tab switcher, countdown.
 *   'success' → shows verified confirmation + data summary + Continue CTA.
 *
 * OTP flow:
 *   1. Opens on the SMS tab with a 10-minute countdown.
 *   2. User enters 6-digit code → clicks "Verify Phone Number".
 *   3. Marks sms verified, auto-switches to email tab.
 *   4. User enters email OTP → clicks "Verify Email & Complete".
 *   5. Both verified → stage = 'success'.
 *
 * Mock verification: any complete 6-digit entry is accepted as valid.
 * Real API call can replace handleVerify() in a future sprint.
 *
 * Props:
 *   data    {object}  Submitted form values from ContactInfoSection:
 *                     fullName, roleTitle, phoneNumber, email, password,
 *                     confirmPassword.
 *   onClose {function} Called on backdrop/ESC dismiss.
 */

// ── helpers ───────────────────────────────────────────────────────────────

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const maskPhone = (digits) => {
  const clean = (digits || '').replace(/\D/g, '');
  if (clean.length < 2) return `+233 ${clean}`;
  const last2 = clean.slice(-2);
  const first2 = clean.length >= 2 ? clean.slice(0, 2) : clean;
  return `+233 ${first2} ••• ••${last2}`;
};

const maskEmail = (email) => {
  const [local, domain] = (email || '').split('@');
  if (!domain) return email;
  if (local.length <= 2) return `${local[0] ?? ''}•@${domain}`;
  return `${local[0]}${'•'.repeat(Math.min(4, local.length - 2))}${local[local.length - 1]}@${domain}`;
};

// ── sub-components ────────────────────────────────────────────────────────

const DataRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#e6e6e6] last:border-b-0">
    <span className="inline-flex items-center gap-2 font-sans text-[12px] lg:text-[14px] leading-5 text-neutral-darker">
      {icon && (
        <span className="inline-flex size-4 text-neutral-darker" aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
    </span>
    <span
      className="font-sans text-[12px] lg:text-[14px] font-semibold leading-5 text-brand-green text-right max-w-[56%] truncate"
      title={value}
    >
      {value || <span className="font-normal text-[#babab7] italic">—</span>}
    </span>
  </div>
);

// ── main component ────────────────────────────────────────────────────────

const ContactVerificationModal = ({ data, onClose }) => {
  log('mount', { email: data?.email, phoneNumber: data?.phoneNumber });

  const navigate = useNavigate();

  // ── stage state ──────────────────────────────────────────────────────
  const [stage, setStage] = useState('otp'); // 'otp' | 'success'
  const [activeTab, setActiveTab] = useState('sms'); // 'sms' | 'email'
  const [verified, setVerified] = useState({ sms: false, email: false });
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 min
  const [resendLeft, setResendLeft] = useState(59); // 59s resend delay

  log('render', { stage, activeTab, verified, codeLength: code.length, timeLeft, resendLeft });

  // ── countdown — main OTP timer ───────────────────────────────────────
  useEffect(() => {
    if (stage !== 'otp') return;
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, stage]);

  // ── countdown — resend delay, resets on tab switch ───────────────────
  useEffect(() => {
    log('tab switched to:', activeTab, '— resetting resend + code');
    setResendLeft(59);
    setCode('');
  }, [activeTab]);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setTimeout(() => setResendLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(t);
  }, [resendLeft]);

  // ── keyboard dismiss ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        log('escape key — closing modal');
        onClose?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ── handlers ─────────────────────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      log('backdrop click — closing modal');
      onClose?.();
    }
  };

  const handleVerify = () => {
    if (code.length < 6) {
      log('verify attempted with incomplete code, length:', code.length);
      return;
    }
    log('verifying tab:', activeTab, 'with code:', code);

    const nextVerified = { ...verified, [activeTab]: true };
    setVerified(nextVerified);
    setCode('');

    if (nextVerified.sms && nextVerified.email) {
      log('both channels verified — switching to success stage');
      setStage('success');
      return;
    }

    // Auto-switch to the still-unverified channel
    const switchTo = activeTab === 'sms' ? 'email' : 'sms';
    log('switching to tab:', switchTo);
    setActiveTab(switchTo);
  };

  const handleResend = () => {
    if (resendLeft > 0) return;
    log('resending code for tab:', activeTab);
    setResendLeft(59);
    setCode('');
  };

  const handleContinue = () => {
    log('continuing to activate account');
    navigate('/onboarding/institution/activate');
  };

  // ── derived display values ────────────────────────────────────────────
  const maskedPhone = maskPhone(data?.phoneNumber);
  const maskedEmail = maskEmail(data?.email);
  const currentTarget = activeTab === 'sms' ? maskedPhone : maskedEmail;
  const isCodeComplete = code.length === 6;
  const isExpired = timeLeft <= 0;

  const verifyButtonLabel = activeTab === 'sms' ? 'Verify Phone Number' : 'Verify Email & Complete';

  // ─────────────────────────────────────────────────────────────────────
  // OTP STAGE
  // ─────────────────────────────────────────────────────────────────────
  if (stage === 'otp') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-verify-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleBackdropClick}
      >
        <div
          className="relative w-full max-w-[540px] rounded-3xl bg-white p-8 md:p-10 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close button (✕) — absolutely positioned top-right ── */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => {
              log('close button clicked');
              onClose?.();
            }}
            className="absolute right-5 top-5 inline-flex size-[28px] items-center justify-center rounded-[20px] bg-[#ebf1ec] text-[#387440] transition-colors duration-100 hover:bg-[#d4e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          >
            <CloseIcon />
          </button>

          {/* ── Header ── */}
          <div className="mb-6 flex flex-col items-center gap-4 text-center">
            <div className="flex size-[64px] shrink-0 items-center justify-center rounded-2xl bg-brand-green-light">
              <MessageBubbleIcon />
            </div>
            <div className="flex flex-col gap-1">
              <h2
                id="contact-verify-title"
                className="font-display font-normal text-black"
                style={{
                  fontSize: 'clamp(1.375rem, 2.2vw, 1.875rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.24px',
                }}
              >
                Check your <span className="italic text-brand-green">messages.</span>
              </h2>
              <p
                className="font-sans text-[14px] leading-5 text-[#737373]"
                style={{ letterSpacing: '0.1px' }}
              >
                Enter the 6-digit code sent to{' '}
                <span className="font-semibold text-content-primary">{currentTarget}</span>
              </p>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div className="mb-5 flex rounded-xl bg-[#f5f5f5] p-1 gap-1">
            {['sms', 'email'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  if (tab !== activeTab) {
                    log('manual tab switch to:', tab);
                    setActiveTab(tab);
                  }
                }}
                className={classNames(
                  'flex-1 rounded-lg py-2 text-[13px] font-medium transition-all duration-150',
                  activeTab === tab
                    ? 'bg-white shadow-sm text-content-primary'
                    : 'text-content-helper hover:text-content-primary'
                )}
                aria-pressed={activeTab === tab}
              >
                {tab === 'sms' ? (
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {verified.sms && (
                      <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-brand-green text-white text-[9px]">
                        ✓
                      </span>
                    )}
                    SMS
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-1.5">
                    {verified.email && (
                      <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-brand-green text-white text-[9px]">
                        ✓
                      </span>
                    )}
                    Email
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── OTP boxes ── */}
          <div className="mb-5 flex justify-center">
            <VerificationCode
              length={6}
              splitAfter={3}
              value={code}
              onChange={(val) => {
                log('code updated, length:', val.length);
                setCode(val);
              }}
              onComplete={(val) => {
                log('code complete:', val);
                setCode(val);
              }}
              autoFocus
              disabled={isExpired}
            />
          </div>

          {/* ── Timer ── */}
          <div className="mb-4 flex items-center justify-center gap-1.5">
            <ClockIcon className={isExpired ? 'text-danger' : 'text-content-helper'} />
            <span
              className={classNames(
                'font-sans text-[13px] leading-5',
                isExpired ? 'text-danger font-medium' : 'text-content-helper'
              )}
            >
              {isExpired ? 'Code expired' : `Code expires in ${formatTime(timeLeft)}`}
            </span>
          </div>

          {/* ── Resend ── */}
          <div className="mb-5 flex items-center justify-center gap-1 text-[13px]">
            <span className="text-content-helper">I didn&apos;t receive a code.</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLeft > 0}
              className={classNames(
                'font-semibold transition-colors duration-100',
                resendLeft > 0
                  ? 'text-content-tertiary cursor-not-allowed'
                  : 'text-brand-green hover:underline underline-offset-2'
              )}
            >
              {resendLeft > 0 ? `Resend in 0:${resendLeft.toString().padStart(2, '0')}` : 'Resend'}
            </button>
          </div>

          {/* ── Verify CTA ── */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!isCodeComplete || isExpired}
            rightIcon={<ArrowRightIcon />}
            onClick={handleVerify}
            className="w-full mb-4"
          >
            {verifyButtonLabel}
          </Button>

          {/* ── Trust badge ── */}
          <div className="flex items-center justify-center gap-1">
            <ShieldCheckIcon className="text-brand-green" />
            <span className="text-[10px] text-neutral-dark-hover">
              Your contact details are encrypted at rest
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // SUCCESS STAGE
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-success-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-[440px] rounded-3xl bg-white p-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button (✕) — absolutely positioned top-right ── */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            log('close button clicked');
            onClose?.();
          }}
          className="absolute right-5 top-5 inline-flex size-[28px] items-center justify-center rounded-[20px] bg-[#ebf1ec] text-[#387440] transition-colors duration-100 hover:bg-[#d4e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        >
          <CloseIcon />
        </button>

        {/* ── Header ── */}
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <div className="flex size-[62px] shrink-0 items-center justify-center rounded-2xl bg-brand-green-light">
            <SuccessCheckIcon />
          </div>
          <div className="flex flex-col gap-1">
            <h2
              id="contact-success-title"
              className="font-display font-normal text-black"
              style={{
                fontSize: 'clamp(1.375rem, 2.2vw, 2rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.28px',
              }}
            >
              Contact <span className="italic text-brand-green">verified.</span>
            </h2>
            <p
              className="font-sans text-[14px] leading-5 text-[#959592]"
              style={{ letterSpacing: '0.1px' }}
            >
              Both your phone and email are confirmed. Here&apos;s what we stored.
            </p>
          </div>
        </div>

        {/* ── Summary table ── */}
        <div className="mb-4 rounded-2xl bg-[#EBF1EC]/30 border border-brand-green-light-hover p-4">
          <DataRow icon={<UserIcon />} label="Contact Name" value={data?.fullName} />
          <DataRow icon={<BriefcaseIcon />} label="Role / Title" value={data?.roleTitle} />
          <DataRow icon={<PhoneIcon />} label="Phone Number" value={maskedPhone} />
          <DataRow icon={<MailIcon />} label="Email Address" value={maskedEmail} />
        </div>

        {/* Divider */}
        <div className="w-full h-[3px] mb-4 bg-brand-green-light" />

        {/* ── Continue CTA ── */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleContinue}
          rightIcon={<ArrowRightIcon />}
          className="w-full"
        >
          Continue to Activate Account
        </Button>

        <div className="flex items-center justify-center mt-3.5 gap-1">
          <ShieldCheckIcon className="text-brand-green" />
          <span className="text-[10px] text-neutral-dark-hover">
            Data encrypted at rest · Ghana Data Protection Act compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactVerificationModal;
