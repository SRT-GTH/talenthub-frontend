import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';

/*
 * AgencyQueryCtaCard — the green "For your agency" card at the foot of the region / district pages (Figma 11.4.2k 8605:399743, 456x225): replaces Theme 8's
 * "Find talent" card. #2a5730, r24, p28, gap 12; eyebrow 12/14 600 caps +0.72 #c1d4c4, title 22/26 600 white, body 14/20 #c1d4c4,
 * button "Open in query builder →" (#e1eae2, 2px #c1d4c4, r14, 16/700 #165d3a).
 * Props: title, body, to (query-builder URL), className.
 */

const AgencyQueryCtaCard = ({ title, body, to, className }) => (
  <section
    aria-labelledby="agency-cta-title"
    className={classNames(
      'flex min-w-0 flex-col gap-[12px] rounded-[24px] bg-[#2a5730] p-[28px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
      className
    )}
  >
    <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#c1d4c4] uppercase">
      For your agency
    </p>
    <h2 id="agency-cta-title" className="m-0 text-[22px] leading-[26px] font-semibold text-white">
      {title}
    </h2>
    <p className="m-0 max-w-[400px] text-[14px] leading-[20px] text-[#c1d4c4]">{body}</p>
    <div className="pt-[10px]">
      <Link
        to={to}
        className="inline-flex min-h-[44px] items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[22px] py-[10px] text-[16px] leading-[24px] font-bold text-[#165d3a] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Open in query builder →
      </Link>
    </div>
  </section>
);

export default AgencyQueryCtaCard;
