import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import AgencyCodeBoxes from '../../agency/onboarding/AgencyCodeBoxes.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AgArrowRight, AgClose } from '../../agency/onboarding/agencyOnboardingIcons.jsx';
import {
  AdminAppBadgeIcon,
  AdminAuthenticatorIcon,
  AdminBackupBadgeIcon,
  AdminShield12Icon,
} from '../adminIcons.jsx';
import { ATTEMPTS, CODE_EXPIRES_IN, RESEND_IN, maskEmail } from './data/adminAuthData.js';

const log = debug('AdminCodeDialog');

/*
 * AdminCodeDialog — "Enter your 2-step code" (Figma 7.0.1b 8640:415778 "MODAL": 460 x 634, white, r24, p 40 / content 382, scrim #0f1f14 at 45 %; the
 * agency "Check your inbox" dialog with staff copy): close 28 round · authenticator tile 64 · "App + Backup code" badges · title 25/30 600 (green
 * "code") · 14/20 #70706e text · masked address 12/20 600 #2a5730 · "Use a backup code" · six code boxes · "Code expires in 09:58" · "Didn't receive it?
 * Resend code (59s)" · grey "Enter all 6 digits to continue" until six digits · "Wrong email?" · "5 attempts remaining" · "Staff sign-ins are logged with device
 * and location". Real interaction: the countdowns tick, the demo code (adminAuthData.js, never shown) verifies, any other code costs an attempt; at 0 the
 * account locks (onLocked). ⚠️ ASSUMPTION: "Use a backup code" has no flow drawn (logs only); "Wrong email?" goes back to the form (onBack).
 * Props: email, onVerify(code) -> Promise<{ ok, message? }> (the page calls the backend), onResend() -> Promise, onLocked, onBack, onClose.
 * The code is emailed (auth.service login), so the copy says "we emailed" rather than the drawn authenticator line.
 */

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const AdminCodeDialog = ({ email, onVerify, onResend, onLocked, onBack, onClose }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(ATTEMPTS);
  const [expires, setExpires] = useState(CODE_EXPIRES_IN);
  const [resend, setResend] = useState(RESEND_IN);

  useEffect(() => {
    const id = setInterval(() => {
      setExpires((s) => Math.max(0, s - 1));
      setResend((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const complete = code.length === 6;
  const ready = complete && !error && expires > 0 && !busy;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    const res = await onVerify(code).catch((err) => ({ ok: false, message: err?.message }));
    setBusy(false);
    if (res && res.ok) {
      log('verified');
      return;
    }
    const left = attempts - 1;
    log('wrong code', { attemptsLeft: left });
    setAttempts(left);
    if (left <= 0) {
      onLocked();
      return;
    }
    setErrorText((res && res.message) || '');
    setError(true);
  };

  const message = error
    ? errorText || 'That code didn’t match. Check it and try again.'
    : expires === 0
      ? 'This code has expired. Resend a new one.'
      : 'Enter the 6-digit code we emailed to';

  return (
    <AgencyDialog
      label="Enter your 2-step code"
      onClose={onClose}
      scrimClassName="bg-[#0f1f14]/45"
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
            className="grid size-[28px] cursor-pointer place-items-center self-end rounded-[20px] border-0 bg-[#ebf1ec] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AgClose className="size-[16px]" />
          </button>
          <span
            aria-hidden="true"
            className="grid size-[64px] place-items-center rounded-[10px] bg-[#ebf1ec] text-[#387440]"
          >
            <AdminAuthenticatorIcon className="size-[28px]" />
          </span>
          <p className="m-0 flex items-center gap-[8px] font-sans text-[10px] leading-[16px] tracking-[0.2px] text-[#387440]">
            <span className="inline-flex h-[24px] items-center gap-[4px] rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[12px]">
              <AdminAppBadgeIcon className="size-[12px]" />
              App
            </span>
            <span className="text-[11px] leading-[13px] text-[#babab7]">+</span>
            <span className="inline-flex h-[24px] items-center gap-[4px] rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[12px] font-medium">
              <AdminBackupBadgeIcon className="size-[12px]" />
              Backup code
            </span>
          </p>
          <div className="flex flex-col items-center gap-[8px] text-center">
            <h2 className="m-0 font-sans text-[25px] leading-[30px] font-semibold tracking-[-0.12px] text-[#1c2a21]">
              Enter your 2-step <span className="text-[#387440]">code</span>
            </h2>
            <div className="flex flex-col items-center">
              <p
                className="m-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#70706e]"
                aria-live="polite"
              >
                {message}
              </p>
              <p className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#2a5730]">
                {maskEmail(email)}
              </p>
              <button
                type="button"
                onClick={() => log('use a backup code (no flow drawn)')}
                className="min-h-[24px] cursor-pointer border-0 bg-transparent font-sans text-[12px] leading-[15px] font-medium tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                Use a backup code
              </button>
            </div>
          </div>
        </div>
        <AgencyCodeBoxes
          value={code}
          onChange={(v) => {
            setCode(v);
            setError(false);
          }}
          error={error}
          label="2-step code"
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
              onClick={async () => {
                log('resend');
                setResend(RESEND_IN);
                setExpires(CODE_EXPIRES_IN);
                setError(false);
                await onResend?.().catch(() => null);
              }}
              className="min-h-[24px] cursor-pointer border-0 bg-transparent font-sans text-[12px] font-semibold tracking-[0.2px] text-[#387440] disabled:cursor-default disabled:text-[#babab7]"
            >
              {resend > 0 ? `Resend code (${resend}s)` : 'Resend code'}
            </button>
          </p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:border-[#cccccc] disabled:bg-[#bfbfbf] disabled:shadow-none"
          >
            {busy ? 'Checking…' : complete ? 'Continue' : 'Enter all 6 digits to continue'}
            <AgArrowRight className="size-[20px]" />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mx-auto min-h-[24px] cursor-pointer border-0 bg-transparent font-sans text-[12px] leading-[15px] tracking-[0.2px] text-[#70706e] underline-offset-2 hover:underline"
          >
            Wrong email?
          </button>
          <p
            className="m-0 text-center font-sans text-[10px] leading-[14px] tracking-[0.2px] text-[#70706e]"
            aria-live="polite"
          >
            {attempts} {attempts === 1 ? 'attempt' : 'attempts'} remaining
          </p>
        </div>
        <p className="m-0 flex items-center justify-center gap-[4px] font-sans text-[10px] leading-[14px] tracking-[0.2px] text-[#959592]">
          <AdminShield12Icon className="size-[12px] text-[#387440]" />
          Staff sign-ins are logged with device and location
        </p>
      </form>
    </AgencyDialog>
  );
};

export default AdminCodeDialog;
