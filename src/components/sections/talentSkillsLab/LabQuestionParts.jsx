import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  LabBulbIcon,
  LabCheckCircleFillIcon,
  LabErrorFillIcon,
  LabTileCheckIcon,
  LabTileCloseIcon,
} from './LabPlayIcons.jsx';
import { OPTION_LETTERS } from './labFormat.js';
import { tokenizeCode } from './labCodeTokens.js';
import { FOCUS_RING, INK_CARD } from './labPlayStyles.js';

const log = debug('LabQuestionParts');

/*
 * LabQuestionParts — the pieces a question renderer (labQuestionKinds.jsx) assembles. Every lab/game reuses them:
 *   ChallengeHead   eyebrow ("CHALLENGE 5 · SETS AND SORTING"), title (segments, green accent), prompt line
 *   CodeBlock       dark green mono block with line numbers + the Figma token colours
 *   OptionList      radiogroup of answer cards (A–D) with idle | selected | correct | wrong | dim tones and
 *                   "Your answer" / "Correct answer" chips. `renderOption(optionText, i)` lets a kind draw its own
 *                   option body (default: monospace answer text).
 *   HintCard        amber hint panel ("Hint · −5 XP") with the Playful −5 XP sticker
 *   FeedbackCard    green "Nailed it" / red "Not quite" explanation panel
 * Focused is the default; Playful is `playful:` variants. Figma: Playful 7851:1617… / Focused 8110:473758…
 */

/* ---------- head ---------- */
export const ChallengeHead = ({ eyebrow, title, prompt }) => (
  <>
    <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
      {eyebrow}
    </p>
    <h2 className="m-0 font-sans text-[clamp(28px,2.3vw,40px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
      {title.map(([text, accent], i) => (
        <span key={i} className={accent ? 'text-[#387440]' : undefined}>
          {text}
        </span>
      ))}
    </h2>
    <p className="m-0 font-sans text-[15px] leading-[18px] font-normal text-[#595959]">{prompt}</p>
  </>
);

/* ---------- code ---------- */
// Figma code colours: white identifiers, #a9b8a6 punctuation + call arguments, #84cc16 literals, #ffd86b functions/keywords.
const CODE_TONE = {
  id: 'text-white',
  op: 'text-[#a9b8a6]',
  lit: 'text-[#84cc16]',
  fn: 'text-[#ffd86b]',
};
export const CodeBlock = ({ lines, label = 'Code' }) => (
  <div
    role="group"
    aria-label={label}
    className="flex flex-col gap-[16px] overflow-x-auto rounded-[16px] bg-[#224626] px-[clamp(16px,1.4vw,24px)] py-[20px]"
  >
    {lines.map((line, i) => (
      <div
        key={i}
        className="flex items-baseline gap-[16px] font-mono text-[16px] leading-[21px] max-lg:text-[14px]"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        }}
      >
        <span
          aria-hidden="true"
          className="w-[9px] shrink-0 text-[15px] leading-[20px] text-[#5e7a62] max-lg:text-[14px]"
        >
          {i + 1}
        </span>
        <code className="whitespace-pre">
          {tokenizeCode(line).map((tok, k) => (
            <span key={k} className={CODE_TONE[tok.tone]}>
              {tok.text}
            </span>
          ))}
        </code>
      </div>
    ))}
  </div>
);

/* ---------- options ---------- */
const OPTION_TONE = {
  idle: 'border-[#e7e7e7] bg-white',
  dim: 'border-[#e7e7e7] bg-white opacity-55',
  selected:
    'border-[rgba(28,42,33,0.1)] bg-[#f5f9f5] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
  correct:
    'border-[rgba(28,42,33,0.1)] bg-[#e8f2ed] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
  wrong:
    'border-[rgba(28,42,33,0.1)] bg-[#f9ebea] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
};
const LETTER_TONE = {
  idle: 'border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21]',
  dim: 'border-[rgba(28,42,33,0.12)] bg-white text-[#1c2a21]',
  selected: 'border-[rgba(28,42,33,0.12)] bg-[#387440] text-white',
  correct: 'border-[rgba(28,42,33,0.12)] bg-[#1d7c4d] text-white',
  wrong: 'border-[rgba(28,42,33,0.12)] bg-[#c0392b] text-white',
};

