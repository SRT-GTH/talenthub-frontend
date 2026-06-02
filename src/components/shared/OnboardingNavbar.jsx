import { Link, useLocation } from 'react-router-dom';
import gthLogoStacked from '../../assets/brand/gth-logo-stacked.png';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('OnboardingNavbar');

/*
 * OnboardingNavbar — slim header used on every onboarding step page.
 *
 * Source: Figma node `2849:66712` (below-18 onboarding nav). Replaces the
 * dark floating-pill landing Navbar on the onboarding subtree so the auth
 * flow reads as its own surface. Footer is intentionally omitted on these
 * pages (see MainLayout's route-based switch).
 *
 * Visual signature:
 *   - Cream `#F8F8F4` fill, 1px `#E7E7E7` bottom hairline, soft
 *     `0_1px_2px_rgba(27,36,44,0.12)` drop shadow.
 *   - Horizontal padding 64px (matches the GH onboarding 1728-wide frame).
 *   - 12px vertical padding.
 *   - Left: brand mark only (no wordmark per Figma).
 *   - Right CTA is context-aware:
 *       - On `/login`: primary "Create an account" pill (Figma node
 *         2849:52615) — brand-green fill, peach→mint gradient text, 4px
 *         dark-green shelf. Routes to `/get-started`.
 *       - Everywhere else (onboarding steps, /get-started): a "Log In"
 *         text link in brand-green with a `#142916` underline.
 *     Onboarding intentionally has no other nav escape hatch.
 */

// Primary CTA text gradient — Figma 188.377deg peach→mint, stops 0% / 20.192%.
// Mirrors the Button primary variant in components/ui/Button.jsx so the
// navbar CTA reads as the same family without pulling in the full Button
// component (which is sized too tall for the 40px nav pill).
const PRIMARY_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

const CREATE_ACCOUNT_CLASSES = classNames(
  'inline-flex h-10 items-center justify-center gap-2 px-5 rounded-[10px]',
  'border-t border-l-2 border-r-2 border-b-2 border-solid border-brand-green-dark bg-brand-green',
  'drop-shadow-[0_4px_0_#224626]',
  'hover:border-brand-green-active hover:drop-shadow-[0_5px_0_#224626]',
  'active:bg-brand-green-active active:border-brand-green-dark-hover active:translate-y-1 active:drop-shadow-none',
  'transition-[transform,filter,background-color,border-color] duration-100 ease-out',
  'font-sans font-semibold text-[14px] leading-5 tracking-[0.1px] whitespace-nowrap select-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
);

const OnboardingNavbar = () => {
  const { pathname } = useLocation();
  const isLoginPage = pathname === '/login';
  log('render; pathname:', pathname, 'isLoginPage:', isLoginPage);

  return (
    <header
      className="w-full bg-[#F8F8F4]"
      style={{
        borderBottom: '1px solid #E7E7E7',
        boxShadow: '0 1px 2px rgba(27,36,44,0.12)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-3 md:px-16">
        <Link to={'/'} aria-label="Ghana Talent Hub home">
          {/* Single composed 71×66 PNG per Figma node 3052:74371 — mark sits
              tight above the two-line "GHANA / TALENT HUB" wordmark with no
              separator gap. Pulled fresh from the Figma Dev Mode MCP rather
              than reusing the horizontal-wordmark gth-wordmark.png. */}
          <img src={gthLogoStacked} alt="Ghana Talent Hub" className="h-[66px] w-[71px]" />
        </Link>

        {isLoginPage ? (
          <Link to={'/get-started'} className={CREATE_ACCOUNT_CLASSES}>
            <span className="bg-clip-text text-transparent" style={PRIMARY_GRADIENT}>
              Create Account
            </span>
          </Link>
        ) : (
          <Link
            to={'/login'}
            className="inline-flex items-center justify-center rounded-[2px] px-2 text-[14px] font-semibold leading-6 text-brand-green"
            style={{
              borderBottom: '1px solid #142916',
              letterSpacing: '0.1px',
            }}
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default OnboardingNavbar;
