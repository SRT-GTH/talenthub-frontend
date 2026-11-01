import { useState } from 'react';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import {
  startShortCheck,
  submitShortCheck,
  apiErrorOf,
} from '../../../services/learningPath.api.js';
import { CARD_SOFT, FOCUS, HEAD } from './CourseUi.jsx';

const log = debug('CourseShortCheck');

/*
 * CourseShortCheck — the short check after an off-platform course (learning path iteration 4, C1/C2).
 * A few multiple-choice questions; answers are graded on the server (the key never reaches the
 * browser). A pass marks the course "Checked" (T3) and adds training-evidenced skills; a miss can be
 * tried again the next day.
 */
const COOLDOWN_COPY = {
  CHECK_COOLDOWN: 'You can try this check again tomorrow.',
  CHECK_WEEKLY_LIMIT: 'You’ve used this week’s tries for this check.',
  NO_CHECK: 'There’s no short check for this course yet.',
  ALREADY_PASSED: 'You’ve already passed this check.',
  ALREADY_VERIFIED: 'This course is already verified.',
  CHECK_EXPIRED: 'That attempt timed out. Start again when you’re ready.',
};

const CourseShortCheck = ({ courseId, courseTitle, onDone, onClose }) => {
  const [stage, setStage] = useState('intro'); // intro | answering | result
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const begin = async () => {
    setBusy(true);
    setError(null);
    try {
      const a = await startShortCheck(courseId);
      log('started', { n: a?.questions?.length });
      setAttempt(a);
      setAnswers({});
      setStage('answering');
    } catch (err) {
      const e = apiErrorOf(err);
      setError(COOLDOWN_COPY[e.type] || e.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const r = await submitShortCheck(courseId, attempt.attemptId, answers);
      log('result', { passed: r?.passed, correct: r?.correct, total: r?.total });
      setResult(r);
      setStage('result');
      if (onDone) onDone(r);
    } catch (err) {
      const e = apiErrorOf(err);
      setError(COOLDOWN_COPY[e.type] || e.message);
    } finally {
      setBusy(false);
    }
  };

  const questions = attempt?.questions || [];
  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <section
      data-testid="short-check"
      className={classNames(
        'flex flex-col gap-[14px] rounded-[22px] p-[clamp(14px,1.27vw,22px)]',
        CARD_SOFT
      )}
    >
      <div className="flex items-center gap-[8px]">
        <h2
          className={classNames(
            HEAD,
            'min-w-0 flex-1 text-[clamp(18px,1.27vw,22px)] leading-[1.25] text-[#1c2a21]'
          )}
        >
          Short check
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={classNames(
              'cursor-pointer text-[13.5px] font-semibold text-[#2d5d33]',
              FOCUS
            )}
          >
            Close
          </button>
        )}
      </div>

      {stage === 'intro' && (
        <>
          <p className="m-0 text-[14.5px] leading-[1.45] text-[#595959]">
            A few quick questions on {courseTitle || 'this course'}. Pass and the course counts as
            checked, and its skills show on your profile as training-evidenced.
          </p>
          <div>
            <Button variant="primary" size="md" onClick={begin} disabled={busy}>
              {busy ? 'Loading…' : 'Start the check'}
            </Button>
          </div>
        </>
      )}

      {stage === 'answering' && (
        <>
          <p className="m-0 text-[13px] text-[#737373]">
            Get {attempt.passMark} of {questions.length} right to pass.
          </p>
          <ol className="m-0 flex list-none flex-col gap-[16px] p-0">
            {questions.map((q, qi) => (
              <li key={q.id} className="flex flex-col gap-[8px]">
                <fieldset className="m-0 flex flex-col gap-[6px] border-0 p-0">
                  <legend className="mb-[6px] text-[15px] leading-[1.35] font-semibold text-[#1c2a21]">
                    {qi + 1}. {q.question}
                  </legend>
                  {q.options.map((opt, oi) => {
                    const id = `${q.id}-${oi}`;
                    const checked = answers[q.id] === oi;
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={classNames(
                          'flex cursor-pointer items-center gap-[10px] rounded-[12px] border px-[12px] py-[10px] text-[14.5px] text-[#1c2a21]',
                          checked
                            ? 'border-[#387440] bg-[#ebf1ec]'
                            : 'border-[#e1eae2] bg-white hover:bg-[#f8f8f4]'
                        )}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={q.id}
                          checked={checked}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className="size-[16px] accent-[#387440]"
                        />
                        {opt}
                      </label>
                    );
                  })}
                </fieldset>
              </li>
            ))}
          </ol>
          <div>
            <Button variant="primary" size="md" onClick={submit} disabled={!allAnswered || busy}>
              {busy ? 'Checking…' : 'Submit answers'}
            </Button>
          </div>
        </>
      )}

      {stage === 'result' && result && (
        <div className="flex flex-col gap-[8px]" role="status">
          <p className={classNames(HEAD, 'm-0 text-[20px] text-[#1c2a21]')}>
            {result.passed ? 'Passed — nice work.' : 'Not this time.'}
          </p>
          <p className="m-0 text-[14.5px] leading-[1.45] text-[#595959]">
            You got {result.correct} of {result.total} right.{' '}
            {result.passed
              ? 'This course now counts as checked, and its skills are on your profile.'
              : 'Have another look at the course and try again tomorrow.'}
          </p>
        </div>
      )}

      {error && (
        <p className="m-0 text-[14px] text-[#9a3b2f]" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};

export default CourseShortCheck;
