import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import StyleDial from './StyleDial.jsx';
import CareerBuddyFirstChat from './CareerBuddyFirstChat.jsx';
import AskBuddyFabButton from '../../ui/AskBuddyFabButton.jsx';

const log = debug('AskBuddyFab');

/*
 * AskBuddyFab — "GTH · Ask Buddy FAB" (Figma 7862:59664; instances 8097:4146 Focused,
 * 7862:59667 Playful). Figma note: bottom-right of every talent dashboard screen, 40px from the
 * right edge, 28px from the bottom of the viewport, fixed while scrolling, opens Ask Buddy.
 * 2026-10-25: the pill with the "Ask Buddy" label is an icon now (Figma 9412:550912): ui/AskBuddyFabButton.jsx, the 72 round robot head with the charge ring and the wake-up nudge.
 * z-40 keeps it under the overlays (z-60); the overlays also make the app root inert.
 *
 * Opening the chat (2026-10-20 fix): the button sets `?new=chat` on the CURRENT page.
 *  - /home renders the chat panel itself (it owns the other `?new=` overlays), so it mounts
 *    <AskBuddyFab home={home} rendersChat />.
 *  - Every other page (jobs, assessment, community, skills lab, streak, notifications, learning)
 *    gets the panel from here. Before this, those pages set `?new=chat` but nothing rendered it,
 *    so the button did nothing off /home.
 * The panel is the same live Career Buddy thread on every page; `?demo=1` / `?state=` keep the
 * scripted Figma conversation.
 */
const AskBuddyFab = ({ home, onClick, rendersChat = false }) => {
  const [params, setParams] = useSearchParams();
  const chatOpen = !rendersChat && params.get('new') === 'chat';

  // Merge a patch into the query string (null removes a key), keeping the page's own params.
  const setNew = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('new', value);
    else next.delete('new');
    setParams(next, { replace: true });
  };

  const handle = () => {
    log('click', { rendersChat });
    if (onClick) onClick();
    else if (rendersChat) home?.update?.({ new: 'chat' });
    else setNew('chat');
  };

  const demo = params.get('demo') === '1' || params.has('state');
  const chatHost = {
    live: !demo && isLoggedIn(),
    update: (patch) => {
      if (patch && 'new' in patch) setNew(patch.new);
    },
  };

  return (
    <>
      {/* Phone-only appearance dial, stacked just above this button */}
      <StyleDial />
      <AskBuddyFabButton
        onClick={handle}
        className="fixed right-[clamp(12px,2.31vw,40px)] bottom-[clamp(16px,1.62vw,28px)] max-md:bottom-[calc(56px+12px+env(safe-area-inset-bottom))] z-40 max-md:[@media(max-height:700px)]:bottom-[calc(56px+8px+env(safe-area-inset-bottom))]"
      />
      {chatOpen && <CareerBuddyFirstChat home={chatHost} />}
    </>
  );
};

export default AskBuddyFab;
