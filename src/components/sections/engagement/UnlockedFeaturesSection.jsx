import { classNames } from '../../../utils/classNames.js';
import UnlockedFeatureCard from '../../cards/UnlockedFeatureCard.jsx';

/*
 * UnlockedFeaturesSection — "What you just unlocked" 3-card grid below
 * the milestone hero. Source: Figma frame (milestone celebration).
 *
 * The features are passed in via the `items` prop so this section is
 * reusable for milestones 2 and 3 once they ship.
 */

const SECTION_BG = {
  default: 'bg-background-default',
  // Soft cream wash used on Milestone 2 for visual continuity with the
  // gold hero panel above.
  cream: 'bg-accent-light/30',
};

const UnlockedFeaturesSection = ({
  items = [],
  kicker = 'What you just unlocked',
  accent = 'brand',
  background = 'default',
  className,
}) => (
  <section
    className={classNames(
      'w-full',
      SECTION_BG[background] || SECTION_BG.default,
      'px-[clamp(16px,4vw,56px)] py-[clamp(32px,4vw,48px)]',
      className
    )}
  >
    <div className="mx-auto max-w-[1200px]">
      <p className="font-sans font-semibold text-[10px] leading-3 tracking-[1.4px] uppercase text-neutral-darker">
        {kicker}
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <UnlockedFeatureCard
            key={item.title}
            title={item.title}
            description={item.description}
            highlighted={item.highlighted}
            accent={accent}
          />
        ))}
      </div>
    </div>
  </section>
);

export default UnlockedFeaturesSection;
