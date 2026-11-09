import { useCallback, useEffect, useRef, useState } from 'react';
import { isRecruiterSession } from '../../../services/recruiterShell.api.js';
import {
  archiveConversation,
  fetchConversation,
  fetchConversations,
  markConversationRead,
  sendMessage,
  unarchiveConversation,
} from '../../../services/messages.api.js';
import { debug } from '../../../utils/debug.js';

const log = debug('useLiveRecruiterInbox');

/*
 * useLiveRecruiterInbox(selectedId) - the signed-in recruiter's conversations for /recruiter/messages.
 * Uses the participant-generic Messages API (backend talentMessages.service: /api/talent-messages/*), which
 * returns the conversations the signed-in user is in, whoever they are. Signed out -> { status: 'demo' }.
 *
 *   GET  /talent-messages/conversations                 rows (archived / removed ones are not returned)
 *   GET  /talent-messages/conversations/:id?withJob=false   the thread (polled every 10 s while open)
 *   POST /talent-messages/conversations/:id/messages    { text }
 *   POST /talent-messages/conversations/:id/read
 *   POST /talent-messages/conversations/:id/archive     (a reply from either side brings it back)
 *   GET  /talent-messages/conversations?folder=archived  the archived list
 *   POST /talent-messages/conversations/:id/unarchive   back to the inbox
 *
 * The backend's row is shaped for the talent's view ("role" is the recruiter's line), so the recruiter's
 * list line is built here from the linked job instead.
 */

const TZ = 'Africa/Accra';
const POLL_MS = 10000;

const timeLabel = (iso, now = new Date()) => {
  if (!iso) return '';
  const d = new Date(iso);
  const sameDay =
    d.toLocaleDateString('en-GB', { timeZone: TZ }) ===
    now.toLocaleDateString('en-GB', { timeZone: TZ });
  if (sameDay)
    return d.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });
  const days = (now - d) / 864e5;
  if (days < 2) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-GB', { timeZone: TZ, weekday: 'short' });
  return d.toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'short' });
};

const dayLabel = (iso, now = new Date()) => {
  const d = new Date(iso);
  const key = (x) => x.toLocaleDateString('en-GB', { timeZone: TZ });
  if (key(d) === key(now)) return 'Today';
  if (key(d) === key(new Date(now - 864e5))) return 'Yesterday';
  return d.toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
};

export const toItem = (row) => ({
  id: String(row.id),
  name: row.name || 'Talent',
  meta: row.jobTitle ? `Applicant · ${row.jobTitle}` : 'Talent',
  initials: row.initials || (row.name || '?').slice(0, 2).toUpperCase(),
  photo: row.avatarUrl || null,
  time: timeLabel(row.lastMessageAt),
  preview: row.previewFromMe && row.preview ? `You: ${row.preview}` : row.preview || '',
  unread: Number(row.unread) || 0,
  applicant: Boolean(row.jobTitle),
  // The list chip (STAGES): a job-linked conversation is an applicant; anyone else was messaged first.
  stage: row.jobTitle ? 'applicant' : 'invited',
  job: row.jobTitle || '',
  request: Boolean(row.request),
  live: true,
});

export const toThread = (messages = []) => {
  const groups = [];
  messages.forEach((m) => {
    const day = dayLabel(m.at);
    let g = groups[groups.length - 1];
    if (!g || g.day !== day) {
      g = { day, items: [] };
      groups.push(g);
    }
    g.items.push({
      kind: 'message',
      id: m.id,
      own: m.from === 'me',
      text: m.text,
      time: new Date(m.at).toLocaleTimeString('en-US', {
        timeZone: TZ,
        hour: 'numeric',
        minute: '2-digit',
      }),
      receipt: m.from === 'me' && m.status === 'read' ? 'Read' : '',
    });
  });
  return { groups };
};

export const useLiveRecruiterInbox = (selectedId) => {
  const live = isRecruiterSession();
  const [status, setStatus] = useState(live ? 'loading' : 'demo');
  const [items, setItems] = useState([]);
  const [archived, setArchived] = useState([]);
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const selectedRef = useRef(selectedId);
  selectedRef.current = selectedId;

  const loadList = useCallback(async () => {
    const out = await fetchConversations();
    const rows = Array.isArray(out?.conversations)
      ? out.conversations
      : Array.isArray(out)
        ? out
        : [];
    setItems(rows.map(toItem));
    // The archived folder loads alongside; a failure there never blocks the inbox.
    fetchConversations({ folder: 'archived' })
      .then((a) => setArchived((a?.conversations || []).map(toItem)))
      .catch((err) => log.warn('archived list failed:', err?.response?.status));
    return rows;
  }, []);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    const out = await fetchConversation(id, { withJob: false });
    if (selectedRef.current === id) setThread({ id, ...toThread(out?.messages || []) });
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    loadList()
      .then(() => alive && setStatus('live'))
      .catch((err) => {
        log.error('inbox failed:', err?.response?.status || err?.message);
        if (alive) setStatus('error');
      });
    return () => {
      alive = false;
    };
  }, [live, loadList]);

  // Open thread: load, mark read, poll.
  useEffect(() => {
    if (!live || !selectedId) return undefined;
    setThread(null);
    loadThread(selectedId)
      .then(() => markConversationRead(selectedId))
      .then(() =>
        setItems((prev) => prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c)))
      )
      .catch((err) => log.error('thread failed:', err?.response?.status || err?.message));
    const timer = setInterval(() => loadThread(selectedId).catch(() => null), POLL_MS);
    return () => clearInterval(timer);
  }, [live, selectedId, loadThread]);

  const send = useCallback(
    async (text) => {
      const body = String(text || '').trim();
      if (!body || !selectedRef.current) return false;
      setSending(true);
      setError(null);
      try {
        await sendMessage(selectedRef.current, body);
        await Promise.all([loadThread(selectedRef.current), loadList()]);
        return true;
      } catch (err) {
        const msg = err?.response?.data?.message || 'The message wasn’t sent. Please try again.';
        log.error('send failed:', err?.response?.status, msg);
        setError(msg);
        return false;
      } finally {
        setSending(false);
      }
    },
    [loadList, loadThread]
  );

  const archive = useCallback(
    async (id) => {
      try {
        await archiveConversation(id);
        await loadList();
        return true;
      } catch (err) {
        setError(err?.response?.data?.message || 'The conversation couldn’t be archived.');
        return false;
      }
    },
    [loadList]
  );

  const unarchive = useCallback(
    async (id) => {
      try {
        await unarchiveConversation(id);
        await loadList();
        return true;
      } catch (err) {
        setError(err?.response?.data?.message || 'The conversation couldn’t be moved back.');
        return false;
      }
    },
    [loadList]
  );

  return {
    status,
    items,
    archived,
    thread,
    error,
    sending,
    send,
    archive,
    unarchive,
    clearError: () => setError(null),
  };
};
