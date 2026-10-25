import PublicCard from '../../publicData/ui/PublicCard.jsx';
import { formatCount } from '../agencyFormat.js';

/* AgencyPublicImpactCard — "Programmes through GTH" (Figma 8611:3569): four #f2f2ee tiles (r16, p16, Bricolage 26 value + 13/500 label). Counts via formatCount ("<5" rule). */
const AgencyPublicImpactCard = ({ impact }) => (
  <PublicCard title={impact.title} hint={impact.hint}>
    <dl className="m-0 grid grid-cols-2 gap-[12px] xl:grid-cols-4">
      {impact.tiles.map((t) => (
        <div
          key={t.id}
          className="flex flex-col-reverse justify-end gap-[8px] rounded-[16px] bg-[#f2f2ee] p-[16px]"
        >
          <dt className="text-[13px] leading-[16px] font-medium text-[#595959]">{t.label}</dt>
          <dd className="m-0 font-heading text-[26px] leading-[31px] font-semibold tracking-[-0.26px] text-[#1c2a21]">
            {typeof t.value === 'number' ? formatCount(t.value) : t.value}
          </dd>
        </div>
      ))}
    </dl>
  </PublicCard>
);

export default AgencyPublicImpactCard;
