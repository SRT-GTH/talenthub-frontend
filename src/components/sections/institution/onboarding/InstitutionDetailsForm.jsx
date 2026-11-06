import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { Select, TextInput } from '../../../ui/form';
import { SIGNUP } from './data/institutionOnboardingData.js';
import InstitutionSignUpHeading from './InstitutionSignUpHeading.jsx';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CardIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UploadIcon,
  UserIcon,
} from './institutionOnboardingIcons.jsx';
import { REGIONS, isInstitutionComplete, validateInstitution } from './signUpValidation.js';

const log = debug('InstitutionDetailsForm');

/*
 * InstitutionDetailsForm — step 03 "Tell us about your institution." (Figma 11.1.1a empty 8589:8 · 11.1.1a2 filled 8589:482 · already-registered 11.1.1c 8589:1478).
 * Left column 698 wide: heading, "School crest" row (72 round upload tile — once a crest is chosen a #387440 tile with the monogram, 85 x 81 — plus the "Upload crest"
 * button, "PNG or SVG · Max 2MB" and the file name), a two-column grid of the design-system fields (Institution name · Short name (optional) · GES / accreditation number ·
 * Institution type · Address · Work email · Password · Retype Password) and the full-width "Continue to verification" button (grey until every required field is filled)
 * + "Already have an account? Log in instead".
 * Live: client-side validation (signUpValidation.js), then POST /api/institution-signup/check: a GES number already on GTH opens the "already on GTH"
 * dialog (onDuplicate({name, registeredOn})), an email that already has an account is shown on the field. The crest is kept in memory and uploaded once the
 * account exists. The address is the GhanaPost digital address + region; the contact person (you) becomes the institution's admin.
 * Props: initial (values to start from, e.g. coming back from step 04), initialCrest (File), busy,
 * onContinue(values, crestFile) -> optional {field, message} to show on a field (the page opens the duplicate dialog itself).
 */

const FieldDot = () => (
  <span
    aria-hidden="true"
    className="size-[8px] rounded-full border border-solid border-[#1c2a21]/12 bg-[#d9d9d9]"
  />
);

const EMPTY = {
  name: '',
  short: '',
  gesNumber: '',
  type: '',
  digitalAddress: '',
  region: '',
  contactName: '',
  contactTitle: '',
  email: '',
  password: '',
  confirm: '',
};

const PwToggle = ({ shown, onToggle }) => (
  <button
    type="button"
    aria-label={shown ? 'Hide password' : 'Show password'}
    aria-pressed={shown}
    onClick={onToggle}
    className="text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {shown ? <EyeOffIcon className="size-[20px]" /> : <EyeIcon className="size-[20px]" />}
  </button>
);

