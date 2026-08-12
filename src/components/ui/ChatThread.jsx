import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';
import useVoiceCapture from '../../hooks/useVoiceCapture.js';
import Button from './Button.jsx';
import AudioLevelWaveform from './AudioLevelWaveform.jsx';
import CareerBuddyAvatar from '../shared/CareerBuddyAvatar.jsx';
import AvatarPreview from '../sections/engagement/avatar/AvatarPreview.jsx';
import {
  PlusIcon,
  CheckIcon,
  ChatThumbsUpIcon,
  ChatThumbsDownIcon,
  ChatRetryIcon,
  ChatPencilIcon,
  ChatPaginationChevronIcon,
  ChatFileIcon,
  ChatHistoryIcon,
  ChatAttachIcon,
  ChatMicIcon,
  ChatWaveIcon,
  ChatSendArrowIcon,
  ChatVoiceCloseIcon,
  ChatSettingsSlidersIcon,
  ChatCopyIcon,
  ChatLinkArrowIcon,
} from '../shared/assets.jsx';

const log = debug('ChatThread');

/*
 * ChatThread — reusable conversational UI primitive.
 * Source: Figma file Bin8roWL8sloyc36IgFMuT, node range 4830:169704-194488
 * and 5132:43308-46274 ("AI Engagement Screens — Welcome Phase and
 * Miscellaneous Screens (Talent Flow)"). Bottom message-area re-extracted
 * 2026-07-23 via get_design_context on 5132:43389 (message row + chips +
 * input, all exact px) — supersedes the earlier screenshot-only pass.
 * Presentational only — it has no knowledge of Career Buddy, profile
 * stages, or any specific script. Any future conversational surface
 * (recruiter↔talent messaging, invitee evaluation chat) can reuse this.
 *
 * Exact values from Figma (5132:43389):
 *   Row gaps:     16px between (message row) / (chip row) / (input bar)
 *   Message row:  gap-[12px] between avatar column and bubble
 *   Avatar col:   flex-col items-center gap-[6px] — 48px avatar + 10px label
 *   Bubble:       bg-white rounded-[12px] px-[16px] py-[14px] max-w-[750px],
 *                 text 15px/26px #595959
 *   Chips:        bg-white border-[0.8px] border-[#e5e7eb] rounded-[16px]
 *                 px-[16px] py-[8px], text 16px #575755, wrap gap 14px/16px
 *   Input bar:    bg-white border border-[#e5e7eb] rounded-[12px] p-[16px]
 *                 h-[72px] gap-[8px]; placeholder 16px #999; mic/audio
 *                 buttons are 40px circles, bg-[#f0f0f0], p-[12px]
 *
 * Message shape:
 *   {
 *     id: string,
 *     sender: 'bot' | 'user',
 *     personaLabel?: string,       // caption under the avatar ("Career Buddy" / "Emma")
 *     text?: string,               // single-line/paragraph message
 *     bullets?: string[],          // verbatim bullet list rendered under `text`
 *     linkButton?: { label, onClick },
 *     file?: { name, size },       // renders a file-attachment chip instead of text
 *     showActions?: boolean,       // bot only — thumbs up/down + retry row
 *     versions?: string[],         // user only — edit history; > 1 shows pagination
 *     versionIndex?: number,
 *     auto?: boolean,              // system-generated confirmation bubble (Figma
 *                                  // 5132:47342/47617, "Educational background
 *                                  // confirmed ✅") — right-aligned like a user
 *                                  // message (persona avatar), but a small
 *                                  // `autoLabel` line ("[Auto]") replaces the
 *                                  // usual free-typed feel, and actions are
 *                                  // copy + edit only (no thumbs, no retry).
 *     autoLabel?: string,          // defaults to '[Auto]' when `auto` is true
 *     options?: { id, label }[],   // bot only — MCQ answer grid rendered INSIDE
 *                                  // the bubble (Figma 5132:58211, 2-col grid),
 *                                  // distinct from suggestedReplies which render
 *                                  // as a separate chip row below the thread.
 *                                  // Requires `onSelectOption` to be interactive.
 *     modeCards?: { id, title, description, Icon }[], // bot only — rich icon+
 *                                  // title+description picker cards (Figma
 *                                  // 5132:57368: "Games"/"MCQs (Assessment)"/
 *                                  // "Open Chat"). Figma places these in their
 *                                  // OWN box below the text bubble (not inside
 *                                  // it — verified via get_metadata: the cards
 *                                  // frame and the message-text frame are
 *                                  // separate siblings ~200px apart), sharing
 *                                  // ONE bg-white/rounded-[16px]/p-[20px] box
 *                                  // with the input bar beneath them (the
 *                                  // input's own border becomes just a
 *                                  // border-t inside that shared box). Only
 *                                  // the LAST message's modeCards are ever
 *                                  // shown (mirrors how suggestedReplies only
 *                                  // ever applies to the active turn).
 *                                  // Requires `onSelectModeCard` to be
 *                                  // interactive.
 *   }
 *
 * Props:
 *   messages         Message[]
 *   onSend           (text: string) => void
 *   suggestedReplies string[]      — rendered as clickable chips above the input bar
 *   onSelectOption   (optionId: string) => void — fires when an `options` grid
 *                    button (any message) is clicked
 *   onSelectModeCard (cardId: string) => void — fires when a `modeCards`
 *                    button (any message) is clicked
 *   disabled         boolean       — disables the whole input bar
 *   onNewChat        () => void    — renders the "+ New Chat" pill top-left when provided
 *   onOpenHistory    () => void    — renders the clock/history icon top-right when provided
 *   onOpenVoiceSettings () => void — settings (sliders) control; New Chat / chrome
 *   onOpenVoiceCall  () => void    — far-right wave button opens dual-avatar voice call
 *   startDictation   boolean       — demo seed: enter voice-to-text recording on mount
 *   enableAttach     boolean       — when true, attach icon triggers a hidden file input
 *                    (recruiter KYB / job JD upload); default false (decorative only)
 *   onAttach         ({name,size,sizeLabel}) => void — called with selected file metadata
 *   onAttachRejected (name: string) => void — called when selected file exceeds 10 MB
 *                    (same KYB-style "File too large" toast in CareerBuddySection)
 */

