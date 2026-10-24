import BarList from '../ui/BarList.jsx';
import BarRow from '../ui/BarRow.jsx';
import PublicCard from '../ui/PublicCard.jsx';

/*
 * OutcomesPartnersCard — Figma "Partner ecosystem" 8496:224 (668x258): header "Partner ecosystem" · "237 organisations"; bar rows Schools 127 ·
 * Corporate employers 52 · Universities 34 · NGOs 18 · Government agencies 6 (ratio = count / largest; counts through BarRow -> formatCount, so a group
 * under 5 would read "<5"). Not drawn on the phone frame -> hidden below md. Props: partners { hint, items }
 */

const OutcomesPartnersCard = ({ partners, className }) => {
  const max = Math.max(1, ...partners.items.map((i) => i.count));
  return (
    <PublicCard
      id="outcomes-partners"
      title="Partner ecosystem"
      hint={partners.hint}
      className={className}
    >
      <BarList label="Organisations by type" gap={10}>
        {partners.items.map((item) => (
          <BarRow
            key={item.key}
            label={item.label}
            count={item.count}
            ratio={item.count / max}
            layout="inline"
          />
        ))}
      </BarList>
    </PublicCard>
  );
};

export default OutcomesPartnersCard;
