import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { registerQuestionKind } from '../labQuestionRegistry.js';
import { HintCard } from '../LabQuestionParts.jsx';
import { LabCheckCircleFillIcon, LabCheckIcon, LabErrorFillIcon } from '../LabPlayIcons.jsx';
import { FOCUS_RING, INK_CARD } from '../labPlayStyles.js';
import { LabQuestionHead, SectionLabel, StickerFeedback } from '../labQuestionExtras.jsx';
import { feedbackTitle } from '../labQuestionHelpers.js';

const log = debug('labKinds/paletteQuestion');

/*
 * 'palette' question kind (UI/UX design SL-L13a/b/c/d/g/h, "Pick the accent for this palette."). Figma column order:
 *   eyebrow · title · brief · label · palette (4 fixed swatches + the live accent swatch) · label · [hint] · 6 accent cards · [feedback]
 * question.body = {
 *   paletteLabel, accentLabel,
 *   fixed:[{ name, hex, dark }],                         dark = white text on the swatch
 *   preview:{ idle:['Accent?','?'], picking:'Preview', correct:'Accent', wrong:'Your pick' }   labels drawn on the live swatch
 * }, question.options = [{ name, hex }] (answer = index into it).
 *
 * Live swatch (Figma): nothing picked -> white, dashed green ring, "Accent?" / "?"; picked -> filled with the colour, dashed ring,
 * "Preview"; checked right -> "Accent", solid grey ring; checked wrong -> "Your pick", solid grey ring (shows the wrong colour).
 * Accent card tones come from attempt.optionStates: idle · selected (green ring + check) · correct (ink card + green check-circle)
 * · wrong (ink card + red error) · dim (45%). Ring weights: Playful 2px / Focused 1px (Figma pdiff).
 */
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const FixedSwatch = ({ swatch }) => (
  <div
    className="flex min-h-[120px] flex-col justify-end gap-[2px] rounded-[16px] border border-solid border-[#e7e7e7] px-[14px] pt-0 pb-[14px]"
    style={{ backgroundColor: swatch.hex }}
  >
    <span
      className={classNames(
        'font-sans text-[13px] leading-[16px] font-semibold',
        swatch.dark ? 'text-white' : 'text-[#1c2a21]'
      )}
    >
      {swatch.name}
    </span>
    <span
      className={classNames(
        'text-[11px] leading-[15px] max-lg:text-[12px]',
        swatch.dark ? 'text-white' : 'text-[#1c2a21]'
      )}
      style={{ fontFamily: MONO }}
    >
      {swatch.hex}
    </span>
  </div>
);

const PreviewSwatch = ({ preview, option, mode }) => {
  // mode: idle | picking | correct | wrong
  const dashed = mode === 'idle' || mode === 'picking';
  const [label, hex] =
    mode === 'idle'
      ? preview.idle
      : [
          mode === 'picking'
            ? preview.picking
            : mode === 'correct'
              ? preview.correct
              : preview.wrong,
          option.hex.toUpperCase(),
        ];
  return (
    <div
      data-preview={mode}
      className={classNames(
        'relative flex min-h-[120px] flex-col justify-end gap-[2px] rounded-[16px] border-solid px-[14px] pt-0 pb-[14px]',
        dashed ? 'border border-transparent playful:border-2' : 'border-2 border-[#e7e7e7]'
      )}
      style={{ backgroundColor: mode === 'idle' ? '#ffffff' : option.hex }}
    >
      {dashed ? (
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-[-0.5px] size-[calc(100%+1px)] overflow-visible playful:inset-0 playful:size-full"
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="15.5"
            fill="none"
            stroke="#387440"
            strokeDasharray="6 5"
            className="[stroke-width:1] playful:[stroke-width:2]"
          />
        </svg>
      ) : null}
      <span className="font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
        {label}
      </span>
      <span
        className="text-[11px] leading-[15px] text-[#1c2a21] max-lg:text-[12px]"
        style={{ fontFamily: MONO }}
      >
        {hex}
      </span>
    </div>
  );
};

