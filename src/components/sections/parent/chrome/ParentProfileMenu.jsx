import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import {
  ProfileMenuAccessibilityIcon,
  ProfileMenuGlobeIcon,
  ProfileMenuHelpIcon,
  ProfileMenuSettingsIcon,
  ProfileMenuUserIcon,
} from '../../../shared/assets.jsx';
import { Divider, MenuItem } from '../../talentSettings/ProfileMenu.jsx';
import { LogoutIcon, VerifyBadgeIcon } from '../../recruiterSettings/security/SettingsIcons.jsx';
import useParentChrome from '../live/useParentChrome.js';
import { careerHome } from '../data/parentCoreData.js';

const log = debug('ParentProfileMenu');

/*
 * ParentProfileMenu — the parent top bar's profile chip menu (`?panel=account`). The Parents file draws the chip with its
 * chevron but no menu, so this is the app's profile menu (the talent `MenuItem` / `Divider` rows, the same 340 card as the
 * recruiter SR-14 menu) with the parent's rows — ⚠️ ASSUMPTION for the set and the targets:
 *   header: photo, name + Verified, email, role line ("Mother · 2 wards linked")
 *   Settings → /parent/settings · Accessibility → the accessibility pop-up · Language → the language pop-up
 *   Help and guides → /parent/help · Switch to My career → the parent's talent home (or "Build my career profile" → its dialog)
 *   Log out → /parent/settings?modal=logout (the drawn PS-06 confirm).
 * Esc / outside click close it; ↑ ↓ Home End move between rows. Props: onClose, onLanguage, onA11y, career ('talent' | 'none'), onBuildCareer.
 */
const ParentProfileMenu = ({ onClose, onLanguage, onA11y, career = 'talent', onBuildCareer }) => {
  const navigate = useNavigate();
  const chrome = useParentChrome();
  const rootRef = useRef(null);
  const [hot, setHot] = useState('settings');
  const p = chrome.parent;

  useEffect(() => {
    log('open', { live: chrome.live, career });
    rootRef.current?.querySelector('[role="menuitem"]')?.focus();
  }, [chrome.live, career]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      const items = Array.from(rootRef.current?.querySelectorAll('[role="menuitem"]') ?? []);
      if (!items.length) return;
      const i = items.indexOf(document.activeElement);
      const at = (n) => items[(n + items.length) % items.length]?.focus();
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        at(i + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        at(i - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        at(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        at(items.length - 1);
      }
    };
    const onDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-parent-account-trigger]')) return;
      log('outside click closes');
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  const go = (id, to) => {
    log('navigate', { id, to });
    onClose();
    navigate(to);
  };
  const item = (id, props) => <MenuItem id={id} hot={hot === id} onHot={setHot} {...props} />;

  return (
    <div
      ref={rootRef}
      className="absolute top-[calc(100%+8px)] right-0 z-[60] w-[340px] max-w-[calc(100vw-32px)]"
    >
      <div
        role="menu"
        aria-label="Profile menu"
        className="flex max-h-[calc(100dvh-110px)] w-full flex-col items-start gap-[4px] overflow-y-auto rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] leading-[1.19] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] outline-none"
      >
        <div className="flex w-full shrink-0 items-center gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[12px]">
          <img
            src={p.photo}
            alt=""
            draggable="false"
            className="size-[48px] shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
            <div className="flex max-w-full items-center gap-[6px]">
              <p className="m-0 truncate font-sans text-[16px] font-semibold text-[#1c2a21]">
                {p.name}
              </p>
              {p.verified ? (
                <span className="flex shrink-0 items-center gap-[4px] rounded-[999px] bg-[#ebf1ec] px-[7px] py-[4px]">
                  <VerifyBadgeIcon className="size-[14px] shrink-0 text-[#2a5730]" />
                  <span className="font-sans text-[11px] font-semibold whitespace-nowrap text-[#2a5730] max-lg:text-[12px]">
                    Verified
                  </span>
                </span>
              ) : null}
            </div>
            {p.email ? (
              <p className="m-0 max-w-full truncate font-sans text-[13px] text-[#595959]">
                {p.email}
              </p>
            ) : null}
            {chrome.sidebar.role ? (
              <p className="m-0 max-w-full truncate font-sans text-[12px] text-[#387440]">
                {chrome.sidebar.role}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('settings', {
            icon: <ProfileMenuSettingsIcon className="size-[20px]" />,
            label: 'Settings',
            chevron: true,
            onActivate: () => go('settings', '/parent/settings'),
          })}
          {item('accessibility', {
            icon: <ProfileMenuAccessibilityIcon className="size-[20px]" />,
            label: 'Accessibility',
            chevron: true,
            onActivate: () => {
              log('accessibility pop-up');
              onA11y();
            },
          })}
          {item('language', {
            icon: <ProfileMenuGlobeIcon className="size-[20px]" />,
            label: 'Language',
            value: 'English (GH)',
            chevron: true,
            onActivate: () => {
              log('language pop-up');
              onLanguage();
            },
          })}
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('help', {
            icon: <ProfileMenuHelpIcon className="size-[20px]" />,
            label: 'Help and guides',
            onActivate: () => go('help', '/parent/help'),
          })}
          {career === 'talent'
            ? item('career', {
                icon: <ProfileMenuUserIcon className="size-[20px]" />,
                label: 'Switch to My career',
                onActivate: () => go('career', careerHome(chrome.live)),
              })
            : item('career', {
                icon: <ProfileMenuUserIcon className="size-[20px]" />,
                label: 'Build my career profile',
                onActivate: () => {
                  log('build career profile dialog');
                  onClose();
                  onBuildCareer?.();
                },
              })}
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start">
          {item('logout', {
            icon: <LogoutIcon className="size-[20px] text-[#c0392b]" />,
            label: 'Log out',
            danger: true,
            onActivate: () => go('logout', '/parent/settings?modal=logout'),
          })}
        </div>
        <p className="m-0 w-full px-[12px] pt-[6px] pb-[4px] text-right font-sans text-[12px] text-[#595959] max-md:hidden">
          Keyboard: ↑ ↓ to move, Esc to close
        </p>
      </div>
    </div>
  );
};

export default ParentProfileMenu;
