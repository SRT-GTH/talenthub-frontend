import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { HintCard } from '../LabQuestionParts.jsx';
import { LabCheckIcon } from '../LabPlayIcons.jsx';
import { FOCUS_RING, INK_CARD } from '../labPlayStyles.js';
import personAma from '../../../../assets/talent-skills-lab/labs/scenario-person-ama.png';
import personKwabena from '../../../../assets/talent-skills-lab/labs/scenario-person-kwabena.png';
import { ExtFeedback, ExtHead, ExtNote, ExtOptionList } from './ExtParts.jsx';

const log = debug('ExtQuestions');

/*
 * Question kinds of the three "extended" labs (Public speaking, Team leadership, Strategic thinking chess lives in ChessQuestion.jsx).
 * A kind = { Body, footer?, digit? }:
 *   Body    ({ ctx }) draws the challenge column.   ctx = { attempt, draft, setDraft, t, flow }
 *   footer  (ctx) -> { note?, link?, action? }      overrides the default "Check answer" / "Next …" footer (action = { label, disabled, onClick })
 *   digit   (n, ctx)                                keyboard 1–9
 * The engine (useLabAttempt) stores the outcome; what a kind needs on top (placed phrases, a chess move) lives in `draft`, and is
 * serialised into `attempt.selected` when the answer is checked (a string, compared with question.answer by the engine).
 *   choice    multiple choice, one right answer (Public speaking Q2)         options: [string], answer: index
 *   scenario  scored answer: one "Strongest answer", the others are weaker    options: [string], answer: index, weaker: { [i]: feedback body }
 *   phrases   tap phrases into slots in order                                 body: { slots, phrases, correct, guide }, answer: correct.join('|')
 */

/* ---------- feedback helpers ---------- */
const hintCardFor = ({ attempt, t }) =>
  attempt.hintUsed ? (
    <HintCard
      title={t('Hint · −{cost} {xp}', { cost: attempt.flow.hintCost })}
      body={attempt.question.hint}
      sticker={t('−{cost} {xp}', { cost: attempt.flow.hintCost })}
    />
  ) : null;

/* ---------- choice ---------- */
const CHOICE_FEEDBACK = {
  right: (attempt, t) => ({
    tone: 'correct',
    title: t('Nailed it · +{n} {xp}', { n: attempt.flow.correctXp }),
    sticker: t('+{n} {xp}', { n: attempt.flow.correctXp }),
    body: attempt.question.explain.right,
  }),
  wrong: (attempt) => ({
    tone: 'wrong',
    title: `Not quite. The answer is ${'ABCD'[attempt.question.answer]}.`,
    body: attempt.question.explain.wrong,
  }),
};

export const ChoiceBody = ({ ctx }) => {
  const { attempt, t } = ctx;
  const { question, index, status, selected, answered } = attempt;
  const states = question.options.map((_, i) => {
    if (!answered) return { tone: selected === i ? 'selected' : 'idle' };
    const isPick = i === selected;
    if (status === 'correct')
      return isPick ? { tone: 'correct', chip: 'Your answer' } : { tone: 'dim' };
    if (isPick) return { tone: 'wrong', chip: 'Your answer', chipIcon: 'info' };
    if (i === question.answer) return { tone: 'correct', chip: 'Correct answer' };
    return { tone: 'dim' };
  });
  const feedback = answered
    ? CHOICE_FEEDBACK[status === 'correct' ? 'right' : 'wrong'](attempt, t)
    : null;
  return (
    <>
      <ExtHead
        eyebrow={`CHALLENGE ${index + 1} · ${question.eyebrow}`}
        title={question.title}
        prompt={question.prompt}
      />
      {hintCardFor(ctx)}
      <ExtOptionList
        options={question.options}
        states={states}
        locked={answered}
        onSelect={attempt.select}
        label={`Answers for challenge ${index + 1}`}
      />
      {feedback ? <ExtFeedback {...feedback} /> : null}
    </>
  );
};

