import { useEffect, useState } from 'react';
import FilterGroups from './FilterGroups.jsx';
import FiltersSheet from './FiltersSheet.jsx';
import JobCard from './JobCard.jsx';
import { FILTER_GROUPS, JOBS, RESULTS } from './OpportunitiesData.js';
import { SORTS, filterJobs, rolesLabel } from './opportunitiesFilter.js';
import FilterSelect from '../../../ui/FilterSelect.jsx';
import { ArrowRightGlyph, ChartBarGlyph, CloseGlyph, FilterGlyph } from './OpportunitiesIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('OpportunitiesListing');
const PAGE_SIZE = 8; // Figma draws 8 role cards before "Load more roles"

const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';

/* Active filters as removable chips (Figma mobile "Filter bar" 7815:306457). */
const activeChips = (state) =>
  FILTER_GROUPS.flatMap((g) =>
    g.options.filter((o) => state[g.key].includes(o.id)).map((o) => ({ ...o, key: g.key }))
  );

/*
 * Section · Listing (Figma 7797:28543 desktop 1728x1117 / tablet 7815:304396 / mobile 7815:305887):
 * xl: 340px filter panel, sticky below the fixed nav (top 124px) while the results scroll; <xl: filter bar (Filters (n) button + removable chips) opening the bottom sheet.
 */
