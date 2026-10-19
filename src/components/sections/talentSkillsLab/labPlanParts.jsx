import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { FeedbackCard, HintCard, OptionList } from './LabQuestionParts.jsx';
import { PlanFunctionIcon, PlanInfoCircleIcon, PlanTargetIcon } from './labIconsPlan.jsx';
import { OPTION_LETTERS } from './labFormat.js';

const log = debug('labPlanParts');

/*
 * labPlanParts — the pieces of the Engineering planning + Product management question columns
 * (Figma SL-L14a … L14h, SL-L15a … L15h). Renderers live in labKinds/planningKinds.jsx.
 *
 *   PlanHead         eyebrow · 34px title (green accent segment) · 15/22 prompt           (the shared ChallengeHead uses 40px/18px)
 *   RuleBar          "Rule: …" bar with the green info icon
 *   PlanChart        week grid: Mon–Fri header + one row per task, bars span day columns
 *   RiceTable        Feature · Reach / month · Impact · Confidence · Effort (weeks) table
 *   ContextBox       "What the team wants" / "Constraints" box with dot bullets
 *   Scratchpad       fx note under the RICE table
 *   PlanOptions      OptionList with the sans answer text of these frames (500, 600 when selected)
 *   PlanFeedback     FeedbackCard + Playful "+10 XP" sticker on the correct state, "Close, but not quite. It's B." title
 * Focused is the default; Playful via `playful:` variants. Both looks share one layout (the Figma frames only differ in
 * strokes/shadows, the heading font, XP/pts, and the 1.5px → 1px stroke on the emphasised plan bar).
 */

/* ---------- head ---------- */
export const PlanHead = ({ eyebrow, title, prompt }) => (
  <>
    <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
      {eyebrow}
    </p>
    <h2 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
      {title.map(([text, accent], i) => (
        <span key={i} className={accent ? 'text-[#387440]' : undefined}>
          {text}
        </span>
      ))}
    </h2>
    {prompt ? (
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
        {prompt}
      </p>
    ) : null}
  </>
);

/* ---------- rule bar (Figma "Constraint": #f7f8f4, r14, a 3px #387440 stroke on the LEFT side only) ---------- */
export const RuleBar = ({ children }) => (
  <div className="flex items-center gap-[12px] rounded-[14px] border-l-[3px] border-solid border-l-[#387440] bg-[#f7f8f4] py-[14px] pr-[18px] pl-[16px]">
    <PlanInfoCircleIcon className="size-[18px] shrink-0 text-[#387440]" />
    <p className="m-0 min-w-0 font-sans text-[15px] leading-[18px] font-medium text-[#1c2a21]">
      {children}
    </p>
  </div>
);

/* ---------- plan chart ---------- */
const GRID = 'grid grid-cols-[clamp(84px,8.6vw,148px)_repeat(5,minmax(0,1fr))] gap-x-[4px]';

// Bar tones (Figma): task colours are tinted 16% fill + 50% stroke; the QA slot is solid green (preview / done) or red (wrong).
const BAR = {
  blue: {
    cls: 'border border-solid border-[rgba(48,98,212,0.5)] bg-[rgba(48,98,212,0.16)] text-[#244a9f]',
  },
  purple: {
    cls: 'border border-solid border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.16)] text-[#6d28d9]',
  },
  gold: {
    cls: 'border border-solid border-[rgba(200,149,26,0.5)] bg-[rgba(200,149,26,0.16)] text-[#785910]',
  },
  green: { cls: 'border border-solid border-[#387440] bg-[#387440] text-[#2a5730]' },
  // Figma draws the preview/done label #387440 on the #387440 bar (same colour), so it is not legible; kept exact.
  done: {
    cls: 'border border-solid border-[#387440] bg-[#387440] text-[#387440] playful:border-[1.5px]',
  },
  preview: { cls: 'bg-[#387440] text-[#387440]', dashed: '#387440' },
  wrong: { cls: 'bg-[rgba(192,57,43,0.12)] text-[#902b20]', dashed: '#c0392b' },
};

// Dashed 5/4 outline (Figma strokeDashes [5, 4]): 1.5px in Playful, 1px in Focused for the preview bar; the red bar is 1.5px in both.
const DashedOutline = ({ color, fixed = false }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    className={classNames(
      'pointer-events-none absolute inset-0 size-full overflow-visible',
      fixed ? '[--sw:1.5]' : '[--sw:1] playful:[--sw:1.5]'
    )}
  >
    <rect
      fill="none"
      stroke={color}
      strokeDasharray="5 4"
      style={{
        x: 'calc(var(--sw) * 0.5px)',
        y: 'calc(var(--sw) * 0.5px)',
        width: 'calc(100% - var(--sw) * 1px)',
        height: 'calc(100% - var(--sw) * 1px)',
        rx: '7px',
        strokeWidth: 'var(--sw)',
      }}
    />
  </svg>
);

const PlanBar = ({ bar }) => {
  const tone = BAR[bar.tone];
  return (
    <div
      data-bar={bar.tone}
      className={classNames(
        'relative z-[1] flex h-[40px] items-center gap-[6px] self-center rounded-[8px] px-[clamp(6px,0.7vw,12px)]',
        tone.cls
      )}
      style={{ gridRow: 1, gridColumn: `${bar.start + 1} / span ${bar.span ?? 1}` }}
    >
      {tone.dashed ? <DashedOutline color={tone.dashed} fixed={bar.tone === 'wrong'} /> : null}
      <span className="relative min-w-0 truncate font-sans text-[12px] leading-[14px] font-semibold">
        {bar.text}
      </span>
    </div>
  );
};

