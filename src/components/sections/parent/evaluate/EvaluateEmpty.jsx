import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotWard from '../../../../assets/parent/spot-ward.svg';
import { EMPTY, EVALUATE_TITLE } from './data/evaluateData.js';

const log = debug('EvaluateEmpty');

/*
 * EvaluateEmpty — PE-07 "Evaluate · No ward to evaluate yet" (Figma 10042:3861): "Evaluate my child" 34/600, one card (r24, p40, gap 14): the 96 ward spot, "Link a ward to evaluate them" 24/600,
 * the 14 / 1.45 #575755 copy (560 wide), "Link a ward" + "How evaluations work".
 * Props: none. "Link a ward" goes to /parent/link-ward (the link flow built by the link-ward builder); "How evaluations work" only logs (no screen drawn).
 */
const EvaluateEmpty = () => (
  <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
    <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
      {EVALUATE_TITLE}
    </h1>
    <section
      aria-label={EMPTY.title}
      className="flex min-h-[422px] flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(24px,2.31vw,40px)] shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
    >
      <img src={spotWard} alt="" draggable="false" className="size-[96px]" />
      <h2 className="m-0 text-center font-sans text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
        {EMPTY.title}
      </h2>
      <p className="m-0 w-full max-w-[560px] text-center font-sans text-[14px] leading-[1.45] text-[#575755]">
        {EMPTY.body}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[10px]">
        <ParentButton to="/parent/link-ward" onClick={() => log('link a ward')}>
          {EMPTY.primary}
        </ParentButton>
        <ParentButton
          variant="secondary"
          onClick={() => log('how evaluations work (no screen drawn)')}
        >
          {EMPTY.secondary}
        </ParentButton>
      </div>
    </section>
  </div>
);

export default EvaluateEmpty;
