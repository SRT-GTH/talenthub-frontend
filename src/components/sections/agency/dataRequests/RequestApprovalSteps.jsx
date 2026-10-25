import { classNames } from '../../../../utils/classNames.js';
import { DataRequestIconArrowSmall, DataRequestIconStepCheck } from './dataRequestIcons.jsx';

/*
 * RequestApprovalSteps — the "Approval steps" card (Figma "Get ready" 8597:1388): title + sub + state badge, a progress bar (the gradient fill is
 * 50 % pending, 100 % approved, 25 % for the stopped states) and the four steps. A done step is a 24px green disc with a white tick, an open step a
 * 1.5px grey ring; the step that needs the reader's move carries a green button. The list is an <ol>; the bar is a progressbar.
 * Props: sub, badge, progress (0–100), steps [{ name, done, sub, right, plain, action }], onAction(label).
 */

const RequestApprovalSteps = ({ sub, badge, progress, steps, onAction }) => (
  <section
    aria-labelledby="dr-steps-title"
    className="rounded-[16px] border-[1.5px] border-solid border-white bg-white shadow-[0_1px_2px_rgba(15,15,10,0.05)]"
  >
    <div className="flex flex-col gap-[12px] px-[20px] pt-[18px] pb-[16px] pl-[20px]">
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h2
            id="dr-steps-title"
            className="m-0 font-sans text-[16px] leading-[24px] font-semibold tracking-[0.2px] text-[#142916]"
          >
            Approval steps
          </h2>
          <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#babab7]">
            {sub}
          </p>
        </div>
        <span className="rounded-[8px] bg-[#ebf1ec]/50 px-[10px] py-[6px] font-sans text-[12px] leading-[16px] font-medium tracking-[0.2px] text-[#387440]">
          {badge}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Approval progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-[8px] w-full overflow-hidden rounded-[4px] border border-solid border-[#fefefe] bg-[#f8f8f4]"
      >
        <div
          className="h-full rounded-[4px] bg-[linear-gradient(135deg,#1f4a2b,#3f7f4c)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
    <ol className="m-0 flex list-none flex-col px-[20px] pt-[2px] pb-[10px]">
      {steps.map((step) => (
        <li
          key={step.name}
          className="flex items-center gap-[12px] border-b border-solid border-[#ebf1ec]/40 py-[8px] last:border-b-0"
        >
          {step.done ? (
            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
              <DataRequestIconStepCheck className="size-[13px]" />
              <span className="sr-only">Done</span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="size-[24px] shrink-0 rounded-full border-[1.5px] border-solid border-[#dfdfdc]"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <span
              className={classNames(
                'font-sans tracking-[0.2px]',
                step.plain
                  ? 'text-[14px] leading-[20px] font-normal text-[#babab7]'
                  : 'text-[14px] leading-[24px] font-semibold text-[#2a5730]'
              )}
            >
              {step.name}
            </span>
            {step.sub ? (
              <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#c6c6c3]">
                {step.sub}
              </span>
            ) : null}
          </div>
          {step.action ? (
            <button
              type="button"
              onClick={() => onAction(step.action)}
              className="inline-flex cursor-pointer items-center gap-[6px] rounded-[9px] border-0 bg-[#387440] px-[14px] py-[8px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-white shadow-[0_3px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {step.action}
              <DataRequestIconArrowSmall className="size-[13px]" />
            </button>
          ) : step.right ? (
            <span
              className={classNames(
                'shrink-0 font-sans text-[12px] leading-[20px] tracking-[0.2px]',
                step.plain ? 'font-medium text-[#387440]' : 'text-[#bfbfbf]'
              )}
            >
              {step.right}
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  </section>
);

export default RequestApprovalSteps;
