import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { TextInput, Checkbox } from '../components/ui/form';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import {
  ChevronDownIcon,
  LockIcon,
  EyeIcon,
  ArrowRightIcon,
  LoadingSpinner,
  CloseIcon,
} from '../components/shared/assets.jsx';
import { classNames } from '../utils/classNames.js';
import { debug } from '../utils/debug.js';
import leftPanelBg from '../assets/onboarding/left panel bg.jpg';
import OnboardingRightPanel from '../components/shared/OnboardingRightPanel.jsx';

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
    <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 text-[8px] leading-none text-black">
      ★
    </span>
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
const AuthErrorToast = ({ onClose }) => (
  <div
    role="alert"
    className="absolute right-4 top-4 z-10 hidden w-[360px] items-start gap-3 rounded-[14px] border border-danger-light-active bg-danger-light px-4 py-3 shadow-[0_16px_24px_-6px_rgba(146,43,33,0.18),0_2px_2px_-1px_rgba(146,43,33,0.06)] lg:flex"
  >
    <span className="mt-[2px] inline-flex shrink-0 text-danger">
      <DangerAlertIcon className="size-4" />
    </span>
    <div className="flex flex-1 flex-col gap-1">
      <p className="text-[14px] font-semibold leading-5 tracking-[0.1px] text-danger-dark">
        Incorrect Phone Number Or Password
      </p>
      <p className="text-[12px] leading-[18px] tracking-[0.2px] text-danger">
        Please check your details and try again.{' '}
        <Link
          to="/forgot-password"
          className="font-semibold text-danger underline underline-offset-2 hover:text-danger-hover"
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
  'flex h-[51px] w-full items-center gap-2 rounded-md pr-4 transition-colors';
const PHONE_WRAPPER_DEFAULT =
  'bg-white border border-[#cccccc] shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] ' +
  'focus-within:border-brand-green-light-active focus-within:bg-yellow-light focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]';
const PHONE_WRAPPER_ERROR =
  'bg-white border-[1.5px] border-danger-light-active shadow-[0_2.5px_0_0_rgba(146,43,33,0.8)]';

const PHONE_ERROR_COPY = 'Enter a valid Ghanaian mobile number (e.g. 020 000 0000)';
const PASSWORD_ERROR_COPY = 'Please enter your password';

// Rough Ghana mobile heuristic — keeps the demo-state contract simple:
// at least 9 digits after stripping non-digit characters. Real validation
// (network code + local-number rules) lands when the /login API does.
const isPhoneShapeValid = (raw) => raw.replace(/\D/g, '').length >= 9;

const LoginForm = ({ onAuthFailure, onClearAuthFailure }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const hasValues = phone.trim().length > 0 && password.length > 0;

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    if (phoneError) setPhoneError(null);
    onClearAuthFailure();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (passwordError) setPasswordError(null);
    onClearAuthFailure();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;

    const nextPhoneError = !phone.trim()
      ? PHONE_ERROR_COPY
      : !isPhoneShapeValid(phone)
        ? PHONE_ERROR_COPY
        : null;
    const nextPasswordError = password.length === 0 ? PASSWORD_ERROR_COPY : null;

    setPhoneError(nextPhoneError);
    setPasswordError(nextPasswordError);

    if (nextPhoneError || nextPasswordError) {
      log('submit blocked — field errors', { phone: nextPhoneError, password: nextPasswordError });
      return;
    }

    log('submit', { phone, keepLoggedIn });
    setIsLoading(true);
    // Placeholder transition until /login API is wired in. The simulated
    // failure surfaces the auth-failure toast so the design-system error
    // state is reachable in development; remove once a real auth call
    // returns its own success / error branch.
    setTimeout(() => {
      setIsLoading(false);
      onAuthFailure();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[440px] flex-col gap-6" noValidate>
      {/* eyebrow + heading + sub-copy */}
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-brand-green-light-active bg-brand-green-light px-3 py-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-brand-green shadow-[inset_0_0_3px_#19341d]"
          />
          <span className="text-[12px] font-medium leading-[18px] tracking-[0.2px] text-brand-green">
            WELCOME BACK
          </span>
        </span>

        <h1
          className="font-display font-normal"
          style={{ fontSize: 'clamp(2rem, 3.6vw, 2.75rem)', lineHeight: 1.15 }}
        >
          <span className="block text-black">Log in to</span>
          <span className="block italic text-brand-green">Ghana Talent Hub.</span>
        </h1>

        <p className="max-w-[360px] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
          Enter your phone number and password to access your talent profile and opportunities.
        </p>

        <WavyDivider />
      </header>

      {/* fields */}
      <div className="flex flex-col gap-4">
        {/* Phone with country-code picker */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-phone"
            className="inline-flex items-baseline gap-px text-[14px] font-medium leading-6 tracking-[0.2px] text-content-primary"
          >
            Phone Number
            <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
              *
            </span>
          </label>
          <div
            className={classNames(
              PHONE_WRAPPER_BASE,
              phoneError ? PHONE_WRAPPER_ERROR : PHONE_WRAPPER_DEFAULT
            )}
          >
            <button
              type="button"
              className="flex h-full items-center gap-2 border-r border-[#e7e7e7] pl-4 pr-3 text-[14px] tracking-[0.2px] text-content-primary"
              aria-label="Select country code"
            >
              <GhanaFlagIcon />
              <span className="font-medium">+233</span>
              <ChevronDownIcon className="text-content-tertiary" />
            </button>
            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="23 533 45"
              value={phone}
              onChange={handlePhoneChange}
              aria-invalid={Boolean(phoneError) || undefined}
              aria-describedby={phoneError ? 'login-phone-error' : undefined}
              className="flex-1 min-w-0 border-none bg-transparent text-[14px] leading-5 tracking-[0.2px] text-content-primary placeholder:text-[#595959] outline-none"
            />
          </div>
          {phoneError && (
            <div
              id="login-phone-error"
              role="alert"
              className="flex items-center gap-2 px-2 text-danger"
            >
              <DangerAlertIcon className="size-4 shrink-0" />
              <p className="font-sans text-[12px] leading-[18px] tracking-[0.2px]">{phoneError}</p>
            </div>
          )}
        </div>

        {/* Password with Forget Password link + eye toggle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="inline-flex items-baseline gap-px text-[14px] font-medium leading-6 tracking-[0.2px] text-content-primary"
            >
              Password
              <span aria-hidden="true" className="text-[14px] font-semibold text-brand-green">
                *
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[14px] font-semibold leading-6 tracking-[0.1px] text-brand-green underline-offset-2 hover:underline"
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
          />
        </div>

        <Checkbox
          label="Keep me logged in"
          checked={keepLoggedIn}
          onChange={(e) => setKeepLoggedIn(e.target.checked)}
        />
      </div>

      {/* CTA. Loading state mirrors Figma 2849:54106 "Pressed-active" —
          forced `state="active"` pins the darker-green pressed look while
          the spinner spins; `aria-busy` keeps the disabled-on-submit
          semantics for screen readers. */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!hasValues || isLoading}
        state={isLoading ? 'active' : undefined}
        leftIcon={isLoading ? <LoadingSpinner stroke="#EBF1EC" /> : undefined}
        rightIcon={<ArrowRightIcon />}
        className="w-full"
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
      <div className="flex flex-col items-center gap-3 rounded-[14px] border border-[#e7e7e7] bg-yellow-light p-4 text-center">
        <p className="text-[14px] leading-5 tracking-[0.2px] text-[#737373]">
          Create your free talent profile in under 5 minutes.
        </p>
        <Link to={'/get-started'}>
          <Button variant="tertiary" size="md" rightIcon={<ArrowRightIcon />}>
            Create an account — it&apos;s free
          </Button>
        </Link>
      </div>
    </form>
  );
};

// ---- page -------------------------------------------------------------

const LoginPage = () => {
  log('mount');
  const [authError, setAuthError] = useState(false);

  return (
    // Outer width is pinned to the Figma frame (1728×1117, node 2849-52564)
    // so the design holds its shape on zoom-out and ultrawide displays
    // instead of stretching across the viewport.
    <section className="mx-auto flex w-full min-h-[calc(100vh-160px)] bg-white">
      {/* Left column hosts the form on top of a soft green-orb ambient
          decoration (Figma node 2849:52564). The orb sits in the top-left
          and fades to white toward the form's center — the asset's aspect
          ratio matches the ~58% column width left by the right panel, so
          object-cover from top-left anchors the glow correctly. */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 md:py-20">
        <img
          src={leftPanelBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover object-left-top select-none"
          loading="lazy"
          decoding="async"
        />
        <div className="relative z-10 flex w-full items-center justify-center">
          <LoginForm
            onAuthFailure={() => setAuthError(true)}
            onClearAuthFailure={() => authError && setAuthError(false)}
          />
        </div>
      </div>
      <OnboardingRightPanel
        toast={authError ? <AuthErrorToast onClose={() => setAuthError(false)} /> : null}
      />
    </section>
  );
};

export default LoginPage;
