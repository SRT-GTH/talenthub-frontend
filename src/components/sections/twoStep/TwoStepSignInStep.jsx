import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import { TextInput, VerificationCode } from '../../ui/form';
import WavyDivider from '../../shared/WavyDivider.jsx';
import { mfaError, mfaErrorType, twoStepPath, verifyMfaSignIn } from '../../../services/mfa.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('TwoStepSignInStep');

/*
 * TwoStepSignInStep — the sign-in second step on /login for accounts with 2-step on (user stories B1, B2; screen 6).
 * After the password, POST /auth/login answered { requiresMfa, challengeId } (no email code is sent). This asks for the 6-digit code
 * from the authenticator app (auto-submits on the 6th digit), or a backup code ("Use a backup code instead"). Wrong codes show the
 * attempts left; after 5, or when the 10-minute sign-in expires, the password is needed again (onRestart).
 * A backup code sign-in ends on "That code is now used. You have N left." with a prompt to add a new app if the phone is lost.
 * Props: identity ({ email } | { phoneNumber }), challengeId, onSignedIn(user) (the page goes on to the account's home), onRestart().
 */

const H1 =
  'font-heading font-semibold tracking-[-0.01em] max-md:text-[24px]! max-md:leading-tight!';
const SUB =
  'max-w-[400px] text-[14px] max-md:text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]';

const TwoStepSignInStep = ({ identity, challengeId, onSignedIn, onRestart }) => {
  const [mode, setMode] = useState('app'); // 'app' | 'backup'
  const [code, setCode] = useState('');
  const [backup, setBackup] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ended, setEnded] = useState(''); // the sign-in can't continue: password needed again
  const [usedBackup, setUsedBackup] = useState(null); // { user, left }

  const verify = async (value, method) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { accessToken, user, mfa } = await verifyMfaSignIn({
        identity,
        challengeId,
        code: value,
        method,
      });
      if (!accessToken) throw new Error('No token returned');
      if (mfa?.method === 'recovery') {
        log('signed in with a backup code', { left: mfa.backupCodesLeft });
        setUsedBackup({ user, left: mfa.backupCodesLeft });
        setBusy(false);
        return;
      }
      onSignedIn(user);
    } catch (err) {
      const type = mfaErrorType(err);
      log.error('2-step code refused:', type);
      if (type === 'TOO_MANY_ATTEMPTS' || type === 'MFA_CHALLENGE_INVALID') {
        setEnded(mfaError(err));
      } else {
        const left = err?.response?.data?.data?.attemptsLeft;
        const base = mfaError(err, 'That code didn’t match.');
        setError(
          typeof left === 'number' ? `${base} ${left} ${left === 1 ? 'try' : 'tries'} left.` : base
        );
        setCode('');
      }
      setBusy(false);
    }
  };

  if (usedBackup) {
    const { user, left } = usedBackup;
    return (
      <div className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className={H1} style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.1 }}>
            <span className="block text-black">You’re</span>
            <span className="block text-brand-green">signed in.</span>
          </h1>
          <p className={SUB}>
            That backup code is now used. You have{' '}
            <span className="font-semibold text-content-primary">
              {left} {left === 1 ? 'code' : 'codes'}
            </span>{' '}
            left. If you’ve lost your phone, add a new authenticator app now.
          </p>
          <WavyDivider />
        </header>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onSignedIn(user, { to: twoStepPath() })}
        >
          Add a new authenticator app
        </Button>
        <button
          type="button"
          onClick={() => onSignedIn(user)}
          className="mx-auto cursor-pointer border-0 bg-transparent font-sans text-[14px] font-semibold text-[#737373] underline-offset-2 hover:underline"
        >
          Continue to my account
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3">
      <header className="flex flex-col items-center gap-3 text-center max-md:gap-1.5">
        <h1 className={H1} style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.1 }}>
          <span className="block text-black">Confirm</span>
          <span className="block text-brand-green">it’s you.</span>
        </h1>
        <p className={SUB}>
          {ended
            ? ended
            : mode === 'app'
              ? 'Enter the 6-digit code from your authenticator app.'
              : 'Enter one of your backup codes. Each code works once.'}
        </p>
        <WavyDivider />
      </header>

      {ended ? (
        <Button variant="primary" size="lg" className="w-full" onClick={onRestart}>
          Sign in again
        </Button>
      ) : mode === 'app' ? (
        <>
          <VerificationCode
            length={6}
            value={code}
            onChange={(v) => {
              setCode(v);
              if (error) setError('');
            }}
            onComplete={(v) => verify(v, 'totp')}
            autoFocus
            label="Code from your authenticator app"
            error={error || undefined}
            helperText={!error ? 'The code changes every 30 seconds.' : undefined}
          />
          <Button
            variant="primary"
            size="lg"
            disabled={code.length !== 6 || busy}
            onClick={() => verify(code, 'totp')}
            className="w-full"
            aria-busy={busy}
          >
            {busy ? 'Checking' : 'Verify And Log In'}
          </Button>
        </>
      ) : (
        <form
          className="flex flex-col gap-6 max-md:gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (backup.trim().length >= 8) verify(backup, 'recovery');
          }}
        >
          <TextInput
            label="Backup code"
            placeholder="XXXX-XXXX-XXXXX"
            value={backup}
            onChange={(e) => {
              setBackup(e.target.value);
              if (error) setError('');
            }}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            error={error || undefined}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={backup.trim().length < 8 || busy}
            className="w-full"
          >
            {busy ? 'Checking' : 'Verify And Log In'}
          </Button>
        </form>
      )}

      {!ended ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-[14px] max-md:text-[13px]">
          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer border-0 bg-transparent font-semibold text-[#737373] underline-offset-2 hover:underline"
          >
            Use different details
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'app' ? 'backup' : 'app');
              setError('');
            }}
            className="cursor-pointer border-0 bg-transparent font-semibold text-brand-green underline-offset-2 hover:underline"
          >
            {mode === 'app' ? 'Use a backup code instead' : 'Use my authenticator app'}
          </button>
        </div>
      ) : null}
      {!ended && mode === 'backup' ? (
        <p className="m-0 text-center font-sans text-[13px] leading-[18px] text-[#737373]">
          Lost your phone and your backup codes? Contact GTH support to get back in.
        </p>
      ) : null}
    </div>
  );
};

export default TwoStepSignInStep;
