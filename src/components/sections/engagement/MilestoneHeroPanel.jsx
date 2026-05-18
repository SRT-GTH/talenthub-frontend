import { classNames } from '../../../utils/classNames.js';
import MilestoneStatTile from '../../cards/MilestoneStatTile.jsx';
import Button from '../../ui/Button.jsx';
import giftImg from '../../../assets/engagement/reward-gift.png';

/*
 * MilestoneHeroPanel — centred celebration hero on the milestone unlock screen.
 * Source: Figma frame (milestone celebration hero).
 *
 * Layout (vertical, all centred):
 *   ├─ gift / trophy image (top, ~80×80)
 *   ├─ "MILESTONE n OF 3 · UNLOCKED" small pill (green or gold per theme)
 *   ├─ headline — JSX so callers can mix accent colours (e.g. "Top
 *   │   20%" in gold italic + "profile." in green italic)
 *   ├─ description paragraph
 *   ├─ stat tiles row (3 or 4 wide, wraps on narrow viewports)
 *   ├─ CTA row: primary action + tertiary alt action
 *   └─ completed-stages row: "COMPLETED:" label + chips per stage
 *
 * Themes:
 *   green (default) — Milestone 1 "You're discoverable": green pill,
 *                     brand-green primary CTA, gold completed chips
 *   gold            — Milestone 2 "Top 20% profile": gold pill, accent
 *                     (gold) primary CTA, gold completed chips
 */

const ArrowRight = ({ className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 10h12" />
    <path d="M10 4l6 6-6 6" />
  </svg>
);

const GiftEmoji = ({ className }) => (
  <span aria-hidden="true" className={className}>
    🎁
  </span>
);

const THEME_CLASSES = {
  green: {
    pill: 'bg-brand-green-light border-brand-green-light-active text-brand-green-dark',
    pillDot: 'bg-brand-green',
    primaryVariant: 'primary',
  },
  gold: {
    pill: 'bg-accent-light border-accent-light-active text-accent-dark',
    pillDot: 'bg-accent',
    primaryVariant: 'secondary',
  },
};

const MilestoneHeroPanel = ({
  milestoneNumber = 1,
  totalMilestones = 3,
  headline,
  description,
  stats = [],
  completedStages = [],
  iconSrc = giftImg,
  primaryCtaLabel = 'Claim your reward',
  primaryCtaIcon,
  secondaryCtaLabel = 'Continue Building',
  theme = 'green',
  onClaim,
  onContinue,
  className,
}) => (
  <section
    className={classNames(
      'w-full',
      'bg-[linear-gradient(180deg,var(--color-yellow-light)_0%,#fff_55%,var(--color-accent-light)_100%)]',
      'px-[clamp(16px,4vw,56px)] pt-[clamp(40px,5vw,80px)] pb-0',
      className
    )}
  >
    {/* Centred celebration content (image, headline, stats, CTAs) */}
    <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
      {/* Hero image — the reward / trophy badge */}
      <img
        src={iconSrc}
        alt=""
        aria-hidden="true"
        className="size-[clamp(72px,8vw,108px)] object-contain"
      />

      {/* Milestone tag */}
      <span
        className={classNames(
          'mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1 border',
          (THEME_CLASSES[theme] || THEME_CLASSES.green).pill,
          'font-sans font-semibold text-[11px] leading-4 tracking-[1.2px] uppercase'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            'inline-block size-1.5 rounded-full',
            (THEME_CLASSES[theme] || THEME_CLASSES.green).pillDot
          )}
        />
        Milestone {milestoneNumber} of {totalMilestones} · Unlocked
      </span>

      {/* Headline — JSX, lets callers mix accent colours */}
      <h1 className="mt-4 font-display text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.5px] text-content-primary">
        {headline}
      </h1>

      {/* Description */}
      <p className="mt-4 font-sans text-[14px] leading-[22px] tracking-[0.2px] text-neutral-darker max-w-[60ch]">
        {description}
      </p>

      {/* Stat tiles */}
      <div className="mt-7 flex flex-wrap items-stretch justify-center gap-3">
        {stats.map((s) => (
          <MilestoneStatTile key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant={(THEME_CLASSES[theme] || THEME_CLASSES.green).primaryVariant}
          size="md"
          onClick={onClaim}
          leftIcon={
            primaryCtaIcon !== undefined ? primaryCtaIcon : <GiftEmoji className="text-[18px]" />
          }
          rightIcon={<ArrowRight className="size-4" />}
        >
          {primaryCtaLabel}
        </Button>
        <Button variant="tertiary" size="md" onClick={onContinue}>
          {secondaryCtaLabel}
        </Button>
      </div>
    </div>

    {/* Completed stages row — full-width, left-aligned (Figma exact).
      Sits below the centred celebration block so it reads as a footer
      strip rather than a continuation of the headline column. */}
    {completedStages.length > 0 && (
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center gap-2 pb-[clamp(24px,3vw,40px)]">
        <span className="font-sans font-semibold text-[10px] leading-3 tracking-[1.2px] uppercase text-neutral-darker">
          Completed:
        </span>
        {completedStages.map((stage) => (
          <span
            key={stage}
            className={classNames(
              'inline-flex items-center rounded-md px-3 py-1.5',
              'bg-accent text-accent-light',
              'font-sans font-semibold text-[12px] leading-4 tracking-[0.2px]'
            )}
          >
            {stage}
          </span>
        ))}
      </div>
    )}
  </section>
);

export default MilestoneHeroPanel;
