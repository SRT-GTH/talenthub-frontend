import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { agencyDemandTrends } from '../../../../services/agency.api.js';
import { useAgencyResource } from '../useAgencyResource.js';
import { REGIONS } from '../../publicData/regionsList.js';
import AssessmentTrendCard from './AssessmentTrendCard.jsx';
import DateRangePopover from './DateRangePopover.jsx';
import DemandFilterRow from './DemandFilterRow.jsx';
import DemandNote from './DemandNote.jsx';
import DemandSegmented from './DemandSegmented.jsx';
import OpportunitiesPostedCard from './OpportunitiesPostedCard.jsx';
import RegionalGrowthCard from './RegionalGrowthCard.jsx';
import SkillTrendCard from './SkillTrendCard.jsx';
import TalentGrowthCard from './TalentGrowthCard.jsx';
import {
  GRANULARITY_BY_RANGE,
  PRIVACY_FOOTNOTE,
  TREND_RANGES,
  TREND_TEXT,
} from './data/demandData.js';
import { liveTicks, rangeText } from './trendModel.js';

const log = debug('TrendsView');

/*
 * TrendsView — body of /agency/demand?view=trends, Figma 11.4.5e-h. Filter bar (chips · result "12 months · compared with the 12 before" · Show by Daily|Weekly|Monthly),
 * Period row (Last 30 days · Last quarter · Year to date · Last 12 months · Custom + the span text), then Talent growth | Opportunities posted | Skill trend | Regional growth |
 * Assessment trend. URL: range=30d|quarter|ytd|12m|custom|long · by=day|week|month · from= to= · modal=date-range · state=generating.
 * Live: GET /agency/demand/trends (raw counts per day / week / month from agencyTalentFacts, opportunities and assessmentresults; any bucket of
 * 1-4 arrives as 0). Every range is computed on request, so there is no background build.
 */

const CATEGORY_OPTIONS = [
  ['technology', 'Technology'],
  ['business-finance', 'Business & Finance'],
  ['health-medical', 'Health & Medical'],
  ['creative-media', 'Creative & Media'],
  ['education-training', 'Education & Training'],
  ['agriculture-agribusiness', 'Agriculture & Agribusiness'],
  ['engineering-construction', 'Engineering & Construction'],
  ['hospitality-tourism', 'Hospitality & Tourism'],
  ['entrepreneurship', 'Entrepreneurship'],
  ['public-service-policy', 'Public Service & Policy'],
].map(([id, label]) => ({ id, label }));

const BY_OPTIONS = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
];

