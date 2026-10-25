import { useMemo } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import InstitutionButton from '../InstitutionButton.jsx';
import InstitutionAuditRow from './InstitutionAuditRow.jsx';
import {
  InstitutionSettingsClockIcon,
  InstitutionSettingsGridIcon,
  InstitutionSettingsListIcon,
} from './institutionSettingsIcons.jsx';
import {
  AUDIT_BANNER,
  AUDIT_KINDS,
  AUDIT_PAGE_SIZE,
  AUDIT_TABS,
  AUDIT_TOTAL,
  TOASTS,
  buildAuditEvents,
} from './data/institutionSettingsData.js';

const log = debug('InstitutionAuditLogTab');

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

/*
 * InstitutionAuditLogTab — Figma 11.6.1g "Audit log" (8746:1175): heading + "2,946 events" pill, tabs All / Roster / Records / Credentials (counts),
 * filter chips All · Downloads · Requests, grid / list toggle, head-of-school banner, the event list. URL keys (own): view=all|roster|records|credentials
 * (default records = the drawn frame), kind=all|download|request, layout=grid, page=n. ⚠️ ASSUMPTIONS: events other than the 3 drawn are generated
 * samples; pagination, the grid layout and the "Export CSV" button (mock: downloads the filtered rows as a CSV file) are not drawn. The frame also holds
 * an invisible (opacity 0) "Next DPO report · 1 Nov" chip in the heading area: not rendered.
 * Props: data (useInstitutionState()), onToast(toast).
 */
const InstitutionAuditLogTab = ({ data, onToast }) => {
  const tab = AUDIT_TABS.find((t) => t.id === data.view)?.id ?? 'records';
  const kindParam = data.params.get('kind');
  const kind = AUDIT_KINDS.some((k) => k.id === kindParam) ? kindParam : 'all';
  const grid = data.params.get('layout') === 'grid';
  const events = useMemo(() => buildAuditEvents(tab), [tab]);
  const filtered = useMemo(
    () => (kind === 'all' ? events : events.filter((e) => e.kind === kind)),
    [events, kind]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / AUDIT_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(data.params.get('page')) || 1), pages);
  const slice = filtered.slice((page - 1) * AUDIT_PAGE_SIZE, page * AUDIT_PAGE_SIZE);
  const from = filtered.length ? (page - 1) * AUDIT_PAGE_SIZE + 1 : 0;
  const to = Math.min(page * AUDIT_PAGE_SIZE, filtered.length);

  const exportCsv = () => {
    log('export csv', { rows: filtered.length });
    const lines = [
      ['Event', 'Details', 'Rows', 'Day'],
      ...filtered.map((e) => [e.title, e.meta, e.rows, e.day]),
    ];
    const blob = new Blob([lines.map((l) => l.map(csvCell).join(',')).join('\n')], {
      type: 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast(TOASTS.exported);
  };

  return (
    <div className="flex flex-col gap-[18px] pt-[clamp(0px,0.93vw,16px)]">
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="m-0 font-sans text-[clamp(26px,1.85vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
              Audit log
            </h1>
            <span className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {AUDIT_TOTAL}
            </span>
          </div>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#737373] max-sm:text-[14px]">
            Every roster change, record decision, credential and download by your staff. You can’t
            edit or delete it.
          </p>
        </div>
        <InstitutionButton size="sm" onClick={exportCsv}>
          Export CSV
        </InstitutionButton>
      </div>

      <div role="tablist" aria-label="Audit log sections" className="flex flex-wrap gap-[4px]">
        {AUDIT_TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`audit-tab-${t.id}`}
              aria-selected={active}
              aria-controls="audit-panel"
              onClick={() => data.update({ view: t.id, page: null }, { replace: true })}
              className={classNames(
                'flex min-h-[40px] cursor-pointer items-center gap-[8px] border-b-2 px-[14px] pt-[10px] pb-[12px] text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                active
                  ? 'border-[#1c2a21] font-semibold text-[#1c2a21]'
                  : 'border-transparent font-medium text-[#737373]'
              )}
            >
              {t.label}
              <span
                className={classNames(
                  'rounded-full px-[7px] py-px text-[11.5px] leading-[14px] font-bold max-lg:text-[12px]',
                  t.accent && active ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                )}
              >
                {t.countLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-[8px]">
        {AUDIT_KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            aria-pressed={kind === k.id}
            onClick={() =>
              data.update({ kind: k.id === 'all' ? null : k.id, page: null }, { replace: true })
            }
            className={classNames(
              'h-[32px] cursor-pointer rounded-full border px-[14px] text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              kind === k.id
                ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                : 'border-[#e1eae2] bg-white text-[#595959]'
            )}
          >
            {k.label}
          </button>
        ))}
        <span className="flex-1" />
        <div
          role="group"
          aria-label="Layout"
          className="flex gap-[2px] rounded-[10px] border border-[#e1eae2] bg-white p-[3px]"
        >
          {[
            { id: 'grid', Icon: InstitutionSettingsGridIcon, label: 'Grid view' },
            { id: 'list', Icon: InstitutionSettingsListIcon, label: 'List view' },
          ].map((opt) => {
            const { id, label } = opt;
            const LayoutIcon = opt.Icon;
            const on = (id === 'grid') === grid;
            return (
              <button
                key={id}
                type="button"
                aria-label={label}
                aria-pressed={on}
                onClick={() =>
                  data.update({ layout: id === 'grid' ? 'grid' : null }, { replace: true })
                }
                className={classNames(
                  'flex h-[28px] w-[34px] cursor-pointer items-center justify-center rounded-[7px] focus-visible:outline-2 focus-visible:outline-[#387440]',
                  on ? 'bg-[#1c2a21] text-white' : 'text-[#737373]'
                )}
              >
                <LayoutIcon className="size-[16px]" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-[14px] rounded-[20px] border border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[14px] pl-[18px]">
        <InstitutionSettingsClockIcon className="size-[18px] shrink-0 text-[#967014]" />
        <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">{AUDIT_BANNER}</p>
      </div>

      <div id="audit-panel" role="tabpanel" aria-labelledby={`audit-tab-${tab}`}>
        {slice.length ? (
          <ul
            className={classNames(
              'm-0 list-none p-0',
              grid
                ? 'grid grid-cols-1 gap-[12px] md:grid-cols-2'
                : 'overflow-hidden rounded-[22px] border border-[#e1eae2] bg-white'
            )}
          >
            {slice.map((e) => (
              <InstitutionAuditRow key={e.id} event={e} grid={grid} />
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-[22px] border border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#595959]">
            No events match this filter.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[14px]">
          <p role="status" className="m-0 text-[14px] leading-[20px] text-[#737373]">
            Showing {from} to {to} of {filtered.length.toLocaleString('en-GB')} events
          </p>
          <div className="flex items-center gap-[8px]">
            <InstitutionButton
              size="xs"
              disabled={page <= 1}
              onClick={() => data.update({ page: page - 1 }, { replace: true })}
            >
              Previous
            </InstitutionButton>
            <span
              aria-current="page"
              className="flex size-[36px] items-center justify-center rounded-[10px] bg-[#387440] text-[13.5px] font-bold text-white"
            >
              {page}
            </span>
            <InstitutionButton
              size="xs"
              disabled={page >= pages}
              onClick={() => data.update({ page: page + 1 }, { replace: true })}
            >
              Next
            </InstitutionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionAuditLogTab;
