import { useEffect, useRef, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { currentEntityId, sendTurnStream } from '../../../services/careerBuddy.api.js';
import { confirmAgentDraft, draftErrorText } from '../../../services/recruiterPipeline.api.js';

const log = debug('RecruiterBuddyLive');

/*
 * RecruiterBuddyLive — the real Career Buddy for a signed-in recruiter (Recruiter Buddy design,
 * Iterations 3-4). The agent knows the role from the login (talent-auth B-8) and answers with the
 * recruiter role profile: pipeline status, candidate lists, and DRAFTS for stage moves and
 * interviews. A draft is a card; nothing changes until the recruiter presses its button, which calls
 * POST /applications/agent-drafts/confirm with their own login.
 *
 * Not in Figma as a live screen yet: it reuses the recruiter dashboard shell, page heading and the
 * board's card and button styles. The scripted recruiter demo (CareerBuddySection) stays for
 * signed-out visitors and DemoNavigator.
 */

const OPENER = 'Hi';
const BTN_PRIMARY =
  'inline-flex h-[36px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-brand-green-dark bg-brand-green px-[16px] font-sans text-[13px] font-medium text-white shadow-[0_4px_0_0_#224626] transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60';
const BTN_SECONDARY =
  'inline-flex h-[36px] cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] border border-[#e5e5e5] bg-white px-[16px] font-sans text-[13px] font-medium text-black transition-colors hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-60';

/** **bold** and line breaks / "- " bullets only (replies are code-authored). */
const Rich = ({ text }) => (
  <>
    {String(text || '')
      .split('\n')
      .map((line, i) => {
        const bullet = /^\s*[-•]\s+/.test(line);
        const body = line.replace(/^\s*[-•]\s+/, '');
        const parts = body.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          /^\*\*[^*]+\*\*$/.test(p) ? (
            <strong key={j} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          )
        );
        return (
          <p key={i} className={classNames('m-0', bullet && 'pl-[14px] -indent-[10px]')}>
            {bullet ? '• ' : null}
            {parts}
          </p>
        );
      })}
  </>
);

const DraftCard = ({ draft, state, error, onConfirm, onCancel }) => (
  <article
    aria-label={draft.title}
    className="flex w-full max-w-[520px] flex-col gap-[10px] rounded-[12px] border border-[#00522b]/10 bg-white p-[16px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
  >
    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.4px] text-brand-green-dark">
      For you to confirm
    </span>
    <h3 className="m-0 font-sans text-[15px] font-semibold leading-[19px] text-[#1c1c1a]">
      {draft.title}
    </h3>
    <div className="flex flex-col gap-[2px] font-sans text-[14px] leading-[20px] text-[#1c1c1a]">
      {draft.lines.map((l, i) => (
        <p key={i} className="m-0">
          {l}
        </p>
      ))}
    </div>
    {draft.warnings?.length ? (
      <div className="flex flex-col gap-[2px] rounded-[8px] bg-[#faf4e8] px-[10px] py-[8px] font-sans text-[13px] text-[#785910]">
        {draft.warnings.map((w, i) => (
          <p key={i} className="m-0">
            {w}
          </p>
        ))}
      </div>
    ) : null}
    {state === 'done' ? (
      <p role="status" className="m-0 font-sans text-[13px] font-semibold text-[#224626]">
        ✓ Done
      </p>
    ) : state === 'cancelled' ? (
      <p className="m-0 font-sans text-[13px] text-content-helper">Cancelled. Nothing changed.</p>
    ) : (
      <div className="flex flex-wrap items-center gap-[8px] pt-[4px]">
        <button
          type="button"
          className={BTN_PRIMARY}
          disabled={state === 'busy'}
          onClick={onConfirm}
        >
          {state === 'busy' ? 'Working…' : draft.confirmLabel}
        </button>
        <button
          type="button"
          className={BTN_SECONDARY}
          disabled={state === 'busy'}
          onClick={onCancel}
        >
          Cancel
        </button>
        <span className="font-sans text-[12px] text-content-helper">
          {`Valid for ${draft.expiresInMinutes} minutes`}
        </span>
      </div>
    )}
    {error ? (
      <p role="alert" className="m-0 font-sans text-[13px] text-[#b42318]">
        {error}
      </p>
    ) : null}
  </article>
);

