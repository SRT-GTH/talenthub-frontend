import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import {
  COMPACT_PRIMARY_BUTTON,
  COMPACT_SECONDARY_BUTTON,
} from '../components/ui/form/mobileScale.js';
import { TextInput, Checkbox, VerificationCode } from '../components/ui/form';
import ApiErrorNote from '../components/shared/ApiErrorNote.jsx';
import { getApiErrorCode, getApiErrorMessage } from '../services/apiErrors.js';
import {
  LOGIN_MODE,
  requestLoginOtp,
  verifyLoginOtp,
  resendLoginOtp,
} from '../services/auth.api.js';
import { toGhanaE164 } from '../services/onboardingMappers.js';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import {
  ChevronDownIcon,
  LockIcon,
  EyeIcon,
  ArrowRightIcon,
  LoadingSpinner,
  CloseIcon,
  MailIcon,
} from '../components/shared/assets.jsx';
import { classNames } from '../utils/classNames.js';
import { debug } from '../utils/debug.js';
import OnboardingRightPanel from '../components/shared/OnboardingRightPanel.jsx';
import TalentLoginPanelContent from '../components/sections/talentAuth/TalentLoginPanelContent.jsx';

const log = debug('LoginPage');

/*
 * LoginPage — public log-in screen.
 * Figma sources:
 *   2849-52564  default ("Gth Log In Default flow")
 *   2849-54692  inline error state (phone + password)
 *   2849-54908  hidden-password / filled state
 *   2849-55124  loading state ("Logging You In")
 *   2849-55855  auth-failure error state (inline errors + toast)
 *
 * Two-column layout — left side hosts the form (phone + password +
 * remember-me + CTA + create-account callout); right side is the
 * brand-green decorative panel with the trust badges. On a failed log-in
 * the right panel anchors a danger toast ("Incorrect Phone Number Or
 * Password"), Figma node 2849:55870.
 */

// ---- local icons ------------------------------------------------------
// SVG-based icons live in `components/shared/assets.jsx`; the Ghana flag
// is a span-stacked composition (not SVG) so it stays here for now.

const GhanaFlagIcon = () => (
  // Compact Ghana flag for the country-code button. Three horizontal stripes
  // + the centred black star.
  <span aria-hidden="true" className="relative inline-block size-5 overflow-hidden rounded-[3px]">
    <span className="absolute inset-x-0 top-0 h-[6.67px] bg-[#006B3F]" />
    <span className="absolute inset-x-0 top-[6.67px] h-[6.67px] bg-[#FCD116]" />
    <span className="absolute inset-x-0 top-[13.33px] h-[6.67px] bg-[#CE1126]" />
    {/* Star drawn via ::after so the button's label has a single text row. */}
    <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 text-[8px] max-lg:text-[12px] leading-none text-black after:content-['★']" />
  </span>
);

// 16px circle-+-bang glyph used at the start of inline field-error rows
// and on the auth-failure toast. Mirrors Field.jsx's AlertIcon but is
// re-declared here so the toast doesn't have to reach into form/Field.
const DangerAlertIcon = ({ className }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
  </svg>
);

// ---- error toast ------------------------------------------------------

