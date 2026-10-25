import { useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import AgencyDialog from '../../agency/onboarding/AgencyDialog.jsx';
import { AdminClose20Icon, AdminInfoCircleIcon, AdminWarningTileIcon } from '../adminIcons.jsx';
import { ASK_CHANGE } from './data/adminModerationData.js';

/*
 * AskChangeDialog — "Ask Kofi for a change" (Figma 7.2.5c 8956:3610, 680 wide, white, r24, p28, 1px ink, scrim #1c2a21 at 55 %): title 27/32 600 + 40 r10 close ·
 * "What needs to change?" reason pills (the selected one is ink) · "Message to the owner *" textarea (the cover-photo message is pre-filled) + "The owner sees this
 * message word for word." · the #f7f8f4 "After you send" callout · footer "Logged as CR-0412 · asked for a change", Cancel (white) and "Send to owner" (green).
 * Props: onClose, onSend({ reason, message }).
 */

const AskChangeDialog = ({ onClose, onSend }) => {
  const [reason, setReason] = useState(ASK_CHANGE.reasons[0]);
  const [message, setMessage] = useState(ASK_CHANGE.messages[ASK_CHANGE.reasons[0]]);
  const pick = (r) => {
    setReason(r);
    if (ASK_CHANGE.messages[r]) setMessage(ASK_CHANGE.messages[r]);
  };
  const ready = message.trim().length > 0;
  const submit = (e) => {
    e.preventDefault();
    if (ready) onSend({ reason, message });
  };
  return (
    <AgencyDialog
      label={ASK_CHANGE.title}
      onClose={onClose}
      scrimClassName="bg-[#1c2a21]/55"
      panelClassName="w-[min(680px,calc(100vw-32px))]"
    >
      <form
        onSubmit={submit}
        className="flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#1c2a21] bg-white p-[clamp(16px,1.6vw,28px)] shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-start gap-[10px]">
          <h2 className="m-0 min-w-0 flex-1 font-sans text-[27px] leading-[32px] font-semibold text-[#1c2a21]">
            {ASK_CHANGE.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-[40px] shrink-0 cursor-pointer place-items-center rounded-[10px] border border-solid border-[#e6e6e6] bg-white text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <AdminClose20Icon className="size-[20px]" />
          </button>
        </div>
        <fieldset className="m-0 flex flex-col gap-[8px] border-0 p-0">
          <legend className="mb-[8px] p-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
            {ASK_CHANGE.whatLabel}
          </legend>
          <div className="flex flex-wrap gap-[8px]">
            {ASK_CHANGE.reasons.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={reason === r}
                onClick={() => pick(r)}
                className={classNames(
                  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  reason === r
                    ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                    : 'border-[#e1eae2] bg-white text-[#595959]'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-[8px]">
          <label
            htmlFor="ask-change-message"
            className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
          >
            {ASK_CHANGE.messageLabel}
            <span aria-hidden="true" className="text-[#1d7c4d]">
              *
            </span>
          </label>
          <textarea
            id="ask-change-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="min-h-[104px] w-full resize-none rounded-[12px] border border-solid border-[#cccccc] bg-white px-[16px] py-[12px] font-sans text-[14px] leading-[21px] text-[#1c2a21] outline-none focus:border-[#387440]"
          />
          <p className="m-0 flex items-center gap-[6px] font-sans text-[12px] leading-[14px] text-[#737373]">
            <AdminWarningTileIcon className="size-[12px] text-[#387440]" />
            {ASK_CHANGE.seen}
          </p>
        </div>
        <div className="flex items-start gap-[12px] rounded-[12px] border border-solid border-[#1c2a21]/10 bg-[#f7f8f4] px-[16px] py-[14px]">
          <AdminInfoCircleIcon className="mt-[1px] size-[18px] shrink-0 text-[#387440]" />
          <div className="flex flex-col gap-[2px]">
            <p className="m-0 font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {ASK_CHANGE.after.title}
            </p>
            <p className="m-0 font-sans text-[13px] leading-[16px] text-[#1c2a21]">
              {ASK_CHANGE.after.body}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-[10px] pt-[4px]">
          <p className="m-0 mr-auto flex items-center gap-[6px] font-sans text-[12px] leading-[14px] text-[#737373]">
            <AdminWarningTileIcon className="size-[12px] text-[#387440]" />
            {ASK_CHANGE.logged}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[56px] cursor-pointer items-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white px-[34px] font-sans text-[16px] leading-[24px] font-bold text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {ASK_CHANGE.cancel}
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="inline-flex h-[44px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[22px] font-sans text-[16px] leading-[24px] font-bold text-white shadow-[0_4px_0_#2a5730] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {ASK_CHANGE.send}
          </button>
        </div>
      </form>
    </AgencyDialog>
  );
};

export default AskChangeDialog;
