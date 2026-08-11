import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import EngagementProgressIndicator from '../../ui/EngagementProgressIndicator.jsx';
import Button from '../../ui/Button.jsx';
import { SLChevronLeftIcon } from '../../shared/assets.jsx';
import { PROFILE_STAGES } from '../../../constants/profileStages.js';

import arrowhead from '../../../assets/engagement/arrowhead.svg';

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
  'work-experience': '/profile/engagement',
  'project-portfolio': '/profile/engagement',
  certifications: '/profile/engagement',
  'desired-career': '/profile/engagement',
  'talent-pitch': '/profile/engagement',
};

const EngagementTopBar = ({
  currentStageIndex = 0,
  completionPct = 0,
  stages = PROFILE_STAGES,
  interactive = true,
  className,
}) => {
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
        'px-[clamp(20px,3.125vw,54px)] py-[10px]',
        'flex items-center justify-between',
        className
      )}
    >
      {/* relative wrapper hosts the two overlay chevron buttons — the <nav>
          itself only needs to scroll + fade, not know about its siblings. */}
      <div className="relative flex-1 min-w-0">
        <nav
          ref={trailRef}
          aria-label="Profile engagement stages"
          className="flex flex-nowrap items-center gap-x-2 overflow-x-auto no-scrollbar scroll-smooth"
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

            const stageClassName = classNames(
              'inline-flex items-center gap-[12px] rounded px-1 py-0.5',
              'transition-colors duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
              // Icon colour: green for completed/active, neutral-dark for future.
              isCompleted || isCurrent ? 'text-brand-green' : 'text-neutral-dark',
              // Hover brings all stages to brand-green as a preview affordance.
              interactive && 'hover:text-brand-green'
            );

            const stageContent = (
              <>
                <StageIcon className="size-4 shrink-0" />
                <span
                  className={classNames(
                    'font-sans text-[14px] leading-[24px] tracking-[0.14px]',
                    // Text colour is independent of icon: only the active step
                    // reads brand-green; completed + future both read neutral-dark.
                    isCurrent ? 'font-semibold text-brand-green' : 'font-medium text-neutral-dark'
                  )}
                >
                  {label}
                </span>
              </>
            );

            return (
              <span key={stage.id} className="inline-flex items-center gap-2 shrink-0">
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
                    className="block size-6 select-none opacity-70 shrink-0"
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
            className="absolute left-0 top-1/2 -translate-y-1/2"
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
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <SLChevronLeftIcon className="size-4 rotate-180" />
          </Button>
        )}
      </div>

      {/* Right: step counter + progress bar, right-aligned (items-end in flex-col) */}
      <div className="w-[323px] shrink-0 flex flex-col gap-[4px] items-end justify-center">
        <EngagementProgressIndicator
          currentIndex={currentStageIndex}
          totalSteps={stages.length}
          currentStepLabel={currentStage?.trailLabel || currentStage?.title}
          completionPct={completionPct}
        />
      </div>
    </div>
  );
};

export default EngagementTopBar;
