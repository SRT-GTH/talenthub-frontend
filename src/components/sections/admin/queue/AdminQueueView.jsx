import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import { AgencyChevronDownIcon } from '../../agency/agencyIcons.jsx';
import emptyArt from '../../../../assets/admin/accounts-empty-art.svg';
import {
  AdminArrowRightIcon,
  AdminClockIcon,
  AdminPlusIcon,
  AdminSparkIcon,
  AdminUserIcon,
} from '../adminIcons.jsx';
import QueueRow from './QueueRow.jsx';

const log = debug('AdminQueueView');

/*
 * AdminQueueView — the queue / list screen shared by the admin sections (Figma 7.1.1a Accounts, 7.2.1a Flag queue, 7.2.3a Removed content, 7.2.5a New communities,
 * and their empty states 7.1.1b / 7.2.1b — the talent "Job postings" list in staff clothes). Title 34/41 600 + count sticker (#ebf1ec, 13/700) · 16/24 #737373 sub
 * copy · tabs (each with a count badge; the selected badge is #c8951a) · toolbar (filter chips, cards / list toggle, sort select, one action button) · results: a cream
 * banner + a white list card (r22) of QueueRow, or the empty card (r28: spot art, headline, three suggestion steps, a green and a white button).
 * Props: config { title, sticker, subtitle, tabs, tabTone 'ink' | 'green', defaultTab, chips, defaultChip, chipsDim, defaultView, sort, action, banner, rows, empty },
 *        data (useAdminState()), onRowButton(row), onAction().
 * ⚠️ ASSUMPTION: tabs, chips, the view toggle, the sort select and the action button have no behaviour drawn beyond their selected look: they only log (the sample
 * lists are fixed); their selection lives in the URL (?tab= ?chip= ?view=).
 */

const STEP_ICONS = { plus: AdminPlusIcon, spark: AdminSparkIcon, user: AdminUserIcon };

