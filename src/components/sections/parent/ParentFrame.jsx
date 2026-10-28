import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import AskBuddyFabButton from '../../ui/AskBuddyFabButton.jsx';
import ParentRailCollapsed from './ParentRailCollapsed.jsx';
import ParentSidebar from './ParentSidebar.jsx';
import ParentTopBar from './ParentTopBar.jsx';
import bgGrid from '../../../assets/community/bg-grid.png';

const log = debug('ParentFrame');

const ParentFrame = ({
  sidebar = 'linked',
  sidebarSlot,
  active = 'home',
  bell,
  messages,
  mainClassName,
  children,
}) => {
  const [params, setParams] = useSearchParams();
  const collapsed = params.get('rail') === 'collapsed';

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
        <ParentTopBar bell={bell} messages={messages} />
        <div className="flex min-h-0 w-full flex-1">
          {sidebarSlot ||
            (collapsed ? (
              <ParentRailCollapsed
                state={sidebar}
                active={active}
                onExpand={() => setRail('expanded')}
                className="max-lg:hidden"
              />
            ) : (
              <ParentSidebar
                state={sidebar}
                active={active}
                onCollapse={() => setRail('collapsed')}
                className="max-lg:hidden"
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
      <AskBuddyFabButton
        look="focused"
        onClick={() => log('Ask Buddy (no parent panel drawn)')}
        className="fixed right-[clamp(12px,2.31vw,40px)] bottom-[clamp(16px,1.85vw,32px)] z-40"
      />
    </div>
  );
};

export default ParentFrame;
