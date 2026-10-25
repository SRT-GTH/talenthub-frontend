import BarList from '../../publicData/ui/BarList.jsx';
import BarRow from '../../publicData/ui/BarRow.jsx';
import PublicCard from '../../publicData/ui/PublicCard.jsx';

/*
 * ProgressRatioCard — the two bar-list cards of the class outcomes ("Placements by type" 476 wide with its note, "Partner ecosystem" 668 wide), the
 * Theme 8 card with the bar lengths drawn in Figma (ratio per item; Figma's bars are not proportional to the counts and are kept as drawn).
 * Counts go through BarRow -> formatCount. Props: id, title, hint, label (aria-label of the list), items [{key,label,count,ratio}], note, gap, layout.
 */

const ProgressRatioCard = ({ id, title, hint, label, items, note, gap = 12, layout }) => (
  <PublicCard id={id} title={title} hint={hint}>
    <BarList label={label} gap={gap}>
      {items.map((item) => (
        <BarRow
          key={item.key}
          label={item.label}
          count={item.count}
          ratio={item.ratio}
          layout={layout}
        />
      ))}
    </BarList>
    {note ? (
      <p className="m-0 pt-[12px] font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
        {note}
      </p>
    ) : null}
  </PublicCard>
);

export default ProgressRatioCard;
