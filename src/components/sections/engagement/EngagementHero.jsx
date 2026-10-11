import { classNames } from '../../../utils/classNames.js';
import Tag from '../../ui/Tag.jsx';
import TagRow from '../../ui/TagRow.jsx';
import ClampText from '../../ui/ClampText.jsx';
import { useIsDesktop } from '../../../hooks/useMediaQuery.js';
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

const HERO_TAGS = [
  { accent: '11%', muted: 'Completed' },
  { accent: '40 Min', muted: 'total · across sittings' },
  { accent: 'Auto-Save', muted: 'on every field' },
];

const EngagementHero = ({
  completionPct,
  doneCount,
  inProgressCount,
  remainingCount,
  compactOnPhones = false,
  className,
}) => {
  const isDesktop = useIsDesktop();
  return (
    <section
      className={classNames(
        'w-full',
        // Soft horizontal wash — left brand-green-light, middle yellow-light,
        // right accent-light. Saturation kept low (~30%) so the section
        // never competes with content.
        'bg-[linear-gradient(90deg,var(--color-brand-green-light)_0%,var(--color-yellow-light)_45%,var(--color-yellow-light)_60%,var(--color-accent-light)_100%)]',
        'px-[clamp(16px,3vw,40px)] py-[clamp(24px,2.5vw,40px)] max-md:py-4',
        className
      )}
    >
      <div className="mx-auto flex flex-col lg:flex-row gap-8 max-md:gap-3 items-start justify-between max-w-[1620px]">
        <div
          className={classNames(
            'flex-1 min-w-0 max-w-[clamp(320px,40vw,520px)] max-lg:max-w-full',
            // milestone pages: phones keep only the standing card (ring art + counts)
            compactOnPhones && 'max-md:hidden'
          )}
        >
          <h1 className="font-display text-[clamp(34px,3.6vw,52px)] max-md:text-[26px] leading-[1.0] tracking-[-0.5px] text-content-primary">
            Your Profile,<span className="italic text-brand-green">Your Way.</span>
          </h1>
          <ClampText
            lines={2}
            className="mt-3 max-md:mt-1.5 font-sans text-[14px] max-md:text-[13px] leading-[22px] max-md:leading-[19px] tracking-[0.2px] text-neutral-darker max-w-[44ch]"
          >
            Nine stages, no fixed order. Save and bounce anytime &nbsp;most people finish across a
            week, not one sitting. Avatar alone makes you searchable. Pitch is when you get matched.
          </ClampText>
          <div className="mt-4 max-md:mt-2.5">
            <TagRow
              items={HERO_TAGS}
              gap={isDesktop ? 12 : 8}
              className="items-center"
              renderItem={(tag) => (
                <Tag key={tag.accent} variant="pill" color="brand" size="md">
                  <HeroTagContent accent={tag.accent} muted={tag.muted} />
                </Tag>
              )}
            />
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
};

export default EngagementHero;
