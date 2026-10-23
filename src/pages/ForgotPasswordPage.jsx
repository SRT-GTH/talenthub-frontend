import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { COMPACT_PRIMARY_BUTTON } from '../components/ui/form/mobileScale.js';
import { TextInput } from '../components/ui/form';
import WavyDivider from '../components/shared/WavyDivider.jsx';
import { ArrowRightIcon, LoadingSpinner, MailIcon } from '../components/shared/assets.jsx';
import { getApiErrorMessage } from '../services/apiErrors.js';
import { requestPasswordReset } from '../services/auth.api.js';
import { debug } from '../utils/debug.js';
import TalentOnboardingPanel from '../components/sections/talentAuth/TalentOnboardingPanel.jsx';
import {
  LOGIN_PHOTO_CARDS,
  LoginOverlayCards,
} from '../components/sections/talentAuth/TalentLoginPanelContent.jsx';
import LoginTutorialModal from '../components/sections/talentAuth/LoginTutorialModal.jsx';

const log = debug('ForgotPasswordPage');

/*
 * ForgotPasswordPage — public "Forgot password" screen (/forgot-password).
 * No Figma frame: built on the LoginPage layout (left form column + the
 * green TalentOnboardingPanel) and the same ui/ form primitives.
 *
 * Flow: email -> POST /auth/request-password-reset. The backend always
 * answers with the same neutral message, so the confirmation never says
 * whether an account exists. The email holds a /reset-password?token=…
 * link (60 min). Resend is offered after 60s. Reset is email-only: an
 * account registered with a phone number alone can't use this.
 * A failed request (network / 5xx) keeps the form and shows a role=status note.
 */

const EMAIL_ERROR_COPY = 'Enter a valid email address';
const RESEND_AFTER_S = 60;
const isEmailShapeValid = (raw) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());

/* Shared shell for the password-reset screens: same two-column layout as LoginPage. */
export const PasswordResetShell = ({ children }) => {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  return (
    <section className="relative flex w-full flex-1 min-h-0 overflow-hidden">
      <div className="relative flex flex-1 items-center max-md:items-start justify-center max-lg:z-10 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-6 py-12 md:py-20 max-md:px-4 max-md:py-4">
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3">
          {children}
        </div>
      </div>
      <TalentOnboardingPanel
        photoCards={LOGIN_PHOTO_CARDS}
        overlayContent={<LoginOverlayCards />}
        onWatchTutorial={() => setTutorialOpen(true)}
      />
      <LoginTutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
    </section>
  );
};

/* Eyebrow + two-tone heading + sub-copy, styled like LoginPage's header. */
export const ResetHeader = ({ eyebrow, line1, line2, children }) => (
  <header className="flex flex-col items-center gap-3 text-center max-md:gap-1.5">
    {eyebrow && (
      <span className="inline-flex items-center max-md:px-3 max-md:py-0.5 gap-1.5 rounded-[10px] border border-brand-green-light-active bg-brand-green-light px-3 py-1.5">
        <span
          aria-hidden="true"
          className="size-2 rounded-full bg-brand-green shadow-[inset_0_0_3px_#19341d]"
        />
        <span className="text-[12px] font-medium leading-[18px] tracking-[0.2px] text-brand-green">
          {eyebrow}
        </span>
      </span>
    )}
    <h1
      className="font-heading font-semibold tracking-[-0.01em] max-md:text-[24px]! max-md:leading-tight!"
      style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 1.1 }}
    >
      <span className="block text-black">{line1}</span>
      <span className="block text-brand-green">{line2}</span>
    </h1>
    <div className="max-w-[400px] text-[14px] max-md:text-[13px] leading-[20px] tracking-[0.2px] text-[#737373]">
      {children}
    </div>
    <WavyDivider />
  </header>
);

/* Failure note — role=status per the app rule for failed backend calls. */
export const ResetStatusNote = ({ message }) =>
  message ? (
    <p
      role="status"
      data-testid="reset-status"
      className="w-full rounded-[10px] border border-[#F2C4BE] bg-[#FDF2F1] px-3 py-2 text-center text-[13px] leading-5 text-[#B42318]"
    >
      {message}
    </p>
  ) : null;

