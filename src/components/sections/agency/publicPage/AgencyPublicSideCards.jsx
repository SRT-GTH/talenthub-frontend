import { Link } from 'react-router-dom';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import AgencyPublicMap from './AgencyPublicMap.jsx';

/* AgencyPublicSideCards — right column of Figma 11.6.1i: "Where they work" (map 220 wide + "All 16 regions") and "Open programmes" (two #f2f2ee rows + link). */
const AgencyPublicSideCards = ({ reach, open }) => (
  <>
    <PublicCard title={reach.title} bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]">
      <AgencyPublicMap className="w-[220px] max-w-full" />
      <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">{reach.caption}</p>
    </PublicCard>
    <PublicCard title={open.title} bodyClassName="flex flex-col gap-[10px] px-[24px] pb-[24px]">
      {open.items.map((o) => (
        <div
          key={o.id}
          className="flex flex-col gap-[2px] rounded-[12px] bg-[#f2f2ee] px-[14px] py-[12px]"
        >
          <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">{o.title}</span>
          <span className="text-[13px] leading-[16px] text-[#595959]">{o.meta}</span>
        </div>
      ))}
      <Link
        to="/agency/programmes"
        className="pt-[2px] text-[14px] leading-[17px] font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {open.all}
      </Link>
    </PublicCard>
  </>
);

export default AgencyPublicSideCards;
