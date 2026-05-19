import { Link } from 'react-router-dom';
import gthLogoStacked from '../../assets/brand/gth-logo-stacked.png';
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
 *   - Right: "Log In" link in brand-green with a brand-green-darker
 *     underline (`#142916`). Skips the divider/nav-items the landing
 *     Navbar carries — onboarding intentionally has no nav escape hatch.
 */

const OnboardingNavbar = () => {
  log('render');
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
      </div>
    </header>
  );
};

export default OnboardingNavbar;