export const BackToLogin = () => (
  <p className="text-center text-[14px] max-md:text-[13px] text-[#737373]">
    Remembered it?{' '}
    <Link to="/login" className="font-semibold text-brand-green underline-offset-2 hover:underline">
      Back to log in
    </Link>
  </p>
);

const ForgotPasswordPage = () => {
  log('mount');
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);
  const [failure, setFailure] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentTo, setSentTo] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send = async (address) => {
    setIsSending(true);
    setFailure('');
    try {
      await requestPasswordReset({ email: address });
      log('reset link requested');
      return true;
    } catch (err) {
      log.error('request-password-reset failed:', err?.response?.status || err?.code);
      setFailure(getApiErrorMessage(err));
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSending) return;
    if (!isEmailShapeValid(email)) {
      setFieldError(EMAIL_ERROR_COPY);
      return;
    }
    const address = email.trim();
    if (await send(address)) {
      setSentTo(address);
      setResent(false);
      setCooldown(RESEND_AFTER_S);
    }
  };

  const handleResend = async () => {
    if (isSending || cooldown > 0 || !sentTo) return;
    if (await send(sentTo)) {
      setResent(true);
      setCooldown(RESEND_AFTER_S);
    }
  };

  if (sentTo) {
    return (
      <PasswordResetShell>
        <div className="flex w-full max-w-[700px] flex-col gap-6 max-md:gap-3">
          <ResetHeader eyebrow="CHECK YOUR INBOX" line1="Check your" line2="email.">
            <p>
              If an account exists for{' '}
              <span className="font-semibold text-content-primary">{sentTo}</span>, we&apos;ve sent
              a link to reset your password. The link expires in 60 minutes.
            </p>
          </ResetHeader>

          <p className="rounded-[14px] border border-[#e7e7e7] bg-yellow-light p-4 max-md:p-3 text-center text-[13px] leading-5 tracking-[0.2px] text-[#737373]">
            Nothing yet? Check your spam folder, or make sure you used the email address on your
            account.
          </p>

          <ResetStatusNote message={failure} />
          {resent && !failure && (
            <p role="status" className="text-center text-[13px] text-brand-green">
              We&apos;ve sent another link.
            </p>
          )}

          <div className="flex items-center justify-between text-[14px] max-md:text-[13px]">
            <button
              type="button"
              onClick={() => {
                setSentTo(null);
                setFailure('');
              }}
              className="font-semibold text-[#737373] underline-offset-2 hover:underline"
            >
              Use a different email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isSending || cooldown > 0}
              className="font-semibold text-brand-green underline-offset-2 hover:underline disabled:opacity-60 disabled:hover:no-underline"
            >
              {isSending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend link'}
            </button>
          </div>

          <BackToLogin />
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
        <ResetHeader eyebrow="FORGOT PASSWORD" line1="Reset your" line2="password.">
          <p>Enter the email address on your account and we&apos;ll send you a reset link.</p>
        </ResetHeader>

        <TextInput
          id="forgot-email"
          label="Email Address"
          required
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError) setFieldError(null);
            if (failure) setFailure('');
          }}
          error={fieldError || undefined}
          helperText={
            fieldError
              ? undefined
              : 'Signed up with a phone number only? Password reset needs an email on the account.'
          }
          leftIcon={<MailIcon />}
        />

        <ResetStatusNote message={failure} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!email.trim() || isSending}
          state={isSending ? 'active' : undefined}
          leftIcon={isSending ? <LoadingSpinner stroke="#EBF1EC" /> : undefined}
          rightIcon={<ArrowRightIcon />}
          className={`w-full ${COMPACT_PRIMARY_BUTTON}`}
          aria-busy={isSending}
        >
          {isSending ? 'Sending Link' : 'Send Reset Link'}
        </Button>

        <BackToLogin />
      </form>
    </PasswordResetShell>
  );
};

export default ForgotPasswordPage;
