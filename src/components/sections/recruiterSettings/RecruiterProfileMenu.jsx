import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import {
  ProfileMenuAccessibilityIcon,
  ProfileMenuBookmarkIcon,
  ProfileMenuEyeIcon,
  ProfileMenuFeedbackIcon,
  ProfileMenuGlobeIcon,
  ProfileMenuHelpIcon,
  ProfileMenuInviteIcon,
  ProfileMenuSettingsIcon,
  ProfileMenuSuitcaseIcon,
  ProfileMenuUserIcon,
} from '../../shared/assets.jsx';
import { Divider, MenuItem } from '../talentSettings/ProfileMenu.jsx';
import avatarPortrait from '../../../assets/talent-settings/menu/kofi-avatar-portrait.svg';
import { LogoutIcon, VerifyBadgeIcon } from './security/SettingsIcons.jsx';
import { MENU_ACCOUNT } from './security/securityData.js';

const log = debug('RecruiterProfileMenu');

/*
 * RecruiterProfileMenu - SR-14 "Profile menu · open (recruiter, no mode switch)" (Figma 10161:82623, menu 10161:82917 "GTH · Profile menu", 340 wide): the top-bar profile chip's menu, `?menu=open` on any Settings tab,
 * rendered into `DashboardTopNav` through `panels.profileMenu` (absolute under the chip, right edge on the nav's gutter). It reuses the talent `ProfileMenu` rows (`MenuItem`, `Divider`: 44px rows, r12, green hover) with the recruiter copy:
 * header (avatar, "Kwame Asante" + Verified, email, "Profile 100%" bar + "Top Recruiter"), View my recruiter profile, Preview as talent, View applicants 4, Saved talents 3 | Settings, Accessibility, Language English (GH) | Help and support,
 * Send feedback, Invite a friend +50pts | Log out | Privacy, Terms, "Keyboard: ↑ ↓ to move, Esc to close". There is no mode switch.
 * Rows: Settings / Accessibility / Language switch the Settings tab; Help and support = ?help=page, Send feedback = ?modal=feedback, Invite a friend = ?modal=invite (built by the help / dialogs builder); Log out = ?modal=logout.
 * ⚠️ ASSUMPTIONS (no destination is drawn): View my recruiter profile, Preview as talent, Privacy and Terms only close the menu (no recruiter profile page exists yet); View applicants -> /recruiter/application-pipeline; Saved talents -> /recruiter/talent-search.
 * Esc and an outside click close it; ArrowUp / ArrowDown / Home / End move between the rows. Props: settings (useRecruiterSettingsState()).
 */
