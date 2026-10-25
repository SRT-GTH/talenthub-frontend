import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubButton } from '../talentSkillsLab/HubParts.jsx';
import InterviewCard from '../talentMessages/cards/InterviewCard.jsx';
import {
  downloadInterviewIcs,
  fetchUpcomingInterviews,
  interviewErrorText,
} from '../../../services/interviews.api.js';
import { FOCUS_RING } from './jobDetailStyles.js';

const log = debug('JobInterviewPanel');

/*
 * JobInterviewPanel — the talent side of the interview loop on the job detail screen
 * (Recruiter Buddy design, Iteration 4 §2.3). Reuses the Messages InterviewCard (Figma T-MSG-08/09).
 *
 *   confirmed (booked)→ confirmed card straight away (a recruiter's booking is final, IQ-1)
 *   awaiting_pick     → pick card: the recruiter offered 2–5 times; tap one, Confirm; or "None of these work?"
 *   proposed (legacy) → invite card: Accept · Suggest another time (1–3 times + note)
 *   confirmed         → confirmed card: Add to calendar (.ics) · Need to change it? (note + optional times)
 *   change_requested  → "waiting for a new time" notice with the times the talent suggested
 *
 * Times are shown and entered in Ghana time (GMT).
 */

const TZ = 'Africa/Accra';
const MAX_SLOTS = 3;

const fmtDay = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

const whenText = (at, durationMin = 60) => {
  const end = new Date(new Date(at).getTime() + (durationMin || 60) * 60 * 1000);
  return `${fmtDay(at)} · ${fmtTime(at)}–${fmtTime(end)} GMT`;
};

const whereText = (format, detail, confirmed, picking = false) => {
  if (format === 'phone') return 'Phone call';
  if (format === 'in-person')
    return detail?.location ? `In person · ${detail.location}` : 'In person';
  if (format === 'assessment') return 'Assessment';
  if (!confirmed)
    return picking
      ? 'Video call · link shared once you pick a time'
      : 'Video call · link shared after you accept';
  return detail?.meetingUrl ? 'Video call · link in your calendar invite' : 'Video call';
};