const RecruiterBuddyLive = () => {
  const entityId = currentEntityId();
  const [messages, setMessages] = useState([]); // { id, role, text, draft?, draftState?, draftError? }
  const [chips, setChips] = useState([]); // { label, intent, slots }
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const started = useRef(false);

  const push = (m) =>
    setMessages((prev) => [...prev, { id: `${Date.now()}-${prev.length}`, ...m }]);

  const send = async ({ text, chipAction, silent = false }) => {
    if (busy || !entityId) return;
    if (!silent) push({ role: 'user', text });
    setBusy(true);
    setChips([]);
    setStatus('Thinking…');
    try {
      const turn = await sendTurnStream({
        entityId,
        message: text,
        history: [],
        ...(chipAction ? { chipAction } : {}),
        onStatus: setStatus,
      });
      log('turn', turn.routeReason);
      push({
        role: 'assistant',
        text: turn.reply,
        ...(turn.draft ? { draft: turn.draft, draftState: 'open' } : {}),
      });
      setChips(
        (turn.chipActions || []).map((c) => ({ label: c.label, intent: c.intent, slots: c.slots }))
      );
    } catch (err) {
      log.error('turn failed', err?.message);
      push({
        role: 'assistant',
        text: err?.message || 'Career Buddy had a problem answering that.',
      });
    } finally {
      setBusy(false);
      setStatus(null);
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    send({ text: OPENER, silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }, [messages, status]);

  const setDraft = (id, patch) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const confirm = async (m) => {
    setDraft(m.id, { draftState: 'busy', draftError: null });
    try {
      const out = await confirmAgentDraft(m.draft.draftId);
      log('draft confirmed', out?.action);
      setDraft(m.id, { draftState: 'done' });
      const failed = out?.result?.failCount || 0;
      push({
        role: 'assistant',
        text:
          m.draft.kind === 'interview'
            ? 'Done. The candidate has been told, and it’s on your Application Pipeline.'
            : failed
              ? `Done, except ${failed} that couldn’t be moved. Check the Application Pipeline.`
              : 'Done. Your Application Pipeline is up to date.',
      });
    } catch (err) {
      log.error('confirm failed', err?.response?.status || err?.message);
      setDraft(m.id, { draftState: 'open', draftError: draftErrorText(err) });
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    send({ text });
  };

  return (
    <DashboardShell>
      <div className="flex w-full flex-col gap-[20px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-md:gap-[12px] max-md:py-[12px]">
        <RecruiterPageHeading
          lead="Career "
          accent="Buddy"
          subtitle="Ask about your pipeline, move candidates and book interviews. You confirm every change."
        />

        <section
          aria-label="Conversation"
          className="flex min-h-[420px] w-full max-w-[860px] flex-col gap-[14px] rounded-[12px] border border-[#00522b]/10 bg-[#f3f8f4]/40 p-[16px]"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={classNames(
                'flex flex-col gap-[8px]',
                m.role === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={classNames(
                  'max-w-[85%] rounded-[12px] px-[14px] py-[10px] font-sans text-[14px] leading-[21px]',
                  m.role === 'user'
                    ? 'bg-brand-green text-white'
                    : 'border border-[#00522b]/10 bg-white text-[#1c1c1a]'
                )}
              >
                <Rich text={m.text} />
              </div>
              {m.draft ? (
                <DraftCard
                  draft={m.draft}
                  state={m.draftState}
                  error={m.draftError}
                  onConfirm={() => confirm(m)}
                  onCancel={() => setDraft(m.id, { draftState: 'cancelled', draftError: null })}
                />
              ) : null}
            </div>
          ))}
          {status ? (
            <p role="status" className="m-0 font-sans text-[13px] text-content-helper">
              {status}
            </p>
          ) : null}
          <div ref={endRef} />
        </section>

        {chips.length ? (
          <div className="flex max-w-[860px] flex-wrap gap-[8px]">
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                disabled={busy}
                className="inline-flex h-[34px] cursor-pointer items-center rounded-pill border-[1.21px] border-brand-green-light-hover bg-brand-green-light px-[14px] font-sans text-[13px] font-medium text-brand-green-dark disabled:opacity-60"
                onClick={() =>
                  send({ text: c.label, chipAction: { intent: c.intent, slots: c.slots || [] } })
                }
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={submit} className="flex w-full max-w-[860px] items-center gap-[8px]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Shortlist Efua, or book Kofi for Thursday 10am by phone"
            aria-label="Message Career Buddy"
            className="h-[48px] min-w-0 flex-1 rounded-[10px] border border-[#cccccc] bg-white px-[14px] font-sans text-[14px] max-lg:text-[16px] text-black outline-none placeholder:text-content-helper"
          />
          <button type="submit" className={BTN_PRIMARY} disabled={busy || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </DashboardShell>
  );
};

export default RecruiterBuddyLive;