const InstitutionDetailsForm = ({ initial, initialCrest = null, busy = false, onContinue }) => {
  const [values, setValues] = useState({ ...EMPTY, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const [crestFile, setCrestFile] = useState(initialCrest);
  const crest = crestFile
    ? `${crestFile.name} (${Math.max(1, Math.round(crestFile.size / 1024))}KB)`
    : null;
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((s) => ({
      ...s,
      [key]: undefined,
      ...(key === 'password' ? { confirm: undefined } : {}),
    }));
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/\.(png|svg)$/i.test(f.name) || f.size > 2 * 1024 * 1024) {
      log('crest rejected', { name: f.name, size: f.size });
      setErrors((s) => ({ ...s, crest: 'Use a PNG or SVG up to 2MB.' }));
      return;
    }
    log('crest chosen', { name: f.name });
    setCrestFile(f);
    setErrors((s) => ({ ...s, crest: undefined }));
  };

  const complete = isInstitutionComplete(values);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const found = validateInstitution(values);
    setErrors(found);
    const keys = Object.keys(found);
    if (keys.length) {
      log('invalid', { keys });
      setTimeout(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    log('continue');
    const problem = await onContinue?.(values, crestFile);
    if (problem?.field) {
      setErrors((s) => ({ ...s, [problem.field]: problem.message }));
      setTimeout(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus(), 0);
    }
  };

  const monogram = (values.short || values.name).trim().slice(0, 2).toUpperCase();
  const title = values.name ? SIGNUP.titleFilled : SIGNUP.titleEmpty;

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      aria-label="Institution sign-up"
      className="flex w-full max-w-[698px] flex-col gap-[24px]"
    >
      <InstitutionSignUpHeading
        step={SIGNUP.eyebrow}
        label={SIGNUP.eyebrowLabel}
        title={title}
        lead={SIGNUP.lead}
      />
      <div className="flex flex-col gap-[8px]">
        <p className="m-0 flex items-baseline gap-px font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#1c2a21]">
          School crest
          <span className="ml-[6px] text-[12px] font-normal text-[#737373]">Optional</span>
        </p>
        <div className="flex items-center gap-[8px]">
          <span
            aria-hidden="true"
            className={classNames(
              'grid shrink-0 place-items-center rounded-[36px] border-2 border-solid border-[#c1d4c4] p-[26px] shadow-[0_1px_6px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06)]',
              crest
                ? 'bg-[#387440] font-sans text-[24px] leading-[29px] font-semibold text-white'
                : 'bg-[#ebf1ec] text-[#387440]'
            )}
          >
            {crest ? monogram || 'GTH' : <UploadIcon className="size-[20px]" />}
          </span>
          <div className="flex min-w-0 flex-col items-start gap-[8px]">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-[30px] items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[12px] font-sans text-[11px] leading-[24px] font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] max-lg:text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Upload crest
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".png,.svg,image/png,image/svg+xml"
              onChange={onFile}
              aria-label="School crest file"
              className="sr-only"
              tabIndex={-1}
            />
            <p className="m-0 font-sans text-[10px] leading-[12px] text-[#babab7] max-lg:text-[12px] max-lg:leading-[14px]">
              PNG or SVG · Max 2MB
            </p>
            <p
              className={classNames(
                'm-0 font-sans text-[10px] leading-[12px] max-lg:text-[12px] max-lg:leading-[14px]',
                errors.crest ? 'text-danger' : 'text-[#387440]'
              )}
              aria-live="polite"
            >
              {errors.crest ?? crest}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-[16px] gap-y-[8px] sm:grid-cols-2">
        <TextInput
          label="Institution name"
          required
          leftIcon={<UserIcon />}
          leftIconClassName="text-[#387440]"
          placeholder={SIGNUP.placeholders.name}
          value={values.name}
          onChange={set('name')}
          error={errors.name}
          autoComplete="organization"
        />
        <TextInput
          label="Short name"
          labelTrailing="Optional"
          leftIcon={<UserIcon />}
          leftIconClassName="text-[#387440]"
          placeholder={SIGNUP.placeholders.short}
          value={values.short}
          onChange={set('short')}
        />
        <TextInput
          label="GES / accreditation number"
          required
          leftIcon={<UserIcon />}
          leftIconClassName="text-[#387440]"
          placeholder={SIGNUP.placeholders.gesNumber}
          value={values.gesNumber}
          onChange={set('gesNumber')}
          error={errors.gesNumber}
        />
        <Select
          label="Institution type "
          leftIcon={<FieldDot />}
          chevronIcon={<ArrowDownIcon className="size-[20px] text-[#387440]" />}
          options={SIGNUP.institutionTypes}
          placeholder={SIGNUP.typePlaceholder}
          value={values.type}
          onChange={set('type')}
          error={errors.type}
        />
        <TextInput
          label="Digital address"
          required
          leftIcon={<FieldDot />}
          placeholder="e.g. NT-0123-4567"
          value={values.digitalAddress}
          onChange={set('digitalAddress')}
          error={errors.digitalAddress}
        />
        <Select
          label="Region"
          leftIcon={<FieldDot />}
          chevronIcon={<ArrowDownIcon className="size-[20px] text-[#387440]" />}
          options={REGIONS}
          placeholder="Choose your region"
          value={values.region}
          onChange={set('region')}
          error={errors.region}
        />
        <TextInput
          label="Your full name"
          required
          leftIcon={<UserIcon />}
          leftIconClassName="text-[#387440]"
          placeholder="e.g. Iddrisu Abdul-Rahman"
          value={values.contactName}
          onChange={set('contactName')}
          error={errors.contactName}
          autoComplete="name"
        />
        <TextInput
          label="Your title"
          labelTrailing="Optional"
          leftIcon={<UserIcon />}
          leftIconClassName="text-[#387440]"
          placeholder="e.g. Registrar"
          value={values.contactTitle}
          onChange={set('contactTitle')}
          autoComplete="organization-title"
        />
        <TextInput
          label="Work email"
          required
          type="email"
          leftIcon={<CardIcon />}
          leftIconClassName="text-[#387440]"
          placeholder={SIGNUP.placeholders.email}
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />
        <TextInput
          label="Password"
          required
          type={showPw ? 'text' : 'password'}
          leftIcon={<LockIcon />}
          leftIconClassName="text-[#387440]"
          rightIcon={<PwToggle shown={showPw} onToggle={() => setShowPw((s) => !s)} />}
          rightIconInteractive
          placeholder={SIGNUP.placeholders.password}
          value={values.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete="new-password"
        />
        <TextInput
          label="Retype Password"
          required
          type={showPw2 ? 'text' : 'password'}
          leftIcon={<LockIcon />}
          leftIconClassName="text-[#387440]"
          rightIcon={<PwToggle shown={showPw2} onToggle={() => setShowPw2((s) => !s)} />}
          rightIconInteractive
          placeholder={SIGNUP.placeholders.password}
          value={values.confirm}
          onChange={set('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />
      </div>

      <div className="mx-auto flex w-full max-w-[698px] flex-col items-center gap-[8px]">
        <button
          type="submit"
          aria-disabled={!complete || busy}
          onClick={(e) => {
            if (!complete || busy) {
              // Figma draws the empty form with the grey button: it stays inert until every required field has a value.
              e.preventDefault();
              log('incomplete');
            }
          }}
          className={classNames(
            'inline-flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
            complete
              ? 'border-[#2a5730] bg-[#387440] shadow-[0_4px_0_#2a5730]'
              : 'cursor-not-allowed border-[#cccccc] bg-[#bfbfbf] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]'
          )}
        >
          {busy ? 'Checking…' : 'Continue to verification'}
          <ArrowRightIcon className="size-[20px]" />
        </button>
        <p className="m-0 flex items-center gap-[4px] font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
          Already have an account?
          <Link
            to="/login"
            className="inline-flex min-h-[24px] items-center font-semibold tracking-[0.1px] text-[#387440] no-underline"
          >
            Log in instead
          </Link>
        </p>
      </div>
    </form>
  );
};

export default InstitutionDetailsForm;
