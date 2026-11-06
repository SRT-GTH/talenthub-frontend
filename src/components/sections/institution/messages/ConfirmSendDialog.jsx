import { useId } from 'react';
import Button from '../../../ui/Button.jsx';
import AgencyDialogShell from '../../agency/queries/AgencyDialogShell.jsx';
import { InstitutionArrowRightIcon } from '../institutionIcons.jsx';
import { confirmSentence } from './data/messagesData.js';

/*
 * ConfirmSendDialog — "Send to 64 students?" (Figma 11.3.3b 8595:389920 "div.vid-card": 528 wide, white, r24, p 64/48, on a #1c2a21 scrim at 70 %):
 *   title 32/40 600 centred · sentence 16/24 #575755 centred · "Send message →" (green, 44 high) + "Cancel" (white, 2px) centred.
 * Live: the counts are the chosen group's (students on the roster, those who can get it in GTH now, guardians copied). With a send time the title
 * reads "Schedule for …?" and the button "Schedule message".
 * Role alertdialog (the send cannot be undone): focus starts on Cancel, Esc = cancel, Tab trapped, focus returns to the opener.
 * Props: group ({students, reachable, guardians, who}), scheduleLabel (or null), busy, error, onSend(), onCancel().
 */

const ConfirmSendDialog = ({
  group,
  scheduleLabel = null,
  busy = false,
  error = '',
  onSend,
  onCancel,
}) => {
  const descId = useId();
  const title = scheduleLabel
    ? `Schedule for ${scheduleLabel}?`
    : `Send to ${group.students} ${group.students === 1 ? 'student' : 'students'}?`;
  return (
    <AgencyDialogShell
      title={title}
      onClose={onCancel}
      scrim="bg-[#1c2a21]/70"
      role="alertdialog"
      describedBy={descId}
      className="mx-auto max-w-[528px]"
    >
      <div className="flex flex-col gap-[36px] rounded-[24px] bg-white px-[clamp(20px,2.8vw,48px)] py-[clamp(32px,3.7vw,64px)] text-center shadow-[0_4px_0_rgba(0,0,0,0),0_40px_100px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-[10px]">
          <h2 className="m-0 font-sans text-[26px] leading-[34px] font-semibold tracking-[-0.16px] text-[#1c2a21] md:text-[32px] md:leading-[40px]">
            {title}
          </h2>
          <p id={descId} className="m-0 font-sans text-[16px] leading-[24px] text-[#575755]">
            {confirmSentence(group)}
          </p>
          {error ? (
            <p role="alert" className="m-0 font-sans text-[14px] leading-[20px] text-[#902b20]">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-center gap-[8px]">
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={busy}
            className="!px-[18px] !py-[10px] !text-[14px] !font-semibold"
            rightIcon={<InstitutionArrowRightIcon className="size-[20px]" />}
            onClick={onSend}
          >
            {busy ? 'Sending…' : scheduleLabel ? 'Schedule message' : 'Send message'}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            data-autofocus=""
            className="!rounded-[14px] !px-[18px] !py-[10px] !text-[14px] !font-semibold"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </AgencyDialogShell>
  );
};

export default ConfirmSendDialog;
