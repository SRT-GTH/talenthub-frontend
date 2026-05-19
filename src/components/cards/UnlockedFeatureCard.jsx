import { classNames } from '../../utils/classNames.js';

/*
 * UnlockedFeatureCard — one card in the "What you just unlocked" grid
 * on the MilestoneUnlockPage.
 *
 * Source: Figma frame (milestone celebration, bottom section).
 *
 * The card has two orthogonal knobs:
 *   highlighted (bool) — `true` draws the accent border + soft tint
 *                        (freshly unlocked); `false` is neutral white.
 *   accent (string)    — colour family for the highlighted look. Defaults
 *                        to `brand-green`. `accent` (Milestone 2) swaps in
 *                        the gold/amber family.
 *
 * The card title always uses the accent's *normal* shade so unhighlighted
 * cards still read as themed (per Figma — Milestone 2 cards have gold
 * titles even when their border is neutral).
 */

const ACCENT_CLASSES = {
  brand: {
    highlightedBox:
      'bg-brand-green-light/30 border-[1.5px] border-brand-green-light-active shadow-bottom-200',
    title: 'text-brand-green',
  },
  accent: {
    highlightedBox:
      'bg-accent-light/40 border-[1.5px] border-accent-light-active shadow-bottom-200',
    title: 'text-accent-dark',
  },
};

const UnlockedFeatureCard = ({
  title,
  description,
  highlighted = false,
  accent = 'brand',
  className,
}) => {
  const palette = ACCENT_CLASSES[accent] || ACCENT_CLASSES.brand;

  return (
    <article
      className={classNames(
        'flex flex-col gap-2 rounded-2xl p-5',
        highlighted
          ? palette.highlightedBox
          : 'bg-white border border-border-default shadow-bottom-200',
        className
      )}
    >
      <h4
        className={classNames(
          'font-sans font-semibold text-[16px] leading-6 tracking-[0.1px]',
          palette.title
        )}
      >
        {title}
      </h4>
      <p className="font-sans text-[13px] leading-[20px] tracking-[0.2px] text-neutral-darker">
        {description}
      </p>
    </article>
  );
};

export default UnlockedFeatureCard;
