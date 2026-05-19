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
} from '../components/shared/assets.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';
import rightPanelImage from '../assets/login/login page right panel.jpg';

const log = debug('LoginPage');

/*
 * LoginPage — public log-in screen.
 * Figma source: node 2849-52564 ("Gth Log In Default flow"). Two-column
 * layout — left side hosts the form (phone + password + remember-me +
 * CTA + create-account callout); right side is the brand-green
 * decorative panel with the trust badges.
 *
 * Decorative photo cards on the right panel are deferred — the panel
 * ships with the brand-green fill, the soft orb gradients, the "Data
 * Protected" badge and the "Ghana Data Protection Act compliant" pill,
 * which carry the trust messaging. The 3 rotated photo cards and the
 * Abena Mensah profile card will land in a follow-up.
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

// ---- right panel ------------------------------------------------------

// Right panel — single composed JPG from Figma node 2849:52632. The
// previous piecemeal implementation (rotated photo cards + Data Protected
// badge + compliance pill + sparkle doodles + Abena Mensah card) is
// collapsed into one image so the panel always matches the design exactly.
const RightPanel = () => (
  <aside
    aria-hidden="true"
    className="relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block"
  >
    <img
      src={rightPanelImage}
      alt=""
      className="absolute inset-0 size-full object-contain"
      loading="lazy"
      decoding="async"
    />
  </aside>
);

// ---- left panel: form -------------------------------------------------

const LoginForm = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasValues = phone.trim().length > 0 && password.length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) return;
    log('submit', { phone, keepLoggedIn });
    setIsLoading(true);
    // Placeholder transition until /login API is wired in.
    setTimeout(() => setIsLoading(false), 1500);
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
          <div className="flex h-[51px] w-full items-center gap-2 rounded-md border border-[#cccccc] bg-white pr-4 shadow-[0_2.5px_0_0_rgba(191,191,191,0.8)] transition-colors focus-within:border-brand-green-light-active focus-within:bg-yellow-light focus-within:shadow-[0_2.5px_0_0_rgba(34,70,38,0.8)]">
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
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 min-w-0 border-none bg-transparent text-[14px] leading-5 tracking-[0.2px] text-content-primary placeholder:text-[#595959] outline-none"
            />
          </div>
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
            onChange={(e) => setPassword(e.target.value)}
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
        <Link to={ROUTES.getStarted}>
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
  return (
    // Outer width is pinned to the Figma frame (1728×1117, node 2849-52564)
    // so the design holds its shape on zoom-out and ultrawide displays
    // instead of stretching across the viewport.
    <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1728px] bg-white">
      <div className="flex flex-1 items-center justify-center px-6 py-12 md:py-20">
        <LoginForm />
      </div>
      <RightPanel />
    </section>
  );
};

export default LoginPage;
