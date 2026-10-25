import KpiStrip from '../../publicData/ui/KpiStrip.jsx';
import KpiTile from '../../publicData/ui/KpiTile.jsx';
import DemandHeroMetric from './DemandHeroMetric.jsx';

/*
 * DemandKpiStrip — "KPI row" (Figma 8702:68: white card r24, hero 440 | divider | three KpiTile 295). Theme 8's KpiStrip + KpiTile around DemandHeroMetric.
 * Props: hero (DemandHeroMetric props), tiles [{ eyebrow, value, sub }].
 */

const DemandKpiStrip = ({ hero, tiles }) => (
  <KpiStrip columns={3} hero={<DemandHeroMetric {...hero} />}>
    {tiles.map((t) => (
      <KpiTile
        key={t.eyebrow}
        eyebrow={t.eyebrow}
        value={<span className="whitespace-nowrap">{t.value}</span>}
        sub={t.sub}
      />
    ))}
  </KpiStrip>
);

export default DemandKpiStrip;
