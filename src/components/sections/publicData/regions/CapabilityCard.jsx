import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';

/*
 * CapabilityCard — "Strongest capability" (Figma 8493:1958, 437x314): five bar rows (Technical · Creative · Analytical · Social / caring · Still
 * exploring; the track is full at the largest share, so each bar is share / largest) and the gender line with its 10px split bar
 * (Female #387440 · Male #2a78d6 · Not shared #e4e4df).
 * On narrow cards (the tablet frame 8508:351349 clips this card) the rows stack label over bar instead of clipping.
 * Props: capabilities [{ label, valueText, ratio }], gender { line, segments }.
 */

const CapabilityCard = ({ capabilities, gender }) => (
  <PublicCard
    id="capability"
    title="Strongest capability"
    hint="share of talents"
    bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
  >
    <BarList label="Strongest capability, share of talents" gap={10}>
      {capabilities.map((c) => (
        <BarRow
          key={c.label}
          label={c.label}
          valueText={c.valueText}
          ratio={c.ratio}
          layout="responsive"
        />
      ))}
    </BarList>
    <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
      {gender.line}
    </p>
    <StackedBar
      segments={gender.segments}
      height={10}
      radius={4}
      gap={0}
      showShare={false}
      legend="none"
      ariaLabel="Gender split"
    />
  </PublicCard>
);

export default CapabilityCard;
