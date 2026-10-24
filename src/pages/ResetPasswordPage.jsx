import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../components/ui/form/mobileScale.js';
import { PasswordInput } from '../components/ui/form';
import { ArrowRightIcon, LoadingSpinner } from '../components/shared/assets.jsx';
import { getApiErrorCode, getApiErrorMessage } from '../services/apiErrors.js';
import { resetPassword } from '../services/auth.api.js';
import { debug } from '../utils/debug.js';
import {
  BackToLogin,
  PasswordResetShell,
  ResetHeader,
  ResetStatusNote,
} from './ForgotPasswordPage.jsx';

const log = debug('ResetPasswordPage');

/*
 * ResetPasswordPage — public "choose a new password" screen
 * (/reset-password?token=…, the link from the reset email; valid 60 min).
 * Same layout as LoginPage / ForgotPasswordPage.
 *
 * new password + confirm (min 6 chars, show/hide, must match) ->
 * POST /auth/reset-password { token, newPassword }.
 *   success        -> "Password updated", then /login after a short pause
 *   INVALID_TOKEN  -> "link expired or already used" state + link to /forgot-password
 *   other failure  -> stays on the form with a role=status note
 * A missing ?token shows the invalid-link state straight away (no call).
 */

const MIN_LENGTH = 6;
const REDIRECT_MS = 2500;

const ResetPasswordPage = () => {
  log('mount');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [failure, setFailure] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [phase, setPhase] = useState(token ? 'form' : 'invalid'); // form | invalid | done

  useEffect(() => {
    if (phase !== 'done') return undefined;
    const t = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_MS);
    return () => clearTimeout(t);
  }, [phase, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    const nextPasswordError =
      password.length < MIN_LENGTH
        ? `Your password must be at least ${MIN_LENGTH} characters.`
        : null;
    const nextConfirmError =
      !nextPasswordError && confirm !== password ? 'The passwords do not match.' : null;
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    if (nextPasswordError || nextConfirmError) {
      log('submit blocked: field errors');
      return;
    }
    setIsSaving(true);
    setFailure('');
    try {
      await resetPassword({ token, newPassword: password });
      log('password reset');
      setPhase('done');
    } catch (err) {
      const code = getApiErrorCode(err);
      log.error('reset-password failed:', code || err?.response?.status);
      if (code === 'INVALID_TOKEN') setPhase('invalid');
      else setFailure(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (phase === 'invalid') {
    return (
      <PasswordResetShell>
        <div
          className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3"
          data-testid="reset-invalid"
        >
          <ResetHeader eyebrow="LINK NOT VALID" line1="This link has" line2="expired.">
            <p>
              This password reset link has expired or has already been used. Reset links work once
              and only for 60 minutes. Request a new one to continue.
            </p>
          </ResetHeader>
          <Link to="/forgot-password" className="w-full">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRightIcon />}
              className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
            >
              Request A New Link
            </Button>
          </Link>
          <BackToLogin />
        </div>
      </PasswordResetShell>
    );
  }

  if (phase === 'done') {
    return (
      <PasswordResetShell>
        <div
          className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3"
          data-testid="reset-done"
        >
          <ResetHeader eyebrow="ALL SET" line1="Password" line2="updated.">
            <p role="status">
              You can now log in with your new password. Taking you to the log-in page…
            </p>
          </ResetHeader>
          <Link to="/login" replace className="w-full">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRightIcon />}
              className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
            >
              Go To Log In
            </Button>
          </Link>
        </div>
      </PasswordResetShell>
    );
  }

  return (
    <PasswordResetShell>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3"
        noValidate
      >
        <ResetHeader eyebrow="NEW PASSWORD" line1="Choose a new" line2="password.">
          <p>Use at least {MIN_LENGTH} characters. You&apos;ll use it to log in from now on.</p>
        </ResetHeader>

        <div className="flex flex-col gap-4 max-md:gap-3">
          <PasswordInput
            id="reset-password"
            label="New Password"
            required
            placeholder="Enter a new password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
              if (failure) setFailure('');
            }}
            error={passwordError || undefined}
            helperText={passwordError ? undefined : `At least ${MIN_LENGTH} characters.`}
          />
          <PasswordInput
            id="reset-password-confirm"
            label="Confirm New Password"
            required
            placeholder="Enter it again"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (confirmError) setConfirmError(null);
              if (failure) setFailure('');
            }}
            error={confirmError || undefined}
          />
        </div>

        <ResetStatusNote message={failure} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!password || !confirm || isSaving}
          state={isSaving ? 'active' : undefined}
          leftIcon={isSaving ? <LoadingSpinner stroke="#EBF1EC" /> : undefined}
          rightIcon={<ArrowRightIcon />}
          className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
          aria-busy={isSaving}
        >
          {isSaving ? 'Updating Password' : 'Update Password'}
        </Button>

        <BackToLogin />
      </form>
    </PasswordResetShell>
  );
};

export default ResetPasswordPage;
