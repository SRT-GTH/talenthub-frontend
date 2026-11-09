import { useEffect, useState } from 'react';
import { debug } from '../../../../utils/debug.js';
import AgencyCodeBoxes from '../../agency/onboarding/AgencyCodeBoxes.jsx';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AgArrowRight, AgClose } from '../../agency/onboarding/agencyOnboardingIcons.jsx';
import { AdminAppBadgeIcon, AdminAuthenticatorIcon, AdminShield12Icon } from '../adminIcons.jsx';
import { ATTEMPTS, CODE_EXPIRES_IN, RESEND_IN, maskEmail } from './data/adminAuthData.js';

const log = debug('AdminCodeDialog');

/*
 * AdminCodeDialog — "Enter your 2-step code" (Figma 7.0.1b 8640:415778 "MODAL": 460 x 634, white, r24, p 40 / content 382, scrim #0f1f14 at 45 %; the
 * agency "Check your inbox" dialog with staff copy): close 28 round · authenticator tile 64 · method badge · title 25/30 600 (green
 * "code") · 14/20 #70706e text · masked address 12/20 600 #2a5730 · six code boxes · "Code expires in 09:58" · "Didn't receive it?
 * Resend code (59s)" · grey "Enter all 6 digits to continue" until six digits · "Wrong email?" · "5 attempts remaining" · "Staff sign-ins are logged with device
 * and location".
 * Two modes:
 *   mode="email" (default)  the code was emailed (auth.service login): countdowns tick, "Resend code"; 5 wrong codes lock (onLocked).
 *   mode="app"              2-step verification is on (MFA Phase 2): the drawn "App + Backup code" badges and link. The code comes from the authenticator
 *                           app (no expiry, no resend); "Use a backup code instead" swaps the boxes for one field. The backend counts the attempts
 *                           (attemptsLeft); when the sign-in can't continue (too many codes, expired) onVerify returns { restart: true } and the page
 *                           goes back to the password form.
 * Props: email, mode, onVerify(code, method) -> Promise<{ ok, message?, attemptsLeft?, restart? }>, onResend() -> Promise, onLocked, onBack, onClose.
 */

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const AdminCodeDialog = ({
  email,
  mode = 'email',
  onVerify,
  onResend,
  onLocked,
  onBack,
  onClose,
}) => {
  const app = mode === 'app';
  const [backup, setBackup] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(ATTEMPTS);
  const [expires, setExpires] = useState(CODE_EXPIRES_IN);
  const [resend, setResend] = useState(RESEND_IN);

  useEffect(() => {
    if (app) return undefined;
    const id = setInterval(() => {
      setExpires((s) => Math.max(0, s - 1));
      setResend((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [app]);

  const complete = backup ? code.replace(/[^0-9a-z]/gi, '').length >= 8 : code.length === 6;
  const ready = complete && !error && (app || expires > 0) && !busy;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setBusy(true);
    const res = await onVerify(code.trim(), app ? (backup ? 'recovery' : 'totp') : undefined).catch(
      (err) => ({
        ok: false,
        message: err?.message,
      })
    );
    setBusy(false);
    if (res && res.ok) {
      log('verified');
      return;
    }
    if (res && res.restart) return; // the page went back to the password form
    const left = typeof res?.attemptsLeft === 'number' ? res.attemptsLeft : attempts - 1;
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
    : app
      ? backup
        ? 'Enter one of your backup codes. Each code works once.'
        : 'Enter the 6-digit code from your authenticator app for'
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
            {app ? (
              <>
                <span className="inline-flex h-[24px] items-center gap-[4px] rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[12px]">
                  <AdminAppBadgeIcon className="size-[12px]" />
                  App
                </span>
                <span className="inline-flex h-[24px] items-center rounded-[4px] border border-solid border-[#e1eae2] bg-white px-[12px] text-[#70706e]">
                  Backup code
                </span>
              </>
            ) : (
              <span className="inline-flex h-[24px] items-center gap-[4px] rounded-[4px] border border-solid border-[#e1eae2] bg-[#ebf1ec] px-[12px]">
                <AdminAppBadgeIcon className="size-[12px]" />
                Code sent by email
              </span>
            )}
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
              {!(app && backup) ? (
                <p className="m-0 font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#2a5730]">
                  {maskEmail(email)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        {app && backup ? (
          <label className="flex flex-col gap-[6px] font-sans text-[12px] font-semibold text-[#1c2a21]">
            Backup code
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="XXXX-XXXX-XXXXX"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              data-autofocus
              aria-invalid={error || undefined}
              className={`h-[52px] rounded-[12px] border-[1.5px] border-solid px-[14px] text-center font-mono text-[18px] tracking-[0.08em] text-[#1c2a21] outline-none focus:border-[#387440] ${error ? 'border-[#c0392b]' : 'border-[#cccccc]'}`}
            />
          </label>
        ) : (
          <AgencyCodeBoxes
            value={code}
            onChange={(v) => {
              setCode(v);
              setError(false);
            }}
            error={error}
            label="2-step code"
          />
        )}
        {app ? (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setBackup((b) => !b);
                setCode('');
                setError(false);
              }}
              className="min-h-[24px] cursor-pointer border-0 bg-transparent font-sans text-[12px] font-semibold tracking-[0.2px] text-[#387440] underline-offset-2 hover:underline"
            >
              {backup ? 'Use my authenticator app' : 'Use a backup code instead'}
            </button>
          </div>
        ) : (
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
        )}
        <div className="flex flex-col gap-[12px]">
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[40px] py-[16px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:border-[#cccccc] disabled:bg-[#bfbfbf] disabled:shadow-none"
          >
            {busy
              ? 'Checking…'
              : complete
                ? 'Continue'
                : backup
                  ? 'Enter your backup code'
                  : 'Enter all 6 digits to continue'}
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
        {app && backup ? (
          <p className="m-0 text-center font-sans text-[11px] leading-[15px] text-[#70706e]">
            Lost your phone and your backup codes? Ask a Super Admin to reset your 2-step
            verification.
          </p>
        ) : null}
        <p className="m-0 flex items-center justify-center gap-[4px] font-sans text-[10px] leading-[14px] tracking-[0.2px] text-[#959592]">
          <AdminShield12Icon className="size-[12px] text-[#387440]" />
          Staff sign-ins are logged with device and location
        </p>
      </form>
    </AgencyDialog>
  );
};

export default AdminCodeDialog;
