import { classNames } from '../../../../utils/classNames.js';
import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import PublicCard from '../ui/PublicCard.jsx';

/*
 * OutcomesByTypeCard — Figma "Placements by type" 8496:169 (476x343): header "Placements by type" · "Last 12 months" (phone card 8507:507, no hint);
 * bar rows Jobs 1,640 · Internships 1,410 · Training 820 · Apprenticeships 348 (BarRow, ratio = count / largest) and the note
 * "Average time from sign-up to placement: 5.4 months" (13/16 500 #595959). Counts go through BarRow -> formatCount().
 * Props: items [{key,label,count}], note, className
 */

const OutcomesByTypeCard = ({ items, note, className }) => {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <PublicCard
      id="outcomes-by-type"
      title="Placements by type"
      hint="Last 12 months"
      className={classNames(className)}
    >
      <BarList label="Placements by type" gap={12}>
        {items.map((item) => (
          <BarRow key={item.key} label={item.label} count={item.count} ratio={item.count / max} />
        ))}
      </BarList>
      <p className="m-0 pt-[12px] text-[13px] leading-[16px] font-medium text-[#595959]">{note}</p>
    </PublicCard>
  );
};

export default OutcomesByTypeCard;
