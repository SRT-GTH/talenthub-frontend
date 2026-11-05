import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { NAV_MAIN, NAV_SECONDARY } from './data/parentCoreData.js';
import { NO_CAREER } from './switch/switchData.js';
import useParentChrome from './live/useParentChrome.js';
import homeActive from '../../../assets/parent/frame-1.svg';
import navWards from '../../../assets/parent/icon-1.svg';
import navReview from '../../../assets/parent/icon-2.svg';
import navEvaluate from '../../../assets/parent/icon-3.svg';
import navWallets from '../../../assets/parent/stroke.svg';
import navNotifications from '../../../assets/parent/icon-4.svg';
import navSettings from '../../../assets/parent/icon-5.svg';
import navHelp from '../../../assets/parent/icon-6.svg';
import navCareer from '../../../assets/parent/icon-7.svg';
import verifiedIcon from '../../../assets/parent/icon.svg';
import switchChevron from '../../../assets/parent/switch-chevron.svg';
import dot from '../../../assets/parent/ellipse.svg';
import linkChain from '../../../assets/parent/group.svg';
import { TalentSidebarPreviewArrowUpRightIcon } from '../../shared/assets.jsx';
import toggleIcon from '../../../assets/parent/ep-d-arrow-left.svg';

const log = debug('ParentSidebar');

/*
 * ParentSidebar — "Sidebar · parent" (Figma 10034:2748 / 10027:1576, 303 wide, white, 2px white right border): the persona card (62 avatar, name + Verified chip + switch chevron, role line,
 * "Parent view · tap to switch", "This week" progress, four stats), the nav (Home · My wards · To review · Evaluate · Ward wallets · Notifications | Settings · Help and guides · My career),
 * the "You're also a talent" switch card, and the collapse toggle. Copy-adapted from the talent sidebar chrome; content from data/parentCoreData.js (SIDEBAR_STATES).
 * Props: state ('none' | 'linked' | 'caughtUp'), active (nav id, default 'home'), className.
 * Live (signed in, not a frame URL): the parent, counts and note come from GET /parent/me (useParentChrome); `state` is
 * then ignored and the career card follows whether the parent has a career profile.
 * ⚠️ ASSUMPTION: the collapse toggle (the « at the card's corner) only logs — Figma draws no collapsed parent rail; "tap to switch" and the Verified chevron do nothing (no switcher drawn).
 */

const ICONS = {
  wards: navWards,
  review: navReview,
  evaluate: navEvaluate,
  wallets: navWallets,
  notifications: navNotifications,
  settings: navSettings,
  help: navHelp,
  career: navCareer,
};

// Nav badge: To review and Notifications are solid green, Ward wallets carries the lime gradient (Figma 10027:1657 / 1659 / 1660).
const Badge = ({ count, gradient }) => (
  <span
    className={classNames(
      'flex h-[18px] shrink-0 items-center justify-center overflow-clip rounded-[99px] px-[6px] py-[2px] font-sans text-[10px] leading-[normal] font-medium whitespace-nowrap text-white',
      gradient ? 'bg-[linear-gradient(136.55deg,#387440_14.637%,#84cc16_85.349%)]' : 'bg-[#387440]'
    )}
  >
    {count}
  </span>
);

