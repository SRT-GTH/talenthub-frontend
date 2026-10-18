import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import NotifButton from './NotifButton.jsx';
import NotificationRow from './NotificationRow.jsx';
import { useNotificationFeed } from './useNotificationFeed.js';
import { POPOVER_COPY, POPOVER_GROUPS, POPOVER_TABS } from './notificationsData.js';
import iconCheck from '../../../assets/notifications/icons/action-check.svg';
import iconExpand from '../../../assets/notifications/icons/action-expand.svg';
import iconSettings from '../../../assets/notifications/icons/footer-settings.svg';
import iconFooterExpand from '../../../assets/notifications/icons/footer-expand.svg';
import doodleSparkleGold from '../../../assets/notifications/icons/doodle-sparkle-gold.svg';
import doodleRing from '../../../assets/notifications/icons/doodle-ring.svg';
import doodleSparkleWhite from '../../../assets/notifications/icons/doodle-sparkle-white.svg';
import doodleSquiggle from '../../../assets/notifications/icons/doodle-squiggle.svg';
import emptyBell from '../../../assets/notifications/illustrations/empty-popover-bell.svg';

const log = debug('NotificationPopover');

/*
 * NotificationPopover — Figma "GTH · Notification pop-up" (7471:54994; states N-01..N-04, Focused
 * twins 8110:662…). Anchored under the top-nav bell: right edge ≈ bell right + 8px, top = nav
 * bottom − 14px (Figma: popover top 126 vs nav bottom 140). Width 440, radius 24.
 *
 *   mode "open"     populated list (N-01); `tip` shows the "Open full view ⇧ N" tooltip (N-02)
 *   mode "empty"    "You're all caught up" (N-03), header sticker reads "chill mode"
 *   mode "loading"  4 skeleton rows (N-04)
 *
 * Playful = ink border + shelf shadow + yellow sticker + doodles + Bricolage title; Focused =
 * hairline border, soft shadow, mint sticker, SF Pro title, no doodles (diff of 7471:54715/8110:662).
 * Keyboard: Esc closes, ⇧N opens the full screen (as the tooltip promises).
 *
 * Props: home (useTalentHomeState object), anchorRef (bell wrapper element ref).
 */
const TAB_TYPES = { jobs: 'jobs', messages: 'messages' };

const Sticker = ({ children, className, tone = 'gold' }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-[10px] py-[3px] font-sans text-[12px] font-bold leading-[16px]',
      // gold = "N new" (yellow in both styles, hairline vs ink border); white = "chill mode" (white + hairline in Focused)
      tone === 'white'
        ? 'border border-solid border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21]'
        : 'border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21]',
      'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:py-[4px] playful:leading-[17px] playful:shadow-[2px_2px_0_#1c2a21]',
      className
    )}
  >
    {children}
  </span>
);

