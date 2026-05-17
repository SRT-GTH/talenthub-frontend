import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import gthMark from '../../../assets/brand/gth-mark.png';
import gthWordmark from '../../../assets/brand/gth-wordmark.png';
import { ROUTES } from '../../../constants/routes.js';

/*
 * EngagementTopNav — top-of-page header on the Profile Engagement screens.
 * Source: Figma frame 3384:81927 (Gh Design system — engagement side).
 *
 * Visually distinct from the marketing Navbar: this is a light, on-page
 * header (white background, thin bottom border) rather than the floating
 * dark pill used on the landing page.
 *
 *   left  → Ghana Talent Hub logo (mark + wordmark, invert=true so the
 *           wordmark is dark on the white surface)
 *   right → "Save & Exit" link + circular help icon + user chip (avatar
 *           + initial-name)
 *
 * The user chip is rendered as a single button so the rest of the area
 * is a passive header. Wire avatar + name through props once the auth
 * slice is in place; for now we render a literal "Kofi A." placeholder.
 */

const HelpIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
    <line x1="12" y1="17" x2="12" y2="17.01" />
  </svg>
);

const EngagementTopNav = ({
  userName = 'Kofi A.',
  userInitials = 'KA',
  onSaveExit,
  onHelp,
  className,
}) => (
  <header
    className={classNames(
      'w-full bg-white border-b border-border-default',
      'px-[clamp(16px,3vw,40px)] py-[clamp(10px,1.5vw,16px)]',
      'flex items-center justify-between gap-4',
      className
    )}
  >
    <Link
      to={ROUTES.home}
      aria-label="Ghana Talent Hub home"
      className="inline-flex flex-col items-center gap-0.5 shrink-0"
    >
      {/* Stacked GTH logo (Figma frame 3384:81977): figure on top, "GHANA
        TALENT HUB" wordmark centered below in two small lines. */}
      <span aria-hidden="true" className="block size-9 overflow-hidden">
        <img src={gthMark} alt="" className="block size-full object-contain" />
      </span>
      <span aria-hidden="true" className="block h-3 w-12 overflow-hidden invert">
        <img src={gthWordmark} alt="" className="block size-full object-contain" />
      </span>
    </Link>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onSaveExit}
        className={classNames(
          'font-sans font-semibold text-[14px] leading-5 tracking-[0.2px]',
          'text-content-primary underline-offset-4 hover:underline focus-visible:underline',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green rounded'
        )}
      >
        Save &amp; Exit
      </button>

      <button
        type="button"
        onClick={onHelp}
        aria-label="Help"
        className={classNames(
          'inline-flex size-9 items-center justify-center rounded-full',
          'border border-border-default bg-white text-content-primary',
          'hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
        )}
      >
        <HelpIcon className="size-5" />
      </button>

      <div
        className={classNames(
          'inline-flex items-center gap-2 rounded-full',
          'border border-border-default bg-white pl-1 pr-3 py-1'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'inline-flex size-7 items-center justify-center rounded-full',
            'bg-brand-green text-white font-sans font-semibold text-[11px] tracking-[0.2px]'
          )}
        >
          {userInitials}
        </span>
        <span className="font-sans font-semibold text-[14px] leading-5 tracking-[0.2px] text-content-primary">
          {userName}
        </span>
      </div>
    </div>
  </header>
);

export default EngagementTopNav;
