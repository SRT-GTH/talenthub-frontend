import { formatCount, safeShare } from '../publicDataFormat.js';
import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import CardSubhead from '../ui/CardSubhead.jsx';
import ColumnBars from '../ui/ColumnBars.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';

/*
 * OverviewWhoCard — "Who they are" (Figma 8487:346182, 668 wide; mobile 8507:181).
 *   desktop: "Education level · 219,428 total" + the 28px stacked bar with counts legend, then "Age distribution · Median age 21" + 4 columns
 *   mobile : aside "Education"; 24px stacked bar, the legend as one line of names (8507:192), then four "Age 14–17 … 18%" bar rows
 * Props: education [{ key, label, count }], ages [{ key, label, count }], count (total), medianAge
 */

const TONES = ['dark', 'mid', 'light'];

const OverviewWhoCard = ({ education, ages, count, medianAge }) => {
  const segments = education.map((e, i) => ({ ...e, tone: TONES[i] }));
  const total = formatCount(count);
  const ageShares = ages.map((a) => safeShare(a.count, count));
  const maxShare = Math.max(1, ...ageShares.map((s) => s ?? 0));
  return (
    <PublicCard
      id="who-they-are"
      title="Who they are"
      hint="Education & age"
      hintCompact="Education"
      bodyClassName="flex flex-col gap-[12px] px-[16px] pb-[16px] md:gap-[24px] md:px-[24px] md:pb-[28px]"
    >
      <CardSubhead label="Education level" aside={`${total} total`} className="max-md:hidden" />
      <StackedBar
        segments={segments}
        total={count}
        height={28}
        ariaLabel={`Education level of ${total} talents`}
        className="max-md:hidden"
      />
      <div className="flex flex-col gap-[12px] md:hidden">
        <StackedBar
          segments={segments}
          total={count}
          height={24}
          radius={5}
          gap={0}
          legend="none"
          ariaLabel={`Education level of ${total} talents`}
        />
        <p
          aria-hidden="true"
          className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]"
        >
          Pre-tertiary · In-tertiary · Post-tertiary
        </p>
      </div>
      <CardSubhead
        label="Age distribution"
        aside={`Median age ${medianAge}`}
        className="max-md:hidden"
      />
      <ColumnBars
        items={ages}
        total={count}
        ariaLabel={`Age distribution of ${total} talents`}
        className="max-md:hidden"
      />
      <BarList label={`Age distribution of ${total} talents`} gap={12} className="md:hidden">
        {ages.map((a, i) => (
          <BarRow
            key={a.key}
            label={`Age ${a.label}`}
            valueText={ageShares[i] === null ? '<5' : `${ageShares[i]}%`}
            ratio={(ageShares[i] ?? 0) / maxShare}
            layout="stacked"
          />
        ))}
      </BarList>
    </PublicCard>
  );
};

export default OverviewWhoCard;
