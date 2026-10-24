import { Link } from 'react-router-dom';
import heroPhoto from '../../../../assets/public-data/landing/ghana-city-skyline-hero.webp';
import { formatCount } from '../publicDataFormat.js';
import LandingHeroActions from './LandingHeroActions.jsx';
import { PublicIconClock } from './landingIcons.jsx';

/*
 * LandingHero — Figma 8.1.1a hero (8514:181: 1440x640, the city photo, a left-to-right shade rgba(20,41,23,.92) → .35 at 65% → .10, content at
 * x72 / y110 gap 18: eyebrow 14/17 600 +1.12 caps #c1d4c4 · h1 72/76 700 -1.8 white · sentence 20/30 #e1eae2 (620 wide) · three buttons).
 * Returning visitor 8.1.1b adds a white pill on top of the content: clock icon + "Continue where you left off → Partners" (14/600 #2a5730).
 * Phone 8.1.1a-m (8515:2679): a 358x420 r24 card, shade top → bottom rgba(20,41,23,.1) at 20% → .92, text at the bottom-left (h1 34/38, 15/21,
 * "Live, anonymised data on 219,428 young Ghanaians."), the buttons under the card (LandingHeroActions stacked).
 * Tablet / small laptop (no frame): the desktop composition with a fluid height and heading size.
 * Props: talents (number, the phone sentence), returning ({ label, to } | null)
 */

const LandingHero = ({ talents, returning = null }) => (
  <>
    <section
      aria-labelledby="landing-title"
      className="relative flex min-h-[420px] items-end overflow-hidden rounded-[24px] bg-[#142916] md:min-h-[520px] md:items-start md:rounded-none xl:min-h-[640px]"
    >
      <img
        src={heroPhoto}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,41,23,0.1)_20%,rgba(20,41,23,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(20,41,23,0.92)_0%,rgba(20,41,23,0.35)_65%,rgba(20,41,23,0.1)_100%)]"
      />
      <div className="relative z-10 flex w-full flex-col md:max-w-[864px] items-start gap-[10px] p-[20px] md:gap-[18px] md:px-[48px] md:pt-[72px] md:pb-[48px] xl:px-[72px] xl:pt-[110px]">
        {returning && (
          <Link
            to={returning.to}
            className="inline-flex items-center gap-[8px] rounded-full bg-white px-[14px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold text-[#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <PublicIconClock className="size-[16px]" />
            Continue where you left off → {returning.label}
          </Link>
        )}
        <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold tracking-[1.12px] text-[#c1d4c4] uppercase max-md:hidden">
          Ghana Talent Hub · public data
        </p>
        <h2
          id="landing-title"
          className="m-0 font-sans text-[34px] leading-[38px] font-bold tracking-[-0.34px] text-white md:text-[clamp(44px,6vw,72px)] md:leading-[1.055] md:tracking-[-0.025em]"
        >
          Ghana’s talent, discovered.
        </h2>
        <p className="m-0 max-w-[620px] font-sans text-[15px] leading-[21px] text-white md:text-[20px] md:leading-[30px] md:text-[#e1eae2]">
          <span className="md:hidden">
            Live, anonymised data on {formatCount(talents)} young Ghanaians.
          </span>
          <span className="hidden md:inline">
            Live, anonymised data on more than two hundred thousand young Ghanaians: where they are,
            what they want to do, and what they achieve.
          </span>
        </p>
        <LandingHeroActions layout="row" className="max-md:hidden" />
      </div>
    </section>
    <LandingHeroActions layout="stack" className="md:hidden" />
  </>
);

export default LandingHero;
