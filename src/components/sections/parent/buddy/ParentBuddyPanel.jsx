import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { debug } from '../../../../utils/debug.js';
import { ChatComposerMicIcon, WhiteArrowRightIcon } from '../../../shared/assets.jsx';
import BuddyThinking, { StopGeneratingPill } from '../../../ui/BuddyThinking.jsx';
import buddy42 from '../../../../assets/talent-home/flows/career-buddy-avatar-42.png';
import buddy26 from '../../../../assets/talent-home/flows/career-buddy-avatar-26.png';
import { PANEL, PHASES, PHASE_IDS } from './buddyData.js';

const log = debug('ParentBuddyPanel');

const TILE =
  'flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#ebf1ec] p-0 text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const CHIP =
  'inline-flex h-[32px] cursor-pointer items-center rounded-full border border-solid border-[#dde6df] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const Svg = ({ children }) => (
  <svg
    viewBox="0 0 16 16"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/*
 * ParentBuddyPanel — the parent's Ask Buddy panel (Figma "Career Buddy panel" 10089:4076 on PB-01 … PB-05): 480 wide, 16px from the viewport edges, r24, #dde6df hairline, over a #0b1a0f 35 % scrim;
 * a white header (history tile, 44px avatar ring, "Career Buddy" / "Online · replies in seconds", expand and close tiles), a #fafbf9 conversation ("Today", Buddy's greeting, the parent's question and the
 * reply-in-progress row), a suggestions row (drawn only after an answer was stopped; its space is always kept), the composer and the disclaimer. The reply-in-progress rows are `ui/BuddyThinking`.
 * URL: `?buddy=open` (panel, no answer on the way) | `thinking` PB-01 | `working` PB-02 | `writing` PB-03 | `slow` PB-04 | `stopped` PB-05, on any parent page.
 * Props: phase ('open' or a PHASES key), onPhase(next) (Stop → stopped, Continue → writing, Try again → thinking), onClose.
 * ⚠️ ASSUMPTION: Figma draws the five states, not the thread behind them: sending a question starts the thinking → working → writing sequence on a timer with the drawn sample answer (no backend), and the
 * "open" panel (no frame) is the greeting alone. History and expand only log.
 */
