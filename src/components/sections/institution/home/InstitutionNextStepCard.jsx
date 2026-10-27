import { Link } from 'react-router-dom';
import { NEXT_STEP } from './data/institutionHomeData.js';

/*
 * InstitutionNextStepCard — the dark-green "Next step" card (Figma 8585:106, 427 wide, #1f6b3f, 1px #00522b, r16, p 22/23, gap 12): eyebrow 14/15 500 #b9d6c8 (+0.44),
 * title 20/25 600 white, body 16/22 500 #b9cdbd. The whole card links to where the step is done.
 * Live: picks the most useful step from GET /institution/home — guardian consent for under-18s, then students without an invite, then students who have not
 * confirmed yet, otherwise adding more students.
 * Props: home (the /institution/home response or null), className.
 */

const fill = (t, n) => t.replace('{n}', n).replace('{s}', n === 1 ? '' : 's');

const pick = (home) => {
  if (!home) return null;
  if (home.consentNeeded) return { ...NEXT_STEP.consent, n: home.consentNeeded };
  if (home.notInvited) return { ...NEXT_STEP.invite, n: home.notInvited };
  if (home.waitingToConfirm) return { ...NEXT_STEP.waiting, n: home.waitingToConfirm };
  return { ...NEXT_STEP.add, n: home.total };
};

const InstitutionNextStepCard = ({ home, className }) => {
  const step = pick(home);
  const title = step ? fill(step.title, step.n) : 'Loading…';
  return (
    <Link
      to={step?.to ?? '/institution/students'}
      aria-label={`${NEXT_STEP.eyebrow}: ${title}`}
      className={`flex flex-col justify-center gap-[12px] rounded-[16px] border border-solid border-[#00522b] bg-[#1f6b3f] px-[23px] py-[22px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] ${className ?? ''}`}
    >
      <span className="font-sans text-[14px] leading-[15px] font-medium tracking-[0.44px] text-[#b9d6c8]">
        {NEXT_STEP.eyebrow}
      </span>
      <span className="flex flex-col gap-[8px]">
        <span className="font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-white">
          {title}
        </span>
        {step ? (
          <span className="font-sans text-[clamp(14px,1vw+6px,16px)] leading-[1.35] font-medium text-[#b9cdbd]">
            {step.body}
          </span>
        ) : null}
      </span>
    </Link>
  );
};

export default InstitutionNextStepCard;
