import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../../services/notifications.api.js';
import { countsChanged } from '../../../../services/adminChrome.api.js';
import AdminPanel, { PanelLink } from './AdminPanel.jsx';
import { ago } from './chromeTime.js';

/*
 * AdminNotificationsPanel — the staff member's own notifications (GET /api/notifications: staff invites, permission
 * audits, community issues, secret rotation, affiliation requests …). All / Unread; a row marks itself read and opens
 * its link when the link is an admin page; "Mark all read" clears the badge. Empty and error states say so.
 */
const idOf = (n) => n.id || n._id;

const AdminNotificationsPanel = ({ onClose }) => {
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
      } finally {
        countsChanged();
      }
    }
    const url = n.actionUrl || n.data?.actionUrl || n.data?.link || null;
    if (url && url.startsWith('/admin')) {
      onClose();
      navigate(url);
    }
  };
  const markAll = async () => {
    setState((s) => ({ ...s, unread: 0, items: s.items.map((x) => ({ ...x, isRead: true })) }));
    try {
      await markAllNotificationsRead();
    } finally {
      countsChanged();
      if (tab === 'unread') load();
    }
  };

  return (
    <AdminPanel
      label="Notifications"
      title="Notifications"
      onClose={onClose}
      width={400}
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
              'h-[30px] cursor-pointer rounded-full border border-solid px-[12px] font-sans text-[13px] font-semibold',
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
        <p className="m-0 px-[18px] py-[24px] text-[14px] text-[#595959]">Loading…</p>
      ) : state.error ? (
        <p className="m-0 px-[18px] py-[24px] text-[14px] text-[#902b20]">
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

export default AdminNotificationsPanel;
