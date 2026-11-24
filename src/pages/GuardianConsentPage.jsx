import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  apiMessage,
  guardianConsentAnswer,
  guardianConsentInfo,
} from '../services/institutionPortal.api.js';
import { debug } from '../utils/debug.js';

const log = debug('GuardianConsentPage');

// A malformed or unknown token comes back as a 4xx without a readable message ("Request failed with status code 422").
const BAD_LINK =
  'Check that you opened the whole link from the text or email. If it still doesn’t work, ask the school to send it again.';
const loadMessage = (err) => {
  const status = err?.response?.status;
  log.error('consent lookup failed:', status, err?.message);
  return status >= 400 && status < 500 && !err?.response?.data?.message
    ? BAD_LINK
    : apiMessage(err);
};

/*
 * /guardian-consent/:token — public page a parent or guardian opens from the text or email a school sends for an under-18 on its roster.
 * No GTH account is needed. GET /api/guardian-consent/:token says which kind of message it was:
 *   mode "opt-out" (ADR-13, US-1.1.3-02 / US-1.1.2-02): the student is already active; the parent can opt out (reason, optional comments up to 500
 *     characters, a confirmation tick) while the link's window is open, and undo it later. Opting out pauses the student's access.
 *   mode "consent" (older requests): Agree / Decline, answered once.
 */

const REASONS_FALLBACK = [
  { key: 'privacy', label: 'Privacy concerns' },
  { key: 'safety', label: 'Safety concerns' },
  { key: 'too_young', label: 'Too young' },
  { key: 'other', label: 'Other' },
];
const longDate = (d) =>
  d
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(d)
      )
    : '';

