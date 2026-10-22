import { Link } from 'react-router-dom';
import { ArrowRightIcon, FiDoodleStar } from '../../../shared/assets.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('PageHero');

/*
 * PageHero — the "Page hero" block shared by P-01..P-06 (Figma P-01 desktop 7797:19954, tablet 7815:281194 + photo wrap 7815:286943).
 * Gradient #0f2414 → #1e4a27 55% → #2e6436 with:
 *   - lime glow 600px at y -120 (x 1150 desktop / 228 tablet / 6 mobile) and gold glow 520px at (-160, 460), both blur 90px;
 *   - 2px dots every 40px (#fff @ 8%) over the top 610px only;
 *   - a gold 26px doodle star at y 320 (x 1300 desktop / right edge on tablet + mobile).
 * Body (gap 18px between every element): breadcrumb "Home › <page>" (14/500, current page gold) → chip (gold pill) → h1 (Bricolage 600, 67/50/34,
 * last phrase gold via `accent`) → sub (20/30) → `children`. Left padding 96 / 40 / 20. Breadcrumb top at 174 / 158 / 162px from the hero top
 * (mobile Figma 216 minus the 54px status-bar mock).
 * Photo: desktop 440x380 (rotated -3deg, radius 32) at the right (top 138px); tablet 786x420 and mobile 390x300 sit below the body (20px gap),
 * full width with 24 / 20px side padding; the wrap is 40 / 30px below the body and 91 / 66px above the hero bottom (Figma photo wrap measured on the rotated bbox + the unrotated offset). A gold "ABOUT 20 MIN"-style sticker (rotated -6deg) overlaps the top-right.
 * goldGlowY: top of the gold glow — Figma draws it at 460 (P-01, P-03), 340 (P-02, P-04, P-06) or 320 (P-05).
 * Props: crumb, chip ({ icon, label }), title, accent (trailing part of title drawn gold), mobileBreak (narrow the heading on mobile so only the last word wraps, as P-01/P-06 draw it: "…step by / step."), subtitle, photo ({ src, alt }), sticker, children, className.
 */
const PageHero = ({
  crumb,
  chip,
  title,
  accent,
  mobileBreak = false,
  goldGlowY = 460,
  subtitle,
  photo,
  sticker,
  children,
  className,
}) => {
  log('render', { crumb });
  return (
    <section
      className={classNames(
        'relative isolate overflow-hidden bg-[linear-gradient(180deg,#0f2414_0%,#1e4a27_55%,#2e6436_100%)] text-white',
        className
      )}
    >
      <div className="pointer-events-none absolute -top-[120px] left-[6px] -z-10 size-[600px] rounded-full bg-[#84cc16]/20 blur-[90px] md:left-[228px] xl:left-[calc(100%-578px)]" />
      <div
        className="pointer-events-none absolute -left-[160px] -z-10 size-[520px] rounded-full bg-[#c8951a]/[0.22] blur-[90px]"
        style={{ top: goldGlowY }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[610px] bg-[radial-gradient(circle_at_20px_20px,rgba(255,255,255,0.08)_1px,transparent_1.5px)] bg-[length:40px_40px]"
      />
      <FiDoodleStar className="pointer-events-none absolute right-[6px] top-[266px] size-[26px] text-[#ffd86b] md:top-[320px] xl:left-[calc(50%+436px)] xl:right-auto" />

      <div className="mx-auto flex w-full max-w-[1728px] flex-col xl:flex-row xl:items-start xl:justify-between">
        <div
          className={classNames(
            'flex min-w-0 max-w-[920px] xl:max-w-[1040px] flex-col items-start gap-[18px] px-5 pt-[162px] md:px-10 md:pt-[158px] xl:px-24 xl:pt-[174px]',
            photo ? 'xl:pb-[89px]' : 'pb-6 md:pb-[25px] xl:pb-[63px]'
          )}
        >
          <nav
            aria-label="Breadcrumb"
            className="flex h-[17px] items-center gap-2 font-sans text-[14px] font-medium leading-[17px]"
          >
            <Link to={LANDING_ROUTES.home} className="text-white no-underline">
              Home
            </Link>
            <span className="flex size-3 items-center text-white/60 [&>svg]:size-3">
              <ArrowRightIcon />
            </span>
            <span aria-current="page" className="font-bold text-[#ffd86b]">
              {crumb}
            </span>
          </nav>
          {chip ? (
            <span className="inline-flex h-[30px] items-center gap-[6px] rounded-full bg-[#ffd86b] px-[10px] font-sans text-[13px] font-semibold text-[#1c2a21]">
              {chip.icon}
              {chip.label}
            </span>
          ) : null}
          <h1
            className={classNames(
              'm-0 whitespace-pre-line font-heading text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-white md:text-[50px] xl:text-[67px]',
              mobileBreak && 'max-md:max-w-[360px]'
            )}
          >
            {accent && title.endsWith(accent) ? (
              <>
                {title.slice(0, -accent.length)}
                <span className="text-[#ffd86b]">{accent}</span>
              </>
            ) : (
              title
            )}
          </h1>
          {subtitle ? (
            <p className="m-0 max-w-[760px] font-sans text-[17px] leading-[30px] text-white md:max-w-[754px] md:text-[20px]">
              {subtitle}
            </p>
          ) : null}
          {children}
        </div>
        {photo ? (
          <div className="px-5 pb-[66px] pt-[30px] md:px-6 md:pb-[91px] md:pt-10 xl:mr-[88px] xl:w-[440px] xl:shrink-0 xl:px-0 xl:pb-0 xl:pt-[138px]">
            <div className="relative mx-auto aspect-[390/300] w-full md:aspect-[786/420] xl:aspect-[440/380]">
              <img
                src={photo.src}
                alt={photo.alt ?? ''}
                className="size-full -rotate-3 rounded-[32px] border-[1.5px] border-[#1c2a21]/55 object-cover shadow-[4px_4px_0_rgba(28,42,33,.45)]"
              />
              {sticker ? (
                <span className="absolute -top-[33px] right-[14px] -rotate-6 rounded-[8px] border-[1.2px] border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.06em] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] md:-top-[44px] md:right-[30px] xl:-top-[30px] xl:right-[25px]">
                  {sticker}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PageHero;