const ParentBuddyPanel = ({ phase, onPhase, onClose }) => {
  const dialogRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const [draft, setDraft] = useState('');
  const [asked, setAsked] = useState(phase !== 'open');
  const thinking = PHASE_IDS.includes(phase) ? PHASES[phase] : null;
  const stopVisible = ['working', 'writing', 'slow'].includes(phase);

  useEffect(() => {
    log('mount', { phase });
    inputRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [phase, asked]);

  // A question the parent sends walks the drawn states on a timer (⚠️ ASSUMPTION, see above); frames opened by URL stay where they are.
  const auto = useRef(false);
  useEffect(() => {
    const next = { thinking: 'working', working: 'writing' }[phase];
    if (!auto.current || !next) return undefined;
    const t = setTimeout(() => onPhase(next), phase === 'thinking' ? 1500 : 3000);
    return () => clearTimeout(t);
  }, [phase, onPhase]);

  const stop = () => {
    log('stop generating', { phase });
    onPhase('stopped');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (stopVisible) stop();
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const send = (text) => {
    const t = String(text || '').trim();
    if (!t) return;
    log('send', { length: t.length });
    setDraft('');
    setAsked(true);
    auto.current = true;
    onPhase('thinking');
  };

  const sequence = {
    ...(thinking || {}),
    onContinue: () => onPhase('writing'),
    onTryAgain: () => onPhase('thinking'),
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] bg-[#0b1a0f]/35" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={PANEL.name}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute top-[16px] right-[16px] bottom-[16px] flex w-[min(480px,calc(100vw-32px))] flex-col overflow-hidden rounded-[24px] border border-solid border-[#dde6df] bg-white font-sans shadow-[0_24px_64px_rgba(11,26,15,0.2),0_2px_6px_rgba(11,26,15,0.08)] max-lg:top-[8px] max-lg:right-[8px] max-lg:bottom-[8px] max-lg:w-[min(480px,calc(100vw-16px))]"
      >
        <header className="flex shrink-0 items-center gap-[12px] border-0 border-b border-solid border-[#dde6df] py-[18px] pr-[18px] pl-[20px]">
          <button
            type="button"
            aria-label="History"
            className={TILE}
            onClick={() => log('history (no screen drawn)')}
          >
            <Svg>
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4.8V8l2.2 1.4" />
            </Svg>
          </button>
          <span className="flex size-[44px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-solid border-[#387440] bg-[#ebf1ec]">
            <img src={buddy42} alt="" aria-hidden="true" className="size-[40px] rounded-full" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
            <h2 className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
              {PANEL.name}
            </h2>
            <p className="m-0 flex items-center gap-[6px] text-[12px] leading-[14px] font-medium whitespace-nowrap text-[#6b736d]">
              <span aria-hidden="true" className="size-[8px] shrink-0 rounded-full bg-[#387440]" />
              <span className="truncate">{PANEL.status}</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Expand"
            className={TILE}
            onClick={() => log('expand (no screen drawn)')}
          >
            <Svg>
              <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
            </Svg>
          </button>
          <button type="button" aria-label="Close" className={TILE} onClick={onClose}>
            <Svg>
              <path d="M4 4l8 8M12 4l-8 8" />
            </Svg>
          </button>
        </header>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto bg-[#fafbf9] p-[20px]"
        >
          <span className="inline-flex h-[32px] w-fit items-center rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]">
            {PANEL.today}
          </span>
          <div className="flex items-end gap-[8px]">
            <span className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-solid border-[#dde6df] bg-white">
              <img src={buddy26} alt="" aria-hidden="true" className="size-[30px] rounded-full" />
            </span>
            <p className="m-0 max-w-[330px] bg-[#f2f5f2] px-[14px] py-[12px] text-[14px] leading-[21px] text-[#1c2a21] [border-radius:16px_16px_16px_4px]">
              {PANEL.greeting}
            </p>
          </div>
          {asked ? (
            <div className="flex justify-end">
              <p className="m-0 max-w-[240px] bg-[#387440] px-[14px] py-[12px] text-[14px] leading-[21px] text-white [border-radius:16px_16px_4px_16px]">
                {PANEL.question}
              </p>
            </div>
          ) : null}
          {thinking ? (
            <div className="pr-[36px]">
              <BuddyThinking {...sequence} />
            </div>
          ) : null}
        </div>

        <div className="relative flex min-h-[88px] shrink-0 flex-wrap content-start items-start gap-[8px] bg-white px-[20px] pt-[12px] pb-[4px]">
          {PANEL.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={`${CHIP} ${phase === 'stopped' ? '' : 'invisible'}`}
              tabIndex={phase === 'stopped' ? 0 : -1}
              aria-hidden={phase === 'stopped' ? undefined : true}
              onClick={() => {
                log('suggestion', s);
                setDraft(s);
                inputRef.current?.focus();
              }}
            >
              {s}
            </button>
          ))}
          {stopVisible ? (
            <div className="absolute inset-x-0 top-[8px] flex justify-center">
              <StopGeneratingPill onStop={stop} />
            </div>
          ) : null}
        </div>

        <form
          className="flex shrink-0 items-center gap-[10px] bg-white pt-[12px] pr-[20px] pb-[18px] pl-[20px]"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-[8px] rounded-[16px] border border-solid border-[#dde6df] bg-white py-[12px] pr-[14px] pl-[16px] shadow-[0_2px_8px_rgba(28,42,33,0.06)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              aria-label="Message Career Buddy"
              placeholder={PANEL.placeholder}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[14px] leading-[17px] text-[#1c2a21] outline-none placeholder:text-[#595959]"
            />
            <ChatComposerMicIcon className="size-[18px] shrink-0" />
          </div>
          <button
            type="submit"
            aria-label="Send"
            className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[14px] border-0 bg-[#387440] shadow-[0_4px_12px_rgba(56,116,64,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <WhiteArrowRightIcon className="size-[20px]" />
          </button>
        </form>
        <p className="m-0 shrink-0 bg-white px-[20px] pb-[14px] text-[12px] leading-[16px] text-[#595959]">
          {PANEL.disclaimer}
        </p>
      </div>
    </div>,
    document.body
  );
};

export default ParentBuddyPanel;
