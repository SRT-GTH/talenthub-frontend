import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PasswordInput from '../../ui/form/PasswordInput.jsx';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { ArrowRightIcon, CloseIcon, LockIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentSecuritySection');

/*
 * ParentSecuritySection — Step 4 of 8 in the parent sign-up wizard.
 * Figma main frame: 2938:31842. Left content column only.
 * Background ellipses and gold right panel are provided by ParentOnboardingLayout.
 *
 * User creates a password, confirms it, then sees the "Password Captured" success
 * modal before navigating to /onboarding/parent-link-ward (Step 5).
 * Route: /onboarding/parent-security
 */

// ── zod schema ────────────────────────────────────────────────────────────

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    retypePassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.retypePassword, {
    message: 'Passwords do not match',
    path: ['retypePassword'],
  });

// ── Step badge ─────────────────────────────────────────────────────────────
/*
 * Figma 2938:32743 — white pill: amber dot + "04" italic grey + "Security" amber.
 * Identical structure to steps 02 / 03.
 */
const SecurityCaptionBadge = () => (
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
        04
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 12, color: '#c8951a', letterSpacing: '0.2px', lineHeight: '18px' }}
      >
        Security
      </span>
    </span>
  </div>
);

// ── Check icon for modal ───────────────────────────────────────────────────
/*
 * Figma 2952:91662 — amber pill bg #faf4e8, drop-shadow, rounded-[10px], 28px check SVG.
 * Hand-crafted from bounding box + stroke color only (not raw Figma path data).
 */
