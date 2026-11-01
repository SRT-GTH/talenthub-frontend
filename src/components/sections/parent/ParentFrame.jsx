import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { homePathFor } from '../../../services/auth.api.js';
import { STORAGE_KEYS } from '../../../constants/storageKeys.js';
import { useParentMe } from './live/parentLive.js';
import AskBuddyFabButton from '../../ui/AskBuddyFabButton.jsx';
import ParentRailCollapsed from './ParentRailCollapsed.jsx';
import ParentSidebar from './ParentSidebar.jsx';
import ParentTopBar from './ParentTopBar.jsx';
import CareerProfileDialog from './switch/CareerProfileDialog.jsx';
import SwitchSpaceMenu from './switch/SwitchSpaceMenu.jsx';
import ParentBuddyPanel from './buddy/ParentBuddyPanel.jsx';
import { PHASE_IDS } from './buddy/buddyData.js';
import NotificationsPanel from './notifications/NotificationsPanel.jsx';
import { useNotificationsState } from './notifications/notificationsState.js';
import bgGrid from '../../../assets/community/bg-grid.png';

const log = debug('ParentFrame');

const ParentFrame = ({
  sidebar = 'linked',
  sidebarSlot,
  active = 'home',
  bell,
  messages,
  mainClassName,
  dimSidebar = false,
  children,
}) => {
  const [params, setParams] = useSearchParams();
  const collapsed = params.get('rail') === 'collapsed';
  const navigate = useNavigate();
  // "Parent who is also a talent" (Figma canvas 12): `?menu=switch` opens the switch-space menu (PD-02), `?career=none` is a parent with no career profile yet (the sidebar card reads "Your own career",
  // PD-04) and `?modal=career-profile` is its "Build your own career profile" dialog.
  const cardRef = useRef(null);
  // Live (signed in, not a frame URL): the parent's own data. Someone signed in who is not a parent goes to their own home.
  const me = useParentMe();
  useEffect(() => {
    if (me.live && me.code === 'NOT_A_PARENT') {
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem(STORAGE_KEYS.userProfile) || 'null');
      } catch {
        user = null;
      }
      log('not a parent: leaving /parent');
      navigate(homePathFor(user), { replace: true });
    }
  }, [me.live, me.code, navigate]);
  const career = me.live
    ? me.data?.parent?.hasCareerProfile
      ? 'talent'
      : 'none'
    : params.get('career') === 'none'
      ? 'none'
      : 'talent';
  const menuOpen = params.get('menu') === 'switch' && career === 'talent';
  const careerDialog = params.get('modal') === 'career-profile';
  // Ask Buddy (Figma canvas 13): `?buddy=open` or a reply-in-progress state (thinking | working | writing | slow | stopped) opens the panel on any parent page.
  const buddyParam = params.get('buddy');
  const buddy = buddyParam === 'open' || PHASE_IDS.includes(buddyParam) ? buddyParam : '';
  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  // The bell opens the notifications panel (PN-01) on any parent page: `?notif=open`.
  const { panelOpen, update: updateNotif } = useNotificationsState();
  const toggleNotif = () => {
    log('bell', panelOpen ? 'close' : 'open');
    updateNotif({ notif: panelOpen ? null : 'open' });
  };

  // Scoped font stack (styles/parent.css): the bundled SF Pro Rounded while a parent screen is mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-parent-ui', '');
    // The bundled SF Pro Rounded (styles/parent.css, `GTH Parent Rounded`) is the Figma font. Only if it fails to load does styles/parent.css bump the Nunito fallback's weights (`data-parent-font="fallback"`).
    document.fonts
      ?.load('600 16px "GTH Parent Rounded"')
      .then((faces) => {
        if (!faces.length) root.setAttribute('data-parent-font', 'fallback');
      })
      .catch(() => root.setAttribute('data-parent-font', 'fallback'));
    return () => {
      root.removeAttribute('data-parent-ui');
      root.removeAttribute('data-parent-font');
    };
  }, []);

  const setRail = (value) => {
    log('rail', value);
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === 'collapsed') next.set('rail', 'collapsed');
        else next.delete('rail');
        return next;
      },
      { replace: true }
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#f8f8f4] max-lg:h-dvh">
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
      </div>
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        <ParentTopBar
          // Live: no counts until the notifications and messages are wired (no invented numbers).
          bell={me.live ? bell || '' : bell}
          messages={me.live ? messages || '' : messages}
          onBell={toggleNotif}
          bellOpen={panelOpen}
          onSwitchSpace={
            career === 'talent' ? () => setParam('menu', menuOpen ? '' : 'switch') : undefined
          }
        />
        {panelOpen ? (
          <NotificationsPanel
            onClose={() => updateNotif({ notif: null })}
            both={params.get('spaces') === 'both'}
          />
        ) : null}
        <div className="flex min-h-0 w-full flex-1">
          {sidebarSlot ||
            (collapsed ? (
              <ParentRailCollapsed
                state={sidebar}
                active={active}
                onExpand={() => setRail('expanded')}
                className={
                  dimSidebar ? 'pointer-events-none opacity-35 max-lg:hidden' : 'max-lg:hidden'
                }
              />
            ) : (
              <ParentSidebar
                state={sidebar}
                active={active}
                onCollapse={() => setRail('collapsed')}
                career={career}
                cardRef={cardRef}
                onSwitch={() => setParam('menu', menuOpen ? '' : 'switch')}
                onBuildCareer={() => setParam('modal', 'career-profile')}
                className={
                  dimSidebar ? 'pointer-events-none opacity-35 max-lg:hidden' : 'max-lg:hidden'
                }
              />
            ))}
          <main
            id="main"
            tabIndex={-1}
            className={
              mainClassName ||
              'min-w-0 flex-1 overflow-y-auto pt-[32px] pr-[clamp(16px,3.24vw,56px)] pb-[40px] pl-[clamp(16px,2.31vw,40px)] outline-none'
            }
          >
            {children}
          </main>
        </div>
      </div>
      {menuOpen && !collapsed ? (
        <SwitchSpaceMenu
          anchorRef={cardRef}
          current="parent"
          onClose={() => setParam('menu', '')}
          onSelect={() => navigate('/home?as=emma')}
        />
      ) : null}
      {careerDialog ? (
        <CareerProfileDialog
          onClose={() => setParam('modal', '')}
          onStart={() => navigate('/home?as=emma&new=welcome')}
        />
      ) : null}
      {buddy ? (
        <ParentBuddyPanel
          phase={buddy}
          onPhase={(next) => setParam('buddy', next)}
          onClose={() => setParam('buddy', '')}
        />
      ) : null}
      <AskBuddyFabButton
        look="focused"
        onClick={() => setParam('buddy', 'open')}
        className="fixed right-[clamp(12px,2.31vw,40px)] bottom-[clamp(16px,1.85vw,32px)] z-40"
      />
    </div>
  );
};

export default ParentFrame;
