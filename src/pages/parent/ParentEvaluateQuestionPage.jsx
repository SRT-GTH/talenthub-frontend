import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import QuestionScreen from '../../components/sections/parent/evaluate/questions/QuestionScreen.jsx';
import DiscardDialog from '../../components/sections/parent/evaluate/questions/DiscardDialog.jsx';
import {
  BLOCKED_NOTE,
  QUESTIONS,
  SET_META,
  hasBlockedWord,
} from '../../components/sections/parent/evaluate/questions/data/questionsData.js';

const log = debug('ParentEvaluateQuestionPage');

/*
 * ParentEvaluateQuestionPage — /parent/evaluate/questions (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, section B · Answer the questions).
 *   (none) | ?state=general  PE-02  10034:148219  Abena, Question 6 of 20, option 2 chosen + note
 *   ?state=academic          PE-02d 10052:4066    Elliot, Question 3 of 15
 *   ?state=none              PE-03  10034:148861  nothing chosen, "Please select a response before continuing"
 *   ?state=blocked           PE-02c 10042:4260    note holds a blocked word, Next disabled
 *   ?state=discard           PE-02b 10042:3545    "Discard this evaluation?" over PE-02
 * Interactive: choosing an option clears the error; Next with no answer shows it; blocked words in the note disable Next; Discard opens the dialog (Esc / Keep going closes; Discard evaluation -> /parent/evaluate).
 * ⚠️ ASSUMPTION: Next on the last mock question goes to the submitted screen (/parent/evaluate/result); Back on the first goes to /parent/evaluate.
 */
const initial = (set, state) => {
  const qs = QUESTIONS[set];
  return {
    answers: qs.map((q) => (state === 'none' ? null : q.answer)),
    notes: qs.map((q, i) => (state === 'blocked' && i === 0 ? BLOCKED_NOTE : q.note)),
  };
};

const ParentEvaluateQuestionPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const state = params.get('state') ?? 'general';
  const set = state === 'academic' ? 'academic' : 'general';
  const qs = QUESTIONS[set];

  const [idx, setIdx] = useState(0);
  const [data, setData] = useState(() => initial(set, state));
  const [showError, setShowError] = useState(state === 'none');
  const [confirm, setConfirm] = useState(state === 'discard');
  const q = qs[idx];
  const ward = SET_META[set].ward;

  const answer = (i) => {
    log('answer', { n: q.number, option: i });
    setData((d) => ({ ...d, answers: d.answers.map((a, k) => (k === idx ? i : a)) }));
    setShowError(false);
  };
  const note = (text) =>
    setData((d) => ({ ...d, notes: d.notes.map((n, k) => (k === idx ? text : n)) }));

  const next = () => {
    if (data.answers[idx] == null) {
      log('next blocked: no answer');
      setShowError(true);
      return;
    }
    if (hasBlockedWord(data.notes[idx])) return;
    if (idx + 1 < qs.length) {
      log('next ->', qs[idx + 1].number);
      setIdx(idx + 1);
      setShowError(false);
    } else {
      log('last mock question answered -> submitted');
      navigate('/parent/evaluate/result');
    }
  };
  const back = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setShowError(false);
    } else {
      log('back -> /parent/evaluate');
      navigate('/parent/evaluate');
    }
  };

  return (
    <ParentFrame active="evaluate" sidebar="linked">
      <QuestionScreen
        set={set}
        question={q}
        answer={data.answers[idx]}
        note={data.notes[idx]}
        showError={showError}
        onAnswer={answer}
        onNote={note}
        onBack={back}
        onNext={next}
        onDiscard={() => setConfirm(true)}
      />
      {confirm ? (
        <DiscardDialog
          answered={q.number}
          ward={ward}
          onKeep={() => setConfirm(false)}
          onDiscard={() => {
            log('discard evaluation');
            navigate('/parent/evaluate');
          }}
        />
      ) : null}
    </ParentFrame>
  );
};

export default ParentEvaluateQuestionPage;
