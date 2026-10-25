import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS_BY_REGION } from '../../../../constants/ghanaDistricts.js';
import { debug } from '../../../../utils/debug.js';
import { regionById, REGIONS } from '../../publicData/regionsList.js';
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
import {
  CATEGORIES,
  EMERGING_SKILLS,
  EMPTY_FILTERS,
  EXTRA_DISTRICTS,
  NATIONAL_KPIS,
  NO_RESULTS,
  PERIODS,
  PRIVACY_FOOTNOTE,
  SHORT_SKILL_NAMES,
  SKILLS,
  SUPPLY_DEMAND,
} from './data/demandData.js';
import { regionDrill, regionOpps, skillFocus } from './demandDerive.js';

const log = debug('SkillDemandView');

/*
 * SkillDemandView — body of /agency/demand (view=skills), Figma 11.4.5a-d, m, o, p.
 * URL: skill=<id> (11.4.5b) · region=<id> (district drill-down, 11.4.5c: Northern is drawn, other regions scale it) · district= · category= · period= ·
 * state=empty (11.4.5d: the two chips of the frame) | suppressed-region (11.4.5m: Drone crop spraying + the Upper West hover card) · modal=filters (More filters drawer).
 * >= lg: filter bar · KPI row · map + Top 10 (or districts + Top 10) · breakdown + emerging · supply vs demand. < lg (phone 360 / tablet 834): chips only,
 * four KPI cards, Top 10 (6 + "Show all 10"), region list instead of the map, emerging (3), supply (4).
 */

const FILTER_KEYS = ['skill', 'region', 'district', 'category'];

const districtOptions = (regionId) => {
  const name = regionById(regionId)?.name;
  const list = name
    ? (DISTRICTS_BY_REGION[name] ?? [])
    : [...(DISTRICTS_BY_REGION.Northern ?? []), ...(DISTRICTS_BY_REGION['Greater Accra'] ?? [])];
  const base = list.map((n) => ({ id: n.toLowerCase().replace(/[^a-z]+/g, '-'), label: n }));
  return regionId === 'north-east' || !regionId ? [...EXTRA_DISTRICTS, ...base] : base;
};

