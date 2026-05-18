import { classNames } from '../../../utils/classNames.js';
import MilestoneStatTile from '../../cards/MilestoneStatTile.jsx';
import Button from '../../ui/Button.jsx';
import giftImg from '../../../assets/engagement/reward-gift.png';

/*
 * MilestoneHeroPanel — centred celebration hero on the milestone unlock screen.
 * Source: Figma frame ("You're discoverable" milestone hero).
 *
 * Layout (vertical, all centred):
 *   ├─ gift / trophy image (top, ~80×80)
 *   ├─ "MILESTONE n OF 3 · UNLOCKED" small green pill
 *   ├─ headline ("You're discoverable.") with italic green accent
 *   ├─ description paragraph
 *   ├─ stat tiles row (3 wide)
 *   ├─ CTA row: primary "🎁 Claim your reward →" + tertiary "Continue Building"
 *   └─ completed-stages row: "COMPLETED:" label + chips per stage
 *
 * The hero sits on the same soft cream → green-light wash used by the
 * engagement hero so the page feels continuous when crossed from the
 * profile-engagement hub.
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

const MilestoneHeroPanel = ({
  milestoneNumber = 1,
  totalMilestones = 3,
  headlinePrefix,
  headlineAccent,
  description,
  stats = [],
  completedStages = [],
  iconSrc = giftImg,
  onClaim,
  onContinue,
  className,
}) => (
  <section
    className={classNames(
      'w-full',
      'bg-[linear-gradient(180deg,var(--color-yellow-light)_0%,#fff_55%,var(--color-accent-light)_100%)]',
      'px-[clamp(16px,4vw,56px)] py-[clamp(40px,5vw,80px)]',
      className
    )}
  >
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
          'mt-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1',
          'bg-brand-green-light border border-brand-green-light-active',
          'font-sans font-semibold text-[11px] leading-4 tracking-[1.2px] uppercase text-brand-green-dark'
        )}
      >
        <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-brand-green" />
        Milestone {milestoneNumber} of {totalMilestones} · Unlocked
      </span>

      {/* Headline */}
      <h1 className="mt-4 font-display text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.5px] text-content-primary">
        {headlinePrefix} <span className="italic text-brand-green">{headlineAccent}</span>
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
          variant="primary"
          size="md"
          onClick={onClaim}
          leftIcon={<GiftEmoji className="text-[18px]" />}
          rightIcon={<ArrowRight className="size-4" />}
        >
          Claim your reward
        </Button>
        <Button variant="tertiary" size="md" onClick={onContinue}>
          Continue Building
        </Button>
      </div>

      {/* Completed stages row */}
      {completedStages.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
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
    </div>
  </section>
);

export default MilestoneHeroPanel;
