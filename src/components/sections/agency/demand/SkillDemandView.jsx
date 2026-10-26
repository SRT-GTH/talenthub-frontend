import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { agencyDemand } from '../../../../services/agency.api.js';
import { regionById, REGIONS } from '../../publicData/regionsList.js';
import { useAgencyResource } from '../useAgencyResource.js';
import DemandCompactKpis from './DemandCompactKpis.jsx';
import DemandFilterRow from './DemandFilterRow.jsx';
import DemandKpiStrip from './DemandKpiStrip.jsx';
import DemandNote from './DemandNote.jsx';
import DemandRegionList from './DemandRegionList.jsx';
import DemandRegionMapCard from './DemandRegionMapCard.jsx';
import DistrictDemandCard from './DistrictDemandCard.jsx';
import EmergingSkillsCard from './EmergingSkillsCard.jsx';
import SkillBreakdownCard from './SkillBreakdownCard.jsx';
import SkillDemandEmpty from './SkillDemandEmpty.jsx';
import SupplyDemandCard from './SupplyDemandCard.jsx';
import TopSkillsCard from './TopSkillsCard.jsx';
import useMinWidth from './useMinWidth.js';
import { PERIODS, PRIVACY_FOOTNOTE } from './data/demandData.js';

const log = debug('SkillDemandView');

/*
 * SkillDemandView — body of /agency/demand (view=skills), Figma 11.4.5a-d, m, o, p. Live: GET /agency/demand?period=&region=&skill=&category=
 * (opportunities posted on GTH vs the previous period of the same length; talents holding each skill; groups of 1-4 arrive as "<5").
 * URL: skill=<id> · region=<id> (town drill-down inside the region) · category=<cluster id> · period=quarter|30d|12m · modal=filters.
 * >= lg: filter bar · KPI row · map + Top 10 (or towns + Top 10) · breakdown + emerging · supply vs demand. < lg: chips only, four KPI cards,
 * Top 10, region list instead of the map, emerging, supply.
 */

const FILTER_KEYS = ['skill', 'region', 'category'];

