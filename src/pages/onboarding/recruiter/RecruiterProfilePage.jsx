import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterOnboardingShell from '../../../components/sections/recruiterOnboarding/RecruiterOnboardingShell.jsx';
import ProfileCapturedModal from '../../../components/sections/recruiterOnboarding/profile/ProfileCapturedModal.jsx';
import OtpVerifyModal from '../../../components/sections/recruiterOnboarding/profile/OtpVerifyModal.jsx';
import VerifiedModal from '../../../components/sections/recruiterOnboarding/profile/VerifiedModal.jsx';
import {
  ProfilePasswordField,
  ProfilePhoneInput,
} from '../../../components/sections/recruiterOnboarding/profile/ProfileFields.jsx';
import { helperProps } from '../../../components/sections/recruiterOnboarding/profile/helperProps.jsx';
import {
  checkEmailAvailable,
  submitProfile,
} from '../../../components/sections/recruiterOnboarding/profile/profileApi.js';
import {
  formatPhone,
  isEmailValid,
  isPhoneValid,
  maskEmail,
  maskPhone,
  passwordError,
  phoneDigits,
} from '../../../components/sections/recruiterOnboarding/profile/profileValidation.js';
import Button from '../../../components/ui/Button.jsx';
import { StickyActionBar, TextInput } from '../../../components/ui/form';
import WavyDivider from '../../../components/shared/WavyDivider.jsx';
import { ArrowRightIcon } from '../../../components/shared/assets.jsx';
import {
  FieldMailGlyph,
  FieldUserGlyph,
} from '../../../components/sections/recruiterOnboarding/profile/profileIcons.jsx';
import { RECRUITER_ROUTES } from '../../../components/shared/recruiterOnboardingSteps.js';
import { useRecruiterOnboarding } from '../../../hooks/useRecruiterOnboarding.js';
import { debug } from '../../../utils/debug.js';

const log = debug('RecruiterProfilePage');

/*
 * RecruiterProfilePage - /onboarding/recruiter/profile  (steps R01 + R02, ONE page)
 *
 * Figma (file Bin8roWL8sloyc36IgFMuT):
 *   R01 default 7374:1391 | active 1606 | filled 1821 | error 2036 | loader 2251
 *   R02 enter code 2524 | wrong code 2837 | code entered 3149 | verified 3466
 * R02 is a modal OVER the profile screen, so the header switches to the
 * "Verify" crumb / 32% (routeKey "verify") while the OTP + verified modals are
 * open and back to "Your Profile" / 20% when they close.
 *
 * Headline: Figma uses Bricolage Grotesque 54/59 w600; rendered with `font-heading` (Bricolage, global).
 *
 * States (stage): form -> captured (loader card, ~1.2s submitProfile) -> otp
 *   -> verified -> navigate /onboarding/recruiter/type
 *
 * Demo triggers (frontend only):
 *   - Email "taken@example.com"  -> "This email is already registered..." (checked on
 *     blur and again on submit; Continue stays disabled).
 *   - OTP code 123456 verifies; anything else = wrong-code state, attempts decrement.
 *
 * Mock state slice written via setSection('profile', ...):
 *   { fullName, email, phone: '+233 24 123 4567', passwordSet: true, verified: boolean }
 * The password is NEVER stored.
 *
 * API-shaped calls (swap bodies later): checkEmailAvailable, submitProfile,
 * verifyOtp, resendOtp - all in profile/profileApi.js and all Promises.
 */
const NEXT_PATH = '/onboarding/recruiter/type';
const EMAIL_TAKEN_COPY = 'This email is already registered. Log in instead or use another email.';

const Eyebrow = () => (
  <span className="inline-flex items-center gap-2 rounded-[8px] border border-brand-green-light-active bg-[#FFFEFC] px-4 py-1 max-md:px-3 max-md:py-0.5">
    <span
      aria-hidden="true"
      className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-hover"
      style={{ boxShadow: '0 0 4px 0 #006B3F' }}
    />
    <span className="font-heading text-[15px] font-semibold text-[#B5B5B5]">01</span>
    <span
      className="text-[12px] leading-[18px] text-brand-green"
      style={{ letterSpacing: '0.2px' }}
    >
      Your Profile
    </span>
  </span>
);

