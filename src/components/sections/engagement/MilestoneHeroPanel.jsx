import { classNames } from '../../../utils/classNames.js';
import MilestoneStatTile from '../../cards/MilestoneStatTile.jsx';
import Button from '../../ui/Button.jsx';
import ClampText from '../../ui/ClampText.jsx';
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
      'px-[clamp(16px,4vw,56px)] pt-[clamp(40px,5vw,80px)] pb-0 max-md:pt-5',
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
        className="size-[clamp(72px,8vw,108px)] max-md:size-14 object-contain"
      />

      {/* Milestone tag */}
      <span
        className={classNames(
          'mt-3 max-md:mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1 max-md:py-0.5 border',
          (THEME_CLASSES[theme] || THEME_CLASSES.green).pill,
          'font-sans font-semibold text-[11px] max-lg:text-[12px] leading-4 tracking-[1.2px] uppercase'
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
      <h1 className="mt-4 max-md:mt-2 font-display text-[clamp(36px,5vw,56px)] max-md:text-[26px] leading-[1.05] tracking-[-0.5px] text-content-primary">
        {headline}
      </h1>

      {/* Description */}
      <ClampText
        lines={3}
        className="mt-4 max-md:mt-2 font-sans text-[14px] max-md:text-[13px] leading-[22px] max-md:leading-[19px] tracking-[0.2px] text-neutral-darker max-w-[60ch]"
      >
        {description}
      </ClampText>

      {/* Stat tiles */}
      <div
        className={classNames(
          'mt-7 flex w-full flex-wrap items-stretch justify-center gap-3 sm:w-auto',
          // phones: one compact strip (3-up, or 2x2 for four stats)
          'max-md:mt-4 max-sm:grid max-sm:gap-2',
          stats.length === 4 ? 'max-sm:grid-cols-2' : 'max-sm:grid-cols-3'
        )}
      >
        {stats.map((s) => (
          <MilestoneStatTile key={s.label} value={s.value} label={s.label} accent={s.accent} />
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-7 max-md:mt-3 flex flex-wrap items-center justify-center gap-3 max-sm:w-full max-sm:flex-col max-sm:gap-2">
        <Button
          variant={(THEME_CLASSES[theme] || THEME_CLASSES.green).primaryVariant}
          size="md"
          className="max-md:min-h-10 max-md:py-2 max-sm:w-full"
          onClick={onClaim}
          leftIcon={
            primaryCtaIcon !== undefined ? (
              primaryCtaIcon
            ) : (
              <GiftEmoji className="text-[18px] max-lg:text-[14px]" />
            )
          }
          rightIcon={<ArrowRight className="size-4" />}
        >
          {primaryCtaLabel}
        </Button>
        <Button
          variant="tertiary"
          size="md"
          className="max-md:min-h-10 max-md:py-2 max-sm:w-full"
          onClick={onContinue}
        >
          {secondaryCtaLabel}
        </Button>
      </div>
    </div>

    {/* Completed stages row — full-width, left-aligned (Figma exact).
      Sits below the centred celebration block so it reads as a footer
      strip rather than a continuation of the headline column. */}
    {completedStages.length > 0 && (
      <div className="mx-auto mt-12 max-md:mt-4 flex max-w-[1200px] flex-wrap items-center gap-2 pb-[clamp(24px,3vw,40px)] max-md:gap-1.5 max-md:pb-4">
        <span className="font-sans font-semibold text-[10px] max-lg:text-[12px] leading-3 tracking-[1.2px] uppercase text-neutral-darker">
          Completed:
        </span>
        {completedStages.map((stage) => (
          <span
            key={stage}
            className={classNames(
              'inline-flex items-center rounded-md px-3 py-1.5 max-md:px-2.5 max-md:py-0.5',
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
