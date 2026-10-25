import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { AgencySparklesIcon } from './agencyIcons.jsx';
import fabBuddy from '../../../assets/talent-home/career-buddy-robot.png';

const log = debug('AgencyBuddyFab');

/*
 * AgencyBuddyFab — the Ask Buddy launcher of the agency chrome.
 *   >= lg : pill "Ask Buddy · FAB" (Figma 8795:435377): 163 x 72, gradient 142deg #2a5730 → #498b52, buddy image 44 + "Ask Buddy" 15/600,
 *           24px from the right and 16px from the bottom, shadow 0 8 22
 *   < lg  : "DB/Assistant FAB" (Figma 8613:430 / 8707:427539): 64 round gradient button, 4px white ring, sparkles icon 28, 16px from the edges
 * ⚠️ ASSUMPTION: Figma draws no Ask Buddy panel for agencies; the launcher opens the existing Career Buddy page.
 */

const AgencyBuddyFab = () => {
  const navigate = useNavigate();
  const open = () => {
    log('open Career Buddy');
    navigate('/profile/filling/career-buddy');
  };
  return (
    <>
      <button
        type="button"
        onClick={open}
        className="fixed right-[24px] bottom-[16px] z-40 hidden cursor-pointer items-center gap-[9px] overflow-hidden rounded-[99px] border-0 bg-[linear-gradient(142.43deg,#2a5730_13.139%,#498b52_86.131%)] py-[14px] pr-[20px] pl-[18px] font-sans text-[15px] leading-[18px] font-semibold text-white shadow-[0_8px_22px_rgba(41,71,46,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] lg:flex"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none relative size-[44px] shrink-0 overflow-hidden"
        >
          <img
            src={fabBuddy}
            alt=""
            className="absolute top-[-12.75%] left-[-9.93%] h-[117.89%] w-[129.76%] max-w-none"
          />
        </span>
        <span className="whitespace-nowrap">Ask Buddy</span>
      </button>
      <button
        type="button"
        onClick={open}
        aria-label="Ask Buddy"
        className="fixed right-[16px] bottom-[16px] z-40 flex size-[64px] cursor-pointer items-center justify-center rounded-full border-4 border-solid border-white bg-[linear-gradient(142.43deg,#2a5730_13.139%,#498b52_86.131%)] text-white shadow-[0_2px_4px_rgba(15,15,10,0.12),0_12px_28px_-6px_rgba(15,15,10,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] lg:hidden"
      >
        <AgencySparklesIcon className="size-[28px]" />
      </button>
    </>
  );
};

export default AgencyBuddyFab;
