import { useCallback, useEffect, useId, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth.api.js';
import {
  answerSchoolLink,
  apiMessage,
  fileToBase64,
  myCredentials,
  myRecords,
  mySchoolLinks,
  resendRecord,
  sendRecord,
} from '../services/institutionPortal.api.js';

/*
 * /school-links — the student's side of their school on GTH.
 *   "Is this your school?": a school that adds a student who already has a GTH account sends a link request (GET /api/school-links). Accept links the
 *     roster row (the school can then see the GTH profile, with guardian consent for under-18s); Decline tells the school it is not their student.
 *   "Send a record to your school" (POST /api/school-links/records): pick a certificate or award already on the profile, or add one with a PDF / photo.
 *     The school approves it ("Verified by <school>" on the profile), rejects it with a reason, or asks for more (answer = resubmit).
 *   "Your records" and "Credentials from your school" (GET /api/school-links/records, /credentials) list what was sent and what the school issued,
 *   each credential with its public verify link.
 * Notifications from the school point here (actionUrl /school-links).
 */

const day = (iso) =>
  iso
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(iso)
      )
    : '';

const KINDS = [
  { id: 'results', label: 'Results (report, mock, WASSCE)' },
  { id: 'certificate', label: 'Certificate' },
  { id: 'award', label: 'Award' },
  { id: 'letter', label: 'Letter' },
];
const STATUS = {
  pending: { label: 'Waiting for your school', cls: 'bg-[#faf4e8] text-[#7a5a12]' },
  'needs-info': { label: 'Your school asked for more', cls: 'bg-[#eaeffb] text-[#27408b]' },
  approved: { label: 'Verified', cls: 'bg-[#ebf1ec] text-[#1f4a2b]' },
  rejected: { label: 'Not approved', cls: 'bg-[#f9ebea] text-[#902b20]' },
  valid: { label: 'Valid', cls: 'bg-[#ebf1ec] text-[#1f4a2b]' },
  revoked: { label: 'Revoked', cls: 'bg-[#f9ebea] text-[#902b20]' },
};
const MAX_FILE = 3 * 1024 * 1024;
const FIELD =
  'h-[44px] w-full rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[12px] font-sans text-[15px] text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-[#387440]';
const LABEL = 'flex flex-col gap-[6px] text-[14px] font-medium text-[#1c2a21]';
const CARD =
  'flex flex-col gap-[14px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white p-[20px]';
const PRIMARY =
  'h-[44px] cursor-pointer rounded-[10px] border-0 bg-[#387440] px-[18px] text-[15px] font-semibold text-white disabled:cursor-default disabled:opacity-60';
const SECONDARY =
  'h-[44px] cursor-pointer rounded-[10px] border border-solid border-[#c7c9c4] bg-white px-[18px] text-[15px] font-semibold text-[#1c2a21] disabled:opacity-60';

const Pill = ({ status }) => {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span
      className={`inline-flex h-[24px] shrink-0 items-center rounded-full px-[10px] text-[12px] font-semibold ${s.cls}`}
    >
      {s.label}
    </span>
  );
};

const readFile = async (file) => {
  if (!file) return undefined;
  if (file.size > MAX_FILE) throw new Error('The file must be 3 MB or smaller.');
  return { name: file.name, mime: file.type, content: await fileToBase64(file) };
};

