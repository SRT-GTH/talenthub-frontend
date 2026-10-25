import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { getOverview, mapStateFor } from '../../publicData/overview/data/overviewData.js';
import OverviewInterestsCard from '../../publicData/overview/OverviewInterestsCard.jsx';
import OverviewKpis from '../../publicData/overview/OverviewKpis.jsx';
import OverviewProfileCard from '../../publicData/overview/OverviewProfileCard.jsx';
import OverviewWhoCard from '../../publicData/overview/OverviewWhoCard.jsx';
import { useOverviewData } from '../../publicData/overview/useOverviewData.js';
import { useOverviewFilters } from '../../publicData/overview/useOverviewFilters.js';
import RegionalMapCard from '../../publicData/map/RegionalMapCard.jsx';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
import { FILTER_KEYS } from '../agencyState.js';
import AgencyBanner from '../AgencyBanner.jsx';
import AgencyButton from '../AgencyButton.jsx';
import AgencyPageHero from '../AgencyPageHero.jsx';
import AgencyFilterRow from './AgencyFilterRow.jsx';
import BreakdownCard from './BreakdownCard.jsx';
import {
  MOU_VIEW,
  NATIONAL_SUBTITLE,
  PERSONALITY_NOTE,
  PERSONALITY_ROWS,
  SAMPLE_VIEW_ROWS,
  PLACEMENTS_SUB,
} from './data/nationalData.js';
import { extraChipLabel, parseMore, regionIds, serializeMore } from './data/moreFiltersData.js';
import MoreFiltersDrawer from './MoreFiltersDrawer.jsx';

const log = debug('AgencyNationalView');

/*
 * AgencyNationalView — body of /agency/national (Figma 11.4.2a-j, 11.4.6a-g). The Theme 8 overview inside the agency chrome:
 * hero (Download PDF) · filter row (+ More filters, Save as query, Show by) · "Your MoU view" card · KPI row · map + Breakdown ·
 * Who they are + Talent profile · Today strip.
 * URL: region= edu= interest= age= gender= · state=loading|error|zero|suppressed|too-few · map=hover|pinned|keyboard (&at=) · modal=filters|breakdown ·
 * breakdown=interest|personality|education|age · by=daily|weekly|monthly.
 */

const HIDE_PHONE_COMPARE = "max-md:[&_button[class*='!w-fit']]:hidden";

const breakdownRows = (view, overview) => {
  if (view === 'personality') return PERSONALITY_ROWS;
  if (SAMPLE_VIEW_ROWS[view])
    return SAMPLE_VIEW_ROWS[view].map(([label, count]) => ({ key: label, label, count }));
  if (view === 'education') return overview.education.map((e) => ({ ...e }));
  if (view === 'age') return overview.ages.map((a) => ({ ...a }));
  return overview.interests.rows;
};

