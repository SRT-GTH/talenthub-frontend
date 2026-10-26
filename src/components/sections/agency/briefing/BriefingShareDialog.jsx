import { useEffect, useId, useState } from 'react';
import { agencyHome } from '../../../../services/agency.api.js';
import { formatCount } from '../agencyFormat.js';
import { useAgencySession } from '../useAgencySession.js';
import { classNames } from '../../../../utils/classNames.js';
import Button from '../../../ui/Button.jsx';
import { PRIMARY_BUTTON, TERTIARY_BUTTON } from '../../publicData/share/shareButtonClasses.js';
import ShareDialogShell from '../../publicData/share/ShareDialogShell.jsx';
import {
  ShareIconCopy,
  ShareIconLink,
  ShareIconMail,
  ShareIconMessage,
} from '../../publicData/share/shareIcons.jsx';
import SharePreviewCard from '../../publicData/share/SharePreviewCard.jsx';
import { BRIEFING_SHARE as D } from './data/briefingData.js';

/*
 * BriefingShareDialog — Figma 11.4.4c "Share with a colleague" (8605:405419): preview card, link row + "Copy link", the five tiles as drawn
 * (Copy link · Email · Teams), optional message (n / 280), footer + Done. The link is the page being shared (without the dialog keys); the card
 * carries the live national total (GET /agency/home). Copy link / Teams copy the link (and the message) to the clipboard; Email opens the
 * reader's own mail app with the link — nothing is sent by GTH. Props: onCopy(), onClose().
 */

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const ICONS = {
  copy: ShareIconCopy,
  email: ShareIconMail,
  teams: ShareIconMessage,
};

const shareUrl = () => {
  const u = new URL(window.location.href);
  ['modal', 'state', 'pdf'].forEach((k) => u.searchParams.delete(k));
  return u.toString();
};

const BriefingShareDialog = ({ onCopy, onClose }) => {
  const session = useAgencySession();
  const [message, setMessage] = useState(D.message);
  const [home, setHome] = useState(null);
  const [failed, setFailed] = useState('');
  const url = shareUrl();
  useEffect(() => {
    agencyHome()
      .then(setHome)
      .catch(() => setHome(null));
  }, []);
  const agencyName = session?.agency?.short || session?.agency?.name || 'Your agency';
  const card = {
    title: `${agencyName} · National data`,
    headline: home ? `${formatCount(home.national.total)} talents` : 'Ghana Talent Hub',
    sub: home
      ? `Aggregates · ${home.national.regions} regions · updated ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}`
      : 'Aggregates only',
  };
  const text = message.trim() ? `${message.trim()}\n${url}` : url;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setFailed('');
      onCopy();
    } catch {
      setFailed('Your browser blocked the clipboard. Select the link and copy it.');
    }
  };
  const choose = (id) => {
    if (id === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(card.title)}&body=${encodeURIComponent(text)}`;
      return;
    }
    copy();
  };
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
        title={card.title}
        headline={card.headline}
        sub={card.sub}
      />
      <div className="flex items-center gap-[10px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f2f2ee] py-[10px] pr-[14px] pl-[14px]">
        <ShareIconLink className="size-[18px] shrink-0 text-[#70706e]" />
        <p
          className="m-0 min-w-0 flex-1 truncate font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]"
          title={url}
        >
          {url}
        </p>
        <Button type="button" variant="primary" size="sm" className={PRIMARY_BUTTON} onClick={copy}>
          Copy link
        </Button>
      </div>
      {failed ? (
        <p
          role="alert"
          className="m-0 font-sans text-[13px] leading-[16px] font-medium text-[#902b20]"
        >
          {failed}
        </p>
      ) : null}
      <ul className="m-0 grid list-none grid-cols-3 gap-[12px] p-0 sm:gap-[19px]">
        {D.channels.map((channel) => {
          const Icon = ICONS[channel.id];
          return (
            <li key={channel.id} className="flex">
              <button
                type="button"
                onClick={() => choose(channel.id)}
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
