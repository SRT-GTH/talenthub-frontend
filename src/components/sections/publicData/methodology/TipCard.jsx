import { Link } from 'react-router-dom';

/*
 * TipCard — the content of the two dark popovers (Figma 8499:174 / 8499:192): V gap 8; title 15/18 600 #fff, body 13/19 400 #e1eae2,
 * link 13/16 600 #c1d4c4. The link goes to the matching section of the methodology page.
 * Props: title, body, linkLabel, linkTo.
 */

const TipCard = ({ title, body, linkLabel, linkTo }) => (
  <div className="flex flex-col gap-[8px]">
    <p className="m-0 text-[15px] leading-[18px] font-semibold text-white">{title}</p>
    <p className="m-0 text-[13px] leading-[19px] text-[#e1eae2]">{body}</p>
    <Link
      to={linkTo}
      className="mt-[6px] w-fit rounded-[4px] text-[13px] leading-[16px] font-semibold text-[#c1d4c4] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c1d4c4]"
    >
      {linkLabel}
    </Link>
  </div>
);

export default TipCard;
