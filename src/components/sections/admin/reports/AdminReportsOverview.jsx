import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyPageHero from '../../agency/AgencyPageHero.jsx';
import RegionalMapCard from '../../publicData/map/RegionalMapCard.jsx';
import { mapStateFor } from '../../publicData/overview/data/overviewData.js';
import OverviewInterestsCard from '../../publicData/overview/OverviewInterestsCard.jsx';
import OverviewKpis from '../../publicData/overview/OverviewKpis.jsx';
import OverviewProfileCard from '../../publicData/overview/OverviewProfileCard.jsx';
import OverviewWhoCard from '../../publicData/overview/OverviewWhoCard.jsx';
import { useOverviewData } from '../../publicData/overview/useOverviewData.js';
import { useOverviewFilters } from '../../publicData/overview/useOverviewFilters.js';
import { usePublicDataState } from '../../publicData/publicDataState.js';
import EmptyState from '../../publicData/ui/EmptyState.jsx';
import FilterBar from '../../publicData/ui/FilterBar.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
import { REPORTS } from './data/adminReportsData.js';

const log = debug('AdminReportsOverview');

/*
 * AdminReportsOverview — /admin/reports (Figma 7.3.1b "Reports · Choose a report" 8635:547 and 7.3.1c, the page behind their dialogs): the Theme 8 national overview inside the admin
 * chrome — green hero "Reports" + "Generate report" · the filter bar · KPI row · Regional distribution + Career interests · Who they are + Talent profile · Today on GTH strip.
 * Reuses the public data overview blocks and `usePublicDataState` (the same five filter keys: region, edu, interest, age, gender). ⚠️ ASSUMPTION: "Save as link" copies nothing here (no
 * share dialog in the admin) and only logs; regions open the same page's map card (no regional drill-down is drawn for staff).
 * Props: onGenerate().
 */

const HIDE_PHONE_COMPARE = "max-md:[&_button[class*='!w-fit']]:hidden";

const AdminReportsOverview = ({ onGenerate }) => {
  const data = usePublicDataState();
  const navigate = useNavigate();
  const { status, overview, retry } = useOverviewData(data.filters, data.state, data.update);
  const actions = useOverviewFilters(data);
  const mapState = useMemo(
    () => mapStateFor(data.params.get('map'), data.params.get('at'), overview.regions),
    [data.params, overview.regions]
  );
  const resultCount = status === 'zero' ? 0 : status === 'suppressed' ? 3 : overview.count;
  const result = status === 'loading' ? { state: 'loading' } : { count: resultCount };
  const empty = status === 'zero' || status === 'suppressed';

  return (
    <div className="flex flex-col gap-[30px]">
      <AgencyPageHero
        title={REPORTS.title}
        subtitle={REPORTS.subtitle}
        actions={<AgencyButton onClick={onGenerate}>{REPORTS.action}</AgencyButton>}
      />
      <FilterBar
        filters={data.filters}
        onChange={actions.onChange}
        onClearAll={actions.onClearAll}
        onSaveLink={() => log('save as link (no share flow in the admin)')}
        onOpenSheet={actions.sheet.open}
        result={result}
      />
      <p role="status" aria-live="polite" className="sr-only">
        {actions.announce}
      </p>
      {empty ? (
        <EmptyState
          variant={status}
          onAction={status === 'zero' ? actions.onClearAll : actions.onRemoveLast}
        />
      ) : (
        <>
          <OverviewKpis overview={overview} loading={status === 'loading'} />
          <div className="grid min-w-0 grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
            <RegionalMapCard
              regions={mapState.regions}
              forced={mapState.forced}
              filterLabel={mapState.filterLabel}
              loading={status === 'loading'}
              onOpenRegion={(id) => log('open region (no drill-down drawn)', id)}
              onCompare={() => navigate('/data/compare')}
              className={HIDE_PHONE_COMPARE}
            />
            <OverviewInterestsCard
              interests={overview.interests}
              loading={status === 'loading'}
              error={status === 'error'}
              onRetry={retry}
            />
          </div>
          <div className="grid min-w-0 grid-cols-1 items-start gap-[24px] lg:grid-cols-2">
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
          <TodayStrip
            stats={overview.today.map((s, i, all) =>
              i === all.length - 1 ? { ...s, label: 'Alerts', labelShort: 'Alerts' } : s
            )}
          />
        </>
      )}
    </div>
  );
};

export default AdminReportsOverview;
