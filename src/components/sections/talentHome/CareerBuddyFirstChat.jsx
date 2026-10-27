import { useEffect, useRef, useState } from 'react';
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
import BuddyThinking, { StopGeneratingPill } from '../../ui/BuddyThinking.jsx';
import FlowPortal from './FlowPortal.jsx';
import { buddyDemoThinking } from '../profileFilling/buddyDemoFrames.js';
import {
  useCareerBuddyLive,
  THINKING_ID,
  LIVE_AVAILABLE,
} from '../profileFilling/useCareerBuddyLive.jsx';
import buddy42 from '../../../assets/talent-home/flows/career-buddy-avatar-42.png';
import buddy26 from '../../../assets/talent-home/flows/career-buddy-avatar-26.png';

const log = debug('CareerBuddyFirstChat');

/*
 * CareerBuddyFirstChat - NU-04 chat panel ("Ask Buddy"). Figma: Focused 8097:5507,
 * Playful 7746:3144 (scrim rgba(11,26,15,.35) in both). Right-docked panel, 16px from
 * the viewport edges. Playful differs by `playful:` variants only.
 *
 * 2026-10-18: on a real account the panel is the REAL Career Buddy - the same
 * conversation as the full Career Buddy screen (useCareerBuddyLive: same agent,
 * same saved thread), so a quick question here carries on there. Replies that need
 * the full screen (a profile section to review, a personality report) link to it.
 * Demo mode (/home?state=...) keeps the scripted Figma conversation below.
 *
 * 2026-10-23: while a reply is on its way the panel shows the same reply-in-progress row as the full screen
 * (BuddyThinking: thinking -> working -> writing -> slow -> stopped, Figma 8988:509558 / 8993:511908) with the
 * "Stop generating" pill above the input; Esc stops the answer first and closes the panel only when nothing is
 * being generated. ⚠️ ASSUMPTION: Figma draws these states on the full Career Buddy screen only, not inside this
 * panel; the panel reuses the component unchanged (it clamps to the panel width). Demo mode keeps the drawn typing dots unless the
 * URL asks for a phase: /home?new=chat&buddy=thinking|working|writing|slow|stopped (Stop / Continue / Try again then work locally).
 */

const CAREER_BUDDY_ROUTE = '/profile/filling/career-buddy';

const DEMO_MESSAGES = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Akwaaba, Kofi! I’m Career Buddy. I can help you build your profile, find roles and get ready for interviews.',
  },
  {
    id: 'm2',
    sender: 'bot',
    text: 'Your avatar looks great. Next up is Interests. Want me to suggest a few based on frontend work in Accra?',
  },
  { id: 'm3', sender: 'user', text: 'What does Discoverable mean?' },
  {
    id: 'm4',
    sender: 'bot',
    text: 'It’s your first milestone, at 3 of 9 stages. Recruiters can then find you in search, and you can apply to roles. You’re 2 stages away, about 10 minutes.',
  },
];

const DEMO_SUGGESTIONS = [
  'Suggest my interests',
  'Which roles pay well in Accra?',
  'Show me around',
];

const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold whitespace-nowrap text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-default disabled:opacity-60';

/* Maximize (Figma panel header, right of the title: four corner brackets, 16px, white). */
const ChatPanelMaximizeIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
  </svg>
);

const HEADER_BTN =
  'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.15)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const CARD_LINK =
  'flex w-full max-w-[330px] cursor-pointer items-center gap-[10px] rounded-[16px] border border-[rgba(28,42,33,0.1)] bg-white px-[14px] py-[12px] text-left [filter:drop-shadow(0_2px_4px_rgba(28,42,33,0.04))_drop-shadow(0_1px_1px_rgba(28,42,33,0.04))] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green';

const BuddyAvatar = () => (
  <span className="flex size-[28px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-white">
    <img src={buddy26} alt="" aria-hidden="true" className="size-[26px]" />
  </span>
);

