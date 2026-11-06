import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import lockIconAmber from '../../../../assets/recruiter/community/network-icon-lock-amber.svg';
import sparklesIconGreen from '../../../../assets/recruiter/community/network-icon-sparkles-green.svg';
import Modal from '../../../ui/Modal.jsx';
import CircleButton from './CircleButton.jsx';
import { NETWORK_RESTRICTIONS } from './recruiterCircleData.js';

const log = debug('NetworkRestrictionDialog');

/*
 * NetworkRestrictionDialog — Figma `Modal · Recruiters can't endorse skills` (RC-NW07, 10194:34899) and `… write recommendations`
 * (RC-NW08): the "recruiter alternative" of the talent Endorse / Recommend dialogs. 520px white card r24, p32, gap 16, scrim #1c2a21 @55%:
 * a 56px #faf4e8 lock tile, a centred Bricolage 28/34 title, the 14/24 reason, a "What you can do instead" banner (#ebf1ec @50%, r10) and
 * two buttons: "Save to list" (white, 30% ink border) + "Invite to apply" (primary). Built on ui/Modal (focus containment, Esc, scrim, scroll lock).
 * Props: kind ('endorse' | 'recommend'), person (circle person), onSaveToList(), onInviteToApply(), onClose().
 * ⚠️ ASSUMPTION: "Save to list" / "Invite to apply" have no destination drawn: the caller shows a toast (no backend / list picker yet).
 */
const NetworkRestrictionDialog = ({ kind, person, onSaveToList, onInviteToApply, onClose }) => {
  useEffect(() => {
    log('mount', { kind, person: person.id });
  }, [kind, person.id]);
  const copy = NETWORK_RESTRICTIONS;
  const title = copy[kind].title;
  const reason =
    typeof copy[kind].body === 'function' ? copy[kind].body(person.firstName) : copy[kind].body;
  return (
    <Modal
      isOpen
      onClose={onClose}
      size="sm"
      ariaLabel={title}
      showClose={false}
      scrollHint={false}
      initialFocus="dialog"
      className="!bg-[#1c2a21]/55 !backdrop-blur-none"
      contentClassName="!max-w-[520px] !rounded-[24px] p-[32px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.1)] max-sm:!rounded-b-none max-sm:p-[20px]"
    >
      <div className="flex flex-col items-center gap-[16px]">
        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[10px] bg-[#faf4e8]">
          <img src={lockIconAmber} alt="" draggable="false" className="size-[28px]" />
        </span>
        <h2 className="m-0 text-center font-heading text-[clamp(22px,1.62vw,28px)] font-semibold leading-[1.21] tracking-[-0.56px] text-[#111]">
          {title}
        </h2>
        <div className="flex w-full flex-col gap-[12px]">
          <p className="m-0 text-center font-sans text-[14px] leading-[24px] tracking-[0.2px] text-[#575755]">
            {reason}
          </p>
          <div className="flex gap-[12px] rounded-[10px] bg-[#ebf1ec]/50 p-[16px]">
            <img
              src={sparklesIconGreen}
              alt=""
              draggable="false"
              className="mt-[2px] size-[20px] shrink-0 self-start"
            />
            <div className="flex min-w-0 flex-col gap-[2px]">
              <h3 className="m-0 font-sans text-[14px] font-semibold leading-[24px] tracking-[0.1px] text-[#111]">
                {copy.insteadTitle}
              </h3>
              <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755] max-lg:text-[13px]">
                {copy.insteadBody(person.firstName)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-[12px]">
          <button
            type="button"
            onClick={onSaveToList}
            className="inline-flex min-h-[48px] shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[32px] py-[10px] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(28,42,33,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] max-lg:text-[14px]"
          >
            {copy.saveToList}
          </button>
          <CircleButton onClick={onInviteToApply}>{copy.inviteToApply}</CircleButton>
        </div>
      </div>
    </Modal>
  );
};

export default NetworkRestrictionDialog;
