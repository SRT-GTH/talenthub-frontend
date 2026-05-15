import { classNames } from '../../../utils/classNames.js';
import Tag from '../../ui/Tag.jsx';
import ProfileStandingCard from './ProfileStandingCard.jsx';
import { ENGAGEMENT_HERO_TAGS } from '../../../constants/profileStages.js';

/*
 * EngagementHero — top hero section of the Profile Engagement page.
 * Source: Figma frame 3384:81958 ("Section"), composed of:
 *   left  → headline "Your Profile, Your Way." + lede + 3 tags
 *   right → ProfileStandingCard
 *
 * Background follows the Figma's faint cream→white gradient. The page
 * container does the full-bleed; this component only owns the inner
 * 1616-wide content shell.
 */

const EngagementHero = ({
  completionPct,
  doneCount,
  inProgressCount,
  remainingCount,
  className,
}) => (
  <section
    className={classNames(
      'w-full bg-gradient-to-r from-brand-green-light/50 via-accent-light/40 to-yellow-light',
      'px-[clamp(16px,4vw,56px)] py-[clamp(24px,3vw,40px)]',
      className
    )}
  >
    <div className="mx-auto flex flex-col lg:flex-row gap-8 items-start justify-between max-w-[1620px]">
      <div className="flex-1 min-w-0 max-w-[clamp(320px,40vw,520px)]">
        <h1 className="font-display text-[clamp(36px,4vw,52px)] leading-[1.0] tracking-[-0.5px] text-content-primary">
          Your Profile, <span className="italic text-brand-green">Your Way.</span>
        </h1>
        <p className="mt-4 font-sans text-[14px] leading-[22px] tracking-[0.2px] text-neutral-darker">
          Nine stages, no fixed order. Save and bounce anytime — most people finish across a week,
          not one sitting. Avatar alone makes you searchable. Pitch is when you get matched.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {ENGAGEMENT_HERO_TAGS.map((tag) => (
            <Tag key={tag.id} variant="pill" color="brand" size="md">
              {tag.label}
            </Tag>
          ))}
        </div>
      </div>

      <ProfileStandingCard
        completionPct={completionPct}
        doneCount={doneCount}
        inProgressCount={inProgressCount}
        remainingCount={remainingCount}
        className="self-stretch"
      />
    </div>
  </section>
);

export default EngagementHero;
