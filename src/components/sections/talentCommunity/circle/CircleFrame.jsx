import { useEffect } from 'react';
import '../../../../styles/talentA11y.css';
import { debug } from '../../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../../talentHome/AskBuddyFab.jsx';

const log = debug('CircleFrame');

/*
 * CircleFrame — the talent shell every My circle screen sits in (Figma NW-01 … NW-11: icon rail with "Community" active and the
 * dot badges, nav streak 12; the flow frames 1-2 draw the expanded sidebar). `?rail=collapsed` = the icon rail.
 * Props: circle (useCircleState()), children. Mock data only: every My circle URL draws the Kofi shell, as in Figma.
 * ⚠️ The Community "3" badge on the rail / sidebar (people waiting to link up) is not wired — the shell components are not ours
 * (REQUEST): only the dot badges and the Messages "4" pill exist there today.
 */
const CircleFrame = ({ circle, children }) => {
  useEffect(() => {
    ensurePlayfulFont();
    log('mount', { rail: circle.rail });
  }, [circle.rail]);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  return (
    <DashboardShell
      role="talent"
      activeNav="community"
      // Demo frames draw Kofi's shell (streak 12, rail badges); a signed-in talent's shell is their own.
      talentHome={
        circle.demo ? { ...circle, navStreak: '12', railHome: true } : { ...circle, railHome: true }
      }
      rail={circle.rail}
      onToggleRail={() => circle.update({ rail: circle.rail === 'collapsed' ? null : 'collapsed' })}
      railActiveId="community"
      railBadges={
        circle.demo
          ? { assessment: '142', opportunities: '2', messages: '4', community: '3' }
          : undefined
      }
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={circle} />
    </DashboardShell>
  );
};

export default CircleFrame;
