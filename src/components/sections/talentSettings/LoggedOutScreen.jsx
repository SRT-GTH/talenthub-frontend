import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import {
  DoodleStarLargeIcon,
  LoggedOutShieldIcon,
  WhiteArrowRightIcon,
} from '../../shared/assets.jsx';
import Button from '../../ui/Button.jsx';
import avatarPortrait from '../../../assets/talent-settings/menu/kofi-avatar-portrait.svg';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import glowMint from '../../../assets/talent-settings/menu/logged-out-glow-mint.svg';
import glowGold from '../../../assets/talent-settings/menu/logged-out-glow-gold.svg';

const log = debug('LoggedOutScreen');

/*
 * LoggedOutScreen — LO-02 "Logged out" (Playful 7846:14928 / Focused 8110:57103), rendered by `/logged-out`
 * (own route, no talent shell). Focused: flat #f8f8f4. Playful (only `playful:` variants): cream→canvas
 * wash, two blurred glows (mint top right, gold bottom left), faint dot grid, two doodle stars, 1.5px ink
 * card border with an offset shelf, Bricolage Grotesque title, yellow "SEE YOU SOON" sticker and a
 * gradient avatar. Copy verbatim from the frames; name / counts are mock data shaped for an API.
 * Geometry is expressed from the 1728px frame (vw / clamp) so it scales down to 320px.
 */
const SESSION = { firstName: 'Kofi', applications: 4, streakDays: 12 };

const LoggedOutScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    ensurePlayfulFont();
    log('mount', SESSION);
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#f8f8f4] font-sans playful:bg-[linear-gradient(135deg,#faf4e8_0%,#f8f8f4_100%)]">
      {/* Playful decoration (hidden in the Focused frame) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden overflow-hidden playful:block"
      >
        <img
          src={glowMint}
          alt=""
          className="absolute max-w-none left-[56.13vw] top-[-19.21vw] h-auto w-[57.87vw]"
        />
        <img
          src={glowGold}
          alt=""
          className="absolute max-w-none left-[-22vw] top-[23.61vw] h-auto w-[53.24vw]"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 21px 21px, rgba(255,255,255,0.08) 1px, transparent 1.5px)',
            backgroundSize: '40px 40px',
            backgroundPosition: '0 -52px',
          }}
        />
        <DoodleStarLargeIcon className="absolute left-[24.3vw] top-[278px] size-[26px] max-md:hidden" />
        <DoodleStarLargeIcon className="absolute left-[81vw] top-[508px] size-[12px] max-md:hidden" />
      </div>

      <header className="relative z-10 flex items-center gap-[16px] px-[clamp(16px,3.7vw,64px)] pt-[24px]">
        <Link
          to="/"
          aria-label="Ghana Talent Hub home"
          className="flex h-[60px] w-[76px] shrink-0 items-start rounded-[14px] bg-white px-[12px] py-[6px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img src={gthLogo} alt="Ghana Talent Hub" className="h-[48px] w-[52px] object-contain" />
        </Link>
        <span className="min-w-px flex-1" />
        <Link
          to="/login"
          className="flex h-[32px] items-center gap-[6px] rounded-[999px] border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] font-semibold whitespace-nowrap text-[#595959] no-underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          Log in
        </Link>
      </header>

      <main className="relative z-10 flex justify-center px-[clamp(12px,2vw,16px)] pt-[clamp(32px,18.5vh,202px)] pb-[32px]">
        <section
          aria-labelledby="logged-out-title"
          className="flex w-full max-w-[600px] flex-col items-center gap-[18px] rounded-[28px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[40px] leading-[normal] shadow-[0px_2px_4px_rgba(28,42,33,0.04),0px_1px_1px_rgba(28,42,33,0.04)] max-sm:gap-[14px] max-sm:rounded-[24px] max-sm:p-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0px_10px_12px_rgba(28,42,33,0.06),4px_4px_0px_rgba(28,42,33,0.45)]"
        >
          <span
            aria-hidden="true"
            className="relative size-[72px] shrink-0 overflow-hidden rounded-[36px] bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]"
          >
            <img
              src={avatarPortrait}
              alt=""
              draggable="false"
              className="absolute -bottom-[9px] left-1/2 h-[84px] w-[81px] max-w-none -translate-x-1/2 select-none"
            />
          </span>

          <span
            aria-hidden="true"
            className="hidden h-[32.551px] w-[104.92px] shrink-0 items-center justify-center playful:flex"
          >
            <span className="rotate-[4deg] rounded-[999px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[11px] font-bold whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0px_#1c2a21]">
              SEE YOU SOON
            </span>
          </span>

          <h1
            id="logged-out-title"
            className="m-0 text-center font-sans text-[clamp(28px,2.31vw,40px)] leading-[1.1] font-semibold tracking-[-0.8px] text-[#1c2a21] playful:font-[family-name:var(--pf-font-display)] playful:[font-variation-settings:'wdth'_100]"
          >
            You&apos;re logged out, {SESSION.firstName}.
          </h1>

          <p className="m-0 w-full text-center font-sans text-[17px] leading-[1.5] font-normal text-[#595959] max-sm:text-[15px]">
            Your profile, {SESSION.applications} applications and {SESSION.streakDays}-day streak
            are saved. Log back in before midnight to keep the streak.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-[12px] max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<WhiteArrowRightIcon />}
              onClick={() => {
                log('log back in');
                navigate('/login');
              }}
            >
              Log back in
            </Button>
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => {
                log('go to the homepage');
                navigate('/');
              }}
            >
              Go to the homepage
            </Button>
          </div>

          <p className="m-0 flex flex-wrap items-center justify-center gap-[6px] font-sans text-[14px]">
            <span className="font-normal text-[#595959]">Not {SESSION.firstName}?</span>
            <Link
              to="/login"
              className="font-semibold text-[#387440] underline decoration-solid underline-offset-[from-font] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              Log in with a different account
            </Link>
          </p>

          <div className="flex w-full items-center gap-[10px] rounded-[12px] bg-[#f8f8f4] p-[12px]">
            <LoggedOutShieldIcon className="size-[18px] shrink-0" />
            <p className="m-0 min-w-0 flex-1 font-sans text-[13.5px] font-medium text-[#1c2a21]">
              On a shared or school computer? Close this browser window too.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoggedOutScreen;
