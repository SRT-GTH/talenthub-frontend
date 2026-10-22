import { Link } from 'react-router-dom';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { FiDoodleStar } from '../home/LpFigmaIcons.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { debug } from '../../../../utils/debug.js';
import bandSrc from '../../../../assets/landing/final-cta-band-background.webp';

const log = debug('FinalCta');

/*
 * FinalCta — S10 "Final CTA" (Figma desktop 7797:14863 1728x523, tablet 7815:271440 834x472, mobile 7815:279257 430x489; #fbf3e4).
 * Photo band only on the landing home (`photo`); the other pages use the plain gradient (Figma 7797:27417). Band: rounded-[44px], 1.4px ink@.32 border, hard + soft shadow. Desktop: photo + #14301a gradient (.72/.90/.62). Tablet + mobile: plain gradient
 * #14301a → #387440. Lime glow, two rotated stickers, two doodle stars. Heading Bricolage 64/47/32 (gold "starts today."), sub 19/17, CTAs:
 * desktop/tablet in a row (centred), mobile stacked (full-width button, "Already registered? Log in" left-aligned).
 * Sticker/star positions per frame are read from the Figma frames (mobile: px from the 390 band, tablet: % of the 786 band).
 * Updated design: no kente strip. All copy verbatim from the Figma text nodes.
 */
const STICKER =
  'absolute whitespace-nowrap rounded-[8px] border-[1.2px] border-[#1c2a21] px-[11px] py-[5px] font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.06em] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21]';

const FinalCta = ({ photo = false }) => {
  log('render');
  return (
    <section className="bg-[#fbf3e4] px-5 py-10 md:px-6 md:py-14 xl:px-24 xl:py-[60px]">
      <div className="relative mx-auto flex min-h-[409px] w-full max-w-[1536px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[44px] border-[1.4px] border-[#1c2a21]/[.32] bg-[linear-gradient(135deg,#14301a_0%,#387440_100%)] px-5 py-14 text-center shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)] md:min-h-[360px] md:px-10 md:py-[72px] xl:min-h-[394px] xl:py-20">
        {photo ? (
          <>
            <img
              src={bandSrc}
              alt=""
              className="absolute inset-0 hidden size-full object-cover xl:block"
            />
            <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(20,48,26,.72)_0%,rgba(20,48,26,.9)_50%,rgba(20,48,26,.62)_100%)] xl:block" />
          </>
        ) : null}
        <div className="absolute left-[6px] top-[200px] size-[500px] rounded-full bg-[#84cc16]/25 blur-[80px] md:left-[35%] xl:-bottom-[150px] xl:left-auto xl:right-[8%] xl:top-auto" />

        <span
          className={`${STICKER} left-4 top-[13px] -rotate-[5deg] bg-[#84cc16] md:left-[84.6%] md:top-[70px] xl:left-auto xl:right-[8%] xl:top-7`}
        >
          NO CV NEEDED
        </span>
        <span
          className={`${STICKER} left-[197px] top-[23px] rotate-6 bg-[#ffd86b] md:left-[25%] md:top-[39px] xl:left-[8%] xl:top-7`}
        >
          FREE FOREVER
        </span>
        <FiDoodleStar className="absolute left-[300px] top-[330px] size-[30px] text-[#ffd86b] md:left-[38%] xl:bottom-[10%] xl:left-[19%] xl:top-auto" />
        <FiDoodleStar className="absolute left-[370px] top-[330px] size-[14px] text-white/70 md:left-[97%] xl:bottom-[19%] xl:left-auto xl:right-[14%] xl:top-auto" />

        <h2 className="relative m-0 max-w-[760px] font-heading text-[32px] font-semibold leading-[1.1] text-white md:text-[47px] xl:text-[64px]">
          Your future <span className="text-[#ffd86b]">starts today.</span>
        </h2>
        <p className="relative m-0 max-w-[760px] font-sans text-[17px] leading-[29px] text-white md:text-[19px]">
          Free forever for students. Five minutes to start, about twenty to finish, and recruiters
          can find you after the first three stages.
        </p>
        <div className="relative flex w-full flex-col items-stretch gap-4 md:w-auto md:flex-row md:items-center md:justify-center">
          <Link to={LANDING_ROUTES.getStarted} className="no-underline max-md:block">
            <Button
              size="md"
              className="max-md:w-full"
              rightIcon={<ArrowRightIcon />}
              tabIndex={-1}
            >
              Create my free profile
            </Button>
          </Link>
          <Link
            to={LANDING_ROUTES.login}
            className="lp-ul self-start font-sans text-[15px] font-semibold text-white no-underline md:self-auto"
          >
            Already registered? Log in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
