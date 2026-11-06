import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { adminError } from '../../../../services/admin.api.js';
import {
  chromeConversations,
  conversationMessages,
  countsChanged,
  markConversationRead,
  replyToConversation,
} from '../../../../services/adminChrome.api.js';
import AdminPanel, { PanelLink } from './AdminPanel.jsx';
import { ago } from './chromeTime.js';

/*
 * AdminMessagesPanel — the staff member's conversations (messaging service): list with the other person, last message
 * and unread count; opening one shows its messages (oldest first), marks it read and lets you reply.
 * Props: onClose, myUserId (session user _id). Your own messages are told apart by every id the server says is yours (myIds).
 */
const TYPE_LABEL = {
  talent: 'Talent',
  recruiter: 'Recruiter',
  parent: 'Parent',
  guardian: 'Guardian',
  super_admin: 'Super Admin',
  senior_admin: 'Senior Admin',
  support_agent: 'Support',
  content_moderator: 'Moderator',
};

const Thread = ({ conv, myIds, onBack }) => {
  const [msgs, setMsgs] = useState({ loading: true, items: [], error: '' });
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const end = useRef(null);

  const load = useCallback(async () => {
    try {
      const items = await conversationMessages(conv.id, 50);
      const sorted = [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMsgs({ loading: false, items: sorted, error: '' });
    } catch (e) {
      setMsgs({
        loading: false,
        items: [],
        error: adminError(e, 'Couldn’t load this conversation.'),
      });
    }
  }, [conv.id]);
  useEffect(() => {
    load();
    if (conv.unreadCount)
      markConversationRead(conv.id)
        .then(countsChanged)
        .catch(() => {});
  }, [load, conv.id, conv.unreadCount]);
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' });
  }, [msgs.items.length]);

  const send = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    setSendError('');
    try {
      await replyToConversation(conv.id, content);
      setText('');
      await load();
    } catch (err) {
      setSendError(adminError(err, 'Couldn’t send. Try again.'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-[360px] flex-col">
      <div className="flex items-center gap-[10px] border-b border-solid border-[#efefec] px-[14px] py-[10px]">
        <PanelLink onClick={onBack} aria-label="Back to conversations">
          ← Back
        </PanelLink>
        <span className="min-w-0 truncate text-[14px] font-semibold">{conv.title}</span>
      </div>
      <div
        className="flex flex-1 flex-col gap-[8px] overflow-y-auto px-[14px] py-[12px]"
        aria-live="polite"
      >
        {msgs.loading ? (
          <p className="m-0 text-[14px] text-[#595959]">Loading…</p>
        ) : msgs.error ? (
          <p className="m-0 text-[14px] text-[#902b20]">{msgs.error}</p>
        ) : !msgs.items.length ? (
          <p className="m-0 text-[14px] text-[#595959]">No messages yet.</p>
        ) : (
          msgs.items.map((m) => {
            const mine = myIds.includes(String(m.senderId));
            return (
              <div
                key={m.id || m._id}
                className={classNames('flex flex-col', mine ? 'items-end' : 'items-start')}
              >
                <div
                  className={classNames(
                    'max-w-[85%] rounded-[14px] px-[12px] py-[8px] text-[14px] leading-[20px] whitespace-pre-wrap',
                    mine ? 'bg-[#387440] text-white' : 'bg-[#f2f4f1] text-[#1c2a21]'
                  )}
                >
                  {m.content}
                </div>
                <span className="mt-[2px] text-[11.5px] text-[#8a8a85]">{ago(m.createdAt)}</span>
              </div>
            );
          })
        )}
        <div ref={end} />
      </div>
      <form
        onSubmit={send}
        className="flex shrink-0 flex-col gap-[6px] border-t border-solid border-[#efefec] px-[14px] py-[10px]"
      >
        <div className="flex items-end gap-[8px]">
          <textarea
            aria-label="Reply"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) send(e);
            }}
            placeholder="Write a reply…"
            className="min-h-[44px] flex-1 resize-none rounded-[10px] border border-solid border-[#d9d9d9] px-[10px] py-[8px] font-sans text-[14px] text-[#1c2a21] outline-none focus:border-[#387440]"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="h-[40px] cursor-pointer rounded-[10px] border-0 bg-[#387440] px-[14px] font-sans text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
        {sendError ? <p className="m-0 text-[13px] text-[#902b20]">{sendError}</p> : null}
      </form>
    </div>
  );
};

const AdminMessagesPanel = ({ onClose, myUserId }) => {
  const [list, setList] = useState({ loading: true, items: [], myIds: [], error: '' });
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setList((s) => ({ ...s, loading: true, error: '' }));
    try {
      const r = await chromeConversations(20);
      setList({ loading: false, items: r?.conversations || [], myIds: r?.myIds || [], error: '' });
    } catch (e) {
      setList({
        loading: false,
        items: [],
        myIds: [],
        error: adminError(e, 'Couldn’t load messages.'),
      });
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const conv = list.items.find((c) => c.id === openId);
  return (
    <AdminPanel label="Messages" title={conv ? null : 'Messages'} onClose={onClose} width={420}>
      {conv ? (
        <Thread
          conv={conv}
          myIds={[...new Set([...list.myIds, ...(myUserId ? [String(myUserId)] : [])])]}
          onBack={() => {
            setOpenId(null);
            load();
          }}
        />
      ) : list.loading ? (
        <p className="m-0 px-[18px] py-[24px] text-[14px] text-[#595959]">Loading…</p>
      ) : list.error ? (
        <p className="m-0 px-[18px] py-[24px] text-[14px] text-[#902b20]">
          {list.error} <PanelLink onClick={load}>Try again</PanelLink>
        </p>
      ) : !list.items.length ? (
        <p className="m-0 px-[18px] py-[28px] text-center text-[14px] text-[#595959]">
          No conversations yet. Messages people send you appear here.
        </p>
      ) : (
        <ul className="m-0 list-none p-[8px]">
          {list.items.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setOpenId(c.id)}
                className="flex w-full cursor-pointer items-start gap-[10px] rounded-[12px] border-0 bg-transparent px-[10px] py-[10px] text-left font-sans hover:bg-[#f6f8f5] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]"
              >
                <span
                  aria-hidden="true"
                  className="grid size-[34px] shrink-0 place-items-center rounded-full bg-[#ebf1ec] text-[12px] font-bold text-[#2a5730]"
                >
                  {String(c.title || '?')
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join('')}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="flex items-baseline justify-between gap-[8px]">
                    <span
                      className={classNames(
                        'truncate text-[14px]',
                        c.unreadCount ? 'font-bold' : 'font-semibold'
                      )}
                    >
                      {c.title}
                    </span>
                    <span className="shrink-0 text-[12px] text-[#8a8a85]">
                      {ago(c.lastMessageAt)}
                    </span>
                  </span>
                  <span className="text-[12px] text-[#8a8a85]">
                    {(c.withWhom || [])
                      .map((w) => TYPE_LABEL[w.entityType] || w.entityType)
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                  <span
                    className={classNames(
                      'line-clamp-1 text-[13px]',
                      c.unreadCount ? 'text-[#1c2a21]' : 'text-[#595959]'
                    )}
                  >
                    {c.lastMessage || 'No messages yet'}
                  </span>
                </span>
                {c.unreadCount ? (
                  <span className="mt-[4px] grid h-[20px] min-w-[20px] place-items-center rounded-full bg-[#c0392b] px-[6px] text-[11px] font-bold text-white">
                    <span className="sr-only">Unread: </span>
                    {c.unreadCount}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
};

export default AdminMessagesPanel;
