import { classNames } from '../../utils/classNames.js';
import StatusDot from './StatusDot.jsx';

/*
 * EngagementProgressIndicator — top-right step + completion strip.
 * Source: Figma frame 3384:81995 ("Container" top-bar right slot).
 *
 * Renders a single-line label ("• Step 1 of 9 · Avatar · 0% profile complete
 * · auto-saved") above a 6px progress track that fills based on the current
 * stage index. Used inside EngagementTopBar.
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
  // Step 1 → 11%, Step 5 → 56%, Step 9 → 100%. The `completionPct`
  // shown in the label is a separate metric (profile-strength %).
  const trackPct = Math.min(100, ((safeIndex + 1) / totalSteps) * 100);

  return (
    <div className={classNames('w-full flex flex-col gap-2', className)}>
      <div
        className={classNames(
          'flex items-center gap-1.5 whitespace-nowrap',
          'font-sans text-[12px] leading-5 tracking-[0.2px] text-neutral-dark-hover',
          'overflow-hidden text-ellipsis'
        )}
      >
        <StatusDot color="brand" />
        <span className="font-semibold text-content-primary shrink-0">
          Step {safeIndex + 1} of {totalSteps}
        </span>
        {currentStepLabel && (
          <>
            <span aria-hidden="true" className="shrink-0">
              ·
            </span>
            <span className="font-semibold text-content-primary truncate">{currentStepLabel}</span>
          </>
        )}
        <span aria-hidden="true" className="shrink-0">
          ·
        </span>
        <span className="shrink-0">{Math.round(completionPct)}% profile complete</span>
        {autoSaved && (
          <>
            <span aria-hidden="true" className="shrink-0">
              ·
            </span>
            <span className="shrink-0">auto-saved</span>
          </>
        )}
      </div>
      <div
        className="h-1.5 w-full rounded-pill bg-neutral overflow-hidden"
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
