import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import AgencyCodeBoxes from '../../agency/onboarding/AgencyCodeBoxes.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { VERIFY } from './data/institutionOnboardingData.js';
import {
  ArrowRightIcon,
  CloseIcon,
  FileCheckIcon,
  ShieldIcon,
} from './institutionOnboardingIcons.jsx';

const log = debug('InstitutionCodeDialog');

/*
 * InstitutionCodeDialog — "Check your inbox." (Figma 11.1.1b code sent 8589:932 · 11.1.1b2 wrong code 8744:428424: 460 x 634, white, r24, p 40 / content 382; close 28 round).
 * Icon tile 64 · "SMS + Email" channel badges · title 24/30 600 (green "inbox.") · 14/20 #70706e text · masked address 12/20 600 #2a5730 · "Change email" ·
 * six code boxes · "Code expires in 09:58" · "Didn't receive it? Resend code (59s)" · primary button (grey "Enter all 6 digits to continue" until six digits;
 * "Verify & Continue" once complete, grey again after a wrong code until a digit is edited) · "Wrong email?" · "n attempts remaining" · domain note.
 * Real interaction: the countdowns tick, the demo code (VERIFY.demoCode in institutionOnboardingData.js, never shown in the UI) verifies, any other code costs an attempt
 * ("That code didn’t match. Check it and try again."); at 0 attempts the boxes lock ("No attempts left. Close this and request a new code." — ⚠️ ASSUMPTION, not drawn).
 * Props: wrong (start in the wrong-code state with the sample digits 123456), onVerified, onWrong, onClose, onChangeEmail.
 */

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const InstitutionCodeDialog = ({ wrong = false, onVerified, onWrong, onClose, onChangeEmail }) => {
  const [code, setCode] = useState(wrong ? '123456' : '');
  const [error, setError] = useState(wrong);
  const [attempts, setAttempts] = useState(wrong ? VERIFY.attempts - 1 : VERIFY.attempts);
  const [expires, setExpires] = useState(VERIFY.expiresIn);
  const [resend, setResend] = useState(VERIFY.resendIn);

  useEffect(() => {
    const id = setInterval(() => {
      setExpires((s) => Math.max(0, s - 1));
      setResend((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const locked = attempts <= 0;
  const complete = code.length === 6;
  const ready = complete && !error && !locked;

  const submit = (e) => {
    e.preventDefault();
    if (!ready) return;
    if (code === VERIFY.demoCode) {
      log('verified');
      onVerified();
      return;
    }
    log('wrong code', { attemptsLeft: attempts - 1 });
    setAttempts((a) => a - 1);
    setError(true);
    onWrong?.();
  };

  const label = complete ? 'Verify & Continue' : 'Enter all 6 digits to continue';
  const message = error
    ? locked
      ? 'No attempts left. Close this and request a new code.'
      : 'That code didn’t match. Check it and try again.'
    : 'We sent a 6-digit code to your work email.';

  return (
    <AgencyDialog
      label="Check your inbox"
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/70"
      panelClassName="w-[min(460px,calc(100vw-32px))]"
    >
      <form
        onSubmit={submit}
        className="flex flex-col gap-[20px] rounded-[24px] bg-white p-[clamp(20px,8.7vw,40px)] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_2px_8px_rgba(15,15,10,0.08)]"
      >
        <div className="flex flex-col items-center gap-[8px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[28px] self-end place-items-center rounded-[20px] bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <CloseIcon className="size-[16px]" />
          </button>
          <span
            aria-hidden="true"
            className="grid size-[64px] place-items-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
          >
            <FileCheckIcon className="size-[28px]" />
          </span>
          <p className="m-0 flex items-center gap-[8px] font-sans text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] text-[#387440]">
            <span className="inline-flex h-[24px] items-center rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[10px]">
              SMS
            </span>
            <span className="text-[11px] max-lg:text-[12px] leading-[13px] text-[#babab7]">+</span>
            <span className="inline-flex h-[24px] items-center rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[10px] font-medium">
              Email
            </span>
          </p>
          <div className="flex flex-col items-center gap-[2px] text-center">
            <h2 className="m-0 font-sans text-[24px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
              Check your <span className="text-[#387440]">inbox.</span>
            </h2>
            <p
              className="m-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#70706e]"
              aria-live="polite"
            >
              {message}
            </p>
            <p className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#2a5730]">
              {VERIFY.masked}
            </p>
            <button
              type="button"
              onClick={onChangeEmail ?? onClose}
              className="min-h-[24px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Change email
            </button>
          </div>
        </div>
        <AgencyCodeBoxes
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(false);
          }}
          error={error}
          disabled={locked}
        />
        <div className="flex flex-col items-center gap-[4px] font-sans text-[12px] leading-[14px] text-[#70706e]">
          <p className="m-0 flex items-center gap-[8px]">
            <span>Code expires in</span>
            <span className="font-semibold tracking-[0.2px] text-[#387440]">{fmt(expires)}</span>
          </p>
          <p className="m-0 flex items-center gap-[4px]">
            Didn't receive it?
            <button
              type="button"
              disabled={resend > 0}
              onClick={() => {
                log('resend');
                setResend(VERIFY.resendIn);
                setExpires(VERIFY.expiresIn);
              }}
              className="min-h-[24px] font-semibold tracking-[0.2px] text-[#387440] disabled:text-[#babab7]"
            >
              {resend > 0 ? `Resend code (${resend}s)` : 'Resend code'}
            </button>
          </p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:border-[#cccccc] disabled:bg-[#bfbfbf] disabled:shadow-none"
          >
            {label}
            <ArrowRightIcon className="size-[20px]" />
          </button>
          <button
            type="button"
            onClick={onChangeEmail ?? onClose}
            className="mx-auto min-h-[24px] font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#70706e] underline-offset-2 hover:underline"
          >
            Wrong email?
          </button>
          <p
            className="m-0 text-center font-sans text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] text-[#70706e]"
            aria-live="polite"
          >
            {attempts} {attempts === 1 ? 'attempt' : 'attempts'} remaining
          </p>
        </div>
        <p className="m-0 flex items-center justify-center gap-[4px] font-sans text-[10px] max-lg:text-[12px] leading-[16px] tracking-[0.2px] text-[#959592]">
          <ShieldIcon className="size-[12px] text-[#387440]" />
          {VERIFY.domainNote}
        </p>
      </form>
    </AgencyDialog>
  );
};

export default InstitutionCodeDialog;