const RecruiterProfilePage = () => {
  const navigate = useNavigate();
  const { setSection } = useRecruiterOnboarding();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({});
  const [takenEmail, setTakenEmail] = useState('');
  const [stage, setStage] = useState('form'); // form | captured | otp | verified
  const runId = useRef(0);
  const emailRef = useRef(null);

  useEffect(() => {
    log('mount');
  }, []);

  const touch = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const emailKey = email.trim().toLowerCase();
  const emailOk = isEmailValid(email);
  const isTaken = emailOk && takenEmail === emailKey;
  const pwErr = password ? passwordError(password) : undefined;
  const mismatch = confirm !== '' && confirm !== password;

  const nameError = touched.name && fullName.trim().length < 2 ? 'Enter your full name' : undefined;
  const emailError = isTaken
    ? EMAIL_TAKEN_COPY
    : touched.email && !emailOk
      ? email === ''
        ? 'Email address is required'
        : 'Enter a valid email address'
      : undefined;
  const phoneError =
    touched.phone && !isPhoneValid(phone)
      ? phone === ''
        ? 'Phone number is required'
        : 'Enter a valid 9-digit Ghana number'
      : undefined;
  const passwordErrorText = touched.password || password ? pwErr : undefined;
  const confirmError = mismatch ? "Passwords don't match" : undefined;

  const valid =
    fullName.trim().length >= 2 &&
    emailOk &&
    !isTaken &&
    isPhoneValid(phone) &&
    password !== '' &&
    !pwErr &&
    confirm === password;

  const phoneDisplay = `+233 ${formatPhone(phone)}`;

  const handleEmailBlur = () => {
    touch('email')();
    if (!emailOk) return;
    log('check email availability', emailKey);
    checkEmailAvailable(email)
      .then(() => log('email available'))
      .catch((err) => {
        log('email taken', err?.code);
        if (err?.code === 'EMAIL_TAKEN') setTakenEmail(emailKey);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!valid || stage !== 'form') {
      log('submit blocked', { valid, stage });
      return;
    }
    const id = ++runId.current;
    log('submit -> captured (loader)');
    setStage('captured');
    submitProfile({ fullName: fullName.trim(), email: email.trim(), phone: phoneDigits(phone) })
      .then(() => {
        if (id !== runId.current) return;
        setSection('profile', {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phoneDisplay,
          passwordSet: true,
          verified: false,
        });
        log('profile saved -> otp');
        setStage('otp');
      })
      .catch((err) => {
        if (id !== runId.current) return;
        log('submit failed', err?.code);
        if (err?.code === 'EMAIL_TAKEN') setTakenEmail(emailKey);
        setStage('form');
      });
  };

  const closeModal = () => {
    log('close modal from', stage);
    runId.current += 1; // cancels a pending submitProfile
    setStage('form');
  };

  const handleChangeContact = () => {
    log('change email or phone');
    closeModal();
    requestAnimationFrame(() => emailRef.current?.focus());
  };

  const handleVerified = () => {
    log('otp verified');
    setSection('profile', { verified: true });
    setStage('verified');
  };

  const routeKey = stage === 'otp' || stage === 'verified' ? 'verify' : 'profile';
  log('render', { stage, routeKey, percent: RECRUITER_ROUTES[routeKey]?.percent, valid });

  return (
    <RecruiterOnboardingShell routeKey={routeKey}>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Recruiter profile"
        className="flex w-full max-w-[698px] flex-col items-center gap-6 text-center max-md:gap-3"
      >
        <Eyebrow />

        <h1
          className="font-heading font-semibold text-[#1c2a21] max-md:text-[28px]! max-md:leading-tight!"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.375rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.54px',
          }}
        >
          Tell us about yourself.
        </h1>

        <p
          className="max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
          style={{ letterSpacing: '0.2px' }}
        >
          Create your personal recruiter profile — you&apos;ll link it to your organisation next.
          All fields marked with * are required.
        </p>

        <WavyDivider />

        <div className="flex w-full flex-col gap-4 text-left max-md:gap-3">
          <TextInput
            id="recruiter-full-name"
            label="Full Name"
            required
            placeholder="Enter your full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={touch('name')}
            error={nameError}
            leftIcon={<FieldUserGlyph />}
            leftIconClassName={fullName ? 'text-brand-green' : 'text-content-tertiary'}
            {...helperProps(Boolean(nameError))}
          />

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 max-md:gap-y-3">
            <TextInput
              ref={emailRef}
              id="recruiter-email"
              label="Email Address"
              required
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              error={emailError}
              helperText={emailError ? undefined : "We'll send a verification code here"}
              leftIcon={<FieldMailGlyph />}
              leftIconClassName={
                emailError ? 'text-danger' : email ? 'text-brand-green' : 'text-content-tertiary'
              }
              {...helperProps(Boolean(emailError))}
            />
            <ProfilePhoneInput
              id="recruiter-phone"
              value={phone ? formatPhone(phone) : ''}
              onChange={(v) => setPhone(phoneDigits(v))}
              onBlur={touch('phone')}
              error={phoneError}
              hasValue={Boolean(phone)}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 max-md:gap-y-3">
            <ProfilePasswordField
              id="recruiter-password"
              label="Password"
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              onBlur={touch('password')}
              error={passwordErrorText}
              helperText="Min 8 characters · 1 uppercase · 1 lowercase · 1 number"
            />
            <ProfilePasswordField
              id="recruiter-confirm-password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={confirm}
              onChange={setConfirm}
              onBlur={touch('confirm')}
              error={confirmError}
            />
          </div>
        </div>

        <StickyActionBar bleed={16}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!valid || stage !== 'form'}
            rightIcon={<ArrowRightIcon />}
            className="mt-4 w-full max-md:mt-0"
          >
            Continue
          </Button>
        </StickyActionBar>

        <div className="flex items-center gap-2 text-[14px] leading-6 max-md:text-[13px] max-md:leading-5">
          <span className="text-[#737373]" style={{ letterSpacing: '0.2px' }}>
            Already Have an account?
          </span>
          <Link
            to="/login"
            className="relative font-semibold text-brand-green underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{ letterSpacing: '0.1px' }}
          >
            Log in Instead
          </Link>
        </div>
      </form>

      {stage === 'captured' && (
        <ProfileCapturedModal
          fullName={fullName.trim()}
          email={email.trim()}
          phoneDisplay={phoneDisplay}
          onClose={closeModal}
        />
      )}
      {stage === 'otp' && (
        <OtpVerifyModal
          phoneMasked={maskPhone(phone)}
          emailMasked={maskEmail(email)}
          onClose={closeModal}
          onChangeContact={handleChangeContact}
          onVerified={handleVerified}
        />
      )}
      {stage === 'verified' && (
        <VerifiedModal
          phoneMasked={maskPhone(phone)}
          emailMasked={maskEmail(email)}
          onClose={closeModal}
          onContinue={() => {
            log('continue ->', NEXT_PATH);
            navigate(NEXT_PATH);
          }}
        />
      )}
    </RecruiterOnboardingShell>
  );
};

export default RecruiterProfilePage;
