import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotWrong from '../../../../assets/parent/spot-something-went-wrong.svg';
import warning from '../../../../assets/parent/2-0-warning.svg';

const log = debug('ParentHomeError');

/*
 * ParentHomeError — PD-06 "Parent home · Couldn't load (error)" (Figma 10047:148153): "Good evening, Emma" 34/600, the error card (r24, p44, gap 14: 104 spot, "We couldn't load your wards" 24/600,
 * 14 / 1.45 #575755 copy 560 wide, "Try again" + "Open Help") and the amber offline note ("You're offline. Last updated today at 09:12.").
 * Props: onRetry() (Try again). ⚠️ ASSUMPTION: "Open Help" only logs (Help and guides is not drawn); the offline note is always shown, as drawn.
 */
const ParentHomeError = ({ onRetry }) => (
  <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
    <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] text-[#1c2a21] max-sm:text-[28px]">
      Good evening, Emma
    </h1>
    <div className="flex flex-col gap-[20px]">
      <section
        aria-label="Couldn't load your wards"
        className="flex flex-col items-center gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(24px,2.55vw,44px)] shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
      >
        <img src={spotWrong} alt="" draggable="false" className="size-[104px]" />
        <h2 className="m-0 text-center font-sans text-[24px] leading-[normal] font-semibold text-[#1c2a21]">
          We couldn’t load your wards
        </h2>
        <p className="m-0 w-full max-w-[560px] text-center font-sans text-[14px] leading-[1.45] text-[#575755]">
          Check your internet and try again. Anything waiting for your OK is safe, and we’ll still
          message you on WhatsApp.
        </p>
        <div className="flex flex-wrap items-start justify-center gap-[12px]">
          <ParentButton
            onClick={() => {
              log('try again');
              onRetry?.();
            }}
          >
            Try again
          </ParentButton>
          <ParentButton variant="secondary" to="/parent/help" onClick={() => log('open help')}>
            Open Help
          </ParentButton>
        </div>
      </section>
      <div
        role="status"
        className="flex items-center gap-[10px] rounded-[16px] bg-[#faf4e8] p-[16px] font-sans text-[13px] leading-[normal] font-medium text-[#1c2a21]"
      >
        <img src={warning} alt="" className="size-[18px] shrink-0" />
        You’re offline. Last updated today at 09:12.
      </div>
    </div>
  </div>
);

export default ParentHomeError;
