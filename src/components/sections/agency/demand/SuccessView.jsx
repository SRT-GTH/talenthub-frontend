import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { agencyDemandSuccess } from '../../../../services/agency.api.js';
import { REGIONS } from '../../publicData/regionsList.js';
import { useAgencyResource } from '../useAgencyResource.js';
import DemandFilterRow from './DemandFilterRow.jsx';
import DemandKpiStrip from './DemandKpiStrip.jsx';
import DemandNote from './DemandNote.jsx';
import DemandSegmented from './DemandSegmented.jsx';
import JobCategoryTable from './JobCategoryTable.jsx';
import OutcomeFunnelCard from './OutcomeFunnelCard.jsx';
import ProfileGroupCard from './ProfileGroupCard.jsx';
import ProgrammeTable from './ProgrammeTable.jsx';
import RegionRateCard from './RegionRateCard.jsx';
import { PERIODS, SOURCES, SUCCESS_FOOTNOTE } from './data/demandData.js';

const log = debug('SuccessView');

/*
 * SuccessView — body of /agency/demand?view=success, Figma 11.4.5i-l, n. Live: GET /agency/demand/success (applications on GTH joined to their opportunity:
 * government programmes vs recruiter roles; shortlisted / interviewed / hired or placed from the application stage; groups under 5 arrive as "<5", rates
 * only once 5 or more are hired or placed). Filter bar (Region · Programme · period) · Source row · KPI row · funnels · rate by region + by profile group ·
 * your programmes (other agencies as one total) or the recruiter roles by type.
 * URL: source=all|programmes|opportunities · programme=<id> (one of your programmes) · groupby=education|age|readiness · modal=view-by · region= · period=.
 */

const SuccessView = ({ data }) => {
  const navigate = useNavigate();
  const { params, modal } = data;
  const programmeId = params.get('programme');
  const sourceParam = params.get('source') ?? 'all';
  const source = programmeId ? 'programmes' : sourceParam;
  const region = params.get('region');
  const period = params.get('period') ?? 'quarter';
  const groupBy = params.get('groupby') ?? 'education';
  const res = useAgencyResource(
    () => agencyDemandSuccess({ period, source, programme: programmeId, region, groupby: groupBy }),
    [period, source, programmeId, region, groupBy]
  );
  const live = res.data;

  useEffect(() => {
    log('state', { source, programmeId, groupBy, period, region });
  }, [source, programmeId, groupBy, period, region]);

  const change = (key, id) => {
    log('filter', key, id);
    const patch = { [key]: id, state: null };
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
      key: 'programme',
      label: 'Programme',
      value: programmeId,
      options: live?.programmeOptions ?? [],
      allLabel: 'All programmes',
    },
    {
      key: 'period',
      label: PERIODS.find((p) => p.id === period)?.label ?? 'Last quarter',
      value: period,
      options: PERIODS,
      plain: true,
    },
  ];
  const canClear = Boolean(region || programmeId);

  const filterRow = (
    <DemandFilterRow
      chips={chips}
      onChange={change}
      onMore={() => data.update({ modal: 'filters' })}
      moreActive={modal === 'filters'}
      result={live ? live.result : res.loading ? 'Loading…' : ''}
      canClear={canClear}
      onClearAll={() =>
        data.update({ region: null, programme: null, state: null }, { replace: true })
      }
      onSaveQuery={() => navigate('/agency/queries?modal=save-query&state=results')}
    />
  );

  const sourceRow = (
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
      {live ? (
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">{live.range}</p>
      ) : null}
    </div>
  );

  if (!live) {
    return (
      <>
        {filterRow}
        {sourceRow}
        {res.error ? (
          <p
            role="alert"
            className="m-0 rounded-[14px] border border-solid border-[#f6e1df] bg-[#f9ebea] p-[16px] font-sans text-[14px] leading-[20px] text-[#902b20]"
          >
            Could not load success rates. {res.error?.response?.data?.message || res.error.message}{' '}
            <button
              type="button"
              onClick={res.reload}
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
            >
              Try again
            </button>
          </p>
        ) : (
          <p className="m-0 font-sans text-[14px] text-[#575755]" aria-busy="true">
            Loading success rates…
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {filterRow}
      {sourceRow}
      <DemandKpiStrip hero={{ ...live.hero, series: live.spark }} tiles={live.tiles} />
      <OutcomeFunnelCard funnels={live.funnels} />
      <div className="grid min-w-0 grid-cols-1 gap-[16px] lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <RegionRateCard
          config={live.region}
          empty={
            live.regionEmpty
              ? {
                  title: 'Too few to show by region',
                  message:
                    'Every region has fewer than 5 hires or placements in this period. Totals appear above.',
                }
              : null
          }
        />
        <ProfileGroupCard
          rows={live.profileRows}
          view={groupBy}
          onView={(id) =>
            data.update({ groupby: id === 'education' ? null : id, modal: null }, { replace: true })
          }
          menuOpen={modal === 'view-by'}
          onMenuOpen={(open) => data.update({ modal: open ? 'view-by' : null }, { replace: true })}
        />
      </div>
      {source === 'opportunities' ? (
        <JobCategoryTable rows={live.jobRows} />
      ) : (
        <ProgrammeTable rows={live.programmeRows} totals={live.programmeTotals} />
      )}
      <DemandNote icon="shield" className="mx-auto">
        {SUCCESS_FOOTNOTE}
      </DemandNote>
    </>
  );
};

export default SuccessView;
