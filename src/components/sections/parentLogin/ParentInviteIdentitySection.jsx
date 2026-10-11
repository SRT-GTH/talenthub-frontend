import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextInput from '../../ui/form/TextInput.jsx';
import Select from '../../ui/form/Select.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import { debug } from '../../../utils/debug.js';

const log = debug('ParentInviteIdentitySection');

/*
 * ParentInviteIdentitySection — Identity step of parent onboarding FLOW B
 * (ward-invited / pre-filled). Figma main frame 2864:37043 (left form
 * 2864:37048). Route: /onboarding/parent-invited-identity.
 *
 * Card-style form: name fields, relationship chips, gender radios, split
 * day/month/year DOB, nationality chips, with a sticky Back / Continue footer.
 * The simple gold step-list panel comes from ParentOnboardingLayout via
 * ParentLoginRightPanel variant="simple".
 */

// ── static data (verbatim from Figma) ───────────────────────────────────────
const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Aunt',
  'Uncle',
  'Nephew',
  'Niece',
  'Older Sibling',
  'Grandparent',
  'Legal Guardian',
];

const NATIONALITIES = [
  { value: 'Ghanaian', label: '🇬🇭 Ghanaian' },
  { value: 'Nigerian', label: '🇳🇬 Nigerian' },
  { value: 'Ivorian', label: '🇨🇮 Ivorian' },
  { value: 'Other', label: 'Other' },
];

const GENDERS = ['Male', 'Female'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// ── zod schema ──────────────────────────────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional().or(z.literal('')),
  relationship: z.string().min(1, 'Select a relationship'),
  gender: z.string().min(1, 'Select a gender'),
  day: z.string().min(1, 'Day'),
  month: z.string().min(1, 'Month'),
  year: z.string().min(1, 'Year'),
  nationality: z.string().min(1, 'Select a nationality'),
});

// ── field label (label + required */optional) ───────────────────────────────
const FieldLabel = ({ children, required, optional }) => (
  <span
    className="mb-[8px] flex items-center gap-[3px] font-sans font-bold max-md:mb-1.5 max-md:text-[13px]!"
    style={{ fontSize: 13, color: '#111', lineHeight: 'normal' }}
  >
    {children}
    {required && <span style={{ color: '#c0392b' }}>*</span>}
    {optional && (
      <span className="font-normal" style={{ fontSize: 12, color: '#babab7' }}>
        (optional)
      </span>
    )}
  </span>
);

