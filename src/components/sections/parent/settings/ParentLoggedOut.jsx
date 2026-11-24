import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useScopedRoundedFont from '../../../../hooks/useScopedRoundedFont.js';
import { debug } from '../../../../utils/debug.js';
import logo from '../../../../assets/engagement/GTHLogo 1.svg';
import SettingsResult from './SettingsResult.jsx';

const log = debug('ParentLoggedOut');

/*
 * ParentLoggedOut — PS-06b "You’re logged out" (Figma 10056:157278) after a real log out (ADR-08). The frame draws the card inside
 * the parent chrome with the sidebar dimmed, but once the session has ended that chrome can only show the sample parent ("Emma M.",
 * sample wards and counts), so the same card (SettingsResult) stands on the parent canvas under a logo-only top bar, as the talent
 * and recruiter logged-out screens do. Props: onLogIn.
 */
const ParentLoggedOut = ({ onLogIn }) => {
  useScopedRoundedFont('data-parent-ui');
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-[#f8f8f4]">
      <header className="flex h-[87px] shrink-0 items-center border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.24vw,56px)] shadow-[0_1px_1px_rgba(27,36,44,0.12)]">
        <Link
          to="/"
          aria-label="Ghana Talent Hub home"
          className="inline-flex shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <img
            src={logo}
            alt="Ghana Talent Hub"
            className="h-[66px] w-[71px] shrink-0 object-cover"
          />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-[880px] px-[16px] py-[clamp(24px,5vw,64px)]">
        <SettingsResult kind="logged-out" onLogIn={onLogIn} />
      </main>
    </div>
  );
};

export default ParentLoggedOut;