const CARD_TONE = {
  idle: 'border-[#e7e7e7]',
  dim: 'border-[#e7e7e7] opacity-45',
  selected: 'border-[#387440] playful:border-2',
  correct: INK_CARD,
  wrong: INK_CARD,
};

const AccentCard = ({ option, tone, locked, onSelect }) => (
  <button
    type="button"
    role="radio"
    aria-checked={tone === 'selected' || tone === 'correct' || tone === 'wrong'}
    aria-disabled={locked || undefined}
    data-tone={tone}
    onClick={() => {
      if (locked) return;
      log('select', option.name);
      onSelect();
    }}
    className={classNames(
      'flex w-full flex-col overflow-hidden rounded-[14px] border border-solid bg-white p-0 text-left',
      CARD_TONE[tone],
      locked ? 'cursor-default' : 'cursor-pointer',
      FOCUS_RING
    )}
  >
    <span className="block h-[72px] w-full" style={{ backgroundColor: option.hex }} />
    <span className="flex min-h-[36px] items-center gap-[6px] p-[10px]">
      {tone === 'selected' ? (
        <LabCheckIcon className="size-[14px] shrink-0 text-[#387440]" />
      ) : null}
      {tone === 'correct' ? (
        <LabCheckCircleFillIcon className="size-[14px] shrink-0 text-[#1d7c4d]" />
      ) : null}
      {tone === 'wrong' ? (
        <LabErrorFillIcon className="size-[14px] shrink-0 text-[#c0392b]" />
      ) : null}
      <span
        className={classNames(
          'font-sans text-[13px] leading-[16px]',
          tone === 'selected' && 'font-semibold text-[#387440]',
          tone === 'correct' && 'font-semibold text-[#165d3a]',
          tone === 'wrong' && 'font-semibold text-[#902b20]',
          (tone === 'idle' || tone === 'dim') && 'font-medium text-[#1c2a21]'
        )}
      >
        {option.name}
      </span>
    </span>
  </button>
);

export const PaletteQuestion = ({ attempt, t }) => {
  const { question, index, hintUsed, optionStates, feedback, answered, status, selected, flow } =
    attempt;
  const { body } = question;
  const picked = selected !== null && selected !== undefined ? question.options[selected] : null;
  let mode = 'idle';
  if (picked) {
    if (answered) mode = status === 'correct' ? 'correct' : 'wrong';
    else mode = 'picking';
  }
  return (
    <>
      <LabQuestionHead attempt={attempt} />
      <SectionLabel>{body.paletteLabel}</SectionLabel>
      <div className="grid grid-cols-2 gap-[12px] sm:grid-cols-3 lg:grid-cols-5">
        {body.fixed.map((swatch) => (
          <FixedSwatch key={swatch.name} swatch={swatch} />
        ))}
        <PreviewSwatch preview={body.preview} option={picked} mode={mode} />
      </div>
      <SectionLabel>{body.accentLabel}</SectionLabel>
      {hintUsed ? (
        <HintCard
          title={t('Hint · −{cost} {xp}', { cost: flow.hintCost })}
          body={question.hint}
          sticker={t('−{cost} {xp}', { cost: flow.hintCost })}
        />
      ) : null}
      <div
        role="radiogroup"
        aria-label={`Accent colours for challenge ${index + 1}`}
        className="grid grid-cols-2 items-start gap-[12px] sm:grid-cols-3 lg:grid-cols-6"
      >
        {question.options.map((option, i) => (
          <AccentCard
            key={option.name}
            option={option}
            tone={optionStates[i].tone}
            locked={answered}
            onSelect={() => attempt.select(i)}
          />
        ))}
      </div>
      {feedback ? (
        <StickerFeedback
          tone={feedback.tone}
          title={feedbackTitle(attempt, t)}
          body={feedback.body}
          sticker={feedback.tone === 'correct' ? t('+{cost} {xp}', { cost: flow.correctXp }) : null}
        />
      ) : null}
    </>
  );
};

registerQuestionKind('palette', PaletteQuestion);
log('palette kind registered');
