import HeroMetric from '../ui/HeroMetric.jsx';
import KpiStrip from '../ui/KpiStrip.jsx';
import KpiTile from '../ui/KpiTile.jsx';

/*
 * RegionHeroRow — the "Hero row" of the region / district pages (Figma 8493:1733: 1360x286 white card; hero 440 + three tiles 305; tablet 8508:351365:
 * hero full width over the three tiles). On phones (8507:292 hero + 8507:299 "kpis" 2x2) the same primitives draw their own phone layout, with a fourth
 * tile (partners) that only the phone frames show — so the strip is rendered twice, each shown at its own breakpoint.
 * Props: view (regionsView), loading (the tiles show their skeleton blocks, as the loading frame 8494:8 draws; the hero stays).
 */

const Hero = ({ hero }) => (
  <HeroMetric
    eyebrow={hero.eyebrow}
    count={hero.count}
    label={hero.label}
    change={{ pct: hero.pct, suffix: 'last 30 days' }}
    note={hero.note}
    noteShort={hero.noteShort}
    series={hero.series}
    seriesLabel={hero.seriesLabel}
  />
);

const RegionHeroRow = ({ view, loading = false }) => {
  const { hero, kpis, partnersKpi } = view;
  const tiles = kpis.map((k) => (
    <KpiTile
      key={k.eyebrow}
      eyebrow={k.eyebrow}
      eyebrowShort={k.eyebrowShort}
      count={k.count}
      value={k.value}
      sub={k.sub}
      subShort={k.subShort}
      loading={loading}
    />
  ));
  return (
    <>
      <KpiStrip hero={<Hero hero={hero} />} columns={3} className="max-md:hidden">
        {tiles}
      </KpiStrip>
      <KpiStrip hero={<Hero hero={hero} />} columns={2} className="md:hidden">
        {tiles}
        <KpiTile
          key="partners"
          eyebrow={partnersKpi.eyebrow}
          value={partnersKpi.value}
          loading={loading}
        />
      </KpiStrip>
    </>
  );
};

export default RegionHeroRow;
