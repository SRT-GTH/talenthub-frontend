import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon, ProfileGhanaFlagIcon } from '../../../shared/assets.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { debug } from '../../../../utils/debug.js';
import { LpDoodleStar, LpScribbleUnderline } from './LpAIcons.jsx';
import { Fi20ArrowRight } from './LpFigmaIcons.jsx';
import { FcHeroStarIcon } from './LpFeatureCardIcons.jsx';
import { BuddyCard, DotGrid, MatchCard, RecruiterCard, Sticker, StreakCard } from './LpAParts.jsx';
import {
  HERO_AVATARS,
  HERO_HEADING,
  HERO_PILL,
  HERO_POLAROID_CAPTION,
  HERO_PRIMARY_CTA,
  HERO_RECRUITER_LINK,
  HERO_STATS,
  HERO_STICKERS,
  HERO_SUB,
  HERO_TRUST,
} from './HeroData.js';
import heroBg from '../../../../assets/landing/hero-background.webp';
import heroPhoto from '../../../../assets/landing/hero-student-photo.webp';
import polaroidPhoto from '../../../../assets/landing/features-preview-photo.webp';
import avatarA from '../../../../assets/landing/student-avatar-a.webp';
import avatarB from '../../../../assets/landing/student-avatar-b.webp';
import avatarC from '../../../../assets/landing/student-avatar-c.webp';
import avatarD from '../../../../assets/landing/student-avatar-d.webp';
import avatarE from '../../../../assets/landing/student-avatar-e.webp';

const log = debug('HeroSection');

/*
 * HeroSection — landing S1 · Hero. Figma: desktop 7797:7855 (1728x1000), tablet 7815:264460 (834x1420), mobile 7815:272277 (430x1501).
 *  - The shared LandingNav is an absolute overlay; the hero reserves its height (104 / 88 / 72) through the top padding.
 *  - Desktop (>= 1280) is a scaled canvas: `--u` = canvas width / 1728, every position/size of the hero copy and the sticker
 *    cluster is `calc(var(--u) * figmaPx)`, so the design keeps its proportions between 1280 and 1728 (and is capped at 1728).
 *  - Tablet / mobile stack: copy, photo stack (834 / 430 wide design scaled with `--u`), stats strip, kente stripe.
 *  - Background: desktop = hero-background photo under a left-to-right dark-green gradient; tablet/mobile = plain green gradient.
 * Assets: hero-student-photo (imageRef 6c08cdd3), features-preview-photo (b6cf7f79, polaroid), student-avatar-a..e, career-buddy-mascot.
 */

const U = (n) => `calc(var(--u) * ${n})`;

/* Per-breakpoint placement of an absolutely positioned decoration. m = mobile, t = tablet, d = desktop; each { l, t, w, h, r }. */
const CSS_VAR_KEYS = { l: 'l', t: 't', w: 'w', h: 'h' };
const placeVars = (m, t, d) => {
  const style = {};
  [
    ['m', m],
    ['t', t],
    ['d', d],
  ].forEach(([prefix, p]) => {
    if (!p) return;
    Object.entries(CSS_VAR_KEYS).forEach(([key, name]) => {
      if (p[key] !== undefined) style[`--${prefix}${name}`] = U(p[key]);
    });
    if (p.r !== undefined) style[`--${prefix}r`] = `${p.r}deg`;
  });
  return style;
};
const placeClass = (m, t, d) => {
  const show = m ? 'block' : t ? 'hidden md:block' : 'hidden xl:block';
  const hideAtXl = !d ? 'xl:hidden' : '';
  return `absolute ${show} ${hideAtXl} left-(--ml) top-(--mt) md:left-(--tl) md:top-(--tt) xl:left-(--dl) xl:top-(--dt) rotate-(--mr) md:rotate-(--tr) xl:rotate-(--dr)`;
};
const sizeClass = 'w-(--mw) h-(--mh) md:w-(--tw) md:h-(--th) xl:w-(--dw) xl:h-(--dh)';

