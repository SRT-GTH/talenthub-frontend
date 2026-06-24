import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import Select from '../../ui/form/Select.jsx';
import {
  ArrowRightIcon,
  LoadingSpinner,
  PersonIcon,
  UsersGroupIcon,
  MapIcon,
  CalendarIcon,
} from '../../shared/assets.jsx';
import ParentIdentityCapturedModal from './ParentIdentityCapturedModal.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentIdentitySection');

/*
 * ParentIdentitySection — Step 1 of the parent sign-up wizard.
 * Figma main frame: 2901:81269. Left content column only.
 * Breadcrumb, background glows, and right panel are provided by ParentOnboardingLayout.
 *
 * Form fields (Figma 2901:81409):
 *   Row 1 — 2-col: First Name (required, PersonIcon) | Middle Name (optional, PersonIcon)
 *   Row 2 — 2-col: Last Name (required, PersonIcon)  | Relationship (required, UsersGroupIcon, Select)
 *   Row 3 — 2-col: Gender (required, PersonIcon, Select) | Nationality (optional, MapIcon, Select)
 *   Row 4 — full:  Date of Birth (required, CalendarIcon, placeholder DD-MM-YYYY)
 *
 * On valid submit → navigate to /onboarding/parent-verification (next step).
 * Route: /onboarding/parent-identity
 */

// ── zod schema ────────────────────────────────────────────────────────────

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional().or(z.literal('')),
  lastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().min(1, 'Please select a relationship'),
  gender: z.string().min(1, 'Please select a gender'),
  nationality: z.string().optional().or(z.literal('')),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .regex(/^\d{2}-\d{2}-\d{4}$/, 'Format must be DD-MM-YYYY'),
});

// ── static data ───────────────────────────────────────────────────────────

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Guardian',
  'Grandmother',
  'Grandfather',
  'Uncle',
  'Aunt',
  'Sibling',
  'Other',
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const NATIONALITIES = [
  'Ghanaian',
  'Nigerian',
  'Ivorian',
  'Togolese',
  'Burkinabé',
  'Beninese',
  'Liberian',
  'Sierra Leonean',
  'Senegalese',
  'Gambian',
  'Malian',
  'Guinean',
  'Cameroonian',
  'Kenyan',
  'South African',
  'American',
  'British',
  'Canadian',
  'French',
  'German',
  'Chinese',
  'Indian',
  'Other',
];

// ── caption badge ─────────────────────────────────────────────────────────
/*
 * Figma 2901:85292 — white pill with amber dot, "03" italic grey, "Parent Identity" amber.
 * Unique amber styling differs from institution Captions component — built inline.
 */
const IdentityCaptionBadge = () => (
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
        03
      </span>
      <span
        className="font-sans"
        style={{ fontSize: 12, color: '#c8951a', letterSpacing: '0.2px', lineHeight: '18px' }}
      >
        Parent Identity
      </span>
    </span>
  </div>
);

// ── main component ────────────────────────────────────────────────────────

const ParentIdentitySection = () => {
  log('mount');

  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      relationship: '',
      gender: '',
      nationality: '',
      dateOfBirth: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    log('form submit — data:', {
      firstName: data.firstName,
      lastName: data.lastName,
      relationship: data.relationship,
      gender: data.gender,
      nationality: data.nationality,
      dateOfBirth: data.dateOfBirth,
    });
    // Future: POST /api/parent/identity
    await new Promise((resolve) => setTimeout(resolve, 600));
    log('submit success — opening IdentityCapturedModal');
    setSubmittedData(data);
    setShowModal(true);
  };

  const onError = (errs) => {
    log('form validation failed:', Object.keys(errs));
  };

  return (
    <>
      <div className="flex flex-1 items-start justify-center overflow-y-auto px-6 py-12 md:py-20">
        <div className="flex w-full max-w-[762px] flex-col items-center gap-6">
          {/* Step badge — "03 · Parent Identity" (Figma 2901:85292) */}
          <IdentityCaptionBadge />

          {/* Headline (Figma 2901:81409) */}
          <h1
            className="max-w-[554px] text-center font-display font-normal text-black"
            style={{
              fontSize: 'clamp(2rem, 4.4vw, 4rem)',
              lineHeight: 1.094,
              letterSpacing: '-0.64px',
            }}
          >
            Tell us about{' '}
            <span className="italic" style={{ color: '#c8951a' }}>
              yourself.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-[482px] text-center font-sans text-neutral-darker"
            style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', lineHeight: 1.6 }}
          >
            This information is used to personalise your parent account and communicate with you
            appropriately.
          </p>

          <WavyDivider />

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            className="flex w-full flex-col gap-4"
          >
            {/* Row 1: First Name + Middle Name */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                leftIcon={<PersonIcon />}
                label="First Name"
                required
                placeholder="e.g. Abena"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <TextInput
                leftIcon={<PersonIcon />}
                label="Middle Name"
                optional
                placeholder="e.g. Kofi"
                error={errors.middleName?.message}
                {...register('middleName')}
              />
            </div>

            {/* Row 2: Last Name + Relationship */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                leftIcon={<PersonIcon />}
                label="Last Name"
                required
                placeholder="e.g. Mensah"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
              <Controller
                name="relationship"
                control={control}
                render={({ field }) => {
                  log('relationship field render, value:', field.value);
                  return (
                    <Select
                      leftIcon={<UsersGroupIcon />}
                      label="Relationship to Ward"
                      required
                      placeholder="Select relationship"
                      options={RELATIONSHIPS}
                      value={field.value}
                      onChange={(val) => {
                        log('relationship changed to:', val);
                        field.onChange(val);
                      }}
                      error={errors.relationship?.message}
                    />
                  );
                }}
              />
            </div>

            {/* Row 3: Gender + Nationality */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  log('gender field render, value:', field.value);
                  return (
                    <Select
                      leftIcon={<PersonIcon />}
                      label="Gender"
                      required
                      placeholder="Select gender"
                      options={GENDERS}
                      value={field.value}
                      onChange={(val) => {
                        log('gender changed to:', val);
                        field.onChange(val);
                      }}
                      error={errors.gender?.message}
                    />
                  );
                }}
              />
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => {
                  log('nationality field render, value:', field.value);
                  return (
                    <Select
                      leftIcon={<MapIcon />}
                      label="Nationality"
                      placeholder="Select nationality"
                      options={NATIONALITIES}
                      value={field.value}
                      onChange={(val) => {
                        log('nationality changed to:', val);
                        field.onChange(val);
                      }}
                      error={errors.nationality?.message}
                      searchable
                    />
                  );
                }}
              />
            </div>

            {/* Row 4: Date of Birth — full width */}
            <TextInput
              leftIcon={<CalendarIcon />}
              label="Date of Birth"
              required
              placeholder="DD-MM-YYYY"
              helperText="Enter your day, month, then year — we'll route you to the right experience."
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />

            {/* CTA */}
            <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner className="size-5" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Fill In Your Details
                  <ArrowRightIcon className="size-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="font-sans text-sm text-neutral-darker">
            Already have an account?{' '}
            <Link
              to="/onboarding/parent-login"
              className="font-semibold underline"
              style={{ color: '#c8951a' }}
            >
              Log in Instead
            </Link>
          </p>
        </div>
      </div>

      {/* Success modal — shown after valid form submission */}
      {showModal && submittedData && (
        <ParentIdentityCapturedModal
          data={submittedData}
          onClose={() => {
            log('modal closed');
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default ParentIdentitySection;