const SkillDemandView = ({ data }) => {
  const navigate = useNavigate();
  const desktop = useMinWidth(1024);
  const { params } = data;
  const skillId = params.get('skill');
  const region = params.get('region');
  const category = params.get('category');
  const period = params.get('period') ?? 'quarter';
  const res = useAgencyResource(
    () => agencyDemand({ period, region, skill: skillId, category }),
    [period, region, skillId, category]
  );
  const live = res.data;

  useEffect(() => {
    log('state', { skillId, region, category, period });
  }, [skillId, region, category, period]);

  const change = (key, id) => {
    log('filter', key, id);
    const patch = { [key]: id, state: null };
    data.update(patch, { replace: true });
  };
  const clearAll = () => {
    log('clear all');
    data.update(Object.fromEntries([...FILTER_KEYS, 'state', 'period'].map((k) => [k, null])), {
      replace: true,
    });
  };
  const saveQuery = () => {
    const qs = new URLSearchParams(
      Object.entries({ region, skill: skillId, category }).filter(([, v]) => v)
    ).toString();
    navigate(`/agency/queries?modal=save-query&state=results${qs ? `&${qs}` : ''}`);
  };
  const openRegion = (id) => {
    log('open region', id);
    data.update({ region: id, state: null }, { replace: false });
  };

  const regionName = region ? regionById(region)?.name : null;
  const chips = [
    {
      key: 'region',
      label: 'Region',
      value: region,
      options: REGIONS.map((r) => ({ id: r.id, label: r.name })),
      allLabel: 'All regions',
    },
    {
      key: 'skill',
      label: 'Skill',
      value: skillId,
      options: live?.skillOptions ?? [],
      allLabel: 'All skills',
    },
    {
      key: 'category',
      label: category ? 'Category' : 'Skill category',
      value: category,
      options: live?.categoryOptions ?? [],
      allLabel: 'All categories',
    },
    {
      key: 'period',
      label: PERIODS.find((p) => p.id === period)?.label ?? 'Last quarter',
      value: period,
      options: PERIODS,
      plain: true,
    },
  ];

  const canClear = Boolean(skillId || region || category);
  const filterRow = (
    <DemandFilterRow
      chips={chips}
      onChange={change}
      onMore={() => data.update({ modal: 'filters' })}
      moreActive={data.modal === 'filters'}
      result={live ? live.result : res.loading ? 'Loading…' : ''}
      canClear={canClear}
      onClearAll={clearAll}
      onSaveQuery={saveQuery}
    />
  );

  if (res.error && !live) {
    return (
      <>
        {filterRow}
        <p
          role="alert"
          className="m-0 rounded-[14px] border border-solid border-[#f6e1df] bg-[#f9ebea] p-[16px] font-sans text-[14px] leading-[20px] text-[#902b20]"
        >
          Could not load skill demand. {res.error?.response?.data?.message || res.error.message}{' '}
          <button
            type="button"
            onClick={res.reload}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Try again
          </button>
        </p>
      </>
    );
  }

  if (!live) {
    return (
      <>
        {filterRow}
        <p className="m-0 font-sans text-[14px] text-[#575755]" aria-busy="true">
          Loading skill demand…
        </p>
      </>
    );
  }

  const periodLabel = (PERIODS.find((p) => p.id === period)?.label ?? '').toLowerCase();
  const filtersInWords = [
    regionName,
    live.focus?.name,
    category && chips[2].options.find((o) => o.id === category)?.label,
    periodLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  if (live.empty) {
    return (
      <>
        {filterRow}
        <DemandKpiStrip hero={live.hero} tiles={live.tiles} />
        <SkillDemandEmpty
          hint={filtersInWords}
          message={`No opportunities were posted for ${filtersInWords || 'these filters'}. Try a wider area or a longer period.`}
          onClear={clearAll}
          onWiden={region ? () => change('region', null) : undefined}
        />
        <DemandNote icon="shield" className="mx-auto max-lg:hidden">
          {PRIVACY_FOOTNOTE}
        </DemandNote>
      </>
    );
  }

  const drill = region ? live.districts : null;
  const topRows = live.skills;

  return (
    <>
      {filterRow}
      {drill ? (
        <nav
          aria-label="Region"
          className="hidden justify-center gap-[8px] font-sans text-[13px] leading-[16px] lg:flex"
        >
          <button
            type="button"
            onClick={() => change('region', null)}
            className="min-h-[24px] cursor-pointer bg-transparent p-0 font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            All regions
          </button>
          <span aria-hidden="true" className="text-[#575755]">
            ›
          </span>
          <span aria-current="page" className="font-semibold text-[#1c2a21]">
            {regionName}
          </span>
        </nav>
      ) : null}
      <div className="max-lg:hidden">
        <DemandKpiStrip hero={live.hero} tiles={live.tiles} />
      </div>
      <div className="lg:hidden">
        <DemandCompactKpis tiles={live.compact} />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-x-[20px] lg:grid-cols-1 lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <div className="min-w-0 max-lg:hidden lg:order-1">
          {drill ? (
            <DistrictDemandCard
              title={`Demand by town · ${regionName}`}
              hint={drill.hint}
              rows={drill.rows}
              more={drill.more}
              note={drill.note}
            />
          ) : desktop ? (
            <DemandRegionMapCard
              title={live.focus ? `Demand by region · ${live.focus.name}` : 'Demand by region'}
              hint={live.mapHint}
              opps={live.regionOpps}
              top={live.topRegions}
              regions={live.talentRegions ?? []}
              onOpenRegion={openRegion}
              onCompare={() => navigate('/agency/compare')}
            />
          ) : null}
        </div>
        <div className="min-w-0 lg:order-2">
          <TopSkillsCard
            rows={topRows}
            selectedId={skillId}
            onSelect={(id) => change('skill', id)}
            interactive
            note={live.topNote}
          />
        </div>
        <div className="min-w-0 lg:hidden">
          <DemandRegionList rows={live.topRegions} onOpenRegion={openRegion} />
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-x-[20px] lg:grid-cols-1 lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <div className="min-w-0 max-lg:hidden">
          <SkillBreakdownCard
            rows={live.skills}
            selectedId={skillId}
            onSelect={(id) => change('skill', id)}
            note="Growth compares this period with the one before. It shows once both periods have 5 or more opportunities."
          />
        </div>
        <div className="min-w-0">
          <EmergingSkillsCard
            rows={live.emerging}
            hint={`New in ${periodLabel || 'this period'}`}
            note="Skills with no opportunities in the period before."
          />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SupplyDemandCard
            rows={live.supply}
            selectedId={skillId}
            hint={live.supplyHint}
            hintCompact="Talents per open opportunity"
            note="Shortage means fewer than 3.5 talents per opportunity. Programmes and training can be pointed at these skills."
          />
        </div>
      </div>
      <DemandNote icon="shield" className="mx-auto max-lg:hidden">
        {PRIVACY_FOOTNOTE}
      </DemandNote>
      <DemandNote icon="shield" className="lg:hidden">
        Groups under 5 opportunities show as “&lt;5”.
      </DemandNote>
    </>
  );
};

export default SkillDemandView;