/* ---------- scenario (Team leadership) ---------- */
const ScenarioCard = ({ headline, text }) => (
  <div className="flex items-center gap-[16px] rounded-[18px] border border-solid border-[#e7e7e7] bg-[#f7f8f4] py-[18px] pr-[18px] pl-[20px] max-sm:flex-col max-sm:items-start">
    <span aria-hidden="true" className="flex shrink-0 items-center">
      <img src={personAma} alt="" draggable="false" className="size-[48px] object-cover" />
      <img
        src={personKwabena}
        alt=""
        draggable="false"
        className="-ml-[10px] size-[48px] object-cover"
      />
    </span>
    <div className="flex min-w-0 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {headline}
      </p>
      <p className="m-0 font-sans text-[14px] leading-[21px] font-normal text-[#595959]">{text}</p>
    </div>
  </div>
);

export const ScenarioBody = ({ ctx }) => {
  const { attempt, t } = ctx;
  const { question, index, status, selected, answered } = attempt;
  const strong = answered && status === 'correct';
  const states = question.options.map((_, i) => {
    if (!answered) return { tone: selected === i ? 'selected' : 'idle' };
    if (i === question.answer) return { tone: 'correct', chip: 'Strongest answer' };
    if (i === selected) return { tone: 'mid', chip: 'Your answer', chipIcon: 'info' };
    return { tone: 'dim' };
  });
  let feedback = null;
  if (answered) {
    feedback = strong
      ? {
          tone: 'correct',
          title: t('Strong call · +{n} {xp}', { n: attempt.flow.correctXp }),
          sticker: t('+{n} {xp}', { n: attempt.flow.correctXp }),
          body: question.explain.right,
        }
      : {
          tone: 'mid',
          title: 'Not the strongest move',
          body: question.weaker[selected] ?? question.explain.wrong,
        };
  }
  return (
    <>
      <ExtHead eyebrow={`SCENARIO ${index + 1} · ${question.eyebrow}`} title={question.title} />
      <ScenarioCard headline={question.scenario.headline} text={question.scenario.text} />
      {hintCardFor(ctx)}
      <ExtOptionList
        options={question.options}
        states={states}
        locked={answered}
        onSelect={attempt.select}
        label={`Answers for scenario ${index + 1}`}
      />
      <ExtNote>{attempt.flow.note}</ExtNote>
      {feedback ? <ExtFeedback {...feedback} /> : null}
    </>
  );
};

/* ---------- phrases (Public speaking Q1) ---------- */
const decode = (value) => (typeof value === 'string' && value ? value.split('|') : []);
const chipBase =
  'inline-flex items-center rounded-[12px] border border-solid px-[16px] py-[10px] font-sans text-[15px] leading-[18px] text-left';

const PLACED_TONE = {
  idle: 'bg-white text-[#2a5730]',
  ok: 'bg-[#e8f2ed] text-[#165d3a]',
  bad: 'bg-[#f9ebea] text-[#902b20]',
};

