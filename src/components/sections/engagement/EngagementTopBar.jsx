import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import Button from '../../ui/Button.jsx';
import { SLChevronLeftIcon } from '../../shared/assets.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';

import arrowhead from '../../../assets/engagement/arrowhead.svg';
import trailArrowGreen from '../../../assets/playful/trail-arrow-green.svg';
import trailArrowGrey from '../../../assets/playful/trail-arrow-grey.svg';

const log = debug('EngagementTopBar');

// How far one chevron click scrolls the trail — roughly 2 stage units at
// the default gap/width, matching a natural "next page of steps" jump.
const TRAIL_SCROLL_STEP_PX = 240;

// Width of the fade-out zone at each overflowing edge (Figma 5132:44983
// scroll-chevron container, 58px wide — the fade is scoped to that same span).
const TRAIL_FADE_WIDTH_PX = 58;

/*
 * EngagementTopBar — stage-trail row on Profile Engagement screens.
 * Source: Figma frame 3530:36666 (profile-filling step nav bar).
 *
 * Layout (two columns, justify-between):
 *   left:  9-stage breadcrumb trail. Completed stages show a green
 *          check-circle + neutral-grey text. The active stage shows a
 *          green check-circle + brand-green semibold text. Future stages
 *          show a grey outline circle + neutral-grey text. Each stage is
 *          a <Link> for keyboard/pointer navigation. arrowhead.svg
 *          separates each pair.
 *   right: EngagementProgressIndicator (step counter + 6px progress bar)
 *          in a fixed-width 323px container, right-aligned.
 *
 * Overflow affordance (Figma 5132:44983, added 2026-07-28): the trail
 * scrolls natively (overflow-x-auto) instead of clipping. A ghost-icon
 * chevron Button appears on whichever edge currently has hidden content
 * (tracked via scroll position + ResizeObserver), and that same edge gets a
 * CSS mask-image fade so the cut-off stage doesn't look abruptly truncated.
 * Both chevrons render the same SLChevronLeftIcon, mirrored with rotate-180
 * for the right direction rather than shipping a duplicate glyph.
 *
 * PLAYFUL (Figma 7873:50492, wiki/playful-mode.md): `playful:` classes only for the
 * trail (all stages get a filled check-circle - green current, #babab7 others -
 * 14px arrows, 12px gaps, hover chevron disc), plus a separate Playful progress
 * block (ink-bordered 6px track) rendered instead of EngagementProgressIndicator.
 *
 * Figma corrections applied 2026-07-04 (node 3530:36666):
 *   - Padding:   clamp(16px,3vw,40px) → clamp(20px,3.125vw,54px) horizontal; 10px fixed vertical
 *   - Stage icon: clamp(14px,1.2vw,16px) → size-4 (16px fixed)
 *   - Stage text: clamp(11px,1vw,13px) → text-[14px] tracking-[0.14px]
 *   - Inner gap:  gap-1 (4px) → gap-[12px] between icon and label within each breadcrumb
 *   - Outer gap:  gap-x-1 (4px) → gap-x-2 (8px) between breadcrumb units
 *   - Separator:  size-5 (20px) → size-6 (24px)
 *   - Right container: clamp(320px,28vw,420px) → w-[323px] items-end
 *   - Icon/text colour split: completed=green icon/grey text; active=green icon/green text; future=grey icon/grey text
 */

const CheckCircleIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.9998 0.799805C4.02335 0.799805 0.799805 4.02335 0.799805 7.9998C0.799805 11.9763 4.02335 15.1998 7.9998 15.1998C11.9763 15.1998 15.1998 11.9763 15.1998 7.9998C15.1998 4.02335 11.9763 0.799805 7.9998 0.799805ZM11.0746 6.16667C11.2772 5.90446 11.2289 5.52765 10.9667 5.32503C10.7045 5.12242 10.3277 5.17073 10.125 5.43294L7.16473 9.26392L5.84578 7.79842C5.62411 7.55212 5.24473 7.53215 4.99843 7.75383C4.75212 7.9755 4.73215 8.35488 4.95383 8.60118L6.75383 10.6012C6.87286 10.7334 7.04446 10.806 7.22228 10.7994C7.40009 10.7927 7.56577 10.7075 7.67457 10.5667L11.0746 6.16667Z"
    />
  </svg>
);

