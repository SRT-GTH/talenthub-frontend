import { useSearchParams } from 'react-router-dom';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import EvaluateEmpty from '../../components/sections/parent/evaluate/EvaluateEmpty.jsx';
import EvaluateStart from '../../components/sections/parent/evaluate/EvaluateStart.jsx';
import { useParentMe } from '../../components/sections/parent/live/parentLive.js';
import ParentNotYet from '../../components/sections/parent/states/ParentNotYet.jsx';
import { NOT_YET_PAGES } from '../../components/sections/parent/states/notYetCopy.js';
import { debug } from '../../utils/debug.js';

const log = debug('ParentEvaluatePage');

/*
 * ParentEvaluatePage — /parent/evaluate (Figma canvas "Parent · 07 Evaluate my child" 10057:66837, section A · Start).
 *   (none)           PE-01  10034:147583  choose ward and type
 *   ?state=resume    PE-01b 10042:3332    continue where you left off
 *   ?state=none      PE-07  10042:3861    no ward to evaluate yet (sidebar shows "no ward linked yet")
 * Sections B-E: /parent/evaluate/questions and /parent/evaluate/result.
 * Live (signed-in parent, not a frame URL): no evaluation endpoint exists, so a parent with wards sees ParentNotYet and one with none sees PE-07
 * (EvaluateEmpty, "Link a ward") instead of Emma's mock wards.
 */
const ParentEvaluatePage = () => {
  const [params] = useSearchParams();
  const state = params.get('state');
  const me = useParentMe();
  const noWards = me.live && me.status === 'ready' && !(me.data?.wards || []).length;
  log('render', { state, live: me.live, noWards });
  if (me.live) {
    return (
      <ParentFrame active="evaluate" sidebar="linked">
        {noWards ? <EvaluateEmpty /> : <ParentNotYet {...NOT_YET_PAGES.evaluate} />}
      </ParentFrame>
    );
  }
  return (
    <ParentFrame active="evaluate" sidebar={state === 'none' ? 'none' : 'linked'}>
      {state === 'none' ? <EvaluateEmpty /> : <EvaluateStart resume={state === 'resume'} />}
    </ParentFrame>
  );
};

export default ParentEvaluatePage;