export const PhrasesBody = ({ ctx }) => {
  const { attempt, draft, setDraft, t } = ctx;
  const { question, index, status, selected, answered } = attempt;
  const { slots, phrases, correct, guide, marksByArrangement } = question.body;
  const placed = answered ? decode(selected) : (draft.placed ?? []);
  const byId = Object.fromEntries(phrases.map((p) => [p.id, p]));
  const marks = answered
    ? (marksByArrangement?.[placed.join('|')] ??
      placed.map((id, i) => (id === correct[i] ? 'ok' : 'bad')))
    : [];
  const place = (id) => {
    if (answered || placed.length >= slots || placed.includes(id)) return;
    log('place phrase', id);
    setDraft({ placed: [...placed, id] });
  };
  const remove = (id) => {
    if (answered) return;
    log('remove phrase', id);
    setDraft({ placed: placed.filter((x) => x !== id) });
  };
  // "Structure guide" chips fill in order as the phrases for credibility → problem → solution → outcome → when are placed.
  const guideDone = guide.map((g, i) =>
    guide.slice(0, i + 1).every((x) => placed.includes(correct[guide.indexOf(x)]))
  );
  const feedback = answered
    ? status === 'correct'
      ? {
          tone: 'correct',
          title: t('Nailed it · +{n} {xp}', { n: attempt.flow.correctXp }),
          sticker: t('+{n} {xp}', { n: attempt.flow.correctXp }),
          body: question.explain.right,
        }
      : {
          tone: 'wrong',
          title: question.explain.wrongTitle,
          body: question.explain.wrong,
        }
    : null;

  return (
    <>
      <ExtHead
        eyebrow={`CHALLENGE ${index + 1} · ${question.eyebrow}`}
        title={question.title}
        prompt={question.prompt}
      />
      <div className="flex flex-col gap-[12px] rounded-[18px] border-[1.5px] border-dashed border-[#387440] bg-[#f5f9f5] px-[20px] py-[18px]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-[16px] gap-y-[4px]">
          <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#387440] uppercase max-lg:text-[12px]">
            YOUR OPENING · TAP A PHRASE TO REMOVE IT
          </p>
          <p className="m-0 font-sans text-[12px] leading-[14px] font-semibold text-[#387440]">
            {`${placed.length} of ${slots} placed`}
          </p>
        </div>
        <ol
          className="m-0 flex list-none flex-wrap gap-[8px] p-0"
          aria-label="Your opening, in order"
        >
          {placed.map((id, i) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => remove(id)}
                disabled={answered}
                aria-label={`${byId[id].text} (slot ${i + 1}${answered ? '' : ', tap to remove'})`}
                className={classNames(
                  chipBase,
                  'font-semibold disabled:cursor-default',
                  INK_CARD,
                  PLACED_TONE[answered ? (marks[i] ?? 'idle') : 'idle'],
                  answered ? '' : 'cursor-pointer',
                  FOCUS_RING
                )}
              >
                {byId[id].text}
              </button>
            </li>
          ))}
          {Array.from({ length: Math.max(0, slots - placed.length) }, (_, i) => (
            <li
              key={`empty-${i}`}
              aria-hidden="true"
              className="inline-flex h-[40px] w-[137px] max-w-full shrink-0 rounded-[12px] border border-dashed border-[#c1d4c4]"
            />
          ))}
        </ol>
      </div>
      <p className="m-0 font-sans text-[11px] leading-[13px] font-bold tracking-[1.2px] text-[#595959] uppercase max-lg:text-[12px]">
        PHRASES
      </p>
      {hintCardFor(ctx)}
      <div className="flex flex-wrap gap-[10px]" role="group" aria-label="Phrases">
        {phrases.map((p, i) => {
          const used = placed.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => place(p.id)}
              disabled={used || answered}
              aria-label={`${i + 1}. ${p.text}`}
              className={classNames(
                chipBase,
                'font-medium',
                used
                  ? 'border-[#e7e7e7] bg-[#f7f8f4] text-[#babab7]'
                  : classNames('bg-white text-[#1c2a21]', INK_CARD),
                used || answered ? 'cursor-default' : 'cursor-pointer',
                FOCUS_RING
              )}
            >
              {p.text}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-[8px] rounded-[12px] bg-[#f7f8f4] py-[12px] pr-[16px] pl-[14px]">
        {guide.map((label, i) => (
          <span
            key={label}
            className={classNames(
              'inline-flex h-[32px] items-center gap-[6px] rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[16px] font-semibold',
              guideDone[i]
                ? 'border-[#c1d4c4] bg-[#ebf1ec] text-[#387440]'
                : 'border-[#e1eae2] bg-white text-[#595959]'
            )}
          >
            {guideDone[i] ? <LabCheckIcon className="size-[14px]" /> : null}
            {label}
          </span>
        ))}
      </div>
      {feedback ? <ExtFeedback {...feedback} /> : null}
    </>
  );
};
