import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import WavyDivider from '../../shared/WavyDivider.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import PasswordInput from '../../ui/form/PasswordInput.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Button from '../../ui/Button.jsx';
import { UserIcon, LoadingSpinner } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentLoginSection');

/*
 * ParentLoginSection — left content column for the parent login screen
 * (Figma 2884:64759). Rendered inside ParentOnboardingLayout via <Outlet />.
 *
 * Layout shell (BG ellipses + right panel) lives in
 * src/layout/ParentOnboardingLayout.jsx.
 *
 *   • "WELCOME BACK" amber badge (custom, NOT Captions)
 *   • Headline: "Log in to Ghana Talent Hub." (italic #c8951a, Instrument Serif 64px)
 *   • Subtitle with "Create your account" green link
 *   • WavyDivider
 *   • Form: email/phone + password + "Keep me logged in" checkbox
 *   • CTA button (disabled → active → loading states)
 *   • Divider + "New to Ghana Talent Hub?" text
 *   • Register card + "Set up your account" button
 */

// ── zod schema ────────────────────────────────────────────────────────────

const schema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
  keepMeLoggedIn: z.boolean().optional(),
});

// ── sub-components ────────────────────────────────────────────────────────

/*
 * WelcomeBackBadge — amber pill badge "WELCOME BACK" (Figma 2884:64938).
 * Custom component; NOT the Captions design-system component.
 * fill=#f7efdd (#accent-light-hover), stroke=#eedeb8 (#accent-light-active).
 * Amber dot + label text in #c8951a (#accent).
 */
const WelcomeBackBadge = () => (
  <span
    className="inline-flex w-fit items-center gap-2 rounded-[8px] px-3 py-[5px]"
    style={{ backgroundColor: '#f7efdd', border: '1px solid #eedeb8' }}
  >
    <span
      className="shrink-0 rounded-full"
      style={{
        width: 8,
        height: 8,
        backgroundColor: '#eedeb8',
        border: '1.5px solid #c8951a',
      }}
    />
    <span
      className="font-sans font-normal text-[12px] leading-[18px]"
      style={{ color: '#c8951a', letterSpacing: '0.4px' }}
    >
      WELCOME BACK
    </span>
  </span>
);

/*
 * DividerRow — two horizontal rules flanking centred text.
 * "New to Ghana Talent Hub?" — Figma 2884:64959 divider area.
 */
const DividerRow = ({ text }) => (
  <div className="flex items-center gap-3 w-full">
    <hr className="flex-1 border-t border-[#e0e0e0]" />
    <span
      className="font-sans font-semibold text-neutral-dark shrink-0 text-center"
      style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px' }}
    >
      {text}
    </span>
    <hr className="flex-1 border-t border-[#e0e0e0]" />
  </div>
);

// Arrow SVG for the "Set up your account" button — from Figma small arrow
const ArrowRightSmIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 6h7M6.5 3.5 9 6l-2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── main component ────────────────────────────────────────────────────────