const AnswerChip = ({ label, tone }) => (
  <span
    aria-hidden="true"
    data-count={label}
    className="inline-flex h-[32px] shrink-0 items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#595959] after:content-[attr(data-count)] max-lg:text-[13px]"
  >
    {tone === 'wrong' ? (
      <LabErrorFillIcon className="size-[14px] text-[#387440]" />
    ) : (
      <LabCheckCircleFillIcon className="size-[14px] text-[#387440]" />
    )}
  </span>
);

export const OptionList = ({
  options,
  states,
  onSelect,
  locked = false,
  renderOption,
  label = 'Answers',
}) => (
  <div role="radiogroup" aria-label={label} className="flex flex-col gap-[10px]">
    {options.map((text, i) => {
      const { tone, chip } = states[i];
      const checked = tone === 'selected' || (locked && (tone === 'correct' || tone === 'wrong'));
      return (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={checked}
          aria-label={`${OPTION_LETTERS[i]}: ${typeof text === 'string' ? text : text?.sample ? `${text.sample}, ${text.caption}` : ''}${chip ? `, ${chip}` : ''}`.trim()}
          aria-disabled={locked || undefined}
          data-tone={tone}
          onClick={() => {
            if (locked) return;
            log('select', i);
            onSelect(i);
          }}
          className={classNames(
            'flex w-full items-center gap-[16px] rounded-[16px] border border-solid py-[16px] pr-[20px] pl-[16px] text-left max-sm:flex-wrap max-sm:gap-x-[10px] max-sm:gap-y-[8px] max-sm:pr-[12px] max-sm:pl-[12px]',
            OPTION_TONE[tone],
            locked ? 'cursor-default' : 'cursor-pointer',
            FOCUS_RING
          )}
        >
          <span
            aria-hidden="true"
            data-count={OPTION_LETTERS[i]}
            className={classNames(
              'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[9px] border border-solid font-sans text-[13px] leading-[16px] font-bold after:content-[attr(data-count)] playful:border-[1.2px] playful:border-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]',
              LETTER_TONE[tone]
            )}
          />
          <span className="min-w-[10ch] flex-1 text-[16px] leading-[21px] break-words text-[#1c2a21] max-sm:basis-[60%]">
            {renderOption ? (
              renderOption(text, i)
            ) : (
              <span
                className={
                  typeof text === 'string' && text.length < 24 ? 'whitespace-nowrap' : undefined
                }
                style={{
                  fontFamily:
                    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                }}
              >
                {text}
              </span>
            )}
          </span>
          {chip ? <AnswerChip label={chip} tone={tone} /> : null}
        </button>
      );
    })}
  </div>
);

/* ---------- hint + feedback ---------- */
const PANEL =
  'flex items-start gap-[14px] rounded-[16px] py-[16px] pr-[20px] pl-[16px] ' + INK_CARD;

export const HintCard = ({ title, body, sticker }) => (
  <div className={classNames(PANEL, 'relative bg-[#faf4e8]')} role="note">
    <span
      aria-hidden="true"
      className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-full bg-[#c8951a] text-white"
    >
      <LabBulbIcon className="size-[18px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[16px] leading-[19px] font-semibold text-[#785910]">
        {title}
      </p>
      <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#1c2a21]">{body}</p>
    </div>
    {sticker ? (
      <span
        data-sticker=""
        className="absolute top-[-19px] right-[19px] hidden -rotate-[5deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
      >
        {sticker}
      </span>
    ) : null}
  </div>
);

const FEEDBACK_TONE = {
  correct: { bg: 'bg-[#e8f2ed]', tile: 'bg-[#1d7c4d]', title: 'text-[#165d3a]' },
  wrong: { bg: 'bg-[#f9ebea]', tile: 'bg-[#c0392b]', title: 'text-[#902b20]' },
};

export const FeedbackCard = ({ tone, title, body }) => {
  const c = FEEDBACK_TONE[tone];
  return (
    <div className={classNames(PANEL, c.bg)} role="status" aria-live="polite">
      <span
        aria-hidden="true"
        className={classNames(
          'inline-flex size-[36px] shrink-0 items-center justify-center rounded-full text-white',
          c.tile
        )}
      >
        {tone === 'correct' ? (
          <LabTileCheckIcon className="size-[18px]" />
        ) : (
          <LabTileCloseIcon className="size-[16px]" />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <p
          className={classNames('m-0 font-sans text-[16px] leading-[19px] font-semibold', c.title)}
        >
          {title}
        </p>
        <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#1c2a21]">
          {body}
        </p>
      </div>
    </div>
  );
};
