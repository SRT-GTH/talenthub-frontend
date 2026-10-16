import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';
import { useIsDesktop } from '../../../hooks/useMediaQuery.js';
import { debug } from '../../../utils/debug.js';

const log = debug('CareerBuddyHero');

/*
 * CareerBuddyHero — the first-visit hero shown above the chat thread on the
 * Career Buddy welcome screen, before any conversation has happened.
 *
 * Extracted from CareerBuddySection's local `FirstTimeHero` (2026-08-10) so
 * the recruiter flow can reuse it. Figma renders the two identically —
 * talent 5132:43308 vs recruiter 5132:69191 share the same headline,
 * subtitle, card geometry and type ramp; only `buddyCardSubtitle` differs
 * ("your personal career mentor" vs "your personal recruitment assistant").
 * That single string is the reason this takes a `hero` object rather than
 * reading a module constant.
 *
 * Props
 *   hero  { eyebrow, headlineRest, subtitle, buddyCardLabel, buddyCardSubtitle }
 *         All five strings are verbatim Figma `characters`. `eyebrow` renders
 *         in Instrument Serif brand-green and `headlineRest` continues the
 *         same <h1> in the sans face — the mixed-style headline Figma encodes
 *         via characterStyleOverrides on node 5132:69237.
 *   playful  boolean — talent Playful appearance (Figma 7873:50537). Renders a
 *         separate markup branch (PlayfulHero) with its own verbatim copy; the
 *         Focused branch below is untouched. Never set for recruiter/parent.
 */

// Figma 7873:50537 / 50538 / 50567 / 7881:86240 — verbatim `characters`.
// The headline is three runs (characterStyleOverrides): ink, green, ink.
const PLAYFUL_HERO = {
  sticker: 'MEET YOUR CAREER BUDDY',
  headlineStart: "Let's build a profile that ",
  headlineEmphasis: 'gets you seen',
  headlineEnd: '.',
  subtitle: 'Ghana Talent AI · your career buddy from SHS to your first big role',
};

// Optical size is left on auto: Figma's metadata says opsz 14, but the rendered frames match
// opsz = font-size (44px headline measures 740px in Figma, 739px at opsz 44 here).
const DISPLAY_FONT =
  "font-[family-name:var(--pf-font-display)] [font-variation-settings:'wdth'_100]";

