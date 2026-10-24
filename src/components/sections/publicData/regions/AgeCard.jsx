import ColumnBars from '../ui/ColumnBars.jsx';
import PublicCard from '../ui/PublicCard.jsx';

/*
 * AgeCard — "Age" (Figma 8493:1935, 437x314): four columns (14–17 · 18–24 · 25–29 · 30–35), share above each bar, band below; aside "share of talents".
 * Props: items [{ key, label, count }] (counts; the shares and the "<5" rule come from ColumnBars), ariaLabel.
 * ⚠️ The shared ColumnBars draws 2.2px per point where the region frame draws 2.4 (41 % → 90px instead of 98px); reported as a REQUEST.
 */

const AgeCard = ({ items, ariaLabel }) => (
  <PublicCard id="age" title="Age" hint="share of talents" bodyClassName="px-[24px] pb-[24px]">
    <ColumnBars items={items} ariaLabel={ariaLabel} />
  </PublicCard>
);

export default AgeCard;
