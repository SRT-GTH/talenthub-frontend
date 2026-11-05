import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { WELCOME_HERO, HERO_GRADIENT } from './recruiterHomeData.js';

const log = debug('RecruiterWelcomeHero');

/*
 * RecruiterWelcomeHero — the green gradient greeting banner at the top of the
 * recruiter dashboard home. Figma 7249:73914.
 *
 * Geometry: h176, r16, 1.5px #fefefe border, Elevation/Card shadow, padding
 * 24/40, inner column gap 4, trailing "Customize" button. V2.0 (3 Nov): the
 * headline is Bricolage Grotesque 600 24/30 (-0.12 tracking; was Instrument
 * Serif), the gradient is Forest Green #1f4a2b -> #3f7f4c, and "Customize" is
 * the shared tertiary Button (Figma instance 8178:141263, 96x38, r14, no icon).
 */
const RecruiterWelcomeHero = ({ onCustomize, className }) => {
  log('render', { headline: WELCOME_HERO.headline });

  return (
    <section
      className={classNames(
        'flex w-full items-center justify-between lg:min-h-[176px] gap-[18px] max-md:flex-col max-md:items-start max-md:gap-[10px] rounded-lg border-[1.5px] border-neutral-light shadow-card',
        // Figma pad L24 R24 T40 B40 — clamped so the banner compresses on narrow viewports.
        'px-[clamp(16px,1.8vw,24px)] py-[clamp(24px,3vw,40px)] max-md:px-[14px] max-md:py-[14px]',
        className
      )}
      style={{ backgroundImage: HERO_GRADIENT }}
    >
      <div className="flex min-w-0 flex-col gap-[4px]">
        <h1
          className="font-heading text-neutral-light max-md:text-[22px]!"
          /* Figma 24px/30, -0.12 tracking — clamped per the fluid-sizing rule. */
          style={{
            fontSize: 'clamp(1.375rem, 1.2rem + 0.4vw, 1.5rem)',
            lineHeight: 1.25,
            fontWeight: 600,
            letterSpacing: '-0.12px',
          }}
        >
          {WELCOME_HERO.headline}
        </h1>
        <p className="text-normal-75 max-md:text-[13px] max-md:leading-5 text-neutral-light">
          {WELCOME_HERO.subtitle}
        </p>
      </div>

      {/* Figma 8178:141249 — "Btn · Customize" instance: 96x38, white, 2px #1c2a21@30% stroke, r14, solid 4px shelf, 14/700, pad L12 R14 */}
      <Button
        variant="tertiary"
        size="xs"
        onClick={() => {
          log('branch', { action: 'customize', wired: false });
          onCustomize?.();
        }}
        className="relative h-[38px] shrink-0 rounded-[14px]! py-0! pl-[12px]! pr-[14px]! text-[14px]! after:absolute after:-inset-y-[4px] after:inset-x-0 max-md:h-[36px]"
      >
        {WELCOME_HERO.customizeLabel}
      </Button>
    </section>
  );
};

export default RecruiterWelcomeHero;
