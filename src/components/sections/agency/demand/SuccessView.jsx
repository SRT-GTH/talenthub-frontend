import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS_BY_REGION } from '../../../../constants/ghanaDistricts.js';
import { debug } from '../../../../utils/debug.js';
import { regionById, REGIONS } from '../../publicData/regionsList.js';
import DemandFilterRow from './DemandFilterRow.jsx';
import DemandKpiStrip from './DemandKpiStrip.jsx';
import DemandNote from './DemandNote.jsx';
import DemandSegmented from './DemandSegmented.jsx';
import JobCategoryTable from './JobCategoryTable.jsx';
import OutcomeFunnelCard from './OutcomeFunnelCard.jsx';
import ProfileGroupCard from './ProfileGroupCard.jsx';
import ProgrammeTable from './ProgrammeTable.jsx';
import RegionRateCard from './RegionRateCard.jsx';
import {
  EXTRA_DISTRICTS,
  FUNNELS,
  GROUP_ROWS,
  PERIODS,
  PROFILE_GROUPS,
  PROGRAMME_ROWS,
  PROGRAMME_TOTALS,
  PROGRAMMES,
  SMALL_PROGRAMME,
  SOURCES,
  SPARKLINE,
  SUCCESS,
  SUCCESS_FOOTNOTE,
} from './data/demandData.js';
import { programmeFocus } from './demandDerive.js';

const log = debug('SuccessView');

/*
 * SuccessView — body of /agency/demand?view=success, Figma 11.4.5i-l, n. Filter bar (Region · District · Programme · Last quarter · More filters) · Source row (All |
 * Government programmes | Recruiter opportunities) · KPI row · Outcome funnel · regional rate chart + Success by profile group (View by menu) · programme table (All /
 * Government programmes) or job-category table (Recruiter opportunities).
 * URL: source=all|programmes|opportunities · programme=<id> (one of your programmes; youth-enterprise-bootcamp has fewer than 5 placed: 11.4.5n) · groupby=<view-by id> ·
 * modal=view-by (menu open) · region= district= period= · state=suppressed (= the Bootcamp selected under Government programmes).
 */

const slug = (n) => n.toLowerCase().replace(/[^a-z]+/g, '-');

const SuccessView = ({ data }) => {
  const navigate = useNavigate();
  const { params, state, modal } = data;
  const suppressedState = state === 'suppressed';
  const programmeId =
    params.get('programme') ?? (suppressedState ? 'youth-enterprise-bootcamp' : null);
  const sourceParam = params.get('source') ?? (suppressedState ? 'programmes' : 'all');
  const source =
    programmeId && sourceParam === 'opportunities'
      ? 'opportunities'
      : programmeId
        ? 'programmes'
        : sourceParam;
  const region = params.get('region');
  const district = params.get('district');
  const period = params.get('period') ?? 'quarter';
  const groupBy = params.get('groupby') ?? 'education';
  const focus = useMemo(() => (programmeId ? programmeFocus(programmeId) : null), [programmeId]);
  const small = programmeId === 'youth-enterprise-bootcamp';
  const cfg = SUCCESS[source] ?? SUCCESS.all;

  useEffect(() => {
    log('state', { source, programmeId, groupBy });
  }, [source, programmeId, groupBy]);

  const change = (key, id) => {
    log('filter', key, id);
    const patch = { [key]: id, state: null };
    if (suppressedState) patch.programme = programmeId;
    if (key === 'region') patch.district = null;
    if (key === 'programme' && id) patch.source = 'programmes';
    data.update(patch, { replace: true });
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
      options: [
        ...EXTRA_DISTRICTS,
        ...(DISTRICTS_BY_REGION[regionById(region)?.name ?? 'Northern'] ?? []).map((n) => ({
          id: slug(n),
          label: n,
        })),
      ],
      allLabel: 'All districts',
    },
    {
      key: 'programme',
      label: 'Programme',
      value: programmeId,
      options: PROGRAMMES,
      allLabel: 'All programmes',
    },
    { key: 'period', label: 'Last quarter', value: period, options: PERIODS, plain: true },
  ];
  const canClear = Boolean(region || district || programmeId);

  const result = small ? SMALL_PROGRAMME.result : (focus?.result ?? cfg.result);
  const hero = small
    ? SMALL_PROGRAMME.hero
    : (focus?.hero ?? {
        eyebrow: cfg.hero.eyebrow,
        value: cfg.hero.value,
        label: cfg.hero.label,
        badge: cfg.hero.change.text,
        note: cfg.hero.note,
      });
  const tiles = small ? SMALL_PROGRAMME.tiles : (focus?.tiles ?? cfg.tiles);
  const funnels = small
    ? [FUNNELS.bootcamp]
    : focus
      ? [focus.funnel]
      : cfg.funnels.map((k) => FUNNELS[k]);
  const regionCfg =
    focus && !small
      ? {
          ...SUCCESS.programmes.region,
          title: 'Placement rate by region',
          hint: focus.row.name,
          series: [{ ...SUCCESS.programmes.region.series[0], values: focus.regionValues }],
        }
      : cfg.region;
  const groupRows = small ? SMALL_PROGRAMME.profileRows : (GROUP_ROWS[groupBy] ?? PROFILE_GROUPS);
  const rows = programmeId ? PROGRAMME_ROWS.filter((r) => r.id === programmeId) : PROGRAMME_ROWS;

  return (
    <>
      <DemandFilterRow
        chips={chips}
        onChange={change}
        onMore={() => data.update({ modal: 'filters' })}
        moreActive={modal === 'filters'}
        result={result}
        canClear={canClear}
        onClearAll={() =>
          data.update(
            { region: null, district: null, programme: null, state: null },
            { replace: true }
          )
        }
        onSaveQuery={() => navigate('/agency/queries?modal=save-query&state=results')}
      />
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px]">
        <DemandSegmented
          label="Source"
          options={SOURCES}
          value={source}
          onChange={(id) =>
            data.update(
              {
                source: id === 'all' ? null : id,
                programme: id === 'opportunities' ? null : programmeId,
                state: null,
              },
              { replace: true }
            )
          }
        />
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">{cfg.range}</p>
      </div>
      <DemandKpiStrip
        hero={{ ...hero, series: small || focus ? (small ? SPARKLINE : SPARKLINE) : SPARKLINE }}
        tiles={tiles}
      />
      <OutcomeFunnelCard funnels={funnels} />
      <div className="grid min-w-0 grid-cols-1 gap-[16px] lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <RegionRateCard
          config={regionCfg}
          empty={
            small
              ? { title: SMALL_PROGRAMME.regionTitle, message: SMALL_PROGRAMME.regionMessage }
              : null
          }
          hintOverride={small ? 'Youth Enterprise Bootcamp' : undefined}
        />
        <ProfileGroupCard
          rows={groupRows}
          view={groupBy}
          onView={(id) =>
            data.update({ groupby: id === 'education' ? null : id, modal: null }, { replace: true })
          }
          menuOpen={modal === 'view-by'}
          onMenuOpen={(open) => data.update({ modal: open ? 'view-by' : null }, { replace: true })}
        />
      </div>
      {source === 'opportunities' ? (
        <JobCategoryTable />
      ) : (
        <ProgrammeTable rows={rows} totals={programmeId ? null : PROGRAMME_TOTALS} />
      )}
      <DemandNote icon="shield" className="mx-auto">
        {SUCCESS_FOOTNOTE}
      </DemandNote>
    </>
  );
};

export default SuccessView;
