import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Logo from './Logo.jsx';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Navbar');

/*
 * Navbar — landing-page floating top nav.
 * Source: Figma `nav.navbar` at node 2513:28586 inside the Landing Page
 * frame (2512:26783).
 *
 * Visual signature: a 1107×88 floating pill with a translucent dark fill
 * (rgba(17,17,17,0.6) + 20px backdrop-blur), 0.8px brand-green border,
 * 24px radius, and a soft drop shadow. Sits on top of the hero section
 * with horizontal margin so the page content peeks above and below.
 *
 * Layout (left → right):
 *   ├─ Logo (mark + wordmark)
 *   ├─ vertical divider
 *   ├─ Nav items (For Talents · Recruiters · Schools · How It Works)
 *   ├─ vertical divider
 *   ├─ Sign In (ghost button)
 *   └─ Get Started (primary button + arrow)
 *
 * Routes are placeholders pointing back at `/` until the route map grows.
 *
 * RESPONSIVE (wiki/responsive-plan.md §4): below `lg` the pill collapses to
 * logo + hamburger and the links / Sign In / Get Started live in a sheet
 * anchored under it. >= lg is the Figma pill, unchanged.
 */

const NAV_ITEMS = [
  { label: 'For Talents', to: '/' },
  { label: 'Recruiters', to: '/' },
  { label: 'Schools', to: '/' },
  { label: 'How It Works', to: '/' },
];

// 20-arrow-right — pulled directly from Figma node 41:1545.
// The icon's intrinsic viewBox is 14×10; Figma renders it inside a 20×20
// wrapper with 25% top/bottom + 15% left/right insets so the arrow sits
// centred within the gradient-text label. The fill is `currentColor` so
// the parent's text-colour controls the tint (brand-green-light here).
const ArrowRight = (props) => (
  <span className="relative block size-full overflow-clip" aria-hidden="true" {...props}>
    <span className="absolute" style={{ top: '25%', bottom: '25%', left: '15%', right: '15%' }}>
      <svg viewBox="0 0 14 10" preserveAspectRatio="none" fill="none" className="block size-full">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.73598 0.203852C9.03761 -0.0800352 9.51226 -0.0656517 9.79615 0.235979L13.7962 4.48598C14.068 4.77477 14.068 5.22524 13.7962 5.51403L9.79615 9.76403C9.51226 10.0657 9.03761 10.08 8.73598 9.79615C8.43435 9.51226 8.41996 9.03761 8.70385 8.73598L11.5142 5.75H0.75C0.335786 5.75 0 5.41422 0 5C0 4.58579 0.335786 4.25 0.75 4.25H11.5142L8.70385 1.26403C8.41996 0.962395 8.43435 0.48774 8.73598 0.203852Z"
          fill="var(--color-brand-green-light)"
        />
      </svg>
    </span>
  </span>
);

const Divider = () => <span aria-hidden="true" className="w-px h-[30px] bg-white/10 shrink-0" />;

const MenuIcon = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="size-6"
    aria-hidden="true"
  >
    {open ? (
      <>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </>
    ) : (
      <>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </>
    )}
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  log('render', { menuOpen });

  // Close the sheet on navigation and on Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="fixed top-3 left-0 right-0 z-30 px-3 xs:px-4 md:top-5 md:px-12">
      <nav
        className={classNames(
          'relative mx-auto max-w-[1107px] h-14 px-4 rounded-xl lg:h-[88px] lg:px-12',
          'flex items-center justify-between gap-8',
          'bg-[rgba(17,17,17,0.6)] backdrop-blur-[20px]',
          'border-[0.8px] border-brand-green',
          'shadow-[0_2px_2px_rgba(27,36,44,0.04),0_16px_24px_rgba(27,36,44,0.16)]'
        )}
        aria-label="Primary"
      >
        <div className="flex items-center gap-4 shrink-0">
          <Link to={'/'} className="inline-flex">
            <Logo size="md" />
          </Link>
          <span className="hidden lg:block">
            <Divider />
          </span>
        </div>

        <ul className="hidden items-center gap-[26px] lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    'font-sans text-[14px] leading-5 tracking-[0.2px] whitespace-nowrap',
                    'transition-colors duration-150',
                    isActive ? 'text-white' : 'text-neutral-dark hover:text-white'
                  )
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="tap-target grid place-items-center rounded-md text-white lg:hidden"
        >
          <MenuIcon open={menuOpen} />
        </button>

        <div className="hidden items-center gap-4 shrink-0 lg:flex">
          <Divider />
          <Link
            to={'/'}
            className={classNames(
              'inline-flex items-center justify-center w-[102px] h-12 rounded-md',
              'border-2 border-[rgba(193,212,196,0.7)]',
              'font-sans font-medium text-[14px] leading-6 tracking-[0.2px]',
              'text-white/80 hover:text-white hover:bg-white/5',
              'transition-colors duration-150'
            )}
          >
            Sign In
          </Link>
          {/* Get Started — Figma uses px-18 py-12 r-10 (Button `size="sm"`)
            with the 16px gradient text. Renders at ~51px tall vs Sign
            In's 48px; the parent's items-center keeps them visually
            aligned (Figma exact). */}
          <Button variant="primary" size="sm" rightIcon={<ArrowRight />}>
            Get Started
          </Button>
        </div>

        {menuOpen && (
          <div
            id="primary-mobile-menu"
            className="absolute left-0 right-0 top-[calc(100%+8px)] flex max-h-[calc(100dvh-88px)] flex-col gap-1 overflow-y-auto rounded-xl border-[0.8px] border-brand-green bg-[#111] p-3 shadow-[0_16px_24px_rgba(27,36,44,0.16)] backdrop-blur-[20px] lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="flex min-h-12 items-center rounded-md px-3 font-sans text-[16px] text-neutral-dark transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link
                to={'/'}
                className="inline-flex h-12 items-center justify-center rounded-md border-2 border-[rgba(193,212,196,0.7)] font-sans text-[14px] font-medium text-white/80 hover:bg-white/5 hover:text-white"
              >
                Sign In
              </Link>
              <Button variant="primary" size="sm" rightIcon={<ArrowRight />} className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