// Figma node 2849:55870 — danger toast anchored on the right panel after a
// failed log-in. Light danger fill, soft danger outline, danger-tone title
// + body, "Forget Password" inline link, dismiss-X. Sits absolutely so it
// can hover over the brand-green panel without disturbing its layout.
// `inline` renders the compact phone version above the form (the panel is only decor on phones).
const AuthErrorToast = ({
  onClose,
  inline = false,
  title = 'Incorrect Phone Number Or Password',
}) => (
  <div
    role="alert"
    className={
      inline
        ? 'flex w-full items-start gap-2 rounded-[10px] border border-danger-light-active bg-danger-light px-3 py-2 lg:hidden'
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

// ---- left panel: form -------------------------------------------------

// Wrapper classes for the custom phone-row composition. The default
// border/shadow pair matches TextInput's resting state; the error pair
// mirrors TextInput's `error` STATE_CLASSES so the two controls read as
// one design family. The interactive focus-within rules stay live except
// in the error state (red border wins until the user starts typing again).
const PHONE_WRAPPER_BASE =
  'flex h-[51px] max-md:h-11 w-full items-center gap-2 rounded-md pr-4 max-md:pr-3 max-md:shadow-none! transition-colors';
const PHONE_WRAPPER_DEFAULT =
  'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] ' +
  'focus-within:border-brand-green-light-active focus-within:bg-yellow-light focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';
const PHONE_WRAPPER_ERROR =
  'bg-white border-[1.5px] border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]';

const PHONE_ERROR_COPY = 'Enter a valid Ghanaian mobile number (e.g. 020 000 0000)';
const EMAIL_ERROR_COPY = 'Enter a valid email address';
const PASSWORD_ERROR_COPY = 'Please enter your password';
const AUTH_FAILURE_TITLE = {
  phone: 'Incorrect Phone Number Or Password',
  email: 'Incorrect Email Or Password',
};

// Ghana mobile: 9 digits after the +233 prefix (a leading 0 is allowed).
const isPhoneShapeValid = (raw) => /^0?\d{9}$/.test(raw.replace(/\D/g, ''));
const isEmailShapeValid = (raw) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());

// Phone / Email switch, only shown when VITE_LOGIN_IDENTIFIER=both.
const MethodToggle = ({ method, onChange }) => (
  <div
    role="tablist"
    aria-label="Log in with"
    className="grid grid-cols-2 gap-1 rounded-[10px] border border-[#e7e7e7] bg-[#FAFAF8] p-1"
  >
    {[
      { key: 'phone', label: 'Phone Number' },
      { key: 'email', label: 'Email' },
    ].map((opt) => (
      <button
        key={opt.key}
        type="button"
        role="tab"
        aria-selected={method === opt.key}
        onClick={() => onChange(opt.key)}
        className={classNames(
          'h-9 rounded-[8px] text-[14px] max-md:text-[13px] font-semibold tracking-[0.1px] transition-colors',
          method === opt.key
            ? 'bg-white text-brand-green shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-brand-green-light-active'
            : 'text-[#737373] hover:text-content-primary'
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const FieldError = ({ id, message }) => (
  <div id={id} role="alert" className="flex items-center gap-2 px-2 text-danger">
    <DangerAlertIcon className="size-4 shrink-0" />
    <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px]">{message}</p>
  </div>
);

// Step 2: the 6-digit code emailed after a correct password.
const LoginOtpStep = ({ identity, maskedEmail, onBack }) => {
  const navigate = useNavigate();
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
      const { accessToken } = await verifyLoginOtp({ identity, otp: value });
      if (!accessToken) throw new Error('No token returned');
      log('logged in; going to profile');
      navigate('/profile/engagement', { replace: true });
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
          className="font-display font-normal max-md:text-[24px]! max-md:leading-tight!"
          style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)', lineHeight: 1.15 }}
        >
          <span className="block text-black">Check your</span>
          <span className="block italic text-brand-green">email.</span>
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

const LoginForm = ({ onAuthFailure, onClearAuthFailure }) => {
  const [method, setMethod] = useState(LOGIN_MODE === 'email' ? 'email' : 'phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [apiError, setApiError] = useState('');
  const [otpStep, setOtpStep] = useState(null); // { identity, maskedEmail }

  const identifierValue = method === 'phone' ? phone : email;
  const hasValues = identifierValue.trim().length > 0 && password.length > 0;

  const clearErrors = () => {
    if (identifierError) setIdentifierError(null);
    if (apiError) setApiError('');
    onClearAuthFailure();
  };

  const handleMethodChange = (next) => {
    log('login method:', next);
    setMethod(next);
    setIdentifierError(null);
    setApiError('');
    onClearAuthFailure();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (passwordError) setPasswordError(null);
    if (apiError) setApiError('');
    onClearAuthFailure();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    const nextIdentifierError =
      method === 'phone'
        ? isPhoneShapeValid(phone)
          ? null
          : PHONE_ERROR_COPY
        : isEmailShapeValid(email)
          ? null
          : EMAIL_ERROR_COPY;
    const nextPasswordError = password.length === 0 ? PASSWORD_ERROR_COPY : null;
    setIdentifierError(nextIdentifierError);
    setPasswordError(nextPasswordError);
    if (nextIdentifierError || nextPasswordError) {
      log('submit blocked: field errors', { method });
      return;
    }

    const identity =
      method === 'phone' ? { phoneNumber: toGhanaE164(phone) } : { email: email.trim() };
    log('submit', { method, keepLoggedIn });
    setIsLoading(true);
    setApiError('');
    try {
      const res = await requestLoginOtp({ identity, password });
      setOtpStep({ identity, maskedEmail: res?.maskedEmail || res?.data?.maskedEmail });
    } catch (err) {
      const code = getApiErrorCode(err);
      log.error('login failed:', code);
      if (code === 'INVALID_CREDENTIALS') onAuthFailure(method);
      else setApiError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (otpStep) {
    return (
      <LoginOtpStep
        identity={otpStep.identity}
        maskedEmail={otpStep.maskedEmail}
        onBack={() => {
          setOtpStep(null);
          setPassword('');
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3"
      noValidate
    >
      {/* eyebrow + heading + sub-copy */}
      <header className="flex flex-col items-center gap-3 text-center max-md:gap-1.5">
        <span className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-1.5 rounded-[10px] border border-brand-green-light-active bg-brand-green-light px-3 py-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-brand-green shadow-[inset_0_0_3px_#19341d]"
          />
          <span className="text-[12px] font-medium leading-[18px] tracking-[0.2px] text-brand-green">
            WELCOME BACK
          </span>
        </span>

        <h1
          className="font-display font-normal max-md:text-[24px]! max-md:leading-tight!"
          style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)', lineHeight: 1.15 }}
        >
          <span className="block text-black">Log in to</span>
          <span className="block italic text-brand-green">Ghana Talent Hub.</span>
        </h1>

        <p className="max-w-[360px] text-[14px] max-md:text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]">
          Enter your {method === 'phone' ? 'phone number' : 'email address'} and password to access
          your talent profile and opportunities.
        </p>

        <WavyDivider />
      </header>

      {/* fields */}
      <div className="flex flex-col gap-4 max-md:gap-3">
        {LOGIN_MODE === 'both' && <MethodToggle method={method} onChange={handleMethodChange} />}

        {method === 'phone' ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-phone"
              className="inline-flex items-baseline gap-px text-[14px] max-md:text-[13px] font-medium leading-6 max-md:leading-5 tracking-[0.2px] text-content-primary"
            >
              Phone Number
              <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
                *
              </span>
            </label>
            <div
              className={classNames(
                PHONE_WRAPPER_BASE,
                identifierError ? PHONE_WRAPPER_ERROR : PHONE_WRAPPER_DEFAULT
              )}
            >
              <button
                type="button"
                className="flex h-full shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#e7e7e7] pl-4 max-md:pl-3 pr-3 text-[14px] tracking-[0.2px] text-content-primary"
                aria-label="Select country code"
              >
                <GhanaFlagIcon />
                <span className="font-medium">+233</span>
                <ChevronDownIcon className="text-content-tertiary" />
              </button>
              <input
                id="login-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="24 123 4567"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearErrors();
                }}
                aria-invalid={Boolean(identifierError) || undefined}
                aria-describedby={identifierError ? 'login-identifier-error' : undefined}
                className="w-0 flex-1 min-w-0 border-none bg-transparent text-[14px] leading-5 tracking-[0.2px] text-content-primary placeholder:text-[#595959] outline-none"
              />
            </div>
            {identifierError && (
              <FieldError id="login-identifier-error" message={identifierError} />
            )}
          </div>
        ) : (
          <TextInput
            id="login-email"
            label="Email Address"
            required
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearErrors();
            }}
            error={identifierError || undefined}
            leftIcon={<MailIcon />}
          />
        )}

        {/* Password with Forget Password link + eye toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="inline-flex items-baseline gap-px text-[14px] max-md:text-[13px] font-medium leading-6 max-md:leading-5 tracking-[0.2px] text-content-primary"
            >
              Password
              <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
                *
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[14px] max-md:text-[13px] font-semibold leading-6 tracking-[0.1px] text-brand-green underline-offset-2 hover:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            >
              Forget Password
            </Link>
          </div>
          <TextInput
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Your Password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError || undefined}
            leftIcon={<LockIcon />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="text-content-tertiary"
              >
                <EyeIcon />
              </button>
            }
            rightIconInteractive
          />
        </div>

        <Checkbox
          label="Keep me logged in"
          checked={keepLoggedIn}
          onChange={(e) => setKeepLoggedIn(e.target.checked)}
        />
      </div>

      <ApiErrorNote message={apiError} />

      {/* CTA. Loading state mirrors Figma 2849:54106 "Pressed-active". */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!hasValues || isLoading}
        state={isLoading ? 'active' : undefined}
        leftIcon={isLoading ? <LoadingSpinner stroke="#EBF1EC" /> : undefined}
        rightIcon={<ArrowRightIcon />}
        className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
        aria-busy={isLoading}
      >
        {isLoading ? 'Logging You In' : hasValues ? 'Continue' : 'Enter Your Details To Continue'}
      </Button>

      {/* Divider */}
      <div
        role="separator"
        className="flex items-center gap-3 text-[12px] tracking-[0.2px] text-[#959592]"
      >
        <span className="h-px flex-1 bg-[#e7e7e7]" aria-hidden="true" />
        New to Ghana Talent Hub?
        <span className="h-px flex-1 bg-[#e7e7e7]" aria-hidden="true" />
      </div>

      {/* Create-account callout */}
      <div className="flex flex-col items-center gap-3 max-md:gap-2 rounded-[14px] border border-[#e7e7e7] bg-yellow-light p-4 max-md:p-3 text-center">
        <p className="text-[14px] max-md:text-[13px] leading-5 tracking-[0.2px] text-[#737373]">
          Create your free talent profile in under 5 minutes.
        </p>
        <Link to={'/get-started'}>
          <Button
            variant="tertiary"
            size="md"
            rightIcon={<ArrowRightIcon />}
            className={COMPACT_SECONDARY_BUTTON}
          >
            <span className="max-sm:hidden">Create an account — it&apos;s free</span>
            <span className="sm:hidden">Create an account</span>
          </Button>
        </Link>
      </div>
    </form>
  );
};

// ---- page -------------------------------------------------------------

const LoginPage = () => {
  log('mount');
  // null, or the login method that failed ('phone' | 'email') for the toast copy.
  const [authError, setAuthError] = useState(null);
  const toastTitle = AUTH_FAILURE_TITLE[authError] || AUTH_FAILURE_TITLE.phone;

  return (
    // Outer width is pinned to the Figma frame (1728×1117, node 2849-52564)
    // so the design holds its shape on zoom-out and ultrawide displays
    // instead of stretching across the viewport.
    <section className="relative flex w-full flex-1 min-h-0 overflow-hidden">
      {/* Left column scrolls while the right panel stays fixed at screen height. */}
      <div className="relative flex flex-1 items-center max-md:items-start justify-center max-lg:z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 py-12 md:py-20 max-md:px-4 max-md:py-4">
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3">
          {authError && (
            <div className="w-full max-w-[700px] lg:hidden">
              <AuthErrorToast inline title={toastTitle} onClose={() => setAuthError(null)} />
            </div>
          )}
          <LoginForm
            onAuthFailure={(method) => setAuthError(method)}
            onClearAuthFailure={() => authError && setAuthError(null)}
          />
        </div>
      </div>
      <OnboardingRightPanel
        panelContent={<TalentLoginPanelContent />}
        toast={
          authError ? (
            <AuthErrorToast title={toastTitle} onClose={() => setAuthError(null)} />
          ) : null
        }
      />
    </section>
  );
};

export default LoginPage;