// Outline-only circle used for stages the user hasn't reached yet.
const EmptyCircleIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
    className={className}
  >
    <circle cx="8" cy="8" r="6.4" />
  </svg>
);

// Per-stage destination route — order mirrors PROFILE_STAGES.
const STAGE_ROUTES = {
  avatar: '/profile/engagement/avatar',
  'personal-interests': '/profile/filling/interests',
  personality: '/profile/engagement',
  skills: '/profile/engagement',
  'work-experience': '/profile/filling/work',
  'project-portfolio': '/profile/filling/portfolio',
  certifications: '/profile/filling/certs',
  'desired-career': '/profile/filling/goals',
  'talent-pitch': '/profile/filling/pitch',
};

// Playful progress block (Figma 7873:50517): same copy/logic as
// EngagementProgressIndicator, but the track carries a 1px ink border.
const PlayfulProgress = ({ currentIndex, totalSteps, label, completionPct }) => {
  const safeIndex = Math.max(0, Math.min(currentIndex, totalSteps - 1));
  const trackPct = Math.min(100, ((safeIndex + 1) / totalSteps) * 100);
  return (
    <div className="flex w-full flex-col gap-[4px]">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-[9px]">
          <span
            aria-hidden="true"
            className="inline-block size-[5px] shrink-0 rounded-[2.5px] bg-[#387440]"
          />
          <span className="shrink-0 whitespace-nowrap font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#716e65]">
            Step {Math.min(safeIndex + 1, 9)} of 9 ·
          </span>
          {label && (
            <span className="truncate whitespace-nowrap font-sans text-[12px] font-bold leading-5 tracking-[0.1px] text-[#1c2a21]">
              {label}
            </span>
          )}
        </div>
        <span className="shrink-0 whitespace-nowrap pl-3 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#716e65]">
          · {Math.round(completionPct)}% profile complete · auto-saved
        </span>
      </div>
      <div
        className="box-border flex h-[6px] w-full flex-col items-start overflow-clip rounded-[100px] border border-solid border-[#1c2a21] bg-[#e1eae2]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(trackPct)}
        aria-label={`Profile engagement progress: ${Math.round(trackPct)} percent`}
      >
        <div
          className="box-border h-[6px] shrink-0 rounded-[100px] border border-solid border-[#1c2a21] bg-[#387440] motion-safe:transition-[width] motion-safe:duration-300"
          style={{ width: `${trackPct}%` }}
        />
      </div>
    </div>
  );
};

