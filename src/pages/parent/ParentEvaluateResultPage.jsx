import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import SubmittedScreen from '../../components/sections/parent/evaluate/results/SubmittedScreen.jsx';
import OutcomeScreen from '../../components/sections/parent/evaluate/results/OutcomeScreen.jsx';
import ModerationDialog from '../../components/sections/parent/evaluate/results/ModerationDialog.jsx';
import Turned18Screen from '../../components/sections/parent/evaluate/results/Turned18Screen.jsx';
import {
  AUTO,
  REVIEWED,
} from '../../components/sections/parent/evaluate/results/data/resultsData.js';
import {
  useParentLiveMode,
  useParentMe,
} from '../../components/sections/parent/live/parentLive.js';
import { fetchParentEvaluations, parentError } from '../../services/parent.api.js';

const log = debug('ParentEvaluateResultPage');

/*
 * ParentEvaluateResultPage — /parent/evaluate/result (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, sections C-E).
 *   (none) | ?state=submitted  PE-04  10034:149508  thank you + key observations
 *   ?state=reviewed            PE-05  10034:150136  Abena reviewed it, 2 items under review
 *   ?state=outcome             PE-05c 10052:4825    "Our team reviewed 2 items" modal over PE-05
 *   ?state=auto                PE-05b 10052:4434    published automatically after 7 days
 *   ?state=turned18            PE-06  10034:150815  Abena turned 18
 * "Under review" rows open the modal (?state=outcome); Done / X / Esc close it (back to ?state=reviewed).
 * Live (signed in, ?id=<evaluation>): PE-04 with the real evaluation: the parent's name, the ward, what they answered
 * and wrote. The ward's review states (PE-05 / 05b / 05c) follow once the ward-side review screen exists.
 */
const DIM_LABEL = { strengths: 'Strengths', interests: 'Interests', career: 'Career ideas' };

const ParentEvaluateResultPage = () => {
  const [params, setParams] = useSearchParams();
  const live = useParentLiveMode();
  const me = useParentMe();
  const id = live ? params.get('id') : null;
  const [liveData, setLiveData] = useState(null);
  const [error, setError] = useState(null);
  const state = params.get('state') ?? 'submitted';
  log('state', state, { id });
  const go = (s) => setParams({ state: s }, { replace: true });

  useEffect(() => {
    if (!id) return;
    fetchParentEvaluations()
      .then((all) => {
        const ev = (all.evaluations || []).find((e) => e.id === id);
        const ward = ev && (all.wards || []).find((w) => w.wardId === ev.wardId);
        const others = (all.wards || []).filter(
          (w) => w.wardId !== ev?.wardId && (w.age == null || w.age < 18)
        );
        setLiveData({ ev, ward, others });
      })
      .catch((err) => setError(parentError(err)));
  }, [id]);

  if (id) {
    const { ev, ward, others } = liveData || {};
    const first = ward?.firstName || 'your ward';
    const content = ev
      ? {
          title: `Thank you, ${me.data?.parent?.firstName || 'there'}`,
          pill: ev.status === 'submitted' ? 'Submitted' : ev.status,
          sub: `Your evaluation is with ${first}. They review it before it shows on their profile.`,
          heading: 'Your key observations',
          observations: [
            { label: 'Evaluation', text: `${ev.kindLabel} · ${ev.responseCount ?? 0} answers` },
            ...(ev.openAnswers || []).map((a) => ({
              label: DIM_LABEL[a.dimension] || 'In your words',
              text: a.text,
            })),
            {
              label: 'Your notes',
              text: ev.noteCount
                ? `${ev.noteCount} note${ev.noteCount === 1 ? '' : 's'} added`
                : 'No notes',
            },
          ],
          next: others?.length ? `Evaluate ${others[0].firstName} next` : 'Back to Evaluate',
          home: 'Back to Home',
        }
      : null;
    return (
      <ParentFrame active="evaluate">
        {content ? (
          <SubmittedScreen content={content} />
        ) : (
          <p role={error ? 'alert' : 'status'} className="m-0 font-sans text-[15px] text-[#575755]">
            {error || (liveData ? 'Evaluation not found.' : 'Loading…')}
          </p>
        )}
      </ParentFrame>
    );
  }

  let body;
  if (state === 'reviewed' || state === 'outcome') {
    body = <OutcomeScreen content={REVIEWED} onOpenReview={() => go('outcome')} />;
  } else if (state === 'auto') {
    body = <OutcomeScreen content={AUTO} />;
  } else if (state === 'turned18') {
    body = <Turned18Screen />;
  } else {
    body = <SubmittedScreen />;
  }

  return (
    <ParentFrame active="evaluate" sidebar="linked">
      {body}
      {state === 'outcome' ? <ModerationDialog onClose={() => go('reviewed')} /> : null}
    </ParentFrame>
  );
};

export default ParentEvaluateResultPage;