/** "2026-10-30T14:00" (datetime-local, Ghana = GMT) → ISO string, or null. */
const toIso = (local) => {
  if (!local) return null;
  const d = new Date(`${local}:00Z`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const SlotForm = ({ title, hint, requireSlot, busy, error, onCancel, onSend }) => {
  const [slots, setSlots] = useState(['']);
  const [note, setNote] = useState('');
  const isos = slots.map(toIso).filter(Boolean);
  // Suggesting needs at least one time; asking to change needs a time or a note.
  const canSend =
    !busy && (requireSlot ? isos.length > 0 : isos.length > 0 || note.trim().length > 0);
  return (
    <form
      aria-label={title}
      className="flex w-full max-w-[540px] flex-col gap-[12px] rounded-[12px] border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-white p-[16px]"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSend({ slots: isos, note: note.trim() || undefined });
      }}
    >
      <h3 className="m-0 font-sans text-[15px] font-semibold leading-[19px] text-[#1c2a21]">
        {title}
      </h3>
      <p className="m-0 font-sans text-[13px] leading-[17px] text-[#595959]">{hint}</p>
      {slots.map((v, i) => (
        <label
          key={i}
          className="flex flex-col gap-[4px] font-sans text-[12px] font-medium text-[#1c2a21]"
        >
          {`Time ${i + 1} (Ghana time)`}
          <input
            type="datetime-local"
            value={v}
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => setSlots((s) => s.map((x, j) => (j === i ? e.target.value : x)))}
            className={classNames(
              'h-[40px] rounded-[8px] border border-solid border-[#cfd8d1] px-[10px] font-sans text-[14px] text-[#1c2a21]',
              FOCUS_RING
            )}
          />
        </label>
      ))}
      {slots.length < MAX_SLOTS ? (
        <button
          type="button"
          onClick={() => setSlots((s) => [...s, ''])}
          className={classNames(
            'self-start cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold text-[#387440]',
            FOCUS_RING
          )}
        >
          + Add another time
        </button>
      ) : null}
      <label className="flex flex-col gap-[4px] font-sans text-[12px] font-medium text-[#1c2a21]">
        Note for the recruiter (optional)
        <textarea
          value={note}
          maxLength={500}
          rows={2}
          onChange={(e) => setNote(e.target.value)}
          className={classNames(
            'rounded-[8px] border border-solid border-[#cfd8d1] p-[10px] font-sans text-[14px] text-[#1c2a21]',
            FOCUS_RING
          )}
        />
      </label>
      {error ? (
        <p role="alert" className="m-0 font-sans text-[13px] text-[#b42318]">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-[8px]">
        <HubButton
          tone={canSend ? 'primary' : 'disabled'}
          size="lg"
          type="submit"
          disabled={!canSend}
        >
          {busy ? 'Sending…' : 'Send'}
        </HubButton>
        <HubButton tone="secondary" size="lg" onClick={onCancel} disabled={busy}>
          Cancel
        </HubButton>
      </div>
    </form>
  );
};

const JobInterviewPanel = ({ job, jobs }) => {
  const app = job?.application || null;
  const iv = app?.interview || null;
  const status = iv?.status === 'scheduled' ? 'confirmed' : iv?.status || null;
  const [detail, setDetail] = useState(null);
  const [mode, setMode] = useState(null); // 'suggest' | 'change' | null
  const [error, setError] = useState(null);
  const busy = Boolean(jobs.data?.busy && String(jobs.data.busy).startsWith('interview:'));

  // Full interview details (duration, link, location, suggested times) — the feed only has at/mode/status.
  useEffect(() => {
    if (!app?.id || !status) return undefined;
    let cancelled = false;
    fetchUpcomingInterviews()
      .then((list) => {
        if (cancelled) return;
        setDetail(
          list.find((x) => x.applicationId === String(app.id) && x.role === 'applicant') || null
        );
      })
      .catch((err) => log.error('upcoming failed:', err?.response?.status || err?.message));
    return () => {
      cancelled = true;
    };
  }, [app?.id, status, iv?.at]);

  if (!app || app.stage !== 'interview_scheduled' || !iv?.at || !status) return null;

  const company = job.company?.name || 'the company';
  // The feed reloads after a reply and the card itself shows the new state.
  const reply = (body) => {
    setError(null);
    jobs.data
      ?.respondInterview(job.id, body)
      .then(() => {
        setMode(null);
      })
      .catch((err) => {
        log.error('reply failed:', err?.response?.status || err?.message);
        setError(interviewErrorText(err));
      });
  };

  const card = {
    id: `interview-${app.id}`,
    kind: 'interview',
    state: status === 'confirmed' ? 'confirmed' : status === 'awaiting_pick' ? 'pick' : 'invite',
    strip: 'INTERVIEW INVITE',
    title: `${job.title} · ${company}`,
    when: whenText(iv.at, detail?.durationMin),
    where: whereText(
      detail?.format || iv.mode,
      detail,
      status === 'confirmed',
      status === 'awaiting_pick'
    ),
    acceptLabel: busy ? 'Accepting…' : 'Accept',
    suggestLabel: 'Suggest another time',
    confirmedLabel: "You're confirmed",
    calendarLabel: 'Add to calendar',
    changeLabel: 'Need to change it?',
    pickPrompt: 'Pick the time that suits you (Ghana time)',
    pickLabel: busy ? 'Confirming…' : 'Confirm this time',
    noneLabel: 'None of these work?',
    slots: (detail?.offeredSlots || []).map((s) => ({
      id: s,
      label: `${fmtDay(s)} · ${fmtTime(s)}`,
    })),
  };

  return (
    <section
      aria-label="Your interview"
      className="flex min-w-0 flex-col gap-[12px] max-xl:order-3"
    >
      {status === 'cancelled' ? (
        <div className="flex w-full max-w-[540px] flex-col gap-[6px] rounded-[12px] border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-white p-[16px]">
          <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
            {card.title}
          </h3>
          <p className="m-0 font-sans text-[13px] leading-[17px] text-[#595959]">
            {`${company} cancelled the interview on ${card.when}. Your application is still open; they may get back to you with a new time.`}
          </p>
        </div>
      ) : status === 'change_requested' ? (
        <div className="flex w-full max-w-[540px] flex-col gap-[8px] rounded-[12px] border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-white p-[16px]">
          <h3 className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
            {card.title}
          </h3>
          <p className="m-0 font-sans text-[13px] leading-[17px] text-[#595959]">
            {`You asked for another time instead of ${card.when}. ${company} will send a new invite.`}
          </p>
          {detail?.proposedSlots?.length ? (
            <ul className="m-0 flex list-disc flex-col gap-[4px] pl-[18px] font-sans text-[13px] text-[#1c2a21]">
              {detail.proposedSlots.map((s) => (
                <li key={s}>{`${fmtDay(s)} · ${fmtTime(s)} GMT`}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : mode ? (
        <SlotForm
          title={mode === 'suggest' ? 'Suggest another time' : 'Ask to change the interview'}
          hint={
            mode === 'suggest'
              ? `Give ${company} up to three times that work for you.`
              : `Tell ${company} what needs to change. Suggesting new times is optional.`
          }
          requireSlot={mode === 'suggest'}
          busy={busy}
          error={error}
          onCancel={() => {
            setMode(null);
            setError(null);
          }}
          onSend={({ slots, note }) =>
            reply({ action: mode === 'suggest' ? 'propose' : 'request_change', slots, note })
          }
        />
      ) : (
        <InterviewCard
          card={card}
          onConfirm={() => {
            if (!busy) reply({ action: 'accept' });
          }}
          onSuggest={() => setMode('suggest')}
          onAddToCalendar={() =>
            downloadInterviewIcs(app.id).catch((err) => {
              log.error('ics failed:', err?.response?.status || err?.message);
              setError('Couldn’t get the calendar file. Please try again.');
            })
          }
          onChange={() => setMode('change')}
          onPick={(slot) => {
            if (!busy) reply({ action: 'pick', slot });
          }}
          onNone={() => setMode('suggest')}
        />
      )}

      {error && !mode ? (
        <p role="alert" className="m-0 font-sans text-[13px] text-[#b42318]">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default JobInterviewPanel;
