import {
  TalentPageBackgroundBlobBottomRightIllustration,
  TalentPageBackgroundBlobTopLeftIllustration,
  TalentPageBackgroundBlobCenterIllustration,
} from '../../shared/assets.jsx';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useA11yPrefs } from './useA11yPrefs.js';
import DashboardTopNav from '../dashboard/DashboardTopNav.jsx';
import TalentSidebar from './TalentSidebar.jsx';
import TalentRailCollapsed from './TalentRailCollapsed.jsx';
import toggleIcon from '../../../assets/notifications/rail/toggle.svg';
import TalentMobileNav from './TalentMobileNav.jsx';
import TalentRailHome from './TalentRailHome.jsx';
import TalentShellOverlays from '../talentSettings/TalentShellOverlays.jsx';
import { TalentRailToggleChevronsIcon } from '../../shared/assets.jsx';
import bgGrid from '../../../assets/community/bg-grid.png';

const log = debug('TalentDashboardShell');

// Which rail item is current per page (mirrors TalentSidebar's activeNav mapping) for the collapsed rail.
const RAIL_ID_BY_NAV = {
  profile: 'profile',
  community: 'community',
  assessment: 'assessment',
  'skills-lab': 'skills-lab',
  streak: 'none',
  jobs: 'opportunities',
  learning: 'my-learning',
};

/*
 * TalentDashboardShell — the `role="talent"` branch of DashboardShell (it dispatches here, so the
 * recruiter shell is untouched). Same fixed-viewport layout: top nav + rail are chrome, only <main>
 * scrolls. Rail: >= lg full TalentSidebar, md–lg compact icon rail, < md TalentMobileNav.
 * Background (Figma HM-01 grid + `bg blob` x3): grid texture in both styles; the three blobs are
 * Playful only (hidden in the Focused frames). The Ask Buddy FAB belongs to the Flows agent.
 *
 * Optional `rail` ('collapsed' | 'expanded'): the Notifications frames (7471:53182) draw the
 * 126px collapsed rail (TalentRailCollapsed) or the full sidebar from lg up. Omitted = the
 * original behaviour, byte-for-byte (home etc.). `onToggleRail` flips between the two; the
 * expanded state's « button is not in Figma (⚠️ ASSUMPTION — needed to get back).
 */
