import { Link } from 'react-router-dom';
import { ACCREDITATION as U } from './data/institutionOnboardingData.js';
import { ArrowRightIcon, CheckFillIcon } from './institutionOnboardingIcons.jsx';

/*
 * InstitutionAccredFooter — the 88 high action bar of the accreditation page (Figma 8596:1198): white, 1px #e7e7e7 top rule, "Back: Verify email" (#e1eae2, 2px #c1d4c4, r14, 16/24 700 #165d3a)
 * at the left margin, "✓ Auto-saved" and the primary "Next: Review →" at the right (grey and disabled until a document is listed).
 * Props: canContinue, onNext, backTo.
 */

const InstitutionAccredFooter = ({
  canContinue,
  onNext,
  backTo = '/institution/sign-up?step=verify',
}) => (
  <footer className="sticky bottom-0 z-20 flex min-h-[88px] w-full items-center justify-between gap-[16px] border-t border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[12px]">
    <Link
      to={backTo}
      className="inline-flex min-h-[52px] items-center rounded-[14px] border-2 border-solid border-[#c1d4c4] bg-[#e1eae2] px-[24px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#165d3a] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      {U.back}
    </Link>
    <div className="flex items-center gap-[16px]">
      <span className="inline-flex items-center gap-[6px] font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-md:hidden">
        <CheckFillIcon className="size-[14px] text-[#387440]" />
        Auto-saved
      </span>
      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="inline-flex min-h-[52px] items-center gap-[8px] rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[28px] py-[14px] font-sans text-[16px] leading-[24px] font-bold tracking-[0.1px] text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:border-[#cccccc] disabled:bg-[#bfbfbf] disabled:shadow-none"
      >
        {U.next}
        <ArrowRightIcon className="size-[20px]" />
      </button>
    </div>
  </footer>
);

export default InstitutionAccredFooter;
