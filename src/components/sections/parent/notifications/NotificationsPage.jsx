import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import UnderlineTabs from '../../../ui/UnderlineTabs.jsx';
import ParentButton from '../ParentButton.jsx';
import NotificationRow from './NotificationRow.jsx';
import { PAGE } from './data/notificationsData.js';
import { useNotificationsState } from './notificationsState.js';

const log = debug('NotificationsPage');

/*
 * NotificationsPage — PN-04 "Notifications · All (page)" (Figma 10043:1351), the body of /parent/notifications (the route supplies the chrome): title 34/600 + "4 new" sticker, five tabs with counts
 * (the active tab's chip is amber), two cards of rows ("Today", "This week": 24 padding, r24, hairline #e7e7e7) and, on the right (360 wide), the mint "Where you get these" card with "Notification settings".
 * URL: `?tab=` picks a tab (frame PN-04 is All). ⚠️ ASSUMPTION: the other tabs are not drawn; they list the drawn rows of that type (counts stay as Figma prints them).
 * ⚠️ ASSUMPTION: "Notification settings" only logs (the settings screen is a later canvas).
 */
const CARD =
  'flex flex-col gap-[12px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[24px] shadow-[0_5px_17px_rgba(28,42,33,0.03)]';

const NotificationsPage = () => {
  const { tab } = useNotificationsState();

  const groups = PAGE.groups
    .map((g) => ({ ...g, rows: tab === 'all' ? g.rows : g.rows.filter((r) => r.kind === tab) }))
    .filter((g) => g.rows.length > 0);

  useEffect(() => {
    log('render', { tab, rows: groups.reduce((n, g) => n + g.rows.length, 0) });
  }, [tab, groups]);

  const tabs = PAGE.tabs.map((t) => ({
    id: t.id,
    label: t.label,
    count: t.count,
    countTone: t.id === tab ? 'amber' : 'mint',
    to: t.id === 'all' ? '/parent/notifications' : `/parent/notifications?tab=${t.id}`,
    onClick: () => log('tab', t.id),
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <div className="flex flex-wrap items-center gap-[12px]">
        <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21]">
          {PAGE.title}
        </h1>
        <span className="rounded-full bg-brand-green-light px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
          {PAGE.newSticker}
        </span>
      </div>

      <div className="flex flex-col gap-[20px]">
        <UnderlineTabs tabs={tabs} activeId={tab} label={PAGE.tabsLabel} />
        <div className="flex items-start gap-[24px] max-lg:flex-col">
          <div className="flex min-w-0 flex-1 flex-col gap-[20px] max-lg:w-full">
            {groups.map((g) => (
              <section key={g.id} aria-label={g.label} className={CARD}>
                <h2 className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[0.88px] text-[#575755] uppercase max-lg:text-[12px]">
                  {g.label}
                </h2>
                <div className="flex flex-col gap-[12px]">
                  {g.rows.map((row, i) => (
                    <NotificationRow key={row.id} row={row} isLast={i === g.rows.length - 1} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="flex w-[360px] max-w-full shrink-0 flex-col gap-[12px] rounded-[24px] bg-[#ebf1ec] p-[22px] font-sans max-lg:w-full">
            <h2 className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {PAGE.where.title}
            </h2>
            <p className="m-0 text-[12.5px] leading-[18px] text-[#575755]">{PAGE.where.body}</p>
            <div>
              <ParentButton
                variant="secondary"
                to="/parent/settings?tab=notifications"
                onClick={() => log('notification settings')}
              >
                {PAGE.where.settings}
              </ParentButton>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
