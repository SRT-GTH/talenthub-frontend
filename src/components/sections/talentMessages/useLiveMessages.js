import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { debug } from '../../../utils/debug.js';
import {
  acceptRequest,
  archiveConversation,
  declineRequest,
  deleteConversation,
  fetchConversation,
  fetchConversations,
  markConversationRead,
  muteConversation,
  notifyMessagesChanged,
  sendMessage,
  updateJobCard,
} from '../../../services/messages.api.js';
import { recordFromRow, threadFromApi } from './messagesLive.js';
import { messagesActions } from './messagesStore.js';

const log = debug('useLiveMessages');

/*
 * Live Talent Messages — one module-level cache shared by the inbox, thread and overlays (like useLiveStreak):
 *   rows     API inbox rows (services/messages.api.js)            threads { [id]: { messages, job } }
 *   loaded   the first inbox load finished                       error   last load error (string | null)
 * Polls the inbox every 20 s and the open conversation every 5 s while the tab is visible. Actions call the API and keep
 * the optimistic bits in messagesStore.js (sent bubbles, statuses, accepted / declined / removed / muted, card state).
 */
const INBOX_POLL_MS = 20000;
const THREAD_POLL_MS = 5000;

let cache = {
  rows: [],
  counts: { all: 0, unread: 0, requests: 0 },
  threads: {},
  loaded: false,
  error: null,
};
const listeners = new Set();
const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
const getSnapshot = () => cache;
const set = (patch) => {
  cache = { ...cache, ...patch };
  listeners.forEach((fn) => fn());
};

// Same wording as the backend's header chip (utils/talentMessages.js reChip), for a job that just changed here.
const reChipOf = (job, fallbackTitle) => {
  const title = job?.role || fallbackTitle;
  if (!title) return null;
  if (job.state === 'applied') return `Re: ${title} · Applied`;
  if (job.state === 'closed') return `Re: ${title} · Closed`;
  if (job.state === 'passed') return `Re: ${title} · Passed`;
  return job.matchPercent !== null && job.matchPercent !== undefined
    ? `Re: ${title} · ${job.matchPercent}% match`
    : `Re: ${title}`;
};

const errorText = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.error?.message ||
  err?.message ||
  'Something went wrong';

export const loadInbox = async () => {
  try {
    const data = await fetchConversations();
    // Inbox rows carry a plain "Re: <job>" chip; keep the fuller one (match / Applied…) of a job already loaded.
    const rows = (data?.conversations ?? []).map((r) => {
      const job = cache.threads[r.id]?.job;
      return job ? { ...r, reChip: reChipOf(job, r.jobTitle) } : r;
    });
    set({
      rows,
      counts: data?.counts ?? cache.counts,
      loaded: true,
      error: null,
    });
  } catch (err) {
    log('inbox failed', errorText(err));
    set({ loaded: true, error: errorText(err) });
  }
};

export const loadThread = async (id) => {
  if (!id) return;
  try {
    // The job card (with its match score) is fetched once; later polls only bring new messages.
    const known = cache.threads[id];
    const withJob = !known || known.job === undefined;
    const data = await fetchConversation(id, { withJob });
    const job = withJob ? (data?.job ?? null) : known.job;
    set({ threads: { ...cache.threads, [id]: { messages: data?.messages ?? [], job } } });
    if (data?.conversation) {
      set({ rows: cache.rows.map((r) => (r.id === id ? { ...r, ...data.conversation } : r)) });
    }
  } catch (err) {
    log('thread failed', id, errorText(err));
  }
};

const visible = () => typeof document === 'undefined' || document.visibilityState === 'visible';

