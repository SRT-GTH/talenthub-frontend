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

const log = debug('ParentEvaluateResultPage');

/*
 * ParentEvaluateResultPage — /parent/evaluate/result (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, sections C-E).
 *   (none) | ?state=submitted  PE-04  10034:149508  thank you + key observations
 *   ?state=reviewed            PE-05  10034:150136  Abena reviewed it, 2 items under review
 *   ?state=outcome             PE-05c 10052:4825    "Our team reviewed 2 items" modal over PE-05
 *   ?state=auto                PE-05b 10052:4434    published automatically after 7 days
 *   ?state=turned18            PE-06  10034:150815  Abena turned 18
 * "Under review" rows open the modal (?state=outcome); Done / X / Esc close it (back to ?state=reviewed).
 */
const ParentEvaluateResultPage = () => {
  const [params, setParams] = useSearchParams();
  const state = params.get('state') ?? 'submitted';
  log('state', state);
  const go = (s) => setParams({ state: s }, { replace: true });

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
