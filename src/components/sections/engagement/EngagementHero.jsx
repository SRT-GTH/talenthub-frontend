import { classNames } from '../../../utils/classNames.js';
import Tag from '../../ui/Tag.jsx';
import ProfileStandingCard from './ProfileStandingCard.jsx';

/*
 * EngagementHero — top hero section of the Profile Engagement page.
 * Source: Figma frame 3384:81958 ("Section"), composed of:
 *   left  → headline "Your Profile,Your Way." (no space after comma — Figma exact)
 *           + lede + 3 mixed-color pill tags
 *   right → ProfileStandingCard
 *
 * Background follows the Figma's faint cream→peach→green wash. We render
 * it as one soft horizontal gradient: brand-green-light tint on the left,
 * yellow-light through the middle, accent-light tint on the right — all
 * heavily desaturated so the section reads "calm pastel," not coloured.
 */

// Mixed-color pill content: bold green prefix + muted suffix. Used for
// the three hero tags ("11% Completed", "40 Min total · across sittings",
// "Auto-Save on every field").
const HeroTagContent = ({ accent, muted }) => (
  <span className="inline-flex items-baseline gap-1">
    <span className="font-semibold text-brand-green">{accent}</span>
    {muted && <span className="font-medium text-neutral-darker">{muted}</span>}
  </span>
);

const EngagementHero = ({
  completionPct,
  doneCount,
  inProgressCount,
  remainingCount,
  className,
}) => (
  <section
    className={classNames(
      'w-full',
      // Soft horizontal wash — left brand-green-light, middle yellow-light,
      // right accent-light. Saturation kept low (~30%) so the section
      // never competes with content.
      'bg-[linear-gradient(90deg,var(--color-brand-green-light)_0%,var(--color-yellow-light)_45%,var(--color-yellow-light)_60%,var(--color-accent-light)_100%)]',
      'px-[clamp(16px,3vw,40px)] py-[clamp(24px,2.5vw,40px)]',
      className
    )}
  >
    <div className="mx-auto flex flex-col lg:flex-row gap-8 items-start justify-between max-w-[1620px]">
      <div className="flex-1 min-w-0 max-w-[clamp(320px,40vw,520px)]">
        <h1 className="font-display text-[clamp(34px,3.6vw,52px)] leading-[1.0] tracking-[-0.5px] text-content-primary">
          Your Profile,<span className="italic text-brand-green">Your Way.</span>
        </h1>
        <p className="mt-3 font-sans text-[14px] leading-[22px] tracking-[0.2px] text-neutral-darker max-w-[44ch]">
          Nine stages, no fixed order. Save and bounce anytime &nbsp;most people finish across a
          week, not one sitting. Avatar alone makes you searchable. Pitch is when you get matched.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Tag variant="pill" color="brand" size="md">
            <HeroTagContent accent="11%" muted="Completed" />
          </Tag>
          <Tag variant="pill" color="brand" size="md">
            <HeroTagContent accent="40 Min" muted="total · across sittings" />
          </Tag>
          <Tag variant="pill" color="brand" size="md">
            <HeroTagContent accent="Auto-Save" muted="on every field" />
          </Tag>
        </div>
      </div>

      <ProfileStandingCard
        completionPct={completionPct}
        doneCount={doneCount}
        inProgressCount={inProgressCount}
        remainingCount={remainingCount}
      />
    </div>
  </section>
);

export default EngagementHero;
