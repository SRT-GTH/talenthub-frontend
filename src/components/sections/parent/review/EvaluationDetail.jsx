import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import { EVALUATION } from './data/reviewData.js';

const log = debug('EvaluationDetail');

/*
 * EvaluationDetail — PR-03 "Mr Kwabena Owusu evaluated Elliot" (Figma 10034:146178, card 10034:146789): white, r24, #e7e7e7 hairline, soft shadow, p22, gap14. Head: 48px ink-green avatar "KO"
 * (17/600 white) + 22/600 title (-0.11) over a 13 #575755 line; four question boxes (#f8f8f4, r14, p16, gap4: 13/600 #575755 question over a 15 answer); "Approve · send to Elliot" (primary)
 * + "Don’t show Elliot" (secondary with a red #c0392b label).
 * Props: onApprove, onHide.
 */
const EvaluationDetail = ({ onApprove, onHide }) => {
  log('render');
  return (
    <section
      aria-label="Teacher evaluation"
      className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-black-light bg-white p-[22px] shadow-[0_5px_17px_rgba(28,42,33,0.03)] max-sm:p-[16px]"
    >
      <div className="flex items-center gap-[12px]">
        <span
          aria-hidden="true"
          className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-[#1f4a2b] font-sans text-[17px] leading-[20px] font-semibold text-white"
        >
          {EVALUATION.initials}
        </span>
        <div className="flex min-w-0 flex-col gap-[2px] font-sans">
          <h2 className="m-0 text-[22px] leading-[28px] font-semibold tracking-[-0.11px] text-[#1c2a21] max-sm:text-[20px]">
            {EVALUATION.title}
          </h2>
          <p className="m-0 text-[13px] leading-[16px] text-[#575755] max-lg:text-[12px]">
            {EVALUATION.meta}
          </p>
        </div>
      </div>

      {EVALUATION.answers.map((qa) => (
        <div key={qa.q} className="flex flex-col gap-[4px] rounded-[14px] bg-neutral p-[16px]">
          <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#575755] max-lg:text-[12px]">
            {qa.q}
          </p>
          <p className="m-0 font-sans text-[15px] leading-[18px] text-[#1c2a21]">{qa.a}</p>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-[12px] pt-[8px]">
        <ParentButton onClick={onApprove}>{EVALUATION.approve}</ParentButton>
        <ParentButton
          variant="secondary"
          className="!text-[#c0392b] [&_*]:!text-[#c0392b]"
          onClick={onHide}
        >
          {EVALUATION.hide}
        </ParentButton>
      </div>
    </section>
  );
};

export default EvaluationDetail;
