import { savePreferences } from '../../../services/settings.api.js';
import { invalidateAccountOverview, useAccountOverview } from './useLiveSettings.js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { switchSpace, useSpaces } from '../../../services/spaces.api.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  ProfileMenuAccessibilityIcon,
  ProfileMenuBookmarkIcon,
  ProfileMenuChevronIcon,
  ProfileMenuEyeIcon,
  ProfileMenuFeedbackIcon,
  ProfileMenuGlobeIcon,
  ProfileMenuHelpIcon,
  ProfileMenuInviteIcon,
  ProfileMenuLanguageCheckIcon,
  ProfileMenuLogoutIcon,
  ProfileMenuSettingsIcon,
  ProfileMenuSuitcaseIcon,
  ProfileMenuUserIcon,
  ProfileMenuVerifiedCheckIcon,
} from '../../shared/assets.jsx';
import avatarPortrait from '../../../assets/talent-settings/menu/kofi-avatar-portrait.svg';
import { TALENT_PROFILE } from '../talentHome/talentShellData.js';
import { STORAGE_KEYS } from '../../../constants/storageKeys.js';

const log = debug('ProfileMenu');

/*
 * ProfileMenu — Figma `GTH · Profile menu` 7837:222573 (+ `GTH · Menu item` 7837:11115) and the
 * `Language submenu`. Frames: PM-01 Open (Playful 7837:222777 / Focused 8110:37388) and PM-02
 * Language (7837:223602 / 8110:38049). Text is verbatim from the frames; Playful differences are
 * `playful:` variants only (1.5px ink border + offset shelf, gradient avatar, mint "Top Talent"
 * chip with an ink border, "+50 XP" instead of "+50 pts").
 *
 * Mounted by the talent shell on ANY talent page; state lives in the URL (`?menu=open|language`,
 * see talentSettingsState.js). Esc / outside click close it by updating the URL. Props:
 * `settings` (useTalentSettingsState()): `settings.menu`, `settings.update(patch)`.
 * Mock account data below is shaped for an API (email, counts, profile strength, language).
 */

const ACCOUNT = {
  email: 'kofi.agyekum@gmail.com',
  strength: 100,
  tier: 'Top Talent',
  applications: 4,
  savedJobs: 3,
  language: 'English (GH)',
  inviteReward: { focused: '+50 pts', playful: '+50 XP' },
};

const LANGUAGES = [
  { id: 'en-GH', label: 'English (Ghana)', beta: false },
  { id: 'tw', label: 'Twi', beta: true },
  { id: 'ga', label: 'Ga', beta: true },
  { id: 'ee', label: 'Ewe', beta: true },
  { id: 'dag', label: 'Dagbani', beta: true },
  { id: 'ha', label: 'Hausa', beta: true },
];

const RING =
  'focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-solid focus-visible:outline-[#1c2a21]';

/* GTH · Menu item — 44px row, px12 py10, radius 12. Hover / `hot` = green tint (#ebf1ec, medium green label). */
const MenuItem = ({ icon, label, value, chevron, hot, onActivate, onHot, expanded, id }) => (
  <button
    type="button"
    role="menuitem"
    data-menu-item={id}
    aria-haspopup={expanded === undefined ? undefined : 'menu'}
    aria-expanded={expanded}
    aria-label={value ? `${label}, ${value}` : undefined}
    onClick={onActivate}
    onMouseEnter={() => onHot?.(id)}
    onFocus={() => onHot?.(id)}
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
    {(value || chevron) && (
      <span className="flex shrink-0 items-center gap-[6px]">
        {value && (
          <span
            aria-hidden="true"
            data-count={value}
            className="text-[13px] font-semibold whitespace-nowrap text-[#595959] after:content-[attr(data-count)]"
          />
        )}
        {chevron && <ProfileMenuChevronIcon className="size-[18px] shrink-0" />}
      </span>
    )}
  </button>
);

const Divider = () => <div aria-hidden="true" className="h-px w-full shrink-0 bg-[#e7e7e7]" />;

