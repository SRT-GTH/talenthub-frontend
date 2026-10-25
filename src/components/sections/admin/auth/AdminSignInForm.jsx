import { useState } from 'react';
import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import AgencyButton from '../../agency/AgencyButton.jsx';
import { Checkbox, TextInput } from '../../../ui/form';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import WavyDivider from '../../../shared/WavyDivider.jsx';
import eyeEmptySvg from '../../../../assets/entry/login-eye-a.svg';
import eyeFilledSvg from '../../../../assets/entry/login-eye-b.svg';
import lockSvg from '../../../../assets/entry/login-lock.svg';
import userSvg from '../../../../assets/entry/login-create-user.svg';
import { SAMPLE_EMAIL, STAFF_DOMAIN } from './data/adminAuthData.js';

const log = debug('AdminSignInForm');

/*
 * AdminSignInForm — the left column of the staff sign-in (Figma 7.0.1a 8640:415409: "Frame 22" 698 wide, gap 32). The talent log-in layout with staff copy:
 * "GTH STAFF" chip · "Staff sign-in / Ghana Talent Hub." (54/59, "Staff" ink, the rest green) · 16/24 #737373 sub copy · wavy underline · Work email (the
 * sample address is pre-filled as drawn) · Password (lock + eye toggle, "Forgot password?") · "Trust this device for 12 hours" · primary button (grey
 * "Continue to 2-step sign-in" until the form is valid) · "New staff member?" divider · set-up card with "Ask your Super Admin".
 * Props: onSubmit({ email, trust }). ⚠️ ASSUMPTION: a non-staff address (not @ghanatalenthub.com) gets an inline error; "Forgot password?" and "Ask your
 * Super Admin" have no destination drawn: they log the intent only.
 */

const LABEL =
  'inline-flex items-baseline gap-px text-[14px] max-md:text-[13px] font-medium leading-6 tracking-[0.2px] text-content-primary';

const AdminSignInForm = ({ onSubmit }) => {
  const [email, setEmail] = useState(SAMPLE_EMAIL);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [trust, setTrust] = useState(false);
  const [emailError, setEmailError] = useState(null);

  const ready = email.trim() !== '' && password !== '';

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    const value = email.trim().toLowerCase();
    if (!value.endsWith(`@${STAFF_DOMAIN}`)) {
      log('blocked: not a staff address');
      setEmailError(`Use your @${STAFF_DOMAIN} work email`);
      return;
    }
    log('submit', { trust });
    onSubmit({ email: value, trust });
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex w-full max-w-[698px] flex-col gap-8 max-md:gap-5"
    >
      <header className="flex flex-col items-center text-center">
        <span className="inline-flex h-[26px] items-center gap-1 rounded-[8px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-4 max-md:px-3">
          <span
            aria-hidden="true"
            className="size-2 rounded-full border-[1.5px] border-solid border-[#1d7c4d] bg-[#e1eae2]"
          />
          <span className="text-[12px] leading-[18px] text-brand-green">GTH STAFF</span>
        </span>
        <h1
          className="m-0 mt-3 font-sans font-semibold tracking-[-0.01em] max-md:text-[28px]! max-md:leading-tight!"
          style={{ fontSize: 'clamp(2rem, 3.125vw, 3.375rem)', lineHeight: 1.1 }}
        >
          <span className="text-[#1c2a21]">Staff </span>
          <span className="text-brand-green">sign-in</span>
          <span className="block text-brand-green">Ghana Talent Hub.</span>
        </h1>
        <p className="m-0 mt-2 max-w-[482px] py-1 text-[16px] max-md:text-[14px] leading-6 text-[#737373]">
          Use your @{STAFF_DOMAIN} account. 2-step sign-in is required for every role.
        </p>
        <span className="mt-4 flex">
          <WavyDivider />
        </span>
      </header>

      <div className="-mt-2 flex flex-col gap-4">
        <TextInput
          id="staff-email"
          label="Work email"
          required
          type="email"
          autoComplete="username"
          placeholder={`you@${STAFF_DOMAIN}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          error={emailError || undefined}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="staff-password" className={LABEL}>
              Password
              <span aria-hidden="true" className="text-[14px] font-semibold text-[#2e8b57]">
                *
              </span>
            </label>
            <Link
              to="/admin/sign-in"
              onClick={(e) => {
                e.preventDefault();
                log('forgot password (no destination drawn)');
              }}
              className="text-[12px] font-semibold leading-5 tracking-[0.1px] text-brand-green underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <TextInput
            id="staff-password"
            type={show ? 'text' : 'password'}
            placeholder="Enter Your Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<img src={lockSvg} alt="" width={16} height={16} className="shrink-0" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                aria-pressed={show}
                className="text-content-tertiary"
              >
                <img
                  src={password ? eyeFilledSvg : eyeEmptySvg}
                  alt=""
                  width={20}
                  height={19}
                  className="shrink-0"
                />
              </button>
            }
            rightIconInteractive
          />
        </div>
        <Checkbox
          label="Trust this device for 12 hours"
          checked={trust}
          onChange={(e) => setTrust(e.target.checked)}
          labelClassName="max-w-[120px] text-[12px] font-medium leading-[15px] text-[#70706e]"
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!ready}
          rightIcon={<ArrowRightIcon />}
          className="w-full !h-[56px] !py-0"
        >
          Continue to 2-step sign-in
        </Button>
        <div className="flex flex-col gap-3">
          <div
            role="separator"
            className="flex items-center justify-center gap-[10px] text-[12px] leading-5 font-semibold text-[#babab7]"
          >
            <span className="h-px w-[138px] bg-[#1c2a21]/[0.08]" aria-hidden="true" />
            New staff member?
            <span className="h-px w-[138px] bg-[#1c2a21]/[0.08]" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-center gap-3 rounded-[16px] border border-solid border-[#1c2a21]/10 bg-[#fefefd] px-4 pt-[17px] pb-6 text-center">
            <p className="m-0 text-[12px] leading-[15px] text-[#70706e]">
              A Super Admin sends you a set-up link. It expires in 24 hours.
            </p>
            <AgencyButton
              size="sm"
              leftIcon={<img src={userSvg} alt="" width={20} height={20} className="shrink-0" />}
              onClick={() => log('ask your super admin (no destination drawn)')}
            >
              Ask your Super Admin
            </AgencyButton>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminSignInForm;
