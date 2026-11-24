import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiMessage, completeInvite, inviteInfo } from '../services/institutionPortal.api.js';
import { debug } from '../utils/debug.js';

const log = debug('CompleteInvitePage');

/*
 * /auth/complete-invite/:token — the link in an organisation's invite email (a school adding a student or a staff member, or any organisation adding a
 * member). GET /api/institution-signup/invite/:token says who invited them and whether the link still works; the person chooses a password (8+ characters
 * with a number or symbol) and, when the invite has no phone number (or, for a school's SMS invite, no email), adds it. POST /api/users/complete-invite/:token
 * creates the account; they then sign in at /login, where school staff land in the school portal and students on their own home. If the email or phone they
 * add already has a GTH account (409 USER_EXISTS / PHONE_TAKEN / CONTACT_TAKEN), they are offered "Sign in to that account" instead (ADR-12): the school's
 * request to link then waits on that account.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TAKEN = ['USER_EXISTS', 'PHONE_TAKEN', 'CONTACT_TAKEN'];

const RULE = /[^A-Za-z]/;
const REASON = {
  'not-found':
    'This invite link is not valid. Check that you opened the whole link from the email.',
  used: 'This invite was already used. Sign in with the email address it was sent to.',
  cancelled: 'This invite was cancelled. Ask whoever invited you to send a new one.',
  paused:
    'Your parent or guardian paused this account. Ask them, or your school, if you have questions.',
  expired: 'This invite has expired. Ask whoever invited you to send it again.',
};

const Field = ({ id, label, type = 'text', value, onChange, autoComplete, hint, placeholder }) => (
  <label htmlFor={id} className="flex flex-col gap-[6px]">
    <span className="text-[14px] font-semibold text-[#1c2a21]">{label}</span>
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      className="h-[44px] rounded-[10px] border border-[#d4d4d4] bg-white px-[12px] text-[15px] outline-none focus:border-[#387440] focus:ring-2 focus:ring-[#387440]/20"
      aria-describedby={hint ? `${id}-hint` : undefined}
    />
    {hint ? (
      <span id={`${id}-hint`} className="text-[13px] text-[#6b7280]">
        {hint}
      </span>
    ) : null}
  </label>
);

const CompleteInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taken, setTaken] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      setInfo(await inviteInfo(token));
    } catch (err) {
      const status = err?.response?.status;
      // A malformed or unknown token comes back as a 4xx without a readable message ("Request failed with status code 422"):
      // show the same "not valid" screen as an unknown invite, with its way out to sign in.
      if (status >= 400 && status < 500 && !err?.response?.data?.message) {
        log('invite lookup rejected the token:', status);
        setInfo({ valid: false, reason: 'not-found' });
        return;
      }
      log.error('invite lookup failed:', status, err?.message);
      setLoadError(apiMessage(err));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const phoneDigits = phone.replace(/\D/g, '');
  const problem =
    info?.needsEmail && email && !EMAIL.test(email.trim())
      ? 'Enter a valid email address.'
      : info?.needsPhone && phone && phoneDigits.length < 9
        ? 'Enter your full phone number.'
        : password && password.length < 8
          ? 'Use at least 8 characters.'
          : password && !RULE.test(password)
            ? 'Add a number or symbol.'
            : confirm && confirm !== password
              ? 'The two passwords are not the same.'
              : '';
  const ready =
    password &&
    confirm &&
    (!info?.needsPhone || phoneDigits.length >= 9) &&
    (!info?.needsEmail || EMAIL.test(email.trim())) &&
    !problem;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    setTaken(false);
    try {
      await completeInvite(token, {
        password,
        phoneNumber: info.needsPhone ? phone : undefined,
        email: info.needsEmail ? email : undefined,
      });
      setDone(true);
    } catch (err) {
      setError(apiMessage(err));
      setTaken(TAKEN.includes(err?.response?.data?.type));
      setBusy(false);
    }
  };

  const what =
    info?.kind === 'staff'
      ? `join ${info.organisation} on Ghana Talent Hub as ${info.role ? info.role.toLowerCase() : 'staff'}`
      : info?.kind === 'student'
        ? `join Ghana Talent Hub as a student of ${info.organisation}`
        : `join ${info?.organisation} on Ghana Talent Hub`;

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-[460px] flex-col justify-center gap-[20px] px-[16px] py-[40px] font-sans">
      <p className="m-0 text-[13px] font-semibold tracking-[0.6px] text-[#387440] uppercase">
        Ghana Talent Hub
      </p>
      {loadError ? (
        <p role="alert" className="m-0 text-[15px] text-[#902b20]">
          We couldn’t open this invite. {loadError}{' '}
          <Link to="/login" className="font-semibold text-[#387440] underline">
            Go to sign in
          </Link>
        </p>
      ) : !info ? (
        <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
      ) : !info.valid ? (
        <>
          <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
            This invite can’t be used
          </h1>
          <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
            {REASON[info.reason] || REASON['not-found']}
          </p>
          <Link to="/login" className="text-[15px] font-semibold text-[#387440] underline">
            Go to sign in
          </Link>
        </>
      ) : done ? (
        <>
          <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
            Your account is ready
          </h1>
          <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
            Sign in with {info.needsEmail ? email.trim() : info.email} and the password you just
            chose.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login', { replace: true })}
            className="h-[46px] cursor-pointer rounded-[10px] bg-[#387440] px-[16px] text-[15px] font-semibold text-white"
          >
            Sign in
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-[8px]">
            <h1 className="m-0 text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
              {info.firstName ? `Welcome, ${info.firstName}` : 'Welcome'}
            </h1>
            <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
              You’ve been invited to {what}.{' '}
              {info.needsEmail
                ? `Add your email and choose a password to set up your account${info.phone ? ` for ${info.phone}` : ''}.`
                : `Choose a password to set up your account for ${info.email}.`}
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-[16px]" noValidate>
            {info.needsEmail ? (
              <Field
                id="invite-email"
                label="Your email address"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                placeholder="you@example.com"
                hint="Your own email. You sign in with it."
              />
            ) : null}
            {info.needsPhone ? (
              <Field
                id="invite-phone"
                label="Your phone number"
                type="tel"
                value={phone}
                onChange={setPhone}
                autoComplete="tel"
                placeholder="024 123 4567"
                hint="Your own number. We use it to keep your account safe."
              />
            ) : null}
            <Field
              id="invite-password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              hint="At least 8 characters, with a number or symbol."
            />
            <Field
              id="invite-confirm"
              label="Confirm password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
            />
            {problem || error ? (
              <p role="alert" className="m-0 text-[14px] text-[#b42318]">
                {error || problem}{' '}
                {taken ? (
                  <Link to="/login" className="font-semibold text-[#387440] underline">
                    Sign in to that account
                  </Link>
                ) : null}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!ready || busy}
              className="h-[46px] cursor-pointer rounded-[10px] bg-[#387440] px-[16px] text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Setting up your account…' : 'Set up my account'}
            </button>
          </form>
        </>
      )}
    </main>
  );
};

export default CompleteInvitePage;