// Settings stores the language as en | tw | ga | ee | dag | ha (talentSettingsBData LANGUAGES).
const toSettingsLang = (id) => (id === 'en-GH' ? 'en' : id);

const LanguageSubmenu = ({ onPick, current = 'en-GH' }) => (
  <div
    role="menu"
    aria-label="App language"
    className="absolute bottom-0 right-[calc(100%+12px)] flex w-[280px] flex-col items-start gap-[8px] rounded-[18px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[10px] shadow-[0px_2px_4px_rgba(28,42,33,0.04),0px_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0px_10px_12px_rgba(28,42,33,0.06),4px_4px_0px_rgba(28,42,33,0.45)] max-md:right-0 max-md:w-[min(280px,100%)]"
  >
    <div className="flex flex-col items-start gap-[2px] px-[12px] py-[8px] leading-[1.19]">
      <p className="m-0 font-sans text-[14px] font-semibold text-[#1c2a21]">App language</p>
      <p className="m-0 font-sans text-[12px] font-normal text-[#595959]">
        Career Buddy replies in this language too.
      </p>
    </div>
    {LANGUAGES.map((lang) => {
      const selected = toSettingsLang(lang.id) === toSettingsLang(current);
      return (
        <button
          key={lang.id}
          type="button"
          role="menuitemradio"
          aria-checked={selected}
          aria-label={lang.beta ? `${lang.label}, beta` : lang.label}
          data-menu-item={lang.id}
          onClick={() => onPick(lang)}
          className={classNames(
            'flex w-full shrink-0 cursor-pointer items-center gap-[10px] rounded-[12px] px-[12px] py-[10px] text-left font-sans text-[15px] leading-[1.19] outline-none transition-colors',
            RING,
            selected ? 'bg-[#ebf1ec] hover:bg-[#ebf1ec]' : 'bg-transparent hover:bg-[#ebf1ec]'
          )}
        >
          <span
            className={classNames(
              'min-w-0 flex-1',
              selected ? 'font-medium text-[#387440]' : 'font-normal text-[#575755]'
            )}
          >
            {lang.label}
          </span>
          {selected && <ProfileMenuLanguageCheckIcon className="size-[20px] shrink-0" />}
          {lang.beta && (
            <span
              aria-hidden="true"
              data-count="Beta"
              className="flex shrink-0 items-center rounded-[999px] bg-[#faf4e8] px-[7px] py-[2px] text-[11px] max-lg:text-[12px] font-semibold whitespace-nowrap text-[#463409] after:content-[attr(data-count)]"
            />
          )}
        </button>
      );
    })}
  </div>
);

/** The signed-in user saved at login (name / email) - shown until GET /settings/overview answers. */
const storedAccount = () => {
  try {
    const u = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null') || {};
    return {
      name: [u.firstName, u.lastName].filter(Boolean).join(' '),
      email: u.email || '',
      strength: undefined,
      tier: null,
      applications: undefined,
      savedJobs: undefined,
    };
  } catch {
    return { name: '', email: '' };
  }
};

