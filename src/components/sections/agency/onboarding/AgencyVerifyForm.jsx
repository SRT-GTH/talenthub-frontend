import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneInput, TextInput } from '../../../ui/form';
import { debug } from '../../../../utils/debug.js';
import AgencySignUpHeading from './AgencySignUpHeading.jsx';
import { VERIFY } from './data/agencyOnboardingData.js';
import { AgArrowRight, AgMail, AgShield } from './agencyOnboardingIcons.jsx';
import { validateContact } from './signUpValidation.js';

const log = debug('AgencyVerifyForm');

/*
 * AgencyVerifyForm — step 04 "Confirm your email." (the page under the dialogs of Figma 11.4.1a2-a4, 8596:481 / 8607:1188 / 8607:1752): contact phone (SMS verification),
 * office line (optional, "Leave blank if it’s the same number"), work email (Email verification) and the full-width "Send verification code" button
 * (+ "Already have an account? Log in instead"). Real controlled fields with client-side validation (signUpValidation.js); a valid form calls onSend().
 * ⚠️ ASSUMPTION: the fields start filled with the demo values as Figma draws them. Props: verified (draws the small "Email verified" status next to the step pill), onSend.
 */

const AgencyVerifyForm = ({ verified = false, onSend }) => {
  const [values, setValues] = useState({
    phone: VERIFY.phone.value,
    office: VERIFY.office.value,
    email: VERIFY.email,
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const set = (key) => (e) => {
    setValues((s) => ({ ...s, [key]: e.target.value }));
    setErrors((s) => ({ ...s, [key]: undefined }));
  };
  const submit = (e) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      log('invalid', { keys: Object.keys(found) });
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    log('send code');
    onSend?.();
  };

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={submit}
      aria-label="Verify your email"
      className="flex w-full max-w-[696px] flex-col gap-[24px]"
    >
      <AgencySignUpHeading
        step={VERIFY.eyebrow}
        label={VERIFY.eyebrowLabel}
        title={VERIFY.title}
        lead={VERIFY.lead}
        status={verified ? 'Email verified' : undefined}
      />
      <div className="grid grid-cols-1 gap-x-[16px] gap-y-[8px] sm:grid-cols-2">
        <PhoneInput
          label="Contact phone"
          required
          labelTrailing="SMS verification"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
          type="tel"
          autoComplete="tel-national"
        />
        <PhoneInput
          label="Office line"
          labelTrailing="Optional"
          helperText="Leave blank if it’s the same number"
          value={values.office}
          onChange={set('office')}
          error={errors.office}
          type="tel"
        />
        <TextInput
          className="sm:col-span-2"
          label="Work email"
          required
          labelTrailing="Email verification"
          type="email"
          leftIcon={<AgMail />}
          leftIconClassName="text-[#387440]"
          helperText="We’ll send your code and MoU updates here"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
          autoComplete="email"
        />
      </div>
      <div className="mx-auto flex w-full max-w-[698px] flex-col items-center gap-[8px]">
        <button
          type="submit"
          className="inline-flex min-h-[56px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AgMail className="size-[20px]" />
          Send verification code
          <AgArrowRight className="size-[20px]" />
        </button>
        <p className="m-0 flex items-center gap-[4px] font-sans text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] text-[#959592]">
          <AgShield className="size-[12px] text-[#387440]" />
          {VERIFY.domainNote}
        </p>
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

export default AgencyVerifyForm;
