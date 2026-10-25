import DemandCard from './DemandCard.jsx';
import ChartLegend from './ChartLegend.jsx';
import ColumnTrendChart from './ColumnTrendChart.jsx';
import DemandNote from './DemandNote.jsx';
import EyeOffNote from './EyeOffNote.jsx';
import { REGION_CODES, REGION_CODES_NOTE, REGION_NAMES } from './data/demandData.js';

/*
 * RegionRateCard — the regional rate chart of Success rates (Figma 8706:715, 808 wide: "Programmes vs recruiter roles" / "Placement rate by region" / "Hire rate by region").
 * 16 region codes (GA AS EA …), one or two 14px bars each (#387440 programmes placed, #9fc3a5 recruiter hired), axis 0-40 % (0-10 % for recruiters), legend and the
 * "Region codes: …" note. With no data (small programme, 11.4.5n) the card shows the eye-off glyph and "Too few to show by region". Props: config { title, hint, axis, series },
 * empty { title, message } (suppressed state), programmeName (hint of the suppressed card).
 */

const RegionRateCard = ({ config, empty, hintOverride }) => {
  const max = config.axis[config.axis.length - 1];
  const [a, b] = config.series;
  return (
    <DemandCard
      id="region-rate"
      title={config.title}
      hint={hintOverride ?? config.hint}
      className="flex flex-col"
      bodyClassName="flex flex-1 flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      {empty ? (
        <EyeOffNote title={empty.title} message={empty.message} />
      ) : (
        <>
          <ColumnTrendChart
            labels={REGION_CODES}
            values={a.values}
            pairs={b?.values}
            yTicks={config.axis}
            yMax={max}
            format={(v) => `${v}%`}
            height={280}
            barWidth={14}
            currentIndex={-1}
            caption={`${config.title}: success rate per region, percent`}
            headers={['Region', a.label, ...(b ? [b.label] : [])]}
            formatCell={(v) => `${v}%`}
            rowNames={REGION_NAMES}
          />
          <ChartLegend
            items={[
              { label: a.label, color: '#387440', kind: 'box' },
              ...(b ? [{ label: b.label, color: '#9fc3a5', kind: 'box' }] : []),
            ]}
          />
          <DemandNote>{REGION_CODES_NOTE}</DemandNote>
        </>
      )}
    </DemandCard>
  );
};

export default RegionRateCard;
