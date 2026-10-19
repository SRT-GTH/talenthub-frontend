import { classNames } from '../../../utils/classNames.js';
import { LabTileCheckIcon, LabTileCloseIcon } from './LabPlayIcons.jsx';
import { INK_CARD } from './labPlayStyles.js';
import { OptionList } from './LabQuestionParts.jsx';

/*
 * Small pieces shared by the Data analysis and UI/UX design question kinds (labKinds/chartQuestion.jsx, paletteQuestion.jsx,
 * contrastQuestion.jsx). They sit next to LabQuestionParts and reuse its tones; nothing here is shared-file API.
 *
 *   LabQuestionHead eyebrow + title + prompt exactly as these frames draw them (title block 41 tall under a 48px line, prompt 15/22)
 *   SectionLabel    11px bold tracked grey caption above a block ("WHAT MOST LIKELY CAUSED THE WEEK 5 SPIKE?")
 *   StickerFeedback FeedbackCard + the Playful-only "+10 XP" sticker these two labs draw on the green "Nailed it" panel
 *   TextOptions     OptionList with the 15px sans answer text (500, 600 while selected) and the 50% dim these frames use
 */

/* Same text as LabQuestionParts.ChallengeHead; Figma's title frame is 41 high under a 48px line (7px pulled up) and the prompt is 15/22. */
export const LabQuestionHead = ({ attempt }) => {
  const { question, index } = attempt;
  return (
    <>
      <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
        {`CHALLENGE ${index + 1} · ${(question.eyebrowTopic ?? question.topic).toUpperCase()}`}
      </p>
      <h2 className="m-0 -mb-[7px] font-sans text-[clamp(28px,2.3vw,40px)] leading-[1.2] font-semibold text-[#1c2a21] playful:font-heading">
        {question.title.map(([text, accent], i) => (
          <span key={i} className={accent ? 'text-[#387440]' : undefined}>
            {text}
          </span>
        ))}
      </h2>
      <p className="m-0 font-sans text-[15px] leading-[22px] font-normal text-[#595959]">
        {question.prompt}
      </p>
    </>
  );
};

export const SectionLabel = ({ children }) => (
  <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] uppercase max-lg:text-[12px]">
    {children}
  </p>
);

const FEEDBACK_TONE = {
  correct: { bg: 'bg-[#e8f2ed]', tile: 'bg-[#1d7c4d]', title: 'text-[#165d3a]' },
  wrong: { bg: 'bg-[#f9ebea]', tile: 'bg-[#c0392b]', title: 'text-[#902b20]' },
};

/* Same panel as LabQuestionParts.FeedbackCard (Figma 'Feedback · ok / bad') plus an optional Playful sticker, top 21 / right 41, -6deg. */
export const StickerFeedback = ({ tone, title, body, sticker }) => {
  const c = FEEDBACK_TONE[tone];
  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(
        'relative flex items-start gap-[14px] rounded-[16px] py-[16px] pr-[20px] pl-[16px]',
        INK_CARD,
        c.bg
      )}
    >
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
      {sticker ? (
        <span
          data-sticker=""
          className="absolute top-[-21px] right-[41px] hidden -rotate-[6deg] rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[11px] py-[5px] font-sans text-[12px] leading-[14px] font-bold tracking-[0.4px] whitespace-nowrap text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block"
        >
          {sticker}
        </span>
      ) : null}
    </div>
  );
};

/* OptionList for plain sentence answers. `attempt` = useLabAttempt(); `renderText(option)` can swap the default text body. */
export const TextOptions = ({ attempt, renderText }) => {
  const { question, index, optionStates, answered } = attempt;
  return (
    <div className="[&_[data-tone=dim]]:!opacity-50">
      <OptionList
        options={question.options}
        states={optionStates}
        locked={answered}
        onSelect={attempt.select}
        label={`Answers for challenge ${index + 1}`}
        renderOption={(option, i) =>
          renderText ? (
            renderText(option, i)
          ) : (
            <span
              className={classNames(
                'block font-sans text-[15px] leading-[22px] text-[#1c2a21]',
                optionStates[i].tone === 'selected' ? 'font-semibold' : 'font-medium'
              )}
            >
              {option}
            </span>
          )
        }
      />
    </div>
  );
};
