import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import { mapStateFor } from '../../publicData/overview/data/overviewData.js';
import OverviewKpis from '../../publicData/overview/OverviewKpis.jsx';
import OverviewProfileCard from '../../publicData/overview/OverviewProfileCard.jsx';
import OverviewWhoCard from '../../publicData/overview/OverviewWhoCard.jsx';
import { useOverviewData } from '../../publicData/overview/useOverviewData.js';
import { useOverviewFilters } from '../../publicData/overview/useOverviewFilters.js';
import RegionalMapCard from '../../publicData/map/RegionalMapCard.jsx';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
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

const AgencyNationalView = ({ data }) => {
  const navigate = useNavigate();
  const { status, overview: base, retry } = useOverviewData(data.filters, data.state, data.update);
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
        onClearAll={actions.onClearAll}
        onSaveQuery={saveQuery}
        onMore={() => data.update({ modal: 'filters' })}
        moreActive={data.modal === 'filters'}
        result={result}
        granularity={granularity}
        onGranularity={(g) => data.update({ by: g === 'monthly' ? null : g }, { replace: true })}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {actions.announce}
      </p>
      <AgencyBanner
        eyebrow={MOU_VIEW.eyebrow}
        title={MOU_VIEW.title}
        className="justify-center lg:min-h-[173px]"
      >
        {MOU_VIEW.body}
      </AgencyBanner>
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
      <MoreFiltersDrawer data={data} tooFew={tooFew} />
    </>
  );
};

export default AgencyNationalView;
