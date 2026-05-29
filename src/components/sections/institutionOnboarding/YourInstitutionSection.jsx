import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../ui/Button.jsx';
import WavyDivider from '../../shared/WavyDivider.jsx';
import Captions from '../../ui/Captions.jsx';
import TextInput from '../../ui/form/TextInput.jsx';
import Select from '../../ui/form/Select.jsx';
import {
  ArrowRightIcon,
  LoadingSpinner,
  PersonIcon,
  LocationIcon,
  MapPinIconTwo,
} from '../../shared/assets.jsx';
import IdentityCapturedModal from './IdentityCapturedModal.jsx';
import { GHANA_REGIONS, DISTRICTS_BY_REGION } from '../../../constants/ghanaDistricts.js';
import { debug } from '../../../utils/debug.js';

const log = debug('YourInstitutionSection');

/*
 * YourInstitutionSection — Step 1 of the institution bulk-onboarding wizard.
 * Figma frames: 2968:24734 (container), 2972:71456 (empty), 2972:72682 (filled),
 *               2972:74318 (save & continue), 2972:75943 (modal open).
 *
 * This component renders the LEFT content column only. The outer <section>,
 * background glow ellipses, breadcrumb, and InstitutionRightPanel are all
 * provided by InstitutionOnboardingLayout.
 *
 * Form fields (Figma 2972:72229–72260):
 *   Row 1 — 2-col: Legal / Official Name  |  Trading / Commercial Name (optional)
 *   Row 2 — full:  Institution Type
 *   Row 3 — 2-col: Region  |  District (disabled until Region selected)
 *
 * On valid submit → 600ms loading state → IdentityCapturedModal opens.
 * "Continue To Contact Details" in the modal → /onboarding/institution/contact.
 *
 * Route: /onboarding/institution/your-institution
 */

// ── zod schema ────────────────────────────────────────────────────────────

const schema = z.object({
  legalName: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(200, 'Must be 200 characters or fewer'),
  tradingName: z.string().max(200, 'Must be 200 characters or fewer').optional().or(z.literal('')),
  institutionType: z.string().min(1, 'Please select an institution type'),
  region: z.string().min(1, 'Please select a region'),
  district: z.string().min(1, 'Please select a district'),
});

// ── static data ───────────────────────────────────────────────────────────

const INSTITUTION_TYPES = [
  'University',
  'College of Education',
  'Technical / Polytechnic University',
  'Senior High School (SHS)',
  'Junior High School (JHS)',
  'Primary School',
  'Vocational / Technical Institute',
  'International School',
  'Private School',
  'Other',
];

const REGION_OPTIONS = GHANA_REGIONS.map((r) => ({ value: r, label: r }));

// ── main component ────────────────────────────────────────────────────────

const YourInstitutionSection = () => {
  log('mount');

  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      legalName: '',
      tradingName: '',
      institutionType: '',
      region: '',
      district: '',
    },
    mode: 'onTouched' /* validate after first blur, then on every change */,
  });

  // Cascade: reset district whenever region changes.
  const selectedRegion = watch('region');

  useEffect(() => {
    if (selectedRegion) {
      log('region changed to:', selectedRegion, '— resetting district');
      setValue('district', '', { shouldValidate: false, shouldDirty: false });
    }
  }, [selectedRegion, setValue]);

  const districtOptions = selectedRegion
    ? (DISTRICTS_BY_REGION[selectedRegion] ?? []).map((d) => ({ value: d, label: d }))
    : [];

  log('districtOptions count:', districtOptions.length, 'for region:', selectedRegion);

  // Submit: short delay to show loading state, then open modal.
  const onSubmit = async (data) => {
    log('form submit — data:', {
      legalName: data.legalName,
      institutionType: data.institutionType,
      region: data.region,
      district: data.district,
    });
    // Future: POST /api/institution/identity
    await new Promise((resolve) => setTimeout(resolve, 600));
    log('submit success — opening IdentityCapturedModal');
    setSubmittedData(data);
    setShowModal(true);
  };

  const onError = (errs) => {
    log('form validation failed:', Object.keys(errs));
  };

  return (
    /* flex-1 fills the space beside InstitutionRightPanel in InstitutionOnboardingLayout */
    <div className="flex flex-1 items-start justify-center px-6 py-12 md:py-20">
      <div className="flex w-full max-w-[762px] items-center flex-col gap-6">
        {/* Step badge — "01 · Institution Setup" caption (Figma 2972:72238) */}
        <Captions items={[{ index: '01', label: 'Institution Setup' }]} currentIndex={0} />

        {/* Headline — Instrument Serif, clamp 2rem→4rem (Figma 2972:72229) */}
        <h1
          className="font-display font-normal max-w-[554px] text-center text-black"
          style={{
            fontSize: 'clamp(2rem, 4.4vw, 4rem)',
            lineHeight: 1.094,
            letterSpacing: '-0.64px',
          }}
        >
          Tell us about your <span className="italic text-brand-green">institution.</span>
        </h1>

        <WavyDivider />

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          className="flex  w-full flex-col gap-4"
        >
          {/* Row 1: Legal Name + Trading Name — 2-col grid */}
          <div className="grid  w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              leftIcon={<PersonIcon />}
              label="Legal / Official Name"
              required
              placeholder="e.g. Accra Technical College"
              error={errors.legalName?.message}
              {...register('legalName')}
            />
            <TextInput
              leftIcon={<PersonIcon />}
              label="Trading / Commercial Name"
              optional
              placeholder="e.g. ATC (if different)"
              error={errors.tradingName?.message}
              {...register('tradingName')}
            />
          </div>

          {/* Row 2: Institution Type — full width */}
          <Controller
            name="institutionType"
            control={control}
            render={({ field }) => {
              log('institutionType field render, value:', field.value);
              return (
                <Select
                  leftIcon={<PersonIcon />}
                  label="Institution Type"
                  required
                  placeholder="Select institution type"
                  options={INSTITUTION_TYPES}
                  value={field.value}
                  onChange={(val) => {
                    log('institutionType changed to:', val);
                    field.onChange(val);
                  }}
                  error={errors.institutionType?.message}
                  searchable
                />
              );
            }}
          />

          {/* Row 3: Region + District — 2-col grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="region"
              control={control}
              render={({ field }) => {
                log('region field render, value:', field.value);
                return (
                  <Select
                    leftIcon={<LocationIcon />}
                    label="Region"
                    required
                    placeholder="Select region"
                    options={REGION_OPTIONS}
                    value={field.value}
                    onChange={(val) => {
                      log('region changed to:', val);
                      field.onChange(val);
                    }}
                    error={errors.region?.message}
                    searchable
                  />
                );
              }}
            />

            <Controller
              name="district"
              control={control}
              render={({ field }) => {
                const isDisabled = !selectedRegion;
                log(
                  'district field render, disabled:',
                  isDisabled,
                  'options:',
                  districtOptions.length
                );
                return (
                  <Select
                    leftIcon={<MapPinIconTwo className="text-brand-green" />}
                    label="District"
                    required
                    placeholder={isDisabled ? 'Select region first' : 'Select district'}
                    options={districtOptions}
                    value={field.value}
                    onChange={(val) => {
                      log('district changed to:', val);
                      field.onChange(val);
                    }}
                    disabled={isDisabled}
                    error={errors.district?.message}
                    searchable={districtOptions.length > 8}
                  />
                );
              }}
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

      {/* Identity Captured modal — rendered after successful submit */}
      {showModal && submittedData && (
        <IdentityCapturedModal
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

export default YourInstitutionSection;
