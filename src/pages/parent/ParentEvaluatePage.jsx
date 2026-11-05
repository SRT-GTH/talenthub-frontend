import { useSearchParams } from 'react-router-dom';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import EvaluateEmpty from '../../components/sections/parent/evaluate/EvaluateEmpty.jsx';
import EvaluateStart from '../../components/sections/parent/evaluate/EvaluateStart.jsx';

/*
 * ParentEvaluatePage — /parent/evaluate (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, section A · Start).
 *   (none)           PE-01  10034:147583  choose ward and type
 *   ?state=resume    PE-01b 10042:3332    continue where you left off
 *   ?state=none      PE-07  10042:3861    no ward to evaluate yet (sidebar shows "no ward linked yet")
 * Sections B-E (questions, submit, what happens next, ward turned 18) are not built yet.
 */
const ParentEvaluatePage = () => {
  const [params] = useSearchParams();
  const state = params.get('state');
  return (
    <ParentFrame active="evaluate" sidebar={state === 'none' ? 'none' : 'linked'}>
      {state === 'none' ? <EvaluateEmpty /> : <EvaluateStart resume={state === 'resume'} />}
    </ParentFrame>
  );
};

export default ParentEvaluatePage;
