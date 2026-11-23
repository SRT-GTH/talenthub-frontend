import { classNames } from '../../../../utils/classNames.js';
import { CircleCheckIcon } from './circleIcons.jsx';
import { CARD, HEADING } from './circleStyles.js';

/*
 * NetworkGrowCard — Figma `Grow your crew` right-rail card (named "Grow your network" on the recruiter canvas): title 18/21, an 8px
 * progress bar (#edf0eb, fill #387440), "2 of 4 done · +20 pts each" (12/600 #785910) and four steps: a 22px circle (done = filled
 * #387440 with a white check, to do = white with a 1.5px #bfbfba ring), the title 12/600 (done = struck through at 55%) and the 12/17 note.
 * Props: grow ({ title, progress, progressPlayful?, doneCount, steps: [{ id, title, body, done }] }), onStep(id) (optional: the step
 * becomes a button), className. `progressPlayful` is the Playful line ("+20 XP each" vs Focused "+20 pts each"): both are in the DOM,
 * one hidden by the `playful:` variant. Playful also rings the bar in 1px #1c2a21 and sets the Bricolage title at 18/22.
 * Used by the talent My crew rail (NW-01 … NW-05, NW-10, NW-11) and the recruiter My network rail.
 * ⚠️ ASSUMPTION: the bar fill is doneCount / steps.length (Figma draws 190 of 378px = 2 of 4).
 */
const NetworkGrowCard = ({ grow, onStep, className }) => {
  const total = grow.steps.length || 1;
  return (
    <section
      aria-labelledby="network-grow-title"
      className={classNames(CARD, 'flex flex-col gap-[20px] p-[20px]', className)}
    >
      <h2
        id="network-grow-title"
        className={classNames(HEADING, 'text-[18px] leading-[21px] playful:leading-[22px]')}
      >
        {grow.title}
      </h2>
      <div
        role="progressbar"
        aria-label={grow.title}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={grow.doneCount}
        className="h-[8px] w-full overflow-hidden rounded-[8px] bg-[#edf0eb] playful:border playful:border-solid playful:border-[#1c2a21]"
      >
        <div
          className="h-full rounded-[8px] bg-[#387440]"
          style={{ width: `${(grow.doneCount / total) * 100}%` }}
        />
      </div>
      <p className="m-0 -mt-[6px] font-sans text-[12px] font-semibold leading-[14px] text-[#785910]">
        {grow.progressPlayful ? (
          <>
            <span className="playful:hidden">{grow.progress}</span>
            <span className="hidden playful:inline">{grow.progressPlayful}</span>
          </>
        ) : (
          grow.progress
        )}
      </p>
      <ul className="m-0 flex list-none flex-col gap-[20px] p-0">
        {grow.steps.map((step) => {
          const content = (
            <>
              <span
                aria-hidden="true"
                className={classNames(
                  'mt-[5px] flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid',
                  step.done
                    ? 'border-[#387440] bg-[#387440] text-white'
                    : 'border-[#bfbfba] bg-white'
                )}
              >
                {step.done && <CircleCheckIcon className="size-[12px]" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[1px] text-left">
                <span
                  className={classNames(
                    'font-sans text-[12px] font-semibold leading-[14px] text-[#1c2a21]',
                    step.done && 'line-through opacity-55'
                  )}
                >
                  {step.title}
                </span>
                <span className="font-sans text-[12px] leading-[17px] text-[#1c2a21] max-lg:text-[13px]">
                  {step.body}
                  {step.done && <span className="sr-only"> (done)</span>}
                </span>
              </span>
            </>
          );
          return (
            <li key={step.id}>
              {onStep ? (
                <button
                  type="button"
                  onClick={() => onStep(step.id)}
                  className="flex min-h-[32px] w-full cursor-pointer items-start gap-[10px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  {content}
                </button>
              ) : (
                <div className="flex min-h-[32px] items-start gap-[10px]">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default NetworkGrowCard;
