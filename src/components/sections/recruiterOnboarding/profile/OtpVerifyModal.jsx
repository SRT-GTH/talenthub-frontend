import { useEffect, useRef, useState } from 'react';
import Button from '../../../ui/Button.jsx';
import ProfileModalShell from './ProfileModalShell.jsx';
import { ArrowRightIcon, LoadingSpinner } from '../../../shared/assets.jsx';
import { ClockGlyph, DocCheckGlyph, EmailPillGlyph, SmsPillGlyph } from './profileIcons.jsx';
import { formatMmSs } from './profileValidation.js';
import { resendOtp, verifyOtp } from './profileApi.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('OtpVerifyModal');

/*
 * OtpVerifyModal - R02 verify modal, Figma 7374:2524 (empty), 2837 (wrong
 * code), 3149 (code entered). 460px card; hero tile, "SMS + Email" chips,
 * "Check your messages." (last word green), masked contact line, "Change
 * email or phone" link, 6 cells (62px, 2px gap, "-" placeholder #595959),
 * "Code expires in 09:58" ticking, "Didn't receive it? Resend code (59s)"
 * cooldown, CTA ("Enter all 6 digits to continue" disabled -> "Verify &
 * Continue" green; grey + red cells after a wrong code until edited),
 * "3 attempts remaining" (decrements per wrong code).
 *
 * Demo code 123456 (profileApi.verifyOtp). Assumptions (Figma shows neither):
 *   - 0 attempts left or 00:00 expiry freezes the cells; Resend (immediately
 *     available) restores 3 attempts + 09:58.
 */
const LENGTH = 6;
const EXPIRY_SECONDS = 598; // 09:58
const RESEND_SECONDS = 59;
const MAX_ATTEMPTS = 3;

const CELL_STATE = {
  default: 'border-[#cccccc] shadow-[0_3px_0_0_rgba(191,191,191,0.8)]',
  active: 'border-brand-green-light-active shadow-[0_3px_0_0_rgba(34,70,38,0.8)]',
  error: 'border-danger-light-active shadow-[0_3px_0_0_rgba(146,43,33,1)]',
  disabled: 'border-[#cccccc] bg-brand-green-light shadow-none cursor-not-allowed',
};

const Channel = ({ label, icon }) => (
  <span className="inline-flex items-center gap-1 rounded-[6px] border border-brand-green-light-hover bg-brand-green-light px-2 py-0.5">
    {icon}
    <span
      className="text-[11px] font-medium text-brand-green max-lg:text-[12px]"
      style={{ letterSpacing: '0.2px' }}
    >
      {label}
    </span>
  </span>
);

const OtpCells = ({ value, onChange, invalid, disabled, describedBy }) => {
  const refs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] || '');

  const commit = (arr) => onChange(arr.join(''));
  const focusAt = (i) => {
    const el = refs.current[Math.max(0, Math.min(LENGTH - 1, i))];
    el?.focus();
    el?.select?.();
  };

  const fill = (start, raw) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) return;
    const next = [...digits];
    for (let k = 0; k < clean.length && start + k < LENGTH; k += 1) next[start + k] = clean[k];
    commit(next);
    focusAt(Math.min(start + clean.length, LENGTH - 1));
  };

  return (
    <div
      role="group"
      aria-label="6-digit verification code"
      className="flex w-full items-center justify-center gap-0.5"
    >
      {digits.map((d, i) => {
        const tone = disabled ? 'disabled' : invalid ? 'error' : d ? 'active' : 'default';
        return (
          <input
            key={i}
            ref={(el) => (refs.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={LENGTH}
            placeholder="-"
            disabled={disabled}
            value={d}
            aria-label={`Digit ${i + 1} of ${LENGTH}`}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onFocus={(e) => e.target.select()}
            onChange={(e) => fill(i, e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              fill(i, e.clipboardData.getData('text'));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                e.preventDefault();
                const next = [...digits];
                if (next[i]) next[i] = '';
                else if (i > 0) {
                  next[i - 1] = '';
                  focusAt(i - 1);
                }
                commit(next);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                focusAt(i - 1);
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                focusAt(i + 1);
              }
            }}
            className={classNames(
              'aspect-square min-w-0 max-w-[62px] flex-1 rounded-md border-2 bg-white text-center font-sans text-[16px] font-semibold leading-6 text-content-primary placeholder:text-[#595959] placeholder:font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:shadow-none!',
              CELL_STATE[tone]
            )}
          />
        );
      })}
    </div>
  );
};

