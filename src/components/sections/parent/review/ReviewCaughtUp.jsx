import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotCaughtUp from '../../../../assets/parent/spot-caught-up.svg';
import { CAUGHT_UP } from './data/reviewData.js';

const log = debug('ReviewCaughtUp');

/*
 * ReviewCaughtUp — PR-05 "To review · All caught up" (Figma 10033:6439, card 10033:7048): white, r24, #e7e7e7 hairline, soft shadow, p48, gap16, centred: Spot · Caught up 96, 26/600 title (-0.13),
 * 15 #575755 body (max 442), then "Back to Home" (secondary) → /parent.
 */
const ReviewCaughtUp = () => {
  log('render');
  return (
    <section
      aria-label="All caught up"
      className="flex flex-col items-center gap-[16px] rounded-[24px] border border-solid border-black-light bg-white p-[clamp(24px,2.8vw,48px)] text-center font-sans shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
    >
      <img src={spotCaughtUp} alt="" aria-hidden="true" className="size-[96px] shrink-0" />
      <h2 className="m-0 text-[26px] leading-[32px] font-semibold tracking-[-0.13px] text-[#1c2a21]">
        {CAUGHT_UP.title}
      </h2>
      <p className="m-0 max-w-[442px] text-[15px] leading-[18px] text-[#575755]">
        {CAUGHT_UP.body}
      </p>
      <ParentButton variant="secondary" to="/parent" className="mt-[2px]">
        {CAUGHT_UP.home}
      </ParentButton>
    </section>
  );
};

export default ReviewCaughtUp;
