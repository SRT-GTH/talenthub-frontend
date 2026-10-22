import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon, GlobeIcon } from '../../../shared/assets.jsx';
import { LANDING_NAV_LINKS, LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import logoSrc from '../../../../assets/landing/gth-logo-nav.png';

const log = debug('LandingNav');

/*
 * LandingNav — the nav that sits on the dark hero of every landing page (Figma Nav 7797:9049, 1728x104).
 *  - Desktop (>= 1280): logo tile 76x60 (white, radius) · six links (15/500 white) · spacer · "EN · GH" (13/600) · "Log in" (15/600) · "Get started" button 179x56.
 *  - Tablet (834, "LP · Nav · Compact" Device=Tablet 7804:9431): logo · spacer · "Log in" · "Get started" · 48x48 menu button (white@10%).
 *  - Mobile (430, Device=Mobile 7804:9457): logo 60x48 · spacer · 44x44 menu button.
 *  - Menu open (7805:2029, full-screen sheet): top row logo + 44x44 gold close button, six 53px link rows, language, "Get started",
 *    secondary "Log in", note "Free for students, forever · No CV needed".
 * Sticky: fixed to the top; once scrolled it gets a translucent dark-green backdrop so the white links stay legible over light sections (⚠️ not drawn in Figma).
 */
const LINK_CLASS =
  'font-sans text-[15px] font-medium leading-[18px] text-white no-underline transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd86b]';

const Logo = ({ className }) => (
  <Link
    to={LANDING_ROUTES.home}
    aria-label="Ghana Talent Hub — home"
    className={classNames(
      'flex shrink-0 items-center justify-center rounded-[14px] bg-white no-underline',
      className
    )}
  >
    <img src={logoSrc} alt="" className="h-[80%] w-auto object-contain" />
  </Link>
);

const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {open ? (
      <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    ) : (
      <path
        d="M3 6h16M3 11h16M3 16h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const Language = () => (
  <button
    type="button"
    onClick={() => log('language click (no behaviour drawn in Figma)')}
    className="inline-flex h-[34px] cursor-pointer items-center gap-[6px] rounded-full border border-white/40 bg-transparent px-[10px] font-sans text-[13px] font-semibold leading-[16px] text-white"
  >
    <GlobeIcon />
    EN · GH
  </button>
);

const LandingNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  log('render', { open });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={classNames(
          'inset-x-0 top-0 z-30 w-full',
          'fixed transition-[background-color,box-shadow] duration-300',
          scrolled && 'bg-[#0f2414]/90 shadow-[0_8px_24px_rgba(15,36,20,0.25)] backdrop-blur-md',
          'h-[72px] md:h-[88px] xl:h-[104px]'
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1728px] items-center gap-6 px-5 md:px-10 xl:px-[64px]">
          <Logo className="h-12 w-[60px] md:h-[60px] md:w-[76px]" />
          <nav
            aria-label="Primary"
            className="hidden items-center gap-[clamp(20px,2.2vw,30px)] xl:flex"
          >
            {LANDING_NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => classNames(LINK_CLASS, isActive && 'lp-ul font-bold')}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex-1" />
          <div className="hidden xl:block">
            <Language />
          </div>
          <Link
            to={LANDING_ROUTES.login}
            className={classNames(LINK_CLASS, 'hidden font-semibold md:inline')}
          >
            Log in
          </Link>
          <Link to={LANDING_ROUTES.getStarted} className="hidden no-underline md:block">
            <Button size="md" rightIcon={<ArrowRightIcon />} tabIndex={-1}>
              Get started
            </Button>
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-[12px] border-0 bg-white/10 text-white md:size-12 xl:hidden"
          >
            <MenuIcon open={false} />
          </button>
        </div>
      </header>

      {/* Always mounted so it can animate in AND out: fades + slides down 12px (350ms), hidden/inert once closed. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[linear-gradient(180deg,#0f2414_0%,#1e4a27_55%,#2e6436_100%)] transition-[opacity,translate,visibility] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-[834px] shrink-0 items-center justify-between px-5 md:h-[88px] md:px-10">
          <Logo className="h-12 w-[60px]" />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-[12px] border-0 bg-[#ffd86b] text-[#14301a]"
          >
            <MenuIcon open />
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-[834px] flex-1 flex-col px-5 pb-8 md:px-10">
          <nav aria-label="Menu" className="mt-4 flex flex-col">
            {LANDING_NAV_LINKS.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex h-[53px] items-center gap-3 border-b border-white/10 text-white no-underline"
              >
                <span className="w-[14px] font-sans text-[13px] font-medium text-[#ffd86b]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 font-heading text-[20px] font-medium">{l.label}</span>
                <span className="size-[22px] text-[#ffd86b]">
                  <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </nav>
          <div className="min-h-8 flex-1" />
          <div className="flex flex-col gap-3">
            <div>
              <Language />
            </div>
            <Link
              to={LANDING_ROUTES.getStarted}
              onClick={() => setOpen(false)}
              className="no-underline"
            >
              <Button size="md" className="w-full" rightIcon={<ArrowRightIcon />} tabIndex={-1}>
                Get started
              </Button>
            </Link>
            <Link
              to={LANDING_ROUTES.login}
              onClick={() => setOpen(false)}
              className="flex h-[55px] items-center justify-center rounded-[12px] border border-white/40 font-sans text-[17px] font-semibold text-white no-underline"
            >
              Log in
            </Link>
            <p className="m-0 text-center font-sans text-[13px] text-white/70">
              Free for students, forever · No CV needed
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingNav;