const SkillDemandView = ({ data }) => {
  const navigate = useNavigate();
  const desktop = useMinWidth(1024);
  const { params, state } = data;
  const empty = state === 'empty';
  const suppressedRegion = state === 'suppressed-region';
  const skillId = params.get('skill') ?? (suppressedRegion ? 'drone-crop-spraying' : null);
  const region = params.get('region');
  const district = params.get('district') ?? (empty ? EMPTY_FILTERS.district : null);
  const category = params.get('category') ?? (empty ? EMPTY_FILTERS.category : null);
  const period = params.get('period') ?? 'quarter';
  const focus = useMemo(() => skillFocus(skillId), [skillId]);
  const drill = useMemo(() => (region ? regionDrill(region) : null), [region]);
  const opps = useMemo(() => regionOpps(focus), [focus]);

  useEffect(() => {
    log('state', { skillId, region, district, category, empty });
  }, [skillId, region, district, category, empty]);

  const change = (key, id) => {
    log('filter', key, id);
    const patch = { [key]: id, state: null };
    if (empty) {
      patch.district = district;
      patch.category = category;
      patch[key] = id;
    }
    if (suppressedRegion) patch.skill = skillId;
    if (key === 'region') patch.district = null;
    if (key === 'skill' && id) patch.state = null;
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
      Object.entries({ region, district, skill: skillId, category }).filter(([, v]) => v)
    ).toString();
    navigate(`/agency/queries?modal=save-query&state=results${qs ? `&${qs}` : ''}`);
  };
  const openRegion = (id) => {
    log('open region', id);
    data.update({ region: id, district: null, state: null }, { replace: false });
  };

  const chips = [
    {
      key: 'region',
      label: 'Region',
      value: region,
      options: REGIONS.map((r) => ({ id: r.id, label: r.name })),
      allLabel: 'All regions',
    },
    {
      key: 'district',
      desktopOnly: true,
      label: 'District',
      value: district,
      options: districtOptions(region),
      allLabel: 'All districts',
    },
    focus
      ? {
          key: 'skill',
          label: 'Skill',
          value: skillId,
          options: [...SKILLS, ...EMERGING_SKILLS].map((s) => ({ id: s.id, label: s.name })),
          allLabel: 'All skills',
        }
      : {
          key: 'category',
          label: 'Skill category',
          activeLabel: 'Category',
          value: category,
          options: CATEGORIES,
          allLabel: 'All categories',
        },
    { key: 'period', label: 'Last quarter', value: period, options: PERIODS, plain: true },
  ].map((c) => (c.activeLabel ? { ...c, label: category ? c.activeLabel : c.label } : c));

  const canClear = Boolean(skillId || region || district || category);
  let resultText = NATIONAL_KPIS.result;
  if (empty || (district && category && !region && !skillId)) resultText = '0 opportunities';
  else if (focus) resultText = `${focus.count} opportunities · 1 skill`;
  else if (drill) resultText = drill.result;

  const kpiHero = drill
    ? drill.hero
    : focus
      ? {
          eyebrow: `Opportunities · ${focus.name}`,
          count: focus.count,
          label: focus.heroLabel,
          change: focus.change ?? undefined,
          badge: focus.badge ?? undefined,
          note: focus.note,
        }
      : NATIONAL_KPIS.hero;
  const kpiTiles = drill ? drill.tiles : focus ? focus.tiles : NATIONAL_KPIS.tiles;
  const topRegions = focus ? focus.topRegions : NATIONAL_KPIS.topRegions;
  const mapHint = focus?.mapHint ?? NATIONAL_KPIS.mapHint;
  const mapTitle = focus ? `Demand by region · ${focus.name}` : 'Demand by region';
  const topRows = drill
    ? drill.topSkills.map((s) => ({
        id: undefined,
        name: s.name,
        count: s.count,
      }))
    : SKILLS.map((s) => ({ ...s, short: SHORT_SKILL_NAMES[s.id] }));
  const breakdownRows = drill ? drill.breakdown : SKILLS;
  const emergingRows = drill ? drill.emerging : EMERGING_SKILLS;
  const supplyHint = drill ? drill.supplyHint : NATIONAL_KPIS.supplyHint;
  const topNote = drill ? drill.topNote : (focus?.topNote ?? NATIONAL_KPIS.topNote);
  const onSkill = (id) => change('skill', id);

  const filterRow = (
    <DemandFilterRow
      chips={chips}
      onChange={change}
      onMore={() => data.update({ modal: 'filters' })}
      moreActive={data.modal === 'filters'}
      result={resultText}
      canClear={canClear}
      onClearAll={clearAll}
      onSaveQuery={saveQuery}
    />
  );

  if (empty || (district && category && !focus && !region)) {
    return (
      <>
        {filterRow}
        <DemandKpiStrip hero={NO_RESULTS.hero} tiles={NO_RESULTS.tiles} />
        <SkillDemandEmpty
          onClear={clearAll}
          onWiden={() =>
            data.update({ region: 'northern', district: null, category: null, state: null })
          }
        />
        <DemandNote icon="shield" className="mx-auto max-lg:hidden">
          {PRIVACY_FOOTNOTE}
        </DemandNote>
      </>
    );
  }

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
            {regionById(region)?.name}
          </span>
        </nav>
      ) : null}
      <div className="max-lg:hidden">
        <DemandKpiStrip hero={kpiHero} tiles={kpiTiles} />
      </div>
      <div className="lg:hidden">
        <DemandCompactKpis tiles={NATIONAL_KPIS.compact} />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-1 lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <div className="min-w-0 max-lg:hidden lg:order-1">
          {drill ? (
            <DistrictDemandCard
              title={`Demand by district · ${regionById(region)?.name}`}
              hint={drill.districtsHint}
              rows={drill.districts}
              more={drill.moreDistricts}
              note={drill.districtsNote}
            />
          ) : desktop ? (
            <DemandRegionMapCard
              title={mapTitle}
              hint={mapHint}
              opps={opps}
              top={topRegions}
              forcedHover={suppressedRegion ? 'upper-west' : null}
              onOpenRegion={openRegion}
              onCompare={() => navigate('/agency/compare')}
            />
          ) : null}
        </div>
        <div className="min-w-0 lg:order-2">
          <TopSkillsCard
            rows={topRows}
            selectedId={drill ? null : skillId}
            onSelect={drill ? undefined : onSkill}
            interactive={!drill}
            note={topNote}
          />
        </div>
        <div className="min-w-0 lg:hidden">
          <DemandRegionList rows={topRegions} onOpenRegion={openRegion} />
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:grid-cols-2 lg:grid-cols-1 lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <div className="min-w-0 max-lg:hidden">
          <SkillBreakdownCard
            rows={breakdownRows}
            selectedId={drill ? null : skillId}
            onSelect={drill ? undefined : onSkill}
            note="Growth compares this quarter with last quarter. Skills with fewer than 5 opportunities are grouped as Other."
          />
        </div>
        <div className="min-w-0">
          <EmergingSkillsCard rows={emergingRows} note={drill ? drill.emergingNote : undefined} />
        </div>
        <div className="min-w-0 xl:col-span-2">
          <SupplyDemandCard
            rows={SUPPLY_DEMAND}
            selectedId={drill ? null : skillId}
            hint={supplyHint}
            hintCompact="Talents per open opportunity"
            note="Shortage means fewer than 3.5 talents per opportunity. Programmes and training can be pointed at these skills."
          />
        </div>
      </div>
      <DemandNote icon="shield" className="mx-auto max-lg:hidden">
        {PRIVACY_FOOTNOTE}
      </DemandNote>
      <DemandNote icon="shield" className="lg:hidden">
        Districts under 5 opportunities show as “Too few opportunities to show”.
      </DemandNote>
    </>
  );
};

export default SkillDemandView;
