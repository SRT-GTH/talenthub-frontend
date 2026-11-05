import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import Modal from '../../ui/Modal.jsx';
import Textarea from '../../ui/form/Textarea.jsx';
import { dashIcons } from './recruiterDashboardIcons.js';
import { INVITE_DIALOG } from './recruiterDashboardData.js';

/*
 * InviteDialog — "Invite Akua Mensah to apply" (Figma 10182:52049, D31): a 560px card on `ui/Modal` with a 44px tile, a Bricolage 24/600 title,
 * the talent summary, the Role field, a Message textarea (500 characters, prefilled), the channels it goes out on, the daily limit and Cancel / Send invite.
 * ⚠️ ASSUMPTION: the Role is read-only (one role is drawn, no dropdown frame exists) and the summary line under the title is Figma's fixed Akua copy.
 * Props: talent { name, initials, bg, color }, onCancel, onConfirm({ message }).
 */
export const InviteDialog = ({ talent, onCancel, onConfirm }) => {
  const [message, setMessage] = useState(INVITE_DIALOG.message);
  return (
    <Modal
      isOpen
      onClose={onCancel}
      size="sm"
      ariaLabel={INVITE_DIALOG.title(talent.name)}
      showClose={false}
      className="!bg-[#0b1a0f]/45 !backdrop-blur-none"
      contentClassName="!max-w-[560px] !rounded-[24px] p-[24px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_rgba(15,15,10,0.12)] max-sm:p-[20px]"
    >
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start gap-[12px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec]">
            <img
              src={dashIcons.inviteDialogTileSend}
              alt=""
              aria-hidden="true"
              className="size-[22px]"
            />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
            <h2 className="m-0 font-['Bricolage_Grotesque',sans-serif] text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
              {INVITE_DIALOG.title(talent.name)}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[24px] text-[#575755]">
              {INVITE_DIALOG.body}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="flex size-[32px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-0 bg-[#fffefc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <img src={dashIcons.dialogCloseX} alt="" aria-hidden="true" className="size-[16px]" />
          </button>
        </div>

        <div className="flex flex-col gap-[14px]">
          <div className="flex items-center gap-[12px] rounded-[10px] bg-[#fffefc] p-[10px]">
            <span
              aria-hidden="true"
              className="flex size-[36px] shrink-0 items-center justify-center rounded-full font-sans text-[12px] leading-[20px] font-semibold"
              style={{ background: talent.bg, color: talent.color }}
            >
              {talent.initials}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-sans text-[14px] leading-[24px] font-semibold text-[#111]">
                {talent.name}
              </span>
              <span className="font-sans text-[12px] leading-[20px] text-[#575755]">
                {INVITE_DIALOG.candidate}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-[8px]">
            <span className="font-sans text-[14px] leading-[24px] font-medium tracking-[0.2px] text-[#111]">
              {INVITE_DIALOG.roleLabel}
              <span className="ml-[3px] font-semibold text-[#2e8b57]">*</span>
            </span>
            <div className="flex min-h-[46px] items-center gap-[10px] rounded-[10px] border border-solid border-[#dbded9] bg-[#fffefc] px-[14px] font-sans text-[14px] leading-[24px] text-[#111]">
              <img
                src={dashIcons.inviteRoleFieldBriefcase}
                alt=""
                aria-hidden="true"
                className="size-[14px]"
              />
              {INVITE_DIALOG.role}
            </div>
          </div>

          <Textarea
            label={INVITE_DIALOG.messageLabel}
            required
            optional
            maxLength={500}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />

          <div className="flex flex-wrap items-center gap-[8px]">
            <span className="font-sans text-[12px] leading-[20px] text-[#575755]">
              {INVITE_DIALOG.channelsLabel}
            </span>
            {INVITE_DIALOG.channels.map((channel) => (
              <span
                key={channel}
                className="inline-flex items-center gap-[4px] rounded-full bg-[#ebf1ec] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium text-[#2a5730]"
              >
                <img
                  src={dashIcons.inviteChannelCheck}
                  alt=""
                  aria-hidden="true"
                  className="size-[12px]"
                />
                {channel}
              </span>
            ))}
          </div>
          <p className="m-0 flex items-center gap-[6px] font-sans text-[12px] leading-[20px] text-[#575755]">
            <img
              src={dashIcons.inviteDailyLimitInfo}
              alt=""
              aria-hidden="true"
              className="size-[14px]"
            />
            {INVITE_DIALOG.limit}
          </p>
        </div>

        <div className="flex justify-end gap-[12px]">
          <Button variant="tertiary" onClick={onCancel}>
            {INVITE_DIALOG.cancel}
          </Button>
          <Button variant="primary" onClick={() => onConfirm({ message })}>
            <img
              src={dashIcons.inviteDialogConfirmSend}
              alt=""
              aria-hidden="true"
              className="size-[16px]"
            />
            {INVITE_DIALOG.confirm}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