const ProfileMenu = ({ settings }) => {
  const navigate = useNavigate();
  // Live account figures (GET /settings/overview, cached); the drawn Kofi values with `?demo=1` or while loading.
  const overview = useAccountOverview({ enabled: !settings.demo });
  const me = overview?.account;
  const langId = overview?.preferences?.language?.language || 'en';
  const langLabel = (LANGUAGES.find((l) => toSettingsLang(l.id) === langId) || LANGUAGES[0]).label;
  const view = me
    ? {
        name: [me.firstName, me.lastName].filter(Boolean).join(' ') || TALENT_PROFILE.name,
        email: me.email,
        photo: me.profilePhoto,
        strength: overview.summary?.profileCompletion,
        tier: overview.summary?.profileCompletion === 100 ? 'Profile complete' : null,
        applications: overview.summary?.applications,
        savedJobs: overview.summary?.savedJobs,
        language: langId === 'en' ? 'English (GH)' : langLabel,
        langId,
      }
    : settings.demo
      ? { ...ACCOUNT, name: TALENT_PROFILE.name, photo: null, langId: 'en' }
      : // Live, account still loading: the signed-in user's own name, never the demo person.
        { ...ACCOUNT, ...storedAccount(), photo: null, langId: 'en' };
  const cardRef = useRef(null);
  const rootRef = useRef(null);
  // An account that is also a parent: "Switch to Parent view" (live only; the phone has no sidebar card for it).
  const spaces = useSpaces();
  const parentSpace = !settings.demo ? spaces.parent : null;
  const [switching, setSwitching] = useState(false);
  const toParent = async () => {
    if (switching || !parentSpace) return;
    setSwitching(true);
    try {
      await switchSpace(parentSpace.entityId);
      log('switched to parent view');
      window.location.assign('/parent');
    } catch (err) {
      log('switch to parent failed', err?.message);
      setSwitching(false);
    }
  };
  const languageOpen = settings.menu === 'language';
  const [hot, setHot] = useState(languageOpen ? 'language' : 'settings');

  useEffect(() => {
    log('mount', { menu: settings.menu });
  }, [settings.menu]);

  // The highlighted row follows the state shown in the frames (Settings / Language) until the pointer or focus moves.
  useEffect(() => {
    setHot(languageOpen ? 'language' : 'settings');
  }, [languageOpen]);

  const close = (restoreFocus = true) => {
    log('close');
    settings.update({ menu: null });
    if (restoreFocus) {
      requestAnimationFrame(() => document.querySelector('[data-profile-chip]')?.focus());
    }
  };

  // Esc + outside click close it (the chip toggles itself, so it is excluded from the outside test).
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        log('branch: Escape closes');
        event.preventDefault();
        close();
      }
    };
    const onDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (event.target.closest?.('[data-profile-chip]')) return;
      log('branch: outside click closes');
      close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.update]);

  // Focus moves to the first item when the menu is opened with the keyboard (component note); a pointer
  // open leaves focus alone (no ring) — the arrow keys still work, see the document key handler below.
  useEffect(() => {
    const chip = document.querySelector('[data-profile-chip]');
    const keyboard = chip ? chip.matches(':focus-visible') : false;
    log('open via', keyboard ? 'keyboard' : 'pointer / url');
    if (keyboard)
      cardRef.current?.querySelector('[role="menuitem"]')?.focus({ preventScroll: true });
  }, []);

  const go = (to) => {
    log('navigate', to);
    navigate(to);
  };
  const act = (patch) => {
    log('action', patch);
    settings.update({ menu: null, ...patch });
  };
  const noDestination = (id) => {
    log('menu item (no destination wired yet):', id);
    close();
  };

  const onKeyDown = (event) => {
    const items = Array.from(
      rootRef.current?.querySelectorAll('[role="menuitem"],[role="menuitemradio"]') ?? []
    );
    if (items.length === 0) return;
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
    } else if (
      event.key === 'ArrowRight' &&
      document.activeElement?.dataset.menuItem === 'language'
    ) {
      event.preventDefault();
      settings.update({ menu: 'language' });
    } else if (event.key === 'ArrowLeft' && languageOpen) {
      event.preventDefault();
      settings.update({ menu: 'open' });
      rootRef.current?.querySelector('[data-menu-item="language"]')?.focus();
    }
  };

  // Arrow / Home / End keys work from anywhere while the menu is open (focus may still be on the page).
  const keyRef = useRef(onKeyDown);
  useEffect(() => {
    keyRef.current = onKeyDown;
  });
  useEffect(() => {
    const handler = (event) => keyRef.current(event);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const item = (id, props) => <MenuItem id={id} hot={hot === id} onHot={setHot} {...props} />;

  return (
    <div
      ref={rootRef}
      className="fixed top-[79.4px] right-[clamp(16px,3.24vw,56px)] z-[60] w-[340px] max-w-[calc(100vw-32px)] max-md:top-[56px]"
    >
      <div
        ref={cardRef}
        role="menu"
        aria-label="Profile menu"
        className="outline-none flex max-h-[calc(100dvh-96px)] w-full flex-col items-start gap-[4px] overflow-y-auto rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[12px] leading-[1.19] shadow-[0px_2px_4px_rgba(28,42,33,0.04),0px_1px_1px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0px_10px_12px_rgba(28,42,33,0.06),4px_4px_0px_rgba(28,42,33,0.45)]"
      >
        {/* Header */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[12px] rounded-[16px] bg-[#f8f8f4] p-[12px]">
          <div className="flex w-full items-center gap-[12px]">
            <span
              aria-hidden="true"
              className="relative size-[48px] shrink-0 overflow-hidden rounded-[24px] bg-[#387440] playful:bg-[linear-gradient(135deg,#387440_14.637%,#7aa870_85.349%)]"
            >
              {view.photo ? (
                <img
                  src={view.photo}
                  alt=""
                  draggable="false"
                  className="size-full object-cover select-none"
                />
              ) : (
                <img
                  src={avatarPortrait}
                  alt=""
                  draggable="false"
                  className="absolute -bottom-[6px] left-1/2 h-[56px] w-[54px] max-w-none -translate-x-1/2 select-none"
                />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px]">
              <div className="flex max-w-full items-center gap-[6px]">
                <p className="m-0 truncate font-sans text-[16px] font-semibold text-[#1c2a21]">
                  {view.name}
                </p>
                <span className="flex shrink-0 items-center gap-[6px] rounded-[999px] bg-[#ebf1ec] px-[7px] py-[2px]">
                  <ProfileMenuVerifiedCheckIcon className="size-[14px] shrink-0" />
                  <span className="font-sans text-[11px] max-lg:text-[12px] font-semibold whitespace-nowrap text-[#2a5730]">
                    Verified
                  </span>
                </span>
              </div>
              <p className="m-0 max-w-full truncate font-sans text-[13px] font-normal text-[#595959]">
                {view.email}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center gap-[10px]">
            <div className="relative flex h-[8px] min-w-px flex-1 items-start overflow-clip rounded-[999px] bg-[#e7e7e7]">
              <span
                className="absolute top-0 left-0 h-[8px] rounded-[999px] bg-[#387440]"
                style={
                  typeof view.strength === 'number' && view.strength < 100
                    ? { width: `${Math.max(0, view.strength)}%` }
                    : { right: '0.2px' }
                }
              />
            </div>
            <p className="m-0 shrink-0 font-sans text-[12.5px] font-semibold whitespace-nowrap text-[#387440]">
              {typeof view.strength === 'number' ? `Profile ${view.strength}%` : 'Profile'}
            </p>
            {view.tier ? (
              <span className="flex shrink-0 items-center rounded-[999px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[7px] py-[2px] font-sans text-[11px] max-lg:text-[12px] font-bold whitespace-nowrap text-[#1c2a21] playful:border-[#1c2a21] playful:bg-[#ebf1ec]">
                {view.tier}
              </span>
            ) : null}
          </div>
        </div>

        {parentSpace ? (
          <>
            <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
              {item('parent-view', {
                icon: <ProfileMenuUserIcon className="size-[20px]" />,
                label: switching ? 'Switching…' : 'Switch to Parent view',
                chevron: true,
                onActivate: toParent,
              })}
            </div>
            <Divider />
          </>
        ) : null}

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('profile', {
            icon: <ProfileMenuUserIcon className="size-[20px]" />,
            label: 'View my profile',
            onActivate: () => go('/profile'),
          })}
          {item('preview', {
            icon: <ProfileMenuEyeIcon className="h-[19px] w-[20px]" />,
            label: 'Preview as recruiter',
            onActivate: () => go('/profile?view=recruiter'),
          })}
          {item('applications', {
            icon: <ProfileMenuSuitcaseIcon className="size-[20px]" />,
            label: 'My applications',
            value: view.applications == null ? '–' : String(view.applications),
            onActivate: () => go('/job-postings?tab=applied'),
          })}
          {item('saved', {
            icon: <ProfileMenuBookmarkIcon className="size-[20px]" />,
            label: 'Saved jobs',
            value: view.savedJobs == null ? '–' : String(view.savedJobs),
            onActivate: () => go('/job-postings?tab=saved'),
          })}
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('settings', {
            icon: <ProfileMenuSettingsIcon className="size-[20px]" />,
            label: 'Settings',
            chevron: true,
            onActivate: () => {
              settings.update({ menu: null });
              go('/settings/account');
            },
          })}
          {item('accessibility', {
            icon: <ProfileMenuAccessibilityIcon className="size-[20px]" />,
            label: 'Accessibility',
            chevron: true,
            onActivate: () => go('/settings/accessibility'),
          })}
          {item('language', {
            icon: <ProfileMenuGlobeIcon className="size-[20px]" />,
            label: 'Language',
            value: view.language,
            chevron: true,
            expanded: languageOpen,
            onActivate: () => settings.update({ menu: languageOpen ? 'open' : 'language' }),
          })}
        </div>

        <Divider />

        <div className="relative flex w-full shrink-0 flex-col items-start gap-[6px]">
          {item('help', {
            icon: <ProfileMenuHelpIcon className="size-[20px]" />,
            label: 'Help and support',
            onActivate: () => go('/settings/help'),
          })}
          {item('feedback', {
            icon: <ProfileMenuFeedbackIcon className="size-[20px]" />,
            label: 'Send feedback',
            onActivate: () => act({ dialog: 'feedback' }),
          })}
          {item('invite', {
            icon: <ProfileMenuInviteIcon className="size-[20px]" />,
            label: 'Invite a friend',
            onActivate: () => act({ dialog: 'invite' }),
          })}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[103.5px] right-[13px] flex items-center rounded-[999px] border border-solid border-[rgba(28,42,33,0.12)] bg-[#387440] px-[7px] py-[2px] font-sans text-[11px] max-lg:text-[12px] font-bold whitespace-nowrap text-[#1c2a21] playful:border-[#1c2a21] playful:bg-[#ebf1ec]"
          >
            <span className="playful:hidden">{ACCOUNT.inviteReward.focused}</span>
            <span className="hidden playful:inline">{ACCOUNT.inviteReward.playful}</span>
          </span>
        </div>

        <Divider />

        <div className="flex w-full shrink-0 flex-col items-start">
          {item('logout', {
            icon: <ProfileMenuLogoutIcon className="size-[20px]" />,
            label: 'Log out',
            onActivate: () => act({ logout: 'confirm' }),
          })}
        </div>

        <div className="flex w-full shrink-0 flex-wrap items-center gap-x-[12px] gap-y-[4px] px-[12px] pt-[6px] pb-[4px] font-sans text-[12px] text-[#595959]">
          <button
            type="button"
            onClick={() => noDestination('privacy')}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#595959] underline decoration-solid underline-offset-[from-font] outline-none focus-visible:outline-2 focus-visible:outline-[#1c2a21]"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => noDestination('terms')}
            className="cursor-pointer border-0 bg-transparent p-0 font-medium text-[#595959] underline decoration-solid underline-offset-[from-font] outline-none focus-visible:outline-2 focus-visible:outline-[#1c2a21]"
          >
            Terms
          </button>
          <span className="ml-auto font-normal whitespace-nowrap">
            Keyboard: ↑ ↓ to move, Esc to close
          </span>
        </div>
      </div>

      {languageOpen && (
        <LanguageSubmenu
          current={view.langId}
          onPick={(lang) => {
            log('language pick', lang.id);
            // Saved to the account (Settings → Language); the app copy itself is English-only for now.
            if (me) {
              savePreferences({ language: { language: toSettingsLang(lang.id) } })
                .then(() => invalidateAccountOverview())
                .catch((err) => log('language not saved', err?.response?.status));
            }
            close();
          }}
        />
      )}
    </div>
  );
};

export default ProfileMenu;
