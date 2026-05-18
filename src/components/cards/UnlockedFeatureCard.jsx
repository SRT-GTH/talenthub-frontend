import { classNames } from '../../utils/classNames.js';

/*
 * UnlockedFeatureCard — one card in the "What you just unlocked" grid
 * on the MilestoneUnlockPage.
 *
 * Source: Figma frame (milestone celebration, bottom section).
 *
 * Variants:
 *   highlighted = true   → green border + soft brand-green-light tint,
 *                          used for the freshly-unlocked features.
 *   highlighted = false  → neutral white card with grey border, used for
 *                          features that were already visible but are
 *                          referenced here for context.
 */

const UnlockedFeatureCard = ({ title, description, highlighted = false, className }) => (
  <article
    className={classNames(
      'flex flex-col gap-2 rounded-2xl p-5',
      highlighted
        ? 'bg-brand-green-light/30 border-[1.5px] border-brand-green-light-active shadow-bottom-200'
        : 'bg-white border border-border-default shadow-bottom-200',
      className
    )}
  >
    <h4 className="font-sans font-semibold text-[16px] leading-6 tracking-[0.1px] text-brand-green">
      {title}
    </h4>
    <p className="font-sans text-[13px] leading-[20px] tracking-[0.2px] text-neutral-darker">
      {description}
    </p>
  </article>
);

export default UnlockedFeatureCard;
