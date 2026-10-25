import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Select, TextInput } from '../../../ui/form';
import { debug } from '../../../../utils/debug.js';
import AgencySignUpHeading from './AgencySignUpHeading.jsx';
import { SIGNUP } from './data/agencyOnboardingData.js';
import {
  AgArrowDown,
  AgArrowRight,
  AgCard,
  AgEye,
  AgEyeOff,
  AgLock,
  AgUser,
} from './agencyOnboardingIcons.jsx';
import { REGISTERED_MOU_REF, validateAgency } from './signUpValidation.js';

const log = debug('AgencyDetailsForm');

/*
 * AgencyDetailsForm — step 03 "Tell us about your agency." (Figma 11.4.1a 8596:8; already-registered variant 11.4.1a5 8607:2242).
 * Left column 696 wide: heading, "Agency seal" row (99 round monogram, "Upload seal" button, "PNG or SVG · Max 2MB", file name), a two-column grid of the design-system
 * fields (Agency name · Short name (optional) · MoU reference · Agency type · Data you need · Work email · Password · Retype Password) and the full-width
 * "Continue to verification" button + "Already have an account? Log in instead".
 * Interactions: real controlled fields, client-side validation (signUpValidation.js), the seal "upload" only reads the file name and size (no file leaves the browser),
 * the password eyes toggle visibility. Submit: errors → shown inline and the first invalid field is focused; the demo duplicate MoU reference opens the
 * "already on GTH" dialog (onDuplicate); otherwise onContinue().
 * ⚠️ ASSUMPTION: the fields start filled with the demo agency exactly as Figma draws them (the frames show the filled form).
 * Props: registered (bool: draws the already-registered variant: other seal file + "Regions you work in"), onContinue, onDuplicate.
 */

const FieldDot = () => (
  <span
    aria-hidden="true"
    className="size-[8px] rounded-full border border-solid border-[#1c2a21]/12 bg-[#d9d9d9]"
  />
);