/** A card that opens the full Career Buddy screen (same conversation). */
const OpenFullCard = ({ title, sub, onClick }) => (
  <div className="flex pl-[36px]">
    <button type="button" onClick={onClick} className={CARD_LINK}>
      <span className="flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#ebf1ec]">
        <InterestsHeartIcon className="size-[16px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="text-[14px] font-semibold text-[#1c2a21]">{title}</span>
        {sub ? <span className="text-[12px] text-[#595959]">{sub}</span> : null}
      </span>
      <GreenArrowRightIcon className="size-[18px] shrink-0" />
    </button>
  </div>
);

/**
 * One message. Bot bubbles may carry bullets + a follow-up line (agent blocks), and `cards` - the opportunity match
 * cards (2026-10-27: they only rendered on the full screen, so a match reply here was just its lead line).
 */
const Bubble = ({ m, cards = null }) => {
  if (m.sender !== 'bot') {
    const text = m.file ? `📎 ${m.file.name || m.text || 'File'}` : m.text;
    return (
      <div className="flex justify-end">
        <p
          className={`m-0 max-w-[280px] rounded-[18px_18px_4px_18px] px-[14px] py-[12px] text-[14px] leading-[21px] ${
            m.auto ? 'bg-[#ebf1ec] text-[#1c2a21]' : 'bg-brand-green text-white'
          }`}
        >
          {text}
        </p>
      </div>
    );
  }
  const bubble = (
    <div className="flex items-end gap-[8px]">
      <BuddyAvatar />
      <div className="m-0 flex max-w-[330px] flex-col gap-[6px] rounded-[18px_18px_18px_4px] border border-[#e7e7e7] bg-white px-[14px] py-[12px] text-[14px] leading-[21px] whitespace-pre-line text-[#1c2a21]">
        {m.text ? <p className="m-0">{m.text}</p> : null}
        {m.bullets?.length ? (
          <ul className="m-0 flex list-disc flex-col gap-[2px] pl-[18px]">
            {m.bullets.map((b, i) => (
              <li key={i}>{typeof b === 'string' ? b : b.label ? `${b.label}: ${b.value}` : ''}</li>
            ))}
          </ul>
        ) : null}
        {m.followUp ? <p className="m-0">{m.followUp}</p> : null}
      </div>
    </div>
  );
  if (!cards) return bubble;
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      {bubble}
      <div className="min-w-0 pl-[34px] text-[14px] leading-[21px] text-[#1c2a21]">{cards}</div>
    </div>
  );
};

