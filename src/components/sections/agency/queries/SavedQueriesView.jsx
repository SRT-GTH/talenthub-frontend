import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../agencyFormat.js';
import AgencyButton from '../AgencyButton.jsx';
import { SAVED_NOTICE, SAVED_SORTS, SAVED_TABS } from '../data/queriesData.js';
import FilterMenu from '../../publicData/ui/FilterMenu.jsx';
import SavedQueryCard from './SavedQueryCard.jsx';
import {
  QueriesIconChevronDown,
  QueriesIconClock,
  QueriesIconGrid,
  QueriesIconList,
} from './queriesIcons.jsx';
import {
  removeSavedQuery,
  spendQuota,
  togglePausedQuery,
  useQueriesStore,
} from './useQueriesStore.js';

const log = debug('SavedQueriesView');

/*
 * SavedQueriesView — "Saved queries" (Figma 11.5.1e, 8609:2458; the recruiter "Job postings" page re-skinned: no hero, the title row is the page <h1>):
 *   title 32/40 600 + the "4 saved" sticker + "Queries your team saved. Each one reruns ..." · tabs Build — · Recent 12 · Saved 4 · Shared with me 2 ·
 *   toolbar: All 4 · Scheduled 3 · Paused 1 chips, the cards / list toggle, the "Recently run" sort, "Refresh · monthly" · the amber notice
 *   ("“NEET by district” moved by 7% ...") · the card grid (3 columns on desktop, 430 wide).
 * URL keys: tab=recent|saved|shared (default saved), show=scheduled|paused (default all), view=list (default cards), sort=name|talents.
 * ⚠️ ASSUMPTIONS: the Recent and Shared tabs list the same cards (Recent = all, Shared with me = the ones another analyst saved) and keep the drawn counts;
 * the list view is not drawn (a table with the same data); "Refresh · monthly" reruns the monthly queries (uses 1 query of the quota each);
 * Delete removes the card at once (mock, in memory); the fourth saved query is sample content (queriesData.js).
 * Props: data (useAgencyState()).
 */

const SORT_IDS = { 'Recently run': null, Name: 'name', Talents: 'talents' };

const TabCount = ({ children, active }) => (
  <span
    className={classNames(
      'rounded-full px-[7px] py-[1px] text-[11.5px] leading-[14px] font-bold max-lg:text-[12px]',
      active ? 'bg-[#c8951a] text-white' : 'bg-[#ebf1ec] text-[#2d5d33]'
    )}
  >
    {children}
  </span>
);

