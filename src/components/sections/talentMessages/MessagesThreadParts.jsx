import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import sparkleDoodle from '../../../assets/playful/sparkle-gold-sm.svg';
import {
  MsgAlertIcon,
  MsgInfoIcon,
  MsgShieldIcon,
  MsgStarIcon,
  MsgWifiOffIcon,
} from './aIcons.jsx';
import { SparkIcon, VolumeIcon } from './dIcons.jsx';
import { MESSAGES_COPY } from './messagesData.js';
import { BUBBLE_IN, BUBBLE_OUT, DATE_PILL, FOCUS_RING, NOTICE_TONES } from './messagesStyles.js';

const log = debug('MessagesThreadParts');

/* Small presentational pieces of the conversation pane (Figma "Component 24" = the thread). */

export const DatePill = ({ label }) => <span className={DATE_PILL}>{label}</span>;

const ChatChip = ({ on, dark, onClick, icon, children, label }) => {
  const Glyph = icon;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      aria-label={label}
      className={classNames(
        'inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] rounded-full border border-solid px-[10px] font-sans text-[12px] font-semibold leading-[16px]',
        dark
          ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
          : on
            ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#2d5d33]'
            : 'border-[#e1eae2] bg-white text-[#595959]',
        FOCUS_RING
      )}
    >
      <Glyph className={classNames('size-[14px]', dark ? 'text-white' : 'text-[#2d5d33]')} />
      {children}
    </button>
  );
};

/* Read-aloud / Explain-it-simply chips under a received bubble (shown when those Messages accessibility modes are on). */
const ReadTools = ({ tools, onListen, onExplain }) => (
  <div className="mt-[8px] flex flex-wrap items-center gap-[8px]">
    {tools.read ? (
      <ChatChip dark={tools.playing} icon={VolumeIcon} onClick={onListen}>
        {tools.playing ? 'Playing…' : 'Listen'}
      </ChatChip>
    ) : null}
    {tools.explain ? (
      <ChatChip on={tools.explained} icon={SparkIcon} onClick={onExplain}>
        {tools.explained ? 'Explained below' : 'Explain simply'}
      </ChatChip>
    ) : null}
  </div>
);

export const ReceivedBubble = ({ item, tools, onListen, onExplain }) => (
  <div
    className="relative flex flex-col items-start"
    style={{
      marginTop: item.extraBefore ?? 0,
      marginBottom: item.extraAfter ?? 0,
    }}
  >
    <div className="relative w-full">
      {/* A-03: the message being read aloud is outlined in green */}
      <div
        className={classNames(BUBBLE_IN, tools?.playing && 'outline outline-1 outline-[#387440]')}
      >
        <p
          data-msg-text
          className="m-0 font-sans text-[14px] leading-[1.4] text-[#595959] [overflow-wrap:anywhere]"
        >
          {item.text}
        </p>
        <span className="font-sans text-[12px] leading-[14px] text-[#babab7]">{item.time}</span>
      </div>
      {item.reaction ? (
        <span
          data-msg-deco
          className="absolute left-[14px] top-full -mt-[12px] inline-flex items-center gap-[4px] rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-white px-[8px] py-[3px] font-sans text-[11.5px] max-lg:text-[12px] font-bold leading-[14px] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]"
        >
          <MsgStarIcon className="size-[14px] text-[#111]" />
          <span className="max-lg:text-[12px]">{item.reaction.count}</span>
        </span>
      ) : null}
    </div>
    {tools ? (
      <div className={item.reaction ? 'mt-[14px]' : undefined}>
        <ReadTools tools={tools} onListen={onListen} onExplain={onExplain} />
      </div>
    ) : null}
  </div>
);

export const SentBubble = ({ item, onRetry }) => {
  const sending = item.status === 'sending';
  const failed = item.status === 'failed';
  log('sent', { id: item.id, status: item.status });
  return (
    <div className="flex flex-col items-end gap-[6px]">
      <div className={classNames(BUBBLE_OUT, sending && 'bg-[#387440] opacity-70')}>
        <p
          data-msg-text
          className="m-0 font-sans text-[14px] leading-[1.4] text-white [overflow-wrap:anywhere]"
        >
          {item.text}
        </p>
        <span className="flex items-center gap-[4px] font-sans text-[12px] leading-[14px] text-[#babab7]">
          <span>{item.time}</span>
          {item.status === 'read' ? <span className="font-medium">Read</span> : null}
          {item.status === 'delivered' ? <span className="font-medium">Delivered</span> : null}
          {sending ? <span className="font-medium">{MESSAGES_COPY.sending}</span> : null}
        </span>
      </div>
      {failed ? (
        <button
          type="button"
          onClick={() => onRetry(item.id)}
          className={classNames(
            'inline-flex min-h-[24px] cursor-pointer items-center gap-[6px] border-0 bg-transparent p-0 font-sans text-[12px] leading-normal tracking-[0.2px] text-[#c0392b]',
            FOCUS_RING
          )}
        >
          <MsgAlertIcon className="size-[14px]" />
          <span className="font-medium">{MESSAGES_COPY.notSent}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold">{MESSAGES_COPY.retry}</span>
        </button>
      ) : null}
    </div>
  );
};

