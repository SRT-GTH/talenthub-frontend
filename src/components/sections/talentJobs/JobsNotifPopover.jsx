import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import NotificationRow from '../notifications/NotificationRow.jsx';
import { POPOVER_COPY, POPOVER_GROUPS, POPOVER_TABS } from '../notifications/notificationsData.js';
import iconCheck from '../../../assets/notifications/icons/action-check.svg';
import iconExpand from '../../../assets/notifications/icons/action-expand.svg';
import iconSettings from '../../../assets/notifications/icons/footer-settings.svg';
import iconFooterExpand from '../../../assets/notifications/icons/footer-expand.svg';
import doodleSparkleGold from '../../../assets/notifications/icons/doodle-sparkle-gold.svg';
import doodleRing from '../../../assets/notifications/icons/doodle-ring.svg';
import doodleSparkleWhite from '../../../assets/notifications/icons/doodle-sparkle-white.svg';
import doodleSquiggle from '../../../assets/notifications/icons/doodle-squiggle.svg';
import { FOCUS_RING, HEADING, INK_CHIP, useAnchor, useMount } from './jobsDialogUtils.js';
import { JOB_DIALOGS } from './talentJobsData.js';

const log = debug('JobsNotifPopover');

const TAB_TYPES = { jobs: ['matches', 'interview', 'profileView'], messages: ['message'] };

// Same anchor maths as NotificationPopover (Figma 7471:54994 = 7508:1338: 440 wide at x910, top 126):
// top = nav bottom − 17, right = bell right − 12.
const measureBell = () => {
  const bell = document.querySelector('header button[aria-label^="Notifications"]');
  const bar = bell?.closest('header');
  if (!bell || !bar) return null;
  const bellRect = bell.getBoundingClientRect();
  const barBottom = bar.getBoundingClientRect().bottom;
  // The bell is not in the phone header: hang the pop-up under the bar, 12px from the edge.
  if (bellRect.width === 0) return { top: barBottom + 8, right: 12 };
  return { top: barBottom - 17, right: Math.max(12, window.innerWidth - bellRect.right - 12) };
};