const CareerBuddyFirstChat = ({ home }) => {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const logRef = useRef(null);
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  // Real account -> real Career Buddy; demo states (?state=...) keep the Figma script.
  const live = Boolean(home?.live) && LIVE_AVAILABLE;
  const L = useCareerBuddyLive({ enabled: live });
  log('mount', { live });

  const close = () => {
    log('close');
    home?.update?.({ new: null });
  };
  const openFull = () => {
    log('open full Career Buddy');
    navigate(CAREER_BUDDY_ROUTE);
  };
  // Header buttons (Figma): maximize = the same conversation on the full Career Buddy screen;
  // history = that screen with its conversation list open. Demo mode has no destination.
  const maximize = () => {
    if (!live) return log('maximize: demo has no full screen conversation');
    log('maximize -> full Career Buddy');
    navigate(CAREER_BUDDY_ROUTE);
  };
  const openHistory = () => {
    if (!live) return log('history: no destination in Figma');
    log('history -> full Career Buddy, history open');
    navigate(`${CAREER_BUDDY_ROUTE}?history=1`);
  };

  // Demo: ?buddy=<phase> draws one reply-in-progress row; Stop / Continue / Try again move it between phases.
  const [demoPhase, setDemoPhase] = useState(() =>
    live ? null : new URLSearchParams(window.location.search).get('buddy')
  );
  const demoThinking = !live && demoPhase ? buddyDemoThinking(demoPhase) : null;
  const thinkingMessage = live
    ? L.enrichedMessages.find((m) => m.id === THINKING_ID)
    : demoThinking
      ? {
          id: THINKING_ID,
          thinking: {
            ...demoThinking,
            onContinue: () => setDemoPhase('writing'),
            onTryAgain: () => setDemoPhase('thinking'),
          },
        }
      : null;
  const thinkingPhase = thinkingMessage?.thinking?.phase;
  // "Stop generating" shows while an answer is on its way (working / writing / slow); Esc does the same.
  const stopVisible = ['working', 'writing', 'slow'].includes(thinkingPhase);
  const stop = () => {
    log('stop generating', { phase: thinkingPhase, live });
    if (live) L.handleStop();
    else setDemoPhase('stopped');
  };

  usePlayfulDialogA11y({
    open: true,
    dialogRef,
    onEscape: () => {
      if (stopVisible) {
        log('branch: Esc stops the answer');
        stop();
      } else close();
    },
    initialFocus: () => inputRef.current,
    lockScroll: true,
  });

  const messages = live ? L.messages : DEMO_MESSAGES;
  const thinking = live ? messages.some((m) => m.id === THINKING_ID) : !demoPhase;
  const shown = messages.filter((m) => m.id !== THINKING_ID);
  const suggestions = live ? L.suggestedReplies : DEMO_SUGGESTIONS;
  const typedAnything = shown.some((m) => m.sender === 'user' && !m.auto);
  const nextStage = live ? L.panelStages.find((s) => s.status === 'not-started') : null;
  const lastBot = [...shown].reverse().find((m) => m.sender === 'bot');
  // Things the panel can't show: a section to review, a report, a practice review.
  const needsFull =
    live && lastBot && (lastBot.reviewSection || lastBot.report || lastBot.practiceReview);

  // Keep the newest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown.length, thinking, thinkingPhase, thinkingMessage?.thinking?.text]);

  const send = (text) => {
    const t = String(text || '').trim();
    if (!t) return;
    if (!live) {
      log('send (demo): no reply copy in Figma', { length: t.length });
      setDraft('');
      return;
    }
    L.handleSend(t);
    setDraft('');
  };

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
              <span className="truncate">
                {live && L.busy ? 'Typing…' : 'Online · replies in seconds'}
              </span>
            </p>
          </div>
          <button
            type="button"
            aria-label="History"
            title="Your conversations"
            className={HEADER_BTN}
            onClick={openHistory}
          >
            <ChatHistoryClockIcon className="size-[16px]" />
          </button>
          <button
            type="button"
            aria-label="Maximize"
            title="Open the full Career Buddy screen (this conversation carries on)"
            className={HEADER_BTN}
            onClick={maximize}
          >
            <ChatPanelMaximizeIcon className="size-[16px] text-white" />
          </button>
          <button type="button" aria-label="Close" className={HEADER_BTN} onClick={close}>
            <ChatPanelCloseIcon className="size-[16px]" />
          </button>
        </header>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto bg-[#f7f8f4] p-[clamp(12px,1.16vw,20px)]"
        >
          <span className="inline-flex h-[32px] w-fit items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
            Today
          </span>
          {shown.map((m) => (
            <Bubble
              key={m.id}
              m={m}
              cards={
                live && m.opportunities?.length ? L.renderOpportunities(m, { compact: true }) : null
              }
            />
          ))}
          {needsFull ? (
            <OpenFullCard
              title={lastBot.reviewSection ? 'Review it in Career Buddy' : 'See it in Career Buddy'}
              sub="Opens the full screen. Your conversation carries on there."
              onClick={openFull}
            />
          ) : null}
          {live && !typedAnything && !thinking && nextStage ? (
            <OpenFullCard
              title={`Continue: ${nextStage.trailLabel || nextStage.label || 'your profile'}`}
              sub="Build your profile with Career Buddy"
              onClick={openFull}
            />
          ) : null}
          {!live ? (
            <OpenFullCard
              title="Continue: Interests"
              sub="About 2 min · +50 pts"
              onClick={() => {
                log('branch: continue interests');
                navigate('/profile/filling/interests');
              }}
            />
          ) : null}
          {thinkingMessage ? (
            <BuddyThinking {...thinkingMessage.thinking} />
          ) : thinking ? (
            <div className="flex pl-[36px]">
              <ChatTypingIndicatorIllustration className="h-[29px] w-[55px]" />
            </div>
          ) : null}
        </div>

        {stopVisible ? (
          <div className="flex shrink-0 justify-center bg-white pt-[10px]">
            <StopGeneratingPill onStop={stop} />
          </div>
        ) : null}

        {suggestions.length ? (
          <div className="flex shrink-0 flex-wrap items-start gap-[8px] bg-white px-[clamp(12px,1.16vw,20px)] pt-[12px] pb-[4px]">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className={CHIP}
                disabled={live && L.busy}
                onClick={() => {
                  log('suggestion', { s, live });
                  if (live) send(s);
                  else {
                    setDraft(s);
                    inputRef.current?.focus();
                  }
                }}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="flex shrink-0 items-center gap-[10px] bg-white px-[clamp(12px,1.16vw,20px)] pt-[12px] pb-[18px]"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
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
            disabled={live && (L.busy || !draft.trim())}
            className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border border-[rgba(28,42,33,0.1)] bg-brand-green disabled:cursor-default disabled:opacity-60 playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:[filter:drop-shadow(0_10px_12px_rgba(28,42,33,0.06))_drop-shadow(5px_5px_0_rgba(28,42,33,0.55))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
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
