import { classNames } from '../../utils/classNames.js';
import CareerBuddyAvatar from '../shared/CareerBuddyAvatar.jsx';
import {
  BuddyIconArrowRight,
  BuddyIconCheck,
  BuddyIconRefresh,
  BuddyIconSparkle,
} from '../shared/assets.jsx';
import { usePlayfulScope } from './PlayfulScope.js';

/*
 * BuddyThinking — what Career Buddy shows while it works on a reply (Figma section "Buddy thinking states · Playful + Focused",
 * 8988:509558 / 8993:511908). Five phases, each drawn in both styles (Focused is the default, Playful via `playful:` variants / copy):
 *   thinking  first second       "Looking at" chips + three skeleton lines
 *   working   longer task        sub line, three steps (done / active / next), progress "Step 2 of 3"
 *   writing   streaming          the words so far + two skeleton lines
 *   slow      over 10 s          sub line, progress with elapsed seconds, two skeleton lines (Stop stays visible)
 *   stopped   the talent stopped the answer: partial text, "You stopped this answer", Continue / Try again
 * The avatar is the 48px buddy with a spinning ring + glow (no ring/glow when stopped); Playful adds two twinkling sparkles.
 * The "Stop generating" pill is a separate piece (`StopGeneratingPill`) the chat footer places above the input.
 *
 * Props: phase, lookingAt string[], sub string, steps [{ id, label, state: 'done' | 'active' | 'next' }], stepText "Step 2 of 3",
 *        progress 0..1, elapsed (seconds), text (partial answer), onContinue(), onTryAgain().
 */

const LABELS = {
  thinking: { focused: 'Thinking', playful: 'Buddy’s thinking' },
  working: { focused: 'Working on it', playful: 'Buddy’s on it' },
  slow: { focused: 'Still working', playful: 'Still on it, big search' },
};

const SKELETON =
  'buddy-shimmer block h-[10px] rounded-[5px] bg-[#ebf1ec] [background-position:100%_0]';

const Skeleton = ({ widths, className }) => (
  <span className={classNames('flex flex-col gap-[8px]', className)} aria-hidden="true">
    {widths.map((w) => (
      <span key={w} className={SKELETON} style={{ width: w }} />
    ))}
  </span>
);

export const BuddyThinkingAvatar = ({ active = true }) => (
  <span className="relative block size-[48px] shrink-0" aria-hidden="true">
    {active ? (
      <>
        <span className="absolute -inset-[2px] rounded-full bg-[#387440]/[0.14] blur-[8px] playful:bg-[#f3c84b]/35" />
        <span
          className="buddy-spin absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 90deg, #c8951a 0%, #387440 45%, rgba(56,116,64,0.15) 75%, rgba(200,149,26,0) 100%)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
        />
      </>
    ) : null}
    <span className="absolute inset-[5px] box-border overflow-hidden rounded-full border-2 border-solid border-white">
      <CareerBuddyAvatar size={34} className="absolute left-0 top-0" />
    </span>
    <BuddyIconSparkle className="buddy-twinkle absolute left-[44px] top-[3px] hidden size-[12px] text-[#387440] playful:block" />
    <BuddyIconSparkle className="buddy-twinkle absolute left-[-6px] top-[34px] hidden size-[9px] text-[#387440] [animation-delay:0.6s] playful:block" />
  </span>
);

const Header = ({ label }) => (
  <span className="flex h-[22px] items-center gap-[8px]">
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#ebf1ec] playful:bg-[#fef3d1]">
      <BuddyIconSparkle className="size-[14px] text-[#387440] playful:text-[#c8951a]" />
    </span>
    <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#387440]">
      {label}
    </span>
  </span>
);

const Chip = ({ children }) => (
  <span className="inline-flex h-[20px] items-center rounded-full bg-[#ebf1ec] px-[8px] py-[3px] font-sans text-[11.5px] font-semibold leading-[14px] text-[#387440] playful:h-[22px] playful:border playful:border-solid playful:border-[#1c2a21]">
    {children}
  </span>
);

const StepMark = ({ state }) => {
  if (state === 'done') {
    return (
      <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
        <BuddyIconCheck className="size-[14px]" />
      </span>
    );
  }
  if (state === 'active') {
    return (
      <span className="buddy-spin box-border size-[20px] shrink-0 rounded-full border-[2.5px] border-solid border-[#ebf1ec] border-t-[#387440]" />
    );
  }
  return (
    <span className="box-border size-[20px] shrink-0 rounded-full border-[1.5px] border-solid border-[#c1d4c4]" />
  );
};

const Steps = ({ steps }) => (
  <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
    {steps.map((s) => (
      <li key={s.id} className="flex min-h-[20px] items-center gap-[10px]">
        <StepMark state={s.state} />
        <span
          className={classNames(
            'font-sans text-[13.5px] leading-[16px]',
            s.state === 'done' && 'font-normal text-[#1c2a21]/70',
            s.state === 'active' && 'font-semibold text-[#1c2a21]',
            s.state === 'next' && 'font-normal text-[#737373]'
          )}
        >
          {s.label}
        </span>
      </li>
    ))}
  </ol>
);

const Progress = ({ value, text }) => (
  <span className="flex items-center gap-[10px]">
    <span className="relative block h-[6px] min-w-0 flex-1 overflow-hidden rounded-[3px] bg-[#ebf1ec]">
      <span
        className="absolute inset-y-0 left-0 rounded-[3px] bg-[#387440] transition-[width] duration-500"
        style={{ width: `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%` }}
      />
    </span>
    <span className="shrink-0 font-sans text-[12px] font-medium leading-[14px] text-[#737373]">
      {text}
    </span>
  </span>
);

