import { useCallback, useEffect, useId, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { myRequest, rateRequest, replyToRequest } from '../../../services/support.api.js';
import { FOCUS_RING, HelpButton, HelpChip, PAGE_CARD, PageHeader } from './helpUi.jsx';
import HelpField from './helpFields.jsx';

const log = debug('HelpRequestView');

/*
 * One of my support requests — /settings/help?help=request&ref=SUP-10001 (GET /api/support/cases/:ref). The conversation as the
 * person sees it (staff appear by first name + "GTH Support"; internal notes never reach this view), a reply box while it isn't
 * closed (a reply reopens a request that was waiting on them or resolved), and a 1-5 rating once it's resolved.
 * Props: settings ({ update }).
 */

const when = (at) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(at));

const RATINGS = ['Very poor', 'Poor', 'Okay', 'Good', 'Great'];

const HelpRequestView = ({ settings }) => {
  const uid = useId();
  const [params] = useSearchParams();
  const ref = params.get('ref');
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [text, setText] = useState('');
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    if (!ref) return;
    myRequest(ref)
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: null, error }));
  }, [ref]);

  useEffect(() => {
    log('mount', { ref });
    load();
  }, [ref, load]);

  const back = () => settings.update({ help: null, ref: null });
  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setMsg('');
    try {
      await replyToRequest(ref, text.trim());
      setText('');
      setMsg('Sent. We’ll reply here.');
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || 'We couldn’t send that. Try again.');
    } finally {
      setBusy(false);
    }
  };
  const rate = async () => {
    if (!score || busy) return;
    setBusy(true);
    try {
      await rateRequest(ref, score);
      setMsg('Thanks for rating our help.');
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || 'We couldn’t save your rating.');
    } finally {
      setBusy(false);
    }
  };

  const d = state.data;
  if (!ref || state.error) {
    return (
      <div className="flex flex-col gap-[16px]">
        <PageHeader title="Request not found" subtitle="It may belong to another account." />
        <HelpButton onClick={back}>Back to Help centre</HelpButton>
      </div>
    );
  }
  if (state.loading || !d) {
    return <p className="m-0 font-sans text-[15px] text-[#595959]">Loading your request…</p>;
  }
  return (
    <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)]">
      <PageHeader title={d.subject} subtitle={`${d.ref} · ${d.typeLabel}`} />
      <div className="flex flex-wrap items-center gap-[10px]">
        <HelpChip tone="status">{d.statusLabel}</HelpChip>
        <button
          type="button"
          onClick={back}
          className={classNames(
            'cursor-pointer border-0 bg-transparent p-0 font-sans text-[14px] font-semibold text-[#387440] underline',
            FOCUS_RING
          )}
        >
          All help
        </button>
      </div>
      <section
        aria-label="Conversation"
        className={classNames(PAGE_CARD, 'flex flex-col gap-[12px] p-[clamp(16px,1.6vw,24px)]')}
      >
        {d.thread.map((e) => (
          <div
            key={e.id}
            className={classNames(
              'flex max-w-[min(560px,92%)] flex-col gap-[4px] rounded-[14px] px-[14px] pt-[10px] pb-[8px]',
              e.mine ? 'self-end bg-[#ebf1ec]' : 'self-start bg-[#f2f2ee]'
            )}
          >
            <span className="font-sans text-[12px] font-semibold text-[#595959]">{e.from}</span>
            <p className="m-0 font-sans text-[14.5px] leading-[21px] whitespace-pre-wrap text-[#1c2a21]">
              {e.body}
            </p>
            <span className="self-end font-sans text-[12px] text-[#737373]">{when(e.at)}</span>
          </div>
        ))}
      </section>

      {d.canRate ? (
        <section className={classNames(PAGE_CARD, 'flex flex-col gap-[10px] p-[20px]')}>
          <p id={`${uid}-rate`} className="m-0 font-sans text-[15px] font-semibold text-[#1c2a21]">
            How did we do?
          </p>
          <div
            role="radiogroup"
            aria-labelledby={`${uid}-rate`}
            className="flex flex-wrap gap-[8px]"
          >
            {RATINGS.map((label, i) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={score === i + 1}
                onClick={() => setScore(i + 1)}
                className={classNames(
                  'cursor-pointer rounded-full border border-solid px-[14px] py-[6px] font-sans text-[13px] font-semibold',
                  score === i + 1
                    ? 'border-[#387440] bg-[#387440] text-white'
                    : 'border-[rgba(28,42,33,0.15)] bg-white text-[#1c2a21]',
                  FOCUS_RING
                )}
              >
                {i + 1} · {label}
              </button>
            ))}
          </div>
          <div>
            <HelpButton tone="primary" disabled={!score || busy} onClick={rate}>
              Send rating
            </HelpButton>
          </div>
        </section>
      ) : null}

      {d.canReply ? (
        <form
          onSubmit={send}
          className={classNames(PAGE_CARD, 'flex flex-col items-start gap-[12px] p-[20px]')}
        >
          <HelpField
            id={`${uid}-reply`}
            label={
              ['resolved'].includes(d.status) ? 'Still need help? Reply to reopen it' : 'Reply'
            }
            multiline
            maxLength={5000}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <HelpButton
            tone="primary"
            disabled={!text.trim() || busy}
            onClick={(e) => e.currentTarget.form?.requestSubmit()}
          >
            {busy ? 'Sending…' : 'Send'}
          </HelpButton>
        </form>
      ) : (
        <p className="m-0 font-sans text-[14px] text-[#595959]">
          This request is closed. If you still need help, start a new one from Contact support.
        </p>
      )}
      {msg ? (
        <p role="status" className="m-0 font-sans text-[14px] text-[#1c2a21]">
          {msg}
        </p>
      ) : null}
    </div>
  );
};

export default HelpRequestView;
