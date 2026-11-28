import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../../ui/form/mobileScale.js';
import { VerificationCode } from '../../ui/form';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner, CloseIcon } from '../../shared/assets.jsx';
import { getApiErrorCode, getApiErrorMessage } from '../../../services/apiErrors.js';
import { verifyLoginOtp, resendLoginOtp, resolveHomePath } from '../../../services/auth.api.js';
import { twoStepPath } from '../../../services/mfa.api.js';
import { resolveNext } from '../../../utils/authNext.js';
import { debug } from '../../../utils/debug.js';

const log = debug('LoginSteps');

/*
 * Pieces shared by every log-in screen (the main /login and the parent log-in):
 *   DangerAlertIcon  — 16px circle-bang glyph for field errors and the toast
 *   AuthErrorToast   — "Incorrect … Or Password" danger toast (panel on desktop, inline on phones)
 *   LoginOtpStep     — step 2: the 6-digit code emailed after a correct password
 */

export const DangerAlertIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
  </svg>
);

// Danger toast after a failed log-in: light danger fill, soft danger outline, danger-tone
// title + body, "Forget Password" inline link, dismiss-X. Sits absolutely so it can hover
// over the decorative right panel. `inline` renders the compact phone version above the form.
export const AuthErrorToast = ({
  onClose,
  inline = false,
  // The inline copy hides on desktop where the panel copy shows; screens without a panel copy keep it.
  hideOnDesktop = true,
  title = 'Incorrect Phone Number Or Password',
}) => (
  <div
    role="alert"
    className={
      inline
        ? `flex w-full items-start gap-2 rounded-[10px] border border-danger-light-active bg-danger-light px-3 py-2 ${hideOnDesktop ? 'lg:hidden' : ''}`
        : 'absolute right-4 top-4 z-10 hidden w-[360px] items-start gap-3 rounded-[14px] border border-danger-light-active bg-danger-light px-4 py-3 shadow-[0_16px_24px_-6px_rgba(146,43,33,0.18),0_2px_2px_-1px_rgba(146,43,33,0.06)] lg:flex'
    }
  >
    <span className="mt-[2px] inline-flex shrink-0 text-danger">
      <DangerAlertIcon className="size-4" />
    </span>
    <div className="flex flex-1 flex-col gap-1">
      <p className="text-[14px] font-semibold leading-5 tracking-[0.1px] text-danger-dark">
        {title}
      </p>
      <p className="text-[12px] leading-[18px] tracking-[0.2px] text-danger">
        Please check your details and try again.{' '}
        <Link
          to="/forgot-password"
          className="font-semibold text-danger underline underline-offset-2 hover:text-danger-hover relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
        >
          Forget Password
        </Link>
      </p>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Dismiss error"
      className="inline-flex shrink-0 size-5 items-center justify-center rounded-full text-danger transition-colors hover:bg-danger-light-hover"
    >
      <CloseIcon />
    </button>
  </div>
);

/*
 * LoginOtpStep — the code step after a correct password (POST /auth/verify-otp).
 * `accentClassName` colours the second headline word (talent green by default, the
 * parent screens pass their gold). On success it goes to the account's home, or to a
 * safe `?next=`, or to the 2-step set-up first when that is required.
 */
export const LoginOtpStep = ({
  identity,
  maskedEmail,
  onBack,
  accentClassName = 'text-brand-green',
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isResending, setIsResending] = useState(false);

  const verify = async (value) => {
    if (isVerifying || String(value).length !== 6) return;
    setIsVerifying(true);
    setError('');
    try {
      const { accessToken, user, mfaSetup } = await verifyLoginOtp({ identity, otp: value });
      if (!accessToken) throw new Error('No token returned');
      const home = await resolveHomePath(user);
      // `?next=` from a public page ("log in, then carry on"): followed only when it fits this account (utils/authNext.js).
      const dest = resolveNext(searchParams.get('next'), home);
      // 2-step verification is required for this account and the grace period is over: set it up first, then carry on.
      const to = mfaSetup?.mustSetUpNow ? twoStepPath({ required: true, next: dest }) : dest;
      log('logged in; going to', to, dest === home ? '(home)' : '(next)');
      navigate(to, { replace: true });
    } catch (err) {
      log.error('verify failed:', getApiErrorCode(err));
      const apiCode = getApiErrorCode(err);
      setError(
        apiCode === 'INVALID_OTP'
          ? 'That code is not correct. Please check it and try again.'
          : apiCode === 'TOO_MANY_ATTEMPTS'
            ? 'Too many attempts. Request a new code.'
            : getApiErrorMessage(err)
      );
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    if (isResending) return;
    setIsResending(true);
    setError('');
    try {
      await resendLoginOtp({ identity });
      setNotice('A new code is on its way.');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3">
      <header className="flex flex-col items-center gap-3 text-center max-md:gap-1.5">
        <h1
          className="font-heading font-semibold focused:font-sans tracking-[-0.01em] max-md:text-[24px]! max-md:leading-tight!"
          style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.1 }}
        >
          <span className="block text-black">Check your</span>
          <span className={`block ${accentClassName}`}>email.</span>
        </h1>
        <p className="max-w-[380px] text-[14px] max-md:text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-content-primary">{maskedEmail || 'your email'}</span>.
          Enter it below to finish logging in.
        </p>
        <WavyDivider />
      </header>

      <VerificationCode
        length={6}
        value={code}
        onChange={(v) => {
          setCode(v);
          if (error) setError('');
        }}
        onComplete={verify}
        autoFocus
        label="Verification code"
        error={error || undefined}
        helperText={!error ? notice || 'The code expires in 15 minutes.' : undefined}
      />

      <Button
        type="button"
        variant="primary"
        size="lg"
        disabled={code.length !== 6 || isVerifying}
        state={isVerifying ? 'active' : undefined}
        leftIcon={isVerifying ? <LoadingSpinner stroke="#EBF1EC" /> : undefined}
        rightIcon={<ArrowRightIcon />}
        onClick={() => verify(code)}
        className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
        aria-busy={isVerifying}
      >
        {isVerifying ? 'Verifying' : 'Verify And Log In'}
      </Button>

      <div className="flex items-center justify-between text-[14px] max-md:text-[13px]">
        <button
          type="button"
          onClick={onBack}
          className="font-semibold text-[#737373] underline-offset-2 hover:underline"
        >
          Use different details
        </button>
        <button
          type="button"
          onClick={resend}
          disabled={isResending}
          className="font-semibold text-brand-green underline-offset-2 hover:underline disabled:opacity-60"
        >
          {isResending ? 'Sending…' : 'Resend code'}
        </button>
      </div>
    </div>
  );
};
