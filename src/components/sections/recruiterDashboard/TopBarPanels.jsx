import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import NotifButton from '../notifications/NotifButton.jsx';
import iconCheck from '../../../assets/notifications/icons/action-check.svg';
import iconExpand from '../../../assets/notifications/icons/action-expand.svg';
import iconSettings from '../../../assets/notifications/icons/footer-settings.svg';
import iconFooterExpand from '../../../assets/notifications/icons/footer-expand.svg';
import emptyBell from '../../../assets/notifications/illustrations/empty-popover-bell.svg';
import { dashIcons } from './recruiterDashboardIcons.js';
import { LANGUAGE_MENU, NOTIFICATIONS_PANEL as N } from './recruiterDashboardData.js';

/*
 * TopBarPanels — the recruiter dashboard's top-bar pop-ups (Figma section 02 "Top bar — notifications, search, language, accessibility", US-7.7-…):
 *   RecruiterNotificationsPanel  D10 open (5 new) · D11 all caught up (`empty`) — a 440px card under the bell: mint header (title, "5 new" sticker, mark-all-read and expand buttons),
 *                                five filter tabs, TODAY / EARLIER rows (avatar with its badge, title, kind, age, actions) and the Settings / See everything footer.
 *   LanguageMenu                 D16 — "Language" list (English (Ghana) selected, Twi, Ewe, Ga, Dagbani "Coming soon") and the fallback note.
 * Both close on Esc and on a click outside. The accessibility panel (D17) is the shared `TalentA11yMenu`; the search panel (D13–D15) is not built (see wiki/recruiter-dashboard.md).
 * ⚠️ ASSUMPTION: the empty state reuses the shared popover's bell illustration; "Search Talents" opens /recruiter/talent-search.
 */
const useDismiss = (ref, onClose) => {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const onDown = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.closest?.('[data-panel-trigger]')
      ) {
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [ref, onClose]);
};

