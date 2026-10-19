import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';

const log = debug('AssessmentFrame');

/*
 * AssessmentFrame — the talent shell every My Assessment overview / detail / library screen sits in (Figma MA-01…MA-09:
 * expanded sidebar with "My Assessment" highlighted, nav streak 12). `?rail=collapsed` = icon rail. The full-assessment
 * flow (MA-04…MA-06, MA-10…MA-13) uses its own focused chrome, NOT this frame.
 * Props: assessment (useAssessmentState()), children, home (optional, useAssessmentHome().home): the talent's live home
 * state for the sidebar / nav / bell. Without it (demo mode) the shell shows the Figma rail card.
 */
const AssessmentFrame = ({ assessment, children, home = null }) => {
  const liveShell = Boolean(home?.live) && !assessment.demo;
  useEffect(() => {
    ensurePlayfulFont();
    log('mount');
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  return (
    <DashboardShell
      role="talent"
      activeNav="assessment"
      talentHome={
        liveShell
          ? { ...home, update: assessment.update, rail: assessment.rail }
          : { ...assessment, navStreak: '12' }
      }
      rail={assessment.rail}
      onToggleRail={() =>
        assessment.update({ rail: assessment.rail === 'collapsed' ? null : 'collapsed' })
      }
      railActiveId="assessment"
      railBadges={liveShell ? {} : { assessment: '142' }}
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={assessment} />
    </DashboardShell>
  );
};

export default AssessmentFrame;
