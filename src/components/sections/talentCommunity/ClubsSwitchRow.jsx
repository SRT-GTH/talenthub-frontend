import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import CircleSwitch from './circle/CircleSwitch.jsx';
import { useCirclePending } from './circle/useCirclePending.js';

const log = debug('ClubsSwitchRow');

/*
 * ClubsSwitchRow — the "Clubs | My network" segmented switch the recruiter frames draw at the top of EVERY club screen
 * (RC-C04 … C17: Figma 10194:19423 etc., above the club hero). The talent club page has no such row, so only the recruiter
 * variant mounts it. The control itself (labels, count, links, rail) is the network section's `CircleSwitch`; this wrapper only
 * feeds it the pending count. Props: rail ('collapsed' keeps the rail in the switch links).
 */
const ClubsSwitchRow = ({ rail }) => {
  const pending = useCirclePending();
  useEffect(() => {
    log('mount', { pending, rail });
  }, [pending, rail]);
  return <CircleSwitch active="communities" count={pending} rail={rail} />;
};

export default ClubsSwitchRow;
