import { debug } from '../../../../utils/debug.js';
import { registerQuestionKind } from '../labQuestionRegistry.js';
import {
  ContextBox,
  PlanChart,
  PlanFeedback,
  PlanHead,
  PlanHint,
  PlanOptions,
  RiceTable,
  RuleBar,
  Scratchpad,
} from '../labPlanParts.jsx';

const log = debug('planningKinds');
log('kinds module loaded');

/*
 * Question kinds for the Engineering planning and Product management labs (Figma SL-L14*, SL-L15*).
 * All three draw only the challenge column, in this order (hint panel always sits just above the answers):
 *
 *   plan-timeline  eyebrow/title/prompt · "Rule:" bar · week plan chart (optional) · [hint] · answers · [feedback]
 *     body = { rule, days:[5 labels], rows:[{ label, bar?:{tone,start,span,text}, slot?:true }], previews?:[per option] }
 *     tones: blue | purple | gold | green. The row with `slot: true` is the answer row: it stays empty until an option is
 *     picked, then draws that option's preview (previews[i] = { start, span, preview, done, bad }):
 *       selected → dashed green "Day 5 · preview"; checked right → solid green; checked wrong → dashed red.
 *     No `rows` → rule bar only (estimating / release questions).
 *   rice-table     title/prompt · RICE table · fx note · [hint] · answers · [feedback]
 *     body = { columns:[5], rows:[{ name, reach, impact, confidence, effort }], note }
 *   brief-choice   title/prompt · context box (optional) · [hint] · answers · [feedback]
 *     body = { context?:{ title, lines:[…] } }
 */

const slotBar = (body, attempt) => {
  const { status, selected } = attempt;
  const pick = selected === null ? null : body.previews?.[selected];
  if (!pick) return null;
  const base = { start: pick.start, span: pick.span ?? 1 };
  if (status === 'correct') return { ...base, tone: 'done', text: pick.done };
  if (status === 'wrong') return { ...base, tone: 'wrong', text: pick.bad };
  return { ...base, tone: 'preview', text: pick.preview };
};

const Head = ({ attempt }) => {
  const { question, index } = attempt;
  return (
    <PlanHead
      eyebrow={`CHALLENGE ${index + 1} · ${question.topic.toUpperCase()}`}
      title={question.title}
      prompt={question.prompt}
    />
  );
};

export const PlanTimelineQuestion = ({ attempt, t }) => {
  const { question } = attempt;
  const { body } = question;
  const bar = body.rows?.some((r) => r.slot) ? slotBar(body, attempt) : null;
  const rows = body.rows?.map((r) => (r.slot ? { label: r.label, bar } : r));
  return (
    <>
      <Head attempt={attempt} />
      <RuleBar>{body.rule}</RuleBar>
      {rows ? <PlanChart days={body.days} rows={rows} /> : null}
      <PlanHint attempt={attempt} t={t} />
      <PlanOptions attempt={attempt} />
      <PlanFeedback attempt={attempt} t={t} />
    </>
  );
};

export const RiceTableQuestion = ({ attempt, t }) => {
  const { body } = attempt.question;
  return (
    <>
      <Head attempt={attempt} />
      <RiceTable columns={body.columns} rows={body.rows} />
      <Scratchpad>{body.note}</Scratchpad>
      <PlanHint attempt={attempt} t={t} />
      <PlanOptions attempt={attempt} />
      <PlanFeedback attempt={attempt} t={t} />
    </>
  );
};

export const BriefChoiceQuestion = ({ attempt, t }) => {
  const { context } = attempt.question.body;
  return (
    <>
      <Head attempt={attempt} />
      {context ? <ContextBox title={context.title} lines={context.lines} /> : null}
      <PlanHint attempt={attempt} t={t} />
      <PlanOptions attempt={attempt} />
      <PlanFeedback attempt={attempt} t={t} />
    </>
  );
};

registerQuestionKind('plan-timeline', PlanTimelineQuestion);
registerQuestionKind('rice-table', RiceTableQuestion);
registerQuestionKind('brief-choice', BriefChoiceQuestion);
