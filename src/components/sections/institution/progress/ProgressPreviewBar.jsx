import { Link } from 'react-router-dom';
import InstitutionButton from '../InstitutionButton.jsx';
import { INSTITUTION_BASE } from '../institutionNav.js';

/*
 * ProgressPreviewBar — the dark "preview bar" of the student detail (Figma 8595:662, r16, p 12/16/12/20, gap 12): title (15/18 600 white) + line (12/14 #bfbfbf),
 * the two quick actions of the "view as" control (Flag for coaching, Message <first> = the gold #ffd86b segment) and "Back to progress".
 * ⚠️ ASSUMPTION: Figma draws the two segments like a toggle; here they are buttons (Flag opens the flag dialog, Message links to a new message).
 * Props: detail, flagged, onFlag().
 */

const ProgressPreviewBar = ({ detail, flagged, onFlag }) => (
  <section
    aria-label={detail.bar.title}
    className="flex flex-wrap items-center gap-[12px] rounded-[16px] bg-[#1c2a21] py-[12px] pr-[16px] pl-[20px] max-md:gap-[10px] max-md:py-[10px] max-md:pr-[12px] max-md:pl-[14px]"
  >
    <span aria-hidden="true" className="h-[19px] w-[19px] shrink-0 max-md:hidden" />
    <div className="flex min-w-[200px] flex-1 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-white">
        {detail.bar.title}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#bfbfbf]">{detail.bar.sub}</p>
    </div>
    <div className="flex shrink-0 items-center gap-[2px] rounded-[10px] bg-[#1c2a21] p-[3px]">
      <button
        type="button"
        onClick={onFlag}
        disabled={flagged}
        className="cursor-pointer rounded-[8px] border-0 bg-transparent px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#bfbfbf] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b] disabled:cursor-default disabled:opacity-70"
      >
        {flagged ? 'Flagged' : 'Flag for coaching'}
      </button>
      <Link
        to={`${INSTITUTION_BASE}/messages/new`}
        className="rounded-[8px] bg-[#ffd86b] px-[12px] py-[7px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd86b]"
      >
        Message {detail.first}
      </Link>
    </div>
    <InstitutionButton
      size="md"
      to={`${INSTITUTION_BASE}/progress`}
      className="!h-[48px] !font-bold"
    >
      Back to progress
    </InstitutionButton>
  </section>
);

export default ProgressPreviewBar;