/* "Send a record to your school": from the profile, or a new one with a file. */
const SendRecordForm = ({ schools, profileItems, onSent }) => {
  const ids = {
    school: useId(),
    from: useId(),
    kind: useId(),
    title: useId(),
    date: useId(),
    details: useId(),
    file: useId(),
  };
  const [rosterId, setRosterId] = useState(schools[0]?.rosterId ?? '');
  const free = profileItems.filter((p) => !p.sent);
  const [from, setFrom] = useState(free[0]?.id ?? 'upload');
  const [kind, setKind] = useState('results');
  const [title, setTitle] = useState('');
  const [issuedOn, setIssuedOn] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const item = free.find((p) => p.id === from);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = item
        ? {
            rosterId,
            kind: item.kind,
            title: item.title,
            issuedOn: item.issuedOn ? day(item.issuedOn) : undefined,
            details: details || (item.issuer ? `Issued by ${item.issuer}` : undefined),
            sourceType: item.type,
            sourceId: item.id,
            file: await readFile(file),
          }
        : {
            rosterId,
            kind,
            title,
            issuedOn: issuedOn || undefined,
            details: details || undefined,
            sourceType: 'upload',
            file: await readFile(file),
          };
      const res = await sendRecord(payload);
      setTitle('');
      setIssuedOn('');
      setDetails('');
      setFile(null);
      e.target.reset();
      onSent(res);
    } catch (err) {
      setError(err?.response ? apiMessage(err) : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={CARD} aria-label="Send a record to your school">
      <div className="flex flex-col gap-[4px]">
        <h2 className="m-0 text-[19px] font-semibold text-[#1c2a21]">
          Send a record to your school
        </h2>
        <p className="m-0 text-[14px] leading-[21px] text-[#595959]">
          Your school checks it against its own records. Once approved it shows “Verified by your
          school” on your profile.
        </p>
      </div>
      {schools.length > 1 ? (
        <label className={LABEL} htmlFor={ids.school}>
          School
          <select
            id={ids.school}
            className={FIELD}
            value={rosterId}
            onChange={(e) => setRosterId(e.target.value)}
          >
            {schools.map((s) => (
              <option key={s.rosterId} value={s.rosterId}>
                {s.school}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className={LABEL} htmlFor={ids.from}>
        What do you want verified?
        <select
          id={ids.from}
          className={FIELD}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          {free.map((p) => (
            <option key={p.id} value={p.id}>
              From your profile: {p.title}
            </option>
          ))}
          <option value="upload">Something new (add the details and a copy)</option>
        </select>
      </label>
      {item ? null : (
        <>
          <label className={LABEL} htmlFor={ids.kind}>
            Type
            <select
              id={ids.kind}
              className={FIELD}
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              {KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>
          <label className={LABEL} htmlFor={ids.title}>
            Title
            <input
              id={ids.title}
              className={FIELD}
              required
              minLength={2}
              maxLength={140}
              placeholder="e.g. Term 1 report, Form 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className={LABEL} htmlFor={ids.date}>
            Date (optional)
            <input
              id={ids.date}
              className={FIELD}
              maxLength={40}
              placeholder="e.g. Jul 2026"
              value={issuedOn}
              onChange={(e) => setIssuedOn(e.target.value)}
            />
          </label>
        </>
      )}
      <label className={LABEL} htmlFor={ids.details}>
        Note for your school (optional)
        <textarea
          id={ids.details}
          rows={2}
          maxLength={1000}
          className={`${FIELD} h-auto py-[10px]`}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </label>
      <label className={LABEL} htmlFor={ids.file}>
        A copy (PDF or photo, up to 3 MB){item ? ' (optional)' : ''}
        <input
          id={ids.file}
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          required={!item}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-[14px] text-[#595959]"
        />
      </label>
      {error ? (
        <p role="alert" className="m-0 text-[14px] text-[#902b20]">
          {error}
        </p>
      ) : null}
      <div>
        <button type="submit" disabled={busy} className={PRIMARY}>
          {busy ? 'Sending…' : 'Send to my school'}
        </button>
      </div>
    </form>
  );
};

/* One sent record; "needs info" opens the answer form. */
const RecordRow = ({ r, onAnswered }) => {
  const noteId = useId();
  const fileId = useId();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const answer = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await resendRecord(r.id, { details: note || undefined, file: await readFile(file) });
      setOpen(false);
      onAnswered();
    } catch (err) {
      setError(err?.response ? apiMessage(err) : err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <li className="flex flex-col gap-[8px] border-0 border-t border-solid border-[#eeeeee] py-[14px] first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-[8px]">
        <p className="m-0 min-w-[160px] flex-1 text-[15px] font-semibold text-[#1c2a21]">
          {r.title}
        </p>
        <Pill status={r.status} />
      </div>
      <p className="m-0 text-[13px] text-[#595959]">
        {[r.kindLabel, r.school, `sent ${r.submittedOn}`].filter(Boolean).join(' · ')}
      </p>
      {r.status === 'rejected' ? (
        <p className="m-0 text-[14px] text-[#902b20]">
          {r.reason}
          {r.note ? ` · “${r.note}”` : ''} You can send a corrected copy as a new record.
        </p>
      ) : null}
      {r.status === 'needs-info' ? (
        <div className="flex flex-col gap-[8px] rounded-[12px] bg-[#eaeffb] p-[12px]">
          <p className="m-0 text-[14px] text-[#1c2a21]">
            <strong>{r.school} asked:</strong> “{r.askNote}”
          </p>
          {open ? (
            <form onSubmit={answer} className="flex flex-col gap-[10px]">
              <label className={LABEL} htmlFor={noteId}>
                Your answer
                <textarea
                  id={noteId}
                  rows={2}
                  maxLength={1000}
                  className={`${FIELD} h-auto py-[10px]`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <label className={LABEL} htmlFor={fileId}>
                A new copy (optional)
                <input
                  id={fileId}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="text-[14px]"
                />
              </label>
              {error ? (
                <p role="alert" className="m-0 text-[14px] text-[#902b20]">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-[8px]">
                <button
                  type="submit"
                  disabled={busy || (!note.trim() && !file)}
                  className={PRIMARY}
                >
                  {busy ? 'Sending…' : 'Send answer'}
                </button>
                <button type="button" className={SECONDARY} onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <button type="button" className={PRIMARY} onClick={() => setOpen(true)}>
                Answer your school
              </button>
            </div>
          )}
        </div>
      ) : null}
    </li>
  );
};

const SchoolLinksPage = () => {
  const [items, setItems] = useState(null);
  const [mine, setMine] = useState(null);
  const [creds, setCreds] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [done, setDone] = useState([]);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [links, records, credentials] = await Promise.all([
        mySchoolLinks(),
        myRecords(),
        myCredentials(),
      ]);
      setItems(links.items || []);
      setMine(records);
      setCreds(credentials.items || []);
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
      load();
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setBusy('');
    }
  };

  const schools = mine?.schools ?? [];
  const loading = items === null && !error;

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-[680px] flex-col gap-[20px] px-[16px] py-[40px] font-sans">
      <div className="flex flex-col gap-[8px]">
        <h1 className="m-0 text-[26px] leading-[32px] font-semibold text-[#1c2a21]">
          {schools.length ? 'Your school' : 'Is this your school?'}
        </h1>
        <p className="m-0 text-[15px] leading-[24px] text-[#4b5563]">
          {schools.length
            ? `${schools.map((s) => s.school).join(' and ')} can see your GTH profile and progress, verify your records and issue you credentials.`
            : 'These schools added you to their student roster. If you say yes, the school can see your GTH profile and progress, verify your records and issue you credentials.'}
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
      {notice ? (
        <p
          role="status"
          className="m-0 rounded-[10px] bg-[#ebf1ec] px-[14px] py-[10px] text-[14px] text-[#1f4a2b]"
        >
          {notice}
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

      {loading ? <p className="m-0 text-[14px] text-[#595959]">Loading…</p> : null}

      {(items || []).map((item) => (
        <section
          key={item.id}
          aria-label={item.school}
          className="flex flex-col gap-[14px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white p-[20px] shadow-[0_1px_2px_rgba(15,15,10,0.05)]"
        >
          <div className="flex flex-col gap-[4px]">
            <p className="m-0 text-[13px] font-semibold text-[#7a5a12]">Is this your school?</p>
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
              className={PRIMARY}
            >
              Yes, this is my school
            </button>
            <button
              type="button"
              disabled={busy === item.id}
              onClick={() => answer(item, false)}
              className={SECONDARY}
            >
              No, not my school
            </button>
          </div>
        </section>
      ))}

      {items && !items.length && !schools.length ? (
        <div className={CARD}>
          <p className="m-0 text-[15px] text-[#1c2a21]">No school is waiting for your answer.</p>
          <Link to="/home" className="text-[14px] font-semibold text-[#387440] underline">
            Back to your home
          </Link>
        </div>
      ) : null}

      {schools.length ? (
        <SendRecordForm
          key={(mine?.records ?? []).length}
          schools={schools}
          profileItems={mine?.profileItems ?? []}
          onSent={(r) => {
            setNotice(
              `Sent “${r.title}” to your school. You’ll get a notification when they decide.`
            );
            load();
          }}
        />
      ) : null}

      {mine?.records?.length ? (
        <section className={CARD} aria-label="Your records">
          <h2 className="m-0 text-[19px] font-semibold text-[#1c2a21]">Your records</h2>
          <ul className="m-0 flex list-none flex-col p-0">
            {mine.records.map((r) => (
              <RecordRow
                key={r.id}
                r={r}
                onAnswered={() => {
                  setNotice(`Answer sent. “${r.title}” is back with your school.`);
                  load();
                }}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {creds?.length ? (
        <section className={CARD} aria-label="Credentials from your school">
          <h2 className="m-0 text-[19px] font-semibold text-[#1c2a21]">
            Credentials from your school
          </h2>
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
            {creds.map((c) => (
              <li key={c.id} className="flex flex-col gap-[4px]">
                <div className="flex flex-wrap items-center gap-[8px]">
                  <p className="m-0 min-w-[160px] flex-1 text-[15px] font-semibold text-[#1c2a21]">
                    {c.title}
                  </p>
                  <Pill status={c.status} />
                </div>
                <p className="m-0 text-[13px] text-[#595959]">
                  {c.school} · issued {c.issued} · {c.number} ·{' '}
                  <Link to={c.verifyPath} className="font-semibold text-[#387440]">
                    Check it
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
};

export default SchoolLinksPage;
