import { useEffect, useRef, useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import careerBuddyAvatar from '../../../assets/talent-messages/help-reply/career-buddy-avatar.png';
import { HelpCloseIcon, HelpDraftSparkleIcon, HelpLockIcon, HelpSparkleIcon } from './cIcons.jsx';
import {
  REPLY_COPY,
  REPLY_SUGGESTIONS_RESPONSE,
  REPLY_TONES,
  REPLY_WRITING_MS,
  getReplyDraft,
} from './helpReplyData.js';
import { useMessagesDraft } from './messagesDraft.js';

const log = debug('HelpReplyPanel');

/*
 * HelpReplyPanel — "Help me reply" (Career Buddy AI), Figma Talent Messages H-01…H-04 (+ collapsed twins).
 * Props: { messages } = the useMessagesState() object. Renders nothing unless `messages.reply` is set:
 *   ideas   H-01  reply ideas + tone pills
 *   writing H-02  "Buddy is writing" (animated dots + skeleton; static under prefers-reduced-motion / calm chat)
 *   draft   H-03  draft + Use this reply / Make it shorter / More formal / Try again
 *   placed  H-04  panel is gone, the "Drafted with Buddy" note (with Undo) sits above the composer
 * PLACEMENT: it is drawn INSIDE the conversation column, between the thread and the composer (the thread shrinks),
 * not as an overlay — mount it as a normal-flow block right above the composer. Below `lg` it becomes a bottom sheet
 * (fixed, with a dimmed backdrop). Esc / the close button remove `?reply`.
 * Test hook: `?hold=1` stops the writing step from auto-advancing (so H-02 can be screenshotted).
 */

const PANEL_BASE =
  'flex flex-col gap-[clamp(10px,0.93vw,16px)] border-[1.2px] border-solid border-[rgba(0,82,43,0.12)] bg-white ' +
  'px-[clamp(12px,1.04vw,18px)] py-[clamp(10px,0.93vw,16px)] rounded-[20px] ' +
  'shadow-[0_-4px_17px_rgba(31,69,38,0.06)] playful:shadow-[0_-6px_24px_rgba(31,69,38,0.12)] ' +
  'max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:max-h-[85dvh] max-lg:overflow-y-auto ' +
  'max-lg:rounded-b-none max-lg:pb-[max(16px,env(safe-area-inset-bottom))]';

const BODY_TEXT =
  'text-[clamp(13px,0.87vw,15px)] leading-[1.47] tracking-[0.2px] max-lg:text-[14px]';
// The first idea is drawn in the chip's gradient "hover" look (Figma 7463:4846). Literal classes: Tailwind JIT cannot
// see the Button's forced-state string once it has been rewritten at runtime.
const CHIP_RECOMMENDED =
  'border-transparent text-[#ebf1ec] bg-[linear-gradient(173.211deg,rgba(20,41,22,0.9)_0%,rgba(42,87,48,0.9)_100%)]';
const CHIP_CLASS = 'max-lg:text-[14px] max-lg:px-3 max-lg:py-1.5 text-[clamp(13px,0.87vw,15px)]';

const HelpReplyPanel = ({ messages }) => {
  const { reply, update, calm } = messages;
  const { draft: composerDraft, setDraft } = useMessagesDraft();
  const [ideaId, setIdeaId] = useState(REPLY_SUGGESTIONS_RESPONSE.ideas[0].id);
  const tone = REPLY_SUGGESTIONS_RESPONSE.defaultTone; // only the drawn Friendly tone has a draft
  const updateRef = useRef(update);
  const panelRef = useRef(null);
  const firstChipRef = useRef(null);
  const useBtnRef = useRef(null);
  const hold =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('hold') === '1';

  useEffect(() => {
    updateRef.current = update;
  });

  useEffect(() => {
    log('step', reply);
  }, [reply]);

  // writing -> draft after a short timer
  useEffect(() => {
    if (reply !== 'writing' || hold) return undefined;
    log('writing: timer started', REPLY_WRITING_MS, 'ms');
    const t = setTimeout(() => {
      log('writing: done -> draft');
      updateRef.current({ reply: 'draft' });
    }, REPLY_WRITING_MS);
    return () => clearTimeout(t);
  }, [reply, hold]);

  // Esc closes the panel states (not the placed note)
  const open = reply === 'ideas' || reply === 'writing' || reply === 'draft';
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        log('Esc -> close');
        updateRef.current({ reply: null });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // keep keyboard focus inside the panel as the step changes (not when the page itself loads on a ?reply= URL)
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      if (reply) return;
    }
    if (reply === 'ideas') firstChipRef.current?.focus({ preventScroll: true });
    else if (reply === 'draft') useBtnRef.current?.focus({ preventScroll: true });
    else if (reply === 'writing') panelRef.current?.focus({ preventScroll: true });
  }, [reply]);

  // H-04 (?reply=placed) opened directly: the composer already holds the drawn placed draft.
  useEffect(() => {
    if (reply === 'placed' && !composerDraft) {
      const placed = REPLY_SUGGESTIONS_RESPONSE.ideas[0].drafts.friendly.placedText;
      log('placed URL opened directly -> seed composer with the drawn draft');
      setDraft(placed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply]);

  if (!reply) return null;

  const { idea, draft } = getReplyDraft(ideaId, 'friendly');
  const animate = !calm;

  const close = () => {
    log('close');
    update({ reply: null });
  };
  const pickIdea = (id) => {
    const picked = REPLY_SUGGESTIONS_RESPONSE.ideas.find((i) => i.id === id);
    if (picked?.drawn === false) {
      log('idea has no drawn result in Figma:', id);
      return;
    }
    log('idea picked:', id);
    setIdeaId(id);
    update({ reply: 'writing' });
  };
  const regenerate = () => {
    log('try again');
    update({ reply: 'writing' });
  };
  const useThis = () => {
    const text = draft.placedText ?? draft.text;
    log('use this reply -> composer, chars:', text.length);
    setDraft(text);
    update({ reply: 'placed' });
  };
  // Undo is drawn but not what it does, so it only logs.
  const undo = () => {
    log('undo tapped: behaviour not drawn in Figma');
  };

  if (reply === 'placed') {
    return (
      <div
        role="status"
        className="flex w-fit max-w-full items-center gap-2 rounded-full bg-[#ebf1ec] px-3 py-1.5"
      >
        <HelpDraftSparkleIcon className="size-3 shrink-0 text-[#387440]" />
        <span className="text-[12px] leading-[14px] font-medium tracking-[0.2px] text-[#2d5d33]">
          {REPLY_COPY.placedNote}
        </span>
        <button
          type="button"
          onClick={undo}
          className="inline-flex min-h-6 shrink-0 cursor-pointer items-center text-[13px] leading-4 font-semibold tracking-[0.2px] text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:text-[12px]"
        >
          {REPLY_COPY.undo}
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
      />
      <section
        ref={panelRef}
        tabIndex={-1}
        aria-label={REPLY_COPY.title}
        className={classNames(PANEL_BASE, 'outline-none')}
      >
        <header className="flex items-center gap-2.5">
          <img
            src={careerBuddyAvatar}
            alt=""
            width="36"
            height="36"
            className="size-9 shrink-0 rounded-full"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <div className="flex items-center gap-1.5">
              <h2 className="font-sans text-[15px] leading-[18px] font-semibold tracking-[0.2px] text-[#1c2a21]">
                {REPLY_COPY.title}
              </h2>
              <HelpSparkleIcon className="size-[14px] shrink-0 text-[#c8951a]" />
            </div>
            <p className="flex items-center gap-1 text-[12px] leading-[14px] tracking-[0.2px] text-[#737373]">
              <HelpLockIcon className="size-3 shrink-0" />
              <span>{REPLY_COPY.privacy}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={REPLY_COPY.close}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f8f8f4] text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <HelpCloseIcon />
          </button>
        </header>

        {reply === 'ideas' && (
          <>
            <p className={classNames(BODY_TEXT, 'text-[#595959]')}>
              {REPLY_SUGGESTIONS_RESPONSE.prompt}
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Reply ideas">
              {REPLY_SUGGESTIONS_RESPONSE.ideas.map((item, i) => (
                <Button
                  key={item.id}
                  ref={i === 0 ? firstChipRef : undefined}
                  variant="chip"
                  className={classNames(CHIP_CLASS, i === 0 && CHIP_RECOMMENDED)}
                  aria-disabled={item.drawn === false ? true : undefined}
                  onClick={() => pickIdea(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label={REPLY_COPY.toneLabel}
            >
              <span className="text-[12px] leading-[14px] font-medium tracking-[0.2px] text-[#737373]">
                {REPLY_COPY.toneLabel}
              </span>
              {REPLY_TONES.map((t) => {
                const on = t.id === tone;
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    aria-disabled={t.id !== 'friendly' ? true : undefined}
                    onClick={() => log('tone pill: only Friendly has a drawn draft', t.id)}
                    className={classNames(
                      'inline-flex min-h-6 cursor-pointer items-center rounded-full px-3 py-[5px] text-[12px] leading-[14px] font-medium tracking-[0.2px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                      on ? 'bg-[#387440] text-white' : 'bg-[#f8f8f4] text-[#595959]'
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {reply === 'writing' && (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col gap-[clamp(10px,0.93vw,16px)]"
          >
            <div className="flex items-center gap-2">
              <span className="flex shrink-0 items-center gap-2" aria-hidden="true">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className={classNames(
                      'size-2 rounded-full bg-[#387440]',
                      animate && 'animate-pulse motion-reduce:animate-none'
                    )}
                    style={animate ? { animationDelay: `${n * 200}ms` } : undefined}
                  />
                ))}
              </span>
              <span className="text-[14px] leading-[17px] tracking-[0.2px] text-[#595959]">
                {idea.writing}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="flex flex-col gap-2 rounded-[14px] bg-[#f8f8f4] p-[clamp(10px,0.81vw,14px)]"
            >
              {['91%', '84%', '50%'].map((w) => (
                <span
                  key={w}
                  style={{ width: w }}
                  className={classNames(
                    'h-3 max-w-full rounded-md bg-[#e1eae2]',
                    animate && 'animate-pulse motion-reduce:animate-none'
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {reply === 'draft' && (
          <>
            <p className={classNames(BODY_TEXT, 'text-[#595959]')}>{REPLY_COPY.draftIntro}</p>
            <div className="flex flex-col gap-2.5 rounded-[14px] border border-solid border-[#e1eae2] bg-[#f8f8f4] p-[clamp(12px,0.93vw,16px)]">
              <p className={classNames(BODY_TEXT, 'text-[#1c2a21]')}>{draft.text}</p>
              <p className="flex items-center gap-2 text-[12px] leading-[14px] tracking-[0.2px] text-[#737373]">
                <HelpDraftSparkleIcon className="size-3 shrink-0 text-[#387440]" />
                <span>{draft.meta}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <Button ref={useBtnRef} variant="primary" size="sm" onClick={useThis}>
                {REPLY_COPY.useThis}
              </Button>
              <Button
                variant="chip"
                className={CHIP_CLASS}
                onClick={() => log('make it shorter: no drawn result')}
              >
                {REPLY_COPY.shorter}
              </Button>
              <Button
                variant="chip"
                className={CHIP_CLASS}
                onClick={() => log('more formal: no drawn result')}
              >
                {REPLY_COPY.formal}
              </Button>
              <Button variant="chip" className={CHIP_CLASS} onClick={regenerate}>
                {REPLY_COPY.tryAgain}
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default HelpReplyPanel;
