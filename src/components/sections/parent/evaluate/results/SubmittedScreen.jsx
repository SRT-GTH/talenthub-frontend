import { debug } from '../../../../../utils/debug.js';
import ParentButton from '../../ParentButton.jsx';
import spotEvaluations from '../../../../../assets/parent/eval-spot-evaluations.svg';
import { SUBMITTED as MOCK } from './data/resultsData.js';

const log = debug('SubmittedScreen');

/*
 * SubmittedScreen — PE-04 "Evaluate · Submitted" (Figma 10034:149508): title "Thank you, Emma" 34/600 + "Submitted" pill (#ebf1ec / #1f4a2b 13/700) + #999 sub,
 * one card (r24, p22, gap 14): Spot · Evaluations 80, "Your key observations" 20/600, four #f8f8f4 r14 rows (label 13/600 #575755, text 15 #1c2a21), "Evaluate Elliot next" + "Back to Home".
 * ⚠️ ASSUMPTION: "Evaluate Elliot next" goes to /parent/evaluate (start screen); "Back to Home" goes to /parent.
 */
// `content` (live) replaces the SUBMITTED copy: { title, pill, sub, heading, observations, next, home }.
const SubmittedScreen = ({ content }) => {
  const SUBMITTED = content || MOCK;
  log('render', { live: Boolean(content) });
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <div className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
            {SUBMITTED.title}
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[normal] font-bold whitespace-nowrap text-[#1f4a2b]">
            {SUBMITTED.pill}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          {SUBMITTED.sub}
        </p>
      </div>
      <section
        aria-label={SUBMITTED.heading}
        className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
      >
        <img src={spotEvaluations} alt="" aria-hidden="true" className="size-[80px]" />
        <h2 className="m-0 font-sans text-[20px] leading-[1.25] font-semibold tracking-[-0.1px] text-[#1c2a21]">
          {SUBMITTED.heading}
        </h2>
        {SUBMITTED.observations.map((o) => (
          <div
            key={o.label}
            className="flex flex-col gap-[2px] rounded-[14px] bg-[#f8f8f4] p-[14px] leading-[normal]"
          >
            <p className="m-0 font-sans text-[13px] font-semibold text-[#575755]">{o.label}</p>
            <p className="m-0 font-sans text-[15px] text-[#1c2a21]">{o.text}</p>
          </div>
        ))}
        <div className="flex flex-wrap gap-[12px]">
          <ParentButton to="/parent/evaluate" onClick={() => log('evaluate next ward')}>
            {SUBMITTED.next}
          </ParentButton>
          <ParentButton variant="secondary" to="/parent" onClick={() => log('back to home')}>
            {SUBMITTED.home}
          </ParentButton>
        </div>
      </section>
    </div>
  );
};

export default SubmittedScreen;
