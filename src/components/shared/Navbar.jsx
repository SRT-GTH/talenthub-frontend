import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import Logo from './Logo.jsx';
import { ROUTES } from '../../constants/routes.js';
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
 */

const NAV_ITEMS = [
  { label: 'For Talents', to: ROUTES.home },
  { label: 'Recruiters', to: ROUTES.home },
  { label: 'Schools', to: ROUTES.home },
  { label: 'How It Works', to: ROUTES.home },
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

const Navbar = () => {
  log('render');

  return (
    <header className="fixed top-5 left-0 right-0 z-30 px-6 md:px-12">
      <nav
        className={classNames(
          'mx-auto max-w-[1107px] h-[88px] px-12 rounded-xl',
          'flex items-center justify-between gap-8',
          'bg-[rgba(17,17,17,0.6)] backdrop-blur-[20px]',
          'border-[0.8px] border-brand-green',
          'shadow-[0_2px_2px_rgba(27,36,44,0.04),0_16px_24px_rgba(27,36,44,0.16)]'
        )}
        aria-label="Primary"
      >
        <div className="flex items-center gap-4 shrink-0">
          <Link to={ROUTES.home} className="inline-flex">
            <Logo size="md" />
          </Link>
          <Divider />
        </div>

        <ul className="flex items-center gap-[26px]">
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

        <div className="flex items-center gap-4 shrink-0">
          <Divider />
          <Link
            to={ROUTES.home}
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
      </nav>
    </header>
  );
};

export default Navbar;