const ParentLoginSection = () => {
  log('mount');

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { emailOrPhone: '', password: '', keepMeLoggedIn: false },
  });

  const onSubmit = async (data) => {
    log('submit', { emailOrPhone: data.emailOrPhone, keepMeLoggedIn: data.keepMeLoggedIn });
    // TODO: wire up auth API
    await new Promise((r) => setTimeout(r, 1500));
    log('login complete');
  };

  const onError = (errs) => {
    log('validation failed:', Object.keys(errs));
  };

  return (
    /* flex-1: fills the Outlet slot in ParentOnboardingLayout */
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-16 lg:py-20">
      <div className="flex w-full max-w-[698px] items-center flex-col gap-6">
        {/* Welcome back badge — Figma 2884:64938 */}
        <WelcomeBackBadge />

        {/* Headline — Figma 2884:64946, Instrument Serif 64px */}
        {/* "Ghana Talent Hub." chars 10–26 → italic #c8951a (accent gold) */}
        <h1
          className="font-display font-normal text-center text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Log in to{'\n'}
          <span className="italic" style={{ color: '#c8951a' }}>
            Ghana Talent Hub.
          </span>
        </h1>

        {/* Subtitle — Figma 2884:64948, SF Pro Rounded 16px #737373 */}
        <p
          className="font-sans font-normal text-center text-[16px] leading-6"
          style={{ color: '#737373', letterSpacing: '0.2px' }}
        >
          Log in to review Kofi&apos;s profile, manage their access, or update your settings. New
          here?{' '}
          <button
            type="button"
            className="font-normal text-brand-green hover:underline focus-visible:underline"
            onClick={() => log('create account clicked')}
          >
            Create your account.
          </button>
        </p>

        {/* WavyDivider — Figma 2884:64949 */}
        <WavyDivider />

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex flex-1 w-full flex-col gap-4"
        >
          {/* Email / Phone input — Figma 2884:64952 */}
          <TextInput
            label="Email or Phone Number"
            required
            placeholder="davidadzato45gmail.com or 0245224995"
            leftIcon={<UserIcon />}
            leftIconClassName="text-brand-green"
            error={errors.emailOrPhone?.message}
            {...register('emailOrPhone')}
          />

          {/* Password input — Figma 2884:64953 */}
          {/* labelTrailing = "Forget Password" green link, fw=600 */}
          <PasswordInput
            label="Password"
            required
            placeholder="Enter your password"
            labelTrailing={
              <button
                type="button"
                className="font-semibold hover:underline focus-visible:underline"
                onClick={() => log('forgot password clicked')}
              >
                Forget Password
              </button>
            }
            labelTrailingClassName="text-brand-green text-[12px]"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* "Keep me logged in" checkbox — Figma 2884:64954 */}
          <Checkbox
            label={
              <span
                className="font-sans font-medium text-neutral-dark-active"
                style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px' }}
              >
                Keep me logged in
              </span>
            }
            {...register('keepMeLoggedIn')}
          />

          {/* ── CTA block — Figma 2884:64957 ── */}
          <div className="flex flex-col gap-4 mt-2">
            {/* Primary CTA button — full width, 56px target height */}
            {/* Disabled: #bfbfbf (Button primary disabled state) */}
            {/* Active: #387440 (Button primary default state) */}
            {/* Loading: #2d5d33 = Button primary active state via state prop */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={!isValid || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            >
              {isSubmitting ? 'Logging  You  In' : 'Enter Your Details To Continue'}
            </Button>
          </div>
        </form>

        {/* ── Divider + register card ── */}
        <DividerRow text="New to Ghana Talent Hub?" />

        {/* Register card — Figma 2884:64965 */}
        {/* 698×99, fill=#fefefd (#neutral-light-hover), r=16, stroke=#e6e6e6 */}
        <div
          className="flex flex-col gap-3 items-center rounded-[16px] px-5 py-4 w-full"
          style={{ backgroundColor: '#fefefd', border: '1px solid #e6e6e6' }}
        >
          <p
            className="font-sans font-normal text-neutral-dark-active"
            style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '0.2px' }}
          >
            Your ward registered and sent you a notification?
          </p>

          {/* "Set up your account" button — Figma 2884:64968 */}
          {/* 203×38, fill=#ffffff, r=10, stroke=#c6c6c3, UserIcon + text + arrow */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-[10px] text-black-light-active hover:bg-neutral font-sans font-semibold transition-colors duration-100"
            style={{
              fontSize: 14,
              lineHeight: '18px',
              letterSpacing: '0.2px',
              border: '1px solid #c6c6c3',
              width: 'fit-content',
            }}
            onClick={() => log('set up account clicked')}
          >
            <UserIcon />
            <span className="text-[#111111]">Set up your account</span>
            <ArrowRightSmIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentLoginSection;