const TrendsView = ({ data }) => {
  const navigate = useNavigate();
  const { params, modal } = data;
  const range = params.get('range') ?? '12m';
  const by = params.get('by');
  const from = params.get('from');
  const to = params.get('to');
  const region = params.get('region');
  const category = params.get('category');
  const periodRef = useRef(null);
  const g = by ?? GRANULARITY_BY_RANGE[range] ?? 'month';

  const returnRef = useMemo(
    () => ({
      get current() {
        return periodRef.current?.querySelector('[role="radio"][aria-checked="true"]') ?? null;
      },
    }),
    []
  );

  useEffect(() => {
    log('state', { range, g });
  }, [range, g]);

  const urlRange = { range, from: from ?? undefined, to: to ?? undefined };
  const info = useMemo(() => rangeText(urlRange, g), [range, from, to, g]); // eslint-disable-line react-hooks/exhaustive-deps
  const res = useAgencyResource(
    () => agencyDemandTrends({ range, by: g, from, to, region, category }),
    [range, g, from, to, region, category]
  );
  const model = res.data ? { ...res.data, ticks: liveTicks(res.data.labels) } : null;
  const unit = model?.unit ?? g;
  const text = TREND_TEXT[unit] ?? {
    ...TREND_TEXT.week,
    regHint: TREND_TEXT.week.regHint.replace('week', 'day'),
    regNote: 'new talents in this period',
    oppNote: 'opportunities in this period',
    current: 'Current day, still filling',
    previous: 'Previous period',
    skillHint: 'Top 5 skills · opportunities per day',
    regionalHint: 'Change in registrations vs the previous period · sorted',
  };

  const change = (key, id) => {
    const patch = { [key]: id };
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
      key: 'category',
      label: 'Skill category',
      value: category,
      options: CATEGORY_OPTIONS,
      allLabel: 'All categories',
    },
  ];
  const canClear = Boolean(region || category);

  const setRange = (id) => {
    log('range', id);
    if (id === 'custom') {
      data.update({ modal: 'date-range' }, { replace: true });
      return;
    }
    data.update(
      { range: id === '12m' ? null : id, by: null, from: null, to: null, state: null, modal: null },
      { replace: true }
    );
  };
  const apply = ({ from: f, to: t, days }) => {
    log('apply range', f, t, days);
    data.update({
      range: days > 90 ? 'long' : 'custom',
      from: f,
      to: t,
      state: null,
      modal: null,
      by: null,
    });
    returnRef.current?.focus();
  };
  const closePopover = () => data.update({ modal: null }, { replace: true });

  const bySegmented = (
    <DemandSegmented
      label="Show by"
      ariaLabel="Show by"
      options={BY_OPTIONS}
      value={g}
      onChange={(id) =>
        data.update({ by: id === GRANULARITY_BY_RANGE[range] ? null : id }, { replace: true })
      }
    />
  );

  return (
    <>
      <DemandFilterRow
        chips={chips}
        onChange={change}
        onMore={() => data.update({ modal: 'filters' })}
        moreActive={modal === 'filters'}
        result={info.result}
        canClear={canClear}
        onClearAll={() => data.update({ region: null, category: null }, { replace: true })}
        onSaveQuery={() => navigate('/agency/queries?modal=save-query&state=results')}
        right={bySegmented}
      />
      <div className="relative flex min-w-0 flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px]">
        <div ref={periodRef} className="min-w-0 max-w-full">
          <DemandSegmented
            label="Period"
            options={TREND_RANGES}
            value={range === 'long' || modal === 'date-range' ? 'custom' : range}
            onChange={setRange}
          />
        </div>
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">{info.bar}</p>
        {modal === 'date-range' ? (
          <DateRangePopover
            from={from}
            to={to}
            onApply={apply}
            onCancel={closePopover}
            returnRef={returnRef}
            className="absolute top-[calc(100%+8px)] z-30 max-lg:left-0 lg:left-[min(562px,calc(100%-414px))]"
          />
        ) : null}
      </div>
      {res.error && !model ? (
        <p
          role="alert"
          className="m-0 rounded-[14px] border border-solid border-[#f6e1df] bg-[#f9ebea] p-[16px] font-sans text-[14px] leading-[20px] text-[#902b20]"
        >
          Could not load the trends. {res.error?.response?.data?.message || res.error.message}{' '}
          <button
            type="button"
            onClick={res.reload}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Try again
          </button>
        </p>
      ) : !model ? (
        <p className="m-0 font-sans text-[14px] text-[#575755]" aria-busy="true">
          Loading trends…
        </p>
      ) : (
        <>
          <div className="grid min-w-0 grid-cols-1 gap-[16px] lg:gap-[24px] xl:grid-cols-2">
            <TalentGrowthCard model={model} text={text} />
            <OpportunitiesPostedCard model={model} text={text} />
            <SkillTrendCard model={model} text={text} />
            <RegionalGrowthCard names={model.regionalNames} values={model.regional} text={text} />
          </div>
          <AssessmentTrendCard model={model} text={text} />
        </>
      )}
      <DemandNote icon="shield" className="mx-auto">
        {PRIVACY_FOOTNOTE}
      </DemandNote>
    </>
  );
};

export default TrendsView;