export const Notice = ({ tone, bold, text, soft, className }) => {
  const Glyph = tone === 'yellow' ? MsgInfoIcon : MsgShieldIcon;
  const iconColour =
    tone === 'yellow' ? 'text-[#c8951a]' : tone === 'blue' ? 'text-[#244a9f]' : 'text-[#387440]';
  return (
    <p
      className={classNames(
        'm-0 flex items-start gap-[10px] rounded-[12px] px-[16px] py-[12px] font-sans text-[13px] leading-[19px] tracking-[0.2px]',
        NOTICE_TONES[tone],
        soft && 'bg-[rgba(250,244,232,0.8)]',
        className
      )}
    >
      <Glyph className={classNames('mt-px size-[18px]', iconColour)} />
      <span className="min-w-0">
        {bold ? <span className="font-semibold">{bold}</span> : null}
        {text}
      </span>
    </p>
  );
};

export const OfflineBanner = () => (
  <p
    role="status"
    className="m-0 flex shrink-0 items-center gap-[10px] rounded-[12px] bg-[#faf4e8] px-[16px] py-[10px] font-sans text-[13px] font-medium leading-normal tracking-[0.2px] text-[#c8951a]"
  >
    <MsgWifiOffIcon className="size-[18px] text-[#eedeb8]" />
    {MESSAGES_COPY.offline}
  </p>
);

export const RoleSummary = ({ item }) => (
  <div className="flex w-fit max-w-full items-center gap-[14px] rounded-[12px] border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-white px-[16px] py-[14px] max-lg:flex-wrap">
    <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec] font-sans text-[15px] font-semibold tracking-[0.2px] text-[#2d5d33]">
      {item.match}
    </span>
    <span className="flex min-w-0 flex-col gap-[2px] tracking-[0.2px]">
      <span className="font-sans text-[15px] font-semibold text-[#1c2a21]">{item.title}</span>
      <span className="font-sans text-[13px] text-[#595959] max-lg:whitespace-normal lg:whitespace-nowrap">
        {item.meta}
      </span>
    </span>
    <button
      type="button"
      onClick={() => log('view role: no destination drawn')}
      className={classNames(
        'cursor-pointer border-0 bg-transparent font-sans text-[13px] font-medium tracking-[0.2px] text-[#387440] no-underline max-lg:py-[4px]',
        FOCUS_RING
      )}
    >
      View role
    </button>
  </div>
);

export const TypingIndicator = ({ label }) => (
  <div className="flex items-center gap-[10px]">
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-[5px] rounded-[12px] bg-[rgba(229,229,229,0.5)] px-[16px] py-[12px]"
    >
      <span className="size-[8px] animate-pulse rounded-full bg-[#595959]" />
      <span className="size-[8px] animate-pulse rounded-full bg-[#595959]/60 [animation-delay:150ms]" />
      <span className="size-[8px] animate-pulse rounded-full bg-[#595959]/30 [animation-delay:300ms]" />
    </span>
    <span
      role="status"
      className="font-sans text-[12.5px] font-medium leading-[15px] text-[#737373]"
    >
      {label}
    </span>
    <img
      src={sparkleDoodle}
      alt=""
      aria-hidden="true"
      data-msg-deco
      className="hidden size-[10px] playful:block"
    />
  </div>
);

/* The pending-request actions + footnote (T-MSG-03 / 11). Replaces the composer until the request is answered. */
export const RequestBar = ({ footnote, onAccept, onNotNow, onDecline, onSpam }) => (
  <div className="flex shrink-0 flex-col gap-[10px]">
    <div className="flex flex-wrap items-center justify-between gap-[10px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <Button onClick={onAccept}>{MESSAGES_COPY.accept}</Button>
        <Button variant="tertiary" onClick={onNotNow}>
          {MESSAGES_COPY.notNow}
        </Button>
        <Button variant="tertiary" onClick={onDecline}>
          {MESSAGES_COPY.decline}
        </Button>
      </div>
      <Button
        variant="tertiary"
        size="xs"
        className="h-[41px] px-[20px] text-[14px]"
        onClick={onSpam}
      >
        {MESSAGES_COPY.spam}
      </Button>
    </div>
    <p className="m-0 font-sans text-[12px] leading-normal tracking-[0.2px] text-[#737373]">
      {footnote}
    </p>
  </div>
);
