import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import PhoneInput from '../../ui/form/PhoneInput.jsx';
import PasswordInput from '../../ui/form/PasswordInput.jsx';
import {
  ArrowRightIcon,
  LoadingSpinner,
  UserIcon,
  BriefcaseIcon,
  MailIcon,
  DiamondIcon,
} from '../../shared/assets.jsx';
import ContactVerificationModal from './ContactVerificationModal.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ContactInfoSection');

/*
 * ContactInfoSection — Step 2 of the institution bulk-onboarding wizard.
 * Figma frames: 2972:76072 (form), 2972:76088 (modal open).
 *
 * This component renders the LEFT content column only. The outer section,
 * background glow ellipses, breadcrumb, and InstitutionRightPanel are
 * provided by InstitutionOnboardingLayout.
 *
 * Form fields (2-col grid rows):
 *   Row 1 — Full Name  |  Role / Title
 *   Row 2 — Phone Number (PhoneInput)  |  Email Address (TextInput)
 *   Row 3 — Password (PasswordInput)   |  Confirm Password (PasswordInput)
 *
 * On valid submit → 600ms loading state → ContactVerificationModal opens.
 * Success state in the modal navigates to /onboarding/institution/programme.
 *
 * Route: /onboarding/institution/contact
 */

// ── zod schema ────────────────────────────────────────────────────────────

const schema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Must be at least 2 characters')
      .max(100, 'Must be 100 characters or fewer'),
    roleTitle: z
      .string()
      .min(1, 'Please enter your role or title')
      .max(100, 'Must be 100 characters or fewer'),
    phoneNumber: z.string().min(7, 'Enter a valid phone number').max(20, 'Number is too long'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ── main component ────────────────────────────────────────────────────────

const ContactInfoSection = () => {
  log('mount');

  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      roleTitle: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  // Derive passwords-match state for the confirm field success hint.
  const passwordVal = watch('password');
  const confirmVal = watch('confirmPassword');
  const passwordsMatch =
    Boolean(passwordVal) &&
    Boolean(confirmVal) &&
    passwordVal === confirmVal &&
    !errors.confirmPassword;
  log('passwords match:', passwordsMatch);

  const emailError = errors.email?.message;

  // Submit: short delay to show loading state, then open modal.
  const onSubmit = async (data) => {
    log('form submit', { email: data.email, roleTitle: data.roleTitle });
    // Future: POST /api/institution/contact
    await new Promise((resolve) => setTimeout(resolve, 600));
    log('submit success — opening ContactVerificationModal');
    setSubmittedData(data);
    setShowModal(true);
  };

  const onError = (errs) => {
    log('form validation failed:', Object.keys(errs));
  };

  return (
    /* flex-1 fills the space beside InstitutionRightPanel */
    <div className="flex flex-1 items-start justify-center px-6 py-12 md:py-20">
      <div className="flex w-full max-w-[762px] flex-col items-center gap-6">
        {/* Step badge — "02 · Contact Details" */}
        <Captions items={[{ index: '02', label: 'Contact Details' }]} currentIndex={0} />

        {/* Headline — Instrument Serif, clamp 2rem→4rem */}
        <h1
          className="font-display font-normal max-w-[554px] text-center text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Who can we reach <span className="italic text-brand-green">out to?</span>
        </h1>

        <WavyDivider />

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex w-full flex-col gap-4"
        >
          {/* Row 1: Full Name + Role / Title */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              leftIcon={<UserIcon />}
              label="Full Name"
              required
              placeholder="e.g. Kwame Mensah"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <TextInput
              leftIcon={<BriefcaseIcon />}
              label="Role / Title"
              required
              placeholder="e.g. Registrar"
              error={errors.roleTitle?.message}
              {...register('roleTitle')}
            />
          </div>

          {/* Row 2: Phone Number + Email Address */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => {
                log('phoneNumber render, value:', field.value);
                return (
                  <PhoneInput
                    label="Phone Number"
                    required
                    labelTrailing="SMS verification"
                    placeholder="24 000 0000"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.phoneNumber?.message}
                  />
                );
              }}
            />

            <TextInput
              leftIcon={<MailIcon />}
              label="Email Address"
              required
              labelTrailing="Email verification"
              type="email"
              placeholder="e.g. kwame@atc.edu.gh"
              /* Show the diamond-icon helper text only when no error is present.
                 When error is set, Field's default AlertIcon + danger colour take over. */
              helperText={
                emailError ? undefined : "We'll send a one-time verification code to this address."
              }
              helperIcon={emailError ? undefined : <DiamondIcon className="text-brand-green" />}
              helperIconClassName={emailError ? undefined : 'text-brand-green'}
              helperTextClassName={emailError ? undefined : 'text-brand-green'}
              error={emailError}
              {...register('email')}
            />
          </div>

          {/* Row 3: Password + Confirm Password */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <PasswordInput
              label="Password"
              required
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordInput
              label="Confirm Password"
              required
              placeholder="Re-enter password"
              successText={passwordsMatch ? 'Passwords match' : undefined}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          {/* Save & Continue CTA */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            leftIcon={isSubmitting ? <LoadingSpinner stroke="#FEF1E7" /> : undefined}
            rightIcon={!isSubmitting ? <ArrowRightIcon /> : undefined}
            className="mt-2 w-full"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : 'Save & Continue'}
          </Button>

          {/* Already-have-account link */}
          <div className="flex items-center justify-center gap-2 text-[14px] leading-6">
            <span className="text-content-helper" style={{ letterSpacing: '0.2px' }}>
              Already Have an account?
            </span>
            <Link
              to="/login"
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
              style={{ letterSpacing: '0.1px' }}
            >
              Log in Instead
            </Link>
          </div>
        </form>
      </div>

      {/* Contact Verification modal — rendered after successful submit */}
      {showModal && submittedData && (
        <ContactVerificationModal
          data={submittedData}
          onClose={() => {
            log('modal closed without continuing');
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ContactInfoSection;
