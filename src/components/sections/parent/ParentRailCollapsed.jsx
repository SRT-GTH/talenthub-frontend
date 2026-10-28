import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { NAV_MAIN, NAV_SECONDARY, SIDEBAR_STATES } from './data/parentCoreData.js';
import emma from '../../../assets/parent/emma.webp';
import homeIcon from '../../../assets/parent/frame-1.svg';
import navWards from '../../../assets/parent/icon-1.svg';
import navReview from '../../../assets/parent/icon-2.svg';
import navEvaluate from '../../../assets/parent/icon-3.svg';
import navWallets from '../../../assets/parent/stroke.svg';
import navNotifications from '../../../assets/parent/icon-4.svg';
import navSettings from '../../../assets/parent/icon-5.svg';
import navHelp from '../../../assets/parent/icon-6.svg';
import navCareer from '../../../assets/parent/icon-7.svg';
import toggleIcon from '../../../assets/parent/ep-d-arrow-left.svg';

/*
 * ParentRailCollapsed — "Sidebar · parent · collapsed" (Figma PR-01c 10047:19112, 126 wide, white): the expand toggle (the « mirrored), the 74px round avatar (3px #e6e6e6 ring), the nav as 80 x 54 icon
 * tiles (24px icons; the active tile #ebf1ec; a 10px green dot where the expanded sidebar shows a count badge), a hairline, Settings · Help and guides · My career, and the "My career" switch chip at the
 * bottom (64 x 60). Labels are aria-labels; the tiles are the same links as the expanded sidebar.
 * Props: state ('none' | 'linked' | 'caughtUp' | 'oneWard', which badges become dots), active (nav id), onExpand, className.
 */
const ICONS = {
  home: homeIcon,
  wards: navWards,
  review: navReview,
  evaluate: navEvaluate,
  wallets: navWallets,
  notifications: navNotifications,
  settings: navSettings,
  help: navHelp,
  career: navCareer,
};

const Tile = ({ item, active, dot, tall = true }) => (
  <Link
    to={item.to}
    aria-label={item.label}
    aria-current={active ? 'page' : undefined}
    className={classNames(
      'relative flex w-[80px] items-center justify-center rounded-[10px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
      tall ? 'h-[54px]' : 'h-[44px]',
      active ? 'bg-brand-green-light' : 'hover:bg-[#f4f7f4]'
    )}
  >
    <img src={ICONS[item.id]} alt="" draggable="false" className="size-[24px] max-w-none" />
    {dot ? (
      <span
        aria-hidden="true"
        className="absolute top-[13px] right-[21px] size-[10px] rounded-full border-2 border-solid border-white bg-brand-green"
      />
    ) : null}
  </Link>
);

const ParentRailCollapsed = ({ state = 'linked', active = 'home', onExpand, className }) => {
  const badges = (SIDEBAR_STATES[state] || SIDEBAR_STATES.linked).badges;
  return (
    <aside
      aria-label="Parent navigation (collapsed)"
      className={classNames(
        'relative flex w-[126px] shrink-0 flex-col items-center gap-[28px] overflow-y-auto border-r-2 border-solid border-white bg-white pt-[60px] pb-[40px]',
        className
      )}
    >
      <button
        type="button"
        aria-label="Expand sidebar"
        onClick={onExpand}
        className="absolute top-[16px] left-[49px] flex size-[28px] cursor-pointer items-center justify-center rounded-[8px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <img src={toggleIcon} alt="" className="h-[20px] w-[23px] -scale-x-100" />
      </button>

      <span className="flex size-[74px] shrink-0 items-center justify-center rounded-full border-[3px] border-solid border-[#e6e6e6] bg-white">
        <img
          src={emma}
          alt="Emma Mensah"
          draggable="false"
          className="size-[62px] rounded-full object-cover"
        />
      </span>

      <nav aria-label="Parent" className="flex flex-col items-center gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          {NAV_MAIN.map((item) => (
            <Tile
              key={item.id}
              item={item}
              active={item.id === active}
              dot={Boolean(badges[item.id])}
            />
          ))}
        </div>
        <span
          aria-hidden="true"
          className="h-px w-[80px] rounded-full bg-brand-green-light-hover"
        />
        <div className="flex flex-col gap-[4px]">
          {NAV_SECONDARY.map((item) => (
            <Tile
              key={item.id}
              item={item}
              active={item.id === active}
              tall={item.id !== 'career'}
            />
          ))}
        </div>
      </nav>

      <Link
        to="/home"
        aria-label="Switch to My career"
        className="mt-auto flex h-[60px] w-[64px] shrink-0 items-center justify-center rounded-[12px] border border-solid border-neutral bg-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="flex h-[36px] w-[40px] items-center justify-center rounded-[8px] bg-brand-green-light">
          <img src={navCareer} alt="" className="size-[20px]" />
        </span>
      </Link>
    </aside>
  );
};

export default ParentRailCollapsed;
