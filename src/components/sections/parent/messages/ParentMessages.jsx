import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  fetchConversation,
  fetchConversations,
  markConversationRead,
  notifyMessagesChanged,
  sendMessage,
} from '../../../../services/messages.api.js';
import { openWardConversation, parentError } from '../../../../services/parent.api.js';
import { useParentMe } from '../live/parentLive.js';
import Button from '../../../ui/Button.jsx';

const log = debug('ParentMessages');

/*
 * ParentMessages — the parent's inbox (`/parent/messages`). Not drawn in Figma: built from the parent shell's cards so the
 * top bar's Messages button has somewhere to go. Each linked ward has one direct conversation with the parent
 * (POST /parent/wards/:wardId/conversation finds or creates it); the list, thread, send and read use the same
 * conversations API as the talent inbox (/talent-messages). `?c=<conversationId>` is the open thread (phones show the
 * list or the thread, wider screens show both). The thread polls every 5 seconds while it is open.
 */
const POLL_MS = 5000;

const timeText = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const Initials = ({ text, size = 40 }) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] font-sans text-[14px] font-semibold text-[#387440]"
  >
    {text || '?'}
  </span>
);

const ParentMessages = () => {
  const [params, setParams] = useSearchParams();
  const openId = params.get('c') || '';
  const me = useParentMe();
  const wards = me.data?.wards || [];

  const [inbox, setInbox] = useState({ status: 'loading', rows: [] });
  const [thread, setThread] = useState({ status: 'idle', conversation: null, messages: [] });
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  const loadInbox = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setInbox({ status: 'ready', rows: data?.conversations || [] });
    } catch (err) {
      setInbox((s) => ({
        ...s,
        status: 'error',
        error: parentError(err, 'Could not load your messages.'),
      }));
    }
  }, []);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const open = (id) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id) next.set('c', id);
      else next.delete('c');
      return next;
    });

  // The open thread: load, mark read, then poll quietly.
  useEffect(() => {
    if (!openId) {
      setThread({ status: 'idle', conversation: null, messages: [] });
      return undefined;
    }
    let alive = true;
    let first = true;
    const load = async () => {
      try {
        const data = await fetchConversation(openId, { withJob: false });
        if (!alive) return;
        setThread({
          status: 'ready',
          conversation: data?.conversation || null,
          messages: data?.messages || [],
        });
        if (first || data?.conversation?.unread) {
          first = false;
          await markConversationRead(openId).catch(() => {});
          notifyMessagesChanged();
          loadInbox();
        }
      } catch (err) {
        if (alive) {
          setThread({
            status: 'error',
            error: parentError(err, 'Could not open this conversation.'),
            messages: [],
          });
        }
      }
    };
    setThread((s) => ({ ...s, status: 'loading' }));
    load();
    const timer = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [openId, loadInbox]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [thread.messages.length]);

  const startWith = async (ward) => {
    setError(null);
    try {
      const { conversationId } = await openWardConversation(ward.id);
      log('conversation', { ward: ward.id, conversationId });
      await loadInbox();
      open(conversationId);
    } catch (err) {
      setError(parentError(err, `Could not open a conversation with ${ward.firstName}.`));
    }
  };

  const send = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !openId || busy) return;
    setBusy(true);
    setError(null);
    try {
      // sendMessage resolves to the sent message itself ({ id, from, text, at, status }).
      const message = await sendMessage(openId, text);
      setDraft('');
      if (message?.id) setThread((s) => ({ ...s, messages: [...s.messages, message] }));
      notifyMessagesChanged();
      loadInbox();
    } catch (err) {
      setError(parentError(err, 'Your message did not send. Try again.'));
    } finally {
      setBusy(false);
    }
  };

  const rows = inbox.rows;
  const title =
    thread.conversation?.name || rows.find((r) => r.id === openId)?.name || 'Conversation';

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[20px]">
      <div className="flex flex-col gap-[6px]">
        <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          Messages
        </h1>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#5b6660]">
          Talk with your wards. Only you and your ward see these messages.
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="m-0 rounded-[12px] bg-[#fdecea] px-[14px] py-[10px] font-sans text-[14px] text-[#c0392b]"
        >
          {error}
        </p>
      ) : null}

      <div className="flex min-h-[520px] w-full overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white">
        <section
          aria-label="Conversations"
          className={`flex w-[340px] shrink-0 flex-col border-r border-solid border-[#ececea] max-md:w-full max-md:border-r-0 ${
            openId ? 'max-md:hidden' : ''
          }`}
        >
          {wards.length ? (
            <div className="flex flex-wrap gap-[8px] border-b border-solid border-[#ececea] p-[16px]">
              {wards.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => startWith(w)}
                  className="cursor-pointer rounded-[999px] border border-solid border-[#c1d4c4] bg-[#f6f9f6] px-[12px] py-[6px] font-sans text-[13px] font-semibold text-[#2d5d33] hover:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  Message {w.firstName}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {inbox.status === 'loading' ? (
              <p className="m-0 p-[16px] font-sans text-[14px] text-[#8a938d]">Loading…</p>
            ) : inbox.status === 'error' ? (
              <p className="m-0 p-[16px] font-sans text-[14px] text-[#c0392b]">{inbox.error}</p>
            ) : rows.length === 0 ? (
              <p className="m-0 p-[16px] font-sans text-[14px] leading-[20px] text-[#5b6660]">
                No messages yet.
                {wards.length
                  ? ' Pick a ward above to start one.'
                  : ' Link a ward to message them.'}
              </p>
            ) : (
              rows.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => open(r.id)}
                  aria-current={r.id === openId ? 'true' : undefined}
                  className={`flex w-full cursor-pointer items-center gap-[12px] border-0 border-b border-solid border-[#f1f1ef] px-[16px] py-[14px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440] ${
                    r.id === openId ? 'bg-[#f2f6f2]' : 'bg-white hover:bg-[#fafbfa]'
                  }`}
                >
                  <Initials text={r.initials} />
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="flex items-center justify-between gap-[8px]">
                      <span className="truncate font-sans text-[15px] font-semibold text-[#1c2a21]">
                        {r.name}
                      </span>
                      <span className="shrink-0 font-sans text-[12px] text-[#8a938d]">
                        {timeText(r.lastMessageAt)}
                      </span>
                    </span>
                    <span className="flex items-center justify-between gap-[8px]">
                      <span className="truncate font-sans text-[13px] text-[#5b6660]">
                        {r.preview
                          ? `${r.previewFromMe ? 'You: ' : ''}${r.preview}`
                          : 'No messages yet'}
                      </span>
                      {r.unread ? (
                        <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-[#387440] px-[5px] font-sans text-[11px] font-semibold text-white">
                          {r.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        <section
          aria-label={openId ? `Conversation with ${title}` : 'Conversation'}
          className={`flex min-w-0 flex-1 flex-col ${openId ? '' : 'max-md:hidden'}`}
        >
          {!openId ? (
            <div className="flex flex-1 items-center justify-center p-[24px]">
              <p className="m-0 max-w-[320px] text-center font-sans text-[15px] leading-[22px] text-[#8a938d]">
                Pick a conversation, or message one of your wards.
              </p>
            </div>
          ) : (
            <>
              <header className="flex items-center gap-[12px] border-b border-solid border-[#ececea] px-[20px] py-[14px]">
                <button
                  type="button"
                  onClick={() => open('')}
                  className="hidden cursor-pointer rounded-[8px] border-0 bg-transparent px-[6px] py-[4px] font-sans text-[14px] font-semibold text-[#387440] max-md:block"
                >
                  ← Back
                </button>
                <Initials text={thread.conversation?.initials} size={36} />
                <h2 className="m-0 truncate font-sans text-[17px] font-semibold text-[#1c2a21]">
                  {title}
                </h2>
              </header>
              <div className="flex min-h-0 flex-1 flex-col gap-[8px] overflow-y-auto bg-[#fbfbf9] px-[20px] py-[16px]">
                {thread.status === 'loading' && !thread.messages.length ? (
                  <p className="m-0 font-sans text-[14px] text-[#8a938d]">Loading…</p>
                ) : thread.status === 'error' ? (
                  <p className="m-0 font-sans text-[14px] text-[#c0392b]">{thread.error}</p>
                ) : thread.messages.length === 0 ? (
                  <p className="m-0 font-sans text-[14px] text-[#8a938d]">
                    Say hello. Your ward sees this in their Messages.
                  </p>
                ) : (
                  thread.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.from === 'me' ? 'items-end' : 'items-start'}`}
                    >
                      <p
                        className={`m-0 max-w-[75%] rounded-[16px] px-[14px] py-[9px] font-sans text-[15px] leading-[21px] whitespace-pre-wrap ${
                          m.from === 'me'
                            ? 'bg-[#387440] text-white'
                            : 'border border-solid border-[#e7e7e7] bg-white text-[#1c2a21]'
                        }`}
                      >
                        {m.text}
                      </p>
                      <span className="px-[4px] pt-[2px] font-sans text-[11px] text-[#8a938d]">
                        {timeText(m.at)}
                        {m.from === 'me' && m.status
                          ? ` · ${m.status === 'read' ? 'Read' : 'Delivered'}`
                          : ''}
                      </span>
                    </div>
                  ))
                )}
                <div ref={endRef} />
              </div>
              <form
                onSubmit={send}
                className="flex items-end gap-[10px] border-t border-solid border-[#ececea] p-[14px]"
              >
                <label htmlFor="parent-message" className="sr-only">
                  Message {title}
                </label>
                <textarea
                  id="parent-message"
                  rows={1}
                  value={draft}
                  maxLength={10000}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) send(e);
                  }}
                  placeholder={`Message ${title}`}
                  className="max-h-[140px] min-h-[44px] flex-1 resize-none rounded-[12px] border border-solid border-[#dfdfdc] bg-white px-[14px] py-[11px] font-sans text-[15px] leading-[20px] text-[#1c2a21] outline-none focus:border-[#387440]"
                />
                <Button type="submit" size="sm" disabled={!draft.trim() || busy}>
                  {busy ? 'Sending…' : 'Send'}
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ParentMessages;
