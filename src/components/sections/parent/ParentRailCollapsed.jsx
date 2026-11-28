import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { NAV_MAIN, NAV_SECONDARY, careerHome } from './data/parentCoreData.js';
import useParentChrome from './live/useParentChrome.js';
import { PARENT_NAV_ICONS as ICONS } from './chrome/parentNavIcons.js';
import ParentSidebarToggle from './ParentSidebarToggle.jsx';

/*
 * ParentRailCollapsed — "Sidebar · parent · collapsed" (Figma PR-01c 10047:19112, 126 wide, white): the expand toggle (the « mirrored), the 74px round avatar (3px #e6e6e6 ring), the nav as 80 x 54 icon
 * tiles (24px icons; the active tile #ebf1ec; a 10px green dot where the expanded sidebar shows a count badge), a hairline, Settings · Help and guides · My career, and the "My career" switch chip at the
 * bottom (64 x 60). Labels are aria-labels; the tiles are the same links as the expanded sidebar.
 * Props: state ('none' | 'linked' | 'caughtUp' | 'oneWard', which badges become dots), active (nav id), onExpand (no toggle without it: the md–lg tablet rail,
 * where the full sidebar does not fit), toggleClassName (e.g. hide the toggle below lg), className.
 */

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

const ParentRailCollapsed = ({
  state = 'linked',
  active = 'home',
  onExpand,
  toggleClassName,
  className,
}) => {
  const chrome = useParentChrome(state);
  const badges = chrome.sidebar.badges;
  const emma = chrome.parent.photo;
  return (
    <aside
      aria-label="Parent navigation (collapsed)"
      className={classNames(
        'slim-scrollbar relative flex w-[126px] shrink-0 flex-col items-center gap-[28px] overflow-y-auto border-r-2 border-solid border-white bg-white pt-[60px] pb-[40px]',
        className
      )}
    >
      {onExpand ? (
        <ParentSidebarToggle
          expand
          className={classNames('top-[16px] left-[49px]', toggleClassName)}
          onClick={onExpand}
        />
      ) : null}

      <span className="flex size-[74px] shrink-0 items-center justify-center rounded-full border-[3px] border-solid border-[#e6e6e6] bg-white">
        <img
          src={emma}
          alt={chrome.parent.name || ''}
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
              item={item.id === 'career' ? { ...item, to: careerHome(chrome.live) } : item}
              active={item.id === active}
              tall={item.id !== 'career'}
            />
          ))}
        </div>
      </nav>

      <Link
        to={careerHome(chrome.live)}
        aria-label="Switch to My career"
        className="mt-auto flex h-[60px] w-[64px] shrink-0 items-center justify-center rounded-[12px] border border-solid border-neutral bg-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="flex h-[36px] w-[40px] items-center justify-center rounded-[8px] bg-brand-green-light">
          <img src={ICONS.career} alt="" className="size-[20px]" />
        </span>
      </Link>
    </aside>
  );
};

export default ParentRailCollapsed;
