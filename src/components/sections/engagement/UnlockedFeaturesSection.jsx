import { classNames } from '../../../utils/classNames.js';
import UnlockedFeatureCard from '../../cards/UnlockedFeatureCard.jsx';

/*
 * UnlockedFeaturesSection — "What you just unlocked" 3-card grid below
 * the milestone hero. Source: Figma frame (milestone celebration).
 *
 * The features are passed in via the `items` prop so this section is
 * reusable for milestones 2 and 3 once they ship.
 */

const UnlockedFeaturesSection = ({ items = [], kicker = 'What you just unlocked', className }) => (
  <section
    className={classNames(
      'w-full bg-background-default',
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
          />
        ))}
      </div>
    </div>
  </section>
);

export default UnlockedFeaturesSection;
