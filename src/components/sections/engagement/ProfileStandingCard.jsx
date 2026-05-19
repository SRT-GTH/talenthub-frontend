import { classNames } from '../../../utils/classNames.js';
import ProgressRing from '../../ui/ProgressRing.jsx';

/*
 * ProfileStandingCard — "Where you stand" summary card.
 * Source: Figma frame 3384:81968 ("Background+Border+Shadow" in the hero).
 *
 * Renders a horizontal card with the circular % badge on the left and a
 * two-line summary on the right ("1 done · 1 in progress" + helper copy).
 *
 * Inputs are explicit numbers; the parent computes them from the stage
 * collection so this stays a pure view component.
 */

const ProfileStandingCard = ({
  completionPct = 0,
  doneCount = 0,
  inProgressCount = 0,
  remainingCount = 0,
  className,
}) => (
  <aside
    className={classNames(
      'rounded-xl bg-white border border-border-default shadow-bottom-200',
      'px-5 py-5',
      'w-full max-w-[clamp(360px,32vw,488px)]',
      className
    )}
  >
    <p className="font-sans font-semibold text-[12px] leading-4 tracking-[0.2px] uppercase text-neutral-dark-hover">
      📈 Where you stand
    </p>
    <div className="mt-4 flex items-start gap-4">
      <ProgressRing value={completionPct} size={56} label="Profile completion" />
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-[16px] leading-6 tracking-[0.1px] text-content-primary">
          {doneCount} done · {inProgressCount} in progress
        </p>
        <p className="mt-1 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-neutral-dark-hover">
          {remainingCount} stages left. None required. Your profile card gets stronger each one you
          finish. Avatar alone is enough to show up in recruiter search.
        </p>
      </div>
    </div>
  </aside>
);

export default ProfileStandingCard;
