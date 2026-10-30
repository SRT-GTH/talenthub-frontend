import { Link } from 'react-router-dom';
import PublicCard from '../../publicData/ui/PublicCard.jsx';
import InstitutionPublicMap from './InstitutionPublicMap.jsx';

/*
 * InstitutionPublicSideCards — right column of Figma 11.6.1h (8746:1768): "Where we are" (map 220 wide, the school's region highlighted, + "Town ·
 * Region") and "Open programmes" (#f2f2ee rows + "See all programmes →", which opens the school's Programmes screen in the portal).
 * Props: copy (PUBLIC_PAGE_COPY), caption, region (map region id), open [{id, title, meta}].
 */
const InstitutionPublicSideCards = ({ copy, caption, region, open }) => (
  <>
    <PublicCard
      title={copy.reachTitle}
      bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
    >
      <InstitutionPublicMap
        className="w-[220px] max-w-full"
        label={`Map of Ghana: ${caption}`}
        highlight={region}
      />
      <p className="m-0 text-[14px] leading-[17px] font-medium text-[#1c2a21]">{caption}</p>
    </PublicCard>
    <PublicCard title={copy.openTitle} bodyClassName="flex flex-col gap-[10px] px-[24px] pb-[24px]">
      {open.length ? (
        open.map((o) => (
          <div
            key={o.id}
            className="flex flex-col gap-[2px] rounded-[12px] bg-[#f2f2ee] px-[14px] py-[12px]"
          >
            <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {o.title}
            </span>
            <span className="text-[13px] leading-[16px] text-[#595959]">{o.meta}</span>
          </div>
        ))
      ) : (
        <p className="m-0 text-[14px] leading-[20px] text-[#595959]">{copy.noOpen}</p>
      )}
      <Link
        to="/institution/programmes"
        className="inline-flex min-h-[24px] items-center pt-[2px] text-[14px] leading-[17px] font-semibold text-[#387440] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {copy.all}
      </Link>
    </PublicCard>
  </>
);

export default InstitutionPublicSideCards;
