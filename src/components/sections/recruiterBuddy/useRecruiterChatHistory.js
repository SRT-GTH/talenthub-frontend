import { useCallback, useEffect, useMemo, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { currentEntityId, fetchHistory } from '../../../services/careerBuddy.api.js';
import { chatsFromHistory } from '../profileFilling/chatHistoryModel.js';

const log = debug('useRecruiterChatHistory');

/*
 * useRecruiterChatHistory — the history drawer on the live recruiter Career Buddy screen.
 * Same source as the talent screen: the agent's GET /career-buddy/history for the signed-in
 * account. Pin / rename / delete are kept in this browser (same key as the talent screen),
 * because the agent has no endpoint for them yet.
 *
 *   chats, loading         rows for CareerBuddyHistoryDrawer
 *   reload()               fetch again (the drawer calls it when it opens)
 *   messagesFor(id)        a past conversation as the screen's chat bubbles (read back, plain text)
 *   rename / togglePin / remove / clearAll
 */

const EMPTY_META = { pinned: {}, titles: {}, deleted: {} };

const readMeta = (key) => {
  if (!key) return EMPTY_META;
  try {
    return { ...EMPTY_META, ...(JSON.parse(localStorage.getItem(key)) || {}) };
  } catch {
    return EMPTY_META;
  }
};

export const useRecruiterChatHistory = ({ enabled, personaLabel }) => {
  const entityId = enabled ? currentEntityId() : null;
  const metaKey = entityId ? `careerBuddy.chatMeta.${entityId}` : null;
  const [sessions, setSessions] = useState(undefined); // undefined = loading
  const [meta, setMeta] = useState(() => readMeta(metaKey));
  const [activeId, setActiveId] = useState(null);

  const reload = useCallback(async () => {
    if (!entityId) return;
    const page = await fetchHistory(entityId, { limit: 30 });
    log('history', page?.sessions?.length ?? 'failed');
    setSessions(page ? page.sessions : []);
  }, [entityId]);

  useEffect(() => {
    if (enabled) reload();
  }, [enabled, reload]);

  const updateMeta = (fn) =>
    setMeta((prev) => {
      const next = fn(prev);
      try {
        if (metaKey) localStorage.setItem(metaKey, JSON.stringify(next));
      } catch {
        /* private mode: keep it for this visit */
      }
      return next;
    });

  const chats = useMemo(
    () => (enabled ? chatsFromHistory({ sessions: sessions || [], activeId, meta }) : []),
    [enabled, sessions, activeId, meta]
  );

  const messagesFor = (id) => {
    const session = (sessions || []).find((s) => s.id === id);
    if (!session) return null;
    setActiveId(id);
    const out = [];
    (session.turns || []).forEach((t, i) => {
      if (!t.opener && t.message) {
        out.push({ id: `h-${id}-${i}-u`, sender: 'user', text: t.message, personaLabel });
      }
      const reply = String(t.result?.reply ?? '').replace(/\*\*/g, '');
      if (reply) out.push({ id: `h-${id}-${i}-b`, sender: 'bot', text: reply });
    });
    return out;
  };

  return {
    chats,
    loading: Boolean(enabled) && sessions === undefined,
    reload,
    messagesFor,
    clearActive: () => setActiveId(null),
    rename: (id, title) => updateMeta((m) => ({ ...m, titles: { ...m.titles, [id]: title } })),
    togglePin: (id) =>
      updateMeta((m) => ({ ...m, pinned: { ...m.pinned, [id]: !m.pinned?.[id] } })),
    remove: (id) => updateMeta((m) => ({ ...m, deleted: { ...m.deleted, [id]: true } })),
    clearAll: () =>
      updateMeta((m) => ({
        ...m,
        deleted: Object.fromEntries((sessions || []).map((s) => [s.id, true])),
      })),
  };
};
