import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { usePlayfulDialogA11y } from '../../ui/PlayfulDialogA11y.js';
import {
  ChatComposerMicIcon,
  ChatHistoryClockIcon,
  ChatPanelCloseIcon,
  ChatTypingIndicatorIllustration,
  GreenArrowRightIcon,
  InterestsHeartIcon,
  OnlineStatusDotIcon,
  WhiteArrowRightIcon,
} from '../../shared/assets.jsx';
import FlowPortal from './FlowPortal.jsx';
import buddy42 from '../../../assets/talent-home/flows/career-buddy-avatar-42.png';
import buddy26 from '../../../assets/talent-home/flows/career-buddy-avatar-26.png';

const log = debug('CareerBuddyFirstChat');

/*
 * CareerBuddyFirstChat — NU-04 first chat panel. Figma: Focused 8097:5507, Playful 7746:3144
 * (scrim rgba(11,26,15,.35) in both). Right-docked panel, 16px from the viewport edges.
 * The thread is the scripted Figma conversation (mock; shaped as { from, text }[] so an API
 * can replace it). No replies are generated — Figma shows the typing indicator as the last row.
 * Playful differs by `playful:` variants only (ink border + shelf, "+50 XP" copy, shelf card/send).
 */

const MESSAGES = [
  {
    id: 'm1',
    from: 'buddy',
    text: 'Akwaaba, Kofi! I’m Career Buddy. I can help you build your profile, find roles and get ready for interviews.',
  },
  {
    id: 'm2',
    from: 'buddy',
    text: 'Your avatar looks great. Next up is Interests. Want me to suggest a few based on frontend work in Accra?',
  },
  { id: 'm3', from: 'me', text: 'What does Discoverable mean?' },
  {
    id: 'm4',
    from: 'buddy',
    text: 'It’s your first milestone, at 3 of 9 stages. Recruiters can then find you in search, and you can apply to roles. You’re 2 stages away, about 10 minutes.',
  },
];

const SUGGESTIONS = ['Suggest my interests', 'Which roles pay well in Accra?', 'Show me around'];

const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const HEADER_BTN =
  'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const BuddyAvatar = () => (
  <span className="flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-white">
    <img src={buddy26} alt="" aria-hidden="true" className="size-[26px]" />
  </span>
);

const CareerBuddyFirstChat = ({ home }) => {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  log('mount', { messages: MESSAGES.length });

  const close = () => {
    log('close');
    home?.update?.({ new: null });
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: close,
    initialFocus: () => inputRef.current,
    lockScroll: true,
  });

  return (
    <FlowPortal className="bg-[rgba(11,26,15,0.35)]" onScrimMouseDown={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nu-chat-title"
        tabIndex={-1}
        className="leading-[normal] absolute top-[clamp(8px,0.93vw,16px)] right-[clamp(8px,0.93vw,16px)] bottom-[clamp(8px,0.93vw,16px)] flex w-[min(480px,calc(100vw-clamp(16px,1.86vw,32px)))] flex-col overflow-hidden rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white shadow-[0_2px_8px_rgba(28,42,33,0.04),0_1px_2px_rgba(28,42,33,0.04)] outline-none playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_24px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]"
      >
        <header className="flex shrink-0 items-center gap-[12px] bg-[linear-gradient(90deg,#2e6436_0%,#387440_100%)] py-[18px] pr-[18px] pl-[20px]">
          <span className="flex size-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <img src={buddy42} alt="" aria-hidden="true" className="size-[42px]" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <h2 id="nu-chat-title" className="m-0 text-[16px] font-semibold text-white">
              Career Buddy
            </h2>
            <p className="m-0 flex items-center gap-[6px] text-[12px] font-medium whitespace-nowrap text-white max-[360px]:text-[11px]">
              <OnlineStatusDotIcon className="size-[8px] shrink-0" />
              <span className="truncate">Online · replies in seconds</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="History"
            className={HEADER_BTN}
            onClick={() => log('history: no destination in Figma')}
          >
            <ChatHistoryClockIcon className="size-[16px]" />
          </button>
          <button type="button" aria-label="Close" className={HEADER_BTN} onClick={close}>
            <ChatPanelCloseIcon className="size-[16px]" />
          </button>
        </header>

        <div
          role="log"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto bg-[#f7f8f4] p-[clamp(12px,1.16vw,20px)]"
        >
          <span className="inline-flex h-[32px] w-fit items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
            Today
          </span>
          {MESSAGES.map((m) =>
            m.from === 'buddy' ? (
              <div key={m.id} className="flex items-end gap-[8px]">
                <BuddyAvatar />
                <p className="m-0 max-w-[330px] rounded-[18px_18px_18px_4px] border border-[#e7e7e7] bg-white px-[14px] py-[12px] text-[14px] leading-[21px] text-[#1c2a21]">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex justify-end">
                <p className="m-0 max-w-[240px] rounded-[18px_18px_4px_18px] bg-brand-green px-[14px] py-[12px] text-[14px] leading-[21px] text-white">
                  {m.text}
                </p>
              </div>
            )
          )}
          <div className="flex pl-[36px]">
            <button
              type="button"
              onClick={() => {
                log('branch: continue interests');
                navigate('/profile/filling/interests');
              }}
              className="flex w-full max-w-[330px] cursor-pointer items-center gap-[10px] rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[12px] text-left [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
            >
              <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
                <InterestsHeartIcon className="size-[16px]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="text-[14px] font-semibold whitespace-nowrap text-[#1c2a21]">
                  Continue: Interests
                </span>
                <span className="text-[12px] whitespace-nowrap text-[#595959]">
                  About 2 min · <span className="playful:hidden">+50 pts</span>
                  <span className="hidden playful:inline">+50 XP</span>
                </span>
              </span>
              <GreenArrowRightIcon className="size-[18px] shrink-0" />
            </button>
          </div>
          <div className="flex pl-[36px]">
            <ChatTypingIndicatorIllustration className="h-[29px] w-[55px]" />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-start gap-[8px] bg-white px-[clamp(12px,1.16vw,20px)] pt-[12px] pb-[4px]">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={CHIP}
              onClick={() => {
                log('branch: suggestion', { s });
                setDraft(s);
                inputRef.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="flex shrink-0 items-center gap-[10px] bg-white px-[clamp(12px,1.16vw,20px)] pt-[12px] pb-[18px]"
          onSubmit={(e) => {
            e.preventDefault();
            log('send: no reply copy in Figma', { length: draft.length });
            setDraft('');
          }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-[8px] rounded-[14px] border-[1.5px] border-solid border-[#1c2a21] bg-[#f7f8f4] py-[12px] pr-[14px] pl-[16px] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-green">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Message Career Buddy"
              placeholder="Ask anything about jobs or your profile…"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
            />
            <ChatComposerMicIcon className="size-[18px] shrink-0" />
          </div>
          <button
            type="submit"
            aria-label="Send"
            className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border border-[rgba(28,42,33,0.1)] bg-brand-green playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <WhiteArrowRightIcon className="size-[20px]" />
          </button>
        </form>
        <p className="m-0 shrink-0 bg-white px-[clamp(12px,1.16vw,20px)] pb-[14px] text-[12px] leading-[16px] text-[#595959]">
          Career Buddy can make mistakes. Your chats are saved to History.
        </p>
      </div>
    </FlowPortal>
  );
};

export default CareerBuddyFirstChat;
