import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { PARENT } from './data/parentCoreData.js';
import logo from '../../../assets/engagement/GTHLogo 1.svg';
import searchIcon from '../../../assets/parent/search-0-1.svg';
import helpIcon from '../../../assets/parent/svg.svg';
import bellIcon from '../../../assets/parent/notification-0-2.svg';
import messageIcon from '../../../assets/parent/message-0-1.svg';
import globeIcon from '../../../assets/parent/frame-2.svg';
import chevronSmall from '../../../assets/parent/frame-3.svg';
import a11yIcon from '../../../assets/parent/frame-4.svg';
import avatar from '../../../assets/parent/avatar.svg';
import chevronDown from '../../../assets/parent/icon-8.svg';
import parentIcon from '../../../assets/parent/icon-9.svg';

const log = debug('ParentTopBar');

/*
 * ParentTopBar — "GTH · Top bar" as the parent screens draw it (Figma `Nav` 10034:2874, 87 high, white, 1px #e7e7e7 under, shadow 0 1 1 rgba(27,36,44,.12)): logo 71 x 66 + search field 553 wide
 * ("Search opportunities, skills, communities..." with the ⌘K badge), the "Parent view" ink chip, help / notifications / messages (red count badges) / EN / accessibility, and the profile chip "Emma M.".
 * Props: bell (count, default 5), messages (count, default 4), name.
 * ⚠️ ASSUMPTION: the icons, search and profile chip only log (the parent shell has no pop-ups drawn). The Parent view chip sits where the frames put it (58.33% + 23px) and is hidden under 1536px
 * (measured: from 1280 to about 1500px it overlapped the Help icon; at 1536px it clears it by 15px). PD-05 prints the profile as "Emma A." (a Figma typo); every screen here says "Emma M.".
 */

// Accessible name of a button that shows only a count badge: the visible number comes first ("5 notifications"), so the name starts with what is on screen (WCAG 2.5.3; voice control says "click 5").
const countLabel = (count, noun) => `${count} ${noun}${Number(count) === 1 ? '' : 's'}`;

const IconButton = ({ label, size = 36, badge, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={() => {
      log('click', label);
      onClick?.();
    }}
    className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-[99px] border-0 bg-[#f8fafc] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    style={{ width: size, height: size }}
  >
    {children}
    {badge ? (
      <span className="absolute top-[-1.5px] left-[22.67px] flex size-[16px] items-center justify-center overflow-clip rounded-[100px] border-[1.5px] border-solid border-white bg-[#c0392b] font-sans text-[10px] leading-[20px] font-semibold tracking-[0.2px] text-white max-lg:text-[12px]">
        {badge}
      </span>
    ) : null}
  </button>
);

const ParentTopBar = ({ bell = '5', messages = '4', name = PARENT.short }) => {
  const navigate = useNavigate();
  return (
    <header className="relative z-20 flex h-[87px] shrink-0 items-center justify-between gap-[16px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.24vw,56px)] py-[12px] shadow-[0_1px_1px_rgba(27,36,44,0.12)]">
      <div className="flex min-w-0 items-center gap-[clamp(12px,1.97vw,34px)]">
        <img
          src={logo}
          alt="Ghana Talent Hub"
          className="h-[66px] w-[71px] shrink-0 object-cover"
        />
        <button
          type="button"
          onClick={() => log('search')}
          className="flex w-[clamp(220px,32vw,553px)] min-w-0 cursor-pointer items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pr-[12px] pl-[14px] text-left shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] max-md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[14px]">
            <img src={searchIcon} alt="" className="size-[20px]" />
          </span>
          <span className="min-w-0 flex-1 truncate font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#bfbfbf]">
            Search opportunities, skills, communities...
          </span>
          <span className="shrink-0 rounded-[6px] border border-solid border-[#e5e7eb] bg-white px-[10px] py-[6px] font-sans text-[12px] leading-[normal] font-semibold text-[#2d5d33] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
            ⌘K
          </span>
        </button>
      </div>

      <span className="absolute top-[27.5px] left-[calc(58.33%+23px)] flex h-[32px] items-center gap-[6px] rounded-[999px] border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] max-[1535px]:hidden">
        <img src={parentIcon} alt="" className="size-[14px]" />
        <span className="font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-white">
          Parent view
        </span>
      </span>

      <div className="flex shrink-0 items-center gap-[24px]">
        <div className="flex items-center gap-[8px]">
          <IconButton label="Help" onClick={() => navigate('/parent/help')}>
            <img src={helpIcon} alt="" className="size-[16px]" />
          </IconButton>
          <IconButton label={countLabel(bell, 'notification')} badge={bell}>
            <img src={bellIcon} alt="" className="size-[16px]" />
          </IconButton>
          <IconButton label={countLabel(messages, 'message')} badge={messages}>
            <img src={messageIcon} alt="" className="size-[18px]" />
          </IconButton>
          <button
            type="button"
            aria-label="EN, language: English"
            onClick={() => log('language')}
            className="flex h-[36px] cursor-pointer items-center gap-[7px] rounded-[99px] border-0 bg-[#f8fafc] py-[8px] pr-[10px] pl-[12px] max-md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <img src={globeIcon} alt="" className="size-[16px]" />
            <span className="font-sans text-[13px] leading-[normal] font-semibold text-[#babab7]">
              EN
            </span>
            <img src={chevronSmall} alt="" className="size-[14px]" />
          </button>
          <IconButton label="Accessibility" size={38}>
            <img src={a11yIcon} alt="" className="size-[20px]" />
          </IconButton>
        </div>
        <button
          type="button"
          onClick={() => log('profile menu')}
          aria-label={`Account menu, ${name}`}
          className="flex cursor-pointer items-center gap-[7px] rounded-[10px] border border-solid border-[#c1d4c4] bg-[#fffefc] px-[16px] py-[8px] max-sm:px-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <span className="relative block size-[24px] shrink-0 overflow-clip rounded-[12px] bg-[#387440]">
            <img
              src={avatar}
              alt=""
              className="absolute bottom-[-3px] left-1/2 h-[28px] w-[27px] max-w-none -translate-x-1/2"
            />
          </span>
          <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] whitespace-nowrap text-[#1c2a21] max-sm:hidden">
            {name}
          </span>
          <img src={chevronDown} alt="" className="size-[14px] max-sm:hidden" />
        </button>
      </div>
    </header>
  );
};

export default ParentTopBar;
