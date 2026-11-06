import { useCallback, useEffect, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { openApiFile } from '../../../../services/agency.api.js';
import {
  apiMessage,
  institutionAudit,
  institutionAuditExport,
} from '../../../../services/institutionPortal.api.js';
import InstitutionButton from '../InstitutionButton.jsx';
import InstitutionAuditRow from './InstitutionAuditRow.jsx';
import {
  InstitutionSettingsGridIcon,
  InstitutionSettingsListIcon,
} from './institutionSettingsIcons.jsx';
import { AUDIT_KINDS, AUDIT_TABS, TOASTS } from './data/institutionSettingsData.js';

const log = debug('InstitutionAuditLogTab');
const fmt = (n) => Number(n || 0).toLocaleString('en-GB');

/*
 * InstitutionAuditLogTab — Figma 11.6.1g "Audit log" (8746:1175): heading + events pill, tabs All / Roster / Records / Credentials (counts), filter chips,
 * grid / list toggle, the event list, pagination. Live: GET /institution/audit?tab&kind&page (the school's institutionActivity, newest first, 10 a page);
 * "Export CSV" downloads the current tab (POST /institution/audit/export, itself logged). Records and Credentials fill in once those areas go live.
 * The Figma head-of-school summary banner is left out: no summary is sent yet.
 * URL keys (own): view=all|roster|records|credentials (default all), kind=all|download|request, layout=grid, page=n.
 * Props: data (useInstitutionState()), onToast(toast).
 */
const InstitutionAuditLogTab = ({ data, onToast }) => {
  const tab = AUDIT_TABS.find((t) => t.id === data.view)?.id ?? 'all';
  const kindParam = data.params.get('kind');
  const kind = AUDIT_KINDS.some((k) => k.id === kindParam) ? kindParam : 'all';
  const grid = data.params.get('layout') === 'grid';
  const page = Math.max(1, Number(data.params.get('page')) || 1);
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setRes(await institutionAudit({ tab, kind, page }));
    } catch (err) {
      setError(apiMessage(err));
    }
  }, [tab, kind, page]);

  useEffect(() => {
    load();
  }, [load]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const file = await institutionAuditExport(tab);
      openApiFile(file);
      log('export', { tab, rows: file.rows });
      onToast({
        ...TOASTS.exported,
        body: `${file.fileName} · ${file.rows} events. The export itself is logged.`,
      });
      load();
    } catch (err) {
      onToast({ ...TOASTS.failed, body: apiMessage(err) });
    } finally {
      setExporting(false);
    }
  };

  const items = res?.items ?? [];
  const total = res?.total ?? 0;
  const pages = res?.pages ?? 1;
  const from = total ? (page - 1) * 10 + 1 : 0;
  const to = Math.min(page * 10, total);

  return (
    <div className="flex flex-col gap-[18px] pt-[clamp(0px,0.93vw,16px)]">
      <div className="flex flex-wrap items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[3px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h1 className="m-0 font-sans text-[clamp(26px,1.85vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
              Audit log
            </h1>
            <span className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
              {res ? `${fmt(res.tabs.all)} events` : '…'}
            </span>
          </div>
          <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#737373] max-sm:text-[14px]">
            Every roster change, record decision, credential and download by your staff. You can’t
            edit or delete it.
          </p>
        </div>
        <InstitutionButton size="sm" onClick={exportCsv} disabled={exporting}>
          {exporting ? 'Preparing…' : 'Export CSV'}
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
                {res ? fmt(res.tabs[t.id]) : '…'}
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

      <div id="audit-panel" role="tabpanel" aria-labelledby={`audit-tab-${tab}`}>
        {error ? (
          <p
            role="alert"
            className="m-0 rounded-[22px] border border-[#ebc2bd] bg-[#f9ebea] p-[24px] text-[14px] text-[#902b20]"
          >
            Could not load the audit log: {error}{' '}
            <button type="button" className="cursor-pointer font-semibold underline" onClick={load}>
              Try again
            </button>
          </p>
        ) : !res ? (
          <p className="m-0 rounded-[22px] border border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#595959]">
            Loading…
          </p>
        ) : items.length ? (
          <ul
            className={classNames(
              'm-0 list-none p-0',
              grid
                ? 'grid grid-cols-1 gap-[12px] md:grid-cols-2'
                : 'overflow-hidden rounded-[22px] border border-[#e1eae2] bg-white'
            )}
          >
            {items.map((e) => (
              <InstitutionAuditRow key={e.id} event={e} grid={grid} />
            ))}
          </ul>
        ) : (
          <p className="m-0 rounded-[22px] border border-[#e1eae2] bg-white p-[24px] text-[14px] text-[#595959]">
            {tab === 'records' || tab === 'credentials'
              ? 'Nothing here yet. Record decisions and credentials show up once those areas are live.'
              : 'No events match this filter.'}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-[12px] pt-[14px]">
          <p role="status" className="m-0 text-[14px] leading-[20px] text-[#737373]">
            Showing {from} to {to} of {fmt(total)} events
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
