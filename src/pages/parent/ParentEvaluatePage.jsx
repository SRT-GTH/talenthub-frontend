import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import EvaluateEmpty from '../../components/sections/parent/evaluate/EvaluateEmpty.jsx';
import EvaluateStart from '../../components/sections/parent/evaluate/EvaluateStart.jsx';
import { useParentLiveMode } from '../../components/sections/parent/live/parentLive.js';
import { initialsAvatar, shortDay } from '../../components/sections/parent/live/parentLiveView.js';
import {
  discardParentEvaluation,
  fetchParentEvaluations,
  parentError,
  parentErrorCode,
  startParentEvaluation,
} from '../../services/parent.api.js';

/*
 * ParentEvaluatePage — /parent/evaluate (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, section A · Start).
 *   (none)           PE-01  10034:147583  choose ward and type
 *   ?state=resume    PE-01b 10042:3332    continue where you left off
 *   ?state=none      PE-07  10042:3861    no ward to evaluate yet (sidebar shows "no ward linked yet")
 * Live (signed in): the parent's wards under 18 (GET /parent/evaluations), their open draft as the "continue" card, and a
 * real start (POST /parent/evaluations) that opens /parent/evaluate/questions?id=<evaluation>.
 */
// Question counts of the live set per kind (backend EVAL_KINDS over the 13 parent questions).
const LIVE_TYPES = [
  {
    id: 'general',
    title: 'General evaluation',
    body: 'A rounded picture · 13 questions · about 8 min',
  },
  {
    id: 'academic',
    title: 'Academic strengths',
    body: 'Learning, strengths, interests · 6 questions',
  },
  {
    id: 'character',
    title: 'Character & social skills',
    body: 'How they work with others · 5 questions',
  },
  { id: 'career', title: 'Career interests', body: 'What lights them up · 4 questions' },
];
const KIND_TOTAL = { general: 13, academic: 6, character: 5, career: 4 };

const ParentEvaluatePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const live = useParentLiveMode();
  const state = params.get('state');
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = () =>
    fetchParentEvaluations()
      .then(setData)
      .catch((err) => setError(parentError(err)));
  useEffect(() => {
    if (live) load();
  }, [live]);

  if (!live) {
    return (
      <ParentFrame active="evaluate" sidebar={state === 'none' ? 'none' : 'linked'}>
        {state === 'none' ? <EvaluateEmpty /> : <EvaluateStart resume={state === 'resume'} />}
      </ParentFrame>
    );
  }

  const wards = (data?.wards || []).filter((w) => w.age == null || w.age < 18);
  const open = (data?.evaluations || []).find((e) => e.status === 'pending');
  const openWard = open && (data?.wards || []).find((w) => w.wardId === open.wardId);
  const total = open ? KIND_TOTAL[open.kind] || 13 : 0;

  const liveProps = {
    wards: wards.map((w) => ({
      id: w.wardId,
      name: w.firstName,
      age: w.age,
      photo: initialsAvatar(w.firstName),
    })),
    types: LIVE_TYPES,
    resume: open
      ? {
          eyebrow: 'Continue where you left off',
          ward: initialsAvatar(openWard?.firstName || '?'),
          title: `${open.kindLabel} · ${openWard?.firstName || 'your ward'}`,
          progress: `${open.answered} of ${total} answered${open.draftSavedAt ? ` · saved ${shortDay(open.draftSavedAt)}` : ''}`,
          done: open.answered,
          total,
          note: 'You can have one evaluation going per ward. Finish or discard this one to start a new one.',
        }
      : null,
    busy,
    error,
    onContinue: () => navigate(`/parent/evaluate/questions?id=${open.id}`),
    onDiscard: async () => {
      setBusy(true);
      try {
        await discardParentEvaluation(open.id);
        await load();
      } catch (err) {
        setError(parentError(err));
      } finally {
        setBusy(false);
      }
    },
    onStart: async (wardId, kind) => {
      setBusy(true);
      setError(null);
      try {
        const res = await startParentEvaluation({ wardId, kind });
        navigate(`/parent/evaluate/questions?id=${res.evaluation.id}`);
      } catch (err) {
        if (parentErrorCode(err) === 'EVALUATION_ALREADY_PENDING') {
          setError(
            'You already have an evaluation going for this ward. Continue or discard it first.'
          );
        } else setError(parentError(err));
        setBusy(false);
      }
    },
  };

  return (
    <ParentFrame active="evaluate">
      {!data && !error ? (
        <p role="status" className="m-0 font-sans text-[15px] text-[#575755]">
          Loading…
        </p>
      ) : wards.length === 0 && !open ? (
        <EvaluateEmpty />
      ) : (
        <EvaluateStart live={liveProps} />
      )}
    </ParentFrame>
  );
};

export default ParentEvaluatePage;
