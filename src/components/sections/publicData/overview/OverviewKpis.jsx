import HeroMetric from '../ui/HeroMetric.jsx';
import KpiStrip from '../ui/KpiStrip.jsx';
import KpiTile from '../ui/KpiTile.jsx';

/*
 * OverviewKpis — the "KPI row" of Figma 8.2.1a (8487:346010): HeroMetric + Placements made / Scholarships surfaced / Active partners; on the
 * phone (8507:62-84) the hero card plus a 2x2 grid whose fourth tile is "Today · +328 New sign-ups" (hidden from md up, where the Today strip
 * under the cards says the same).
 * Props: overview (getOverview response, ready), loading (the drawn skeleton keeps the hero and skeletons the three tiles, 8488:127).
 */

const OverviewKpis = ({ overview, loading = false }) => {
  const { hero, kpis } = overview;
  return (
    <KpiStrip
      columns={3}
      className="md:[&_.grid>:nth-child(4)]:hidden"
      hero={
        <HeroMetric
          eyebrow={hero.eyebrow}
          count={hero.count}
          label={hero.label}
          change={hero.change}
          note={hero.note}
          noteShort={hero.noteShort}
          series={hero.series}
          seriesLabel="Registrations over the last 90 days, rising"
        />
      }
    >
      <KpiTile
        key="placements"
        eyebrow="Placements made"
        eyebrowShort="Placements"
        count={kpis.placements.count}
        sub={kpis.placements.sub}
        subShort={kpis.placements.subShort}
        loading={loading}
      />
      <KpiTile
        key="scholarships"
        eyebrow="Scholarships surfaced"
        eyebrowShort="Scholarships"
        value={kpis.scholarships.value}
        sub={kpis.scholarships.sub}
        subShort={kpis.scholarships.subShort}
        loading={loading}
      />
      <KpiTile
        key="partners"
        eyebrow="Active partners"
        count={kpis.partners.count}
        sub={kpis.partners.sub}
        subShort={kpis.partners.subShort}
        loading={loading}
      />
      <KpiTile
        key="today"
        eyebrow="Today"
        value={kpis.today.value}
        sub={kpis.today.sub}
        className="md:hidden"
        loading={loading}
      />
    </KpiStrip>
  );
};

export default OverviewKpis;
