import { useCallback, useId, useRef, useState } from 'react';
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
import { useParentDialogA11y } from './useParentDialogA11y.js';

const log = debug('ParentTutorialModal');

/*
 * ParentTutorialModal — "How to register on GTH" tutorial for the parent Path A
 * onboarding, opened from the right panel's Watch Tutorial button.
 *
 * Figma (parents file, canvas "Parents onboarding(PATH A)", section 'Tutorial'
 * 2951:85861):
 *   2951:85862  video modal  — 600 wide card: header, 'coming soon' player,
 *               4 chapters ('Playing' pill + times), arrow-keys hint, 'Got It'.
 *   2951:88966  stepper, step 1 of 4 — 680 wide: header, 4 dots, slide, footer.
 *   2952:94350  stepper, step 2 of 4 — same shell, 'Your ward is already live'.
 * The shell, icons and a11y mirror the talent LoginTutorialModal (read-only
 * reference); copy is the parent Figma copy.
 *
 * Wiring (assumption, Figma has no connector): Watch Tutorial opens the 'video'
 * view; the big play circle opens the written 'steps' walkthrough (the video is
 * "coming soon"); Got It / close / Esc / scrim close the dialog.
 *
 * ⚠️ ASSUMPTIONS — Figma frame 2952:94350 labels itself "Step 2 of 4" above and
 * "Step 1 of 4" in the footer, and its body text repeats step 1's. Here the
 * eyebrow and footer always agree. Steps 1-2 use the drawn Figma copy (step 1's
 * copy is the talent "Pick your role" copy as drawn — flagged to design). Steps
 * 3-4 are NOT drawn: they reuse the parent chapter title + description from the
 * video chapter list (Figma text), nothing new is written.
 *
 * a11y: role=dialog aria-modal aria-labelledby; focus moves in, Tab trapped, Esc
 * closes, focus returns to the opener (useParentDialogA11y); arrow keys skip
 * chapters (video view) / steps (steps view).
 */

const CHAPTERS = [
  {
    time: '0:00',
    title: "Kofi's account is already active.",
    desc: "He registered himself. You don't need to approve anything",
  },
  {
    time: '0:42',
    title: 'If you have concerns, you can remove his access.',
    desc: 'One button in your parent dashboard — access removed in 60 seconds. Reversible any time.',
  },
  {
    time: '1:15',
    title: 'Your details',
    desc: 'Name, contact, location, and education building your profile',
  },
  {
    time: '2:10',
    title: 'No action = Kofi stays active',
    desc: 'If you complete registration and do nothing, the platform continues running for him normally.',
  },
];

const INTRO =
  "GTH is built for everyone in Ghana's talent ecosystem. Choose the role that describes you best — you can always update it later.";

// Steps 1-2: drawn Figma copy (frames 2951:88966 and 2952:94350).
const STEP_ROLE_BULLETS = [
  ['Student', ' — discovering your strengths and finding opportunities'],
  ['Parent', " — supporting and tracking your child's progress"],
  ['Recruiter', ' — finding and hiring Ghanaian talent'],
];
const STEP_LIVE_BULLETS = [
  ['No approval needed', ' — Kofi is active whether or not you register'],
  ['Opt out any time', " — supporting and tracking your child's progress"],
  ['No action = stays active', ' — platform runs normally if you do nothing'],
];