export const PlanChart = ({ days, rows, label = 'Plan' }) => (
  <div
    role="group"
    aria-label={label}
    className="overflow-x-auto rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[clamp(12px,1.16vw,20px)] py-[16px]"
  >
    <div className="min-w-[600px]">
      <div className={classNames(GRID, 'h-[32px] items-center')}>
        <span aria-hidden="true" />
        {days.map((day) => (
          <span
            key={day}
            className="text-center font-sans text-[12px] leading-[14px] font-semibold text-[#595959]"
          >
            {day}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.label} className={classNames(GRID, 'h-[52px] items-center')}>
          <span
            className="font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
            style={{ gridRow: 1, gridColumn: 1 }}
          >
            {row.label}
          </span>
          {days.map((day, i) => (
            <span
              key={day}
              aria-hidden="true"
              className="h-[40px] rounded-[8px] bg-[#f7f8f4]"
              style={{ gridRow: 1, gridColumn: i + 2 }}
            />
          ))}
          {row.bar ? <PlanBar bar={row.bar} /> : null}
        </div>
      ))}
    </div>
  </div>
);

/* ---------- RICE table ---------- */
// Figma columns at 1000px: Feature 360 · Reach 150 · Impact 110 · Confidence 130 · Effort 150 (10% spare on the right).
const TABLE_COLS =
  'grid grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(0,1fr))] lg:grid-cols-[36%_15%_11%_13%_15%]';
const MONO = {
  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

export const RiceTable = ({ columns, rows }) => (
  <div className="overflow-x-auto rounded-[20px] border border-solid border-[#e7e7e7] bg-white px-[clamp(12px,1.16vw,20px)] py-[8px]">
    <div role="table" aria-label="RICE scores" className="max-lg:min-w-[480px]">
      <div role="row" className={classNames(TABLE_COLS, 'gap-x-[8px] py-[12px] lg:gap-x-0')}>
        {columns.map((c) => (
          <span
            key={c}
            role="columnheader"
            className="font-sans text-[12px] leading-[14px] font-semibold text-[#595959]"
          >
            {c}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div
          key={row.name}
          role="row"
          className={classNames(
            TABLE_COLS,
            'items-center gap-x-[8px] border-t border-solid border-[#f0f0ec] py-[12px] lg:gap-x-0'
          )}
        >
          <span
            role="cell"
            className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]"
          >
            {row.name}
          </span>
          {[row.reach, row.impact, row.confidence, row.effort].map((v, i) => (
            <span
              key={i}
              role="cell"
              className="text-[15px] leading-[20px] font-normal text-[#1c2a21] max-lg:text-[14px]"
              style={MONO}
            >
              {v}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const Scratchpad = ({ children }) => (
  <div className="flex items-center gap-[10px] rounded-[12px] bg-[#f7f8f4] py-[12px] pr-[16px] pl-[14px]">
    <PlanFunctionIcon className="size-[16px] shrink-0 text-[#595959]" />
    <p className="m-0 min-w-0 font-sans text-[13px] leading-[16px] font-medium text-[#595959]">
      {children}
    </p>
  </div>
);

/* ---------- context box ("What the team wants" / "Constraints") ---------- */
export const ContextBox = ({ title, lines }) => (
  <div className="flex flex-col gap-[8px] rounded-[18px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] px-[20px] py-[18px]">
    <div className="flex items-center gap-[8px]">
      <PlanTargetIcon className="size-[16px] shrink-0 text-[#387440]" />
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {title}
      </p>
    </div>
    <ul className="m-0 flex list-none flex-col gap-[8px] p-0">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-[8px]">
          <span
            aria-hidden="true"
            className="mt-[5.5px] size-[6px] shrink-0 rounded-full bg-[#387440]"
          />
          <span className="font-sans text-[14px] leading-[17px] font-normal text-[#1c2a21] max-lg:text-[14px]">
            {line}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

/* ---------- options, hint, feedback ---------- */
export const PlanOptions = ({ attempt }) => {
  const { question, index, optionStates, answered } = attempt;
  return (
    <OptionList
      options={question.options}
      states={optionStates}
      locked={answered}
      onSelect={attempt.select}
      label={`Answers for challenge ${index + 1}`}
      renderOption={(text, i) => (
        <span
          className={classNames(
            'block font-sans text-[15px] leading-[22px] text-[#1c2a21]',
            optionStates[i].tone === 'selected' ? 'font-semibold' : 'font-medium'
          )}
        >
          {text}
        </span>
      )}
    />
  );
};

export const PlanHint = ({ attempt, t }) =>
  attempt.hintUsed ? (
    <HintCard
      title={t('Hint · −{cost} {xp}', { cost: attempt.flow.hintCost })}
      body={attempt.question.hint}
      sticker={t('−{cost} {xp}', { cost: attempt.flow.hintCost })}
    />
  ) : null;

export const PlanFeedback = ({ attempt, t }) => {
  const { feedback, question, flow } = attempt;
  if (!feedback) return null;
  const correct = feedback.tone === 'correct';
  // Figma: "Close, but not quite. It’s B." (the shared engine title says "Not quite. The answer is B.").
  const title = correct
    ? t(feedback.title)
    : `Close, but not quite. It’s ${OPTION_LETTERS[question.answer]}.`;
  log('feedback', feedback.tone);
  return (
    <div className="relative">
      <FeedbackCard tone={feedback.tone} title={title} body={feedback.body} />
      {correct ? (
        <span
          data-sticker=""
          className="absolute top-[-21px] right-[41px] hidden -rotate-[6deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
        >
          {t('+{cost} {xp}', { cost: flow.correctXp })}
        </span>
      ) : null}
    </div>
  );
};
