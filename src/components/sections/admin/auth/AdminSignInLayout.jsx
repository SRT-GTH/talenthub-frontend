import { Link } from 'react-router-dom';
import gthLogoStacked from '../../../../assets/brand/gth-logo-stacked.webp';
import { useIsDesktop } from '../../../../hooks/useMediaQuery.js';
import AdminSignInPanel from './AdminSignInPanel.jsx';

/*
 * AdminSignInLayout — the page of the staff sign-in (Figma 7.0.1a-d): not the rail chrome (the visitor is not signed in yet). Cream nav (#f8f8f4, 90 high, logo
 * left, green "Public site" button right) · the form column (left, scrolls) · the green panel (right, 739 of 1728, >= lg).
 * Props: children (the form column content).
 */

const AdminSignInLayout = ({ children }) => {
  const isDesktop = useIsDesktop();
  return (
    <div className="flex min-h-dvh flex-col bg-[#f8f8f4] font-sans text-[#1c2a21]">
      <header className="sticky top-0 z-40 w-full shrink-0 border-b border-solid border-[#e7e7e7] bg-[#f8f8f4] shadow-[0_1px_2px_rgba(27,36,44,0.12)]">
        <div className="flex items-center justify-between px-4 py-3 max-md:py-1.5 md:px-16">
          <Link to="/admin/sign-in" aria-label="Ghana Talent Hub, staff sign-in">
            <img
              src={gthLogoStacked}
              alt="Ghana Talent Hub"
              className="h-[66px] w-[71px] max-md:h-10 max-md:w-[43px]"
            />
          </Link>
          <Link
            to="/"
            className="inline-flex h-[40px] items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[22px] font-sans text-[16px] leading-[24px] font-bold text-white no-underline shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-md:px-[14px] max-md:text-[14px]"
          >
            Public site
          </Link>
        </div>
      </header>
      <main className="flex min-h-0 flex-1" aria-label="Staff sign-in">
        <div className="relative flex min-w-0 flex-1 items-center justify-center bg-[radial-gradient(circle_at_20%_0%,#e3efe0,transparent_55%)] px-[16px] py-[24px] md:px-[24px] md:py-[34px]">
          {children}
        </div>
        {isDesktop ? <AdminSignInPanel /> : null}
      </main>
    </div>
  );
};

export default AdminSignInLayout;