// classic: the older National data layout drawn behind the briefing-pack dialogs (11.4.4a-h): no "Your MoU view" card, no
// "More filters" / "Show by", "Career interests" instead of the Breakdown card.
const AgencyNationalView = ({ data, classic = false }) => {
  const navigate = useNavigate();
  // several regions (?region=northern,upper-east, 11.4.6b): ⚠️ ASSUMPTION the mock draws the first region's breakdowns with the summed talent count
  const regs = regionIds(data.filters.region);
  const dataFilters = useMemo(
    () => (regs.length > 1 ? { ...data.filters, region: regs[0] } : data.filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.filters, regs.length]
  );
  const { status, overview: base0, retry } = useOverviewData(dataFilters, data.state, data.update);
  const base = useMemo(() => {
    if (regs.length < 2) return base0;
    const sum = regs.reduce((n, id) => n + getOverview({ ...dataFilters, region: id }).count, 0);
    return { ...base0, count: sum, hero: { ...base0.hero, count: sum } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base0, regs.length]);
  const more = parseMore(data.params.get('more'));
  const extras = Object.entries(more).map(([key, value]) => ({
    key,
    label: extraChipLabel(key, value),
  }));
  // agency copy of the placements tile (Figma 11.4.2a)
  const overview = useMemo(
    () => ({
      ...base,
      kpis: {
        ...base.kpis,
        placements: { ...base.kpis.placements, sub: PLACEMENTS_SUB, subShort: PLACEMENTS_SUB },
      },
    }),
    [base]
  );
  const actions = useOverviewFilters(data);
  const [menuOpenLocal, setMenuOpenLocal] = useState(false);
  const view = data.params.get('breakdown') ?? 'interest';
  const menuOpen = menuOpenLocal || data.modal === 'breakdown';
  const granularity = data.params.get('by') ?? 'monthly';

  useEffect(() => {
    log('mount', { status, view, granularity });
  }, [status, view, granularity]);

  const mapState = useMemo(
    () => mapStateFor(data.params.get('map'), data.params.get('at'), overview.regions),
    [data.params, overview.regions]
  );

  const tooFew = data.state === 'too-few';
  const empty = status === 'zero' || status === 'suppressed';
  const resultCount = status === 'zero' ? 0 : status === 'suppressed' ? 3 : overview.count;
  const result = status === 'loading' ? { state: 'loading' } : { count: resultCount };

  const saveQuery = () => {
    const qs = new URLSearchParams(Object.entries(data.filters).filter(([, v]) => v)).toString();
    navigate(`/agency/queries?modal=save-query${qs ? `&${qs}` : ''}&state=results`);
  };

  return (
    <>
      <AgencyPageHero
        title="National data"
        subtitle={NATIONAL_SUBTITLE}
        actions={<AgencyButton to="/agency/briefing?modal=download">Download PDF</AgencyButton>}
      />
      <AgencyFilterRow
        filters={data.filters}
        onChange={actions.onChange}
        onClearAll={() =>
          // one update: two calls in a row would overwrite each other (react-router functional updates are not queued)
          data.update({
            ...Object.fromEntries(FILTER_KEYS.map((k) => [k, null])),
            more: null,
            state: ['zero', 'suppressed'].includes(data.state) ? null : data.state,
          })
        }
        extras={extras}
        onClearExtra={(key) =>
          data.update({ more: serializeMore({ ...more, [key]: null }) || null })
        }
        onSaveQuery={saveQuery}
        onMore={() => data.update({ modal: 'filters' })}
        moreActive={data.modal === 'filters'}
        result={result}
        simple={classic}
        granularity={granularity}
        onGranularity={(g) => data.update({ by: g === 'monthly' ? null : g }, { replace: true })}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {actions.announce}
      </p>
      {!classic && (
        <AgencyBanner
          eyebrow={MOU_VIEW.eyebrow}
          title={MOU_VIEW.title}
          className="justify-center lg:min-h-[173px]"
        >
          {MOU_VIEW.body}
        </AgencyBanner>
      )}
      {empty ? (
        <EmptyState
          variant={status}
          onAction={status === 'zero' ? actions.onClearAll : actions.onRemoveLast}
        />
      ) : (
        <>
          <OverviewKpis overview={overview} loading={status === 'loading'} />
          <div className="grid min-w-0 grid-cols-1 gap-[16px] lg:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
            <RegionalMapCard
              regions={mapState.regions}
              forced={mapState.forced}
              filterLabel={mapState.filterLabel}
              topTitle={data.filters.region ? 'Selected region' : undefined}
              loading={status === 'loading'}
              onOpenRegion={(id) => navigate(`/agency/regions/${id}`)}
              onCompare={() => navigate('/agency/compare')}
              className={HIDE_PHONE_COMPARE}
            />
            {classic ? (
              <OverviewInterestsCard
                interests={overview.interests}
                loading={status === 'loading'}
                error={status === 'error'}
                onRetry={retry}
              />
            ) : (
              <BreakdownCard
                rows={breakdownRows(view, overview)}
                view={view}
                onView={(id) =>
                  data.update(
                    { breakdown: id === 'interest' ? null : id, modal: null },
                    { replace: true }
                  )
                }
                menuOpen={menuOpen}
                onMenuOpen={(open) => {
                  setMenuOpenLocal(open);
                  if (!open && data.modal === 'breakdown')
                    data.update({ modal: null }, { replace: true });
                }}
                note={view === 'personality' ? PERSONALITY_NOTE : null}
                loading={status === 'loading'}
                error={status === 'error'}
                onRetry={retry}
              />
            )}
          </div>
          <div className="grid min-w-0 grid-cols-1 items-start gap-[16px] lg:grid-cols-2 lg:gap-[24px]">
            <OverviewWhoCard
              education={overview.education}
              ages={overview.ages}
              count={overview.count}
              medianAge={overview.medianAge}
            />
            <OverviewProfileCard
              capabilities={overview.capabilities}
              gender={overview.gender}
              count={overview.count}
            />
          </div>
          <TodayStrip stats={overview.today} />
        </>
      )}
      {!classic && <MoreFiltersDrawer data={data} tooFew={tooFew} />}
    </>
  );
};

export default AgencyNationalView;
