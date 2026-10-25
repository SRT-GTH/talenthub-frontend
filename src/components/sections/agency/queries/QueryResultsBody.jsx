import { useNavigate } from 'react-router-dom';
import OverviewProfileCard from '../../publicData/overview/OverviewProfileCard.jsx';
import OverviewWhoCard from '../../publicData/overview/OverviewWhoCard.jsx';
import RegionalMapCard from '../../publicData/map/RegionalMapCard.jsx';
import HeroMetric from '../../publicData/ui/HeroMetric.jsx';
import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import TodayStrip from '../../publicData/ui/TodayStrip.jsx';
import QueryBreakdownCard from './QueryBreakdownCard.jsx';

/*
 * QueryResultsBody — what a query returns (Figma 11.5.1a/b, rows "KPI row" 8597:391011, "map + interests" 8597:391020, "composition", Today strip):
 * the Theme 8 national-data body re-used with the query's numbers: HeroMetric "Query result" + Placements / Scholarships / Partners tiles,
 * the shared RegionalMapCard (the selected regions list as "Selected region"), the Breakdown card (View by), Who they are, Talent profile and
 * "Today on GTH". Every figure comes from runQuery() -> getOverview(); counts under 5 are printed "<5" by the components.
 * The placements sentence adds the success rate the frame draws ("23.4% success rate · ▲ +2.1 pts. ...", ⚠️ sample figure).
 * Props: result (runQuery), filters, view, onView.
 */

const PLACEMENTS_SUB =
  '23.4% success rate · ▲ +2.1 pts. Talents matched into jobs, internships and training.';

const QueryResultsBody = ({ result, filters, view, onView }) => {
  const navigate = useNavigate();
  const { overview } = result;
  const { hero, kpis } = overview;
  return (
    <>
      <KpiStrip
        columns={3}
        className="md:[&_.grid>:nth-child(4)]:hidden"
        hero={
          <HeroMetric
            eyebrow="Query result"
            count={hero.count}
            label={hero.label}
            change={hero.change}
            note={hero.note}
            noteShort={hero.noteShort}
            series={hero.series}
            seriesLabel="Registrations of the matching talents over the last 90 days, rising"
          />
        }
      >
        <KpiTile
          key="placements"
          eyebrow="Placements made"
          eyebrowShort="Placements"
          count={kpis.placements.count}
          sub={PLACEMENTS_SUB}
          subShort="Jobs, internships, training"
        />
        <KpiTile
          key="scholarships"
          eyebrow="Scholarships surfaced"
          eyebrowShort="Scholarships"
          value={kpis.scholarships.value}
          sub={kpis.scholarships.sub}
          subShort={kpis.scholarships.subShort}
        />
        <KpiTile
          key="partners"
          eyebrow="Active partners"
          count={kpis.partners.count}
          sub={kpis.partners.sub}
          subShort={kpis.partners.subShort}
        />
      </KpiStrip>
      <div className="grid min-w-0 grid-cols-1 gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,808fr)_minmax(0,497fr)]">
        <RegionalMapCard
          regions={overview.regions}
          topTitle={filters.region.length ? 'Selected region' : undefined}
          onOpenRegion={(id) => navigate(`/agency/regions/${id}`)}
          onCompare={() => navigate('/agency/compare')}
          className="max-md:[&_button[class*='!w-fit']]:hidden"
        />
        <QueryBreakdownCard
          result={result}
          view={view}
          onView={onView}
          showNote={Object.keys(filters.extras).length > 0}
        />
      </div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-[16px] md:grid-cols-2 md:gap-[24px]">
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
  );
};

export default QueryResultsBody;
