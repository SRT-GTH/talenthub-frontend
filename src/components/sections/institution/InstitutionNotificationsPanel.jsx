import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../services/notifications.api.js';
import AdminPanel, { PanelLink } from '../admin/chrome/AdminPanel.jsx';
import { ago } from '../admin/chrome/chromeTime.js';
import { INSTITUTION_BASE } from './institutionNav.js';

const log = debug('InstitutionNotificationsPanel');

/*
 * InstitutionNotificationsPanel — ?modal=notifications, opened by the bell of the institution top bar (phone and desktop). The staff member's
 * own notifications (GET /api/notifications: student replies, accreditation decisions, record submissions …), All / Unread. Opening a row marks
 * it read and goes to its page: portal links as they are; a student's reply (/messages/:conversation, the talent inbox route) opens the portal's
 * Messages. "Mark all read" clears the badge (the session is reloaded so the bell count follows). Shares the admin top-bar panel shell
 * (phone: full-width sheet under the 73px bar; desktop: card under the 87px bar). Props: onClose, onChanged (after a read).
 */

const idOf = (n) => n.id || n._id;

/** Where a notification leads inside the institution portal (null = nowhere to go). */
const portalLinkOf = (n) => {
  const url = n.actionUrl || n.data?.actionUrl || n.data?.link || '';
  if (url.startsWith(INSTITUTION_BASE)) return url;
  if (url.startsWith('/messages') || n.type === 'message') return `${INSTITUTION_BASE}/messages`;
  return null;
};

const InstitutionNotificationsPanel = ({ onClose, onChanged }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [state, setState] = useState({ loading: true, items: [], unread: 0, error: '' });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const r = await fetchNotifications({
        limit: 30,
        ...(tab === 'unread' ? { isRead: false } : {}),
      });
      log('loaded', { tab, count: r.items.length, unread: r.unreadCount });
      setState({ loading: false, items: r.items, unread: r.unreadCount, error: '' });
    } catch (e) {
      setState({
        loading: false,
        items: [],
        unread: 0,
        error:
          e?.response?.status === 401
            ? 'Sign in again to see notifications.'
            : 'Couldn’t load notifications.',
      });
    }
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const open = async (n) => {
    if (!n.isRead) {
      setState((s) => ({
        ...s,
        unread: Math.max(0, s.unread - 1),
        items: s.items.map((x) => (idOf(x) === idOf(n) ? { ...x, isRead: true } : x)),
      }));
      try {
        await markNotificationRead(idOf(n));
      } catch (e) {
        log.error('mark read failed', e?.response?.status || e?.message);
      } finally {
        onChanged?.();
      }
    }
    const to = portalLinkOf(n);
    if (to) {
      onClose();
      navigate(to);
    }
  };

  const markAll = async () => {
    setState((s) => ({ ...s, unread: 0, items: s.items.map((x) => ({ ...x, isRead: true })) }));
    try {
      await markAllNotificationsRead();
    } catch (e) {
      log.error('mark all failed', e?.response?.status || e?.message);
    } finally {
      onChanged?.();
      if (tab === 'unread') load();
    }
  };

  return (
    <AdminPanel
      label="Notifications"
      title="Notifications"
      onClose={onClose}
      width={400}
      className="lg:top-[88px]"
      actions={state.unread ? <PanelLink onClick={markAll}>Mark all read</PanelLink> : null}
    >
      <div role="tablist" aria-label="Show" className="flex gap-[6px] px-[18px] pt-[12px]">
        {[
          ['all', 'All'],
          ['unread', `Unread${state.unread ? ` (${state.unread})` : ''}`],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={classNames(
              'h-[30px] cursor-pointer rounded-full border border-solid px-[12px] font-sans text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              tab === id
                ? 'border-[#387440] bg-[#ebf1ec] text-[#2a5730]'
                : 'border-[#e1e1dd] bg-white text-[#595959]'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {state.loading ? (
        <p aria-busy="true" className="m-0 px-[18px] py-[24px] text-[14px] text-[#595959]">
          Loading…
        </p>
      ) : state.error ? (
        <p role="alert" className="m-0 px-[18px] py-[24px] text-[14px] text-[#902b20]">
          {state.error} <PanelLink onClick={load}>Try again</PanelLink>
        </p>
      ) : !state.items.length ? (
        <p className="m-0 px-[18px] py-[28px] text-center text-[14px] text-[#595959]">
          {tab === 'unread' ? 'You’re all caught up.' : 'No notifications yet.'}
        </p>
      ) : (
        <ul className="m-0 list-none p-[8px]">
          {state.items.map((n) => (
            <li key={idOf(n)}>
              <button
                type="button"
                onClick={() => open(n)}
                className={classNames(
                  'flex w-full cursor-pointer gap-[10px] rounded-[12px] border-0 px-[10px] py-[10px] text-left font-sans hover:bg-[#f6f8f5] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                  n.isRead ? 'bg-transparent' : 'bg-[#f3f8f3]'
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    'mt-[6px] size-[8px] shrink-0 rounded-full',
                    n.isRead ? 'bg-transparent' : 'bg-[#387440]'
                  )}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="text-[14px] leading-[20px] font-semibold text-[#1c2a21]">
                    {n.title}
                  </span>
                  <span className="line-clamp-2 text-[13px] leading-[18px] text-[#595959]">
                    {n.message}
                  </span>
                  <span className="text-[12px] text-[#8a8a85]">
                    {ago(n.createdAt)}
                    {n.isRead ? '' : ' · new'}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </AdminPanel>
  );
};

export default InstitutionNotificationsPanel;