const ActionPill = ({ icon, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex shrink-0 cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#ebf1ec] bg-[#ebf1ec] px-[12px] py-[6px] font-sans text-[12.5px] font-semibold leading-[15px] text-[#387440] hover:bg-[#e1eae2] playful:border-[#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
  >
    {icon}
    {children}
  </button>
);

const BuddyThinking = ({
  phase = 'thinking',
  lookingAt = [],
  sub = '',
  steps = [],
  stepText = '',
  progress = 0,
  elapsed = 0,
  text = '',
  onContinue,
  onTryAgain,
}) => {
  const playful = usePlayfulScope();
  const label = LABELS[phase] ? (playful ? LABELS[phase].playful : LABELS[phase].focused) : '';
  const width =
    phase === 'thinking'
      ? 'w-[340px]'
      : phase === 'working' || phase === 'slow'
        ? 'w-[360px]'
        : 'w-[420px]';
  const statusText =
    phase === 'writing'
      ? 'Career Buddy is writing'
      : phase === 'stopped'
        ? 'Answer stopped'
        : label;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={statusText}
      className="flex max-w-full items-start gap-[12px]"
      data-buddy-phase={phase}
    >
      <BuddyThinkingAvatar active={phase !== 'stopped'} />
      <div
        className={classNames(
          'flex min-w-0 max-w-[calc(100%-60px)] flex-col gap-[12px] rounded-[6px_20px_20px_20px] border border-solid border-[#c1d4c4] bg-white px-[18px] py-[14px] shadow-[0_6px_18px_rgba(56,116,64,0.08)] playful:border-[1.5px] playful:border-[#1c2a21] playful:shadow-[3px_3px_0_#1c2a21]',
          width
        )}
      >
        {phase === 'thinking' ? (
          <>
            <Header label={label} />
            {lookingAt.length > 0 ? (
              <span className="flex flex-wrap items-center gap-[6px]">
                <span className="font-sans text-[12px] font-medium leading-[14px] text-[#6b736e]">
                  Looking at
                </span>
                {lookingAt.map((c) => (
                  <Chip key={c}>{c}</Chip>
                ))}
              </span>
            ) : null}
            <Skeleton widths={['100%', '87%', '58%']} />
          </>
        ) : null}

        {phase === 'working' ? (
          <>
            <Header label={label} />
            {sub ? (
              <span className="font-sans text-[12.5px] leading-[15px] text-[#737373]">{sub}</span>
            ) : null}
            <Steps steps={steps} />
            <Progress value={progress} text={stepText} />
          </>
        ) : null}

        {phase === 'writing' ? (
          <>
            <span className="whitespace-pre-line font-sans text-[14.5px] leading-[22px] text-[#1c2a21]">
              {text}
            </span>
            <Skeleton widths={['72%', '56%']} className="opacity-60" />
          </>
        ) : null}

        {phase === 'slow' ? (
          <>
            <Header label={label} />
            {sub ? (
              <span className="font-sans text-[12.5px] leading-[15px] text-[#737373]">{sub}</span>
            ) : null}
            <Progress value={progress} text={`${elapsed} s`} />
            <Skeleton widths={['95%', '66%']} />
          </>
        ) : null}

        {phase === 'stopped' ? (
          <>
            {text ? (
              <span className="whitespace-pre-line font-sans text-[14.5px] leading-[1.19] text-[#1c2a21]/70">
                {text}
              </span>
            ) : null}
            <span className="flex flex-wrap items-center justify-between gap-x-[8px] gap-y-[8px]">
              <span className="flex items-center gap-[8px]">
                <span
                  className="size-[9px] shrink-0 rounded-[2px] bg-[#6b736e]"
                  aria-hidden="true"
                />
                <span className="font-sans text-[12.5px] font-medium leading-[15px] text-[#737373]">
                  You stopped this answer
                </span>
              </span>
              <span className="flex items-center gap-[9px]">
                <ActionPill
                  icon={<BuddyIconArrowRight className="size-[14px]" />}
                  onClick={onContinue}
                >
                  Continue
                </ActionPill>
                <ActionPill
                  icon={<BuddyIconRefresh className="size-[14px]" />}
                  onClick={onTryAgain}
                >
                  Try again
                </ActionPill>
              </span>
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

/* Footer pill above the input while an answer is on its way (Figma "Stop generating", 189x39 at the pane's centre). */
export const StopGeneratingPill = ({ onStop }) => (
  <button
    type="button"
    onClick={onStop}
    className="inline-flex shrink-0 cursor-pointer items-center gap-[8px] self-center rounded-full border border-solid border-[#c1d4c4] bg-white py-[8px] pl-[14px] pr-[10px] font-sans text-[13.5px] font-semibold leading-[16px] text-[#1c2a21] shadow-[0_4px_12px_rgba(28,42,33,0.08)] playful:border-[1.5px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]"
  >
    <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-[#1c2a21]">
      <span className="size-[8px] rounded-[1.5px] bg-white" />
    </span>
    Stop generating
    <kbd className="rounded-[6px] bg-[#ebf1ec] px-[6px] py-[2px] font-sans text-[11px] font-medium leading-[13px] text-[#737373]">
      Esc
    </kbd>
  </button>
);

export default BuddyThinking;
