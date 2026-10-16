import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../../ui/Button.jsx';
import { ArrowRightIcon } from '../../shared/assets.jsx';
import logo from '../../../assets/entry/tut-video-logo.png';
import playHeader from '../../../assets/entry/tut-play-header.svg';
import closeIcon from '../../../assets/entry/tut-close.svg';
import infoIcon from '../../../assets/entry/tut-info.svg';
import playCircle from '../../../assets/entry/tut-play-circle.svg';
import chevBack from '../../../assets/entry/tut-chevron-back.svg';
import chevNext from '../../../assets/entry/tut-chevron-next.svg';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('LoginTutorialModal');

/*
 * LoginTutorialModal - "How to register on GTH" tutorial opened from the login
 * right panel's Watch Tutorial button.
 * Figma (group 'Group 16' over the login screen):
 *   8027:207819  view 'video'  - 600 wide card 'div.vid-card': header, 'coming soon'
 *                video placeholder (3:12), 4 chapters, footer hint + 'Got It'.
 *   8027:208116  view 'steps'  - 680 wide 'div#tutModal': header, 4 progress dots,
 *                'Step n of 4' slide, footer (Step n of 4 / Back / Next).
 * Scrim = #1c2a21 @ 70%.
 *
 * Wiring (assumption, Figma has no connector): Watch Tutorial -> 'video' view;
 * the big play circle opens the written 'steps' walkthrough (the video is
 * 'coming soon'); Got It / close / Esc / scrim close the dialog.
 * Copy for steps 2-4 is NOT in Figma (their text layers are empty): heading =
 * chapter title and body = chapter description from the video chapter list.
 *
 * a11y: role=dialog aria-modal aria-labelledby, focus moves in, Tab is trapped,
 * Esc closes, focus is restored to the opener, body scroll locked, arrow keys
 * skip chapters (video view) / steps (steps view).
 */

const CHAPTERS = [
  {
    time: '0:00',
    title: 'Choose your role',
    desc: 'Student, Parent, or Recruiter picking the right one',
  },
  { time: '0:42', title: 'Date of birth', desc: 'How age determines your experience on GTH' },
  {
    time: '1:15',
    title: 'Your details',
    desc: 'Name, contact, location, and education building your profile',
  },
  {
    time: '2:10',
    title: "If you're under 18",
    desc: 'The parent contact step and why your account is still live straight away',
  },
];

const ROLE_BULLETS = [
  'Student — discovering your strengths and finding opportunities',
  "Parent — supporting and tracking your child's progress",
  'Recruiter — finding and hiring Ghanaian talent',
];

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Icons are exports of Figma nodes (see notes_entry.md): header play 8027:208037,
// close 8027:208045, info 8027:208051, play circle 8027:208065, chevrons 8027:208412/208417,
// video logo 8027:208060.
const Img = ({ src, w, h, className }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    width={w}
    height={h}
    draggable={false}
    className={className}
  />
);

const Header = ({ onClose, titleId }) => (
  <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e6e6e6] bg-[#fefdfa] px-6 py-3 max-sm:px-4">
    <div className="flex min-w-0 items-center gap-2">
      <Img src={playHeader} w={28} h={28} className="shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5 px-1">
        <h2 id={titleId} className="truncate text-[14px] font-bold leading-[17px] text-brand-green">
          How to register on GTH
        </h2>
        <p aria-hidden="true" className="truncate text-[10px] leading-3 text-[#70706e]">
          How to register on GTH
        </p>
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close tutorial"
      className="relative flex size-7 shrink-0 items-center justify-center rounded-full before:absolute before:-inset-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
    >
      <Img src={closeIcon} w={28} h={28} />
    </button>
  </div>
);

