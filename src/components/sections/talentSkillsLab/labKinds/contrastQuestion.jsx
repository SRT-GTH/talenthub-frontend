import { debug } from '../../../../utils/debug.js';
import { registerQuestionKind } from '../labQuestionRegistry.js';
import { HintCard } from '../LabQuestionParts.jsx';
import { LabQuestionHead, StickerFeedback, TextOptions } from '../labQuestionExtras.jsx';
import { feedbackTitle } from '../labQuestionHelpers.js';

const log = debug('labKinds/contrastQuestion');

/*
 * 'contrast' question kind (UI/UX design SL-L13e, "Which label is easiest to read?"): each answer row shows a 117x40 "Send money"
 * button sample (fg on bg, 1px #e7e7e7 border, radius 10) and a caption ("White on amber"). Figma has no label above the answers.
 * question.options = [{ caption, fg, bg, sample }]  (sample = the button text, "Send money").
 */
const Sample = ({ option }) => (
  <span
    aria-hidden="true"
    className="inline-flex shrink-0 items-center rounded-[10px] border border-solid border-[#e7e7e7] px-[16px] py-[10px] font-sans text-[15px] leading-[18px] font-semibold"
    data-count={option.sample}
    style={{ backgroundColor: option.bg, color: option.fg }}
  >
    <span className="after:content-[attr(data-count)]" data-count={option.sample} />
  </span>
);

export const ContrastQuestion = ({ attempt, t }) => {
  const { question, hintUsed, feedback, flow } = attempt;
  return (
    <>
      <LabQuestionHead attempt={attempt} />
      {hintUsed ? (
        <HintCard
          title={t('Hint · −{cost} {xp}', { cost: flow.hintCost })}
          body={question.hint}
          sticker={t('−{cost} {xp}', { cost: flow.hintCost })}
        />
      ) : null}
      <TextOptions
        attempt={attempt}
        renderText={(option) => (
          <span className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px]">
            <Sample option={option} />
            <span
              aria-hidden="true"
              data-count={option.caption}
              className="block font-sans text-[15px] leading-[22px] font-medium text-[#1c2a21] after:content-[attr(data-count)]"
            />
          </span>
        )}
      />
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

registerQuestionKind('contrast', ContrastQuestion);
log('contrast kind registered');
