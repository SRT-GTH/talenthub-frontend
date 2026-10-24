import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { DATA_BASE } from '../publicDataNav.js';
import { PublicIconArrowLeft, PublicIconArrowRight } from './showcaseIcons.jsx';

/*
 * ShowcaseProfileNav — Figma "profile nav" 8497:86 (1360x37) + hover state frame 8.4.2a (8497:349256).
 * Breadcrumb "Talent showcase › <name>" (14/17; link 600 #387440, current 500 #1c2a21) · right group gap 12: pill "← Previous · <name>"
 * (white, 1px #e7e7e7, r100, p 9/14, 600 14/17) · "n of 5" (500 #595959) · pill "Next · <name> →" · "View all" (600 #387440).
 * Hover / focus of a pill: #ebf1ec fill + 1px #387440 border (8.4.2a draws Next hovered); forceNextHover reproduces that frame from ?nav=next.
 * Mobile (< md, frame 8508:173): one row "← Adwoa K." · "1 of 5" · "Kofi M. →" (14/17 600 #387440, counter 13/16 500 #595959); no breadcrumb and
 * no "View all" are drawn there. ⚠️ ASSUMPTION: a small "View all" link is appended under that row (not drawn) so the grid overview stays reachable.
 * Props: profile, index, total, previous, next, forceNextHover
 */

const PILL =
  'inline-flex min-h-[37px] items-center gap-[8px] rounded-full border border-solid px-[14px] py-[9px] text-[14px] leading-[17px] font-semibold text-[#1c2a21] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const PILL_IDLE = 'border-[#e7e7e7] bg-white hover:border-[#387440] hover:bg-[#ebf1ec]';
const PILL_ON = 'border-[#387440] bg-[#ebf1ec]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const ShowcaseProfileNav = ({
  profile,
  index,
  total,
  previous,
  next,
  forceNextHover = false,
  variant = 'desktop',
}) =>
  variant === 'desktop' ? (
    <nav
      aria-label="Showcase profiles"
      className="hidden flex-wrap items-center justify-between gap-x-[16px] gap-y-[10px] font-sans md:flex"
    >
      <p className="m-0 flex items-center gap-[8px] text-[14px] leading-[17px]">
        <Link
          to={`${DATA_BASE}/showcase`}
          className={classNames(
            'inline-flex min-h-[24px] items-center font-semibold text-[#387440] no-underline',
            FOCUS
          )}
        >
          Talent showcase
        </Link>
        <span aria-hidden="true" className="text-[#595959]">
          ›
        </span>
        <span aria-current="page" className="font-medium text-[#1c2a21]">
          {profile.name}
        </span>
      </p>
      <div className="flex items-center gap-[12px]">
        <Link to={`${DATA_BASE}/showcase/${previous.id}`} className={classNames(PILL, PILL_IDLE)}>
          <PublicIconArrowLeft className="size-[16px] shrink-0 text-[#1a1a18]" />
          <span>Previous · {previous.name}</span>
        </Link>
        <span
          aria-live="polite"
          className="text-[14px] leading-[17px] font-medium whitespace-nowrap text-[#595959]"
        >
          {index + 1} of {total}
        </span>
        <Link
          to={`${DATA_BASE}/showcase/${next.id}`}
          className={classNames(PILL, forceNextHover ? PILL_ON : PILL_IDLE)}
        >
          <span>Next · {next.name}</span>
          <PublicIconArrowRight className="size-[16px] shrink-0 text-[#1a1a18]" />
        </Link>
        <Link
          to={`${DATA_BASE}/showcase?view=grid`}
          className={classNames(
            'inline-flex min-h-[24px] items-center text-[14px] leading-[17px] font-semibold whitespace-nowrap text-[#387440] no-underline',
            FOCUS
          )}
        >
          View all
        </Link>
      </div>
    </nav>
  ) : (
    <nav aria-label="Showcase profiles" className="flex flex-col gap-[8px] font-sans md:hidden">
      <div className="flex items-center justify-between gap-[8px]">
        <Link
          to={`${DATA_BASE}/showcase/${previous.id}`}
          className="inline-flex min-h-[24px] items-center py-[4px] text-[14px] leading-[17px] font-semibold text-[#387440] no-underline"
        >
          ← {previous.name}
        </Link>
        <span aria-live="polite" className="text-[13px] leading-[16px] font-medium text-[#595959]">
          {index + 1} of {total}
        </span>
        <Link
          to={`${DATA_BASE}/showcase/${next.id}`}
          className="inline-flex min-h-[24px] items-center py-[4px] text-[14px] leading-[17px] font-semibold text-[#387440] no-underline"
        >
          {next.name} →
        </Link>
      </div>
      <Link
        to={`${DATA_BASE}/showcase?view=grid`}
        className="self-center py-[4px] text-[13px] leading-[16px] font-semibold text-[#387440] no-underline"
      >
        View all
      </Link>
    </nav>
  );

export default ShowcaseProfileNav;
