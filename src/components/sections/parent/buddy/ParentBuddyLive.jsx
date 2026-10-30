import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { WhiteArrowRightIcon } from '../../../shared/assets.jsx';
import BuddyThinking, { StopGeneratingPill } from '../../../ui/BuddyThinking.jsx';
import buddy26 from '../../../../assets/talent-home/flows/career-buddy-avatar-26.png';
import {
  currentEntityId,
  currentFirstName,
  sendTurnStream,
} from '../../../../services/careerBuddy.api.js';
import { LIVE_PANEL } from './buddyData.js';

const log = debug('ParentBuddyLive');

const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid border-[#dde6df] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

/** An app path only (one leading slash): never an external or javascript: link. */
const safePath = (link) => (typeof link === 'string' && /^\/(?![/\\])/.test(link) ? link : null);

/*
 * ParentBuddyLive - the parent's Ask Buddy thread with the real agent (Career Buddy search Phase 3b, 2026-10-30).
 * Shown by ParentBuddyPanel when a parent is signed in and the URL is not a design frame (the same live/demo rule as
 * the rest of /parent); the Figma frames (?buddy=thinking|working|…) keep the drawn demo.
 * One turn = POST /career-buddy/turn-stream (sendTurnStream). The agent answers parents in code from the parent
 * dashboard data (agent parent-turn.ts): ward cards link to /parent/wards/:id, chips carry their exact action.
 * Ward cards are the parent's own wards: nothing here is sent as a search signal. History stays in this panel only.
 */
const ParentBuddyLive = ({ inputRef, onClose }) => {
  const navigate = useNavigate();
  const logRef = useRef(null);
  const abortRef = useRef(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [turns, setTurns] = useState(() => [
    {
      id: 'hello',
      role: 'buddy',
      text: LIVE_PANEL.greeting(currentFirstName()),
      chipActions: LIVE_PANEL.starters,
    },
  ]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (text, chipAction = null) => {
    const message = String(text || '').trim();
    if (!message || busy) return;
    const entityId = currentEntityId();
    if (!entityId) return;
    log('send', { chip: chipAction?.intent || null, length: message.length });
    setDraft('');
    setBusy(true);
    setStatus(null);
    setTurns((t) => [
      ...t.map((x) => ({ ...x, chipActions: [] })),
      { id: `p-${Date.now()}`, role: 'parent', text: message },
    ]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await sendTurnStream({
        entityId,
        message,
        history: [],
        ...(chipAction
          ? { chipAction: { intent: chipAction.intent, slots: chipAction.slots || [] } }
          : {}),
        signal: controller.signal,
        onStatus: (s) => setStatus(s),
      });
      setTurns((t) => [
        ...t,
        {
          id: `b-${Date.now()}`,
          role: 'buddy',
          text: result?.reply || LIVE_PANEL.empty,
          cards: Array.isArray(result?.searchResults)
            ? result.searchResults.filter((c) => c?.type === 'ward' && c?.id)
            : [],
          chipActions: Array.isArray(result?.chipActions) ? result.chipActions.slice(0, 3) : [],
        },
      ]);
    } catch (err) {
      const stopped = controller.signal.aborted;
      log('turn failed', stopped ? 'stopped' : err?.message);
      setTurns((t) => [
        ...t,
        {
          id: `e-${Date.now()}`,
          role: 'buddy',
          text: stopped ? LIVE_PANEL.stopped : LIVE_PANEL.failed,
          retry: stopped ? null : { message, chipAction },
        },
      ]);
    } finally {
      abortRef.current = null;
      setBusy(false);
      setStatus(null);
      inputRef.current?.focus();
    }
  };

  const openCard = (card) => {
    const path = safePath(card.link);
    if (!path) return;
    log('open ward', card.id);
    onClose();
    navigate(path);
  };

  return (
    <>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto bg-[#fafbf9] p-[20px]"
      >
        <span className="inline-flex h-[32px] w-fit items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
          {LIVE_PANEL.today}
        </span>
        {turns.map((t) =>
          t.role === 'parent' ? (
            <div key={t.id} className="flex justify-end">
              <p className="m-0 max-w-[300px] bg-[#387440] px-[14px] py-[12px] text-[14px] leading-[21px] text-white [border-radius:16px_16px_4px_16px]">
                {t.text}
              </p>
            </div>
          ) : (
            <div key={t.id} className="flex flex-col gap-[10px]">
              <div className="flex items-end gap-[8px]">
                <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-solid border-[#dde6df] bg-white">
                  <img
                    src={buddy26}
                    alt=""
                    aria-hidden="true"
                    className="size-[30px] rounded-full"
                  />
                </span>
                <p className="m-0 max-w-[340px] bg-[#f2f5f2] px-[14px] py-[12px] text-[14px] leading-[21px] text-[#1c2a21] [border-radius:16px_16px_16px_4px]">
                  {t.text}
                </p>
              </div>
              {t.cards?.length ? (
                <ul
                  className="m-0 flex list-none flex-col gap-[8px] p-0 pl-[40px]"
                  aria-label="Your wards"
                >
                  {t.cards.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => openCard(c)}
                        disabled={!safePath(c.link)}
                        className="flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid border-[#dde6df] bg-white px-[14px] py-[12px] text-left font-sans disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#e8f2ed] text-[13px] font-semibold text-[#2f6b47]"
                        >
                          {String(c.title || '?')
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0].toUpperCase())
                            .join('')}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                          <span className="truncate text-[14px] leading-[18px] font-semibold text-[#1c2a21]">
                            {c.title}
                          </span>
                          <span className="truncate text-[12px] leading-[16px] text-[#595959]">
                            {[c.snippet, ...(Array.isArray(c.facts) ? c.facts.slice(1) : [])]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>
                        <span className="shrink-0 text-[13px] font-semibold text-[#387440]">
                          {LIVE_PANEL.openWard}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {t.retry ? (
                <div className="pl-[40px]">
                  <button
                    type="button"
                    className={CHIP}
                    disabled={busy}
                    onClick={() => ask(t.retry.message, t.retry.chipAction)}
                  >
                    {LIVE_PANEL.tryAgain}
                  </button>
                </div>
              ) : null}
              {t.chipActions?.length ? (
                <div className="flex flex-wrap gap-[8px] pl-[40px]">
                  {t.chipActions.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      className={CHIP}
                      disabled={busy}
                      onClick={() => ask(c.label, c.intent ? c : null)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          )
        )}
        {busy ? (
          <div className="pr-[36px]">
            <BuddyThinking phase="thinking" lookingAt={status ? [status] : LIVE_PANEL.lookingAt} />
          </div>
        ) : null}
      </div>

      <div className="relative flex min-h-[48px] shrink-0 items-start justify-center bg-white px-[20px] pt-[8px]">
        {busy ? <StopGeneratingPill onStop={() => abortRef.current?.abort()} /> : null}
      </div>

      <form
        className="flex shrink-0 items-center gap-[10px] bg-white pt-[4px] pr-[20px] pb-[18px] pl-[20px]"
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-[8px] rounded-[16px] border border-solid border-[#dde6df] bg-white py-[12px] pr-[14px] pl-[16px] shadow-[0_2px_8px_rgba(28,42,33,0.06)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            maxLength={500}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Message Career Buddy"
            placeholder={LIVE_PANEL.placeholder}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
          />
        </div>
        <button
          type="submit"
          aria-label="Send"
          disabled={busy || !draft.trim()}
          className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border-0 bg-[#387440] shadow-[0_4px_12px_rgba(56,116,64,0.3)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <WhiteArrowRightIcon className="size-[20px]" />
        </button>
      </form>
    </>
  );
};

export default ParentBuddyLive;
