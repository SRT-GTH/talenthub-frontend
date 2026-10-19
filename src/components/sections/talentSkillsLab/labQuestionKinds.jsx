import { debug } from '../../../utils/debug.js';
import { registerQuestionKind } from './labQuestionRegistry.js';
import {
  ChallengeHead,
  CodeBlock,
  FeedbackCard,
  HintCard,
  OptionList,
} from './LabQuestionParts.jsx';

const log = debug('labQuestionKinds');
log('kinds module loaded');

/*
 * Question kinds. The registry is labQuestionRegistry.js. A question in skillsLabLabsData.js has `kind: 'code-output' | 'chart' | 'scenario' | 'chess' | …`;
 * LabPlayPage looks the renderer up here. A renderer is a component with props
 *     { attempt, t }
 *   attempt = the useLabAttempt() object (attempt.question, attempt.status, attempt.selected, attempt.hintUsed,
 *             attempt.optionStates, attempt.feedback, attempt.answered, attempt.select(i), attempt.flow.hintCost …)
 *   t       = useLabText().t  — fills the {xp} token ("XP" Playful / "pts" Focused)
 * and draws ONLY the challenge column (the chrome around it is LabPlayChrome). Compose it from LabQuestionParts.
 * Register a new kind from your lab's file:   registerQuestionKind('chart', ChartQuestion)
 * (labs that need the whole column differently — e.g. the chess board — register a renderer that ignores OptionList.)
 */
/* code-output — "What does this code print?" (Python SL-L05 … L09). Hint panel sits between the code and the answers. */
export const CodeOutputQuestion = ({ attempt, t }) => {
  const { question, index, hintUsed, optionStates, feedback, answered, flow } = attempt;
  return (
    <>
      <ChallengeHead
        eyebrow={`CHALLENGE ${index + 1} · ${question.topic.toUpperCase()}`}
        title={question.title}
        prompt={question.prompt}
      />
      <CodeBlock lines={question.body.code} />
      {hintUsed ? (
        <HintCard
          title={t('Hint · −{cost} {xp}', { cost: flow.hintCost })}
          body={question.hint}
          sticker={t('−{cost} {xp}', { cost: flow.hintCost })}
        />
      ) : null}
      <OptionList
        options={question.options}
        states={optionStates}
        locked={answered}
        onSelect={attempt.select}
        label={`Answers for challenge ${index + 1}`}
      />
      {feedback ? (
        <FeedbackCard tone={feedback.tone} title={t(feedback.title)} body={feedback.body} />
      ) : null}
    </>
  );
};

registerQuestionKind('code-output', CodeOutputQuestion);

// More kinds: drop `labKinds/<name>.jsx` files that call registerQuestionKind(...) — loaded here for their side effects.
import.meta.glob('./labKinds/*.jsx', { eager: true });
