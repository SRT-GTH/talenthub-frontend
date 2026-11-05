import { debug } from '../../../../../utils/debug.js';
import { ServerFeedbackBulbIcon } from '../serverGame/ServerGameIcons.jsx';

const log = debug('CrisisRoomWhy');

/*
 * CrisisRoomWhy — the "why this order" card shown after an alarm is checked (Figma CR-02 "why this order": white, r24 / ink@.55
 * 1.5px + hard 4px shadow in Playful, r18 / #dee5e0 1px in Focused; pad 20, gap 14): the blue "GTH · Game feedback" pill with the
 * bulb, then the explanation. The Figma card is drawn 43px tall with its content overflowing; it is laid out here in flow so the
 * list below never sits under it.
 */
const CrisisRoomWhy = ({ pill, explain }) => {
  log('render', { pill });
  return (
    <section
      aria-live="polite"
      aria-label="Why this order"
      className="flex flex-col gap-[14px] rounded-[18px] border border-solid border-[#dee5e0] bg-white p-[20px] playful:rounded-[24px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_4px_0_rgba(28,42,33,0.45)]"
    >
      <p className="m-0 inline-flex w-fit max-w-full items-center gap-[10px] rounded-full bg-[#e5f0fa] py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold text-[#2966b0] playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)]">
        <span
          aria-hidden="true"
          className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white"
        >
          <ServerFeedbackBulbIcon className="size-[16px]" />
        </span>
        {pill}
      </p>
      <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#1c2a21]">
        {explain}
      </p>
    </section>
  );
};

export default CrisisRoomWhy;
