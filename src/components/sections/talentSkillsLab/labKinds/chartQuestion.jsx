import { debug } from '../../../../utils/debug.js';
import { registerQuestionKind } from '../labQuestionRegistry.js';
import { HintCard } from '../LabQuestionParts.jsx';
import { ChartCard } from '../labChartParts.jsx';
import {
  LabQuestionHead,
  SectionLabel,
  StickerFeedback,
  TextOptions,
} from '../labQuestionExtras.jsx';
import { feedbackTitle } from '../labQuestionHelpers.js';

const log = debug('labKinds/chartQuestion');

/*
 * 'chart' and 'choice' question kinds (Data analysis SL-L12a … L12h, also reused for the plain sentence questions of the UI/UX lab).
 * Column order = Figma: eyebrow · title · prompt · [chart card] · [section label] · [hint] · answers · [feedback].
 * question.body = { chart?: ChartCard chart (see labChartParts.jsx), optionsLabel?: string }, question.eyebrowTopic? overrides the
 * eyebrow topic (Figma eyebrows differ from the results topic: "READING TRENDS" vs "Reading charts").
 */
export const ChartQuestion = ({ attempt, t }) => {
  const { question, hintUsed, feedback, flow } = attempt;
  const { chart, optionsLabel } = question.body ?? {};
  return (
    <>
      <LabQuestionHead attempt={attempt} />
      {chart ? <ChartCard chart={chart} /> : null}
      {optionsLabel ? <SectionLabel>{optionsLabel}</SectionLabel> : null}
      {hintUsed ? (
        <HintCard
          title={t('Hint · −{cost} {xp}', { cost: flow.hintCost })}
          body={question.hint}
          sticker={t('−{cost} {xp}', { cost: flow.hintCost })}
        />
      ) : null}
      <TextOptions attempt={attempt} />
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

registerQuestionKind('chart', ChartQuestion);
registerQuestionKind('choice', ChartQuestion);
log('chart + choice kinds registered');
