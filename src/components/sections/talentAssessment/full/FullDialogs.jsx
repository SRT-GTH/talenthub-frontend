import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { usePlayfulDialogA11y } from '../../../ui/PlayfulDialogA11y.js';
import { LabArrowRightIcon } from '../../talentSkillsLab/LabPlayIcons.jsx';
import { fillTokens } from '../../talentSkillsLab/labFormat.js';
import { INK_CARD } from '../../talentSkillsLab/labPlayStyles.js';
import {
  FullAlarmClockIcon,
  FullLogOutIcon,
  FullTimeClockIcon,
  FullWifiOffIcon,
} from './FullIcons.jsx';
import { fmtClock } from './fullFlow.js';

const log = debug('FullDialogs');

/*
 * FullDialogs — the three small confirmations of the full assessment (Figma "Talent My Assessment"):
 *   ResumeDialog   MA-11 connection lost   Playful 7985:10960 / Focused 8110:34831
 *   TimeUpDialog   MA-12 time is up        Playful 7985:11131 / Focused 8110:34982
 *   LeaveDialog    MA-13 leave             Playful 7985:11291 / Focused 8110:35134
 * Card: 520 wide, white, r24, p32, gap16, everything centred. Tile 72x72 r22 with a 36px glyph, Bricolage title (Playful) /
 * SF Pro Rounded (Focused), 14.5/22 grey body, then the button row. Playful = 1.5px ink@.55 border + hard shelf, Focused =
 * hairline + soft shadows. The page behind stays visible under a #1c2a21@.55 scrim.
 *
 * Props — ResumeDialog { copy, answered, left, windowLeft, index, onSaveExit, onResume }, TimeUpDialog { copy, answered,
 * pct (frozen % for the frame, null = animate over 5 s), onResult }, LeaveDialog { copy, onLeave, onKeep }.
 */