const FOCUS_ARROW_KEYS = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];

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
        <p aria-hidden="true" className="truncate text-[12px] leading-4 text-[#70706e]">
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
          className="absolute left-1/2 top-[32%] w-[12.8%] -translate-x-1/2"
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
          <p className="text-[12px] font-semibold uppercase leading-[14px] tracking-[1.2px] text-white/60">
            Onboarding tutorial · Coming soon
          </p>
        </div>
        <span className="absolute bottom-2.5 right-3 rounded bg-[#1c2a21]/30 px-2 py-1 text-[12px] font-bold leading-3 text-white">
          3:12
        </span>
      </div>

      <div className="mt-5 border-t-2 border-[#f8f8f4] pt-3">
        <p className="text-[12px] font-bold uppercase leading-[13px] tracking-[1px] text-[#959592]">
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
                    'flex min-h-[51px] w-full items-center gap-4 rounded-[10px] border px-[10px] py-1 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green max-sm:gap-2',
                    on ? 'border-[#c1d4c4] bg-[#ebf1ec]' : 'border-transparent'
                  )}
                >
                  <span
                    className={classNames(
                      'w-[28px] shrink-0 text-[12px] font-semibold leading-[14px]',
                      on ? 'text-brand-green' : 'text-[#959592]'
                    )}
                  >
                    {c.time}
                  </span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      'flex shrink-0 items-center justify-center rounded-full',
                      on
                        ? 'size-6 bg-brand-green text-[11px] font-bold text-white'
                        : 'size-7 border border-[#c1d4c4] bg-[#ebf1ec] text-[15px] font-semibold text-[#142916]'
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={classNames(
                        'text-[13px] font-semibold leading-4 sm:truncate',
                        on ? 'text-brand-green' : 'text-[#1c2a21]'
                      )}
                    >
                      {c.title}
                    </span>
                    <span className="text-[12px] leading-[14px] text-[#70706e] sm:truncate">
                      {c.desc}
                    </span>
                  </span>
                  {on && (
                    <span className="shrink-0 rounded-full bg-brand-green px-2.5 py-0.5 text-[12px] font-medium leading-3 text-white">
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

const Bullets = ({ items }) => (
  <ul className="mt-2 flex flex-col gap-2">
    {items.map(([lead, rest]) => (
      <li key={lead} className="flex items-start gap-2 text-[12px] leading-[15px] text-[#575755]">
        <span
          aria-hidden="true"
          className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full border border-[#c1d4c4] bg-[#ebf1ec] text-[9px] font-normal text-[#2a5730]"
        >
          ✓
        </span>
        <span>
          <span className="font-bold">{lead}</span>
          {rest}
        </span>
      </li>
    ))}
  </ul>
);

// Slide content per step. Heading runs: [text, accent?]
const stepSlide = (step) => {
  if (step === 0) {
    return {
      label: 'Choose your role',
      heading: (
        <>
          Pick your <span className="text-brand-green">role</span> to get started.
        </>
      ),
      body: (
        <>
          <p className="text-[13px] leading-[18.5px] text-[#70706e]">{INTRO}</p>
          <Bullets items={STEP_ROLE_BULLETS} />
        </>
      ),
    };
  }
  if (step === 1) {
    return {
      label: 'Your ward is live',
      heading: (
        <>
          Your ward is already <span className="text-brand-green">live</span>
        </>
      ),
      body: (
        <>
          <p className="text-[13px] leading-[18.5px] text-[#70706e]">{INTRO}</p>
          <Bullets items={STEP_LIVE_BULLETS} />
        </>
      ),
    };
  }
  const c = CHAPTERS[step];
  return {
    label: c.title,
    heading: c.title,
    body: <p className="text-[13px] leading-[18.5px] text-[#70706e]">{c.desc}</p>,
  };
};

const StepsView = ({ step, setStep, onDone }) => {
  const total = CHAPTERS.length;
  const slide = stepSlide(step);
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
            <span className="absolute bottom-3 left-3 right-3 text-center text-[12px] font-bold uppercase tracking-[1px] text-[#2a5730]">
              {slide.label}
            </span>
            <span className="absolute -bottom-2 right-3 text-[60px] font-semibold leading-none text-brand-green/10">
              {step + 1}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2" aria-live="polite">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase leading-[13px] tracking-[1px] text-brand-green">
              <span aria-hidden="true" className="h-0.5 w-[18px] rounded-sm bg-[#c1d4c4]" />
              Step {step + 1} of {total}
            </p>
            <h3 className="font-heading text-[26px] font-semibold leading-[32.5px] tracking-[-0.02em] text-[#111111] max-sm:text-[22px] max-sm:leading-7">
              {slide.heading}
            </h3>
            {slide.body}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[rgba(28,42,33,0.06)] px-6 py-4 max-sm:px-4">
        <p className="text-[12px] font-medium leading-[15px] text-[#959592]">
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

export default function ParentTutorialModal({ onClose, initialView = 'video' }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const [view, setView] = useState(initialView);
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(0);

  const close = useCallback(() => {
    log('close');
    onClose?.();
  }, [onClose]);

  useParentDialogA11y({ dialogRef, onClose: close });

  const onKeyDown = (e) => {
    if (!FOCUS_ARROW_KEYS.includes(e.key)) return;
    // Arrow keys skip chapters / steps; leave them alone on the real buttons'
    // native behaviour (none) — they are not inputs, so this is safe.
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const clamp = (n) => Math.min(CHAPTERS.length - 1, Math.max(0, n));
    if (view === 'video') setChapter((c) => clamp(c + delta));
    else setStep((s) => clamp(s + delta));
    e.preventDefault();
  };

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1c2a21]/70 p-4 max-sm:p-2"
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
