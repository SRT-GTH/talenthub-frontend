import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('AssessmentReportCard');

/*
 * AssessmentReportCard - the personality / career-interests report shown in
 * the live Career Buddy chat after a quiz (2026-10-16, Quazor: "build the
 * personality report with the comment box").
 *
 * Source: the personality-report screenshot referenced in careerBuddyScript.js
 * (PERSONALITY_FIELDS note): percentage progress bars, a collapsible
 * "Summary Insight", and an "Add your comment" textarea. The comment is the
 * `note` of the result's userSentiment (design Iteration 4, Option B); the
 * three answers are the "are we spot on?" chips (scene P6).
 *
 * Props
 *   report    { title, summary, code?, bars: [{ label, value (0-100), description? }] }
 *   answered  string | null - the answer already sent (locks the card)
 *   disabled  boolean
 *   onAnswer  (label: 'Spot on' | 'Mostly' | 'Not really', note: string) => void
 */
const ANSWERS = ['Spot on', 'Mostly', 'Not really'];

const AssessmentReportCard = ({ report, answered = null, disabled = false, onAnswer }) => {
  const [open, setOpen] = useState(true);
  const [note, setNote] = useState('');
  const locked = Boolean(answered) || disabled;
  if (!report) return null;

  return (
    <div
      className="mt-2 flex w-full max-w-[560px] flex-col gap-4 rounded-[12px] border border-[#e8e8e8] bg-[#f8f8f4] p-4"
      data-testid="assessment-report"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[22px] leading-tight text-[#111]">{report.title}</h3>
        {report.code && (
          <span className="rounded-full bg-brand-green px-3 py-1 font-sans text-[13px] font-medium text-white">
            {report.code}
          </span>
        )}
      </div>

      {report.bars?.length > 0 && (
        <ul className="flex flex-col gap-3" aria-label="Results">
          {report.bars.map((bar) => (
            <li key={bar.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between font-sans text-[14px] text-[#111]">
                <span>{bar.label}</span>
                <span className="text-[#595959]">{bar.value}%</span>
              </div>
              <div
                className="h-[8px] w-full overflow-hidden rounded-full bg-brand-green-light-hover"
                role="progressbar"
                aria-label={bar.label}
                aria-valuenow={bar.value}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-brand-green"
                  style={{ width: `${bar.value}%` }}
                />
              </div>
              {bar.description && (
                <span className="font-sans text-[12px] text-[#8a8a8a]">{bar.description}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-[10px] border border-[#e8e8e8] bg-white">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-2 font-sans text-[14px] font-medium text-[#111]"
        >
          Summary Insight
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>
        {open && (
          <p className="px-3 pb-3 font-sans text-[14px] leading-[22px] text-[#595959]">
            {report.summary}
          </p>
        )}
      </div>

      <label className="flex flex-col gap-1 font-sans text-[14px] text-[#111]">
        Add your comment
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={locked}
          rows={2}
          maxLength={1000}
          placeholder="Anything that feels right or wrong about this? (optional)"
          className="resize-none rounded-[8px] border border-[#e9e9e9] bg-white px-3 py-2 text-[14px] text-[#404040] focus:border-brand-green-light-active focus:outline-none disabled:opacity-60"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-sans text-[14px] text-[#595959]">Are we spot on?</span>
        {ANSWERS.map((label) => (
          <Button
            key={label}
            type="button"
            size="sm"
            variant={answered === label ? 'primary' : 'tertiary'}
            disabled={locked}
            className={classNames(answered && answered !== label && 'opacity-50')}
            onClick={() => {
              log('branch', { answer: label, noteLen: note.trim().length });
              onAnswer?.(label, note.trim());
            }}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentReportCard;
