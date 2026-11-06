import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../services/notifications.api.js';
import { SUPPORT_EMAIL } from './dataRequests/data/dataRequestsData.js';

const log = debug('AgencyChromePanels');

/*
 * AgencyChromePanels — the top-bar panels of the agency chrome, keyed on ?modal= (mounted by AgencyFrame):
 *   notifications  the signed-in user's in-app notifications (GET /notifications; data-request decisions, programme updates, ...),
 *                  "Mark all as read" (PUT /notifications/mark-all-read); a notice with a portal link opens it and is marked read.
 *   help           where to find the method, the MoU and data requests, and the agency support address.
 *   language       the portal is in English only for now (said plainly, nothing to switch).
 *   a11y           the keyboard shortcuts and display settings the portal follows.
 * A right-anchored card under the top bar (a full-width sheet on phones); Esc and an outside click close it and focus goes back to the opener.
 * Props: modal, onClose(), onUnread(n) (keeps the bell badge in step).
 */

const TITLES = {
  notifications: 'Notifications',
  help: 'Help',
  language: 'Language',
  a11y: 'Accessibility',
};

const ago = (iso) => {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso));
};

const LINK =
  'flex flex-col gap-[2px] rounded-[12px] px-[12px] py-[10px] text-inherit no-underline hover:bg-[#ebf1ec] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]';

