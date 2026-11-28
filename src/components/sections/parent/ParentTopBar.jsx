import { lazy, Suspense, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import useParentChrome from './live/useParentChrome.js';
import { A11yPanel } from '../talentHome/TalentA11yMenu.jsx';
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

// The pop-ups load on first open (the language list is the recruiter dashboard's, so it is not in the parent bundle until used).
const ParentSearchPanel = lazy(() => import('./chrome/ParentSearchPanel.jsx'));
const ParentProfileMenu = lazy(() => import('./chrome/ParentProfileMenu.jsx'));
const LanguageMenu = lazy(() =>
  import('../recruiterDashboard/TopBarPanels.jsx').then((m) => ({ default: m.LanguageMenu }))
);

// `?panel=` values this bar owns (one open at a time).
const PANELS = ['search', 'language', 'a11y', 'account'];

/*
 * ParentTopBar — "GTH · Top bar" as the parent screens draw it (Figma `Nav` 10034:2874, 87 high, white, 1px #e7e7e7 under, shadow 0 1 1 rgba(27,36,44,.12)): logo 71 x 66 + search field 553 wide
 * ("Search opportunities, skills, communities..." with the ⌘K badge), the "Parent view" ink chip, help / notifications / messages (red count badges) / EN / accessibility, and the profile chip "Emma M.".
 * Props: bell (count, default 5), messages (count, default 4), name, onBell (toggles the notifications panel, PN-01), bellOpen (aria-expanded of the bell), onSwitchSpace,
 * onMessages (the messages icon), career ('talent' | 'none', the account menu's career row), onBuildCareer.
 * The Parents file draws the controls but none of their pop-ups (its prototype links are empty), so each opens the app's own pop-up for that control
 * (⚠️ ASSUMPTION, `?panel=` on any parent page, one at a time, Esc / outside click close):
 *   search field / ⌘K / Ctrl+K  `?panel=search`   ParentSearchPanel (wards + parent pages)
 *   EN                          `?panel=language` the recruiter dashboard's LanguageMenu (same list and note)
 *   accessibility               `?panel=a11y`     the talent A11yPanel (High contrast, Text size, Reduce motion, Underline links; prefs apply app-wide)
 *   profile chip                `?panel=account`  ParentProfileMenu (Settings, Accessibility, Language, Help, My career, Log out)
 * Help → /parent/help; messages → onMessages (ParentFrame: the parent's career inbox). The Parent view chip sits where the frames put it (58.33% + 23px) and is hidden under 1536px
 * (measured: from 1280 to about 1500px it overlapped the Help icon; at 1536px it clears it by 15px). PD-05 prints the profile as "Emma A." (a Figma typo); every screen here says "Emma M.".
 */

// Accessible name of a button that shows only a count badge: the visible number comes first ("5 notifications"), so the name starts with what is on screen (WCAG 2.5.3; voice control says "click 5").
const countLabel = (count, noun) => `${count} ${noun}${Number(count) === 1 ? '' : 's'}`;

const IconButton = ({ label, size = 36, badge, onClick, children, ...rest }) => (
  <button
    type="button"
    aria-label={label}
    {...rest}
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

const ParentTopBar = ({
  bell = '5',
  messages = '4',
  name: nameProp,
  onBell,
  bellOpen = false,
  onSwitchSpace,
  onMessages,
  career = 'talent',
  onBuildCareer,
}) => {
  const navigate = useNavigate();
  const chrome = useParentChrome();
  const name = nameProp || chrome.parent.short;
  const [params, setParams] = useSearchParams();
  const panel = PANELS.includes(params.get('panel')) ? params.get('panel') : '';
  const setPanel = (next) => {
    log('panel', { from: panel || '(none)', to: next || '(none)' });
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next) p.set('panel', next);
        else p.delete('panel');
        // One pop-up at a time: the bell panel closes when another opens.
        if (next) p.delete('notif');
        return p;
      },
      { replace: true }
    );
  };
  const toggle = (id) => setPanel(panel === id ? '' : id);
  const close = () => setPanel('');

  // ⌘K / Ctrl+K opens the search from anywhere on a parent page (the badge the field draws).
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        log('⌘K -> search');
        setParams(
          (prev) => {
            const p = new URLSearchParams(prev);
            p.set('panel', 'search');
            p.delete('notif');
            return p;
          },
          { replace: true }
        );
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setParams]);
  return (
    <header className="relative z-20 flex h-[87px] shrink-0 items-center justify-between gap-[16px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.24vw,56px)] py-[12px] shadow-[0_1px_1px_rgba(27,36,44,0.12)]">
      <div className="flex min-w-0 items-center gap-[clamp(12px,1.97vw,34px)]">
        <img
          src={logo}
          alt="Ghana Talent Hub"
          className="h-[66px] w-[71px] shrink-0 object-cover"
        />
        <span className="relative flex min-w-0">
          <button
            type="button"
            data-parent-search-trigger=""
            aria-haspopup="dialog"
            aria-expanded={panel === 'search'}
            aria-keyshortcuts="Meta+K Control+K"
            onClick={() => toggle('search')}
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
          {panel === 'search' ? (
            <Suspense fallback={null}>
              <ParentSearchPanel onClose={close} />
            </Suspense>
          ) : null}
        </span>
      </div>

      <button
        type="button"
        onClick={onSwitchSpace}
        disabled={!onSwitchSpace}
        aria-haspopup={onSwitchSpace ? 'menu' : undefined}
        className="absolute top-[27.5px] left-[calc(58.33%+23px)] flex h-[32px] cursor-pointer items-center gap-[6px] rounded-[999px] border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] disabled:cursor-default max-[1535px]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <img src={parentIcon} alt="" className="size-[14px]" />
        <span className="font-sans text-[13px] leading-[normal] font-semibold whitespace-nowrap text-white">
          Parent view
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-[24px]">
        <div className="flex items-center gap-[8px]">
          <IconButton label="Help" onClick={() => navigate('/parent/help')}>
            <img src={helpIcon} alt="" className="size-[16px]" />
          </IconButton>
          <IconButton
            label={countLabel(bell, 'notification')}
            badge={bell}
            onClick={onBell}
            data-notif-bell=""
            aria-haspopup="dialog"
            aria-expanded={bellOpen}
          >
            <img src={bellIcon} alt="" className="size-[16px]" />
          </IconButton>
          <IconButton
            label={messages ? countLabel(messages, 'message') : 'Messages'}
            badge={messages}
            onClick={onMessages}
          >
            <img src={messageIcon} alt="" className="size-[18px]" />
          </IconButton>
          <span className="relative flex max-md:hidden" data-panel-trigger="">
            <button
              type="button"
              aria-label="EN, language: English"
              aria-haspopup="menu"
              aria-expanded={panel === 'language'}
              onClick={() => toggle('language')}
              className="flex h-[36px] cursor-pointer items-center gap-[7px] rounded-[99px] border-0 bg-[#f8fafc] py-[8px] pr-[10px] pl-[12px] max-md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              <img src={globeIcon} alt="" className="size-[16px]" />
              <span className="font-sans text-[13px] leading-[normal] font-semibold text-[#babab7]">
                EN
              </span>
              <img src={chevronSmall} alt="" className="size-[14px]" />
            </button>
            {panel === 'language' ? (
              <Suspense fallback={null}>
                <LanguageMenu
                  onClose={close}
                  onChange={(id) => {
                    log('language picked (not saved: no parent language API)', id);
                    close();
                  }}
                />
              </Suspense>
            ) : null}
          </span>
          <span className="relative flex">
            <IconButton
              label="Accessibility"
              size={38}
              aria-pressed={panel === 'a11y'}
              aria-controls={panel === 'a11y' ? 'parent-a11y-panel' : undefined}
              onClick={() => toggle('a11y')}
            >
              <img src={a11yIcon} alt="" className="size-[20px]" />
            </IconButton>
            {panel === 'a11y' ? (
              <>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-1/2 size-[46px] -translate-x-1/2 -translate-y-1/2 rounded-[23px] border-[2.5px] border-solid border-[#1c2a21]"
                />
                <A11yPanel id="parent-a11y-panel" onClose={close} />
              </>
            ) : null}
          </span>
        </div>
        <span className="relative flex">
          <button
            type="button"
            data-parent-account-trigger=""
            onClick={() => toggle('account')}
            aria-haspopup="menu"
            aria-expanded={panel === 'account'}
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
          {panel === 'account' ? (
            <Suspense fallback={null}>
              <ParentProfileMenu
                onClose={close}
                onLanguage={() => setPanel('language')}
                onA11y={() => setPanel('a11y')}
                career={career}
                onBuildCareer={onBuildCareer}
              />
            </Suspense>
          ) : null}
        </span>
      </div>
    </header>
  );
};

export default ParentTopBar;
