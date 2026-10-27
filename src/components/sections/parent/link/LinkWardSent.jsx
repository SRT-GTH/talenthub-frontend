import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotSent from '../../../../assets/parent/spot-sent.svg';
import { SENT_COPY } from './data/linkWardData.js';

const log = debug('LinkWardSent');

/*
 * LinkWardSent — PW-08 "Request sent to Kwesi" (Figma 10034:142187, card 10034:142764): white, r24, #e7e7e7 hairline, soft shadow, p44, gap16, centred; Spot · Sent 96, 26/600 title, 15/400 #575755 body (max 620),
 * the "Pending link · expires in 14 days" chip, then "Back to My wards" (primary) + "Cancel request" (secondary).
 * Props: onCancel. "Back to My wards" goes to /parent/wards (the My wards page is built in its own session).
 * ⚠️ ASSUMPTION: "Cancel request" returns to the search form (Figma draws no cancelled state).
 */
const LinkWardSent = ({ onCancel }) => (
  <section
    aria-label="Link request sent"
    className="flex flex-col items-center gap-[16px] rounded-[24px] border border-solid border-black-light bg-white p-[clamp(24px,2.55vw,44px)] text-center font-sans shadow-[0_5px_17px_rgba(28,42,33,0.03)]"
  >
    <img src={spotSent} alt="" aria-hidden="true" className="size-[96px] shrink-0" />
    <h2 className="m-0 text-[26px] leading-[32px] font-semibold tracking-[-0.13px] text-[#1c2a21]">
      {SENT_COPY.title}
    </h2>
    <p className="m-0 max-w-[620px] text-[15px] leading-[18px] font-normal text-neutral-darker">
      {SENT_COPY.body}
    </p>
    <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-brand-green-light-hover bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
      {SENT_COPY.chip}
    </span>
    <div className="flex flex-wrap items-center justify-center gap-[12px] pt-[4px]">
      <ParentButton to="/parent/wards" onClick={() => log('back to My wards')}>
        {SENT_COPY.back}
      </ParentButton>
      <ParentButton
        variant="secondary"
        onClick={() => {
          log('cancel request');
          onCancel?.();
        }}
      >
        {SENT_COPY.cancel}
      </ParentButton>
    </div>
  </section>
);

export default LinkWardSent;
