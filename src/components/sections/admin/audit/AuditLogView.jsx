import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import {
  AdminArrowRightIcon,
  AdminBookmarkIcon,
  AdminCheckIcon,
  AdminClockIcon,
  AdminEyeIcon,
} from '../adminIcons.jsx';
import {
  AdminDownloadTileIcon,
  AdminSettingsTileIcon,
  AdminUserTileIcon,
} from '../settings/settingsIcons.jsx';
import { AUDIT, EVENTS } from './data/adminAuditData.js';

const log = debug('AuditLogView');

/*
 * AuditLogView — Platform audit log list (Figma 7.5.3a 8639:4341, event-detail backdrop 7.5.3b, export backdrop 7.5.3c, Senior Admin view 7.5.3d 8666:11438): the queue layout of
 * the other admin lists without a sort select or action button — title 34/41 600 + "Immutable" sticker · 16/24 #737373 sub copy · four tabs with count badges (selected: ink
 * rule, #c8951a badge) · All / Admin / System chips + cards / list toggle · cream banner · white list card (r22) of event rows (42 tile, title 16/600 + sticker, 13 sub, chips,
 * pill, time, save, arrow or a white "Details" button; a muted row is drawn at 50 %).
 * Props: data (useAdminState()), masked (Senior Admin copy: banner + the restricted third row), onOpen(event) (title, pill, arrow, "Details").
 * ⚠️ ASSUMPTION: tabs / chips / view toggle only change their selected look (the three sample events are fixed, selection lives in the URL ?tab= ?chip= ?view=); the save button
 * logs; every row opens the one event detail drawn.
 */

const TILES = {
  user: AdminUserTileIcon,
  settings: AdminSettingsTileIcon,
  download: AdminDownloadTileIcon,
};

const CHIP = {
  amber: 'border-[#c8951a] bg-[#faf4e8] text-[#1c2a21] font-semibold text-[11px]',
  green: 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33] font-semibold text-[11.5px]',
  grey: 'border-transparent bg-[#f8f8f4] text-[#595959] font-medium text-[11px]',
};

const Tab = ({ tab, selected, onSelect }) => (
  <button
    type="button"
    role="tab"
    aria-selected={selected}
    onClick={onSelect}
    className={classNames(
      'relative inline-flex h-[43px] cursor-pointer items-center gap-[8px] border-0 bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#737373]'
    )}
  >
    {tab.label}
    <span
      className={classNames(
        'inline-flex rounded-full px-[7px] py-px text-[11.5px] leading-[14px] font-bold',
        selected ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
      )}
    >
      {tab.count}
    </span>
    {selected ? (
      <span aria-hidden="true" className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#1c2a21]" />
    ) : null}
  </button>
);

const FilterChip = ({ chip, selected, onSelect }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onSelect}
    className={classNames(
      'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
        : 'border-[#e1eae2] bg-white text-[#595959]'
    )}
  >
    {chip.label}
  </button>
);