const Notifications = ({ onClose, onUnread }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, items: [], unread: 0, error: '' });
  const load = () =>
    fetchNotifications({ limit: 20 })
      .then((r) => {
        setState({ loading: false, items: r.items, unread: r.unreadCount, error: '' });
        onUnread?.(r.unreadCount);
      })
      .catch((err) =>
        setState({
          loading: false,
          items: [],
          unread: 0,
          error: err?.response?.data?.message || err?.message || 'Could not load notifications.',
        })
      );
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openItem = async (n) => {
    const id = n._id || n.id;
    if (!n.isRead && id) await markNotificationRead(id).catch(() => null);
    const url = n.actionUrl || n.data?.actionUrl;
    if (url && url.startsWith('/agency')) {
      onClose();
      navigate(url);
    } else load();
  };
  const markAll = async () => {
    await markAllNotificationsRead().catch(() => null);
    load();
  };
  if (state.loading)
    return <p className="m-0 px-[12px] py-[8px] text-[14px] text-[#575755]">Loading…</p>;
  if (state.error)
    return (
      <p role="alert" className="m-0 px-[12px] py-[8px] text-[14px] text-[#902b20]">
        {state.error}
      </p>
    );
  return (
    <div className="flex flex-col gap-[8px]">
      {state.items.length ? (
        <>
          <div className="flex items-center justify-between px-[12px]">
            <span className="text-[13px] text-[#575755]">{state.unread} unread</span>
            {state.unread ? (
              <button
                type="button"
                onClick={markAll}
                className="cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-[#387440]"
              >
                Mark all as read
              </button>
            ) : null}
          </div>
          <ul className="m-0 flex max-h-[60vh] list-none flex-col gap-[2px] overflow-y-auto p-0">
            {state.items.map((n) => (
              <li key={n._id || n.id}>
                <button
                  type="button"
                  onClick={() => openItem(n)}
                  className={classNames(
                    LINK,
                    'w-full cursor-pointer border-0 text-left',
                    n.isRead ? 'bg-transparent' : 'bg-[#f3f8f4]'
                  )}
                >
                  <span className="text-[14px] leading-[18px] font-semibold text-[#1c2a21]">
                    {n.title}
                  </span>
                  {n.message ? (
                    <span className="text-[13px] leading-[17px] text-[#575755]">{n.message}</span>
                  ) : null}
                  <span className="text-[12px] text-[#959592]">{ago(n.createdAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="m-0 px-[12px] py-[8px] text-[14px] leading-[20px] text-[#575755]">
          No notifications yet. Decisions on your data requests and updates on your programmes show
          up here.
        </p>
      )}
    </div>
  );
};

const Help = ({ onClose }) => (
  <ul className="m-0 flex list-none flex-col gap-[2px] p-0">
    {[
      [
        '/agency/methodology',
        'How the numbers are counted',
        'Sources, the under-5 rule and definitions.',
      ],
      ['/agency/settings/mou', 'Your MoU and access', 'Data categories, limits and your DPO.'],
      ['/agency/data-requests', 'Data requests', 'Ask for a dataset and follow its review.'],
      ['/agency/settings/audit-log', 'Audit log', 'Every view, export and request, by person.'],
    ].map(([to, title, sub]) => (
      <li key={to}>
        <Link to={to} onClick={onClose} className={LINK}>
          <span className="text-[14px] font-semibold text-[#1c2a21]">{title}</span>
          <span className="text-[13px] text-[#575755]">{sub}</span>
        </Link>
      </li>
    ))}
    <li>
      <a href={`mailto:${SUPPORT_EMAIL}`} className={LINK}>
        <span className="text-[14px] font-semibold text-[#1c2a21]">Email GTH support</span>
        <span className="text-[13px] text-[#575755]">{SUPPORT_EMAIL}</span>
      </a>
    </li>
  </ul>
);

const Language = () => (
  <p className="m-0 px-[12px] py-[8px] text-[14px] leading-[20px] text-[#575755]">
    The agency portal is in English. Other languages are not available here yet.
  </p>
);

const Accessibility = () => (
  <ul className="m-0 flex list-none flex-col gap-[8px] px-[12px] py-[4px] text-[14px] leading-[20px] text-[#575755]">
    <li>
      <kbd className="font-sans font-semibold text-[#1c2a21]">Ctrl / ⌘ K</kbd> jumps to search.
    </li>
    <li>
      <kbd className="font-sans font-semibold text-[#1c2a21]">Esc</kbd> closes dialogs and menus;
      focus returns to where you were.
    </li>
    <li>Every chart has a table version for screen readers.</li>
    <li>
      Animations follow your device’s reduce-motion setting. Use browser zoom for larger text.
    </li>
  </ul>
);

const AgencyChromePanels = ({ modal, onClose, onUnread }) => {
  const ref = useRef(null);
  const opener = useRef(typeof document !== 'undefined' ? document.activeElement : null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    log('open', modal);
    ref.current?.focus();
    const close = () => {
      closeRef.current();
      window.requestAnimationFrame(() => opener.current?.focus?.());
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    const onDown = (e) => {
      // the top-bar button that opened the panel toggles it itself
      if (ref.current && !ref.current.contains(e.target) && !opener.current?.contains?.(e.target))
        close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [modal]);

  if (!TITLES[modal]) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={TITLES[modal]}
      tabIndex={-1}
      className="fixed top-[80px] right-[8px] left-[8px] z-50 flex max-h-[80vh] flex-col gap-[8px] rounded-[20px] border border-solid border-[#e7e7e7] bg-white p-[12px] font-sans shadow-[0_24px_64px_rgba(0,0,0,0.16)] outline-none sm:left-auto sm:w-[380px] lg:top-[92px] lg:right-[clamp(24px,3.24vw,56px)]"
    >
      <div className="flex items-center justify-between px-[12px] pt-[4px]">
        <h2 className="m-0 text-[18px] leading-[24px] font-semibold text-[#1c2a21]">
          {TITLES[modal]}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-[32px] cursor-pointer items-center justify-center rounded-full border-0 bg-[#f8fafc] text-[18px] text-[#387440] focus-visible:outline-2 focus-visible:outline-[#387440]"
        >
          ×
        </button>
      </div>
      {modal === 'notifications' ? <Notifications onClose={onClose} onUnread={onUnread} /> : null}
      {modal === 'help' ? <Help onClose={onClose} /> : null}
      {modal === 'language' ? <Language /> : null}
      {modal === 'a11y' ? <Accessibility /> : null}
    </div>
  );
};

export default AgencyChromePanels;