const ModalCheckIcon = () => (
  <div
    className="flex items-center justify-center rounded-[10px] shrink-0"
    style={{
      backgroundColor: '#faf4e8',
      boxShadow: '0px 1px 2px rgba(27,36,44,0.12)',
      width: 48,
      height: 48,
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
);

// ── Password Captured modal ────────────────────────────────────────────────
/*
 * Figma 2952:91655 — success confirmation shown after CTA click.
 * Amber-themed card: check icon, badge, headline, subtitle, summary rows, CTA.
 * onContinue → navigate to /onboarding/parent-link-ward.
 */
const PasswordCapturedModal = ({ onClose, onContinue }) => {
  log('modal render');
  return (
    /* Backdrop — Figma 2952:91655 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Password captured"
    >
      {/* Card */}
      <div
        className="relative flex w-full max-w-[440px] flex-col items-center gap-4 rounded-[24px] bg-white px-8 py-8"
        style={{
          boxShadow:
            '0px 24px 64px 0px rgba(0,0,0,0.12), 0px 4px 0px 0px rgba(0,0,0,0.07), 0px 0px 0px 1px rgba(0,0,0,0.04)',
        }}
      >
        {/* Close button — Figma 2952:91658 */}
        <button
          type="button"
          onClick={() => {
            log('modal close clicked');
            onClose();
          }}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-neutral-dark transition-colors hover:bg-neutral hover:text-black"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Check icon — Figma 2952:91662 */}
        <ModalCheckIcon />

        {/* "Contact verified" Captions badge — Figma 2952:91665 */}
        <div
          className="flex items-center gap-[6px] rounded-[6px] border px-8 py-[10px]"
          style={{
            backgroundColor: 'rgba(235,241,236,0.5)',
            borderColor: '#faf4e8',
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
          <span
            className="font-sans"
            style={{ fontSize: 12, color: '#999', letterSpacing: '0.2px', lineHeight: '18px' }}
          >
            Contact verified
          </span>
        </div>

        {/* Headline — Figma 2952:91668 */}
        {/* "Password " — Instrument Serif Regular #111, "Captured" — italic #b48617 */}
        <h2
          className="font-display font-normal text-center"
          style={{ fontSize: 32, letterSpacing: '-1.2px', lineHeight: '32px', color: '#111' }}
        >
          Password{' '}
          <span className="italic" style={{ color: '#b48617' }}>
            Captured
          </span>
        </h2>

        {/* Subtitle — Figma 2952:91669 */}
        <p
          className="font-sans text-center"
          style={{ fontSize: 12, color: '#959592', letterSpacing: '0.2px', lineHeight: '18px' }}
        >
          Your phone and email have been confirmed. Here&apos;s what we verified.
        </p>

        {/* Saved info summary card — Figma 2952:91670 */}
        <div
          className="w-full rounded-[16px] border px-4 py-3 flex flex-col gap-1"
          style={{ backgroundColor: 'rgba(250,244,232,0.3)', borderColor: '#f7efdd' }}
        >
          {/* Row 1: Password */}
          <div
            className="flex items-center justify-between border-b py-2"
            style={{ borderColor: '#f7efdd' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[#b48617]" style={{ fontSize: 12 }}>
                <LockIcon />
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#575755',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                Password
              </span>
            </div>
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: '#b48617', letterSpacing: '0.2px', lineHeight: '20px' }}
            >
              ••••••••
            </span>
          </div>

          {/* Row 2: Confirmed Password */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-[#b48617]" style={{ fontSize: 12 }}>
                <LockIcon />
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: 12,
                  color: '#575755',
                  letterSpacing: '0.2px',
                  lineHeight: '18px',
                }}
              >
                Confirmed Password
              </span>
            </div>
            <span
              className="font-sans font-semibold"
              style={{ fontSize: 12, color: '#b48617', letterSpacing: '0.2px', lineHeight: '20px' }}
            >
              ••••••••
            </span>
          </div>
        </div>

        {/* Progress bar — Figma 2952:91684 */}
        <div
          className="w-full max-w-[356px] overflow-hidden rounded-[2px]"
          style={{ height: 6, backgroundColor: '#ebf1ec' }}
          aria-hidden="true"
        >
          <div
            className="h-full rounded-[6px]"
            style={{ width: '50%', backgroundColor: '#387440' }}
          />
        </div>

        {/* CTA */}
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full justify-center"
          rightIcon={<ArrowRightIcon />}
          onClick={() => {
            log('modal continue clicked → parent-link-ward');
            onContinue();
          }}
        >
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────

const ParentSecuritySection = () => {
  log('mount');

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { password: '', retypePassword: '' },
  });

  const onSubmit = async (data) => {
    log('submit — creating password', { length: data.password.length });
    await new Promise((r) => setTimeout(r, 600));
    log('password saved — showing modal');
    setShowModal(true);
  };

  const onError = (errs) => {
    log('validation failed:', Object.keys(errs));
  };

  return (
    <>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[762px] flex-col items-center gap-6">
          {/* Step badge — Figma 2938:32743 */}
          <SecurityCaptionBadge />

          {/* Headline — Figma 2938:32752 */}
          {/* "Create a strong " regular black + italic amber "password" */}
          <h1
            className="max-w-[554px] text-center font-display font-normal"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 4rem)',
              lineHeight: 1.094,
              letterSpacing: '-0.64px',
              color: '#111',
            }}
          >
            Create a strong{' '}
            <span className="italic" style={{ color: '#c8951a' }}>
              password
            </span>
          </h1>

          {/* Subtitle — Figma 2938:32754 */}
          <p
            className="max-w-[482px] text-center font-sans"
            style={{
              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
              lineHeight: 1.5,
              letterSpacing: '0.2px',
              color: '#737373',
            }}
          >
            This password protects your parent account. Use something only you would know.
          </p>

          {/* WavyDivider */}
          <WavyDivider />

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            className="flex w-full max-w-[698px] flex-col gap-4"
          >
            {/* Password — Figma 2939:46535 */}
            <PasswordInput
              label="Password"
              required
              placeholder="Create a password"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Retype Password — Figma 2939:46536 */}
            <PasswordInput
              label="Retype Password"
              required
              placeholder="Create a password"
              error={errors.retypePassword?.message}
              {...register('retypePassword')}
            />

            {/* CTA — Figma 2938:32823 */}
            <div className="mt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={!isValid || isSubmitting}
                rightIcon={<ArrowRightIcon />}
              >
                {isSubmitting ? 'Saving…' : 'Create a New Password'}
              </Button>
            </div>
          </form>

          {/* Footer — Figma 2938:32824 */}
          <p className="font-sans text-sm" style={{ color: '#737373' }}>
            Already Have an account?{' '}
            <Link
              to="/onboarding/parent-login"
              className="font-semibold underline-offset-2 hover:underline"
              style={{ color: '#387440' }}
              onClick={() => log('log in instead clicked')}
            >
              Log in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Password Captured success modal */}
      {showModal && (
        <PasswordCapturedModal
          onClose={() => {
            log('modal dismissed');
            setShowModal(false);
          }}
          onContinue={() => {
            log('navigating to parent-link-ward');
            setShowModal(false);
            navigate('/onboarding/parent-link-ward');
          }}
        />
      )}
    </>
  );
};

export default ParentSecuritySection;
