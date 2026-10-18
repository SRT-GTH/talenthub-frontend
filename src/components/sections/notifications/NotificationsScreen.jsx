import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import NotifButton from './NotifButton.jsx';
import NotificationRow from './NotificationRow.jsx';
import { useNotificationFeed } from './useNotificationFeed.js';
import {
  COMING_UP,
  FEED_COPY,
  FILTERS,
  PAGE_GROUPS,
  PAGE_HEADER,
  PING_SETTINGS,
  QUIET_HOURS,
  RECAP,
} from './notificationsData.js';
import iconCollapse from '../../../assets/notifications/icons/action-collapse.svg';
import selectChevron from '../../../assets/notifications/icons/select-chevron.svg';
import pingSettings from '../../../assets/notifications/icons/ping-settings.svg';
import pingChevron from '../../../assets/notifications/icons/ping-chevron.svg';
import railMoon from '../../../assets/notifications/icons/rail-moon.svg';
import doodleSquiggle from '../../../assets/notifications/icons/doodle-squiggle.svg';
import headSparkle from '../../../assets/notifications/icons/head-sparkle.svg';
import headFlame from '../../../assets/notifications/icons/head-flame.svg';
import headDoodleGold from '../../../assets/notifications/icons/head-doodle-gold.svg';
import headDoodleGreen from '../../../assets/notifications/icons/head-doodle-green.svg';
import headDoodleSquiggle from '../../../assets/notifications/icons/head-doodle-squiggle.svg';
import headDoodleRing from '../../../assets/notifications/icons/head-doodle-ring.svg';
import weekSparkleA from '../../../assets/notifications/icons/week-sparkle-a.svg';
import weekSparkleB from '../../../assets/notifications/icons/week-sparkle-b.svg';
import inboxZero from '../../../assets/notifications/illustrations/inbox-zero.svg';

const log = debug('NotificationsScreen');

/*
 * NotificationsScreen — the content column of the full-screen Notifications page
 * (Figma N-05 7471:55841 / N-06 7471:56304, Focused twins 8110:1796 / 8110:2239; the "e" frames only
 * differ by the expanded sidebar, handled by the shell). Layout (1512px canvas): header strip,
 * then filter rail 248 | feed 1fr | right column 340, gap 24.
 *
 * Playful = Bricolage titles, ink borders + shelf shadows, yellow stickers, header decorations
 * (faces / "Seen by 9 recruiters" / streak / doodles) ; Focused = SF Pro titles, hairline borders,
 * mint stickers, no decorations, tighter rows (diff of 7471:55872 vs 8110:1807).
 *
 * Props: home (useTalentHomeState object). `home.filter` / `home.readAll` select the Figma states
 * (N-06 = filter=unread & everything read -> "inbox zero").
 */
const SHELF =
  'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]';

const Sticker = ({ tone = 'mint', children, className }) => (
  <span
    className={classNames(
      'inline-flex items-center rounded-full px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14px]',
      tone === 'gold' && 'bg-[#ebf1ec] text-[#1f4d26] playful:bg-[#ffd86b] playful:text-[#1c2a21]',
      tone === 'white' && 'bg-[#ebf1ec] text-[#1f4d26] playful:bg-white playful:text-[#1c2a21]',
      tone === 'mint' && 'bg-[#ebf1ec] text-[#1f4d26] playful:text-[#1c2a21]',
      'playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
      className
    )}
  >
    {children}
  </span>
);

