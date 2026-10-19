import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HubShieldIcon } from '../talentSkillsLab/HubIcons.jsx';
import {
  AssessChatIcon,
  AssessChevronRightIcon,
  AssessEditIcon,
  AssessGameIcon,
} from './AssessmentIcons.jsx';

const log = debug('AssessmentParts');

/*
 * AssessmentParts — the My Assessment building blocks (Figma "Talent My Assessment" 7962:530, section 0 components
 * 7990:10805: GTH · Evidence rung 7990:10836, GTH · Trait card 7990:10853, GTH · Assessment history row 7990:10862) plus the
 * evidence chips every My Assessment screen shares. Focused is the default look, Playful only through `playful:` variants.
 *
 *   EvidenceChip      kind: assessment | game | ai | self · tone: 'full' (icon + label, the skills list / legend) or
 *                     'recruiter' (label only, MA-07) · Playful chips are 32px tall, Focused 22px (the AI chip is a 32px
 *                     outline chip in BOTH styles — that is how both frames draw it).
 *   HistoryChip       the small 22px chip of a history row (kind: tag | game | assessment | ai).
 *   EvidenceRung      state: done | current | next · icon (node) · title · text · chipLabel (default per state).
 *   TraitCard         name · percentileLabel ("88th percentile") · percent (0-100 bar fill) · description · level
 *                     ("Strong") · tone: green | gold | dark (bar colour; MA-02 draws Agreeableness gold, Extraversion dark) ·
 *                     percentileClassName (text colour of the percentile, default green).
 *   AssessmentHistoryRow  date · title · sub · chip {kind, label} · to (row link) · divider 'top' (default: the overview draws a hairline above every row) | 'bottom' | 'none'.
 */

const EVIDENCE_KINDS = {
  assessment: { label: 'Assessment-evidenced' },
  game: { label: 'Game-evidenced' },
  ai: { label: 'AI-validated in chat' },
  self: { label: 'Self-reported' },
};

const KIND_ICON = {
  assessment: <HubShieldIcon className="size-[13px] shrink-0 playful:size-[14px]" />,
  game: <AssessGameIcon className="size-[13px] shrink-0 playful:size-[14px]" />,
  ai: <AssessChatIcon className="size-[14px] shrink-0" />,
  self: <AssessEditIcon className="size-[13px] shrink-0 playful:size-[14px]" />,
};

/* Chip shells. COMPACT = the Focused 22px chip that grows to the Playful 32px chip. */
const CHIP_BASE =
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-solid font-sans font-semibold';
const COMPACT =
  'h-[22px] gap-[4px] pl-[8px] pr-[10px] text-[12px] leading-[14px] playful:h-[32px] playful:gap-[6px] playful:px-[14px] playful:text-[13px] playful:leading-[16px]';
const OUTLINE_32 =
  'h-[32px] gap-[6px] border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] text-[#595959]';

const CHIP_TONE = {
  full: {
    assessment: `${COMPACT} border-transparent bg-[#387440] text-white playful:border-[#1c2a21] playful:bg-[#1c2a21]`,
    game: `${COMPACT} border-transparent bg-[#e8f2ed] text-[#1d7c4d] playful:border-[#c1d4c4] playful:bg-[#ebf1ec] playful:text-[#387440]`,
    ai: OUTLINE_32,
    self: `${COMPACT} border-transparent bg-[#faf4e8] text-[#785910] playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]`,
  },
  recruiter: {
    assessment: `${COMPACT} !px-[10px] border-transparent bg-[#387440] text-white playful:!px-[14px] playful:border-[#1c2a21] playful:bg-[#1c2a21]`,
    game: `${COMPACT} !px-[10px] border-transparent bg-[#ebf1ec] text-[#2a5730] playful:!px-[14px] playful:border-[#c1d4c4] playful:text-[#387440]`,
    ai: OUTLINE_32,
    self: `${COMPACT} !px-[10px] border-transparent bg-[#faf4e8] text-[#463409] playful:!px-[14px] playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]`,
  },
};

/* Icon colours (the Playful frames colour the glyph differently from the label). */
const ICON_COLOR = {
  assessment: 'text-white playful:text-[#387440]',
  game: 'text-[#1d7c4d] playful:text-[#595959]',
  ai: 'text-[#387440]',
  self: 'text-[#785910] playful:text-[#387440]',
};

export const EvidenceChip = ({ kind, tone = 'full', className }) => {
  const meta = EVIDENCE_KINDS[kind];
  return (
    <span className={classNames(CHIP_BASE, CHIP_TONE[tone][kind], className)}>
      {tone === 'full' ? (
        <span aria-hidden="true" className={classNames('inline-flex', ICON_COLOR[kind])}>
          {KIND_ICON[kind]}
        </span>
      ) : null}
      {meta.label}
    </span>
  );
};

/* Small history-row chip (Figma `chip · …` inside GTH · Assessment history row). */
const HISTORY_CHIP = {
  tag: 'border-transparent bg-[#ebf1ec] text-[#2a5730]',
  game: 'border-transparent bg-[#ebf1ec] text-[#2a5730]',
  assessment: 'border-transparent bg-[#387440] text-white',
  ai: 'border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21] playful:border-[#1c2a21]',
};