const NavItem = ({ item, active, badge }) => (
  <Link
    to={item.to}
    aria-current={active ? 'page' : undefined}
    className={classNames(
      'flex items-center gap-[11px] rounded-[10px] px-[12px] py-[10px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      active ? 'bg-[#ebf1ec]' : 'hover:bg-[#f4f7f4]'
    )}
  >
    <span className="relative block size-[20px] shrink-0">
      {item.id === 'home' ? (
        <img
          src={homeActive}
          alt=""
          draggable="false"
          className="absolute top-[0.5px] left-0 size-[18px] max-w-none"
        />
      ) : item.id === 'wallets' ? (
        <img
          src={navWallets}
          alt=""
          draggable="false"
          className="absolute max-w-none"
          style={{ left: 0.51, top: 1.22, width: 18.98, height: 17.57 }}
        />
      ) : (
        <img
          src={ICONS[item.id]}
          alt=""
          draggable="false"
          className="absolute inset-0 size-full max-w-none"
        />
      )}
    </span>
    <span
      className={classNames(
        'min-w-0 flex-1 font-sans text-[14px] leading-[24px] tracking-[0.2px]',
        active ? 'font-semibold text-[#387440]' : 'font-normal text-[#70706e]'
      )}
    >
      {item.label}
    </span>
    {badge ? <Badge count={badge} gradient={item.id === 'wallets'} /> : null}
  </Link>
);

const Stat = ({ value, label }) => (
  <span className="flex w-[50px] flex-col items-center justify-center text-center whitespace-nowrap">
    <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] text-[#387440]">
      {value}
    </span>
    <span className="font-sans text-[10px] leading-[normal] font-normal text-[#999]">{label}</span>
  </span>
);

const ParentSidebar = ({
  state = 'linked',
  active = 'home',
  onCollapse,
  career = 'talent',
  onSwitch,
  onBuildCareer,
  cardRef,
  className,
}) => {
  const chrome = useParentChrome(state);
  const s = chrome.sidebar;
  const PARENT = chrome.parent;
  if (chrome.live && !chrome.loading) career = PARENT.hasCareerProfile ? 'talent' : 'none';
  const noteTo = chrome.live
    ? s.noteTo || '/parent'
    : state === 'none'
      ? '/parent/link-ward'
      : '/parent/review?tab=payments';
  const pct = Math.round((s.done / 3) * 1000) / 10;
  return (
    <aside
      aria-label="Parent navigation"
      className={classNames(
        'relative flex w-[303px] shrink-0 flex-col items-center gap-[24px] overflow-y-auto border-r-2 border-solid border-white bg-white pt-[22px] pb-[16px]',
        className
      )}
    >
      <div
        ref={cardRef}
        className="flex w-[279px] shrink-0 flex-col items-center gap-[16px] rounded-[16px] border-[1.4px] border-solid border-[#e1eae2] bg-white py-[19px]"
      >
        <span className="relative block size-[62px] shrink-0 overflow-clip rounded-[31px]">
          <img
            src={PARENT.photo}
            alt=""
            draggable="false"
            className="size-full rounded-[31px] object-cover"
          />
        </span>
        <div className="flex flex-col items-center gap-[7px]">
          <div className="flex items-center gap-[5px]">
            <span className="font-sans text-[14px] leading-[24px] font-semibold tracking-[0.2px] whitespace-nowrap text-[#1c2a21]">
              {PARENT.name}
            </span>
            {PARENT.verified ? (
              <span className="flex h-[18px] items-center gap-[3px] rounded-[4px] bg-[#eaeffb] py-[2px] pr-[7px] pl-[6px]">
                <img src={verifiedIcon} alt="" className="size-[8px]" />
                <span className="font-sans text-[10px] leading-[20px] font-semibold tracking-[0.2px] text-[#244a9f]">
                  Verified
                </span>
              </span>
            ) : null}
            {onSwitch && career === 'talent' ? (
              <button
                type="button"
                aria-label="Switch space"
                aria-haspopup="menu"
                onClick={onSwitch}
                className="flex cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                <img src={switchChevron} alt="" className="size-[16px]" />
              </button>
            ) : (
              <img src={switchChevron} alt="" className="size-[16px]" />
            )}
          </div>
          <span className="font-sans text-[12px] leading-[18px] font-normal tracking-[0.2px] whitespace-nowrap text-[#babab7]">
            {s.role}
          </span>
          {onSwitch && career === 'talent' ? (
            <button
              type="button"
              aria-haspopup="menu"
              onClick={onSwitch}
              className="flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <img src={dot} alt="" className="size-[4px]" />
              <span className="font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] whitespace-nowrap text-[#387440]">
                Parent view · tap to switch
              </span>
            </button>
          ) : (
            <span className="flex items-center gap-[5px]">
              <img src={dot} alt="" className="size-[4px]" />
              <span className="font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] whitespace-nowrap text-[#387440]">
                {career === 'none' ? NO_CAREER.pill : 'Parent view · tap to switch'}
              </span>
            </span>
          )}
        </div>
        <div className="flex w-[239px] flex-col justify-center gap-[6px] border-t border-solid border-[#fefefe]">
          <div className="flex items-center justify-between whitespace-nowrap">
            <span className="font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] text-[#1c2a21]">
              This week
            </span>
            <span className="font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] text-[#babab7]">
              {s.doneText}
            </span>
          </div>
          <div className="flex h-[7px] overflow-clip rounded-[4px] bg-[#ebf1ec]">
            <span
              className="h-[7px] rounded-[4px] bg-[#387440]"
              style={{ width: s.done ? `${pct}%` : 1 }}
            />
          </div>
          {s.note ? (
            <Link
              to={noteTo}
              onClick={() => log('sidebar note')}
              className="font-sans text-[10px] leading-[16px] font-normal tracking-[0.2px] whitespace-nowrap text-[#70706e] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {s.note}
            </Link>
          ) : null}
        </div>
        <div className="flex w-[257px] items-center justify-center gap-[4px] rounded-[10px] border border-solid border-[#faf4e8] bg-[#ebf1ec] py-[10px]">
          {s.stats.map((st, i) => (
            <span key={st.label} className="flex items-center gap-[4px]">
              {i > 0 ? <span className="h-[28px] w-px bg-[#ebf1ec]" aria-hidden="true" /> : null}
              <Stat {...st} />
            </span>
          ))}
        </div>
      </div>

      <nav aria-label="Parent" className="flex w-[275px] shrink-0 flex-col gap-[16px] px-[8px]">
        <div className="flex w-[259px] flex-col gap-[6px] pt-[6px]">
          <div className="flex flex-col gap-[4px]">
            {NAV_MAIN.map((it) => (
              <NavItem key={it.id} item={it} active={it.id === active} badge={s.badges[it.id]} />
            ))}
          </div>
          <span className="h-px w-full rounded-[30px] bg-[#e1eae2]" aria-hidden="true" />
          <div className="flex flex-col gap-[4px]">
            {NAV_SECONDARY.map((it) => (
              <NavItem key={it.id} item={it} active={it.id === active} />
            ))}
          </div>
        </div>
        <div className="flex h-[125px] w-[259px] flex-col gap-[10px] overflow-clip rounded-[12px] border border-solid border-[#f8f8f4] bg-white p-[12px]">
          <span className="flex items-center gap-[6px] rounded-[8px] bg-[#ebf1ec] px-[10px] py-[8px]">
            <span className="flex size-[14px] shrink-0 items-center justify-center bg-white">
              <img src={linkChain} alt="" className="size-[11.8px]" />
            </span>
            <span className="font-sans text-[13px] leading-[18px] font-medium tracking-[0.2px] whitespace-nowrap text-[#387440]">
              {career === 'none' ? NO_CAREER.cardTitle : 'You’re also a talent'}
            </span>
          </span>
          <span className="font-mono text-[10px] leading-[16px] tracking-[0.2px] text-[#32683a]">
            {career === 'none' ? NO_CAREER.cardLine : PARENT.talentLine || 'My career'}
          </span>
          {career === 'none' ? (
            <button
              type="button"
              onClick={() =>
                onBuildCareer ? onBuildCareer() : log('build my profile (no handler)')
              }
              className="flex h-[36px] cursor-pointer items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[12px] font-sans text-[13px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {NO_CAREER.cardCta}
              <TalentSidebarPreviewArrowUpRightIcon className="size-[20px]" />
            </button>
          ) : (
            <Link
              to="/home"
              className="flex h-[36px] items-center justify-center gap-[6px] rounded-[14px] border-2 border-solid border-[rgba(28,42,33,0.3)] bg-white px-[12px] font-sans text-[13px] leading-[24px] font-bold tracking-[0.1px] whitespace-nowrap text-[#1c2a21] no-underline shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              Switch to My career
              <TalentSidebarPreviewArrowUpRightIcon className="size-[20px]" />
            </Link>
          )}
        </div>
      </nav>

      <button
        type="button"
        aria-label="Collapse sidebar"
        onClick={() => (onCollapse ? onCollapse() : log('collapse (no handler given)'))}
        className="absolute top-[32px] right-[22px] flex size-[28px] cursor-pointer items-center justify-center overflow-clip rounded-[8px] border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <img src={toggleIcon} alt="" className="h-[20px] w-[23px]" />
      </button>
    </aside>
  );
};

export default ParentSidebar;