const OtpVerifyModal = ({ phoneMasked, emailMasked, onClose, onChangeContact, onVerified }) => {
  const [code, setCode] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [secondsLeft, setSecondsLeft] = useState(EXPIRY_SECONDS);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    log('mount; timers start', { EXPIRY_SECONDS, RESEND_SECONDS });
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      setResendIn((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  const expired = secondsLeft === 0;
  const locked = expired || attempts === 0;
  const complete = code.length === LENGTH;
  const ready = complete && !invalid && !locked;
  const resendReady = resendIn === 0 || locked;

  const handleChange = (next) => {
    if (locked) return;
    if (invalid && next !== code) setInvalid(false);
    setCode(next);
  };

  const handleVerify = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      await verifyOtp(code);
      log('verified');
      if (mounted.current) onVerified();
    } catch (err) {
      log('wrong code', err?.code);
      if (!mounted.current) return;
      setInvalid(true);
      setAttempts((a) => Math.max(0, a - 1));
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!resendReady) return;
    log('resend');
    await resendOtp();
    if (!mounted.current) return;
    setCode('');
    setInvalid(false);
    setAttempts(MAX_ATTEMPTS);
    setSecondsLeft(EXPIRY_SECONDS);
    setResendIn(RESEND_SECONDS);
  };

  const ctaLabel = complete ? 'Verify & Continue' : 'Enter all 6 digits to continue';
  log('render', { complete, invalid, attempts, secondsLeft, resendIn });

  return (
    <ProfileModalShell
      labelledBy="profile-otp-title"
      onClose={onClose}
      maxWidth={460}
      closeLabel="Close verification"
    >
      <div className="flex flex-col items-center gap-3 pt-7 text-center">
        <span className="flex size-16 items-center justify-center rounded-[10px] bg-[#e1eae2] text-brand-green">
          <DocCheckGlyph className="size-7" />
        </span>
        <div className="flex items-center gap-1.5">
          <Channel label="SMS" icon={<SmsPillGlyph className="size-3 text-brand-green" />} />
          <span aria-hidden="true" className="text-[12px] text-neutral-dark">
            +
          </span>
          <Channel label="Email" icon={<EmailPillGlyph className="size-3 text-brand-green" />} />
        </div>
        <h2
          id="profile-otp-title"
          className="font-heading font-semibold text-[#1c2a21]"
          style={{ fontSize: 28, lineHeight: '30px', letterSpacing: '-0.56px' }}
        >
          Check your <span className="text-brand-green">messages.</span>
        </h2>
        <p className="text-[14px] leading-5 text-[#70706E]" style={{ letterSpacing: '0.2px' }}>
          We sent a 6-digit code to confirm your contact details.
        </p>
        <p
          className="text-[12px] font-semibold leading-5 text-[#575755]"
          style={{ letterSpacing: '0.1px' }}
        >
          {phoneMasked} · {emailMasked}
        </p>
        <button
          type="button"
          onClick={onChangeContact}
          className="text-[12px] font-medium leading-tight text-brand-green underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:py-2.5"
        >
          Change email or phone
        </button>
      </div>

      <div className="mt-5">
        <OtpCells
          value={code}
          onChange={handleChange}
          invalid={invalid && !locked}
          disabled={locked}
          describedBy="profile-otp-attempts"
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-1.5 text-[12px] leading-[18px]">
        <div
          className="inline-flex items-center gap-1.5 text-[#70706E]"
          style={{ letterSpacing: '0.2px' }}
        >
          <ClockGlyph className="size-3.5" />
          <span className="font-ui">Code expires in</span>
          <span
            className={classNames('font-semibold', expired ? 'text-danger' : 'text-brand-green')}
          >
            {formatMmSs(secondsLeft)}
          </span>
        </div>
        <div
          className="inline-flex items-center gap-2 text-[#70706E]"
          style={{ letterSpacing: '0.2px' }}
        >
          <span>Didn&apos;t receive it?</span>
          <button
            type="button"
            disabled={!resendReady}
            onClick={handleResend}
            className={classNames(
              'font-semibold underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:py-2',
              resendReady ? 'text-brand-green' : 'text-[#BABAB7]'
            )}
          >
            Resend code{resendReady ? '' : ` (${resendIn}s)`}
          </button>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        size="lg"
        disabled={!ready || busy}
        onClick={handleVerify}
        leftIcon={busy ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
        rightIcon={<ArrowRightIcon />}
        className="mt-4 w-full"
        aria-busy={busy}
        data-testid="otp-cta"
      >
        {ctaLabel}
      </Button>

      <p
        id="profile-otp-attempts"
        role="status"
        aria-live="polite"
        className="mt-2 text-center text-[10px] leading-4 text-[#70706E] max-lg:text-[12px]"
        style={{ letterSpacing: '0.2px' }}
      >
        {attempts} attempt{attempts === 1 ? '' : 's'} remaining
      </p>
    </ProfileModalShell>
  );
};

export default OtpVerifyModal;