export const HistoryChip = ({ kind = 'tag', children, className }) => (
  <span
    className={classNames(
      'inline-flex h-[22px] shrink-0 items-center whitespace-nowrap rounded-full border border-solid px-[10px] font-sans text-[12px] font-semibold leading-[14px] max-sm:h-auto max-sm:min-h-[22px]',
      HISTORY_CHIP[kind],
      className
    )}
  >
    {children}
  </span>
);

/* GTH · Assessment history row — 900x61 in the component, full width in the History card. */
export const AssessmentHistoryRow = ({ date, title, sub, chip, to, divider = 'top' }) => {
  const body = (
    <>
      <span className="w-[64px] shrink-0 font-sans text-[13px] font-semibold leading-[16px] text-[#595959] max-sm:w-[52px] max-sm:text-[12px]">
        {date}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
          {title}
        </span>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959] max-sm:text-[12px]">
          {sub}
        </span>
      </span>
      <HistoryChip kind={chip.kind}>{chip.label}</HistoryChip>
      <AssessChevronRightIcon className="size-[18px] shrink-0 text-[#595959]" />
    </>
  );
  const cls = classNames(
    'flex items-center gap-[16px] border-0 border-solid border-[rgba(28,42,33,0.08)] py-[12px] no-underline max-sm:gap-[10px]',
    divider === 'top' && 'border-t',
    divider === 'bottom' && 'border-b',
    to &&
      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]'
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={() => log('history row ->', to)}>
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
};

/* GTH · Evidence rung (component set 7990:10836: State = Done | Current | Next). */
const RUNG = {
  done: {
    card: 'border-[rgba(28,42,33,0.12)] bg-white',
    tile: 'bg-[#ebf1ec] text-[#387440]',
    chip: 'border-transparent bg-[#ebf1ec] text-[#2a5730]',
    title: 'text-[#1c2a21]',
    chipLabel: 'Done',
  },
  current: {
    card: 'border-[#387440] bg-[#ebf1ec] border-[1px] playful:border-[2px]',
    tile: 'bg-white text-[#387440]',
    chip: 'border-transparent bg-[#387440] text-white',
    title: 'text-[#1c2a21]',
    chipLabel: 'You are here',
  },
  next: {
    card: 'border-[rgba(28,42,33,0.12)] bg-white',
    tile: 'bg-[#f8f8f4] text-[#595959]',
    chip: 'border-[rgba(28,42,33,0.12)] bg-[#ffd86b] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]',
    title: 'text-[#595959]',
    chipLabel: 'Next',
  },
};

export const EvidenceRung = ({ state = 'done', icon, title, text, chipLabel, className }) => {
  const r = RUNG[state];
  return (
    <div
      className={classNames(
        'flex min-w-0 flex-col gap-[8px] rounded-[16px] border border-solid p-[16px]',
        r.card,
        className
      )}
    >
      <div className="flex items-center gap-[8px]">
        <span
          aria-hidden="true"
          className={classNames(
            'flex size-[34px] shrink-0 items-center justify-center rounded-[10px]',
            r.tile
          )}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1" />
        <span
          className={classNames(
            'inline-flex h-[21px] shrink-0 items-center rounded-full border border-solid px-[10px] font-sans text-[11px] font-semibold leading-[13px] max-lg:text-[12px]',
            r.chip
          )}
        >
          {chipLabel ?? r.chipLabel}
        </span>
      </div>
      <p
        className={classNames(
          'm-0 font-sans text-[15px] font-semibold leading-[18px] max-lg:text-[15px]',
          r.title
        )}
      >
        {title}
      </p>
      <p className="m-0 font-sans text-[12.5px] leading-[15px] text-[#595959] max-lg:text-[12.5px]">
        {text}
      </p>
    </div>
  );
};

/* GTH · Trait card — 631x101: name + percentile, 8px bar, description + level chip. */
const BAR_TONE = { green: 'bg-[#387440]', gold: 'bg-[#c8951a]', dark: 'bg-[#595959]' };

export const TraitCard = ({
  name,
  percentileLabel,
  percent,
  description,
  level,
  tone = 'green',
  percentileClassName = 'text-[#387440]',
  className,
}) => (
  <div
    className={classNames(
      'flex min-w-0 flex-col gap-[8px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[18px]',
      className
    )}
  >
    <div className="flex items-baseline justify-between gap-[8px]">
      <span className="min-w-0 font-sans text-[15.5px] font-semibold leading-[18px] text-[#1c2a21]">
        {name}
      </span>
      <span
        className={classNames(
          'shrink-0 font-sans text-[13px] font-semibold leading-[16px]',
          percentileClassName
        )}
      >
        {percentileLabel}
      </span>
    </div>
    <div
      role="meter"
      aria-label={`${name} ${percentileLabel}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-[8px] w-full overflow-hidden rounded-full bg-[#ebebe3]"
    >
      <div
        className={classNames('h-full rounded-full', BAR_TONE[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
    <div className="flex items-center gap-[8px]">
      <span className="min-w-0 flex-1 font-sans text-[13px] leading-[16px] text-[#595959]">
        {description}
      </span>
      <HistoryChip
        kind="tag"
        className="!bg-[#f8f8f4] !text-[#595959] !text-[11px] !leading-[13px] max-lg:!text-[12px]"
      >
        {level}
      </HistoryChip>
    </div>
  </div>
);
