import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import {
  ProfileMenuAccessibilityIcon,
  ProfileMenuBookmarkIcon,
  ProfileMenuChevronIcon,
  ProfileMenuEyeIcon,
  ProfileMenuFeedbackIcon,
  ProfileMenuGlobeIcon,
  ProfileMenuHelpIcon,
  ProfileMenuInviteIcon,
  ProfileMenuLogoutIcon,
  ProfileMenuSettingsIcon,
  ProfileMenuSuitcaseIcon,
  ProfileMenuUserIcon,
  ProfileMenuVerifiedCheckIcon,
} from '../../../shared/assets.jsx';
import { ANALYSTS } from './data/agencySettingsData.js';

const log = debug('AgencyProfileMenu');

const RING =
  'focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-solid focus-visible:outline-[#1c2a21]';

const MenuItem = ({ icon, label, value, chevron, hot, onActivate, onHot, id }) => (
  <button
    type="button"
    role="menuitem"
    data-menu-item={id}
    aria-label={value ? `${label}, ${value}` : undefined}
    onClick={onActivate}
    onMouseEnter={() => onHot(id)}
    onFocus={() => onHot(id)}
    className={classNames(
      'flex h-[44px] w-full shrink-0 cursor-pointer items-center gap-[12px] rounded-[12px] px-[12px] py-[10px] text-left font-sans text-[15px] leading-[1.19] outline-none transition-colors',
      RING,
      hot ? 'bg-[#ebf1ec]' : 'bg-transparent'
    )}
  >
    <span className="relative flex size-[20px] shrink-0 items-center justify-center">{icon}</span>
    <span
      className={classNames(
        'min-w-0 flex-1',
        hot ? 'font-medium text-[#387440]' : 'font-normal text-[#575755]'
      )}
    >
      {label}
    </span>
    {value || chevron ? (
      <span className="flex shrink-0 items-center gap-[6px]">
        {value ? (
          <span
            aria-hidden="true"
            className="text-[13px] font-semibold whitespace-nowrap text-[#595959]"
          >
            {value}
          </span>
        ) : null}
        {chevron ? <ProfileMenuChevronIcon className="size-[18px] shrink-0" /> : null}
      </span>
    ) : null}
  </button>
);

const Divider = () => <div aria-hidden="true" className="h-px w-full shrink-0 bg-[#e7e7e7]" />;

const FOOT =
  'cursor-pointer border-0 bg-transparent p-0 font-medium text-[#595959] underline outline-none focus-visible:outline-2 focus-visible:outline-[#1c2a21]';

/*
 * AgencyProfileMenu — Figma 11.6.0b "Profile menu · Agency" (8597:401769, 340 wide, r20, p12, hairline border + soft drop): header card (name + Admin chip, email,
 * agency + "MoU active"), your agency page / preview / analysts / MoU, Agency settings (highlighted as drawn), accessibility, language, help, feedback,
 * invite an analyst, log out, footer. Mounted by AgencyFrame while ?modal=profile. Keyboard: arrows / Home / End move, Esc closes, focus returns to the
 * element that opened it (the top-bar chip); outside click closes. ⚠️ ASSUMPTIONS: Accessibility / Language / Help set the chrome's inert ?modal= keys,
 * Send feedback / Privacy / Terms just close, Log out returns to /agency/sign-up (no real session).
 * Props: data (useAgencyState()), session (useAgencySession()).
 */
