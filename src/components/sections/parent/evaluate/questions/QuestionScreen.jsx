import { useRef } from 'react';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import TextInput from '../../../../ui/form/TextInput.jsx';
import ParentButton from '../../ParentButton.jsx';
import warningIcon from '../../../../../assets/parent/eval-warning.svg';
import alertIcon from '../../../../../assets/parent/dialog-alert.svg';
import { COPY, NOTE_MAX, SET_META, hasBlockedWord } from './data/questionsData.js';

const log = debug('QuestionScreen');

/*
 * QuestionScreen — PE-02 / PE-02d / PE-03 / PE-02c (Figma 10034:148219, 10052:4066, 10034:148861, 10042:4260): title "Evaluating <ward>" 34/600 + green sticker "Question N of T" + #999 sub, then the Question card
 * (r24 #e7e7e7, p22, gap20): 8px progress track (#eceee9 / #387440, N/T), eyebrow 12/600 #387440 uppercase, 26/600 question, four option rows (r14, p16; selected #ebf1ec + #387440 border + 6px radio ring,
 * semibold), error row (warning icon + "Please select a response before continuing", #c0392b), the 435px "Add a note (optional)" input with helper, footer "Saved a moment ago · Discard evaluation" + Back + Next question.
 * Props: set ('general' | 'academic'), question { number, section, text, options }, answer (index | null), note, showError, onAnswer(i), onNote(text), onBack, onNext, onDiscard.
 * Blocked note (hasBlockedWord): red input + red helper "Please remove the blocked word. …" and Next disabled. ⚠️ ASSUMPTION: Next is NOT disabled with no answer (PE-03 is "Next pressed with none"); the page shows the error.
 */
const Option = ({ label, selected, invalid, onSelect, tabIndex, refCb }) => (
  <button
    ref={refCb}
    type="button"
    role="radio"
    aria-checked={selected}
    tabIndex={tabIndex}
    onClick={onSelect}
    className={classNames(
      'flex w-full cursor-pointer items-center gap-[12px] rounded-[14px] border border-solid p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      selected
        ? 'border-[#387440] bg-[#ebf1ec]'
        : invalid
          ? 'border-[#c0392b] bg-white'
          : 'border-[#e7e7e7] bg-white'
    )}
  >
    <span
      aria-hidden="true"
      className={classNames(
        'size-[20px] shrink-0 rounded-full border-solid',
        selected ? 'border-[6px] border-[#387440]' : 'border-[1.5px] border-[#babab7]'
      )}
    />
    <span
      className={classNames(
        'font-sans text-[16px] leading-[normal] text-[#1c2a21]',
        selected ? 'font-semibold' : 'font-normal'
      )}
    >
      {label}
    </span>
  </button>
);

const QuestionScreen = ({
  set = 'general',
  question,
  answer,
  note,
  showError,
  onAnswer,
  onNote,
  onBack,
  onNext,
  onDiscard,
}) => {
  const meta = SET_META[set];
  const refs = useRef([]);
  const blocked = hasBlockedWord(note);
  const pct = (question.number / meta.total) * 100;
  const invalid = showError && answer == null;
  log('render', { set, n: question.number, answer, blocked, invalid });

  const onKeyDown = (e) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const n = question.options.length;
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = ((answer ?? (step > 0 ? -1 : 0)) + step + n) % n;
    onAnswer(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="mx-auto flex w-full max-w-[1329px] flex-col gap-[24px]">
      <div className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1 className="m-0 font-sans text-[34px] leading-[1.2] font-semibold tracking-[-0.68px] whitespace-nowrap text-[#1c2a21] max-sm:text-[28px]">
            Evaluating {meta.ward}
          </h1>
          <span className="rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[normal] font-bold whitespace-nowrap text-[#1f4a2b]">
            Question {question.number} of {meta.total}
          </span>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#999]">
          {meta.label} · your answers save automatically
        </p>
      </div>

      <section
        aria-label={`Question ${question.number} of ${meta.total}`}
        className="flex w-full flex-col items-start gap-[20px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[22px] drop-shadow-[0_5px_8.5px_rgba(28,42,33,0.03)]"
      >
        <div
          role="progressbar"
          aria-label="Evaluation progress"
          aria-valuemin={0}
          aria-valuemax={meta.total}
          aria-valuenow={question.number}
          className="h-[8px] w-full overflow-clip rounded-[99px] bg-[#eceee9]"
        >
          <div className="h-[8px] rounded-[99px] bg-[#387440]" style={{ width: `${pct}%` }} />
        </div>
        <p className="m-0 font-sans text-[12px] leading-[normal] font-semibold tracking-[0.72px] text-[#387440] uppercase">
          {question.section}
        </p>
        <h2
          id="eval-question"
          className="m-0 w-full max-w-[1100px] font-sans text-[26px] leading-[1.25] font-semibold tracking-[-0.13px] text-[#1c2a21] max-sm:text-[20px]"
        >
          {question.text}
        </h2>
        <div
          role="radiogroup"
          aria-labelledby="eval-question"
          aria-invalid={invalid || undefined}
          onKeyDown={onKeyDown}
          className="flex w-full flex-col gap-[20px]"
        >
          {question.options.map((label, i) => (
            <Option
              key={label}
              label={label}
              selected={answer === i}
              invalid={invalid}
              tabIndex={answer === i || (answer == null && i === 0) ? 0 : -1}
              refCb={(el) => {
                refs.current[i] = el;
              }}
              onSelect={() => onAnswer(i)}
            />
          ))}
        </div>
        {invalid ? (
          <div role="alert" className="flex items-center gap-[8px]">
            <img src={warningIcon} alt="" aria-hidden="true" className="size-[16px] shrink-0" />
            <p className="m-0 font-sans text-[14px] leading-[normal] font-semibold text-[#c0392b]">
              {COPY.needAnswer}
            </p>
          </div>
        ) : null}
        <div className="w-full max-w-[435px] [&_.text-content-primary]:!text-[#1c2a21]">
          <TextInput
            label={COPY.noteLabel}
            value={note}
            maxLength={NOTE_MAX}
            onChange={(e) => onNote(e.target.value)}
            error={blocked ? COPY.noteBlocked(meta.ward) : undefined}
            helperText={COPY.noteHelp(meta.ward)}
            helperIcon={<img src={alertIcon} alt="" className="size-full" />}
            helperTextClassName={blocked ? 'text-[#c0392b]' : 'text-[#575755]'}
            inputClassName={blocked ? '!font-normal !text-[#c0392b]' : '!text-[#1c2a21]'}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-[16px] max-sm:flex-col max-sm:items-stretch">
          <p className="m-0 font-sans text-[13px] leading-[normal] text-[#575755]">
            {COPY.saved} ·{' '}
            <button
              type="button"
              onClick={onDiscard}
              className="cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] text-[#575755] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
            >
              {COPY.discard}
            </button>
          </p>
          <div className="flex items-start gap-[12px]">
            <ParentButton variant="secondary" onClick={onBack}>
              {COPY.back}
            </ParentButton>
            <ParentButton onClick={onNext} disabled={blocked}>
              {COPY.next}
            </ParentButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuestionScreen;
