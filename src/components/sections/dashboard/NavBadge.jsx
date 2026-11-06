import { classNames } from '../../../utils/classNames.js';

/*
 * NavBadge — the green count pill on a dashboard nav item. Shared by the rail
 * (DashboardSidebar) and the phone tab bar / More sheet so the badge looks
 * identical everywhere. Below lg the 10px Figma label is floored to 12px.
 */
export const BADGE_GRADIENT = 'linear-gradient(136.55deg, #387440 14.637%, #84cc16 85.349%)';

/* `solid` = the V2.0 recruiter rail's flat #387440 pill (Figma 7249:76140 badge); default stays the gradient. */
const NavBadge = ({ count, className, style, solid = false }) => (
  <span
    className={classNames(
      'inline-flex h-[18px] items-center justify-center overflow-hidden rounded-[99px] px-[6px] py-[2px] font-sans text-[10px] max-lg:text-[12px] font-medium text-white',
      className
    )}
    style={
      solid
        ? { backgroundColor: '#387440', ...style }
        : { backgroundImage: BADGE_GRADIENT, ...style }
    }
  >
    {count}
  </span>
);

export default NavBadge;