const OptOut = ({ token, info, onInfo }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const reasons = info.reasons?.length ? info.reasons : REASONS_FALLBACK;
  const send = async (decision) => {
    setBusy(true);
    setError('');
    try {
      const extra =
        decision === 'opt-out' ? { reason, comments: comments.trim() || undefined, confirm } : {};
      const r = await guardianConsentAnswer(token, decision, extra);
      onInfo({
        ...info,
        status: r.status,
        canUndo: r.status === 'opted-out' ? !r.accountPaused : false,
        accountPaused: Boolean(r.accountPaused),
      });
      setOpen(false);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };
  if (info.status === 'opted-out') {
    return (
      <>
        <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
          You opted {info.student} out
        </h1>
        <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
          {info.student}’s access to Ghana Talent Hub is paused and {info.school} no longer sees
          their profile. Nothing is deleted, so access can be restored.
          {info.canUndo
            ? ''
            : ' To restore it, sign in to a parent account on Ghana Talent Hub or ask the school.'}
        </p>
        {error ? (
          <p role="alert" className="m-0 text-[14px] text-[#902b20]">
            {error}
          </p>
        ) : null}
        {info.canUndo ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => send('undo')}
            className="h-[46px] w-fit cursor-pointer rounded-[10px] border border-[#c7c9c4] bg-white px-[20px] text-[15px] font-semibold text-[#1c2a21] disabled:opacity-60"
          >
            {busy ? 'Restoring…' : 'Undo: restore access'}
          </button>
        ) : null}
      </>
    );
  }
  return (
    <>
      <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
        {info.school} registered {info.student} on Ghana Talent Hub
      </h1>
      <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
        Your ward {info.student} has been registered on Ghana Talent Hub by {info.school}. The
        platform gives career guidance and skill assessments. If you have concerns, you can opt out
        {info.windowEndsAt ? ` until ${longDate(info.windowEndsAt)}` : ''}. Otherwise, no action is
        needed.
      </p>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      {!info.windowOpen ? (
        <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
          The opt-out period of this link has ended. To manage {info.student}’s account, create a
          parent account on Ghana Talent Hub or contact the school.
        </p>
      ) : !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-[46px] w-fit cursor-pointer rounded-[10px] border border-[#c7c9c4] bg-white px-[20px] text-[15px] font-semibold text-[#1c2a21]"
        >
          Opt {info.student} out
        </button>
      ) : (
        <form
          className="flex flex-col gap-[14px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (reason && confirm && !busy) send('opt-out');
          }}
        >
          <label className="flex flex-col gap-[6px] text-[14px] font-semibold text-[#1c2a21]">
            Reason
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-[44px] rounded-[10px] border border-[#d4d4d4] bg-white px-[10px] text-[15px] font-normal"
            >
              <option value="">Choose a reason</option>
              {reasons.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-[6px] text-[14px] font-semibold text-[#1c2a21]">
            Anything else (optional)
            <textarea
              value={comments}
              maxLength={500}
              rows={3}
              onChange={(e) => setComments(e.target.value)}
              className="rounded-[10px] border border-[#d4d4d4] bg-white p-[10px] text-[15px] font-normal"
            />
            <span className="text-[12px] font-normal text-[#6b7280]">{comments.length} / 500</span>
          </label>
          <label className="flex items-start gap-[10px] text-[14px] leading-[20px] text-[#1c2a21]">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              className="mt-[3px]"
            />
            I am {info.student}’s parent or guardian and I want to opt them out. Their access is
            paused; nothing is deleted.
          </label>
          <div className="flex flex-wrap gap-[10px]">
            <button
              type="submit"
              disabled={busy || !reason || !confirm}
              className="h-[46px] cursor-pointer rounded-[10px] bg-[#902b20] px-[20px] text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Opting out…' : 'Opt out'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-[46px] cursor-pointer rounded-[10px] border border-[#c7c9c4] bg-white px-[20px] text-[15px] font-semibold text-[#1c2a21]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

const GuardianConsentPage = () => {
  const { token } = useParams();
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [answered, setAnswered] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const r = await guardianConsentInfo(token);
      setInfo(r);
      if (r.status === 'agreed' || r.status === 'declined') setAnswered(r.status);
    } catch (err) {
      setError(loadMessage(err));
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const answer = async (decision) => {
    setBusy(true);
    setError('');
    try {
      const r = await guardianConsentAnswer(token, decision);
      setAnswered(r.status);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-[520px] flex-col justify-center gap-[20px] px-[16px] py-[40px] font-sans">
      <p className="m-0 text-[13px] font-semibold tracking-[0.6px] text-[#387440] uppercase">
        Ghana Talent Hub
      </p>
      {error && !info ? (
        <>
          <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
            This link doesn’t work
          </h1>
          <p role="alert" className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
            {error}
          </p>
          <Link to="/" className="text-[15px] font-semibold text-[#387440] underline">
            Go to Ghana Talent Hub
          </Link>
        </>
      ) : !info ? (
        <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
      ) : info.mode === 'opt-out' ? (
        <OptOut token={token} info={info} onInfo={setInfo} />
      ) : answered ? (
        <>
          <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
            {answered === 'agreed' ? 'Thank you, you agreed' : 'You declined'}
          </h1>
          <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
            {answered === 'agreed'
              ? `${info.school} can now see ${info.student}’s GTH profile and progress to support them. You can change your mind by contacting the school.`
              : `${info.school} won’t see ${info.student}’s GTH profile. ${info.student} stays on the school’s roster.`}
          </p>
        </>
      ) : (
        <>
          <h1 className="m-0 text-[24px] leading-[30px] font-semibold text-[#1c2a21]">
            {info.school} asks for your consent
          </h1>
          <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
            {info.student} is on {info.school}’s student roster on Ghana Talent Hub. Because{' '}
            {info.student} is under 18, the school can see their GTH profile and progress only if a
            parent or guardian agrees. The school uses it to verify records, issue certificates and
            guide {info.student} towards opportunities.
          </p>
          {error ? (
            <p role="alert" className="m-0 text-[14px] text-[#902b20]">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-[10px]">
            <button
              type="button"
              disabled={busy}
              onClick={() => answer('agree')}
              className="h-[46px] cursor-pointer rounded-[10px] bg-[#387440] px-[20px] text-[15px] font-semibold text-white disabled:opacity-60"
            >
              I agree
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => answer('decline')}
              className="h-[46px] cursor-pointer rounded-[10px] border border-[#c7c9c4] bg-white px-[20px] text-[15px] font-semibold text-[#1c2a21] disabled:opacity-60"
            >
              I don’t agree
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default GuardianConsentPage;