const OpportunitiesListing = ({ state, update, id }) => {
  const chips = activeChips(state);
  const matching = filterJobs(state);

  /* Load more: PAGE_SIZE roles at a time; a new search, filter or sort starts again from the first page. */
  const searchKey = [
    state.type,
    state.q,
    state.loc,
    state.sort,
    state.level,
    state.style,
    state.region,
    state.pay,
  ].join('|');
  const [paging, setPaging] = useState({ key: searchKey, limit: PAGE_SIZE });
  if (paging.key !== searchKey) setPaging({ key: searchKey, limit: PAGE_SIZE });
  const limit = paging.key === searchKey ? paging.limit : PAGE_SIZE;
  const jobs = matching.slice(0, limit);
  const hasMore = matching.length > jobs.length;
  log('render', {
    type: state.type,
    q: state.q,
    chips: chips.length,
    matching: matching.length,
    showing: jobs.length,
    hasMore,
  });

  /* Cards animate in on mount / when a filter brings them back, and fade out before leaving the grid (keeps `leaving` ones rendered ~260ms). */
  const idsKey = jobs.map((j) => j.id).join(',');
  const [shown, setShown] = useState(() => jobs.map((job) => ({ job, leaving: false })));
  useEffect(() => {
    const ids = new Set(idsKey ? idsKey.split(',') : []);
    // new list in the sorted order; roles that dropped out stay at the end briefly to fade out
    setShown((prev) => [
      ...idsKey
        .split(',')
        .filter(Boolean)
        .map((jid) => ({ job: JOBS.find((j) => j.id === jid), leaving: false })),
      ...prev.filter((p) => !ids.has(p.job.id)).map((p) => ({ ...p, leaving: true })),
    ]);
    const t = setTimeout(() => setShown((prev) => prev.filter((p) => !p.leaving)), 260);
    return () => clearTimeout(t);
  }, [idsKey]);

  return (
    <section
      id={id}
      className="bg-[linear-gradient(180deg,#fbf6ea_0%,#f1ede2_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]"
    >
      <div className="mx-auto flex max-w-[1536px] flex-col items-start gap-7 xl:flex-row">
        <aside
          aria-label="Filters"
          className={`hidden w-[340px] shrink-0 flex-col gap-6 rounded-[26px] border-[1.4px] border-[#1c2a21]/[0.32] bg-[#fffdf7] p-[22px] xl:sticky xl:top-[124px] xl:flex xl:max-h-[calc(100dvh-148px)] xl:overflow-y-auto ${CARD_SHADOW}`}
        >
          <h2 className="m-0 font-heading text-[21px] font-semibold leading-[26.25px] text-[#1c2a21]">
            {RESULTS.panelTitle}
          </h2>
          <FilterGroups state={state} update={update} />
        </aside>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <div className="sticky top-[72px] z-20 -mx-5 flex items-center gap-2 bg-[#fbf6ea]/95 px-5 py-3 shadow-[0_6px_12px_-8px_rgba(28,42,33,0.25)] backdrop-blur-md md:top-[88px] md:-mx-10 md:px-10 xl:hidden">
            <button
              type="button"
              onClick={() => update({ filters: '1' })}
              className={`inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-2 rounded-[12px] border-[1.4px] border-[#1c2a21]/[0.32] bg-white py-[9px] pl-[14px] pr-[10px] ${CARD_SHADOW}`}
            >
              <span className="size-[18px] text-[#1c2a21]">
                <FilterGlyph />
              </span>
              <span className="font-sans text-[15px] font-semibold leading-[17.9px] text-[#1c2a21]">
                {RESULTS.filtersButton}
              </span>
              <span className="rounded-[20px] bg-[#ffd86b] px-[7px] py-[2px] font-sans text-[12px] font-semibold leading-[14.3px] text-[#1c2a21]">
                {chips.length}
              </span>
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chips.map((c) => (
                <button
                  key={`${c.key}-${c.id}`}
                  type="button"
                  aria-label={`Remove ${c.label}`}
                  onClick={() => update({ [c.key]: state[c.key].filter((x) => x !== c.id) })}
                  className="inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-[6px] rounded-[20px] border border-[#2e6336]/30 bg-[#e5f2e5] py-2 pl-3 pr-2 font-sans text-[13px] font-medium leading-[15.5px] text-[#2e6336]"
                >
                  {c.label}
                  <span className="size-[14px]">
                    <CloseGlyph />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <p className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21] xl:text-[18px] xl:leading-[21px]">
              {/* was the Figma text "312 roles match your filters": now counts the roles shown */}
              {matching.length
                ? `${rolesLabel(matching.length)} ${RESULTS.headSuffix}`
                : RESULTS.headNone}
            </p>
            <span aria-hidden="true" className="min-w-0 flex-1" />
            {/* Figma draws the chip only ("Sort: Best fit"); the menu reuses FilterSelect (⚠️ ASSUMPTION: options not drawn) */}
            <FilterSelect
              label={`${RESULTS.sortPrefix} ${(SORTS.find((s) => s.value === state.sort) || SORTS[0]).label}`}
              icon={
                <span className="size-[15px] shrink-0">
                  <ChartBarGlyph />
                </span>
              }
              chevron={false}
              options={SORTS}
              value={state.sort}
              onChange={(sort) => {
                log('sort ->', sort);
                update({ sort });
              }}
              menuLabel="Sort roles by"
              ariaLabel="Sort roles"
              width={230}
              className="shrink-0"
              triggerClassName="h-[30px]! gap-[6px]! rounded-full! border-[#e7e7e7]! bg-white! py-[6px]! pl-[10px]! pr-3! text-[13px]! font-semibold! leading-[15.5px]! tracking-normal! text-[#1c2a21]!"
            />
          </div>

          {shown.length ? (
            <div className="grid grid-cols-1 gap-x-4 gap-y-[17px] md:grid-cols-2 md:gap-y-5 xl:gap-y-[33px]">
              {shown.map(({ job, leaving }, i) => (
                <div
                  key={job.id}
                  className={leaving ? 'lp-card-out' : 'lp-card-in'}
                  style={leaving ? undefined : { animationDelay: `${Math.min(i, 8) * 55}ms` }}
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0 rounded-[24px] bg-white/60 p-8 text-center font-sans text-[16px] text-[#595959]">
              No roles match this search.
            </p>
          )}

          {/* only while more roles match than are shown */}
          {hasMore && (
            <button
              type="button"
              onClick={() => {
                log('load more', { from: limit, to: limit + PAGE_SIZE, of: matching.length });
                setPaging({ key: searchKey, limit: limit + PAGE_SIZE });
              }}
              className="mt-[2px] inline-flex h-[52px] w-fit cursor-pointer items-center justify-center rounded-[14px] border-2 border-[#c1d4c4] bg-[#e1eae2] px-[34px] font-sans text-[16px] font-bold leading-6 text-[#165d3a] shadow-[0_1px_2px_rgba(27,36,44,0.12)]"
            >
              {RESULTS.loadMore}
            </button>
          )}
        </div>
      </div>
      <FiltersSheet open={state.sheetOpen} state={state} update={update} />
    </section>
  );
};

export default OpportunitiesListing;