const HeaderButton = ({ label, icon, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={classNames(
      'flex size-[36px] items-center justify-center rounded-full border border-solid border-[#224626] bg-white playful:border-[1.2px] playful:shadow-[2px_2px_0_#1c2a21]',
      FOCUS_RING
    )}
  >
    <img src={icon} alt="" className="size-[16px]" />
  </button>
);

/*
 * JobsNotifPopover — J-08 "notification doc" (Playful 7508:1338 / Focused 8110:413268): the Notifications
 * pop-up opened over the Matched list, populated with job-match rows (`JOB_DIALOGS.notifications`).
 * Same chrome as notifications/NotificationPopover.jsx (440px, r24, header tint, tabs, 480px list,
 * footer) and the same NotificationRow; only the rows differ. Playful = doodles + Bricolage + hard
 * shadow; Focused = hairline + SF Pro + "pts". Mock only: row actions mark the row read.
 */
const JobsNotifPopover = ({ jobs }) => {
  const uid = useId();
  const ref = useRef(null);
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [readIds, setReadIds] = useState(() => new Set());
  const [allRead, setAllRead] = useState(false);
  const pos = useAnchor(measureBell);
  const close = useCallback(() => jobs.update({ modal: null }), [jobs]);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: close,
    initialFocus: () => ref.current,
    lockScroll: false,
  });
  useMount('JobsNotifPopover');

  useEffect(() => {
    log('tab', tab);
  }, [tab]);

  const items = JOB_DIALOGS.notifications.items;
  const isUnread = (n) => Boolean(n.unread) && !allRead && !readIds.has(n.id);
  const visible = items.filter((n) => {
    if (tab === 'unread') return isUnread(n);
    if (TAB_TYPES[tab]) return TAB_TYPES[tab].includes(n.type);
    return true;
  });

  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        tabIndex={-1}
        className={classNames(
          'fixed flex w-[440px] max-w-[calc(100vw-24px)] flex-col rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#fffefc] outline-none shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]',
          'overflow-y-auto',
          'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]'
        )}
        style={{
          outline: 'none',
          top: pos?.top ?? 74,
          right: pos?.right ?? 24,
          maxHeight: `calc(100dvh - ${pos?.top ?? 74}px - 12px)`,
        }}
      >
        <div className="relative flex shrink-0 items-start gap-[12px] overflow-hidden rounded-t-[22px] bg-[#ebf1ec] px-[20px] pb-[16px] pt-[20px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <div className="flex items-center gap-[10px]">
              <h2
                id={`${uid}-title`}
                className={classNames(
                  HEADING,
                  'm-0 text-[27px] font-semibold leading-[32px] text-[#1c2a21]'
                )}
              >
                {POPOVER_COPY.title}
              </h2>
              {!allRead && (
                <span
                  className={classNames(
                    'inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] px-[10px] py-[3px] font-sans text-[12px] font-bold leading-[16px] text-[#1c2a21]',
                    'playful:-rotate-[6deg] playful:py-[4px] playful:leading-[17px]',
                    INK_CHIP
                  )}
                >
                  {POPOVER_COPY.newSticker}
                </span>
              )}
            </div>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
              {POPOVER_COPY.subtitle}
            </p>
          </div>
          <div className="flex shrink-0 gap-[8px] pt-[8px]">
            <HeaderButton
              label="Mark all read"
              icon={iconCheck}
              onClick={() => {
                log('mark all read');
                setAllRead(true);
              }}
            />
            <HeaderButton
              label="Expand to full view"
              icon={iconExpand}
              onClick={() => {
                close();
                navigate('/notifications');
              }}
            />
          </div>
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

        <div
          role="tablist"
          aria-label="Filter notifications"
          className="flex shrink-0 gap-[8px] px-[20px] pb-[10px] pt-[14px] max-sm:flex-wrap"
        >
          {POPOVER_TABS.map((t) => {
            const active = tab === t.id;
            const count = t.id === 'unread' && !allRead ? t.count : null;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={classNames(
                  'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px]',
                  FOCUS_RING,
                  active
                    ? 'border-[rgba(28,42,33,0.12)] bg-[#1c2a21] text-white playful:border-[#1c2a21]'
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

        <div className="relative">
          <ul className="m-0 flex h-[480px] max-h-[55dvh] flex-col gap-[12px] overflow-y-auto p-0 px-[8px] pb-[8px]">
            {POPOVER_GROUPS.map((g) => {
              const rows = visible.filter((n) => n.group === g.id);
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
                        unread={isUnread(n)}
                        onRead={(id) => setReadIds((prev) => new Set(prev).add(id))}
                      />
                    ))}
                  </ul>
                </li>
              );
            })}
            {visible.length === 0 && (
              <li className="list-none px-[12px] py-[24px] font-sans text-[13px] text-[#737373]">
                {POPOVER_COPY.empty.title}
              </li>
            )}
          </ul>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[2px] bottom-0 h-[56px] bg-[linear-gradient(180deg,rgba(255,254,252,0)_0%,#fffefc_100%)]"
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-[8px] rounded-b-[22px] border-t border-solid border-[#e1eae2] pb-[14px] pl-[20px] pr-[16px] pt-[12px]">
          <button
            type="button"
            className={classNames(
              'inline-flex items-center gap-[6px] font-sans text-[13px] font-medium leading-[16px] text-[#595959]',
              FOCUS_RING
            )}
            onClick={() => jobs.update({ modal: 'alerts' })}
          >
            <img src={iconSettings} alt="" aria-hidden="true" className="size-[15px]" />
            {POPOVER_COPY.settings}
          </button>
          <button
            type="button"
            onClick={() => {
              close();
              navigate('/notifications');
            }}
            className={classNames(
              'inline-flex items-center gap-[8px] rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] py-[10px] pl-[18px] pr-[16px] font-sans text-[13.5px] font-semibold leading-[16px] text-white shadow-[0_4px_16px_rgba(28,42,33,0.06),0_1px_2px_rgba(28,42,33,0.04)]',
              FOCUS_RING
            )}
          >
            {POPOVER_COPY.seeEverything}
            <img src={iconFooterExpand} alt="" aria-hidden="true" className="size-[14px]" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default JobsNotifPopover;