const AgencyProfileMenu = ({ data, session }) => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const openerRef = useRef(null);
  const [hot, setHot] = useState('settings');
  const { analyst, agency, mou } = session;
  const analystsActive = ANALYSTS.filter((a) => a.status === 'active').length;
  const { update } = data;

  useEffect(() => {
    log('mount');
    openerRef.current = document.activeElement;
    if (openerRef.current?.matches?.(':focus-visible')) {
      rootRef.current?.querySelector('[role="menuitem"]')?.focus();
    }
    const closeMenu = (restore) => {
      log('close', { restore });
      update({ modal: null });
      if (restore) requestAnimationFrame(() => openerRef.current?.focus?.());
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
        return;
      }
      const items = Array.from(rootRef.current?.querySelectorAll('[role="menuitem"]') ?? []);
      const i = items.indexOf(document.activeElement);
      const at = (n) => items[(n + items.length) % items.length]?.focus();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        at(i + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        at(i - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        at(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        at(items.length - 1);
      }
    };
    const onDown = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      if (e.target.closest?.('button[aria-label^="Profile menu"]')) return;
      closeMenu(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [update]);

  const go = (to) => {
    log('navigate', to);
    navigate(to);
  };
  const close = () => {
    update({ modal: null });
    requestAnimationFrame(() => openerRef.current?.focus?.());
  };
  const item = (id, props) => <MenuItem id={id} hot={hot === id} onHot={setHot} {...props} />;
  const inert = (modal) => () => update({ modal });

  return (
    <div
      ref={rootRef}
      className="fixed top-[73px] right-[clamp(16px,3.24vw,56px)] z-[60] w-[340px] max-w-[calc(100vw-32px)] max-md:top-[64px]"
    >
      <div
        role="menu"
        aria-label="Profile menu"
        className="flex max-h-[calc(100dvh-90px)] w-full flex-col items-start gap-[4px] overflow-y-auto rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] leading-[1.19] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]"
      >
        <div className="flex w-full shrink-0 flex-col items-start gap-[16px] rounded-[16px] bg-[#f8f8f4] p-[12px]">
          <div className="flex min-w-0 flex-col gap-[2px]">
            <div className="flex items-center gap-[6px]">
              <p className="m-0 font-sans text-[16px] font-semibold text-[#1c2a21]">
                {analyst.name}
              </p>
              <span className="flex shrink-0 items-center gap-[6px] rounded-full bg-[#ebf1ec] px-[7px] py-[2px]">
                <ProfileMenuVerifiedCheckIcon className="size-[14px] shrink-0" />
                <span className="font-sans text-[11px] font-semibold whitespace-nowrap text-[#2a5730] max-lg:text-[12px]">
                  {analyst.role}
                </span>
              </span>
            </div>
            <p className="m-0 max-w-full truncate font-sans text-[13px] text-[#595959]">
              efua.owusu@nya.gov.gh
            </p>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <span
              aria-hidden="true"
              className="h-[8px] w-[60px] min-w-[16px] shrink rounded-full bg-[#387440]"
            />
            <p className="m-0 min-w-0 flex-1 truncate font-sans text-[12.5px] font-semibold text-[#387440]">
              {agency.name}
            </p>
            <span className="shrink-0 rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[8px] py-[3px] font-sans text-[11px] font-bold whitespace-nowrap text-[#e7e7e7] max-lg:text-[12px]">
              {mou.approved ? 'MoU active' : mou.label}
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('agency-page', {
            icon: <ProfileMenuUserIcon className="size-[20px]" />,
            label: 'Your agency page',
            onActivate: () => go('/agency/public-page'),
          })}
          {item('preview', {
            icon: <ProfileMenuEyeIcon className="h-[19px] w-[20px]" />,
            label: 'Preview public view',
            onActivate: () => go('/agency/public-page'),
          })}
          {item('analysts', {
            icon: <ProfileMenuSuitcaseIcon className="size-[20px]" />,
            label: 'Analysts',
            value: `${analystsActive} active`,
            onActivate: () => go('/agency/settings/analysts'),
          })}
          {item('mou', {
            icon: <ProfileMenuBookmarkIcon className="size-[20px]" />,
            label: 'MoU and access',
            value: 'Until Oct 2027',
            onActivate: () => go('/agency/settings/mou'),
          })}
        </div>
        <Divider />
        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('settings', {
            icon: <ProfileMenuSettingsIcon className="size-[20px]" />,
            label: 'Agency settings',
            chevron: true,
            onActivate: () => go('/agency/settings'),
          })}
          {item('accessibility', {
            icon: <ProfileMenuAccessibilityIcon className="size-[20px]" />,
            label: 'Accessibility',
            chevron: true,
            onActivate: inert('a11y'),
          })}
          {item('language', {
            icon: <ProfileMenuGlobeIcon className="size-[20px]" />,
            label: 'Language',
            value: 'English (GH)',
            chevron: true,
            onActivate: inert('language'),
          })}
        </div>
        <Divider />
        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('help', {
            icon: <ProfileMenuHelpIcon className="size-[20px]" />,
            label: 'Help and support',
            onActivate: inert('help'),
          })}
          {item('feedback', {
            icon: <ProfileMenuFeedbackIcon className="size-[20px]" />,
            label: 'Send feedback',
            onActivate: close,
          })}
          {item('invite', {
            icon: <ProfileMenuInviteIcon className="size-[20px]" />,
            label: 'Invite an analyst',
            onActivate: () => go('/agency/settings/analysts?modal=invite'),
          })}
        </div>
        <Divider />
        <div className="flex w-full shrink-0 flex-col items-start">
          {item('logout', {
            icon: <ProfileMenuLogoutIcon className="size-[20px]" />,
            label: 'Log out',
            onActivate: () => go('/agency/sign-up'),
          })}
        </div>

        <div className="flex w-full shrink-0 flex-wrap items-center gap-x-[12px] gap-y-[4px] px-[12px] pt-[6px] pb-[4px] font-sans text-[12px] text-[#595959]">
          <button type="button" onClick={close} className={FOOT}>
            Privacy
          </button>
          <button type="button" onClick={close} className={FOOT}>
            Terms
          </button>
          <span className="ml-auto whitespace-nowrap">Keyboard: ↑ ↓ to move, Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfileMenu;
