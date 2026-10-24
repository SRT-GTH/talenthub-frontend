import { useId, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from './shareButtonClasses.js';
import ShareDialogShell from './ShareDialogShell.jsx';
import SharePreviewCard from './SharePreviewCard.jsx';
import {
  ShareIconCopy,
  ShareIconLink,
  ShareIconMail,
  ShareIconMessage,
  ShareIconShare,
} from './shareIcons.jsx';
import { SHARE_CHANNELS, SHARE_DEFAULT_MESSAGE, SHARE_MESSAGE_MAX } from './data/shareData.js';
import { displayUrl } from './shareUrl.js';

/*
 * ShareMainDialog — Figma 8.1.2a "Share this page" (8500:205): preview card · link row with "Copy link" · four channel tiles · optional
 * message (0 / 280) · footer "Filters included: …" + Done.
 * Props: url (full link), summary (footer text after "Filters included: "), card ({ title, headline, sub }), onCopy(), onChannel(id, message),
 *        onClose().
 * ⚠️ ASSUMPTION: the message box starts with the sample note drawn in Figma and is editable; the message travels with Email / WhatsApp / X.
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const CHANNEL_ICONS = {
  copy: ShareIconCopy,
  email: ShareIconMail,
  whatsapp: ShareIconMessage,
  x: ShareIconShare,
};

const ShareMainDialog = ({ url, summary, card, onCopy, onChannel, onClose }) => {
  const [message, setMessage] = useState(SHARE_DEFAULT_MESSAGE);
  const messageId = useId();
  const counterId = `${messageId}-count`;

  return (
    <ShareDialogShell
      title="Share this page"
      description="Anyone with the link sees exactly this view, with the same filters. No sign-in needed."
      onClose={onClose}
      width={600}
      footer={
        <>
          <p className="m-0 mr-auto font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
            Filters included: {summary}
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
      <SharePreviewCard width={504} className="max-w-full" {...card} />
      <div className="flex items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f2f2ee] py-[10px] pr-[14px] pl-[14px]">
        <ShareIconLink className="size-[18px] shrink-0 text-[#70706e]" />
        <p
          className="m-0 min-w-0 flex-1 truncate font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
          title={url}
        >
          {displayUrl(url)}
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
        {SHARE_CHANNELS.map((channel) => {
          const Icon = CHANNEL_ICONS[channel.id];
          return (
            <li key={channel.id} className="flex">
              <button
                type="button"
                onClick={() => (channel.id === 'copy' ? onCopy() : onChannel(channel.id, message))}
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
            maxLength={SHARE_MESSAGE_MAX}
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
          {message.length} / {SHARE_MESSAGE_MAX}
        </p>
      </div>
    </ShareDialogShell>
  );
};

export default ShareMainDialog;
