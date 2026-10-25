import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import RegionalMapCard from '../../publicData/map/RegionalMapCard.jsx';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import AgencyButton from '../AgencyButton.jsx';
import AgencyPageHero from '../AgencyPageHero.jsx';
import {
  DEFAULT_SORT,
  SORTS,
  getDistrictRegions,
  getDistricts,
  getRegionTotals,
  districtsCsv,
} from './data/districtsData.js';
import { DistrictsCrumbChevronIcon } from './districtsIcons.jsx';
import DistrictsTable from './DistrictsTable.jsx';
import DistrictsToolbar from './DistrictsToolbar.jsx';

const log = debug('DistrictsView');

/*
 * DistrictsView — the body of /agency/districts (Figma 11.4.2s, frame 9394:19326, 1329 wide column, gap 30): hero "Districts" + "Download CSV" ·
 * breadcrumb "National > Districts" · toolbar + region chips · four KPI tiles · "All districts" table card.
 * State lives in the URL (agencyState.js keys + three own ones): q=<text> · region=<region id> · sort=growth|assessment|placements|name (talents = absent)
 * · page=<n> (1 = absent) · view=map (table = absent). Changing q / region / sort goes back to page 1. All use replace so Back leaves the page.
 * Props: data (useAgencyState()).
 * ⚠️ ASSUMPTIONS (not drawn): the Map view (the shared Theme 8 "Regional distribution" card, shaded by the talents of each region's visible districts;
 *   its "View … details" opens the region page); the empty state (no match); the tiles follow the region filter but not the search text; the CSV is a mock
 *   file of every row matching the current filters.
 */

const VALID_SORTS = SORTS.map((s) => s.id);

const DistrictsView = ({ data }) => {
  const navigate = useNavigate();
  const { update, params } = data;
  const region = data.filters.region || null;
  const q = data.q;
  const sortParam = params.get('sort');
  const sort = VALID_SORTS.includes(sortParam) ? sortParam : DEFAULT_SORT;
  const view = data.view === 'map' ? 'map' : 'table';
  const pageParam = Number(params.get('page')) || 1;
  const [downloaded, setDownloaded] = useState('');

  const { regions, total: allTotal } = useMemo(() => {
    const r = getDistrictRegions();
    return { regions: r.regions, total: r.total };
  }, []);
  const result = useMemo(
    () => getDistricts({ region, sort, q, page: pageParam }),
    [region, sort, q, pageParam]
  );
  const regionTotals = useMemo(() => getRegionTotals(), []);

  useEffect(() => {
    log('state', { region, sort, q, page: result.page, view, total: result.total });
  }, [region, sort, q, result.page, view, result.total]);

  const set = useCallback((patch) => update({ page: null, ...patch }, { replace: true }), [update]);
  const onQuery = useCallback((text) => set({ q: text }), [set]);
  const onRegion = useCallback((id) => set({ region: id }), [set]);
  const onSort = useCallback((id) => set({ sort: id === DEFAULT_SORT ? null : id }), [set]);
  const onView = useCallback(
    (id) => update({ view: id === 'map' ? 'map' : null }, { replace: true }),
    [update]
  );
  const onPage = useCallback(
    (n) => update({ page: n > 1 ? n : null }, { replace: true }),
    [update]
  );

  const download = () => {
    const csv = districtsCsv({ region, sort, q });
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'districts.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    log('csv downloaded', result.total);
    setDownloaded(`Downloaded districts.csv with ${result.total} districts`);
  };

  const { summary } = result;
  const scopeName = result.scope.regionName;

  return (
    <>
      <AgencyPageHero
        title="Districts"
        subtitle="All 261 districts across 16 regions. Pick one to see its talents, skills and outcomes. Counts under 5 are hidden."
        actions={<AgencyButton onClick={download}>Download CSV</AgencyButton>}
      />
      <p role="status" className="sr-only">
        {downloaded}
      </p>
      <nav aria-label="Breadcrumb" className="font-sans">
        <ol className="m-0 flex list-none items-center gap-[8px] p-0 text-[14px] leading-[17px]">
          <li>
            <Link
              to="/agency/national"
              className="font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-lg:text-[13px]"
            >
              National
            </Link>
          </li>
          <li aria-hidden="true" className="flex">
            <DistrictsCrumbChevronIcon className="size-[16px] text-[#595959]" />
          </li>
          <li aria-current="page" className="font-medium text-[#1c2a21] max-lg:text-[13px]">
            Districts
          </li>
        </ol>
      </nav>
      <DistrictsToolbar
        q={q}
        region={region}
        sort={sort}
        view={view}
        regions={regions}
        total={allTotal}
        onQuery={onQuery}
        onRegion={onRegion}
        onSort={onSort}
        onView={onView}
      />
      <KpiStrip columns={4} className="md:p-[8px]">
        <KpiTile
          eyebrow="Districts with talents"
          value={<span className="whitespace-nowrap">{summary.withTalents}</span>}
          sub={`of ${summary.of} districts`}
        />
        <KpiTile
          eyebrow="Fastest growing"
          value={summary.fastest?.name ?? '–'}
          sub={summary.fastest ? `▲ +${summary.fastest.changePct}% in the last 30 days` : null}
          className="[&_p:nth-child(2)]:max-md:break-words"
        />
        <KpiTile
          eyebrow="Best assessment completion"
          value={summary.best?.name ?? '–'}
          sub={
            summary.best
              ? `${summary.best.assessmentPct}% vs ${summary.nationalAssessment}% national`
              : null
          }
        />
        <KpiTile
          eyebrow="Hidden for privacy"
          value={`${summary.hidden} ${summary.hidden === 1 ? 'district' : 'districts'}`}
          sub="fewer than 5 talents each"
        />
      </KpiStrip>
      {view === 'map' ? (
        <RegionalMapCard
          regions={regionTotals}
          onOpenRegion={(id) => navigate(`/agency/regions/${id}`)}
          onCompare={() => navigate('/agency/compare')}
        />
      ) : result.total === 0 ? (
        <EmptyState
          title="No districts match"
          message={`No district${scopeName ? ` in ${scopeName}` : ''} matches “${q}”. Check the spelling, or clear the search.`}
          actionLabel="Clear search"
          onAction={() => set({ q: null, region: null })}
        />
      ) : (
        <DistrictsTable
          items={result.items}
          hidden={result.hidden}
          page={result.page}
          pages={result.pages}
          from={result.from}
          to={result.to}
          total={result.total}
          onPage={onPage}
          sort={sort}
        />
      )}
    </>
  );
};

export default DistrictsView;
