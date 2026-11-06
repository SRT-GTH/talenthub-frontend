import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageLoader from '../../components/ui/gthLoader/PageLoader.jsx';
import { useAgencySessionState } from '../../components/sections/agency/agencySessionStore.js';
import { changeMyPassword } from '../../services/agency.api.js';
import { getApiErrorMessage } from '../../services/apiErrors.js';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';

/*
 * /agency/set-password: first sign-in with the temporary password a GTH admin handed over. The agency sets its own
 * password (8+ characters with a number or symbol; the backend applies the same rule) before any portal data is shown.
 * POST /api/settings/password clears metadata.mustChangePassword and logs out other devices.
 */

const RULE = /[^A-Za-z]/;

const Field = ({ id, label, value, onChange, autoComplete, hint }) => (
  <label htmlFor={id} className="flex flex-col gap-[6px]">
    <span className="text-[14px] font-semibold text-[#1c2a21]">{label}</span>
    <input
      id={id}
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      className="h-[44px] rounded-[10px] border border-[#d4d4d4] bg-white px-[12px] text-[15px] outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
      aria-describedby={hint ? `${id}-hint` : undefined}
    />
    {hint ? (
      <span id={`${id}-hint`} className="text-[13px] text-[#6b7280]">
        {hint}
      </span>
    ) : null}
  </label>
);

const AgencySetPasswordPage = () => {
  const ctx = useAgencySessionState();
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!ctx || ctx.loading) return <PageLoader look="focused" />;
  if (ctx.code === 'UNAUTHORIZED') return <Navigate to="/login" replace />;
  if (ctx.me && !ctx.me.mustChangePassword) return <Navigate to="/agency" replace />;

  const problem =
    next && next.length < 8
      ? 'Use at least 8 characters.'
      : next && !RULE.test(next)
        ? 'Add a number or symbol.'
        : confirm && confirm !== next
          ? 'The two new passwords are not the same.'
          : next && next === current
            ? 'Choose a password different from the temporary one.'
            : '';
  const ready = current && next && confirm && !problem;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      await changeMyPassword({ currentPassword: current, newPassword: next });
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
        if (stored) {
          stored.metadata = { ...(stored.metadata || {}), mustChangePassword: false };
          localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(stored));
        }
      } catch {
        /* the stored profile is a convenience copy only */
      }
      await ctx.reload();
      navigate('/agency?modal=welcome', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
      setBusy(false);
    }
  };

  const name = ctx.me?.analyst?.firstName;
  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-[460px] flex-col justify-center gap-[20px] px-[16px] py-[32px] font-sans">
      <div className="flex flex-col gap-[8px]">
        <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.6px] text-brand-green">
          {ctx.me?.agency?.name || 'Government agency'}
        </p>
        <h1 className="m-0 text-[26px] font-semibold leading-[32px] text-[#1c2a21]">
          {name ? `Welcome, ${name}. Set your password` : 'Set your password'}
        </h1>
        <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
          You signed in with a temporary password from the Ghana Talent Hub team. Choose your own
          before you open the portal. Other devices signed in to this account will be signed out.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-[16px]" noValidate>
        <Field
          id="agency-current"
          label="Temporary password"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <Field
          id="agency-new"
          label="New password"
          value={next}
          onChange={setNext}
          autoComplete="new-password"
          hint="At least 8 characters, with a number or symbol."
        />
        <Field
          id="agency-confirm"
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />
        {problem || error ? (
          <p role="alert" className="m-0 text-[14px] text-[#b42318]">
            {error || problem}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={!ready || busy}
          className="h-[46px] rounded-[10px] bg-brand-green px-[16px] text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save and open the portal'}
        </button>
      </form>
    </main>
  );
};

export default AgencySetPasswordPage;