const RecruiterProfileMenu = ({ settings }) => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const [hot, setHot] = useState('settings');
  const open = settings.get('menu') === 'open';
  const { update } = settings;

  useEffect(() => {
    if (open) log('mount', { tab: settings.tab });
  }, [open, settings.tab]);

  // Esc / outside click close it (the chip toggles itself, so it is excluded from the outside test); arrow keys move through the rows.
  useEffect(() => {
    if (!open) return undefined;
    const close = () => update({ menu: null }, { replace: true });
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('branch: Escape closes');
        event.preventDefault();
        close();
        return;
      }
      const items = Array.from(rootRef.current?.querySelectorAll('[role="menuitem"]') ?? []);
      if (!items.length) return;
      const index = items.indexOf(document.activeElement);
      const focusAt = (i) => items[(i + items.length) % items.length]?.focus();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusAt(index + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusAt(index - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        focusAt(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        focusAt(items.length - 1);
      }
    };
    const onDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('button[aria-label^="Profile menu"]')) return;
      log('branch: outside click closes');
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open, update]);

  if (!open) return null;

  const me = MENU_ACCOUNT;
  const act = (id, patch) => {
    log('action', { id, patch });
    update({ menu: null, ...patch });
  };
  const go = (id, to) => {
    log('navigate', { id, to });
    navigate(to);
  };
  const noDestination = (id) => {
    log('menu row without a drawn destination:', id);
    update({ menu: null });
  };
  const item = (id, props) => <MenuItem id={id} hot={hot === id} onHot={setHot} {...props} />;

  return (
    <div
      ref={rootRef}
      className="absolute top-[72px] right-[clamp(16px,3.24vw,56px)] z-[60] w-[340px] max-w-[calc(100vw-32px)] max-md:top-[52px]"
    >
      <div
        role="menu"
        aria-label="Profile menu"
        className="flex max-h-[calc(100dvh-96px)] w-full flex-col items-start gap-[4px] overflow-y-auto rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] leading-[1.19] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] outline-none"
      >
        <div className="flex w-full shrink-0 flex-col items-start gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[12px]">
          <div className="flex w-full items-center gap-[12px]">
            <span
              aria-hidden="true"
              className="relative size-[48px] shrink-0 overflow-hidden rounded-[24px] bg-[#387440]"
            >
              <img
                src={avatarPortrait}
                alt=""
                draggable="false"
                className="absolute -bottom-[6px] left-1/2 h-[56px] w-[54px] max-w-none -translate-x-1/2 select-none"
              />
            </span>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
              <div className="flex max-w-full items-center gap-[6px]">
                <p className="m-0 truncate font-sans text-[16px] font-semibold text-[#1c2a21]">
                  {me.name}
                </p>
                <span className="flex shrink-0 items-center gap-[4px] rounded-[999px] bg-[#ebf1ec] px-[7px] py-[4px]">
                  <VerifyBadgeIcon className="size-[14px] shrink-0 text-[#2a5730]" />
                  <span className="font-sans text-[11px] font-semibold whitespace-nowrap text-[#2a5730] max-lg:text-[12px]">
                    Verified
                  </span>
                </span>
              </div>
              <p className="m-0 max-w-full truncate font-sans text-[13px] font-normal text-[#595959]">
                {me.email}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <div className="relative flex h-[8px] min-w-px flex-1 items-start overflow-clip rounded-[999px] bg-[#e7e7e7]">
              <span
                className="absolute top-0 left-0 h-[8px] rounded-[999px] bg-[#387440]"
                style={{ width: `${me.strength}%` }}
              />
            </div>
            <p className="m-0 shrink-0 font-sans text-[12.5px] font-semibold whitespace-nowrap text-[#387440]">
              {`Profile ${me.strength}%`}
            </p>
            <span className="flex shrink-0 items-center rounded-[999px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[3px] font-sans text-[11px] font-medium whitespace-nowrap text-[#ebf1ec] max-lg:text-[12px]">
              {me.tier}
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('profile', {
            icon: <ProfileMenuUserIcon className="size-[20px]" />,
            label: 'View my recruiter profile',
            onActivate: () => noDestination('profile'),
          })}
          {item('preview', {
            icon: <ProfileMenuEyeIcon className="h-[19px] w-[20px]" />,
            label: 'Preview as talent',
            onActivate: () => noDestination('preview'),
          })}
          {item('applicants', {
            icon: <ProfileMenuSuitcaseIcon className="size-[20px]" />,
            label: 'View applicants',
            value: String(me.applicants),
            onActivate: () => go('applicants', '/recruiter/application-pipeline'),
          })}
          {item('saved', {
            icon: <ProfileMenuBookmarkIcon className="size-[20px]" />,
            label: 'Saved talents',
            value: String(me.savedTalents),
            onActivate: () => go('saved', '/recruiter/talent-search'),
          })}
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('settings', {
            icon: <ProfileMenuSettingsIcon className="size-[20px]" />,
            label: 'Settings',
            chevron: true,
            onActivate: () => act('settings', { tab: 'account' }),
          })}
          {item('accessibility', {
            icon: <ProfileMenuAccessibilityIcon className="size-[20px]" />,
            label: 'Accessibility',
            chevron: true,
            onActivate: () => act('accessibility', { tab: 'accessibility' }),
          })}
          {item('language', {
            icon: <ProfileMenuGlobeIcon className="size-[20px]" />,
            label: 'Language',
            value: me.language,
            chevron: true,
            onActivate: () => act('language', { tab: 'language' }),
          })}
        </div>

        <Divider />

        <div className="relative flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('help', {
            icon: <ProfileMenuHelpIcon className="size-[20px]" />,
            label: 'Help and support',
            onActivate: () => act('help', { help: 'page' }),
          })}
          {item('feedback', {
            icon: <ProfileMenuFeedbackIcon className="size-[20px]" />,
            label: 'Send feedback',
            onActivate: () => act('feedback', { modal: 'feedback' }),
          })}
          {item('invite', {
            icon: <ProfileMenuInviteIcon className="size-[20px]" />,
            label: 'Invite a friend',
            onActivate: () => act('invite', { modal: 'invite' }),
          })}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[103.5px] right-[13px] flex items-center rounded-[999px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[3px] font-sans text-[11px] font-medium whitespace-nowrap text-[#ebf1ec] max-lg:text-[12px]"
          >
            {me.inviteReward}
          </span>
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start">
          {item('logout', {
            icon: <LogoutIcon className="size-[20px] text-[#c0392b]" />,
            label: 'Log out',
            danger: true,
            onActivate: () => act('logout', { modal: 'logout' }),
          })}
        </div>

        <div className="flex w-full shrink-0 flex-wrap items-center gap-x-[12px] gap-y-[4px] px-[12px] pt-[6px] pb-[4px] font-sans text-[12px] text-[#595959]">
          <button
            type="button"
            onClick={() => noDestination('privacy')}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium max-lg:min-h-[24px] text-[#595959] underline decoration-solid underline-offset-[from-font] outline-none focus-visible:outline-2 focus-visible:outline-[#1c2a21]"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => noDestination('terms')}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium max-lg:min-h-[24px] text-[#595959] underline decoration-solid underline-offset-[from-font] outline-none focus-visible:outline-2 focus-visible:outline-[#1c2a21]"
          >
            Terms
          </button>
          <span className="ml-auto font-normal whitespace-nowrap">
            Keyboard: ↑ ↓ to move, Esc to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileMenu;