const PlayfulHero = ({ hero }) => {
  log('render', { branch: 'playful' });
  // The mascot keeps its place on phones, just smaller (Figma 80px >= lg).
  const avatarSize = useIsDesktop() ? 80 : 48;

  return (
    <section
      aria-label="Welcome"
      className="flex shrink-0 flex-col items-center gap-[14px] px-4 pb-3 pt-4 text-center lg:px-10 lg:pb-6 max-xl:lg:gap-[10px] [@media(max-height:820px)]:lg:gap-2 [@media(max-height:820px)]:lg:pb-3 lg:pt-[clamp(36px,calc(100vh-9.89vw-612px),308px)] max-lg:max-h-[34%] max-lg:min-h-0 max-lg:shrink max-lg:gap-2 max-lg:overflow-y-auto"
    >
      <div className="flex w-full flex-col items-center gap-[14px] max-lg:gap-1.5">
        <div className="relative flex w-fit max-w-full flex-col items-center [--hs:clamp(26px,2.55vw,44px)] text-[length:var(--hs)] max-lg:w-full max-lg:gap-1.5 max-lg:text-[clamp(22px,6.4vw,28px)]">
          {/* genz:sticker · Meet your Career Buddy — Figma 7881:86239 (rotate 5deg, #32683a, white 11px bold) */}
          <span
            aria-hidden="true"
            className="z-[1] inline-block rotate-[3deg] rounded-[12px] bg-[#32683a] px-[16px] py-[14px] font-sans text-[11px] font-bold leading-[normal] text-white max-lg:px-3 max-lg:py-1.5 max-lg:text-[12px] lg:absolute lg:left-[calc(var(--hs)*0.6)] lg:top-[calc(var(--hs)*-0.85)] lg:rotate-[5deg]"
          >
            {PLAYFUL_HERO.sticker}
          </span>
          <h1
            className={`text-[#1c2a21] ${DISPLAY_FONT} text-[1em] font-semibold leading-[1.1] tracking-[-0.02em]`}
          >
            <span>{PLAYFUL_HERO.headlineStart}</span>
            <span className="text-brand-green">{PLAYFUL_HERO.headlineEmphasis}</span>
            <span>{PLAYFUL_HERO.headlineEnd}</span>
          </h1>
        </div>
        <p className="font-sans text-[clamp(14px,1.04vw,18px)] leading-normal text-[#595959] max-lg:text-[13px] max-lg:leading-snug">
          {PLAYFUL_HERO.subtitle}
        </p>
      </div>

      {/* Buddy card — Figma 7873:50539: 450w, r20, 1.5px ink@55%, soft + 5px hard shelf shadow */}
      <div className="mt-[14px] flex w-full max-w-[450px] items-center gap-[14px] rounded-[20px] lg:w-fit lg:min-w-[450px] lg:max-w-none [@media(max-height:820px)]:lg:mt-0 border-[1.5px] border-solid border-[rgba(28,42,33,0.55)] bg-white px-[16px] py-[14px] shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] max-lg:mt-0 max-lg:gap-2.5 max-lg:rounded-[16px] max-lg:px-2.5 max-lg:py-2 max-lg:shadow-[0_6px_8px_rgba(28,42,33,0.06),3px_3px_0_rgba(28,42,33,0.55)]">
        <CareerBuddyAvatar size={avatarSize} />
        <p className="text-left text-[clamp(15px,1.04vw,18px)] leading-normal text-[#404040] lg:whitespace-nowrap max-lg:text-[13px] max-lg:leading-snug">
          <span className={`${DISPLAY_FONT} text-[0.944em] font-semibold`}>
            {hero.buddyCardLabel}
          </span>
          {'  '}
          <span className="font-sans">{hero.buddyCardSubtitle}</span>
        </p>
      </div>
    </section>
  );
};

const CareerBuddyHero = ({ hero, playful = false }) => {
  log('render', { eyebrow: hero?.eyebrow, buddyCardSubtitle: hero?.buddyCardSubtitle, playful });
  // The mascot keeps its place on phones, just smaller (Figma 80px >= lg).
  const avatarSize = useIsDesktop() ? 80 : 40;

  if (playful) return <PlayfulHero hero={hero} />;

  return (
    <div className="flex flex-col items-center text-center px-10 pt-14 pb-6 gap-[14px] shrink-0 max-lg:min-h-0 max-lg:shrink max-lg:max-h-[30%] max-lg:overflow-y-auto max-lg:gap-1.5 max-lg:px-4 max-lg:pb-2 max-lg:pt-2">
      <h1 className="text-[32px] tracking-[0.1px] text-[#404040] max-w-[782px] max-lg:text-[18px] max-lg:leading-snug">
        <span className="font-display not-italic leading-[1.3] text-brand-green max-lg:leading-snug">
          {hero.eyebrow}
        </span>
        <span className="font-sans font-medium leading-[1.3] max-lg:leading-snug">
          {hero.headlineRest}
        </span>
      </h1>
      <p className="font-sans text-[18px] text-[#595959] max-lg:max-w-full max-lg:truncate max-lg:text-[12px] max-lg:leading-4">
        {hero.subtitle}
      </p>
      <div className="mt-[14px] flex w-full max-w-[450px] items-center gap-[14px] rounded-[12px] border border-[#e8e8e7] bg-[#f8f8f4] px-[16px] py-[14px] max-lg:mt-0 max-lg:gap-2.5 max-lg:px-2.5 max-lg:py-2">
        <CareerBuddyAvatar size={avatarSize} />
        <p className="text-[18px] leading-normal text-[#404040] text-left max-lg:text-[13px] max-lg:leading-snug">
          <span className="font-display not-italic">{hero.buddyCardLabel}</span>
          {'  '}
          <span className="font-sans">{hero.buddyCardSubtitle}</span>
        </p>
      </div>
    </div>
  );
};

export default CareerBuddyHero;