const HeaderButton = ({ label, icon, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="relative flex size-[36px] cursor-pointer items-center justify-center rounded-full border border-solid border-[#224626] bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
  >
    <img src={icon} alt="" aria-hidden="true" className="size-[16px]" />
  </button>
);

export const RecruiterNotificationsPanel = ({ empty = false, onClose, onNavigate, className }) => {
  const ref = useRef(null);
  const [tab, setTab] = useState('all');
  useDismiss(ref, onClose);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={N.title}
      className={classNames(
        'absolute top-[calc(100%+8px)] right-[-8px] z-50 flex w-[440px] max-w-[calc(100vw-24px)] flex-col rounded-[24px] border border-solid border-[rgba(28,42,33,0.1)] bg-[#fffefc] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_8px_24px_rgba(28,42,33,0.12)]',
        className
      )}
    >
      <div className="flex shrink-0 items-start gap-[12px] rounded-t-[22px] bg-[#ebf1ec] px-[20px] pt-[20px] pb-[16px]">
        <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
          <div className="flex items-center gap-[10px]">
            <h2 className="m-0 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
              {N.title}
            </h2>
            <span
              className={classNames(
                'inline-flex items-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] px-[10px] py-[3px] font-sans text-[12px] leading-[16px] font-bold text-[#1c2a21]',
                empty ? 'bg-white' : 'bg-[#ffd86b]'
              )}
            >
              {empty ? N.empty.sticker : N.newSticker}
            </span>
          </div>
          <p className="m-0 font-sans text-[13px] leading-[16px] text-[#595959]">
            {empty ? N.empty.subtitle : N.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 gap-[8px] pt-[8px]">
          <HeaderButton
            label="Mark all read"
            icon={iconCheck}
            onClick={() => onNavigate?.('mark-all-read')}
          />
          <HeaderButton
            label="Expand to full view"
            icon={iconExpand}
            onClick={() => onNavigate?.('expand')}
          />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filter notifications"
        className="flex flex-wrap gap-[8px] px-[20px] pt-[14px] pb-[10px]"
      >
        {N.tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={classNames(
                'inline-flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                active
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {item.label}
              {item.count && !empty ? (
                <span className="rounded-full bg-[#c8951a] px-[7px] py-px text-[11px] leading-[13px] font-bold text-white max-lg:text-[12px]">
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {empty ? (
        <div className="flex flex-col items-center gap-[10px] px-[32px] py-[28px] text-center">
          <img src={emptyBell} alt="" aria-hidden="true" className="size-[110px]" />
          <h3 className="m-0 font-sans text-[22px] leading-[28px] font-semibold text-[#1c2a21]">
            {N.empty.title}
          </h3>
          <p className="m-0 font-sans text-[13px] leading-[18px] text-[#737373]">{N.empty.body}</p>
          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            <NotifButton size="xs" tone="primary" onClick={() => onNavigate?.('search-talents')}>
              {N.empty.primary}
            </NotifButton>
            <NotifButton size="xs" tone="secondary" onClick={() => onNavigate?.('settings')}>
              {N.empty.secondary}
            </NotifButton>
          </div>
        </div>
      ) : (
        <ul className="m-0 flex max-h-[480px] list-none flex-col gap-[12px] overflow-y-auto p-0 px-[8px] pb-[8px]">
          {N.groups.map((group) => {
            const rows = group.rows.filter((row) => tab === 'all' || row.type === tab);
            if (!rows.length) return null;
            return (
              <li key={group.id} className="list-none">
                <div className="px-[12px] pt-[10px] pb-[4px] font-sans text-[12px] leading-[14px] font-bold text-[#737373]">
                  {group.label}
                </div>
                <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
                  {rows.map((row) => (
                    <li
                      key={row.id}
                      className={classNames(
                        'flex gap-[14px] rounded-[16px] p-[12px]',
                        row.unread ? 'bg-[#ebf1ec]' : 'bg-transparent'
                      )}
                    >
                      {row.avatar ? (
                        <img
                          src={dashIcons[row.avatar]}
                          alt=""
                          aria-hidden="true"
                          className="size-[48px] shrink-0"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-[48px] shrink-0 items-center justify-center rounded-full font-sans text-[14px] leading-[20px] font-semibold"
                          style={
                            row.system
                              ? { background: '#f9ebea' }
                              : { background: row.bg, color: row.color }
                          }
                        >
                          {row.system ? (
                            <img src={dashIcons.alertMissing} alt="" className="size-[18px]" />
                          ) : (
                            row.initials
                          )}
                        </span>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
                        <div className="flex items-start justify-between gap-[8px]">
                          <span className="font-sans text-[14px] leading-[20px] font-semibold text-[#1c2a21]">
                            {row.title}
                          </span>
                          <span className="shrink-0 font-sans text-[12px] leading-[16px] font-medium text-[#737373]">
                            {row.time}
                          </span>
                        </div>
                        <span className="font-sans text-[13px] leading-[18px] text-[#595959]">
                          {row.meta}
                        </span>
                        {row.actions ? (
                          <div className="mt-[6px] flex flex-wrap gap-[8px]">
                            {row.actions.map((action) => (
                              <NotifButton
                                key={action.id}
                                size="xs"
                                tone={action.tone}
                                onClick={() => onNavigate?.(action.id)}
                              >
                                {action.label}
                              </NotifButton>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex shrink-0 items-center justify-between gap-[8px] rounded-b-[22px] border-t border-solid border-[#e1eae2] pt-[12px] pr-[16px] pb-[14px] pl-[20px]">
        <button
          type="button"
          onClick={() => onNavigate?.('settings')}
          className="inline-flex cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={iconSettings} alt="" aria-hidden="true" className="size-[15px]" />
          {N.settings}
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.('expand')}
          className="inline-flex cursor-pointer items-center gap-[8px] rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] py-[10px] pr-[16px] pl-[18px] font-sans text-[13.5px] leading-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {N.seeEverything}
          <img src={iconFooterExpand} alt="" aria-hidden="true" className="size-[14px]" />
        </button>
      </div>
    </div>
  );
};

export const LanguageMenu = ({ value = 'en', onChange, onClose }) => {
  const ref = useRef(null);
  useDismiss(ref, onClose);
  return (
    <div
      ref={ref}
      role="menu"
      aria-label={LANGUAGE_MENU.label}
      className="absolute top-[calc(100%+8px)] right-0 z-50 flex w-[300px] max-w-[calc(100vw-24px)] flex-col rounded-[14px] border border-solid border-[#e5e8e3] bg-white p-[12px] shadow-[0_16px_40px_-8px_rgba(15,15,10,0.2),0_2px_6px_rgba(15,15,10,0.06)]"
    >
      <div className="px-[8px] pt-[4px] pb-[8px] font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#575755]">
        {LANGUAGE_MENU.label}
      </div>
      {LANGUAGE_MENU.options.map((option) => {
        const selected = option.id === value;
        const soon = Boolean(option.soon);
        return (
          <button
            key={option.id}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            disabled={soon}
            onClick={() => onChange?.(option.id)}
            className={classNames(
              'flex w-full items-center gap-[12px] rounded-[10px] border-0 px-[8px] py-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green',
              selected ? 'bg-[#ebf1ec]' : 'bg-transparent enabled:hover:bg-[#f8f8f4]',
              soon ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            <img
              src={dashIcons.languageOptionGlobe}
              alt=""
              aria-hidden="true"
              className="size-[18px] shrink-0"
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className={classNames(
                  'font-sans text-[14px] leading-[20px]',
                  soon ? 'text-[#babab7]' : selected ? 'font-medium text-[#111]' : 'text-[#111]'
                )}
              >
                {option.name}
              </span>
              <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
                {option.code}
              </span>
            </span>
            {soon ? (
              <span className="shrink-0 font-sans text-[12px] leading-[16px] font-medium text-[#575755]">
                {option.soon}
              </span>
            ) : null}
            {selected ? (
              <img
                src={dashIcons.languageOptionSelectedCheck}
                alt=""
                aria-hidden="true"
                className="size-[16px] shrink-0"
              />
            ) : null}
          </button>
        );
      })}
      <p className="m-0 mt-[8px] flex gap-[8px] border-t border-solid border-[#e5e8e3] px-[8px] pt-[10px] font-sans text-[12px] leading-[16px] text-[#575755]">
        <img
          src={dashIcons.languageFallbackInfo}
          alt=""
          aria-hidden="true"
          className="mt-[1px] size-[14px] shrink-0"
        />
        {LANGUAGE_MENU.note}
      </p>
    </div>
  );
};
