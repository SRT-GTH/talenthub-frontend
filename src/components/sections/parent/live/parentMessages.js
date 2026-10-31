import { useEffect, useState } from 'react';
import { fetchUnreadMessages, MESSAGES_CHANGED } from '../../../../services/messages.api.js';

const POLL_MS = 60000;

/**
 * useParentUnreadMessages(live) — the top bar's messages badge: unread messages across the parent's conversations
 * (GET /talent-messages/unread-count). Polls every minute and refreshes when a thread is read or a message is sent
 * (MESSAGES_CHANGED). Demo frames pass live = false and keep the drawn count.
 */
export const useParentUnreadMessages = (live) => {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    if (!live) return undefined;
    let alive = true;
    const load = () =>
      fetchUnreadMessages()
        .then((n) => alive && setUnread(Number(n) || 0))
        .catch(() => {});
    load();
    const timer = setInterval(load, POLL_MS);
    window.addEventListener(MESSAGES_CHANGED, load);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener(MESSAGES_CHANGED, load);
    };
  }, [live]);
  return unread;
};
