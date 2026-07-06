import { classNames } from '../../utils/classNames.js';

/*
 * EngagementProgressIndicator — top-right step + completion strip.
 * Source: Figma frame 3530:36684 (profile-filling top bar right slot).
 *
 * Layout (two rows, flex-col gap-[4px]):
 *   row 1: justify-between
 *     left  → [5px green square] "Step N of T ·" [bold label]
 *     right → "· X% profile complete · auto-saved"
 *   row 2: 6px progress track (bg-brand-green-light-hover / brand-green fill)
 *
 * Figma corrections applied 2026-07-04:
 *   - Track background: bg-neutral → bg-brand-green-light-hover (#e1eae2)
 *   - Dot indicator: StatusDot circle → 5×5px green square (rounded-[2.5px])
 *   - Label layout: single row → justify-between (step info left, % right)
 *   - Gap: gap-2 → gap-[4px]
 */
const EngagementProgressIndicator = ({
  currentIndex = 0,
  totalSteps = 9,
  currentStepLabel,
  completionPct = 0,
  autoSaved = true,
  className,
}) => {
  const safeIndex = Math.max(0, Math.min(currentIndex, totalSteps - 1));
  // Bar reflects "you've reached step N of total" → fill = N/total.
  // Step 1 → 11%, Step 5 → 56%, Step 9 → 100%. completionPct is the
  // separate "profile strength" percentage shown in the label.
  const trackPct = Math.min(100, ((safeIndex + 1) / totalSteps) * 100);

  return (
    <div className={classNames('w-full flex flex-col gap-[4px]', className)}>
      {/* Label row — step info left, completion text right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[9px] min-w-0">
          {/* 5×5 green square indicator (Figma: bg-[#387440] rounded-[2.5px] size-[5px]) */}
          <span
            aria-hidden="true"
            className="inline-block size-[5px] shrink-0 rounded-[2.5px] bg-brand-green"
          />
          <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-yellow-dark-active whitespace-nowrap shrink-0">
            Step {safeIndex + 1} of {totalSteps} ·
          </span>
          {currentStepLabel && (
            <span className="font-sans font-bold text-[12px] leading-5 text-content-primary whitespace-nowrap truncate">
              {currentStepLabel}
            </span>
          )}
        </div>
        <span className="font-sans text-[12px] leading-[18px] tracking-[0.2px] text-yellow-dark-active whitespace-nowrap shrink-0 pl-3">
          · {Math.round(completionPct)}% profile complete{autoSaved ? ' · auto-saved' : ''}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-[6px] w-full rounded-pill bg-brand-green-light-hover overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(trackPct)}
        aria-label={`Profile engagement progress: ${Math.round(trackPct)} percent`}
      >
        <div
          className="h-full bg-brand-green rounded-pill transition-[width] duration-300 ease-out"
          style={{ width: `${trackPct}%` }}
        />
      </div>
    </div>
  );
};

export default EngagementProgressIndicator;
