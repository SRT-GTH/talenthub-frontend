import { debug } from '../../../utils/debug.js';
import AskBuddyFabButton from '../../ui/AskBuddyFabButton.jsx';
import ParentSidebar from './ParentSidebar.jsx';
import ParentTopBar from './ParentTopBar.jsx';
import bgGrid from '../../../assets/community/bg-grid.png';

const log = debug('ParentFrame');

/*
 * ParentFrame — the signed-in parent chrome (Figma "Parent · 01 Home and dashboard" 10057:530): the talent dashboard layout with parent content. Fixed viewport: top bar + sidebar are chrome, only the
 * main column scrolls. Background #f8f8f4 with the grid texture at 70%. The Ask Buddy icon sits bottom-right (Figma "GTH · Ask Buddy FAB · Parent": Focused only, pinned, hidden text = aria-label).
 * Props: sidebar ('none' | 'linked' | 'caughtUp' | 'skeleton' (children draw it)), sidebarSlot (replaces the sidebar, e.g. the loading skeleton), bell, messages, mainClassName, children.
 * ⚠️ ASSUMPTION: under 1024px the sidebar is hidden (Figma draws only the 1728 desktop frame); the Ask Buddy icon only logs (no parent Buddy panel is drawn).
 */
const ParentFrame = ({
  sidebar = 'linked',
  sidebarSlot,
  active = 'home',
  bell,
  messages,
  mainClassName,
  children,
}) => (
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
        {sidebarSlot || <ParentSidebar state={sidebar} active={active} className="max-lg:hidden" />}
        <main
          id="main"
          tabIndex={-1}
          className={
            mainClassName ||
            'min-w-0 flex-1 overflow-y-auto px-[clamp(16px,1.85vw,32px)] pt-[32px] pb-[40px] outline-none'
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

export default ParentFrame;
