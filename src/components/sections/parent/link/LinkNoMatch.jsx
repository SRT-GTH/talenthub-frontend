import { debug } from '../../../../utils/debug.js';
import ParentButton from '../ParentButton.jsx';
import spotSearch from '../../../../assets/parent/spot-search.svg';
import { NO_MATCH_COPY, dobSentence } from './data/linkWardData.js';

const log = debug('LinkNoMatch');

/*
 * LinkNoMatch — the "No match yet" block (Figma "empty" 10052:3004): #f8f8f4, r16, p24, gap10, centred; Spot · Search 72, 15/600 sentence, 12.5/18 #575755 body (max 520), then
 * "Invite by SMS" (primary) + "I have a link code" (secondary) side by side.
 * Props: name, dob (digits), onInvite, onHaveCode.
 * ⚠️ ASSUMPTION: Figma draws no screen for "Invite by SMS", so it only logs.
 */
const LinkNoMatch = ({ name, dob, onInvite, onHaveCode }) => (
  <div className="flex flex-col items-center gap-[10px] rounded-[16px] bg-neutral p-[24px] text-center font-sans">
    <img src={spotSearch} alt="" aria-hidden="true" className="size-[72px] shrink-0" />
    <p className="m-0 text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
      {NO_MATCH_COPY.title(name, dobSentence(dob))}
    </p>
    <p className="m-0 max-w-[520px] text-[12.5px] leading-[18px] font-normal text-neutral-darker">
      {NO_MATCH_COPY.body}
    </p>
    <div className="flex flex-wrap items-center justify-center gap-[10px] pt-[6px]">
      <ParentButton
        onClick={() => {
          log('invite by SMS (no screen drawn)');
          onInvite?.();
        }}
      >
        {NO_MATCH_COPY.invite}
      </ParentButton>
      <ParentButton
        variant="secondary"
        onClick={() => {
          log('have a link code');
          onHaveCode?.();
        }}
      >
        {NO_MATCH_COPY.haveCode}
      </ParentButton>
    </div>
  </div>
);

export default LinkNoMatch;
