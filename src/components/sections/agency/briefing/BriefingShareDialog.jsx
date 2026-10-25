import { useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import {
  ShareIconCopy,
  ShareIconImage,
  ShareIconLink,
  ShareIconMail,
  ShareIconMessage,
} from '../../publicData/share/shareIcons.jsx';
import SharePreviewCard from '../../publicData/share/SharePreviewCard.jsx';
import { BRIEFING_SHARE as D } from './data/briefingData.js';

/*
 * BriefingShareDialog — Figma 11.4.4c "Share with a colleague" (8605:405419): preview card, link row + "Copy link", the five tiles as drawn
 * (Copy link · Email · Email · Teams · Copy as image), optional message (n / 280), footer "Filters included: none · MoU view · access logged" + Done.
 * ⚠️ Figma draws "Email" twice (kept as drawn). Teams / second Email / Copy as image open nothing (no integration): they copy the link too.
 * Props: onCopy(), onClose().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const ICONS = {
  copy: ShareIconCopy,
  email: ShareIconMail,
  'email-2': ShareIconMail,
  teams: ShareIconMessage,
  image: ShareIconImage,
};

const BriefingShareDialog = ({ onCopy, onClose }) => {
  const [message, setMessage] = useState(D.message);
  const messageId = useId();
  const counterId = `${messageId}-count`;

  return (
    <ShareDialogShell
      title="Share with a colleague"
      description="Only people in your agency with GTH access can open this link. MoU data never goes to a public link."
      onClose={onClose}
      width={600}
      footer={
        <>
          <p className="m-0 mr-auto font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            {D.footer}
          </p>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={onClose}
            className={TERTIARY_BUTTON}
          >
            Done
          </Button>
        </>
      }
    >
      <SharePreviewCard
        width={504}
        className="max-w-full"
        title={D.card.title}
        headline={D.card.headline}
        sub={D.card.sub}
      />
      <div className="flex items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f2f2ee] py-[10px] pr-[14px] pl-[14px]">
        <ShareIconLink className="size-[18px] shrink-0 text-[#70706e]" />
        <p
          className="m-0 min-w-0 flex-1 truncate font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
          title={D.url}
        >
          {D.url}
        </p>
        <Button
          type="button"
          variant="primary"
          size="sm"
          className={PRIMARY_BUTTON}
          onClick={onCopy}
        >
          Copy link
        </Button>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 gap-[12px] p-0 sm:grid-cols-4 sm:gap-[19px]">
        {D.channels.map((channel) => {
          const Icon = ICONS[channel.id];
          return (
            <li key={channel.id} className="flex">
              <button
                type="button"
                onClick={onCopy}
                className={classNames(
                  'flex min-h-[70px] w-full cursor-pointer flex-col items-center gap-[6px] rounded-[14px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[12px] hover:bg-[#f8f8f4]',
                  FOCUS
                )}
              >
                <Icon className="size-[22px] text-[#387440]" />
                <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
                  {channel.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={messageId}
          className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]"
        >
          Add a message (optional)
        </label>
        <div className="rounded-[12px] border border-solid border-[#e7e7e7] px-[14px] py-[12px] focus-within:border-[#387440]">
          <textarea
            id={messageId}
            value={message}
            maxLength={D.messageMax}
            rows={3}
            aria-describedby={counterId}
            onChange={(event) => setMessage(event.target.value)}
            className="block h-[58px] w-full resize-none border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] outline-none"
          />
        </div>
        <p
          id={counterId}
          className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]"
        >
          {message.length} / {D.messageMax}
        </p>
      </div>
    </ShareDialogShell>
  );
};

export default BriefingShareDialog;
