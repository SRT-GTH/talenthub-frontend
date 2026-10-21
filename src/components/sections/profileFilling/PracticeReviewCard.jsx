import { useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('PracticeReviewCard');

/*
 * PracticeReviewCard - the practice / mock interview review shown in the
 * live Career Buddy chat (2026-10-17, design part 3 Phase B: "a review
 * screen for questions"). Same card language as AssessmentReportCard.
 *
 * The agent builds the payload (practice-interview.ts buildReview) on the
 * last turn of a practice, or when the talent asks to review a past one.
 *
 * Props
 *   review {
 *     career, mode: 'practice' | 'mock', inputMode: 'text' | 'voice',
 *     overall (0-100), verdict?: { label, tone: 'good' | 'ok' | 'low', line },
 *     areas: { relevance, specifics, structure, communication } (0-100),
 *     answered, total, completed, createdAt?,
 *     items: [{ n, question, answer, followUp?: { question, answer },
 *               scores: { relevance, specifics, structure, communication } (0-4),
 *               score (0-100), ungraded?, strength, improvement, hint, modelAnswer }]
 *   }
 */
const AREA_LABELS = {
  relevance: 'Answering the question',
  specifics: 'Specific examples',
  structure: 'Clear structure',
  communication: 'Easy to follow',
};

const VERDICT_STYLES = {
  good: 'bg-brand-green text-white',
  ok: 'bg-[#f4c95d] text-[#3d2f00]',
  low: 'bg-[#e9e9e9] text-[#404040]',
};

const scoreTone = (pct) =>
  pct >= 75 ? 'text-brand-green' : pct >= 50 ? 'text-[#8a6d00]' : 'text-[#b42318]';

const Section = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
      {label}
    </span>
    <div className="font-sans text-[14px] leading-[22px] text-[#404040]">{children}</div>
  </div>
);

/*
 * The agent writes "[experience]", "[number]"… where the talent should add their own details (practice-interview.ts:
 * the hint "must only use facts the candidate gave; for anything new use a placeholder"). Show them as highlighted
 * blanks ("your experience"), not raw brackets.
 */
const PLACEHOLDER = /\[([^[\]]{1,40})\]/g;

const withBlanks = (text) => {
  const str = String(text ?? '');
  const parts = [];
  let last = 0;
  for (const m of str.matchAll(PLACEHOLDER)) {
    if (m.index > last) parts.push(str.slice(last, m.index));
    const word = m[1].trim().replace(/^your\s+/i, '');
    parts.push(
      <mark
        key={`${m.index}-${word}`}
        title="Add your own details here"
        className="mx-[1px] rounded-[4px] border border-dashed border-[#c8951a] bg-[#fdf6e3] px-1 font-medium not-italic text-[#8a6d00]"
      >
        your {word}
      </mark>
    );
    last = m.index + m[0].length;
  }
  if (!parts.length) return str;
  if (last < str.length) parts.push(str.slice(last));
  return parts;
};

const hasBlanks = (text) => new RegExp(PLACEHOLDER.source).test(String(text ?? ''));

