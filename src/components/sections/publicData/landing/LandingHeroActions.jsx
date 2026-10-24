import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { PARTNER_SIGN_IN_ROUTE, DATA_BASE } from '../publicDataNav.js';
import { PRIMARY_LINK, PRIMARY_TEXT_STYLE, SECONDARY_LINK } from './landingLinkClasses.js';
import { rememberSection } from './lastVisit.js';

/*
 * LandingHeroActions — the three hero buttons: "View the national snapshot" (→ /data/overview) and "For partners" / "For recruiters"
 * (→ PARTNER_SIGN_IN_ROUTE; ⚠️ ASSUMPTION: Figma draws no destinations, both lead to the existing sign-in page).
 *   desktop: one row, gap 12, pt 8 (8514:187)        phone: the primary button full width, the two others side by side, gap 10-16 (8515:2684-2690)
 */

const LandingHeroActions = ({ layout = 'row', className }) => (
  <div
    className={classNames(
      layout === 'row'
        ? 'flex flex-wrap items-center gap-[12px] pt-[8px]'
        : 'flex flex-col gap-[16px]',
      className
    )}
  >
    <Link
      to={`${DATA_BASE}/overview`}
      onClick={() => rememberSection('overview')}
      className={classNames(PRIMARY_LINK, layout === 'stack' && 'w-full py-[14px]')}
    >
      <span style={PRIMARY_TEXT_STYLE}>View the national snapshot</span>
    </Link>
    <div className={classNames('flex gap-[10px] md:gap-[12px]', layout === 'stack' && 'w-full')}>
      <Link
        to={PARTNER_SIGN_IN_ROUTE}
        className={classNames(SECONDARY_LINK, layout === 'stack' && 'flex-1')}
      >
        For partners
      </Link>
      <Link
        to={PARTNER_SIGN_IN_ROUTE}
        className={classNames(SECONDARY_LINK, layout === 'stack' && 'flex-1')}
      >
        For recruiters
      </Link>
    </div>
  </div>
);

export default LandingHeroActions;
