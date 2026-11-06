import { useState } from 'react';
import { agencyAudit, agencyAuditExport, saveCsv } from '../../../../services/agency.api.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../AgencyButton.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import AgencyAuditRow from './AgencyAuditRow.jsx';
import {
  AgencySettingsClockIcon,
  AgencySettingsGridIcon,
  AgencySettingsListIcon,
} from './agencySettingsIcons.jsx';
import { AUDIT_PAGE_SIZE, AUDIT_TABS, TOASTS } from './data/agencySettingsData.js';

const log = debug('AgencyAuditLogTab');

const KINDS = [
  { id: 'all', label: 'All' },
  { id: 'download', label: 'Downloads' },
  { id: 'request', label: 'Requests' },
];

const day = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

/*
 * AgencyAuditLogTab — Figma 11.6.1h "Audit log" (8611:3022): heading + "1,284 events" pill, tabs Overview / Downloads / Requests / Quota (counts),
 * filter chips All · Downloads · Requests, grid / list toggle, DPO banner, the event list. URL keys (own): view=overview|downloads|requests|quota
 * (default overview), kind=all|download|request, layout=grid, page=n. Live: GET /agency/audit (agencyActivity: every save, refresh, export,
 * request, view, download and team change, newest first, server-paged); "Export CSV" is POST /agency/audit/export (that tab, logged).
 * Props: data (useAgencyState()), onToast(toast).
 */
const AgencyAuditLogTab = ({ data, onToast }) => {
  const tab = AUDIT_TABS.find((t) => t.id === data.view)?.id ?? 'overview';
  const kindParam = data.params.get('kind');
  const kind = KINDS.some((k) => k.id === kindParam) ? kindParam : 'all';
  const grid = data.params.get('layout') === 'grid';
  const pageParam = Math.max(1, Number(data.params.get('page')) || 1);
  const res = useAgencyResource(
    () => agencyAudit({ tab, kind, page: pageParam, pageSize: AUDIT_PAGE_SIZE }),
    [tab, kind, pageParam]
  );
  const [busy, setBusy] = useState(false);
  const a = res.data;
  const slice = a?.items ?? [];
  const total = a?.total ?? 0;
  const page = a?.page ?? pageParam;
  const pages = a?.pages ?? 1;
  const from = total ? (page - 1) * AUDIT_PAGE_SIZE + 1 : 0;
  const to = Math.min(page * AUDIT_PAGE_SIZE, total);
  const counts = a?.tabs ?? {};
  const tabLabel = (t) =>
    t.id === 'quota' ? `${counts.quotaPct ?? 0}%` : (counts[t.id] ?? 0).toLocaleString('en-GB');

  const exportCsv = async () => {
    setBusy(true);
    try {
      const out = await agencyAuditExport(tab);
      saveCsv(out.fileName, out.csv);
      log('export csv', { rows: out.rows });
      onToast({
        ...TOASTS.exported,
        body: `${out.fileName} · ${out.rows} events. The export is logged.`,
      });
      res.reload();
    } catch (err) {
      onToast({ title: 'Not exported', body: err?.response?.data?.message || err?.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-[18px] pt-[clamp(0px,0.93vw,16px)]">
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="m-0 font-sans text-[clamp(26px,1.85vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
              Audit log
            </h1>
            <span className="rounded-full bg-[#ebf1ec] px-[10px] py-[4px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {(counts.overview ?? 0).toLocaleString('en-GB')} events
            </span>
          </div>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#737373] max-sm:text-[14px]">
            Every view, query, download and request under your MoU. You can’t edit or delete it.
          </p>
        </div>
        <AgencyButton size="sm" onClick={exportCsv} disabled={busy}>
          {busy ? 'Preparing…' : 'Export CSV'}
        </AgencyButton>
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
                'flex cursor-pointer items-center gap-[8px] border-b-2 px-[14px] pt-[10px] pb-[12px] text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                active
                  ? 'border-[#1c2a21] font-semibold text-[#1c2a21]'
                  : 'border-transparent font-medium text-[#737373]'
              )}
            >
              {t.label}
              <span
                className={classNames(
                  'rounded-full px-[7px] py-px text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold',
                  t.accent && active ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                )}
              >
                {tabLabel(t)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-[8px]">
        {KINDS.map((k) => (
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
            { id: 'grid', Icon: AgencySettingsGridIcon, label: 'Grid view' },
            { id: 'list', Icon: AgencySettingsListIcon, label: 'List view' },
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
        <AgencySettingsClockIcon className="size-[18px] shrink-0 text-[#967014]" />
        <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">
          {a?.nextReport
            ? `Your DPO gets the next access report on ${day(a.nextReport)}.`
            : 'Every action under your MoU is logged here.'}
        </p>
      </div>

      <div id="audit-panel" role="tabpanel" aria-labelledby={`audit-tab-${tab}`}>
        {res.loading && !a ? (
          <p
            role="status"
            className="m-0 rounded-[22px] border border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#595959]"
          >
            Loading the audit log…
          </p>
        ) : slice.length ? (
          <ul
            className={classNames(
              'm-0 list-none p-0',
              grid
                ? 'grid grid-cols-1 gap-[12px] md:grid-cols-2'
                : 'overflow-hidden rounded-[22px] border border-[#e1eae2] bg-white'
            )}
          >
            {slice.map((e) => (
              <AgencyAuditRow key={e.id} event={e} grid={grid} />
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-[22px] border border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#595959]">
            No events match this filter.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[14px]">
          <p role="status" className="m-0 text-[14px] leading-[20px] text-[#737373]">
            Showing {from} to {to} of {total.toLocaleString('en-GB')} events
          </p>
          <div className="flex items-center gap-[8px]">
            <AgencyButton
              size="xs"
              disabled={page <= 1}
              onClick={() => data.update({ page: page - 1 }, { replace: true })}
            >
              Previous
            </AgencyButton>
            <span
              aria-current="page"
              className="flex size-[36px] items-center justify-center rounded-[10px] bg-[#387440] text-[13.5px] font-bold text-white"
            >
              {page}
            </span>
            <AgencyButton
              size="xs"
              disabled={page >= pages}
              onClick={() => data.update({ page: page + 1 }, { replace: true })}
            >
              Next
            </AgencyButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyAuditLogTab;
