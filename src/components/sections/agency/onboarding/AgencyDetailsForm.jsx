import { useRef, useState } from 'react';
import { registerAgency } from '../../../../services/agency.api.js';
import { Link } from 'react-router-dom';
import { Select, TextInput } from '../../../ui/form';
import { debug } from '../../../../utils/debug.js';
import AgencySignUpHeading from './AgencySignUpHeading.jsx';
import { SIGNUP } from './data/agencyOnboardingData.js';
import { AgArrowDown, AgArrowRight, AgCard, AgUser } from './agencyOnboardingIcons.jsx';
import { validateAgency } from './signUpValidation.js';

const log = debug('AgencyDetailsForm');

/*
 * AgencyDetailsForm — step 03 "Tell us about your agency." (Figma 11.4.1a 8596:8).
 * Left column 696 wide: heading, the agency monogram, a two-column grid of the design-system fields (Agency name · Short name (optional) ·
 * MoU reference (optional) · Agency type · Data you need · Your name · Your title (optional) · Work email · Phone (optional)) and the full-width
 * "Send access request" button + "Already have an account? Log in instead".
 * Submit: client-side checks (signUpValidation.js) → POST /government/register (no sign-in needed). The request lands in Platform Admin › Agencies
 * for review; on approval the account is created and the contact gets a temporary password. A 409 (a pending request or an active account for
 * this email) opens the "already on GTH" dialog with the server's sentence.
 * Figma also draws a password pair and a seal upload; neither is kept: the password is set at first sign-in after approval, and the seal is added
 * in Settings › Agency profile once the account exists (nothing can be stored before that).
 * Props: onSubmitted(result), onDuplicate(message).
 */

const FieldDot = () => (
  <span
    aria-hidden="true"
    className="size-[8px] rounded-full border border-solid border-[#1c2a21]/12 bg-[#d9d9d9]"
  />
);

const AgencyDetailsForm = ({ onSubmitted, onDuplicate }) => {
  const [values, setValues] = useState({
    name: '',
    short: '',
    mouRef: '',
    type: '',
    data: '',
    contact: '',
    title: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const formRef = useRef(null);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((s) => ({ ...s, [key]: undefined }));
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
    setBusy(true);
    setFailure('');
    registerAgency({
      agencyName: values.name.trim(),
      ministry: values.type,
      department: values.short.trim(),
      contactPerson: {
        name: values.contact.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        title: values.title.trim(),
      },
      intendedUse: values.data,
      regulatoryBasis: values.mouRef.trim() ? `MoU ${values.mouRef.trim().toUpperCase()}` : '',
    })
      .then((res) => {
        log('request sent', res?.requestId);
        onSubmitted?.(res);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || 'Something went wrong.';
        if (err?.response?.status === 409) onDuplicate?.(msg);
        else setFailure(msg);
      })
      .finally(() => setBusy(false));
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
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className="grid size-[64px] shrink-0 place-items-center rounded-full border-2 border-solid border-[#c1d4c4] bg-[#387440] font-sans text-[18px] leading-[24px] font-semibold text-white"
        >
          {monogram}
        </span>
        <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">
          Add your agency seal in Settings once your access is approved.
        </p>
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
          labelTrailing="Optional"
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
          label="Data you need"
          leftIcon={<FieldDot />}
          chevronIcon={<AgArrowDown className="size-[20px] text-[#387440]" />}
          options={SIGNUP.dataNeeds}
          value={values.data}
          onChange={set('data')}
          error={errors.data}
        />
        <TextInput
          label="Your name"
          required
          leftIcon={<AgUser />}
          leftIconClassName="text-[#387440]"
          value={values.contact}
          onChange={set('contact')}
          error={errors.contact}
          autoComplete="name"
        />
        <TextInput
          label="Your title"
          labelTrailing="Optional"
          leftIcon={<AgUser />}
          leftIconClassName="text-[#387440]"
          value={values.title}
          onChange={set('title')}
          autoComplete="organization-title"
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
          label="Phone"
          labelTrailing="Optional"
          type="tel"
          leftIcon={<AgCard />}
          leftIconClassName="text-[#387440]"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
          autoComplete="tel"
        />
      </div>

      <div className="mx-auto flex w-full max-w-[698px] flex-col items-center gap-[8px]">
        {failure ? (
          <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-danger">
            {failure}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {busy ? 'Sending…' : 'Send access request'}
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
