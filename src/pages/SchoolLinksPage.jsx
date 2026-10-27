import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth.api.js';
import { answerSchoolLink, apiMessage, mySchoolLinks } from '../services/institutionPortal.api.js';

/*
 * /school-links — a student's answer to "is this your school?". A school that adds a student who already has a GTH account sends a link request
 * (notification actionUrl /school-links). GET /api/school-links lists the waiting requests; Accept links the roster row (the school can then see the
 * student's GTH profile, with guardian consent for under-18s), Decline tells the school it is not their student.
 */

const day = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : '';

const SchoolLinksPage = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [done, setDone] = useState([]);

  const load = useCallback(async () => {
    setError('');
    try {
      const r = await mySchoolLinks();
      setItems(r.items || []);
    } catch (err) {
      setError(apiMessage(err));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn()) load();
  }, [load]);

  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  const answer = async (item, accept) => {
    setBusy(item.id);
    setError('');
    try {
      await answerSchoolLink(item.id, accept);
      setItems((list) => list.filter((x) => x.id !== item.id));
      setDone((d) => [...d, { ...item, accept }]);
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy('');
    }
  };

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-[560px] flex-col gap-[20px] px-[16px] py-[40px] font-sans">
      <div className="flex flex-col gap-[8px]">
        <h1 className="m-0 text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
          Is this your school?
        </h1>
        <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
          These schools added you to their student roster. If you say yes, the school can see your
          GTH profile and progress, verify your records and issue you credentials.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="m-0 rounded-[10px] bg-[#f9ebea] px-[14px] py-[10px] text-[14px] text-[#902b20]"
        >
          {error}
        </p>
      ) : null}

      {done.map((d) => (
        <p
          key={d.id}
          role="status"
          className="m-0 rounded-[10px] bg-[#ebf1ec] px-[14px] py-[10px] text-[14px] text-[#1f4a2b]"
        >
          {d.accept
            ? `You’re linked to ${d.school}.`
            : `We told ${d.school} you’re not their student.`}
        </p>
      ))}

      {items === null && !error ? <p className="m-0 text-[14px] text-[#595959]">Loading…</p> : null}

      {items && !items.length ? (
        <div className="flex flex-col gap-[12px] rounded-[16px] border border-[#e5e5e5] bg-white p-[20px]">
          <p className="m-0 text-[15px] text-[#1c2a21]">No school is waiting for your answer.</p>
          <Link to="/home" className="text-[14px] font-semibold text-[#387440] underline">
            Back to your home
          </Link>
        </div>
      ) : null}

      {(items || []).map((item) => (
        <section
          key={item.id}
          aria-label={item.school}
          className="flex flex-col gap-[14px] rounded-[16px] border border-[#e5e5e5] bg-white p-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.05)]"
        >
          <div className="flex flex-col gap-[4px]">
            <p className="m-0 text-[17px] font-semibold text-[#1c2a21]">{item.school}</p>
            <p className="m-0 text-[14px] text-[#595959]">
              {[item.form, item.programme].filter(Boolean).join(' · ') || 'Student'}
              {item.addedOn ? ` · added you on ${day(item.addedOn)}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => answer(item, true)}
              className="h-[44px] cursor-pointer rounded-[10px] bg-[#387440] px-[18px] text-[15px] font-semibold text-white disabled:opacity-60"
            >
              Yes, this is my school
            </button>
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => answer(item, false)}
              className="h-[44px] cursor-pointer rounded-[10px] border border-[#c7c9c4] bg-white px-[18px] text-[15px] font-semibold text-[#1c2a21] disabled:opacity-60"
            >
              No, not my school
            </button>
          </div>
        </section>
      ))}
    </main>
  );
};

export default SchoolLinksPage;
