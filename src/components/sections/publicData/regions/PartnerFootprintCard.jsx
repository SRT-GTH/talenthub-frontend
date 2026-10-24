import PublicCard from '../ui/PublicCard.jsx';
import {
  RegionsIconBook,
  RegionsIconHeart,
  RegionsIconShield,
  RegionsIconSuitcase,
} from './regionsIcons.jsx';
import { PublicIconCompany } from '../publicDataIcons.jsx';

/*
 * PartnerFootprintCard — "Partner footprint" (Figma 8493:1995, 880x225): five tiles (#f2f2ee, r16, p16, gap 6): 20px icon #387440, count 26/31 700,
 * label 13/16 500 #595959 — Schools · Universities · NGOs · Gov. agencies · Employers. Organisation counts are not people, so they print as drawn (Gov. agencies 4); the <5 rule is for talents.
 * Props: partners { aside, tiles [{ label, count }] }.
 */

const ICONS = {
  Schools: RegionsIconBook,
  Universities: PublicIconCompany,
  NGOs: RegionsIconHeart,
  'Gov. agencies': RegionsIconShield,
  Employers: RegionsIconSuitcase,
};

const PartnerFootprintCard = ({ partners }) => (
  <PublicCard
    id="partners"
    title="Partner footprint"
    hint={partners.aside}
    bodyClassName="px-[24px] pb-[24px]"
  >
    <ul className="m-0 grid list-none grid-cols-2 gap-[12px] p-0 font-sans sm:grid-cols-3 md:grid-cols-5">
      {partners.tiles.map((t) => {
        const Icon = ICONS[t.label];
        return (
          <li
            key={t.label}
            className="flex min-w-0 flex-col gap-[6px] rounded-[16px] bg-[#f2f2ee] p-[16px]"
          >
            <Icon className="size-[20px] text-[#387440]" />
            <span className="text-[26px] leading-[31px] font-bold text-[#1c2a21]">{t.count}</span>
            <span className="text-[13px] leading-[16px] font-medium text-[#595959]">{t.label}</span>
          </li>
        );
      })}
    </ul>
  </PublicCard>
);

export default PartnerFootprintCard;