// ── single-select chip group — Figma 2864:37075 / 37125 ─────────────────────
const ChipGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-[7px] max-md:gap-2">
    {options.map((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      const selected = value === val;
      return (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className="relative flex h-[32px] max-md:h-8 items-center rounded-full border px-[15px] max-md:px-3 max-md:text-[13px]! font-sans font-medium transition-colors max-md:before:absolute max-md:before:inset-x-0 max-md:before:-inset-y-1.5 max-md:before:content-['']"
          style={{
            fontSize: 14,
            backgroundColor: selected ? '#faf4e8' : '#f8f8f4',
            borderColor: selected ? '#c8951a' : '#c6c6c3',
            color: selected ? '#b48617' : '#575755',
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

// ── radio pill group — Figma 2864:37098 ─────────────────────────────────────
const RadioGroup = ({ options, value, onChange }) => (
  <div className="flex gap-[8px]">
    {options.map((opt) => {
      const selected = value === opt;
      return (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="relative flex h-[37px] max-md:h-8 max-md:flex-1 max-md:justify-center items-center gap-[8px] rounded-full border px-[19px] max-md:px-3 max-md:text-[13px]! font-sans font-medium transition-colors max-md:before:absolute max-md:before:inset-x-0 max-md:before:-inset-y-1.5 max-md:before:content-['']"
          style={{
            fontSize: 14,
            backgroundColor: '#ffffff',
            borderColor: selected ? '#c8951a' : '#c6c6c3',
            color: '#111',
          }}
        >
          <span
            className="flex size-[12px] items-center justify-center rounded-full border"
            style={{ borderColor: selected ? '#c8951a' : '#c6c6c3' }}
          >
            {selected && (
              <span className="size-[6px] rounded-full" style={{ backgroundColor: '#c8951a' }} />
            )}
          </span>
          {opt}
        </button>
      );
    })}
  </div>
);

// ── Back / Continue footer glyphs ───────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M8 3 4.5 6.5 8 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── main component ──────────────────────────────────────────────────────────
const ParentInviteIdentitySection = () => {
  log('mount');
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      relationship: '',
      gender: '',
      day: '',
      month: '',
      year: '',
      nationality: '',
    },
  });

  const onSubmit = async (data) => {
    log('submit — identity (flow B)', {
      relationship: data.relationship,
      nationality: data.nationality,
    });
    await new Promise((r) => setTimeout(r, 400));
    log('continue → parent-invited-verification');
    navigate('/onboarding/parent-invited-verification');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-full flex-1 flex-col">
      {/* ── Scrollable form body ── */}
      <div className="flex-1 px-6 md:px-14 py-10 max-md:px-4 max-md:py-4">
        <div className="mx-auto flex w-full max-w-full  flex-col gap-[20px] max-md:gap-3">
          {/* Header (centered) — Figma 2864:37049 / 37050 / 37051 */}
          <div className="flex flex-col items-center gap-[6px] text-center max-md:items-start max-md:gap-1 max-md:text-left">
            <span
              className="font-sans font-bold uppercase"
              style={{ fontSize: 'var(--fs-10)', color: '#c8951a', letterSpacing: '1.3px' }}
            >
              Step 1 of 7 — Parent Identity
            </span>
            <h1
              className="font-display font-normal max-md:text-[24px]! max-md:leading-tight! max-md:tracking-[-0.5px]!"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                letterSpacing: '-1px',
                color: '#111',
                lineHeight: 1.1,
              }}
            >
              Tell us about{' '}
              <span className="italic" style={{ color: '#c8951a' }}>
                yourself.
              </span>
            </h1>
            <p
              className="max-w-[420px] font-sans max-md:leading-5!"
              style={{ fontSize: 14, color: '#70706e', lineHeight: '23px' }}
            >
              This information is used to personalise your parent account and communicate with you
              appropriately.
            </p>
          </div>

          {/* Name row — First + Last (Figma 2864:37052) */}
          <div className="grid grid-cols-1 gap-[16px] max-md:gap-3 sm:grid-cols-2">
            <label className="flex flex-col">
              <FieldLabel required>First Name</FieldLabel>
              <TextInput
                placeholder="e.g. Abena"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
            </label>
            <label className="flex flex-col">
              <FieldLabel required>Last Name</FieldLabel>
              <TextInput
                placeholder="e.g. Mensah"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </label>
          </div>

          {/* Middle name (Figma 2864:37065) */}
          <label className="flex flex-col">
            <FieldLabel optional>Middle Name</FieldLabel>
            <TextInput placeholder="e.g. Kofi" {...register('middleName')} />
          </label>

          {/* Relationship chips (Figma 2864:37071) */}
          <div className="flex flex-col">
            <FieldLabel required>Relationship to Ward</FieldLabel>
            <Controller
              name="relationship"
              control={control}
              render={({ field }) => (
                <ChipGroup options={RELATIONSHIPS} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Gender radios (Figma 2864:37094) */}
          <div className="flex flex-col">
            <FieldLabel required>Gender</FieldLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup options={GENDERS} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Date of birth — Day / Month / Year (Figma 2864:37105) */}
          <div className="flex flex-col">
            <FieldLabel required>Date of Birth</FieldLabel>
            <div className="grid grid-cols-3 gap-[10px] max-md:grid-cols-2">
              <TextInput
                placeholder="Day"
                inputMode="numeric"
                autoComplete="bday-day"
                error={errors.day?.message}
                {...register('day')}
              />
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <Select
                    placeholder="Month"
                    className="max-md:order-first max-md:col-span-2"
                    options={MONTHS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.month?.message}
                  />
                )}
              />
              <TextInput
                placeholder="Year"
                inputMode="numeric"
                autoComplete="bday-year"
                error={errors.year?.message}
                {...register('year')}
              />
            </div>
          </div>

          {/* Nationality chips (Figma 2864:37121) */}
          <div className="flex flex-col">
            <FieldLabel required>Nationality</FieldLabel>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <ChipGroup options={NATIONALITIES} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Sticky footer: Back + Continue (Figma 2864:37134) ── */}
      <div
        className="sticky bottom-0 z-20 bg-white px-6 py-[15px] max-md:px-4 max-md:py-2 max-md:pb-[max(8px,env(safe-area-inset-bottom))]"
        style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}
      >
        <div className="mx-auto flex w-full max-w-[900px] items-center gap-[10px]">
          <button
            type="button"
            onClick={() => {
              log('back clicked');
              navigate(-1);
            }}
            aria-label="Back"
            className="flex h-[48px] items-center gap-[8px] rounded-[10px] border px-[21px] font-sans font-semibold max-md:h-11 max-md:w-11 max-md:shrink-0 max-md:justify-center max-md:px-0"
            style={{ borderColor: '#c6c6c3', color: '#111', fontSize: 14 }}
          >
            <ChevronLeft />
            <span className="max-md:sr-only">Back</span>
          </button>

          {isValid ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 max-md:h-11 max-md:min-w-0 max-md:shadow-none! text-white transition-transform active:translate-y-[2px]"
              style={{
                backgroundColor: '#c8951a',
                borderColor: '#967014',
                boxShadow: '0px 3px 0px #967014',
              }}
            >
              <span className="font-sans font-bold max-md:text-[14px]!" style={{ fontSize: 15 }}>
                {isSubmitting ? 'Saving…' : 'Continue'}
              </span>
              <ArrowRightIcon />
            </button>
          ) : (
            <div
              className="flex h-[48px] flex-1 items-center justify-center gap-[8px] rounded-[10px] border-2 max-md:h-11 max-md:min-w-0 max-md:shadow-none!"
              style={{ backgroundColor: '#e6e6e3', borderColor: '#d8d8d4', cursor: 'not-allowed' }}
              aria-disabled="true"
            >
              <span
                className="font-sans font-bold max-md:text-[14px]!"
                style={{ fontSize: 15, color: '#a6a6a3' }}
              >
                Continue
              </span>
              <span style={{ color: '#a6a6a3' }}>
                <ArrowRightIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ParentInviteIdentitySection;
