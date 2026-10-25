import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS_BY_REGION } from '../../../../constants/ghanaDistricts.js';
import { debug } from '../../../../utils/debug.js';
import { regionById, REGIONS } from '../../publicData/regionsList.js';
import AssessmentTrendCard from './AssessmentTrendCard.jsx';
import BuildingBanner from './BuildingBanner.jsx';
import DateRangePopover from './DateRangePopover.jsx';
import DemandFilterRow from './DemandFilterRow.jsx';
import DemandNote from './DemandNote.jsx';
import DemandSegmented from './DemandSegmented.jsx';
import OpportunitiesPostedCard from './OpportunitiesPostedCard.jsx';
import RegionalGrowthCard from './RegionalGrowthCard.jsx';
import SkillTrendCard from './SkillTrendCard.jsx';
import TalentGrowthCard from './TalentGrowthCard.jsx';
import TrendPreparingCard from './TrendPreparingCard.jsx';
import {
  CATEGORIES,
  EXTRA_DISTRICTS,
  GRANULARITY_BY_RANGE,
  PRIVACY_FOOTNOTE,
  TREND_BUILDING,
  TREND_RANGES,
  TREND_TEXT,
} from './data/demandData.js';
import { rangeText, trendSeries } from './trendModel.js';

const log = debug('TrendsView');

/*
 * TrendsView — body of /agency/demand?view=trends, Figma 11.4.5e-h. Filter bar (chips · result "12 months · compared with the 12 before" · Show by Daily|Weekly|Monthly),
 * Period row (Last 30 days · Last quarter · Year to date · Last 12 months · Custom + the span text), then Talent growth | Opportunities posted | Skill trend | Regional growth |
 * Assessment trend. URL: range=30d|quarter|ytd|12m|custom|long · by=day|week|month · from= to= · modal=date-range · state=generating.
 * A span over 90 days (Apply range, or ?range=long&state=generating) shows the mocked background job: banner + skeleton cards, ⚠️ ASSUMPTION progress 40 % then +10 % / 2 s,
 * then the 22-month view replaces the skeletons.
 */

const BY_OPTIONS = [
  { id: 'day', label: 'Daily' },
  { id: 'week', label: 'Weekly' },
  { id: 'month', label: 'Monthly' },
];

const slug = (n) => n.toLowerCase().replace(/[^a-z]+/g, '-');

const TrendsView = ({ data }) => {
  const navigate = useNavigate();
  const { params, state, modal } = data;
  const generating = state === 'generating';
  const range = generating ? 'long' : (params.get('range') ?? '12m');
  const by = params.get('by');
  const from = params.get('from');
  const to = params.get('to');
  const region = params.get('region');
  const district = params.get('district');
  const category = params.get('category');
  const [progress, setProgress] = useState(40);
  const [notified, setNotified] = useState(false);
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
    log('state', { range, g, generating });
  }, [range, g, generating]);

  useEffect(() => {
    if (!generating) return undefined;
    setProgress(40);
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 10);
        if (next >= 100) {
          log('background build ready');
          data.update({ state: null }, { replace: true });
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating]);

  const urlRange = { range, from: from ?? undefined, to: to ?? undefined };
  const info = useMemo(() => rangeText(urlRange, g), [range, from, to, g]); // eslint-disable-line react-hooks/exhaustive-deps
  const model = useMemo(() => trendSeries({ ...urlRange, by: g }), [range, from, to, g]); // eslint-disable-line react-hooks/exhaustive-deps
  const text = TREND_TEXT[model.unit] ?? {
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
    if (key === 'region') patch.district = null;
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
      key: 'category',
      label: 'Skill category',
      value: category,
      options: CATEGORIES,
      allLabel: 'All categories',
    },
  ];
  const canClear = Boolean(region || district || category);

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
    if (days > 90) {
      data.update({ range: 'long', from: f, to: t, state: 'generating', modal: null, by: null });
    } else {
      data.update({ range: 'custom', from: f, to: t, state: null, modal: null, by: null });
    }
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
        result={generating ? TREND_BUILDING.result : info.result}
        canClear={canClear}
        onClearAll={() =>
          data.update({ region: null, district: null, category: null }, { replace: true })
        }
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
        <p className="m-0 font-sans text-[13px] leading-[16px] text-[#575755]">
          {generating ? TREND_BUILDING.rangeText : info.bar}
        </p>
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
      {generating ? (
        <>
          <BuildingBanner
            progress={progress}
            notified={notified}
            onNotify={() => {
              log('notify');
              setNotified(true);
            }}
            onFallback={() =>
              data.update({ range: 'quarter', by: null, from: null, to: null, state: null })
            }
          />
          <div className="grid min-w-0 grid-cols-1 gap-[16px] lg:grid-cols-2 lg:gap-[24px]">
            {['Talent growth', 'Opportunities posted', 'Skill trend', 'Regional growth'].map(
              (t) => (
                <TrendPreparingCard key={t} title={t} />
              )
            )}
          </div>
        </>
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
