import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  apiMessage,
  guardianConsentAnswer,
  guardianConsentInfo,
} from '../services/institutionPortal.api.js';

/*
 * /guardian-consent/:token — public page a parent or guardian opens from the text or email a school sends for an under-18 on its roster.
 * GET /api/guardian-consent/:token shows the student's first name and the school; Agree / Decline answers once (POST, the token is single-purpose and
 * expires after 30 days). No GTH account is needed.
 */

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
      setError(apiMessage(err));
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
        </>
      ) : !info ? (
        <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
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
