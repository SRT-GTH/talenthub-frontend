import HomeLogoLink from './HomeLogoLink.jsx';
import { Link, useLocation } from 'react-router-dom';
import gthLogoStacked from '../../assets/brand/gth-logo-stacked.webp';
import parentGuardianShield from '../../assets/onboarding/parent-guardian-shield.svg';
import { classNames } from '../../utils/classNames.js';
import { getNavAuthCta } from '../../constants/authRoutes.js';
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
 *   - Right CTA is context-aware (role + mode), resolved by getNavAuthCta:
 *       - On a SIGN-IN surface (e.g. /login, /onboarding/parent-login):
 *         primary "Create Account" pill → that role's sign-up entry.
 *       - On a SIGN-UP surface (onboarding steps): a "Log In" text link →
 *         that role's sign-in entry (parent → /onboarding/parent-login,
 *         talent/institution → /login).
 *     Role + entry routes live in src/constants/authRoutes.js.
 *
 *   - The header is `sticky top-0` so it stays pinned while the page (or the
 *     scrollable content column) scrolls beneath it.
 */

// Primary CTA text gradient — Figma 188.377deg peach→mint, stops 0% / 20.192%.
// Mirrors the Button primary variant in components/ui/Button.jsx so the
// navbar CTA reads as the same family without pulling in the full Button
// component (which is sized too tall for the 40px nav pill).
const PRIMARY_GRADIENT = {
  backgroundImage: 'linear-gradient(188.377deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

const CREATE_ACCOUNT_CLASSES = classNames(
  'relative inline-flex h-10 max-md:h-9 items-center justify-center gap-2 px-5 max-md:px-4 rounded-[10px]',
  "max-md:after:absolute max-md:after:-inset-y-1 max-md:after:inset-x-0 max-md:after:content-['']",
  'border-t border-l-2 border-r-2 border-b-2 border-solid border-brand-green-dark bg-brand-green',
  'drop-shadow-[0_4px_0_#224626] max-md:drop-shadow-[0_2px_0_#224626]',
  'hover:border-brand-green-active hover:drop-shadow-[0_5px_0_#224626]',
  'active:bg-brand-green-active active:border-brand-green-dark-hover active:translate-y-1 active:drop-shadow-none',
  'transition-[transform,filter,background-color,border-color] duration-100 ease-out',
  'font-sans font-semibold text-[14px] max-md:text-[13px] leading-5 tracking-[0.1px] whitespace-nowrap select-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green'
);

// Parent onboarding Flow B step screens (Figma 2864:37043 … 37752) carry a "Parent / Guardian" pill at the right of the header.
const PARENT_FLOW_B_STEP =
  /^\/onboarding\/parent-invited-(identity|verification|contact|security|link-ward|consent)$/;

const OnboardingNavbar = () => {
  const { pathname } = useLocation();
  const cta = getNavAuthCta(pathname);
  const showCreate = cta.mode === 'signin';
  const showParentPill = PARENT_FLOW_B_STEP.test(pathname);
  log('render; pathname:', pathname, 'cta:', cta, 'parentPill:', showParentPill);

  return (
    <header
      className="sticky top-0 z-50 w-full shrink-0 bg-[#F8F8F4]"
      style={{
        borderBottom: '1px solid #E7E7E7',
        boxShadow: '0 1px 2px rgba(27,36,44,0.12)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 max-md:py-1.5 md:px-16">
        <HomeLogoLink>
          {/* Single composed 71×66 PNG per Figma node 3052:74371 — mark sits
              tight above the two-line "GHANA / TALENT HUB" wordmark with no
              separator gap. Pulled fresh from the Figma Dev Mode MCP rather
              than reusing the horizontal-wordmark gth-wordmark.png. */}
          <img
            src={gthLogoStacked}
            alt="Ghana Talent Hub"
            className="h-[66px] w-[71px] max-md:h-10 max-md:w-[43px]"
          />
        </HomeLogoLink>

        {/* ⚠️ ASSUMPTION: Figma draws the pill INSTEAD of "Log In" on these screens; the Log In link is kept next to it so a parent with an account can still sign in. */}
        {showParentPill ? (
          <span
            data-testid="parent-guardian-pill"
            className="ml-auto mr-4 inline-flex h-[26px] items-center gap-[6px] rounded-full border border-solid border-[#eedeb8] bg-[#faf4e8] px-[12px] pl-[13px] font-sans text-[11px] leading-[13px] font-bold whitespace-nowrap text-[#967014] max-md:mr-3 max-lg:text-[12px]"
          >
            <img src={parentGuardianShield} alt="" aria-hidden="true" className="size-[12px]" />
            Parent / Guardian
          </span>
        ) : null}
        {showCreate ? (
          <Link to={cta.to} className={CREATE_ACCOUNT_CLASSES}>
            <span className="bg-clip-text text-transparent" style={PRIMARY_GRADIENT}>
              {cta.label}
            </span>
          </Link>
        ) : (
          <Link
            to={cta.to}
            className="relative inline-flex items-center justify-center rounded-[2px] px-2 text-[14px] font-semibold leading-6 text-brand-green max-md:before:absolute max-md:before:-inset-x-1 max-md:before:-inset-y-2.5 max-md:before:content-['']"
            style={{
              borderBottom: '1px solid #142916',
              letterSpacing: '0.1px',
            }}
          >
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
};

export default OnboardingNavbar;