const Shell = ({ labelId, onClose, children }) => {
  const ref = useRef(null);
  usePlayfulDialogA11y({
    open: true,
    dialogRef: ref,
    onEscape: onClose,
    initialFocus: () => ref.current,
    lockScroll: true,
  });
  useEffect(() => {
    log('dialog mount', labelId);
  }, [labelId]);
  return createPortal(
    <div
      data-pf-portal=""
      className="fixed inset-0 z-[60] flex overflow-y-auto bg-[rgba(28,42,33,0.55)] p-[12px] sm:p-[16px]"
      onMouseDown={(e) => {
        if (onClose && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        style={{ outline: 'none' }}
        className={classNames(
          'relative m-auto flex w-full max-w-[520px] flex-col items-center gap-[16px] rounded-[24px] bg-white p-[clamp(20px,6vw,32px)] text-center outline-none',
          INK_CARD
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const Tile = ({ tone, children }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'inline-flex size-[72px] shrink-0 items-center justify-center rounded-[22px]',
      tone
    )}
  >
    {children}
  </span>
);

const Title = ({ id, size, children }) => (
  <h2
    id={id}
    className={classNames(
      'm-0 font-sans font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading',
      size === 'lg'
        ? 'text-[clamp(24px,6.5vw,28px)] leading-[1.2]'
        : 'text-[clamp(22px,6vw,26px)] leading-[1.2]'
    )}
  >
    {children}
  </h2>
);

const Body = ({ children }) => (
  <p className="m-0 w-full font-sans text-[14.5px] leading-[22px] font-normal text-[#595959] max-lg:text-[14px]">
    {children}
  </p>
);

/* Two buttons side by side (Figma draws a tertiary lg 56 and a primary sm 48 / lg 56, top aligned); stacked below sm. */
const Row = ({ a, b, children }) => {
  const [first, second] = children;
  return (
    <div className="flex w-full items-start gap-[12px] max-sm:flex-col max-sm:items-stretch">
      <div className="min-w-0 max-sm:w-full" style={{ flex: `${a} 1 0%` }}>
        {first}
      </div>
      <div className="min-w-0 max-sm:w-full" style={{ flex: `${b} 1 0%` }}>
        {second}
      </div>
    </div>
  );
};

const Tertiary = ({ onClick, children }) => (
  <Button
    variant="tertiary"
    size="lg"
    onClick={onClick}
    className="w-full max-lg:whitespace-normal"
  >
    {children}
  </Button>
);

const arrow = <LabArrowRightIcon className="size-[20px]" />;

export const ResumeDialog = ({ copy, answered, left, windowLeft, index, onSaveExit, onResume }) => {
  const titleId = useId();
  const vars = { answered, left, window: fmtClock(windowLeft), n: index + 1 };
  return (
    <Shell labelId={titleId} onClose={null}>
      <Tile tone="bg-[#faf4e8] text-[#463409]">
        <FullWifiOffIcon className="size-[36px]" />
      </Tile>
      <Title id={titleId}>{copy.title}</Title>
      <Body>{fillTokens(copy.body, vars)}</Body>
      <span className="inline-flex items-center gap-[8px] rounded-full bg-[#f8f8f4] px-[16px] py-[10px] font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
        <FullTimeClockIcon className="size-[16px]" />
        {fillTokens(copy.window, vars)}
      </span>
      <Row a={220} b={220}>
        <Tertiary onClick={onSaveExit}>{copy.secondary}</Tertiary>
        <Button
          variant="primary"
          size="lg"
          onClick={onResume}
          rightIcon={arrow}
          className="w-full max-lg:whitespace-normal"
        >
          {fillTokens(copy.primary, vars)}
        </Button>
      </Row>
    </Shell>
  );
};

const SCORING_MS = 5000;

export const TimeUpDialog = ({ copy, answered, pct = null, onResult }) => {
  const titleId = useId();
  const [fill, setFill] = useState(pct ?? 0);
  // ⚠️ ASSUMPTION: the "About 5 seconds" bar fills over 5 s; a frame seed (`pct`) holds the drawn 60% until first input.
  useEffect(() => {
    if (pct !== null) return undefined;
    const start = Date.now();
    const id = window.setInterval(() => {
      setFill(Math.min(100, ((Date.now() - start) / SCORING_MS) * 100));
    }, 100);
    return () => window.clearInterval(id);
  }, [pct]);
  return (
    <Shell labelId={titleId} onClose={null}>
      <Tile tone="bg-[#f9ebea] text-[#902b20]">
        <FullAlarmClockIcon className="size-[36px]" />
      </Tile>
      <Title id={titleId} size="lg">
        {copy.title}
      </Title>
      <Body>{fillTokens(copy.body, { answered })}</Body>
      <div className="flex w-full flex-col gap-[8px]">
        <div className="flex w-full items-center justify-between gap-[8px] font-sans">
          <span className="text-[13.5px] leading-[16px] font-semibold text-[#1c2a21] max-lg:text-[14px]">
            {copy.progress}
          </span>
          <span className="text-[13px] leading-[16px] font-normal text-[#595959] max-lg:text-[14px]">
            {copy.eta}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label={copy.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(fill)}
          className="h-[8px] w-full overflow-hidden rounded-full bg-[#ebebe3]"
        >
          <div className="h-full rounded-full bg-[#387440]" style={{ width: `${fill}%` }} />
        </div>
      </div>
      <Button
        variant="primary"
        size="lg"
        onClick={onResult}
        rightIcon={arrow}
        className="w-full max-lg:whitespace-normal"
      >
        {copy.primary}
      </Button>
    </Shell>
  );
};

export const LeaveDialog = ({ copy, onLeave, onKeep }) => {
  const titleId = useId();
  return (
    <Shell labelId={titleId} onClose={onKeep}>
      <Tile tone="bg-[#f9ebea] text-[#902b20]">
        <FullLogOutIcon className="size-[36px]" />
      </Tile>
      <Title id={titleId}>{copy.title}</Title>
      <Body>{copy.body}</Body>
      <Row a={236} b={204}>
        <Tertiary onClick={onLeave}>{copy.secondary}</Tertiary>
        <Button
          variant="primary"
          size="sm"
          onClick={onKeep}
          className="w-full max-lg:whitespace-normal"
        >
          {copy.primary}
        </Button>
      </Row>
    </Shell>
  );
};

/*
 * SubmitDialog — live runs only (server-scored assessments): "Scoring your answers…" while POST
 * /engagement/assessments/score is in flight, then an error state with a retry if it fails. Same shell as the
 * MA-11/12/13 dialogs. ⚠️ ASSUMPTION: no Figma frame (the drawn TypeScript run scored in the browser).
 */
export const SubmitDialog = ({ error = null, onRetry, onExit }) => {
  const titleId = useId();
  return (
    <Shell labelId={titleId} onClose={null}>
      <Title id={titleId} size="lg">
        {error ? "We couldn't submit your answers" : 'Scoring your answers'}
      </Title>
      <Body>
        {error
          ? 'Your answers are still saved on this device. Check your connection and try again.'
          : 'This takes a few seconds. Please keep this page open.'}
      </Body>
      {error ? (
        <div className="flex w-full flex-col gap-[10px]">
          <Button variant="primary" size="lg" onClick={onRetry} className="w-full">
            Try again
          </Button>
          <Tertiary onClick={onExit}>Save and exit</Tertiary>
        </div>
      ) : (
        <div
          role="progressbar"
          aria-label="Scoring your answers"
          className="h-[8px] w-full overflow-hidden rounded-full bg-[#ebebe3]"
        >
          <div className="h-full w-1/3 animate-pulse rounded-full bg-[#387440]" />
        </div>
      )}
    </Shell>
  );
};