const ViewToggle = ({ view, onChange }) => (
  <div
    role="group"
    aria-label="View"
    className="inline-flex h-[34px] items-center gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
  >
    {[
      { id: 'cards', label: 'Cards' },
      { id: 'list', label: 'List' },
    ].map((s) => (
      <button
        key={s.id}
        type="button"
        aria-label={`${s.label} view`}
        aria-pressed={view === s.id}
        onClick={() => onChange(s.id)}
        className={classNames(
          'grid h-[26px] w-[34px] cursor-pointer place-items-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          view === s.id ? 'bg-[#1c2a21]' : 'bg-transparent'
        )}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-[16px]">
          {s.id === 'cards' ? (
            <g fill={view === s.id ? '#ffffff' : '#737373'}>
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </g>
          ) : (
            <g fill={view === s.id ? '#ffffff' : '#737373'}>
              <rect x="1" y="1" width="2" height="2" rx="1.25" />
              <rect x="5" y="2" width="10" height="2" rx="1" />
              <rect x="1" y="6" width="2" height="2" rx="1.25" />
              <rect x="5" y="7" width="10" height="2" rx="1" />
              <rect x="1" y="11" width="2" height="2" rx="1.25" />
              <rect x="5" y="12" width="10" height="2" rx="1" />
            </g>
          )}
        </svg>
      </button>
    ))}
  </div>
);

const Chip = ({ chip }) => (
  <span
    className={classNames(
      'inline-flex shrink-0 items-center gap-[5px] rounded-full border border-solid py-[3px] leading-[14px] whitespace-nowrap',
      chip.tone === 'grey' ? 'px-[8px]' : 'px-[9px]',
      CHIP[chip.tone]
    )}
  >
    {chip.tone === 'amber' ? <AdminEyeIcon className="size-[13px] shrink-0" /> : null}
    {chip.tone === 'green' ? <AdminCheckIcon className="size-[11px] shrink-0" /> : null}
    {chip.label}
  </span>
);

const EventRow = ({ event, masked, onOpen, onSave }) => {
  const dim = event.muted ? 'opacity-50' : '';
  const Tile = TILES[event.icon];
  const shown = masked && event.restricted ? { ...event, ...event.restricted } : event;
  return (
    <li className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px] px-[18px] py-[14px] pr-[20px]">
      <span
        aria-hidden="true"
        className={classNames(
          'grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-[#ebf1ec] text-[#387440]',
          dim
        )}
      >
        <Tile className="size-[24px]" />
      </span>
      <div className={classNames('flex min-w-[200px] flex-1 flex-col gap-[2px]', dim)}>
        <div className="flex flex-wrap items-center gap-[8px]">
          <button
            type="button"
            onClick={() => onOpen(event)}
            className="cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {shown.title}
          </button>
          {event.sticker ? (
            <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[11px] leading-[13px] font-bold text-[#1f4a2b]">
              {event.sticker}
            </span>
          ) : null}
        </div>
        <p className="m-0 text-[13px] leading-[16px] text-[#737373]">{shown.sub}</p>
      </div>
      <div className={classNames('flex flex-wrap items-center gap-[6px]', dim)}>
        {event.chips.map((c) => (
          <Chip key={c.label} chip={c} />
        ))}
      </div>
      <button
        type="button"
        aria-label={`${event.pill.label} ${shown.title}`}
        onClick={() => onOpen(event)}
        className={classNames(
          'inline-flex h-[25px] cursor-pointer items-center rounded-full border border-solid px-[10px] text-[12.5px] leading-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          event.pill.strong
            ? 'border-[#1c2a21] bg-[#387440] text-white'
            : 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]',
          dim
        )}
      >
        {event.pill.label}
      </button>
      <span className={classNames('min-w-[14px] text-[12.5px] leading-[15px] text-[#737373]', dim)}>
        {event.age}
      </span>
      <button
        type="button"
        aria-label={`Save ${shown.title}`}
        onClick={() => onSave(event)}
        className={classNames(
          'grid size-[34px] shrink-0 cursor-pointer place-items-center rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          dim
        )}
      >
        <AdminBookmarkIcon className="size-[15px]" />
      </button>
      {event.button ? (
        <AgencyButton size="md" onClick={() => onOpen(event)}>
          {event.button}
        </AgencyButton>
      ) : (
        <button
          type="button"
          aria-label={`Open ${shown.title}`}
          onClick={() => onOpen(event)}
          className="grid size-[24px] shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <AdminArrowRightIcon className="size-[16px]" />
        </button>
      )}
    </li>
  );
};

const AuditLogView = ({ data, masked, onOpen }) => {
  const tab = data.tab ?? AUDIT.defaultTab;
  const view = data.view === 'cards' || data.view === 'list' ? data.view : 'list';
  const chip = data.params.get('chip') ?? 'all';

  useEffect(() => {
    log('mount', { tab, chip, view, masked, events: EVENTS.length });
  }, [tab, chip, view, masked]);

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
            {AUDIT.title}
          </h1>
          <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {AUDIT.sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#737373]">{AUDIT.subtitle}</p>
      </header>

      <div className="flex flex-col gap-[18px]">
        <div role="tablist" aria-label="Audit log sections" className="flex flex-wrap gap-[4px]">
          {AUDIT.tabs.map((t) => (
            <Tab
              key={t.id}
              tab={t}
              selected={tab === t.id}
              onSelect={() => {
                log('tab', t.id);
                data.update({ tab: t.id });
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          {AUDIT.chips.map((c) => (
            <FilterChip
              key={c.id}
              chip={c}
              selected={chip === c.id}
              onSelect={() => data.update({ chip: c.id === 'all' ? null : c.id })}
            />
          ))}
          <span className="hidden flex-1 md:block" />
          <ViewToggle view={view} onChange={(v) => data.update({ view: v })} />
        </div>

        <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] pl-[14px] font-sans text-[14px] leading-[20px] font-medium text-[#1c2a21]">
          <AdminClockIcon className="size-[18px] shrink-0 text-[#c8951a]" />
          {masked ? AUDIT.bannerSenior : AUDIT.banner}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[4px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
          {EVENTS.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              masked={masked}
              onOpen={onOpen}
              onSave={(ev) => log('save (no flow drawn)', ev.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditLogView;
