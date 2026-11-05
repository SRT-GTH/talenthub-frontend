import { debug } from '../../../../../utils/debug.js';
import StatusPill from '../../../../ui/StatusPill.jsx';
import checkCircle from '../../../../../assets/parent/eval-check-circle.svg';
import timeClock from '../../../../../assets/parent/eval-time-clock.svg';
import { OUTCOME_TITLE } from './data/resultsData.js';

const log = debug('OutcomeScreen');

/*
 * OutcomeScreen — PE-05 "Ward reviewed" (Figma 10034:150136, also the page behind PE-05c 10052:4845) and PE-05b "Published automatically after 7 days" (10052:4434): "Evaluate my child" title,
 * one card (r24, p22, gap 14): green chip, 28/600 heading, 15 #575755 body, then rows (40 tile r12 #eef4ef + 20 icon, 15/600 label, 13 sub, pill: "On profile" green / "Under review" white).
 * Props: content ({chip, heading, body, rows}), onOpenReview (rows of kind 'review' become buttons that call it).
 * ⚠️ ASSUMPTION: Figma draws no trigger for the PE-05c modal; the "Under review" rows open it.
 */
const Row = ({ row, last, onOpenReview }) => {
  const review = row.kind === 'review';
  const border = last ? '' : 'border-0 border-b border-solid border-[#eeeee9]';
  const inner = (
    <>
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eef4ef]">
        <img
          src={review ? timeClock : checkCircle}
          alt=""
          aria-hidden="true"
          className="size-[20px]"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px] text-left leading-[normal]">
        <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">{row.label}</span>
        <span className="font-sans text-[13px] text-[#575755]">{row.sub}</span>
      </span>
      <StatusPill tone={review ? 'pending' : 'active'}>
        {review ? 'Under review' : 'On profile'}
      </StatusPill>
    </>
  );
  if (review && onOpenReview) {
    return (
      <li className={border}>
        <button
          type="button"
          onClick={() => {
            log('open moderation outcome', row.id);
            onOpenReview();
          }}
          className="flex w-full cursor-pointer items-center gap-[14px] border-0 bg-transparent p-0 py-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {inner}
        </button>
      </li>
    );
  }
  return <li className={`flex items-center gap-[14px] py-[14px] ${border}`}>{inner}</li>;
};

const OutcomeScreen = ({ content, onOpenReview }) => {
  log('render', { rows: content.rows.length });
  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
        {OUTCOME_TITLE}
      </h1>
      <section
        aria-label={content.heading}
        className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
      >
        <StatusPill tone="active" className="self-start">
          {content.chip}
        </StatusPill>
        <h2 className="m-0 font-sans text-[28px] leading-[1.25] font-semibold tracking-[-0.14px] text-[#1c2a21] max-sm:text-[22px]">
          {content.heading}
        </h2>
        <p className="m-0 max-w-[1100px] font-sans text-[15px] leading-[normal] text-[#575755]">
          {content.body}
        </p>
        <ul className="m-0 flex list-none flex-col p-0">
          {content.rows.map((r, i) => (
            <Row
              key={r.id}
              row={r}
              last={i === content.rows.length - 1}
              onOpenReview={onOpenReview}
            />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OutcomeScreen;
