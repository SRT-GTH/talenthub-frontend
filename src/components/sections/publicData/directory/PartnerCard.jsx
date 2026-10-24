import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { labelOf, PARTNER_TYPES, partnerReachedLabel } from './data/directoryData.js';
import { PublicIconPin, PublicIconTarget } from './directoryIcons.jsx';
import Monogram from './Monogram.jsx';
import TypePill from './TypePill.jsx';

/*
 * PartnerCard — one partner of the directory (Figma "partner · …" 8498:106, 437x204: V gap 14, p 22, white, 1px #e7e7e7, r24, shadow 0 5 17).
 *   top    : monogram 52 + name 17/20 600 + type pill (gap 14 / 4)
 *   meta   : pin icon + regions 14/17 · target icon + focus areas 14/17 (icons 16, #70706e, gap 8)
 *   foot   : border-top, pt 12 — "2,400+ talents reached" 13/16 500 #595959 · "View partner →" 14/17 600 #387440
 * Phone (8508:394, 358x74: H gap 12, p 14): monogram 44, name 15/18 + "NGO · Northern · Savannah · North East" 12/14; no meta rows or foot.
 * The whole card is one link (the name is the stretched anchor); hover / focus draws the 2px #387440 border of Figma card 8498:150.
 * Privacy: the reach figure goes through partnerReachedLabel() -> formatCount().
 * Props: partner (see data/directoryData.js PARTNERS).
 */

const PartnerCard = ({ partner, className }) => {
  const typeLabel = labelOf(PARTNER_TYPES, partner.type);
  return (
    <li
      className={classNames(
        'relative flex min-w-0 list-none flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[14px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)] focus-within:border-[#387440] focus-within:shadow-[0_0_0_1px_#387440,0_5px_17px_rgba(0,0,0,0.04)] hover:border-[#387440] hover:shadow-[0_0_0_1px_#387440,0_5px_17px_rgba(0,0,0,0.04)] md:p-[22px]',
        className
      )}
    >
      <div className="flex items-center gap-[12px] md:gap-[14px]">
        <Monogram initials={partner.monogram} color={partner.color} />
        <div className="flex min-w-0 flex-col gap-[2px] md:gap-[4px]">
          <h3 className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21] md:text-[17px] md:leading-[20px]">
            <Link
              to={`/data/partners/${partner.id}`}
              className="rounded-[4px] no-underline outline-none after:absolute after:inset-0 after:rounded-[24px] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#387440]"
            >
              {partner.name}
            </Link>
          </h3>
          <p className="m-0 text-[12px] leading-[14px] text-[#595959] md:hidden">
            {typeLabel} · {partner.regionLabel}
          </p>
          <TypePill type={partner.type} label={typeLabel} className="hidden md:inline-flex" />
        </div>
      </div>
      <div className="hidden flex-col gap-[14px] md:flex">
        <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
          <li className="flex items-center gap-[8px] text-[14px] leading-[17px] text-[#1c2a21]">
            <PublicIconPin className="size-[16px] shrink-0 text-[#70706e]" />
            <span>{partner.regionLabel}</span>
          </li>
          <li className="flex items-center gap-[8px] text-[14px] leading-[17px] text-[#1c2a21]">
            <PublicIconTarget className="size-[16px] shrink-0 text-[#70706e]" />
            <span>{partner.focus.join(' · ')}</span>
          </li>
        </ul>
        <div className="flex items-center justify-between gap-[8px] border-t border-solid border-[#e7e7e7] pt-[12px]">
          <span className="text-[13px] leading-[16px] font-medium text-[#595959]">
            {partnerReachedLabel(partner.reached)} talents reached
          </span>
          <span
            aria-hidden="true"
            className="text-[14px] leading-[17px] font-semibold text-[#387440]"
          >
            View partner →
          </span>
        </div>
      </div>
    </li>
  );
};

export default PartnerCard;
