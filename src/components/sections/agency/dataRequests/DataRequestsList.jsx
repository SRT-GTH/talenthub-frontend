import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../AgencyButton.jsx';
import DataRequestRow from './DataRequestRow.jsx';
import {
  DataRequestIconClock,
  DataRequestIconGrid,
  DataRequestIconList,
} from './dataRequestIcons.jsx';
import {
  LIST_COPY,
  SCOPE_COUNTS,
  SORTS,
  TAB_COUNTS,
  listRequests,
} from './data/dataRequestsData.js';

const log = debug('DataRequestsList');

/*
 * DataRequestsList — /agency/data-requests (Figma 11.4.3a, 8597:8): title + "n pending" sticker + subtitle, status tabs (Pending · Approved · All ·
 * Rejected with counts), scope chips (All · Active · Expired), view toggle (grid / list), sort select, "New request", the access-ending banner and
 * the list card. URL keys: tab=pending|approved|rejected|all (default all) · scope=active|expired · layout=grid|list (default list) · sort=oldest.
 * Counts are the ones the frame draws; requests sent from the form add one to Pending and All (see dataRequestsData). Tabs are a WAI-ARIA tablist
 * (←/→ move). ⚠️ ASSUMPTIONS: "Expired" has no sample request (empty message is mine: "Nothing here yet."); the sort select only reorders the three samples.
 * Props: data (useAgencyState()).
 */

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'all', label: 'All' },
  { id: 'rejected', label: 'Rejected' },
];
const SCOPES = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
];

const DataRequestsList = ({ data }) => {
  const navigate = useNavigate();
  const { params, update } = data;
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'all';
  const scope = SCOPES.some((s) => s.id === params.get('scope')) ? params.get('scope') : 'all';
  const grid = params.get('layout') === 'grid';
  const oldest = params.get('sort') === 'oldest';

  const all = listRequests();
  const extra = all.filter((r) => r.submitted).length;
  const counts = {
    pending: TAB_COUNTS.pending + extra,
    approved: TAB_COUNTS.approved,
    all: TAB_COUNTS.all + extra,
    rejected: TAB_COUNTS.rejected,
  };

  useEffect(() => {
    log('render', { tab, scope, grid, oldest });
  }, [tab, scope, grid, oldest]);

  const rows = useMemo(() => {
    let list = all.filter((r) => (tab === 'all' ? true : r.status === tab));
    if (scope === 'active') list = list.filter((r) => r.status === 'approved');
    if (scope === 'expired') list = [];
    return oldest ? [...list].reverse() : list;
  }, [all, tab, scope, oldest]);

  const showBanner = scope !== 'expired' && (tab === 'all' || tab === 'approved');

  const onTabKey = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = TABS[(index + (event.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    update({ tab: next.id === 'all' ? null : next.id }, { replace: true });
    window.requestAnimationFrame(() => document.getElementById(`dr-tab-${next.id}`)?.focus());
  };

  return (
    <div className="flex min-w-0 flex-col gap-[24px] pt-[4px]">
      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
            {LIST_COPY.title}
          </h1>
          <span
            role="status"
            className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]"
          >
            {counts.pending} pending
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
          {LIST_COPY.subtitle}
        </p>
      </header>

      <div className="flex min-w-0 flex-col gap-[18px]">
        <div
          role="tablist"
          aria-label="Request status"
          className="flex flex-wrap gap-[4px] border-b border-solid border-[#e1eae2]"
        >
          {TABS.map((t, index) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                id={`dr-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => update({ tab: t.id === 'all' ? null : t.id }, { replace: true })}
                onKeyDown={(e) => onTabKey(e, index)}
                className={classNames(
                  '-mb-px flex cursor-pointer items-center gap-[8px] whitespace-nowrap border-0 border-b-[2px] border-solid bg-transparent px-[14px] pt-[10px] pb-[10px] font-sans text-[15px] leading-[18px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]',
                  active
                    ? 'border-[#1c2a21] font-semibold text-[#1c2a21]'
                    : 'border-transparent font-medium text-[#737373]'
                )}
              >
                {t.label}
                <span
                  className={classNames(
                    'rounded-full px-[7px] py-px font-sans text-[11.5px] max-lg:text-[12px] leading-[14px] font-bold',
                    active ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
                  )}
                >
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          <div role="group" aria-label="Scope" className="flex flex-wrap items-center gap-[8px]">
            {SCOPES.map((s) => {
              const active = s.id === scope;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ scope: s.id === 'all' ? null : s.id }, { replace: true })}
                  className={classNames(
                    'h-[32px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    active
                      ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                      : 'border-[#e1eae2] bg-white text-[#595959]'
                  )}
                >
                  {s.label} {s.id === 'all' ? counts.all : SCOPE_COUNTS[s.id]}
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-[8px]">
            <div
              role="group"
              aria-label="Layout"
              className="flex gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
            >
              {[
                { id: 'grid', label: 'Grid view', icon: DataRequestIconGrid },
                { id: 'list', label: 'List view', icon: DataRequestIconList },
              ].map(({ id, label, icon }) => {
                const Icon = icon;
                const active = (id === 'grid') === grid;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={label}
                    aria-pressed={active}
                    onClick={() => update({ layout: id === 'list' ? null : id }, { replace: true })}
                    className={classNames(
                      'flex h-[28px] min-w-[34px] cursor-pointer items-center justify-center rounded-[7px] border-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
                      active ? 'bg-[#1c2a21] text-white' : 'bg-transparent text-[#737373]'
                    )}
                  >
                    <Icon className="size-[16px]" />
                  </button>
                );
              })}
            </div>
            <label className="relative">
              <span className="sr-only">Sort</span>
              <select
                value={oldest ? SORTS[1] : SORTS[0]}
                onChange={(e) =>
                  update({ sort: e.target.value === SORTS[1] ? 'oldest' : null }, { replace: true })
                }
                className="h-[34px] cursor-pointer appearance-none rounded-full border border-solid border-[#e1eae2] bg-white pr-[30px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2 text-[12px] text-[#595959]"
              >
                ▾
              </span>
            </label>
            <AgencyButton
              size="xs"
              className="!h-[34px]"
              onClick={() => navigate('/agency/data-requests/new')}
            >
              New request
            </AgencyButton>
          </div>
        </div>

        {showBanner ? (
          <p className="m-0 flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[14px] pl-[18px] font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
            <DataRequestIconClock className="size-[18px] shrink-0 text-[#967014]" />
            {LIST_COPY.banner}
          </p>
        ) : null}

        <div
          role="tabpanel"
          aria-labelledby={`dr-tab-${tab}`}
          className={classNames(
            'min-w-0',
            !grid && 'rounded-[22px] border border-solid border-[#e1eae2] bg-white'
          )}
        >
          {rows.length ? (
            <ul
              className={classNames(
                'm-0 list-none p-0',
                grid ? 'grid gap-[16px] sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-[4px]'
              )}
            >
              {rows.map((request) => (
                <DataRequestRow key={request.id} request={request} grid={grid} />
              ))}
            </ul>
          ) : (
            <p className="m-0 p-[24px] font-sans text-[14px] leading-[20px] text-[#737373]">
              Nothing here yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRequestsList;