const HeaderButton = ({ label, icon, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="relative flex size-[36px] items-center justify-center rounded-full border border-solid border-[#224626] bg-white playful:border-[1.2px] playful:shadow-[2px_2px_0_#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    <img src={icon} alt="" className="size-[16px]" />
    {children}
  </button>
);

const SkeletonRow = ({ tint, short }) => (
  <div className="flex gap-[12px] py-[8px]" aria-hidden="true">
    <span className="size-[44px] shrink-0 rounded-full bg-[#eeeeea]" />
    <div className="flex flex-1 flex-col gap-[8px] pt-[4px]">
      <span className="h-[12px] w-[280px] max-w-full rounded-[6px]" style={{ background: tint }} />
      <span className="h-[10px] w-[198px] max-w-full rounded-[6px]" style={{ background: tint }} />
      <span
        className="h-[10px] rounded-[6px]"
        style={{ background: tint, width: short ? 99 : 148 }}
      />
    </div>
  </div>
);

const NotificationPopover = ({ home, anchorRef }) => {
  const mode = home?.notif;
  const navigate = useNavigate();
  const ref = useRef(null);
  const feed = useNotificationFeed({ startRead: Boolean(home?.readAll) });
  const [tab, setTab] = useState('all');
  const [pos, setPos] = useState({ top: 74, right: 24 });

  const close = () => {
    log('close');
    home.update({ notif: null, tip: null });
  };
  const openFull = () => {
    log('open full view');
    home.update({ notif: null, tip: null });
    navigate('/notifications');
  };

  // Anchor under the bell (Figma geometry above); re-measure on resize.
  useLayoutEffect(() => {
    if (!mode) return undefined;
    const place = () => {
      const bell = anchorRef?.current?.getBoundingClientRect();
      const bar = anchorRef?.current?.closest('header')?.getBoundingClientRect();
      if (!bell || !bar) return;
      const next = {
        // Measured against Figma 7471:54994 (x 910 / y 126-52): top = nav bottom − 17, right = bell right − 4
        top: bar.bottom - 17,
        right: Math.max(12, window.innerWidth - bell.right - 12),
      };
      log('position', next);
      setPos(next);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [mode, anchorRef]);

  useEffect(() => {
    if (!mode) return undefined;
    log('mount', { mode, tip: home.notifTip });
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    const onDown = (e) => {
      const inside = ref.current?.contains(e.target);
      const onBell = anchorRef?.current?.contains(e.target);
      if (!inside && !onBell) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'n' && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault();
        log('⇧N → full screen');
        navigate('/notifications');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  if (!mode) return null;

  const empty = mode === 'empty';
  const loading = mode === 'loading';
  const visible = (tab === 'all' ? feed.select('all') : feed.select(TAB_TYPES[tab] ?? tab)).filter(
    (n) => n.popover !== false
  );
  const unreadTab = tab === 'unread';
  const items = unreadTab ? feed.select('unread').filter((n) => n.popover !== false) : visible;
  const unreadLabel = feed.unreadCount > 0 ? String(feed.unreadCount) : null;
  const showNew = !empty && feed.unreadCount > 0;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Notifications"
      className={classNames(
        'fixed z-50 flex w-[440px] max-w-[calc(100vw-24px)] flex-col rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
        'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
        (empty || loading) && 'gap-[8px]'
      )}
      style={{ top: pos.top, right: pos.right }}
    >
      {home.notifTip && (
        <span
          role="tooltip"
          className="absolute -right-[2px] -top-[10px] z-10 inline-flex items-center gap-[8px] whitespace-nowrap rounded-[10px] bg-[#1c2a21] px-[12px] py-[8px] font-sans text-[12.5px] font-semibold leading-[15px] text-white"
        >
          {POPOVER_COPY.tooltip.label}
          <span className="rounded-[6px] bg-[rgba(255,255,255,0.16)] px-[6px] py-[2px] text-[11px] font-bold leading-[13px]">
            {POPOVER_COPY.tooltip.keys}
          </span>
        </span>
      )}

      {/* header */}
      <div className="relative flex shrink-0 items-start gap-[12px] overflow-hidden rounded-t-[22px] bg-[#ebf1ec] px-[20px] pb-[16px] pt-[20px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <div className="flex items-center gap-[10px]">
            <h2 className="m-0 font-sans text-[27px] font-semibold leading-[32px] text-[#1c2a21] playful:font-heading">
              {POPOVER_COPY.title}
            </h2>
            {empty && <Sticker tone="white">{POPOVER_COPY.emptySticker}</Sticker>}
            {showNew && !loading && <Sticker>{`${feed.unreadCount} new`}</Sticker>}
          </div>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
            {empty ? POPOVER_COPY.emptySubtitle : POPOVER_COPY.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 gap-[8px] pt-[8px]">
          <HeaderButton label="Mark all read" icon={iconCheck} onClick={feed.markAllRead} />
          <HeaderButton label="Expand to full view" icon={iconExpand} onClick={openFull} />
        </div>
        {/* doodles are Playful-only (hidden in the Focused frames) */}
        <img
          src={doodleSparkleGold}
          alt=""
          aria-hidden="true"
          className="absolute left-[262px] top-[12px] hidden size-[18px] playful:block"
        />
        <img
          src={doodleRing}
          alt=""
          aria-hidden="true"
          className="absolute left-[300px] -top-[18px] hidden size-[46px] playful:block"
        />
        <img
          src={doodleSparkleWhite}
          alt=""
          aria-hidden="true"
          className="absolute left-[288px] top-[48px] hidden size-[10px] playful:block"
        />
      </div>

      {/* tabs */}
      <div
        role="tablist"
        aria-label="Filter notifications"
        className="flex shrink-0 gap-[8px] px-[20px] pb-[10px] pt-[14px]"
      >
        {POPOVER_TABS.map((t) => {
          const active = tab === t.id;
          const count = t.id === 'unread' && !empty && !loading ? unreadLabel : null;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={classNames(
                'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                active
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {t.label}
              {count && (
                <span className="rounded-full bg-[#c8951a] px-[7px] py-px text-[11px] font-bold leading-[13px] text-white max-lg:text-[12px]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* body */}
      {loading ? (
        <div
          aria-busy="true"
          aria-label="Loading notifications"
          className="flex flex-col gap-[8px] px-[20px] pb-[16px] pt-[12px]"
        >
          <SkeletonRow tint="#e7e7e7" />
          <SkeletonRow tint="#e1eae2" short />
          <SkeletonRow tint="#e7e7e7" />
          <SkeletonRow tint="#e7e7e7" short />
        </div>
      ) : empty ? (
        <div className="flex flex-col items-center gap-[10px] px-[32px] py-[28px] text-center">
          <img src={emptyBell} alt="" aria-hidden="true" className="size-[110px]" />
          <h3 className="m-0 font-sans text-[22px] font-semibold leading-[28px] text-[#1c2a21] playful:font-heading">
            {POPOVER_COPY.empty.title}
          </h3>
          <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">
            {POPOVER_COPY.empty.body}
          </p>
          <div className="flex h-[51px] items-center gap-[8px]">
            <NotifButton size="xs" tone="primary" onClick={() => navigate('/home')}>
              {POPOVER_COPY.empty.primary}
            </NotifButton>
            <NotifButton size="xs" tone="secondary" onClick={openFull}>
              {POPOVER_COPY.empty.secondary}
            </NotifButton>
          </div>
        </div>
      ) : (
        <div className="relative">
          <ul className="m-0 flex h-[480px] flex-col gap-[12px] overflow-y-auto p-0 px-[8px] pb-[8px]">
            {POPOVER_GROUPS.map((g) => {
              const rows = items.filter((n) => n.group === g.id);
              if (!rows.length) return null;
              return (
                <li key={g.id} className="list-none">
                  <div className="flex items-center gap-[8px] px-[12px] pb-[4px] pt-[10px]">
                    <span className="font-sans text-[12px] font-bold leading-[14px] text-[#737373]">
                      {g.label}
                    </span>
                    {g.id === 'today' && (
                      <img
                        src={doodleSquiggle}
                        alt=""
                        aria-hidden="true"
                        className="hidden h-[6px] w-[28px] playful:block"
                      />
                    )}
                  </div>
                  <ul className="m-0 flex flex-col gap-[12px] p-0">
                    {rows.map((n) => (
                      <NotificationRow
                        key={n.id}
                        item={n}
                        unread={feed.isUnread(n)}
                        onRead={feed.markRead}
                      />
                    ))}
                  </ul>
                </li>
              );
            })}
            {items.length === 0 && (
              <li className="list-none px-[12px] py-[24px] font-sans text-[13px] text-[#737373]">
                {POPOVER_COPY.empty.title}
              </li>
            )}
          </ul>
          {/* Figma "scroll fade" 437x56 at the list bottom */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[2px] bottom-0 h-[56px] bg-[linear-gradient(180deg,rgba(255,254,252,0)_0%,#fffefc_100%)]"
          />
        </div>
      )}

      {/* footer */}
      <div className="flex shrink-0 items-center justify-between gap-[8px] rounded-b-[22px] border-t border-solid border-[#e1eae2] pb-[14px] pl-[20px] pr-[16px] pt-[12px]">
        <button
          type="button"
          className="inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          onClick={() => log('settings (no destination yet)')}
        >
          <img src={iconSettings} alt="" aria-hidden="true" className="size-[15px]" />
          {POPOVER_COPY.settings}
        </button>
        <button
          type="button"
          onClick={openFull}
          className="inline-flex items-center gap-[8px] rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] py-[10px] pl-[18px] pr-[16px] font-sans text-[13.5px] font-semibold leading-[16px] text-white shadow-[0_4px_16px_rgba(28,42,33,0.06),0_1px_2px_rgba(28,42,33,0.04)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {POPOVER_COPY.seeEverything}
          <img src={iconFooterExpand} alt="" aria-hidden="true" className="size-[14px]" />
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;