const usePoll = (fn, ms, key, enabled) => {
  useEffect(() => {
    if (!enabled) return undefined;
    fn();
    const t = window.setInterval(() => {
      if (visible()) fn();
    }, ms);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
};

const LiveMessagesContext = createContext(null);
export const LiveMessagesProvider = LiveMessagesContext.Provider;
export const useLiveMessagesContext = () => useContext(LiveMessagesContext);

/**
 * enabled: the signed-in talent's own inbox (not a drawn frame). activeId: the open conversation (polled + marked read).
 * Returns null when disabled, else { loaded, error, records, byId, counts, actions }.
 */
export const useLiveMessages = ({ enabled, activeId }) => {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  usePoll(loadInbox, INBOX_POLL_MS, 'inbox', enabled);
  usePoll(() => loadThread(activeId), THREAD_POLL_MS, activeId, Boolean(enabled && activeId));

  const records = useMemo(() => {
    if (!enabled) return [];
    const now = new Date();
    return snap.rows.map((row) => {
      const rec = recordFromRow(row, now);
      const t = snap.threads[row.id];
      return t ? { ...rec, job: t.job, thread: threadFromApi(t, now), threadLoaded: true } : rec;
    });
  }, [enabled, snap.rows, snap.threads]);

  const byId = useMemo(() => Object.fromEntries(records.map((r) => [r.id, r])), [records]);

  const markRead = useCallback(async (id) => {
    const row = cache.rows.find((r) => r.id === id);
    if (!row || !row.unread) return;
    set({ rows: cache.rows.map((r) => (r.id === id ? { ...r, unread: 0 } : r)) });
    try {
      await markConversationRead(id);
      notifyMessagesChanged();
    } catch (err) {
      log('read failed', errorText(err));
    }
  }, []);

  const send = useCallback(async (id, text, { retryOf } = {}) => {
    const localId = retryOf ?? messagesActions.send(id, text, { online: false });
    if (!localId) return;
    if (retryOf) messagesActions.setStatus(retryOf, 'sending');
    try {
      await sendMessage(id, text);
      // The server copy replaces the optimistic bubble once the thread reloads.
      await Promise.all([loadThread(id), loadInbox()]);
      messagesActions.dropSent(id, localId);
    } catch (err) {
      log('send failed', errorText(err));
      messagesActions.setStatus(localId, 'failed');
    }
  }, []);

  const run = useCallback(async (label, fn, after) => {
    try {
      const out = await fn();
      await loadInbox();
      after?.(out);
      return out;
    } catch (err) {
      log(`${label} failed`, errorText(err));
      return null;
    }
  }, []);

  const actions = useMemo(
    () => ({
      markRead,
      send,
      retry: (id, msg) => send(id, msg.text, { retryOf: msg.id }),
      accept: (id) => {
        messagesActions.accept(id);
        return run('accept', () => acceptRequest(id));
      },
      decline: (id, opts) => {
        messagesActions.decline(id);
        return run('decline', () => declineRequest(id, opts));
      },
      toggleMute: (id, muted) => {
        set({ rows: cache.rows.map((r) => (r.id === id ? { ...r, muted } : r)) });
        return run('mute', () => muteConversation(id, muted));
      },
      archive: (id) => {
        messagesActions.remove(id);
        return run('archive', () => archiveConversation(id));
      },
      remove: (id) => {
        messagesActions.remove(id);
        return run('delete', () => deleteConversation(id));
      },
      job: async (id, action, reason) => {
        const job = await run('job', () => updateJobCard(id, action, reason));
        if (job) {
          const t = cache.threads[id] ?? { messages: [] };
          set({ threads: { ...cache.threads, [id]: { ...t, job } } });
          set({
            rows: cache.rows.map((r) =>
              r.id === id ? { ...r, reChip: reChipOf(job, r.jobTitle) } : r
            ),
          });
        }
        // Success or not, the card now follows the server (a failed apply must not stay "Applied").
        messagesActions.setCard(id, null);
        return job;
      },
      refresh: (id) => Promise.all([loadInbox(), id ? loadThread(id) : null]),
    }),
    [markRead, send, run]
  );

  if (!enabled) return null;
  return { loaded: snap.loaded, error: snap.error, records, byId, counts: snap.counts, actions };
};
