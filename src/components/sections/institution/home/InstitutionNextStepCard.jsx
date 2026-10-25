import { Link } from 'react-router-dom';
import { NEXT_STEP as N } from './data/institutionHomeData.js';

/*
 * InstitutionNextStepCard — the dark-green "Next step" card (Figma 8585:106, 427 wide, #1f6b3f, 1px #00522b, r16, p 22/23, gap 12): eyebrow 14/15 500 #b9d6c8 (+0.44),
 * title 20/25 600 white, body 16/22 500 #b9cdbd. The whole card is a link to the records queue (⚠️ ASSUMPTION: Figma draws no link affordance).
 * Props: pending (number, from the session), className.
 */

const InstitutionNextStepCard = ({ pending, className }) => (
  <Link
    to={N.to}
    aria-label={`${N.eyebrow}: ${N.title.replace('{pending}', pending)}`}
    className={`flex flex-col justify-center gap-[12px] rounded-[16px] border border-solid border-[#00522b] bg-[#1f6b3f] px-[23px] py-[22px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${className ?? ''}`}
  >
    <span className="font-sans text-[14px] leading-[15px] font-medium tracking-[0.44px] text-[#b9d6c8]">
      {N.eyebrow}
    </span>
    <span className="flex flex-col gap-[8px]">
      <span className="font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-white">
        {N.title.replace('{pending}', pending)}
      </span>
      <span className="font-sans text-[clamp(14px,1vw+6px,16px)] leading-[1.35] font-medium text-[#b9cdbd]">
        {N.body}
      </span>
    </span>
  </Link>
);

export default InstitutionNextStepCard;
