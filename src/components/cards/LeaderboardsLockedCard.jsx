import { classNames } from '../../utils/classNames.js';

/*
 * LeaderboardsLockedCard — locked-state leaderboards teaser (right rail).
 * Source: Figma frame (Section 1 · Your Identity map, right rail).
 *
 * Soft pink-cream card with a shield mark on the left and a brand-green
 * heading + body on the right. Used to nudge users toward completing
 * more stages before they can compete on the city leaderboard.
 */

const ShieldIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    {/* Shield body */}
    <path
      d="M16 3l11 3.5v9.5c0 6.5-4.7 11.7-11 12.5-6.3-.8-11-6-11-12.5V6.5L16 3z"
      fill="var(--color-danger-light-active)"
      stroke="var(--color-danger)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {/* Inner sparkle/check */}
    <path
      d="M16 11v6m0 0l-3-3m3 3l3-3"
      stroke="var(--color-danger-dark)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LeaderboardsLockedCard = ({ remainingStages = 7, city = 'Accra', onClick, className }) => (
  <article
    className={classNames(
      'rounded-2xl border border-danger-light-active bg-danger-light/40',
      'p-4 shadow-bottom-200',
      className
    )}
  >
    <h3 className="font-sans font-semibold text-[15px] leading-5 tracking-[0.1px] text-brand-green">
      Unlock Leaderboards!
    </h3>
    <div className="mt-3 flex items-start gap-3">
      <span aria-hidden="true" className="shrink-0">
        <ShieldIcon className="size-9" />
      </span>
      <p className="font-sans text-[13px] leading-[20px] tracking-[0.2px] text-content-primary">
        Complete{' '}
        <button
          type="button"
          onClick={onClick}
          className="font-semibold text-content-primary underline underline-offset-2 hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green rounded"
        >
          {remainingStages} more stages
        </button>{' '}
        to start competing with other talents in {city}.
      </p>
    </div>
  </article>
);

export default LeaderboardsLockedCard;
