import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../../../utils/debug.js';
import ParentFrame from '../../ParentFrame.jsx';
import QuestionScreen from './QuestionScreen.jsx';
import DiscardDialog from './DiscardDialog.jsx';
import { hasBlockedWord } from './data/questionsData.js';
import {
  discardParentEvaluation,
  fetchParentEvaluation,
  fetchParentEvaluations,
  parentError,
  saveParentEvaluationDraft,
  submitParentEvaluation,
} from '../../../../../services/parent.api.js';

const log = debug('LiveEvaluation');

const DIM_LABEL = {
  character: 'Character',
  interests: 'Interests',
  social: 'Social skills',
  academic: 'Learning',
  strengths: 'Strengths',
  career: 'Career',
};

/*
 * LiveEvaluation — the question screens for a real evaluation (/parent/evaluate/questions?id=<evaluation>).
 * Questions come from the parent question set (5-point questions -> four-or-five option rows, open questions -> the text
 * box is the answer). Answers save as a draft on every Next / Back (PUT /parent/evaluations/:id/draft), so "Continue
 * where you left off" resumes where the parent stopped. The last question's button sends it
 * (POST …/submit) and lands on /parent/evaluate/result?id=…. Discard deletes the draft.
 * Notes on 5-point questions keep the blocked-word check of the design (the ward and recruiters can read notes).
 */
const LiveEvaluation = ({ id }) => {
  const navigate = useNavigate();
  const [ev, setEv] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [wardName, setWardName] = useState('your ward');
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [showError, setShowError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const started = useRef(false);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchParentEvaluation(id), fetchParentEvaluations()])
      .then(([one, all]) => {
        if (!alive) return;
        if (one.evaluation.status !== 'pending') {
          navigate(`/parent/evaluate/result?id=${id}`, { replace: true });
          return;
        }
        setEv(one.evaluation);
        setQuestions(one.questions || []);
        setAnswers(one.evaluation.answers || {});
        const ward = (all.wards || []).find((w) => w.wardId === one.evaluation.wardId);
        if (ward) setWardName(ward.firstName);
        // Resume on the first unanswered 5-point question.
        if (!started.current) {
          started.current = true;
          const first = (one.questions || []).findIndex(
            (q) => q.type === 'likert_5' && !(one.evaluation.answers || {})[q.id]?.value
          );
          setIdx(first > 0 ? first : 0);
        }
      })
      .catch((err) => alive && setError(parentError(err)));
    return () => {
      alive = false;
    };
  }, [id, navigate]);

  const save = async (next = answers) => {
    try {
      await saveParentEvaluationDraft(id, next);
      setSavedAt(new Date());
    } catch (err) {
      log('draft save failed', err?.message);
    }
  };

  if (error || !ev) {
    return (
      <ParentFrame active="evaluate">
        <p role={error ? 'alert' : 'status'} className="m-0 font-sans text-[15px] text-[#575755]">
          {error || 'Loading…'}
        </p>
      </ParentFrame>
    );
  }

  const q = questions[idx];
  const a = answers[q.id] || {};
  const open = q.type === 'open_text';
  const view = {
    number: idx + 1,
    section: DIM_LABEL[q.dimension] || q.dimension,
    text: q.question.replace(/your ward/gi, wardName).replace(/this person/gi, wardName),
    options: open ? [] : (q.options || []).map((o) => o.label),
  };
  const answerIdx = open ? (a.text ? 0 : null) : a.value ? a.value - 1 : null;
  const noteText = open ? a.text || '' : a.note || '';
  const last = idx === questions.length - 1;
  const set = (patch) =>
    setAnswers((cur) => ({ ...cur, [q.id]: { ...(cur[q.id] || {}), ...patch } }));

  const next = async () => {
    if (!open && !a.value) {
      setShowError(true);
      return;
    }
    if (!open && hasBlockedWord(noteText)) return;
    setShowError(false);
    await save();
    if (!last) {
      setIdx(idx + 1);
      return;
    }
    setBusy(true);
    try {
      await submitParentEvaluation(id);
      log('submitted', id);
      navigate(`/parent/evaluate/result?id=${id}`);
    } catch (err) {
      setError(parentError(err));
      setBusy(false);
    }
  };

  const back = async () => {
    await save();
    if (idx > 0) {
      setIdx(idx - 1);
      setShowError(false);
    } else navigate('/parent/evaluate');
  };

  return (
    <ParentFrame active="evaluate">
      <QuestionScreen
        meta={{ ward: wardName, label: ev.kindLabel, total: questions.length }}
        question={view}
        answer={open ? null : answerIdx}
        note={noteText}
        showError={showError}
        onAnswer={(i) => {
          set({ value: i + 1 });
          setShowError(false);
        }}
        onNote={(text) => set(open ? { text } : { note: text })}
        onBack={back}
        onNext={next}
        onDiscard={() => setConfirm(true)}
        nextLabel={last ? 'Send evaluation' : undefined}
        savedText={savedAt ? 'Saved' : 'Saves as you go'}
        busy={busy}
      />
      {confirm ? (
        <DiscardDialog
          answered={Object.values(answers).filter((x) => x && (x.value || x.text)).length}
          ward={wardName}
          onKeep={() => setConfirm(false)}
          onDiscard={async () => {
            await discardParentEvaluation(id).catch((err) => log('discard failed', err?.message));
            navigate('/parent/evaluate');
          }}
        />
      ) : null}
    </ParentFrame>
  );
};

export default LiveEvaluation;
