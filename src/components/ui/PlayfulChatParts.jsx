import { debug } from '../../utils/debug.js';
import {
  ChatCopyIcon,
  ChatPaginationChevronIcon,
  ChatPencilIcon,
  ChatRetryIcon,
  ChatThumbsDownIcon,
  ChatThumbsUpIcon,
} from '../shared/assets.jsx';

const log = debug('PlayfulChatParts');

/*
 * Playful chat helpers (wiki/playful-mode.md). Everything here is only ever
 * rendered while a talent Career Buddy screen has opted in via <UiStyleScope>,
 * i.e. while <html data-ui-style="playful"> is present. Recruiter / parent
 * Career Buddy never get that attribute, so they keep the Focused look.
 */

/**
 * Suggested-reply chip, Playful (Figma 7873:50607 / 52310 "Bubbles").
 * Default: #ebf1ec sticker with 1.5px ink-55% border and a 5px shelf.
 * Hover/focus/pressed: solid ink border + tight 2px shelf (the first chip in
 * every Figma frame, annotated as the hover state of the CTAs).
 */
export const PlayfulChip = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-[rgba(28,42,33,0.55)] bg-[#ebf1ec] px-4 py-2 font-sans text-[16px] leading-normal text-[#2d5d33] shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)] transition-[box-shadow,transform] duration-150 hover:border-[1.2px] hover:border-[#1c2a21] hover:px-[16.3px] hover:py-[8.3px] hover:shadow-[2px_2px_0_#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 max-lg:min-h-8 max-lg:px-3 max-lg:py-1 max-lg:text-[13px] forced-colors:border-[CanvasText]"
  >
    {children}
  </button>
);

const PF_ICON_BTN =
  'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-[#737373] transition-colors hover:text-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1c2a21] disabled:cursor-not-allowed disabled:opacity-30 aria-pressed:text-[#32683a]';

// mdi:tick (Figma 7873:52837;5132:43083), fill #737373, 20px.
const TickGlyph = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.5 5.83333L7.5 15.8333L2.91667 11.25L4.09167 10.075L7.5 13.475L16.325 4.65833L17.5 5.83333Z" />
  </svg>
);

/**
 * Hover/focus message actions, Playful (Figma 7873:52837 bot, 7873:52838 user;
 * annotations "appears when the text is hovered"). Hangs below the bubble
 * (absolute, no layout shift): bot = bottom:-20px, gap 15, pl 6; user =
 * right 0, gap 15, pr 6. Revealed on hover, keyboard focus-within and, on
 * touch (hover:none) devices, whenever the message is tapped/focused.
 */
export const PlayfulMessageActions = ({
  isBot,
  text,
  messageId,
  onRetry,
  feedback,
  setFeedback,
  versionIndex,
  versionCount,
  setVersionIndex,
}) => {
  const copy = () => {
    log('branch', { copyMessage: messageId });
    navigator.clipboard?.writeText(text ?? '');
  };
  const reveal =
    'opacity-0 transition-opacity duration-150 group-hover/pf:opacity-100 group-focus-within/pf:opacity-100 focus-within:opacity-100 [@media(hover:none)]:group-active/pf:opacity-100 motion-reduce:transition-none';
  if (isBot) {
    return (
      <div
        role="group"
        aria-label="Message actions"
        className={`absolute bottom-[-20px] left-0 z-[1] flex items-center gap-[15px] pl-[6px] ${reveal}`}
      >
        <button type="button" aria-label="Copy message" onClick={copy} className={PF_ICON_BTN}>
          <TickGlyph className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Helpful"
          aria-pressed={feedback === 'up'}
          onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
          className={PF_ICON_BTN}
        >
          <ChatThumbsUpIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Not helpful"
          aria-pressed={feedback === 'down'}
          onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
          className={PF_ICON_BTN}
        >
          <ChatThumbsDownIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Regenerate response"
          onClick={() => onRetry?.(messageId)}
          className={PF_ICON_BTN}
        >
          <ChatRetryIcon className="size-5" />
        </button>
      </div>
    );
  }
  return (
    <div
      role="group"
      aria-label="Message actions"
      className={`absolute right-0 top-[calc(100%+5.5px)] z-[1] flex items-center gap-[15px] pr-[6px] ${reveal}`}
    >
      <button
        type="button"
        aria-label="Copy message"
        onClick={copy}
        className={`${PF_ICON_BTN} size-[33px]`}
      >
        <ChatCopyIcon className="size-5" />
      </button>
      <button type="button" aria-label="Edit message" className={PF_ICON_BTN}>
        <ChatPencilIcon className="size-5" />
      </button>
      {versionCount > 1 && (
        <span className="flex items-center gap-[7px] text-[16px] leading-[24px] text-[#777]">
          <button
            type="button"
            aria-label="Previous version"
            disabled={versionIndex === 0}
            onClick={() => setVersionIndex((i) => Math.max(0, i - 1))}
            className={PF_ICON_BTN}
          >
            <ChatPaginationChevronIcon dir="left" className="size-4" />
          </button>
          <span>
            {versionIndex + 1}/{versionCount}
          </span>
          <button
            type="button"
            aria-label="Next version"
            disabled={versionIndex === versionCount - 1}
            onClick={() => setVersionIndex((i) => Math.min(versionCount - 1, i + 1))}
            className={PF_ICON_BTN}
          >
            <ChatPaginationChevronIcon dir="right" className="size-4" />
          </button>
        </span>
      )}
    </div>
  );
};
