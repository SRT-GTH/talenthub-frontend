import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import WavyDivider from '../../shared/WavyDivider.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import PasswordInput from '../../ui/form/PasswordInput.jsx';
import Checkbox from '../../ui/form/Checkbox.jsx';
import Button from '../../ui/Button.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../../ui/form/mobileScale.js';
import { UserIcon, LoadingSpinner, ArrowRightIcon } from '../../shared/assets.jsx';
import ParentInlineNotice from './ParentInlineNotice.jsx';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
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
    className="inline-flex w-fit items-center gap-2 rounded-[8px] px-3 py-[5px] max-md:py-0.5 max-md:self-start"
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

/*
 * LoginAddedToast — "Kofi Mensah added you as a parent / Log in to manage their
 * account." Figma 2884:64759 places it centred in the navbar row (it used to sit
 * inside the right panel). Portalled to <body>: the layout's page-fade wrapper
 * has a transform, which would otherwise re-anchor `fixed` to the content column.
 * Below lg the compact inline notice is used instead, as on the Welcome screen.
 */
const LoginAddedToast = ({ onDismiss }) =>
  createPortal(
    <div
      role="status"
      className="fixed left-1/2 top-[24px] z-[60] flex w-[min(351px,calc(100vw-32px))] -translate-x-1/2 items-start gap-3 rounded-[10px] border px-4 py-3"
      style={{
        backgroundColor: '#ebf1ec',
        borderColor: '#c1d4c4',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[6px]"
        style={{ backgroundColor: '#387440' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6.5l3 3 5-6"
            stroke="#ebf1ec"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="font-sans text-[14px] font-semibold leading-5" style={{ color: '#2a5730' }}>
          Kofi Mensah added you as a parent
        </p>
        <p className="font-sans text-[13px] leading-[18px]" style={{ color: '#737373' }}>
          Log in to manage their account.
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="relative flex size-6 shrink-0 items-center justify-center rounded-full text-[#575755] before:absolute before:-inset-1 before:content-[''] focus-visible:outline-2 focus-visible:outline-brand-green"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path
            d="M1 1l7 7M8 1l-7 7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>,
    document.body
  );

// ── main component ────────────────────────────────────────────────────────

const ParentLoginSection = () => {
  log('mount');

  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(true);
  const isTabletUp = useMediaQuery('(min-width: 1024px)');

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
    <div className="flex flex-1 items-start justify-center overflow-y-auto max-md:overflow-visible px-6 py-12 md:py-16 lg:py-20 max-md:px-4 max-md:py-4">
      <div className="flex w-full max-w-[698px] items-center flex-col gap-6 max-md:gap-3">
        {/* Added-as-parent notice: navbar-row toast on lg+, inline notice below */}
        {toastVisible &&
          (isTabletUp ? (
            <LoginAddedToast onDismiss={() => setToastVisible(false)} />
          ) : (
            <ParentInlineNotice
              title="Kofi Mensah added you as a parent"
              onDismiss={() => setToastVisible(false)}
            >
              Log in to manage their account.
            </ParentInlineNotice>
          ))}

        {/* Welcome back badge — Figma 2884:64938 */}
        <WelcomeBackBadge />

        {/* Headline — Figma 2884:64946, Bricolage Grotesque 600 64px, upright */}
        {/* "Ghana Talent Hub." → gold #c8951a, on its own line */}
        <h1
          className="font-heading font-semibold text-center text-[#1c2a21] max-md:self-stretch max-md:text-left max-md:text-[24px]! max-md:leading-tight!"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
          }}
        >
          Log in to
          <br />
          <span style={{ color: '#c8951a' }}>Ghana Talent Hub.</span>
        </h1>

        {/* Subtitle — Figma 2884:64948, SF Pro Rounded 16px #737373 */}
        <p
          className="font-sans font-normal text-center text-[16px] leading-6 max-md:self-stretch max-md:text-left max-md:text-[14px] max-md:leading-5"
          style={{ color: '#737373', letterSpacing: '0.2px' }}
        >
          Log in to review Kofi&apos;s profile, manage their access, or update your settings. New
          here?{' '}
          <button
            type="button"
            className="font-normal text-brand-green underline hover:no-underline focus-visible:no-underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            onClick={() => {
              log('create account clicked → parent-welcome');
              navigate('/onboarding/parent-welcome');
            }}
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
          className="flex flex-1 w-full flex-col gap-4 max-md:gap-3"
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
            placeholder="Enter Your Password"
            labelTrailing={
              <button
                type="button"
                className="font-semibold hover:underline focus-visible:underline relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
                onClick={() => log('forgot password clicked')}
              >
                Forget Password
              </button>
            }
            labelTrailingClassName="text-brand-green text-[12px]"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* "Keep me logged in" checkbox — Figma 2884:64954, 12px compact label */}
          <Checkbox
            label="Keep me logged in"
            labelClassName="font-medium text-neutral-dark-active !text-[12px] !leading-[18px]"
            {...register('keepMeLoggedIn')}
          />

          {/* ── CTA block — Figma 2884:64957 ── */}
          <div className="flex flex-col gap-4 mt-2 max-md:mt-1">
            {/* Primary CTA button — full width, 56px target height */}
            {/* Disabled: #bfbfbf (Button primary disabled state) */}
            {/* Active: #387440 (Button primary default state) */}
            {/* Loading: #2d5d33 = Button primary active state via state prop */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={`w-full justify-center ${COMPACT_PRIMARY_BUTTON}`}
              disabled={!isValid || isSubmitting}
              state={isSubmitting ? 'active' : undefined}
              leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
              rightIcon={<ArrowRightIcon />}
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
          className="flex flex-col gap-3 items-center rounded-[16px] px-5 py-4 w-full max-md:gap-2 max-md:rounded-[12px] max-md:px-3 max-md:py-3"
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
            className="inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-[10px] max-md:py-[8px] text-black-light-active hover:bg-neutral font-sans font-semibold transition-colors duration-100 relative max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{
              fontSize: 14,
              lineHeight: '18px',
              letterSpacing: '0.2px',
              border: '1px solid #c6c6c3',
              width: 'fit-content',
            }}
            onClick={() => {
              log('set up account clicked → parent-welcome');
              navigate('/onboarding/parent-welcome');
            }}
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