const Decor = ({ m, t, d, className = '', style, children }) => (
  <div
    className={`${placeClass(m, t, d)} ${className}`}
    style={{ ...placeVars(m, t, d), ...style }}
  >
    {children}
  </div>
);

/* Float-card wrapper: em-sized children, font-size = 1 Figma px (mobile cards are drawn at ~0.82 of the tablet size). */
const FLOAT_FS = 'text-[length:calc(var(--u)*var(--ms))] md:text-[length:var(--u)]';

const AVATAR_SRC = { a: avatarA, b: avatarB, c: avatarC, d: avatarD, e: avatarE };

const HeroSection = () => {
  useEffect(() => {
    log('mount: S1 hero, stats', HERO_STATS.length);
  }, []);

  return (
    <section
      id="lp-hero"
      aria-labelledby="lp-hero-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#0f2414_0%,#1e4a27_55%,#2e6436_100%)] text-white [container-type:inline-size] xl:bg-[#14301a] xl:bg-none"
    >
      {/* Desktop background photo + left→right dark-green wash (Figma fills of 7797:7855) */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 -z-20 hidden size-full object-cover xl:block"
      />
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(20,48,26,0.95)_0%,rgba(20,48,26,0.88)_42%,rgba(20,48,26,0.62)_70%,rgba(20,48,26,0.48)_100%)] xl:block" />
      {/* bg glows (Figma ellipses, layer blur 180 = 90px CSS): desktop lime top-right / gold lower-left; tablet + mobile frames draw both at the top-left origin */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 size-[620px] rounded-full bg-[#84cc16]/[0.22] blur-[90px] xl:-top-[120px] xl:left-[calc(100%-628px)]" />
      <div className="pointer-events-none absolute left-0 top-0 -z-10 size-[520px] rounded-full bg-[#c8951a]/[0.22] blur-[90px] xl:-left-[160px] xl:top-[64%]" />
      <DotGrid color="rgba(255,255,255,0.08)" className="-z-10" />

      <div className="relative mx-auto flex w-full max-w-[1728px] flex-col gap-7 pb-12 pt-[112px] [--u:calc(min(100cqw,430px)/430)] md:gap-10 md:pb-16 md:pt-[160px] md:[--u:calc(min(100cqw,834px)/834)] xl:block xl:h-[calc(var(--u)*1000)] xl:p-0 xl:[--u:calc(min(100cqw,1728px)/1728)]">
        {/* ───────── Hero copy ───────── */}
        <div className="flex flex-col items-start gap-6 px-5 md:px-6 xl:absolute xl:left-[calc(var(--u)*96)] xl:top-[calc(var(--u)*293)] xl:z-10 xl:w-[calc(var(--u)*760)] xl:gap-[calc(var(--u)*24)] xl:p-0">
          <span className="inline-flex h-[35px] items-center gap-2 rounded-full border border-white/30 bg-white/10 py-2 pl-[10px] pr-[14px]">
            <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
              <ProfileGhanaFlagIcon />
            </span>
            <span className="font-sans text-[14px] font-semibold leading-[16.7px] text-white">
              {HERO_PILL}
            </span>
          </span>

          <h1
            id="lp-hero-heading"
            className="m-0 font-heading text-[clamp(30px,9.07vw,39px)] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[57px] xl:text-[length:calc(var(--u)*77)]"
          >
            <span className="block text-white">
              {/* Mobile frame breaks the line after "Stop being" on purpose (Figma 7815:272277). */}
              {HERO_HEADING[0].replace(' overlooked.', '')}
              <br className="md:hidden" /> overlooked.
            </span>
            <span className="relative block text-[#ffd86b]">
              {HERO_HEADING[1]}
              <LpScribbleUnderline
                className="absolute hidden text-black xl:block"
                style={{
                  left: U(197),
                  top: `calc(100% - ${U(3)})`,
                  width: U(506),
                  height: U(33),
                }}
              />
            </span>
          </h1>

          <p className="m-0 max-w-[640px] font-sans text-[17px] font-normal leading-[30px] text-white/[0.88] md:max-w-none md:text-[20px] xl:max-w-[calc(var(--u)*640)] xl:text-[length:calc(var(--u)*20)] xl:leading-[calc(var(--u)*30)]">
            {HERO_SUB}
          </p>

          <div className="flex w-full flex-col items-stretch gap-5 md:w-auto md:flex-row md:items-center">
            <Link
              to={LANDING_ROUTES.getStarted}
              className="flex no-underline md:inline-flex"
              onClick={() => log('cta: create my free profile ->', LANDING_ROUTES.getStarted)}
            >
              <Button
                size="lg"
                className="w-full max-lg:rounded-[14px]! max-lg:px-6! py-[14.5px]! max-lg:text-[16px]! max-lg:drop-shadow-[0_4px_0_#224626]! max-md:px-5! md:w-auto"
                rightIcon={<ArrowRightIcon />}
                tabIndex={-1}
              >
                {HERO_PRIMARY_CTA}
              </Button>
            </Link>
            {/* Not linked in Figma: kept inert (logged) until the recruiter page exists. */}
            <button
              type="button"
              onClick={() => log('recruiters link clicked (inert, no target in Figma)')}
              className="inline-flex cursor-pointer items-center gap-[6px] self-start md:self-center border-0 bg-transparent p-0 font-sans text-[15px] font-semibold leading-[18px] text-white lp-ul focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd86b]"
            >
              {HERO_RECRUITER_LINK}
              <Fi20ArrowRight className="size-4 text-white" />
            </button>
          </div>

          <div className="flex w-full flex-col items-start gap-[14px] md:w-auto md:flex-row md:items-center">
            <div className="flex items-center">
              {HERO_AVATARS.map((key, i) => (
                <img
                  key={key}
                  src={AVATAR_SRC[key]}
                  alt=""
                  className={`size-9 rounded-full border-2 border-[#1e4a27] object-cover ${i ? '-ml-[10px]' : ''}`}
                />
              ))}
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="flex items-center gap-[2px] text-[#ffd86b]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <FcHeroStarIcon key={i} />
                ))}
              </span>
              <span className="font-sans text-[14px] font-medium leading-[16.7px] text-white">
                {HERO_TRUST}
              </span>
            </div>
          </div>
        </div>

        {/* ───────── Photo stack ───────── */}
        <div
          aria-hidden="true"
          className="relative mx-auto h-[calc(var(--u)*500)] w-[calc(var(--u)*430)] md:h-[calc(var(--u)*620)] md:w-[calc(var(--u)*834)] xl:absolute xl:inset-0 xl:mx-0 xl:h-auto xl:w-full"
        >
          {/* Polaroid "Week 1 · first match" (desktop only) */}
          <Decor
            d={{ l: 939.5, t: 169, w: 220, h: 230, r: -8 }}
            className={`${sizeClass} text-[length:var(--u)] flex flex-col gap-[10em] rounded-[6em] bg-white px-[10em] pb-[14em] pt-[10em] shadow-[5em_5em_0_rgba(20,41,22,0.35),0_12em_28em_rgba(0,0,0,0.18)]`}
          >
            <img
              src={polaroidPhoto}
              alt=""
              className="h-[180em] w-[200em] rounded-[3em] object-cover"
            />
            <span className="font-sans text-[13em] font-semibold leading-[15.5em] text-black">
              {HERO_POLAROID_CAPTION}
            </span>
          </Decor>

          {/* Hero photo */}
          <Decor
            m={{ l: 39.5, t: 21.5, w: 366, h: 439, r: -2 }}
            t={{ l: 156.5, t: 20, w: 540, h: 560, r: -2 }}
            d={{ l: 1069.5, t: 190, w: 520, h: 600, r: 2.5 }}
            className={`${sizeClass} overflow-hidden rounded-[36px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#1e4a27] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]`}
          >
            <img src={heroPhoto} alt="" className="size-full object-cover" />
          </Decor>

          {/* Stickers + doodles */}
          <Decor
            m={{ l: 289, t: 16.5, r: 6 }}
            t={{ l: 633, t: 14.5, r: 6 }}
            d={{ l: 744, t: 262.5, r: -6 }}
            className="text-[length:var(--u)]"
          >
            <Sticker bg="#ffd86b">{HERO_STICKERS.noCv}</Sticker>
          </Decor>
          <Decor
            m={{ l: 46, t: 293.4, r: -8 }}
            t={{ l: 122, t: 353.4, r: -8 }}
            d={{ l: 1472, t: 553.4, r: -8 }}
            className="text-[length:var(--u)]"
          >
            <Sticker bg="#84cc16">{HERO_STICKERS.topTalent}</Sticker>
          </Decor>
          <Decor
            m={{ l: 370, t: 60, w: 28, h: 28 }}
            t={{ l: 684, t: 80, w: 28, h: 28 }}
            d={{ l: 885, t: 270, w: 28, h: 28 }}
            className={`${sizeClass} text-[#ffd86b]`}
          >
            <LpDoodleStar className="size-full" />
          </Decor>
          <Decor
            m={{ l: 390, t: 90, w: 12, h: 12 }}
            t={{ l: 714, t: 120, w: 12, h: 12 }}
            d={{ l: 917, t: 310, w: 12, h: 12 }}
            className={`${sizeClass} text-[#84cc16]`}
          >
            <LpDoodleStar className="size-full" />
          </Decor>

          {/* Float cards */}
          <Decor
            m={{ l: 8, t: 0, r: 0 }}
            t={{ l: 60, t: 20, r: 0 }}
            d={{ l: 1419.5, t: 169.5, r: -4 }}
            className={`${FLOAT_FS} lp-float`}
            style={{ '--ms': 0.85 }}
          >
            <StreakCard />
          </Decor>
          <Decor
            m={{ l: 8, t: 350 }}
            t={{ l: 30, t: 420 }}
            d={{ l: 889, t: 559.5, r: 3 }}
            className={`${FLOAT_FS} lp-float`}
            style={{ '--ms': 0.82 }}
          >
            <MatchCard />
          </Decor>
          <Decor
            t={{ l: 514, t: 470 }}
            d={{ l: 1429.5, t: 699, r: -3 }}
            className="text-[length:var(--u)] lp-float"
          >
            <BuddyCard />
          </Decor>
          <Decor
            m={{ l: 185, t: 438 }}
            t={{ l: 504, t: 40 }}
            d={{ l: 999, t: 879, r: 2.5 }}
            className={`${FLOAT_FS} lp-float`}
            style={{ '--ms': 0.82 }}
          >
            <RecruiterCard />
          </Decor>
        </div>

        {/* ───────── Stats ───────── */}
        <div className="px-5 md:px-6 xl:absolute xl:left-[calc(var(--u)*96)] xl:top-[calc(var(--u)*800)] xl:z-10 xl:p-0">
          <dl className="m-0 grid grid-cols-2 gap-y-3 overflow-hidden rounded-[22px] border border-white/25 bg-white/[0.08] md:flex md:w-full md:gap-y-0 xl:inline-flex xl:w-auto">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-[2px] px-5 py-4 md:px-6 xl:px-7">
                <dt className="order-1 m-0 font-sans text-[13px] font-medium leading-[15.5px] text-white">
                  {s.label}
                </dt>
                <dd className="order-0 m-0 font-heading text-[26px] font-semibold leading-[31.2px] text-[#ffd86b] md:text-[29px] md:leading-[34.8px] xl:text-[32px] xl:leading-[38.4px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