const Tab = ({ tab, selected, tone, onSelect }) => (
  <button
    type="button"
    role="tab"
    aria-selected={selected}
    onClick={onSelect}
    className={classNames(
      'relative inline-flex h-[43px] cursor-pointer items-center gap-[8px] border-0 bg-transparent px-[14px] pt-[10px] pb-[12px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? classNames('font-semibold', tone === 'green' ? 'text-[#387440]' : 'text-[#1c2a21]')
        : 'font-medium text-[#737373]'
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
      <span
        aria-hidden="true"
        className={classNames(
          'absolute right-0 bottom-0 left-0 h-[2px]',
          tone === 'green' ? 'bg-[#387440]' : 'bg-[#1c2a21]'
        )}
      />
    ) : null}
  </button>
);

const FilterChip = ({ chip, selected, onSelect, dim }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onSelect}
    className={classNames(
      'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
        : 'border-[#e1eae2] bg-white text-[#595959]',
      dim && 'opacity-50'
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

const AdminQueueView = ({ config, data, onRowButton, onAction }) => {
  const navigate = useNavigate();
  const c = config;
  const empty = Boolean(c.empty);
  const tab = data.tab ?? c.defaultTab;
  const view =
    data.view === 'cards' || data.view === 'list' ? data.view : (c.defaultView ?? 'list');
  const chip = data.params.get('chip') ?? c.defaultChip ?? 'all';

  return (
    <div className="flex flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
            {c.title}
          </h1>
          <span className="inline-flex h-[26px] items-center rounded-full bg-[#ebf1ec] px-[11px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {c.sticker}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] text-[#737373]">{c.subtitle}</p>
      </header>

      <div className="flex flex-col gap-[18px]">
        <div role="tablist" aria-label={`${c.title} sections`} className="flex flex-wrap gap-[4px]">
          {c.tabs.map((t) => (
            <Tab
              key={t.id}
              tab={t}
              selected={tab === t.id}
              tone={c.tabTone ?? 'ink'}
              onSelect={() => {
                log('tab', t.id);
                data.update({ tab: t.id });
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          {c.chips.map((ch) => (
            <FilterChip
              key={ch.id}
              chip={ch}
              selected={chip === ch.id}
              dim={c.chipsDim}
              onSelect={() => data.update({ chip: ch.id === 'all' ? null : ch.id })}
            />
          ))}
          <span className="hidden flex-1 md:block" />
          <ViewToggle view={view} onChange={(v) => data.update({ view: v })} />
          <button
            type="button"
            onClick={() => log('sort select (no menu drawn)', c.sort)}
            className={classNames(
              'inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              c.chipsDim && 'opacity-50'
            )}
          >
            {c.sort}
            <AgencyChevronDownIcon className="size-[14px]" />
          </button>
          <AgencyButton
            size="xs"
            className={c.chipsDim ? 'opacity-50' : undefined}
            onClick={() =>
              onAction ? onAction() : log('toolbar action (no flow drawn)', c.action)
            }
          >
            {c.action}
          </AgencyButton>
        </div>

        {empty ? (
          <section
            aria-label={c.empty.title}
            className="flex flex-col items-center gap-[14px] rounded-[28px] border border-solid border-[#e1eae2] bg-white px-[clamp(16px,3vw,40px)] py-[36px] text-center"
          >
            <img src={emptyArt} alt="" draggable="false" className="size-[150px]" />
            <h2 className="m-0 font-sans text-[34px] leading-[41px] font-semibold text-[#1c2a21]">
              {c.empty.title}
            </h2>
            <p className="m-0 font-sans text-[15px] leading-[21px] text-[#595959]">
              {c.empty.text}
            </p>
            <ul className="m-0 flex w-full max-w-[560px] list-none flex-col gap-[4px] overflow-hidden rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-0 text-left">
              {c.empty.steps.map((s, i) => {
                const Icon = STEP_ICONS[s.icon];
                return (
                  <li key={s.id} className={i > 0 ? 'border-t border-solid border-[#e1eae2]' : ''}>
                    <button
                      type="button"
                      onClick={() => {
                        log('suggestion', s.title);
                        if (s.to) navigate(s.to);
                      }}
                      className="flex w-full cursor-pointer items-center gap-[12px] border-0 bg-transparent px-[16px] py-[13px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#387440]"
                    >
                      <span className="grid size-[32px] shrink-0 place-items-center rounded-[10px] border border-solid border-[#1c2a21]/10 bg-[#ebf1ec] text-[#387440]">
                        <Icon className="size-[15px]" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                        <span className="font-sans text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
                          {s.title}
                        </span>
                        <span className="font-sans text-[12.5px] leading-[15px] text-[#737373]">
                          {s.meta}
                        </span>
                      </span>
                      <AdminArrowRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap items-center justify-center gap-[10px] pt-[6px]">
              <button
                type="button"
                onClick={() =>
                  c.empty.onPrimary ? navigate(c.empty.onPrimary) : log('empty primary')
                }
                className="inline-flex h-[48px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[18px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {c.empty.primary}
              </button>
              <AgencyButton
                size="md"
                className="!h-[48px] !px-[18px] !text-[16px] !font-bold"
                onClick={() => (c.empty.secondaryTo ? navigate(c.empty.secondaryTo) : null)}
              >
                {c.empty.secondary}
              </AgencyButton>
            </div>
          </section>
        ) : (
          <>
            <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] px-[18px] py-[14px] pl-[14px] font-sans text-[14px] leading-[20px] font-medium text-[#1c2a21]">
              <AdminClockIcon className="size-[18px] shrink-0 text-[#c8951a]" />
              {c.banner}
            </p>
            <ul className="m-0 flex list-none flex-col gap-[4px] rounded-[22px] border border-solid border-[#e1eae2] bg-white p-0">
              {c.rows.map((r) => (
                <QueueRow
                  key={r.id}
                  row={r}
                  onButton={onRowButton}
                  onSave={(row) => log('save (no flow drawn)', row.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminQueueView;
