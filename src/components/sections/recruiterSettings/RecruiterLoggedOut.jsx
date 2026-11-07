import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import DashboardPageBackground from '../dashboard/DashboardPageBackground.jsx';
import CareerBuddyFloatingButton from '../community/CareerBuddyFloatingButton.jsx';
import gthLogo from '../../../assets/engagement/GTHLogo 1.svg';
import { CheckCircleIcon } from './security/SettingsIcons.jsx';
import { LOGGED_OUT_COPY } from './security/securityData.js';

const log = debug('RecruiterLoggedOut');

/*
 * RecruiterLoggedOut - SR-27 "Logged out" (Figma 10161:86281), `?state=logged-out`: the Settings page renders it INSTEAD of the workspace shell. A white 87px top bar with the logo alone (no search, no actions), the recruiter canvas
 * (grid + blurred ellipses, `DashboardPageBackground variant="recruiter"`), and one centred card (520 wide, r16, #e5e8e3 hairline, p32, gap 14): a 64px #ebf1ec tile with the check-circle glyph, a Bricolage 30/600 "You're logged out, Joel.",
 * the 14/24 line, a full-width "Log back in" primary button, the green "Not Joel? Use a different account" link and the 12px shared-computer note. The Career Buddy launcher stays bottom right, as drawn.
 * The talent `LoggedOutScreen` draws another card (r28, two buttons, an avatar), so this recruiter screen has its own markup on the same assets.
 * ⚠️ ASSUMPTION: "Log back in" and "Not Joel? Use a different account" go to /login (no destination is drawn). Mock: no session exists to end.
 */
const RecruiterLoggedOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    log('mount');
  }, []);

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-white font-sans">
      <DashboardPageBackground className="z-0" variant="recruiter" />
      <header className="relative z-10 flex w-full shrink-0 items-center border-b border-[#e7e7e7] bg-white px-[clamp(16px,3.24vw,56px)] py-[10px] shadow-bottom-100 max-md:py-[8px]">
        <Link
          to="/"
          aria-label="Ghana Talent Hub home"
          className="inline-flex shrink-0 items-center rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          <img
            src={gthLogo}
            alt="Ghana Talent Hub"
            draggable="false"
            className="block h-[clamp(44px,3.82vw,66px)] w-auto select-none max-md:h-[36px]"
          />
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-[16px] py-[32px]">
        <section
          aria-labelledby="recruiter-logged-out-title"
          className="flex w-full max-w-[520px] flex-col items-center gap-[14px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[32px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)] max-sm:p-[20px]"
        >
          <span
            aria-hidden="true"
            className="flex size-[64px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] text-[#2a5730]"
          >
            <CheckCircleIcon className="size-[32px]" />
          </span>
          <h1
            id="recruiter-logged-out-title"
            className="m-0 text-center font-heading text-[clamp(26px,2.1vw,30px)] leading-[36px] font-semibold tracking-[-0.6px] text-[#111]"
          >
            {LOGGED_OUT_COPY.title}
          </h1>
          <p className="m-0 text-center text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
            {LOGGED_OUT_COPY.body}
          </p>
          <Button
            variant="primary"
            size="sm"
            className="!h-[48px] w-full !py-0"
            onClick={() => {
              log('log back in');
              navigate('/login');
            }}
          >
            {LOGGED_OUT_COPY.cta}
          </Button>
          <Link
            to="/login"
            className="inline-flex min-h-[24px] items-center text-center text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            {LOGGED_OUT_COPY.other}
          </Link>
          <p className="m-0 text-center text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
            {LOGGED_OUT_COPY.shared}
          </p>
        </section>
      </main>
      <CareerBuddyFloatingButton />
    </div>
  );
};

export default RecruiterLoggedOut;