const UserAvatar = ({ src }) =>
  src ? (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="size-12 shrink-0 rounded-full object-cover"
      draggable="false"
    />
  ) : (
    // Shared layered avatar from the customiser (AvatarPreview).
    <AvatarPreview size={48} />
  );

const MessageBubble = ({ message, onRetry, onSelectOption }) => {
  const isBot = message.sender === 'bot';
  const versions = message.versions ?? (message.text ? [message.text] : []);
  const [versionIndex, setVersionIndex] = useState(message.versionIndex ?? versions.length - 1);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null — real toggle state, not persisted
  const activeText = versions[versionIndex] ?? message.text;
  const hasMultipleVersions = versions.length > 1;

  return (
    <div
      className={classNames(
        'flex flex-col gap-[6px] max-w-[750px]',
        isBot ? 'items-start self-start' : 'items-end self-end'
      )}
    >
      <div
        className={classNames(
          'flex items-start gap-[12px]',
          isBot ? 'flex-row' : 'flex-row-reverse'
        )}
      >
        {/* Avatar column — circle + persona label, Figma 5132:43391 */}
        <span className="flex flex-col items-center gap-[6px] shrink-0">
          {isBot ? <CareerBuddyAvatar size={48} /> : <UserAvatar src={message.avatarSrc} />}
          <span className="font-sans text-[10px] leading-[1.3] text-[#595959] whitespace-nowrap">
            {isBot ? 'Career Buddy' : message.personaLabel}
          </span>
        </span>

        {message.file ? (
          <div className="flex items-center gap-2 rounded-[10px] border border-border-default bg-white px-3 py-2 mt-[6px]">
            <ChatFileIcon className="size-4 text-content-secondary shrink-0" />
            <span className="flex flex-col leading-tight">
              <span className="font-sans text-[12px] font-medium text-content-primary truncate max-w-[140px]">
                {message.file.name}
              </span>
              <span className="font-sans text-[10px] text-content-tertiary">
                {message.file.size}
              </span>
            </span>
          </div>
        ) : (
          <div
            className={classNames(
              'flex flex-col gap-[12px] rounded-[12px] px-[16px] py-[14px] font-sans text-[15px] leading-[26px] text-[#595959] whitespace-pre-line',
              isBot || message.auto ? 'bg-white' : 'bg-white shadow-sm'
            )}
          >
            <div>
              {message.auto && (
                <p className="text-[12px] leading-normal text-[#595959]">
                  {message.autoLabel ?? '[Auto]'}
                </p>
              )}
              {activeText}
              {message.bullets && message.bullets.length > 0 && (
                <ul className="mt-1 flex flex-col gap-[2px]">
                  {message.bullets.map((bullet, i) => (
                    <li key={i} className="text-[15px] leading-[26px]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {message.followUp && <p className="mt-1">{message.followUp}</p>}
            </div>
            {message.linkButton && (
              // Figma 5166:48026 — px 8 / py 5 / gap 3 / 13.5px Regular /
              // 16px icon. Tailwind `leading-normal` is 1.5 (too tall); use
              // `leading-none` so label+icon center inside the Figma hug.
              <button
                type="button"
                onClick={message.linkButton.onClick}
                className="self-start m-0 inline-flex items-center justify-center gap-[3px] rounded-[100px] border border-solid border-[#387440] bg-[#e1eae2] px-[8px] py-[5px] font-sans text-[13.5px] font-normal leading-none text-[#387440] whitespace-nowrap hover:bg-[#d4e4d6]"
              >
                {message.linkButton.label}
                <ChatLinkArrowIcon className="block size-[16px] shrink-0" />
              </button>
            )}
            {/* MCQ answer grid (Figma 5132:58211) — 2-col, inside the bubble
                itself rather than the suggestedReplies row below the thread,
                since it belongs to THIS specific question, not the whole
                conversation turn. */}
            {message.options && message.options.length > 0 && (
              // Figma 5132:58211's real grid is `grid-cols-[repeat(2,fit-content(100%))]`
              // (columns auto-size to their own content) with `whitespace-nowrap`
              // labels — the 334px width on that reference frame is just the
              // incidental hug-width of ITS OWN short options, not a fixed
              // container. An earlier pass used `grid-cols-2 w-[334px]` (equal
              // fixed-width columns) without `whitespace-nowrap`, which wraps
              // longer option text even though the bubble has room to spare.
              <div className="grid grid-cols-[repeat(2,fit-content(100%))] gap-x-[12px] gap-y-[10px]">
                {message.options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSelectOption?.(option.id)}
                    className="flex items-center rounded-[16px] border-[0.8px] border-[#e5e7eb] bg-white pl-[16px] pr-[20px] py-[8px] font-sans text-[15px] whitespace-nowrap text-left text-[#575755] hover:border-brand-green hover:text-brand-green"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bot message actions — thumbs up/down + retry (Figma 5132:45547) */}
      {isBot && message.showActions && (
        <div className="flex items-center gap-[10px] pl-[60px] text-content-tertiary">
          <button
            type="button"
            aria-label="Helpful"
            aria-pressed={feedback === 'up'}
            onClick={() => setFeedback((f) => (f === 'up' ? null : 'up'))}
            className={feedback === 'up' ? 'text-brand-green' : 'hover:text-brand-green'}
          >
            <ChatThumbsUpIcon className="size-[14px]" />
          </button>
          <button
            type="button"
            aria-label="Not helpful"
            aria-pressed={feedback === 'down'}
            onClick={() => setFeedback((f) => (f === 'down' ? null : 'down'))}
            className={feedback === 'down' ? 'text-danger' : 'hover:text-danger'}
          >
            <ChatThumbsDownIcon className="size-[14px]" />
          </button>
          <button
            type="button"
            aria-label="Regenerate response"
            onClick={() => onRetry?.(message.id)}
            className="hover:text-brand-green"
          >
            <ChatRetryIcon className="size-[14px]" />
          </button>
        </div>
      )}

      {/* Auto-confirmation message actions — copy + edit only, no thumbs/retry,
          no version pagination (there's exactly one version of a system-
          generated confirmation — Figma's static "1/2" demo counter isn't
          reproduced here since it doesn't correspond to a real edit). */}
      {!isBot && message.auto && (
        <div className="flex items-center gap-[15px] pr-[60px] text-content-tertiary">
          <button
            type="button"
            aria-label="Copy message"
            onClick={() => navigator.clipboard?.writeText(activeText)}
            className="hover:text-brand-green"
          >
            <ChatCopyIcon className="size-[14px]" />
          </button>
          <button type="button" aria-label="Edit message" className="hover:text-brand-green">
            <ChatPencilIcon className="size-[13px]" />
          </button>
        </div>
      )}

      {/* User message edit + version pagination (Figma 5132:45547) */}
      {!isBot && !message.auto && hasMultipleVersions && (
        <div className="flex items-center gap-[8px] pr-[60px] text-content-tertiary">
          <button type="button" aria-label="Edit message" className="hover:text-brand-green">
            <ChatPencilIcon className="size-[13px]" />
          </button>
          <button
            type="button"
            aria-label="Previous version"
            disabled={versionIndex === 0}
            onClick={() => setVersionIndex((i) => Math.max(0, i - 1))}
            className="hover:text-brand-green disabled:opacity-30"
          >
            <ChatPaginationChevronIcon dir="left" className="size-[13px]" />
          </button>
          <span className="font-sans text-[11px]">
            {versionIndex + 1}/{versions.length}
          </span>
          <button
            type="button"
            aria-label="Next version"
            disabled={versionIndex === versions.length - 1}
            onClick={() => setVersionIndex((i) => Math.min(versions.length - 1, i + 1))}
            className="hover:text-brand-green disabled:opacity-30"
          >
            <ChatPaginationChevronIcon dir="right" className="size-[13px]" />
          </button>
        </div>
      )}
    </div>
  );
};

const ChatThread = ({
  messages = [],
  onSend,
  suggestedReplies = [],
  onSelectOption,
  onSelectModeCard,
  disabled = false,
  onNewChat,
  onOpenHistory,
  onOpenVoiceSettings,
  onOpenVoiceCall,
  startDictation = false,
  enableAttach = false,
  onAttach,
  onAttachRejected,
  className,
}) => {
  const [draft, setDraft] = useState('');
  const [recording, setRecording] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const dictationSeededRef = useRef(false);

  const {
    level,
    transcript,
    error: micError,
  } = useVoiceCapture({
    enabled: recording,
    listen: true,
  });

  // Live interim transcript into the recording buffer (confirm copies to draft).
  const [dictationBuffer, setDictationBuffer] = useState('');
  useEffect(() => {
    if (recording && transcript) {
      setDictationBuffer(transcript);
      log('async', { dictationLen: transcript.length });
    }
  }, [recording, transcript]);

  useEffect(() => {
    if (startDictation && !dictationSeededRef.current) {
      dictationSeededRef.current = true;
      log('branch', { startDictationSeed: true });
      setRecording(true);
    }
  }, [startDictation]);

  const handleAttachClick = () => {
    if (enableAttach) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset so the same file can be selected again
    e.target.value = '';
    const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_BYTES) {
      log('branch', { attachRejected: file.name, sizeBytes: file.size });
      onAttachRejected?.(file.name);
      return;
    }
    const sizeLabel =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(0)}MB`
        : `${Math.round(file.size / 1024)}KB`;
    log('branch', { attachAccepted: file.name, sizeLabel });
    onAttach?.({ name: file.name, size: file.size, sizeLabel });
  };

  log('render', {
    messageCount: messages.length,
    suggestedReplyCount: suggestedReplies.length,
    recording,
  });

  // The input bar lives inside this same scrollable column, directly after
  // the last message/chip (Figma 5132:43389 — one flex-col, 16px gaps, no
  // separate pinned footer). Keep it in view as the conversation grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, suggestedReplies]);

  const submit = (value) => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    log('send', { length: trimmed.length });
    onSend?.(trimmed);
    setDraft('');
    setRecording(false);
    setDictationBuffer('');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    submit(draft);
  };

  const handleMicClick = () => {
    log('branch', { voiceToTextStart: true });
    setDictationBuffer('');
    setRecording(true);
  };

  const handleCancelDictation = () => {
    log('branch', { voiceToTextCancel: true });
    setRecording(false);
    setDictationBuffer('');
  };

  const handleConfirmDictation = () => {
    // Confirm fills the draft only — does not send (product 2026-08-12).
    log('branch', { voiceToTextConfirm: true, len: dictationBuffer.length });
    if (dictationBuffer.trim()) {
      setDraft((prev) => {
        const next = prev.trim()
          ? `${prev.trim()} ${dictationBuffer.trim()}`
          : dictationBuffer.trim();
        return next;
      });
    }
    setRecording(false);
    setDictationBuffer('');
  };

  // Mode-picker cards (Figma 5132:57368: "Games"/"MCQs (Assessment)"/"Open
  // Chat") only ever belong to the most recent turn — once the user picks
  // one, the next message no longer carries `modeCards` and this reverts to
  // the normal chip+input layout, same lifecycle as suggestedReplies.
  const trailingModeCards = messages[messages.length - 1]?.modeCards;

  // Input bar (Figma "GTHInput" 5132:43431 / 5132:57377). Figma renders two
  // visually different wrappers for the exact same control: a standalone
  // bordered/rounded box normally, or — when mode-picker cards are showing —
  // just a top border, nested inside the cards' own shared white box (see
  // below). The interactive bits (attach/mic/wave/send, recording state)
  // are identical either way, so this is built once and placed in whichever
  // wrapper applies.
  const inputBar = (
    <form onSubmit={handleSubmitForm} className="shrink-0">
      <div
        className={classNames(
          'flex items-center gap-[8px]',
          trailingModeCards?.length
            ? 'h-[58.5px] border-t border-[#e5e7eb] pt-[16px]'
            : 'h-[72px] rounded-[12px] border border-[#e5e7eb] bg-white p-[16px]'
        )}
      >
        <div className="flex flex-1 min-w-0 items-center gap-[5px]">
          {enableAttach && (
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          )}
          <Button
            type="button"
            variant="icon"
            size="md"
            aria-label="Attach a file"
            onClick={handleAttachClick}
            disabled={!enableAttach}
            className={enableAttach ? 'text-brand-green' : undefined}
          >
            <ChatAttachIcon className="size-4" />
          </Button>

          {recording ? (
            <div className="flex flex-1 min-w-0 items-center gap-2">
              {/* Voice-to-text — live waveform (Figma 5146:76424 / 76547) */}
              <AudioLevelWaveform level={level} className="shrink-0 text-[#595959]" />
              <span className="truncate font-sans text-[16px] tracking-[0.2px] text-content-primary">
                {dictationBuffer || (micError ? 'Mic unavailable' : '')}
              </span>
            </div>
          ) : (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={disabled}
              placeholder={
                trailingModeCards?.length ? 'Curious about any of these?' : 'Type Something...'
              }
              className="flex-1 min-w-0 border-none outline-none font-sans text-[16px] tracking-[0.2px] text-content-primary placeholder:text-[#999] disabled:opacity-50"
            />
          )}
        </div>

        {recording ? (
          <>
            {/* Confirm ✓ then Cancel X — Figma 5146:76555 / 76558 order is tick then X */}
            <button
              type="button"
              aria-label="Confirm dictation"
              onClick={handleConfirmDictation}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#575755]"
            >
              <CheckIcon className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Cancel dictation"
              onClick={handleCancelDictation}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#575755]"
            >
              <ChatVoiceCloseIcon className="size-[12px]" />
            </button>
          </>
        ) : draft.trim() ? (
          <button
            type="submit"
            aria-label="Send"
            disabled={disabled}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-white hover:bg-brand-green-hover disabled:opacity-50"
          >
            <ChatSendArrowIcon className="size-4" />
          </button>
        ) : (
          <>
            <Button
              type="button"
              variant="icon"
              size="md"
              aria-label="Dictate with microphone"
              onClick={handleMicClick}
              disabled={disabled}
            >
              <ChatMicIcon className="size-[18.5px]" />
            </Button>
            <Button
              type="button"
              variant="icon"
              size="md"
              aria-label="Start voice call"
              disabled={disabled || !onOpenVoiceCall}
              onClick={() => {
                log('branch', { openVoiceCall: true });
                onOpenVoiceCall?.();
              }}
            >
              <ChatWaveIcon className="size-[18.5px]" />
            </Button>
          </>
        )}
      </div>
    </form>
  );

  return (
    <div className={classNames('relative flex flex-1 min-h-0 flex-col', className)}>
      {/* New Chat + History / Settings — float over the chat (transparent chrome). */}
      {(onNewChat || onOpenHistory || onOpenVoiceSettings) && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[54px] pt-6">
          {onNewChat ? (
            <button
              type="button"
              onClick={onNewChat}
              className="pointer-events-auto inline-flex items-center gap-[4px] rounded-[12px] bg-black/[0.21] px-[14px] py-[10px] font-sans text-[15px] leading-[22px] text-[#fefefe] hover:bg-black/30"
            >
              <PlusIcon className="size-[20px]" /> New Chat
            </button>
          ) : (
            <span />
          )}
          <div className="pointer-events-auto flex items-center gap-2">
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                aria-label="Chat history"
                className="inline-flex items-center justify-center rounded-[12px] bg-black/[0.21] px-[12px] py-[10px] text-[#fefefe] hover:bg-black/30"
              >
                <ChatHistoryIcon className="size-[20px]" />
              </button>
            )}
            {onOpenVoiceSettings && (
              <button
                type="button"
                onClick={onOpenVoiceSettings}
                aria-label="Voice settings"
                className="inline-flex items-center justify-center rounded-[12px] bg-black/[0.21] px-[12px] py-[10px] text-[#fefefe] hover:bg-black/30"
              >
                <ChatSettingsSlidersIcon className="size-[18px] text-[#fefefe]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scrollable column — messages ONLY. The input bar (and the
          suggestedReplies/modeCards footer that travels with it) is a
          separate, non-scrolling block below this one — the compose box
          must never scroll out of view while browsing message history.
          `mt-auto` on the inner wrapper bottom-anchors short conversations
          without the `justify-content:flex-end` cross-browser bug (Chrome/
          Firefox both affected): `justify-end` directly on an
          `overflow-y:auto` container makes the browser compute
          scrollHeight === clientHeight once content overflows — i.e. it
          never registers the overflow at all, so there's nothing to
          scroll and older messages get pushed off the top with zero
          scrollbar and no way back to them (confirmed live via
          scrollHeight staying pinned to clientHeight as messages were
          added). `margin-top: auto` gives the same visual without that
          bug, since it's a margin, not the flex container's own alignment
          mode. Top padding clears the floating New Chat / History pills
          for the first paint; scrolling still passes under that transparent
          chrome. */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-[54px] pt-6">
        <div
          className={`flex flex-col gap-[16px] mt-auto ${
            onNewChat || onOpenHistory || onOpenVoiceSettings ? 'pt-[52px]' : ''
          }`}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onSelectOption={onSelectOption} />
          ))}
        </div>
      </div>

      {/* Fixed footer — mode-picker cards / suggested-reply chips + the
          input bar. Never part of the scrollable region above. */}
      <div className="shrink-0 flex flex-col gap-[16px] px-[54px] pb-6 pt-[16px]">
        {/* Mode-picker cards (Figma 5132:57368) — cards row + input bar share
            ONE bg-white/rounded-[16px]/p-[20px] box (verified via
            get_design_context: Frame 14224 wraps "GTH CARDS" x3 AND
            "GTHInput" together), spanning the thread's full content width.
            An earlier pass rendered the cards inside the bot's own text
            bubble; Figma's metadata shows the text bubble and the cards
            frame are separate siblings ~200px apart, so that was wrong on
            both placement and merge target. */}
        {trailingModeCards && trailingModeCards.length > 0 ? (
          <div className="flex flex-col gap-[20px] rounded-[16px] bg-white p-[20px]">
            {/* grid-cols-3 (not flex row) — 3 cards (Personality mode-picker)
                fill one row identically to the old flex-1 layout, but 6
                cards (the post-Personality section-picker, Figma 5132:49680,
                "3×2 grid") now wrap into 2 rows instead of squeezing 6 into
                one line. */}
            <div className="grid grid-cols-3 gap-[20px]">
              {trailingModeCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onSelectModeCard?.(card.id)}
                  className="group flex min-w-0 items-start gap-[16px] rounded-[16px] border-2 border-[#e6e6e6] bg-[#fffefc] py-[20px] pl-[24px] pr-[16px] text-left hover:border-brand-green hover:bg-white hover:shadow-[0px_6px_0px_rgba(34,70,38,0.8)]"
                >
                  <span className="flex size-[62px] shrink-0 items-center justify-center rounded-[10px] bg-[#f8f8f4] text-content-secondary group-hover:bg-brand-green-light group-hover:text-brand-green">
                    {card.Icon && <card.Icon className="size-10" />}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <span className="font-display text-[22px] leading-normal text-[#111] group-hover:text-brand-green">
                      {card.title}
                    </span>
                    <span className="font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
                      {card.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {inputBar}
          </div>
        ) : (
          <>
            {/* Suggested replies (Figma 5132:43427 "Bubbles") */}
            {suggestedReplies.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[14px]">
                {suggestedReplies.map((reply) => (
                  <Button
                    key={reply}
                    type="button"
                    variant="chip"
                    size="md"
                    onClick={() => submit(reply)}
                    disabled={disabled}
                    className="shrink-0"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}
            {inputBar}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatThread;