const FilterRail = ({ active, onSelect, unreadCount, className }) => {
  const [quiet, setQuiet] = useState(true);
  return (
    <aside
      aria-label={FEED_COPY.railTitle}
      className={classNames(
        'flex flex-col gap-[12px] rounded-[24px] border border-solid border-[#e1eae2] bg-white px-[12px] py-[16px]',
        className
      )}
    >
      <span className="px-[8px] pb-[8px] pt-[4px] font-sans text-[12px] font-bold leading-[14px] text-[#737373]">
        {FEED_COPY.railTitle}
      </span>
      <nav className="flex flex-col gap-[12px] playful:gap-[12px]">
        {FILTERS.map((f) => {
          const on = active === f.id;
          const count = f.id === 'unread' ? String(unreadCount) : f.count;
          // Figma only ships white-on-dark for "All" and grey for the rest; the opposite state is
          // the same glyph recoloured with a filter (⚠️ ASSUMPTION — no active frame for the others).
          const whiteGlyph = f.id === 'all';
          const iconFilter = on
            ? whiteGlyph
              ? undefined
              : 'brightness(0) invert(1)'
            : whiteGlyph
              ? 'brightness(0) invert(0.6)'
              : undefined;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => onSelect(f.id)}
              className={classNames(
                'flex h-[38px] items-center gap-[10px] rounded-[14px] px-[12px] text-left font-sans text-[14px] leading-[17px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green playful:h-[40px]',
                on
                  ? 'bg-[#1c2a21] font-semibold text-white'
                  : 'font-medium text-[#959592] hover:bg-[#f4f7f4]'
              )}
            >
              <img
                src={f.icon}
                alt=""
                aria-hidden="true"
                className="size-[16px] shrink-0"
                style={{ filter: iconFilter }}
              />
              <span className="min-w-0 flex-1 truncate">{f.label}</span>
              <span
                className={classNames(
                  'rounded-full px-[8px] py-[2px] text-[11.5px] font-bold leading-[14px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]',
                  on
                    ? 'bg-[rgba(255,255,255,0.18)] text-white'
                    : f.hot
                      ? 'bg-[#c8951a] text-white'
                      : 'bg-[#ebf1ec] text-[#2d5d33]'
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>
      <hr className="m-0 h-px border-0 bg-[#e1eae2]" />
      <div className="flex flex-col gap-[8px] rounded-[16px] bg-[#faf4e8] p-[14px]">
        <div className="flex items-center gap-[8px]">
          <img src={railMoon} alt="" aria-hidden="true" className="size-[16px]" />
          <span className="flex-1 font-sans text-[13.5px] font-semibold leading-[16px] text-[#1c2a21]">
            {QUIET_HOURS.label}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={quiet}
            aria-label={QUIET_HOURS.label}
            onClick={() => setQuiet((q) => !q)}
            className={classNames(
              'relative h-[20px] w-[36px] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              quiet ? 'bg-[#387440]' : 'bg-[#c9c9c4]'
            )}
          >
            <span
              className={classNames(
                'absolute top-[2px] size-[16px] rounded-full bg-white transition-all',
                quiet ? 'left-[18px]' : 'left-[2px]'
              )}
            />
          </button>
        </div>
        <p className="m-0 font-sans text-[12.5px] leading-[18px] text-[#999999]">
          {QUIET_HOURS.body}
        </p>
      </div>
    </aside>
  );
};

const PageHeader = ({ caughtUp }) => (
  <div className="flex items-start justify-between gap-[24px]">
    <div className="flex flex-col gap-[3px]">
      <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1c2a21] playful:font-heading">
        {PAGE_HEADER.title}
      </h1>
      <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
        {PAGE_HEADER.subtitle}
      </p>
    </div>
    {/* "GTH · Messages header" decorations — Playful only (hidden in the Focused frames). */}
    <div
      className="relative hidden h-[84px] w-[600px] shrink-0 xl:playful:block"
      aria-hidden="true"
    >
      <span className="absolute left-0 top-[30px] flex">
        {PAGE_HEADER.faces.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="-ml-[12px] size-[40px] rounded-full border-[3px] border-solid border-white object-cover first:ml-0"
            style={{ zIndex: 4 - i }}
          />
        ))}
      </span>
      <span className="absolute left-[136px] top-[36px] inline-flex items-center gap-[6px] rounded-full border border-solid border-[rgba(0,82,43,0.12)] bg-white px-[12px] py-[7px] font-sans text-[12px] leading-[14px] tracking-[0.2px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.06)]">
        <span className="size-[8px] rounded-full bg-[#349643]" />
        {caughtUp ? PAGE_HEADER.inboxCaughtUp : PAGE_HEADER.inbox}
      </span>
      <span
        className="absolute left-[337px] top-[2px] inline-flex items-center gap-[6px] rounded-full bg-[#387440] px-[14px] py-[8px] font-sans text-[13px] font-medium leading-[16px] tracking-[0.2px] text-white shadow-[0_4px_0_#224626]"
        style={{ transform: 'rotate(2deg)' }}
      >
        <img src={headSparkle} alt="" className="size-[15px]" />
        {PAGE_HEADER.sticker}
      </span>
      <span
        className="absolute left-[430px] top-[36px] inline-flex items-center gap-[6px] rounded-full border-[1.5px] border-solid border-[#c8951a] bg-[#faf4e8] px-[12px] py-[7px] font-sans text-[12px] font-semibold leading-[14px] tracking-[0.2px] text-[#c8951a] shadow-[0_3px_0_rgba(200,149,26,0.45)]"
        style={{ transform: 'rotate(2deg)' }}
      >
        <img src={headFlame} alt="" className="size-[15px]" />
        {PAGE_HEADER.streak}
      </span>
      <img src={headDoodleGold} alt="" className="absolute left-[574px] top-0 size-[22px]" />
      <img src={headDoodleGreen} alt="" className="absolute left-[316px] top-[46px] size-[12px]" />
      <img
        src={headDoodleSquiggle}
        alt=""
        className="absolute left-[298px] top-[10px] h-[20px] w-[48px]"
      />
      <img src={headDoodleRing} alt="" className="absolute left-[250px] top-[6px] size-[14px]" />
    </div>
  </div>
);

const InboxZero = ({ onExplore, onAll }) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-[12px] px-[24px] py-[48px] text-center">
    <img src={inboxZero} alt="" aria-hidden="true" className="size-[180px]" />
    <Sticker tone="gold" className="playful:bg-[#ffd86b]">
      {FEED_COPY.inboxZero.sticker}
    </Sticker>
    <h2 className="m-0 font-sans text-[31px] font-semibold leading-[37px] text-[#1c2a21] playful:font-heading">
      {FEED_COPY.inboxZero.title}
    </h2>
    <p className="m-0 max-w-[460px] font-sans text-[15px] leading-[22px] text-[#737373]">
      {FEED_COPY.inboxZero.body}
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[8px]">
      <NotifButton size="md" tone="primary" onClick={onExplore}>
        {FEED_COPY.inboxZero.primary}
      </NotifButton>
      <NotifButton size="md" tone="secondary" onClick={onAll}>
        {FEED_COPY.inboxZero.secondary}
      </NotifButton>
    </div>
  </div>
);

const NotificationsScreen = ({ home }) => {
  const navigate = useNavigate();
  const { uiStyle } = useUiStyle();
  const filter = home?.filter ?? 'all';
  const feed = useNotificationFeed({ startRead: Boolean(home?.readAll) });
  const items = feed.select(filter);
  const empty = items.length === 0;
  const setFilter = (id) => {
    log('filter', id);
    home.update({ filter: id === 'all' ? null : id });
  };
  const title = filter === 'unread' ? FEED_COPY.unreadTitle : FEED_COPY.title;

  log('render', { filter, items: items.length, unread: feed.unreadCount });

  return (
    <div className="flex flex-col gap-[24px] px-[clamp(16px,2.31vw,40px)] pb-[32px] pt-[32px] max-md:gap-[16px] max-md:px-[12px] max-md:pt-[16px]">
      <PageHeader caughtUp={feed.unreadCount === 0} />

      <div className="grid items-start gap-[24px] max-md:gap-[12px] lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[248px_minmax(0,1fr)_340px]">
        <FilterRail
          active={filter}
          onSelect={setFilter}
          unreadCount={feed.unreadCount}
          className="max-lg:hidden"
        />

        {/* Phones / small tablets: the rail collapses into a horizontal chip row (no Figma mobile
            frame ⚠️ ASSUMPTION — same filters, same counts). */}
        <div
          role="group"
          aria-label={FEED_COPY.railTitle}
          className="no-scrollbar -mx-[12px] flex gap-[8px] overflow-x-auto px-[12px] pb-[2px] [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-24px),transparent)] lg:hidden"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={classNames(
                'inline-flex h-[34px] shrink-0 items-center gap-[6px] whitespace-nowrap rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold leading-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                filter === f.id
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {f.label}
              <span className="text-[13px] font-bold opacity-70">
                {f.id === 'unread' ? feed.unreadCount : f.count}
              </span>
            </button>
          ))}
        </div>

        {/* feed */}
        <section
          aria-label={title}
          className={classNames(
            'relative flex min-h-[560px] flex-col overflow-hidden rounded-[24px] border border-solid border-[#e1eae2] bg-white xl:h-[820px] lg:max-xl:h-[820px] max-lg:min-h-0'
          )}
        >
          <div className="flex flex-wrap items-center gap-[10px] pb-[14px] pl-[20px] pr-[16px] pt-[16px]">
            <h2 className="m-0 flex items-center gap-[10px] font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading">
              {title}
              {!empty && feed.unreadCount > 0 && (
                <Sticker tone="gold" className="font-sans">
                  {`${feed.unreadCount} new`}
                </Sticker>
              )}
            </h2>
            <span className="min-w-0 flex-1" />
            <button
              type="button"
              className="inline-flex h-[34px] items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pl-[14px] pr-[12px] font-sans text-[13px] font-semibold leading-[16px] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              {FEED_COPY.sort}
              <img src={selectChevron} alt="" aria-hidden="true" className="size-[14px]" />
            </button>
            <NotifButton size="sm" tone="secondary" onClick={feed.markAllRead}>
              {FEED_COPY.markAllRead}
            </NotifButton>
            <button
              type="button"
              aria-label="Collapse to pop-up"
              onClick={() => {
                log('collapse to pop-up');
                navigate('/home?notif=open');
              }}
              className={classNames(
                'flex size-[40px] items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.32)] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                SHELF
              )}
            >
              <img src={iconCollapse} alt="" aria-hidden="true" className="size-[17px]" />
            </button>
          </div>

          {empty ? (
            <InboxZero onExplore={() => navigate('/home')} onAll={() => setFilter('all')} />
          ) : (
            <>
              <div className="flex min-h-0 flex-1 flex-col gap-[2px] overflow-y-auto px-[12px] pb-[12px] pt-[4px] playful:gap-[8px]">
                {PAGE_GROUPS.map((g) => {
                  const rows = items.filter((n) => n.group === g.id);
                  if (!rows.length) return null;
                  return (
                    <div key={g.id} className="flex flex-col gap-[2px] playful:gap-[8px]">
                      <div className="flex items-center gap-[8px] px-[16px] pb-[6px] pt-[18px]">
                        <span className="font-sans text-[13px] font-bold leading-[16px] text-[#1c2a21]">
                          {g.label}
                        </span>
                        <span className="font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
                          {g.count}
                        </span>
                        {g.squiggle && (
                          <img
                            src={doodleSquiggle}
                            alt=""
                            aria-hidden="true"
                            className="hidden h-[6px] w-[30px] playful:block"
                          />
                        )}
                      </div>
                      <ul className="m-0 flex flex-col gap-[2px] p-0 playful:gap-[8px]">
                        {rows.map((n) => (
                          <NotificationRow
                            key={n.id}
                            item={n}
                            variant="page"
                            unread={feed.isUnread(n)}
                            onRead={feed.markRead}
                          />
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#ffffff_100%)]"
              />
            </>
          )}
        </section>

        {/* right column: stacks under the feed below xl */}
        <div className="flex flex-col gap-[16px] lg:max-xl:col-span-2 lg:max-xl:grid lg:max-xl:grid-cols-3 lg:max-xl:items-start">
          <section
            className={classNames(
              'relative flex flex-col gap-[14px] overflow-hidden rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] p-[22px]',
              SHELF
            )}
          >
            <span className="font-sans text-[11.5px] font-bold leading-[14px] text-[#c1d4c4] max-lg:text-[12px]">
              {RECAP.eyebrow}
            </span>
            <h2 className="m-0 font-sans text-[25px] font-semibold leading-[30px] text-white playful:font-heading">
              {RECAP.title}
            </h2>
            <div className="flex items-center">
              {RECAP.faces.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="-ml-[10px] size-[36px] rounded-full border border-solid border-[#387440] object-cover first:ml-0 playful:border-[2.5px]"
                />
              ))}
              <span className="-ml-[10px] flex size-[36px] items-center justify-center rounded-full border border-solid border-[#387440] bg-[#ffd86b] font-sans text-[12px] font-bold leading-[14px] text-[#1c2a21] playful:border-[2.5px]">
                {RECAP.more}
              </span>
            </div>
            <div className="flex flex-wrap gap-[8px] rounded-[8px] bg-[#ebf1ec] p-[4px] playful:rounded-none playful:bg-transparent playful:pb-[4px] playful:pl-0 playful:pr-0 playful:pt-[6px]">
              {RECAP.stickers.map((s, i) => (
                <Sticker key={s.label} tone={s.tone}>
                  {i === 2 && uiStyle !== 'playful' ? RECAP.focusedXp : s.label}
                </Sticker>
              ))}
            </div>
            <img
              src={weekSparkleA}
              alt=""
              aria-hidden="true"
              className="absolute right-[22px] top-[16px] hidden size-[22px] playful:block"
            />
            <img
              src={weekSparkleB}
              alt=""
              aria-hidden="true"
              className="absolute right-[40px] top-[46px] hidden size-[12px] playful:block"
            />
          </section>

          <section className="flex flex-col gap-[12px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[18px]">
            <h2 className="m-0 font-sans text-[19px] font-semibold leading-[24px] text-[#1c2a21] playful:font-heading">
              {COMING_UP.title}
            </h2>
            <div className="flex items-center gap-[12px]">
              <span
                className={classNames(
                  'flex h-[56px] w-[56px] flex-col items-center justify-center rounded-[14px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#faf4e8]',
                  SHELF
                )}
              >
                <span className="font-sans text-[11px] font-bold leading-[13px] text-[#967014] max-lg:text-[12px]">
                  {COMING_UP.day}
                </span>
                <span className="font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading">
                  {COMING_UP.date}
                </span>
              </span>
              <div className="flex min-w-0 flex-col gap-[2px]">
                <span className="font-sans text-[14.5px] font-semibold leading-[17px] text-[#1c2a21]">
                  {COMING_UP.event}
                </span>
                <span className="font-sans text-[13px] leading-[16px] text-[#595959]">
                  {COMING_UP.when}
                </span>
              </div>
            </div>
            <div className="flex gap-[8px]">
              <NotifButton size="sm" tone="primary" onClick={() => log('add to calendar')}>
                {COMING_UP.primary}
              </NotifButton>
              <NotifButton size="sm" tone="secondary" onClick={() => log('prep')}>
                {COMING_UP.secondary}
              </NotifButton>
            </div>
          </section>

          <section className="flex flex-col gap-[10px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[18px]">
            <div className="flex items-center justify-between gap-[8px]">
              <h2 className="m-0 font-sans text-[19px] font-semibold leading-[24px] text-[#1c2a21] playful:font-heading">
                {PING_SETTINGS.title}
              </h2>
              <img src={pingSettings} alt="" aria-hidden="true" className="size-[16px]" />
            </div>
            {PING_SETTINGS.rows.map((r) => (
              <div key={r.label} className="flex items-center gap-[8px] py-[6px]">
                <span className="flex-1 font-sans text-[13.5px] font-medium leading-[16px] text-[#1c2a21]">
                  {r.label}
                </span>
                <button
                  type="button"
                  className={classNames(
                    'inline-flex items-center gap-[4px] rounded-full border border-solid px-[10px] py-[4px] font-sans text-[12px] font-semibold leading-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    r.on
                      ? 'border-[rgba(28,42,33,0.35)] bg-[#ebf1ec] text-[#2d5d33]'
                      : 'border-[rgba(28,42,33,0.35)] bg-[#f8f8f4] text-[#595959]'
                  )}
                >
                  {r.value}
                  <img src={pingChevron} alt="" aria-hidden="true" className="size-[12px]" />
                </button>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
