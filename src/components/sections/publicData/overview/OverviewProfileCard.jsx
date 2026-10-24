import { safeShare } from '../publicDataFormat.js';
import { capabilityValueText } from './data/overviewData.js';
import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import CardSubhead from '../ui/CardSubhead.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';

/*
 * OverviewProfileCard — "Talent profile" (Figma 8487:346231, 668 wide): "Strongest capability · Self-reported + assessed" rows, then
 * "Gender · Self-identified" with the 12px split bar and a shares legend. Desktop and tablet only: the mobile frame 8507:9 draws no such card.
 * Props: capabilities [{ key, label, count }], gender [{ key, label, count }], count (total)
 */

const GENDER_TONES = { female: 'green', male: 'blue', 'not-shared': 'neutral' };

const OverviewProfileCard = ({ capabilities, gender, count }) => {
  const shares = capabilities.map((c) => safeShare(c.count, count));
  const max = Math.max(1, ...shares.map((s) => s ?? 0));
  return (
    <PublicCard
      id="talent-profile"
      title="Talent profile"
      hint="Capabilities & gender"
      className="max-md:hidden"
      bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[28px]"
    >
      <CardSubhead label="Strongest capability" aside="Self-reported + assessed" />
      <BarList label="Strongest capability of the matching talents" gap={12}>
        {capabilities.map((c, i) => (
          <BarRow
            key={c.key}
            label={c.label}
            valueText={capabilityValueText(c.count, count)}
            ratio={(shares[i] ?? 0) / max}
            layout="inline"
          />
        ))}
      </BarList>
      <CardSubhead label="Gender" aside="Self-identified" className="pt-[12px]" />
      <StackedBar
        segments={gender.map((g) => ({ ...g, tone: GENDER_TONES[g.key] }))}
        total={count}
        height={12}
        radius={4}
        showShare={false}
        legend="shares"
        ariaLabel="Gender of the matching talents"
      />
    </PublicCard>
  );
};

export default OverviewProfileCard;
