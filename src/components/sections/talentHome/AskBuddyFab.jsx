import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import StyleDial from './StyleDial.jsx';
import CareerBuddyFirstChat from './CareerBuddyFirstChat.jsx';
import fabBuddy from '../../../assets/talent-home/career-buddy-robot.png';

const log = debug('AskBuddyFab');

/*
 * AskBuddyFab — "GTH · Ask Buddy FAB" (Figma 7862:59664; instances 8097:4146 Focused,
 * 7862:59667 Playful). Figma note: bottom-right of every talent dashboard screen, 40px from the
 * right edge, 28px from the bottom of the viewport, fixed while scrolling, opens Ask Buddy.
 * Shadow differs by style: Focused 0 5 15 rgba(41,71,46,.17), Playful 0 8 22 rgba(41,71,46,.34).
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
      <button
        type="button"
        onClick={handle}
        className="fixed leading-[normal] right-[clamp(12px,2.31vw,40px)] bottom-[clamp(16px,1.62vw,28px)] max-md:bottom-[calc(56px+12px+env(safe-area-inset-bottom))] z-40 flex cursor-pointer items-center gap-[9px] overflow-hidden rounded-[99px] border-0 bg-[linear-gradient(142.43deg,#2a5730_13.139%,#498b52_86.131%)] py-[14px] pr-[20px] pl-[18px] text-[15px] font-semibold text-white max-md:gap-[8px] max-md:py-[8px] max-md:pr-[18px] max-md:pl-[12px] max-md:text-[14px] max-md:[@media(max-height:700px)]:bottom-[calc(56px+8px+env(safe-area-inset-bottom))] max-md:[@media(max-height:700px)]:py-[5px] max-md:[@media(max-height:700px)]:pr-[16px] max-md:[@media(max-height:700px)]:text-[13px] shadow-[0_5px_15px_rgba(41,71,46,0.17)] playful:shadow-[0_8px_22px_rgba(41,71,46,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
      >
        <span className="pointer-events-none relative size-[44.095px] max-md:size-[38px] max-md:[@media(max-height:700px)]:size-[32px] shrink-0 overflow-hidden">
          <img
            src={fabBuddy}
            alt=""
            aria-hidden="true"
            className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
          />
        </span>
        <span className="whitespace-nowrap">Ask Buddy</span>
      </button>
      {chatOpen && <CareerBuddyFirstChat home={chatHost} />}
    </>
  );
};

export default AskBuddyFab;
