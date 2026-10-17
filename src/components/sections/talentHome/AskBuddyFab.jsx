import { debug } from '../../../utils/debug.js';
import fabBuddy from '../../../assets/talent-home/career-buddy-robot.png';

const log = debug('AskBuddyFab');

/*
 * AskBuddyFab — "GTH · Ask Buddy FAB" (Figma 7862:59664; instances 8097:4146 Focused,
 * 7862:59667 Playful). Figma note: bottom-right of every talent dashboard screen, 40px from the
 * right edge, 28px from the bottom of the viewport, fixed while scrolling, opens Ask Buddy.
 * Shadow differs by style: Focused 0 5 15 rgba(41,71,46,.17), Playful 0 8 22 rgba(41,71,46,.34).
 * Mount once in the talent home page: <AskBuddyFab home={home} /> (opens ?new=chat).
 * z-40 keeps it under the overlays (z-60); the overlays also make the app root inert.
 */
const AskBuddyFab = ({ home, onClick }) => {
  const handle = () => {
    log('click');
    if (onClick) onClick();
    else home?.update?.({ new: 'chat' });
  };

  return (
    <button
      type="button"
      onClick={handle}
      className="fixed leading-[normal] right-[clamp(12px,2.31vw,40px)] bottom-[clamp(16px,1.62vw,28px)] z-40 flex cursor-pointer items-center gap-[9px] overflow-hidden rounded-[99px] border-0 bg-[linear-gradient(142.43deg,#2a5730_13.139%,#498b52_86.131%)] py-[14px] pr-[20px] pl-[18px] text-[15px] font-semibold text-white shadow-[0_5px_15px_rgba(41,71,46,0.17)] playful:shadow-[0_8px_22px_rgba(41,71,46,0.34)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <span className="pointer-events-none relative size-[44.095px] shrink-0 overflow-hidden">
        <img
          src={fabBuddy}
          alt=""
          aria-hidden="true"
          className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
        />
      </span>
      <span className="whitespace-nowrap">Ask Buddy</span>
    </button>
  );
};

export default AskBuddyFab;