const SavedQueriesView = ({ data }) => {
  const navigate = useNavigate();
  const { saved } = useQueriesStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [announce, setAnnounce] = useState('');
  const sortRef = useRef(null);
  const sortWrap = useRef(null);
  const tab = ['recent', 'shared'].includes(data.tab) ? data.tab : 'saved';
  const show = ['scheduled', 'paused'].includes(data.params.get('show'))
    ? data.params.get('show')
    : 'all';
  const asList = data.view === 'list';
  const sort = data.params.get('sort');
  const sortLabel =
    Object.keys(SORT_IDS).find((k) => SORT_IDS[k] === (sort || null)) ?? SAVED_SORTS[0];

  useEffect(() => {
    log('mount', { tab, show, asList, count: saved.length });
  }, [tab, show, asList, saved.length]);

  useEffect(() => {
    if (!sortOpen) return undefined;
    const onDown = (e) => {
      if (sortWrap.current && !sortWrap.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [sortOpen]);

  const counts = {
    all: saved.length,
    scheduled: saved.filter((q) => q.status === 'scheduled').length,
    paused: saved.filter((q) => q.status === 'paused').length,
  };

  const visible = useMemo(() => {
    let list = saved;
    if (tab === 'shared') list = list.filter((q) => q.by !== 'Efua Owusu');
    if (show !== 'all') list = list.filter((q) => q.status === show);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'talents') list = [...list].sort((a, b) => b.talents - a.talents);
    return list;
  }, [saved, tab, show, sort]);

  const featuredId = SAVED_NOTICE.queryId;
  const notice = saved.find((q) => q.id === featuredId);

  const setParam = (patch) => data.update(patch, { replace: true });

  const refreshMonthly = () => {
    const due = saved.filter((q) => q.status === 'scheduled' && q.schedule === 'Monthly');
    spendQuota(due.length);
    setAnnounce(
      `Refreshed ${due.length} monthly queries. ${due.length} queries used from your quota.`
    );
  };

  const chip = (id, label) => {
    const active = show === id || (id === 'all' && show === 'all');
    return (
      <button
        key={id}
        type="button"
        aria-pressed={active}
        onClick={() => setParam({ show: id === 'all' ? null : id })}
        className={classNames(
          'inline-flex h-[32px] min-w-[24px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
          active
            ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
            : 'border-[#e1eae2] bg-white text-[#595959]'
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-[24px] font-sans">
      <div className="flex flex-col gap-[3px] pt-[4px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 text-[28px] leading-[36px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
            Saved queries
          </h1>
          <span className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
            {counts.all} saved
          </span>
        </div>
        <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#737373]">
          Queries your team saved. Each one reruns on its schedule and tells you when a number moves
          by more than 5%.
        </p>
      </div>
      <div className="flex flex-col gap-[18px]">
        <div role="tablist" aria-label="Queries" className="flex flex-wrap gap-[4px]">
          {SAVED_TABS.map((t) => {
            const active = t.id === tab;
            const count = t.id === 'saved' ? String(counts.all) : t.count;
            const inner = (
              <>
                <span>{t.label}</span>
                <TabCount active={t.id === 'saved'}>{count}</TabCount>
              </>
            );
            const cls = classNames(
              'inline-flex min-h-[40px] items-center gap-[8px] border-0 border-b-2 border-solid bg-transparent px-[14px] pt-[10px] pb-[10px] font-sans text-[15px] leading-[18px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
              active
                ? 'border-[#1c2a21] font-semibold text-[#1c2a21]'
                : 'border-transparent font-medium text-[#737373]'
            );
            return t.id === 'build' ? (
              <Link key={t.id} to="/agency/queries" className={cls}>
                {inner}
              </Link>
            ) : (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setParam({ tab: t.id === 'saved' ? null : t.id })}
                className={classNames(cls, 'cursor-pointer')}
              >
                {inner}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-[8px]">
          {chip('all', `All ${counts.all}`)}
          {chip('scheduled', `Scheduled ${counts.scheduled}`)}
          {chip('paused', `Paused ${counts.paused}`)}
          <span aria-hidden="true" className="min-w-[8px] flex-1" />
          <div
            role="group"
            aria-label="View"
            className="flex gap-[2px] rounded-[10px] border border-solid border-[#e1eae2] bg-white p-[3px]"
          >
            {[
              ['cards', <QueriesIconGrid key="g" className="size-[16px]" />, 'Cards'],
              ['list', <QueriesIconList key="l" className="size-[16px]" />, 'List'],
            ].map(([id, icon, label]) => {
              const active = (id === 'list') === asList;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  aria-label={label}
                  onClick={() => setParam({ view: id === 'list' ? 'list' : null })}
                  className={classNames(
                    'grid h-[26px] w-[34px] cursor-pointer place-items-center rounded-[7px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    active ? 'bg-[#1c2a21] text-white' : 'bg-transparent text-[#595959]'
                  )}
                >
                  {icon}
                </button>
              );
            })}
          </div>
          <div ref={sortWrap} className="relative">
            <button
              ref={sortRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((v) => !v)}
              className="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white pr-[12px] pl-[14px] font-sans text-[13px] leading-[16px] font-semibold text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {sortLabel}
              <QueriesIconChevronDown className="size-[14px]" />
            </button>
            {sortOpen ? (
              <FilterMenu
                id="saved-sort"
                label="Sort saved queries"
                options={SAVED_SORTS.map((s) => ({ id: s, label: s }))}
                value={sortLabel}
                className="!right-0 !left-auto"
                onSelect={(id) => setParam({ sort: SORT_IDS[id] ?? null })}
                onClose={(reason) => {
                  setSortOpen(false);
                  if (reason !== 'tab') sortRef.current?.focus();
                }}
              />
            ) : null}
          </div>
          <AgencyButton size="xs" onClick={refreshMonthly} className="!h-[34px] !text-[13px]">
            Refresh · monthly
          </AgencyButton>
        </div>
        {notice ? (
          <Link
            to={notice.href}
            className="flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[18px] pl-[14px] text-[14px] leading-[17px] font-medium text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <QueriesIconClock className="size-[18px] shrink-0 text-[#967014]" />
            {SAVED_NOTICE.text}
          </Link>
        ) : null}
        <p role="status" aria-live="polite" className="sr-only">
          {announce}
        </p>
        {visible.length === 0 ? (
          <p className="m-0 rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[24px] text-[14px] leading-[20px] text-[#595959]">
            No saved queries here.
          </p>
        ) : asList ? (
          <div className="overflow-x-auto rounded-[20px] border border-solid border-[#e1eae2] bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-[17px]">
              <caption className="sr-only">Saved queries</caption>
              <thead>
                <tr className="text-[12px] leading-[14px] font-semibold text-[#595959]">
                  <th scope="col" className="px-[18px] py-[12px]">
                    Query
                  </th>
                  <th scope="col" className="px-[18px] py-[12px]">
                    Refresh
                  </th>
                  <th scope="col" className="px-[18px] py-[12px]">
                    Talents
                  </th>
                  <th scope="col" className="px-[18px] py-[12px]">
                    Saved
                  </th>
                  <th scope="col" className="px-[18px] py-[12px]">
                    <span className="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((q) => (
                  <tr
                    key={q.id}
                    className={classNames(
                      'border-t border-solid border-[#efefea]',
                      q.status === 'paused' && 'opacity-60'
                    )}
                  >
                    <th scope="row" className="px-[18px] py-[12px] font-semibold text-[#1c2a21]">
                      {q.title}
                    </th>
                    <td className="px-[18px] py-[12px] text-[#595959]">{q.schedule}</td>
                    <td className="px-[18px] py-[12px] font-semibold text-[#1c2a21]">
                      {formatCount(q.talents)}
                    </td>
                    <td className="px-[18px] py-[12px] text-[#737373]">
                      {q.saved} · {q.by}
                    </td>
                    <td className="px-[18px] py-[12px] text-right">
                      <Link to={q.href} className="font-semibold text-[#387440] hover:underline">
                        Open results
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
            {visible.map((q) => (
              <SavedQueryCard
                key={q.id}
                query={q}
                featured={q.id === featuredId}
                onTogglePause={togglePausedQuery}
                onDelete={(id) => {
                  removeSavedQuery(id);
                  setAnnounce(`Deleted ${q.name}.`);
                }}
                onOpen={(href) => navigate(href)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedQueriesView;