const VideoView = ({ active, setActive, onPlay, onDone }) => (
  <>
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-[22px] pb-0 pt-2 max-sm:px-3">
      <div
        className="relative flex aspect-[556/313] w-full flex-col items-center justify-center overflow-hidden rounded-2xl"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(105,218,120,0.18), transparent 60%), linear-gradient(160deg, #2f6b39 0%, #1d4a25 100%)',
        }}
      >
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[32%] w-[12.8%] -translate-x-1/2 "
          draggable={false}
        />
        <button
          type="button"
          onClick={onPlay}
          aria-label="Play tutorial video"
          className="absolute left-1/2 top-[40%] flex size-[60px] -translate-x-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white max-sm:size-12"
        >
          <Img src={playCircle} w={60} h={60} className="size-full" />
        </button>
        <div className="absolute inset-x-0 top-[70%] flex flex-col items-center gap-2 text-center">
          <p className="font-heading text-[19px] font-semibold leading-[23.75px] tracking-[-0.026em] text-white/70 max-sm:text-[16px]">
            Ghana Talent Hub
          </p>
          <p className="text-[10px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-white/30">
            Onboarding tutorial · Coming soon
          </p>
        </div>
        <span className="absolute bottom-2.5 right-3 rounded bg-[#1c2a21]/30 px-2 py-1 text-[10px] font-bold leading-3 text-white">
          3:12
        </span>
      </div>

      <div className="mt-5 border-t-2 border-[#f8f8f4] pt-3">
        <p className="text-[10px] font-bold uppercase leading-[13px] tracking-[1px] text-[#babab7]">
          Chapters
        </p>
        <ul className="mt-2 flex flex-col pb-3" aria-label="Chapters">
          {CHAPTERS.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={on ? 'true' : undefined}
                  className={classNames(
                    'flex h-[51px] w-full items-center gap-4 rounded-[10px] border px-[10px] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green max-sm:gap-2',
                    on ? 'border-[#c1d4c4] bg-[#ebf1ec]' : 'border-transparent'
                  )}
                >
                  <span
                    className={classNames(
                      'w-[25px] shrink-0 text-[10px] font-semibold leading-[14px]',
                      on ? 'text-brand-green' : 'text-[#babab7]'
                    )}
                  >
                    {c.time}
                  </span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'flex shrink-0 items-center justify-center rounded-full',
                      on
                        ? 'size-6 bg-brand-green text-[9px] font-bold text-white'
                        : 'size-7 border border-[#c1d4c4] bg-[#ebf1ec] text-[15px] font-semibold text-[#142916]'
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={classNames(
                        'truncate text-[13px] font-semibold leading-4',
                        on ? 'text-brand-green' : 'text-[#1c2a21]'
                      )}
                    >
                      {c.title}
                    </span>
                    <span
                      className={classNames(
                        'truncate text-[10px] leading-[14px] max-sm:text-[11px]',
                        i === 1 ? 'text-[#959592]' : 'text-[#70706e]'
                      )}
                    >
                      {c.desc}
                    </span>
                  </span>
                  {on && (
                    <span className="shrink-0 rounded-full bg-brand-green px-2.5 py-0.5 text-[10px] font-medium leading-3 text-white">
                      Playing
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#e6e6e6] bg-[#fefdfa] px-[34px] py-3 max-sm:px-4">
      <p className="flex items-center gap-1 text-[12px] leading-[15px] text-[#70706e] max-sm:hidden">
        <Img src={infoIcon} w={14} h={14} />
        Use arrow keys to skip between chapters
      </p>
      <Button
        variant="primary"
        size="md"
        rightIcon={<ArrowRightIcon />}
        onClick={onDone}
        className="max-sm:w-full"
      >
        Got It
      </Button>
    </div>
  </>
);

const StepsView = ({ step, setStep, onDone }) => {
  const total = CHAPTERS.length;
  const c = CHAPTERS[step];
  return (
    <>
      <div
        className="flex shrink-0 items-center justify-center gap-[7px] py-[13px]"
        aria-hidden="true"
      >
        {CHAPTERS.map((_, i) => (
          <span
            key={i}
            className={classNames(
              'h-[7px] rounded-full transition-all',
              i === step ? 'w-[22px] bg-brand-green' : 'w-[7px] bg-[#ebf1ec]'
            )}
          />
        ))}
      </div>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-2 max-sm:px-4">
        <div className="flex items-center gap-7 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
          <div
            aria-hidden="true"
            className="relative flex h-[180px] w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#c1d4c4] bg-[#ebf1ec] max-sm:h-24 max-sm:w-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 35%, rgba(56,116,64,0.12), transparent 70%)',
            }}
          >
            {step === 0 && <span className="mb-8 text-[48px] leading-none max-sm:mb-0">🎓</span>}
            <span className="absolute bottom-3 left-3 right-3 text-center text-[10px] font-bold uppercase tracking-[1px] text-[#2a5730]">
              {c.title}
            </span>
            <span className="absolute -bottom-2 right-3 text-[60px] font-semibold leading-none text-brand-green/10">
              {step + 1}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2" aria-live="polite">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase leading-[13px] tracking-[1px] text-brand-green">
              <span aria-hidden="true" className="h-0.5 w-[18px] rounded-sm bg-[#c1d4c4]" />
              Step {step + 1} of {total}
            </p>
            <h3 className="font-heading text-[26px] font-semibold leading-[32.5px] tracking-[-0.02em] text-[#111111] max-sm:text-[22px] max-sm:leading-7">
              {step === 0 ? (
                <>
                  Pick your <span className="text-brand-green">role</span> to get started.
                </>
              ) : (
                c.title
              )}
            </h3>
            {step === 0 ? (
              <>
                <p className="text-[13px] leading-[18.5px] text-[#70706e]">
                  GTH is built for everyone in Ghana&apos;s talent ecosystem. Choose the role that
                  describes you best — you can always update it later.
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {ROLE_BULLETS.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2 text-[12px] font-bold leading-[15px] text-[#575755]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full border border-[#c1d4c4] bg-[#ebf1ec] text-[8px] font-normal text-[#2a5730]"
                      >
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-[13px] leading-[18.5px] text-[#70706e]">{c.desc}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[rgba(28,42,33,0.06)] px-6 py-4 max-sm:px-4">
        <p className="text-[12px] font-medium leading-[15px] text-[#babab7]">
          Step {step + 1} of {total}
        </p>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex h-[38px] items-center gap-1.5 rounded-[10px] border border-[#c6c6c3] px-[21px] text-[13px] font-semibold text-[#70706e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:opacity-60 max-sm:h-11"
          >
            <Img src={chevBack} w={13} h={13} />
            Back
          </button>
          <button
            type="button"
            onClick={() => (step === total - 1 ? onDone() : setStep(step + 1))}
            className="flex h-10 items-center gap-1.5 rounded-[10px] border border-[#2a5730] bg-brand-green px-[22px] text-[13px] font-semibold text-white shadow-[0_3px_0_0_#224626] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-sm:h-11"
          >
            {step === total - 1 ? 'Got It' : 'Next'}
            <Img src={chevNext} w={13} h={13} />
          </button>
        </div>
      </div>
    </>
  );
};

export default function LoginTutorialModal({ isOpen, onClose, initialView = 'video' }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const [view, setView] = useState(initialView);
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(0);

  const close = useCallback(() => {
    log('close');
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    log('open', { initialView });
    setView(initialView);
    setChapter(0);
    setStep(0);
    openerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector(FOCUSABLE)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus?.();
    };
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const prev = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (next || prev) {
      const delta = next ? 1 : -1;
      const clamp = (n) => Math.min(CHAPTERS.length - 1, Math.max(0, n));
      if (view === 'video') setChapter((c) => clamp(c + delta));
      else setStep((s) => clamp(s + delta));
      e.preventDefault();
    }
  };

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c2a21]/70 p-4 max-sm:p-2"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        className={classNames(
          'flex max-h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_64px_rgba(0,0,0,0.3)]',
          view === 'video' ? 'max-w-[600px]' : 'max-w-[680px]'
        )}
      >
        <Header onClose={close} titleId={titleId} />
        {view === 'video' ? (
          <VideoView
            active={chapter}
            setActive={setChapter}
            onPlay={() => {
              log('play -> steps view');
              setView('steps');
            }}
            onDone={close}
          />
        ) : (
          <StepsView step={step} setStep={setStep} onDone={close} />
        )}
      </div>
    </div>,
    document.body
  );
}
