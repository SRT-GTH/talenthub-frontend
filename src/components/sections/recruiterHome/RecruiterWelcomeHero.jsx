import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { CustomizeSlidersIcon } from './recruiterHomeIcons.jsx';
import { WELCOME_HERO, HERO_GRADIENT } from './recruiterHomeData.js';

const log = debug('RecruiterWelcomeHero');

/*
 * RecruiterWelcomeHero — the green gradient greeting banner at the top of the
 * recruiter dashboard home. Figma 7249:73914.
 *
 * Geometry: h176, r16, 1.5px #fefefe border, Elevation/Card shadow, padding
 * 24/40, inner column gap 4, trailing "Customize" pill. The headline is
 * Instrument Serif 26/31.2 with -0.13 letter-spacing — the only display-face
 * text on this screen.
 */
const RecruiterWelcomeHero = ({ onCustomize, className }) => {
  log('render', { headline: WELCOME_HERO.headline });

  return (
    <section
      className={classNames(
        'flex w-full items-center justify-between gap-[18px] rounded-lg border-[1.5px] border-neutral-light shadow-card',
        // Figma pad L24 R24 T40 B40 — clamped so the banner compresses on narrow viewports.
        'px-[clamp(16px,1.8vw,24px)] py-[clamp(24px,3vw,40px)]',
        className
      )}
      style={{ backgroundImage: HERO_GRADIENT }}
    >
      <div className="flex min-w-0 flex-col gap-[4px]">
        <h1
          className="font-display not-italic text-neutral-light tracking-[-0.13px]"
          /* Figma 26px/31.2 — clamped per the fluid-sizing rule. */
          style={{ fontSize: 'clamp(1.25rem, 1.1rem + 0.5vw, 1.625rem)', lineHeight: 1.2 }}
        >
          {WELCOME_HERO.headline}
        </h1>
        <p className="text-normal-75 text-neutral-light">{WELCOME_HERO.subtitle}</p>
      </div>

      {/* Figma 7249:73920 — 114x38, white, r12, pad L12 R14 T7 B7, gap 6 */}
      <button
        type="button"
        onClick={() => {
          log('branch', { action: 'customize', wired: false });
          onCustomize?.();
        }}
        className="inline-flex shrink-0 items-center gap-[6px] rounded-[12px] bg-white py-[7px] pl-[12px] pr-[14px] transition-all duration-300 ease-in hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <CustomizeSlidersIcon className="size-[15px] shrink-0 text-brand-green" />
        <span className="text-medium-75 text-brand-green">{WELCOME_HERO.customizeLabel}</span>
      </button>
    </section>
  );
};

export default RecruiterWelcomeHero;