const QuestionItem = ({ item, open, onToggle }) => {
  const [showModel, setShowModel] = useState(false);
  return (
    <li className="rounded-[10px] border border-[#e8e8e8] bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left font-sans text-[14px] text-[#111]"
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[12px] text-[#8a8a8a]">Question {item.n}</span>
          <span className="font-medium">{item.question}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {item.ungraded ? (
            <span className="text-[13px] text-[#8a8a8a]">Not scored</span>
          ) : (
            <span className={classNames('text-[14px] font-semibold', scoreTone(item.score))}>
              {item.score}%
            </span>
          )}
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-3 border-t border-[#f0f0f0] px-3 py-3">
          <Section label="Your answer">
            <p className="whitespace-pre-line italic">&ldquo;{item.answer}&rdquo;</p>
          </Section>
          {item.followUp?.question && (
            <Section label="Follow-up">
              <p className="font-medium text-[#111]">{item.followUp.question}</p>
              <p className="italic">&ldquo;{item.followUp.answer}&rdquo;</p>
            </Section>
          )}
          {item.ungraded && (
            <p className="font-sans text-[13px] text-[#8a8a8a]">
              Career Buddy couldn&apos;t score this answer at the time, so it doesn&apos;t count
              towards your result.
            </p>
          )}
          {!item.ungraded && (
            <ul className="flex flex-wrap gap-2" aria-label="Scores for this answer">
              {Object.entries(AREA_LABELS).map(([key, label]) => (
                <li
                  key={key}
                  className="rounded-full border border-[#e8e8e8] bg-[#f8f8f4] px-2.5 py-0.5 font-sans text-[12px] text-[#404040]"
                >
                  {label}: {item.scores?.[key] ?? 0}/4
                </li>
              ))}
            </ul>
          )}
          {item.strength && <Section label="What went well">{withBlanks(item.strength)}</Section>}
          {item.improvement && (
            <Section label="To add next time">{withBlanks(item.improvement)}</Section>
          )}
          {item.hint && (
            <Section label="A stronger way to say it">
              <p className="m-0">{withBlanks(item.hint)}</p>
              {hasBlanks(item.hint) ? (
                <p className="m-0 mt-1 font-sans text-[12px] text-[#8a8a8a]">
                  Fill the highlighted parts with your own details.
                </p>
              ) : null}
            </Section>
          )}
          {item.modelAnswer && (
            <div>
              <button
                type="button"
                aria-expanded={showModel}
                onClick={() => {
                  log('branch', { modelAnswer: !showModel, n: item.n });
                  setShowModel((v) => !v);
                }}
                className="font-sans text-[13px] font-medium text-brand-green underline-offset-2 hover:underline"
              >
                {showModel ? 'Hide example answer' : 'Show an example answer'}
              </button>
              {showModel && (
                <p className="mt-1 rounded-[8px] bg-[#f8f8f4] px-3 py-2 font-sans text-[14px] leading-[22px] text-[#404040]">
                  {withBlanks(item.modelAnswer)}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
};

const PracticeReviewCard = ({ review }) => {
  const items = Array.isArray(review?.items) ? review.items : [];
  // Open the weakest answer first - that is where the learning is.
  const weakest = items.reduce((w, it) => (w === null || it.score < w.score ? it : w), null);
  const [openN, setOpenN] = useState(weakest?.n ?? null);
  if (!review || !items.length) return null;

  const mock = review.mode === 'mock';
  const partial = !review.completed || review.answered < review.total;
  // Every answer unscored (grader unavailable): no fake 0/100.
  const noneScored = items.every((it) => it.ungraded);

  return (
    <div
      className="mt-2 flex w-full max-w-[560px] flex-col gap-4 rounded-[12px] border border-[#e8e8e8] bg-[#f8f8f4] p-4"
      data-testid="practice-review"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-display text-[22px] leading-tight text-[#111]">
            {mock ? 'Mock interview' : 'Practice interview'}: {review.career}
          </h3>
          <span className="font-sans text-[13px] text-[#8a8a8a]">
            {partial
              ? `Stopped after ${review.answered} of ${review.total} questions`
              : `${review.total} questions`}
            {review.inputMode === 'voice' ? ' · spoken' : ''}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={classNames(
              'font-display text-[28px] leading-none',
              scoreTone(review.overall)
            )}
          >
            {noneScored ? '\u2014' : review.overall}
            <span className="text-[16px] text-[#8a8a8a]">/100</span>
          </span>
          {review.verdict && (
            <span
              className={classNames(
                'rounded-full px-3 py-1 font-sans text-[13px] font-medium',
                VERDICT_STYLES[review.verdict.tone] || VERDICT_STYLES.low
              )}
            >
              {review.verdict.label}
            </span>
          )}
        </div>
      </div>

      {review.verdict?.line && (
        <p className="font-sans text-[14px] leading-[22px] text-[#595959]">{review.verdict.line}</p>
      )}

      <ul className="flex flex-col gap-3" aria-label="Scores by area">
        {Object.entries(AREA_LABELS).map(([key, label]) => {
          const value = Math.max(0, Math.min(100, Number(review.areas?.[key]) || 0));
          return (
            <li key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-sans text-[14px] text-[#111]">
                <span>{label}</span>
                <span className="text-[#595959]">{value}%</span>
              </div>
              <div
                className="h-[8px] w-full overflow-hidden rounded-full bg-brand-green-light-hover"
                role="progressbar"
                aria-label={label}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand-green"
                  style={{ width: `${value}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[14px] font-medium text-[#111]">Your answers</span>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <QuestionItem
              key={item.n}
              item={item}
              open={openN === item.n}
              onToggle={() => {
                log('branch', { toggle: item.n });
                setOpenN((cur) => (cur === item.n ? null : item.n));
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PracticeReviewCard;