const AgencyDetailsForm = ({ registered: registeredProp = false, onContinue, onDuplicate }) => {
  // The already-registered frame is a different filled form: decided once, at mount.
  const [registered] = useState(registeredProp);
  const v = SIGNUP.values;
  const [values, setValues] = useState({
    name: v.name,
    short: v.short,
    mouRef: v.mouRef,
    type: v.type,
    data: registered ? SIGNUP.regions[0] : SIGNUP.dataNeeds[0],
    email: v.email,
    password: 'GthAgency#26',
    confirm: 'GthAgency#26',
  });
  const [errors, setErrors] = useState({});
  const [seal, setSeal] = useState(registered ? SIGNUP.alreadySeal : v.seal);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((s) => ({ ...s, [key]: undefined }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.(png|svg)$/i.test(f.name) || f.size > 2 * 1024 * 1024) {
      log('seal rejected', { name: f.name, size: f.size });
      setErrors((s) => ({ ...s, seal: 'Use a PNG or SVG up to 2MB.' }));
      return;
    }
    log('seal chosen', { name: f.name });
    setSeal(`${f.name} (${Math.max(1, Math.round(f.size / 1024))}KB)`);
    setErrors((s) => ({ ...s, seal: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validateAgency(values);
    setErrors(found);
    const keys = Object.keys(found);
    if (keys.length) {
      log('invalid', { keys });
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (values.mouRef.trim().toUpperCase() === REGISTERED_MOU_REF) {
      log('duplicate agency');
      onDuplicate?.();
      return;
    }
    log('continue');
    onContinue?.();
  };

  const monogram = (values.short || values.name).trim().slice(0, 3).toUpperCase() || 'GTH';

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      aria-label="Agency sign-up"
      className="flex w-full max-w-[696px] flex-col gap-[24px]"
    >
      <AgencySignUpHeading
        step={SIGNUP.eyebrow}
        label={SIGNUP.eyebrowLabel}
        title={SIGNUP.title}
        lead={SIGNUP.lead}
      />
      <div className="flex flex-col gap-[8px]">
        <p className="m-0 flex items-baseline gap-px font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
          Agency seal
          <span aria-hidden="true" className="text-[14px] font-semibold text-[#1d7c4d]">
            *
          </span>
        </p>
        <div className="flex items-center gap-[8px]">
          <span
            aria-hidden="true"
            className="grid size-[99px] shrink-0 place-items-center rounded-full border-2 border-solid border-[#c1d4c4] bg-[#387440] font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-white shadow-[0_1px_6px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06)]"
          >
            {monogram}
          </span>
          <div className="flex min-w-0 flex-col items-start gap-[8px]">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-[30px] items-center rounded-[8px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[11px] max-lg:text-[12px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Upload seal
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".png,.svg,image/png,image/svg+xml"
              onChange={onFile}
              aria-label="Agency seal file"
              className="sr-only"
              tabIndex={-1}
            />
            <p className="m-0 font-sans text-[12px] leading-[14px] text-[#babab7]">
              PNG or SVG · Max 2MB
            </p>
            <p
              className={`m-0 font-sans text-[12px] leading-[14px] ${errors.seal ? 'text-danger' : 'text-[#387440]'}`}
              aria-live="polite"
            >
              {errors.seal ?? seal}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-[16px] gap-y-[8px] sm:grid-cols-2">
        <TextInput
          label="Agency name"
          required
          leftIcon={<AgUser />}
          leftIconClassName="text-[#387440]"
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          autoComplete="organization"
        />
        <TextInput
          label="Short name"
          labelTrailing="Optional"
          leftIcon={<AgUser />}
          leftIconClassName="text-[#387440]"
          value={values.short}
          onChange={set('short')}
        />
        <TextInput
          label="MoU reference"
          required
          leftIcon={<AgUser />}
          leftIconClassName="text-[#387440]"
          value={values.mouRef}
          onChange={set('mouRef')}
          error={errors.mouRef}
        />
        <Select
          label="Agency type"
          leftIcon={<FieldDot />}
          chevronIcon={<AgArrowDown className="size-[20px] text-[#387440]" />}
          options={SIGNUP.agencyTypes}
          value={values.type}
          onChange={set('type')}
          error={errors.type}
        />
        <Select
          label={registered ? 'Regions you work in' : 'Data you need'}
          leftIcon={<FieldDot />}
          chevronIcon={<AgArrowDown className="size-[20px] text-[#387440]" />}
          options={registered ? SIGNUP.regions : SIGNUP.dataNeeds}
          value={values.data}
          onChange={set('data')}
          error={errors.data}
        />
        <TextInput
          label="Work email"
          required
          type="email"
          leftIcon={<AgCard />}
          leftIconClassName="text-[#387440]"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />
        <TextInput
          label="Password"
          required
          type={showPw ? 'text' : 'password'}
          leftIcon={<AgLock />}
          leftIconClassName="text-[#387440]"
          rightIcon={
            <button
              type="button"
              aria-label={showPw ? 'Hide password' : 'Show password'}
              aria-pressed={showPw}
              onClick={() => setShowPw((s) => !s)}
              className="text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {showPw ? <AgEyeOff className="size-[20px]" /> : <AgEye className="size-[20px]" />}
            </button>
          }
          rightIconInteractive
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="new-password"
        />
        <TextInput
          label="Retype Password"
          required
          type={showPw2 ? 'text' : 'password'}
          leftIcon={<AgLock />}
          leftIconClassName="text-[#387440]"
          rightIcon={
            <button
              type="button"
              aria-label={showPw2 ? 'Hide password' : 'Show password'}
              aria-pressed={showPw2}
              onClick={() => setShowPw2((s) => !s)}
              className="text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {showPw2 ? <AgEyeOff className="size-[20px]" /> : <AgEye className="size-[20px]" />}
            </button>
          }
          rightIconInteractive
          value={values.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />
      </div>

      <div className="mx-auto flex w-full max-w-[698px] flex-col items-center gap-[8px]">
        <button
          type="submit"
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          Continue to verification
          <AgArrowRight className="size-[20px]" />
        </button>
        <p className="m-0 flex items-center gap-[4px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
          Already have an account?
          <Link
            to="/agency"
            className="inline-flex min-h-[24px] items-center font-semibold tracking-[0.1px] text-[#387440] no-underline"
          >
            Log in instead
          </Link>
        </p>
      </div>
    </form>
  );
};

export default AgencyDetailsForm;
