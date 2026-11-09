import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { PasswordInput, TextInput } from '../../ui/form';
import AgencyDialog from '../agency/onboarding/AgencyDialog.jsx';
import { confirmStepUp, mfaError } from '../../../services/mfa.api.js';
import { setStepUpHandler } from '../../../services/stepUpBridge.js';
import { debug } from '../../../utils/debug.js';

const log = debug('StepUpSheet');

/*
 * StepUpSheet — "Confirm it's you" (user story C1/C2, screen 7), MFA Phase 3. Mounted once in App.jsx.
 * When a sensitive request answers 403 STEP_UP_REQUIRED { methods, maxAgeMin, reason }, services/api.js asks this sheet
 * (stepUpBridge). It opens over the current page — nothing the user typed is lost — with the reason ("You're changing your
 * phone number.") and the proof the account needs: a code from the authenticator app (or a backup code) when 2-step is on,
 * otherwise the password. After POST /security/step-up succeeds the original request is retried automatically; Cancel leaves
 * the page as it was and the page shows its usual error.
 */

const SHELL =
  'flex w-[min(460px,calc(100vw-48px))] flex-col gap-[16px] rounded-[24px] bg-white p-[clamp(20px,6vw,32px)] shadow-[0_6px_24px_-6px_rgba(15,15,10,0.25)]';

const StepUpSheet = () => {
  const [ask, setAsk] = useState(null); // { methods, maxAgeMin, reason }
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const resolver = useRef(null);

  useEffect(
    () =>
      setStepUpHandler(
        (info) =>
          new Promise((resolve) => {
            resolver.current = resolve;
            setSecret('');
            setError('');
            setAsk(info || {});
          })
      ),
    []
  );

  if (!ask) return null;
  const withCode = Array.isArray(ask.methods) && ask.methods.includes('totp');

  const finish = (ok) => {
    log(ok ? 'confirmed' : 'cancelled');
    const r = resolver.current;
    resolver.current = null;
    setAsk(null);
    setSecret('');
    r?.(ok);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy || !secret.trim()) return;
    setBusy(true);
    setError('');
    try {
      await confirmStepUp(withCode ? { code: secret } : { password: secret });
      finish(true);
    } catch (err) {
      setError(mfaError(err, 'That didn’t work. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AgencyDialog
      label="Confirm it’s you"
      onClose={() => finish(false)}
      scrimClassName="bg-[#0f1f14]/45"
    >
      <form className={SHELL} onSubmit={submit}>
        <div className="flex flex-col gap-[6px]">
          <h2 className="m-0 font-sans text-[22px] leading-[28px] font-semibold tracking-[-0.1px] text-[#1c2a21]">
            Confirm it’s you
          </h2>
          <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
            {ask.reason ? `${ask.reason} ` : ''}
            {withCode
              ? 'Enter a code from your authenticator app.'
              : 'Enter your password to continue.'}
          </p>
        </div>
        {withCode ? (
          <TextInput
            label="Code from your authenticator app, or a backup code"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              if (error) setError('');
            }}
            autoComplete="one-time-code"
            data-autofocus
            error={error || undefined}
          />
        ) : (
          <PasswordInput
            label="Your password"
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              if (error) setError('');
            }}
            autoComplete="current-password"
            data-autofocus
            error={error || undefined}
          />
        )}
        <div className="flex flex-col gap-[10px]">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={busy || !secret.trim()}
            className="w-full"
          >
            {busy ? 'Checking…' : 'Continue'}
          </Button>
          <button
            type="button"
            onClick={() => finish(false)}
            className="mx-auto cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#737373] underline-offset-2 hover:underline"
          >
            Cancel
          </button>
        </div>
        <p className="m-0 text-center font-sans text-[12px] leading-[16px] text-[#959592]">
          {ask.maxAgeMin
            ? `You won’t be asked again on this device for about ${ask.maxAgeMin} minutes.`
            : 'You won’t be asked again on this device for a while.'}
        </p>
      </form>
    </AgencyDialog>
  );
};

export default StepUpSheet;