const EngagementTopBar = ({
  currentStageIndex = 0,
  completionPct = 0,
  stages = PROFILE_STAGES,
  interactive = true,
  className,
}) => {
  const { uiStyle } = useUiStyle();
  const isPlayful = uiStyle === 'playful';
  log('branch', { playfulProgress: isPlayful });
  const currentStage = stages[currentStageIndex];
  const trailRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trailRef.current;
    if (!el) return;
    const nextCanScrollLeft = el.scrollLeft > 1;
    const nextCanScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    log('branch', { trailOverflow: true, nextCanScrollLeft, nextCanScrollRight });
    setCanScrollLeft(nextCanScrollLeft);
    setCanScrollRight(nextCanScrollRight);
  }, []);

  useEffect(() => {
    const el = trailRef.current;
    if (!el) return undefined;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      observer.disconnect();
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, stages]);

  const scrollTrail = (direction) => {
    log('branch', { scrollTrail: direction });
    trailRef.current?.scrollBy({ left: direction * TRAIL_SCROLL_STEP_PX, behavior: 'smooth' });
  };

  return (
    <div
      className={classNames(
        'w-full bg-white border-b border-border-default',
        'px-[clamp(20px,3.125vw,54px)] max-md:px-4 py-[10px]',
        'playful:border-b-0',
        'flex items-center justify-between',
        className
      )}
    >
      {/* relative wrapper hosts the two overlay chevron buttons — the <nav>
          itself only needs to scroll + fade, not know about its siblings. */}
      {/* Below md the 9-stage trail is replaced by the compact progress line
          further down (plan §4: breadcrumb -> current step only). */}
      <div className="relative flex-1 min-w-0 max-md:hidden">
        <nav
          ref={trailRef}
          aria-label="Profile engagement stages"
          className="flex flex-nowrap items-center gap-x-2 overflow-x-auto no-scrollbar scroll-smooth playful:gap-x-[12px]"
          style={{
            // Fade-out at whichever edge currently has hidden overflow (Figma
            // 5132:44983 scroll-chevron affordance) — mask width matches the
            // chevron button's own 58px span so the glyph sits inside the fade
            // rather than on top of fully-opaque content. No mask at all when
            // that side has nothing hidden, so the trail's edges stay crisp.
            WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${canScrollLeft ? `${TRAIL_FADE_WIDTH_PX}px` : '0px'}, black calc(100% - ${canScrollRight ? `${TRAIL_FADE_WIDTH_PX}px` : '0px'}), transparent 100%)`,
            maskImage: `linear-gradient(to right, transparent 0, black ${canScrollLeft ? `${TRAIL_FADE_WIDTH_PX}px` : '0px'}, black calc(100% - ${canScrollRight ? `${TRAIL_FADE_WIDTH_PX}px` : '0px'}), transparent 100%)`,
          }}
        >
          {stages.map((stage, index) => {
            const isCurrent = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            const isFuture = index > currentStageIndex;
            const route = STAGE_ROUTES[stage.id];
            // In interactive mode (the default, used by the multi-page profile-
            // filling wizard) a stage without a registered route is skipped.
            // In non-interactive mode (single-page conversational flows like
            // Career Buddy) every supplied stage renders regardless of route.
            if (interactive && !route) return null;
            const label = stage.trailLabel || stage.title;

            // Completed and active stages share a green check-circle; future
            // stages use a grey outline circle to signal they're not yet reached.
            const StageIcon = isFuture ? EmptyCircleIcon : CheckCircleIcon;
            // Playful: future stages use the same filled check-circle, in grey (Figma 7873:50492).
            const arrowSrc = index <= currentStageIndex ? trailArrowGreen : trailArrowGrey;

            const stageClassName = classNames(
              'inline-flex items-center gap-[12px] rounded px-1 py-0.5 playful:px-0 playful:py-0',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              // Icon colour: green for completed/active, neutral-dark for future.
              isCompleted || isCurrent ? 'text-brand-green' : 'text-neutral-dark',
              // Hover brings all stages to brand-green as a preview affordance.
              interactive && 'hover:text-brand-green'
            );

            const stageContent = (
              <>
                <StageIcon
                  className={classNames('size-4 shrink-0', isFuture && 'playful:hidden')}
                />
                {isFuture && <CheckCircleIcon className="hidden size-4 shrink-0 playful:block" />}
                <span
                  className={classNames(
                    'font-sans text-[14px] leading-[24px] tracking-[0.14px]',
                    // Text colour is independent of icon: only the active step
                    // reads brand-green; completed + future both read neutral-dark.
                    isCurrent ? 'font-semibold text-brand-green' : 'font-medium text-neutral-dark',
                    'playful:capitalize',
                    // Figma 7873:50496: the stage right after the current one is Semibold in every frame
                    index === currentStageIndex + 1 && 'playful:font-semibold'
                  )}
                >
                  {label}
                </span>
              </>
            );

            return (
              <span
                key={stage.id}
                className="inline-flex items-center gap-2 shrink-0 playful:gap-[12px]"
              >
                {interactive ? (
                  <Link
                    to={route}
                    aria-label={label}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={stageClassName}
                  >
                    {stageContent}
                  </Link>
                ) : (
                  <span
                    aria-label={label}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={stageClassName}
                  >
                    {stageContent}
                  </span>
                )}
                {index < stages.length - 1 && (
                  <img
                    src={arrowhead}
                    alt=""
                    aria-hidden="true"
                    className="block size-6 select-none opacity-70 shrink-0 playful:hidden"
                    draggable="false"
                  />
                )}
                {index < stages.length - 1 && (
                  <img
                    src={arrowSrc}
                    alt=""
                    aria-hidden="true"
                    className="hidden size-[14px] select-none shrink-0 playful:block"
                    draggable="false"
                  />
                )}
              </span>
            );
          })}
        </nav>

        {/* Overflow chevrons — only rendered on the side that actually has
            hidden content (Figma 5132:44983: "row scrolls horizontally when
            the [chevron] is clicked"). Left chevron mirrors the same glyph
            via rotate-180 rather than shipping a second near-duplicate icon. */}
        {canScrollLeft && (
          <Button
            type="button"
            variant="ghost-icon"
            size="sm"
            aria-label="Scroll to previous steps"
            onClick={() => scrollTrail(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 playful:size-10 playful:text-[#70706e] playful:hover:bg-[#f2f2f2] playful:focus-visible:outline-3 playful:focus-visible:outline-brand-green"
          >
            <SLChevronLeftIcon className="size-4" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            type="button"
            variant="ghost-icon"
            size="sm"
            aria-label="Scroll to next steps"
            onClick={() => scrollTrail(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 playful:size-10 playful:text-[#70706e] playful:hover:bg-[#f2f2f2] playful:focus-visible:outline-3 playful:focus-visible:outline-brand-green"
          >
            <SLChevronLeftIcon className="size-4 rotate-180" />
          </Button>
        )}
      </div>

      {/* Right: step counter + progress bar, right-aligned (items-end in flex-col) */}
      <div className="w-[323px] shrink-0 flex flex-col gap-[4px] items-end justify-center max-md:hidden playful:w-auto playful:min-w-[323px]">
        {isPlayful ? (
          <PlayfulProgress
            currentIndex={currentStageIndex}
            totalSteps={stages.length}
            label={currentStage?.trailLabel || currentStage?.title}
            completionPct={completionPct}
          />
        ) : (
          <EngagementProgressIndicator
            currentIndex={currentStageIndex}
            totalSteps={stages.length}
            currentStepLabel={currentStage?.trailLabel || currentStage?.title}
            completionPct={completionPct}
          />
        )}
      </div>

      {/* Phones: one "Step 4 of 9 · Skills  33%" line + bar. The shared
          EngagementProgressIndicator's right-hand copy is ~200px of nowrap
          text, which cannot fit beside the step label at 320px. */}
      <div className="flex w-full min-w-0 flex-col gap-1 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 truncate font-sans text-[12px] leading-[18px] tracking-[0.2px] text-yellow-dark-active">
            Step {Math.min(currentStageIndex + 1, stages.length)} of {stages.length} ·{' '}
            <span className="font-bold text-content-primary">
              {currentStage?.trailLabel || currentStage?.title}
            </span>
          </p>
          <span className="shrink-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-yellow-dark-active">
            {Math.round(completionPct)}% complete
          </span>
        </div>
        <div
          className="h-[6px] w-full overflow-hidden rounded-pill bg-brand-green-light-hover playful:box-border playful:border playful:border-[#1c2a21]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(((currentStageIndex + 1) / stages.length) * 100)}
          aria-label="Profile engagement progress"
        >
          <div
            className="h-full rounded-pill bg-brand-green"
            style={{ width: `${Math.min(100, ((currentStageIndex + 1) / stages.length) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EngagementTopBar;