const TalentDashboardShell = ({
  children,
  talentHome,
  contentClassName,
  mainClassName,
  rail,
  onToggleRail,
  railActiveId,
  railBadges,
  activeNav,
}) => {
  const [prefs] = useA11yPrefs();
  const [params, setParams] = useSearchParams();
  /* `?collapsed=1` (HMc): URL-driven collapsed rail on every talent page that doesn't pass its own `rail`
     prop (Notifications keeps its state). The « toggle is drawn on /home and /settings (Figma HMc / PM). */
  const urlRail = rail === undefined;
  const collapsedByUrl = urlRail && params.get('collapsed') === '1';
  const showUrlToggle = urlRail && (!activeNav || activeNav === 'settings');
  const setCollapsed = (next) => {
    log('toggle ->', next ? 'collapsed' : 'expanded');
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('collapsed', '1');
    else nextParams.delete('collapsed');
    setParams(nextParams, { replace: true });
  };
  /* `activeNav="profile"` (/profile): the profile state names the help flag `help`; the chrome's
     pop-overs read the home names (`helpOpen`, `notif`, `tip`), so mirror them from the URL. */
  const chrome =
    (activeNav === 'profile' ||
      activeNav === 'jobs' ||
      activeNav === 'streak' ||
      activeNav === 'assessment' ||
      activeNav === 'community' ||
      activeNav === 'skills-lab') &&
    talentHome
      ? {
          ...talentHome,
          helpOpen: params.get('help') === '1',
          helpPage:
            activeNav === 'profile'
              ? 'profile'
              : activeNav === 'jobs'
                ? 'jobs'
                : activeNav === 'community'
                  ? 'community'
                  : activeNav === 'assessment'
                    ? 'assessment'
                    : activeNav === 'skills-lab'
                      ? 'skills-lab'
                      : activeNav === 'streak'
                        ? 'streak'
                        : undefined,
          // the nav accessibility button opens the profile's own panel (see TalentA11yMenu)
          profileA11y: activeNav === 'profile',
          notif: ['open', 'empty', 'loading'].includes(params.get('notif'))
            ? params.get('notif')
            : null,
          notifTip: params.get('tip') === '1',
        }
      : activeNav === 'learning' && talentHome
        ? { ...talentHome, navMessageCount: '4' }
        : talentHome;
  const on = Boolean(talentHome?.a11yMode);
  // A11Y-02: accessibility mode applies whichever panel toggles are on (styles: talentA11y.css).
  const a11yAttrs = {
    'data-a11y': on ? 'on' : undefined,
    'data-a11y-contrast': on && prefs.contrast ? '' : undefined,
    'data-a11y-motion': on && prefs.motion ? '' : undefined,
    'data-a11y-links': on && prefs.links ? '' : undefined,
    'data-a11y-text': on ? prefs.text : undefined,
  };

  const skipToMain = (event) => {
    event.preventDefault();
    const main = document.getElementById('main');
    log('skip link -> main');
    main?.focus();
    main?.scrollIntoView?.({ block: 'start' });
  };

  useEffect(() => {
    log('mount', { stateKey: talentHome?.stateKey, tab: talentHome?.tab });
  }, [talentHome?.stateKey, talentHome?.tab]);

  return (
    <div
      {...a11yAttrs}
      className="relative flex h-screen max-lg:h-dvh w-full flex-col overflow-hidden max-lg:overflow-clip bg-[#f8f8f4]"
    >
      {/* Skip link (A11Y-01 Figma 7751:3305): first tab stop, visible only while focused. */}
      <a
        href="#main"
        onClick={skipToMain}
        className="fixed top-[12px] left-[46px] z-[100] flex items-center gap-[8px] rounded-[12px] border-[3px] border-solid border-[#ffd86b] bg-[#1c2a21] py-[10px] pr-[16px] pl-[14px] text-[14px] leading-[normal] font-bold whitespace-nowrap text-white opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto"
      >
        Skip to main content
        <span className="max-lg:hidden rounded-full border border-solid border-[rgba(28,42,33,0.35)] bg-[#ffd86b] px-[10px] py-[4px] text-[11px] leading-[normal] font-semibold text-[#1c2a21]">
          Enter
        </span>
      </a>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: `url(${bgGrid})`,
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
        {/* Figma blobs (900/840/740 px art @1728): positions/sizes as vw so they scale. */}
        <div data-bg-blobs="" className="absolute inset-0 hidden playful:block">
          <TalentPageBackgroundBlobBottomRightIllustration className="absolute left-[67.13vw] top-[29.4vw] h-auto w-[52.08vw] max-w-none" />
          <TalentPageBackgroundBlobTopLeftIllustration className="absolute left-[-19.68vw] top-[-19.79vw] h-auto w-[48.61vw] max-w-none" />
          <TalentPageBackgroundBlobCenterIllustration className="absolute left-[32.41vw] top-[-8.8vw] h-auto w-[42.82vw] max-w-none" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <DashboardTopNav className="shrink-0" talentHome={chrome} />

        <div className={classNames('flex min-h-0 w-full flex-1', contentClassName)}>
          {collapsedByUrl ? (
            <TalentRailHome
              home={chrome}
              activeNav={activeNav}
              activeId={
                railActiveId ??
                (!activeNav && chrome?.tab === 'assessment'
                  ? 'assessment'
                  : (RAIL_ID_BY_NAV[activeNav] ?? 'home'))
              }
              onToggle={() => setCollapsed(false)}
              className="hidden h-full lg:flex"
            />
          ) : rail === 'collapsed' ? (
            <TalentRailCollapsed
              activeId={railActiveId}
              badges={railBadges}
              onToggle={onToggleRail}
              className="hidden h-full lg:flex"
            />
          ) : (
            <div className="relative hidden h-full lg:flex">
              <TalentSidebar
                home={chrome}
                className="h-full"
                activeId={railActiveId}
                activeNav={activeNav}
              />
              {showUrlToggle && (
                <button
                  type="button"
                  aria-label="Collapse sidebar"
                  aria-expanded="true"
                  onClick={() => setCollapsed(true)}
                  className="absolute top-[32px] right-[22px] flex size-[28px] cursor-pointer items-center justify-center overflow-clip rounded-[8px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <TalentRailToggleChevronsIcon />
                </button>
              )}
              {rail === 'expanded' && (
                <button
                  type="button"
                  aria-label="Collapse sidebar"
                  aria-expanded="true"
                  onClick={() => {
                    log('toggle -> collapsed');
                    onToggleRail?.();
                  }}
                  className="absolute right-[14px] top-[6px] flex size-[28px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
                >
                  <img
                    src={toggleIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-[16px] w-[19px] rotate-180"
                  />
                </button>
              )}
            </div>
          )}
          <TalentSidebar
            home={chrome}
            compact
            className="hidden h-full md:flex lg:hidden"
            activeId={railActiveId}
            activeNav={activeNav}
          />
          <main
            id="main"
            tabIndex={-1}
            className={classNames(
              'outline-none',
              'min-h-0 min-w-0 flex-1 overflow-y-auto pb-[64px] max-md:pb-[24px] md:max-lg:pb-[104px]',
              mainClassName
            )}
          >
            {children}
          </main>
        </div>

        <TalentMobileNav home={chrome} activeNav={activeNav} />
        <TalentShellOverlays />
      </div>
    </div>
  );
};

export default TalentDashboardShell;
