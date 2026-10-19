import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';

const log = debug('SkillsLabFrame');

/*
 * SkillsLabFrame — the talent shell every Skills Lab hub / details screen sits in (Figma SL-01, SL-02, SL-07…:
 * expanded sidebar with "Skills Lab" highlighted, nav streak 12, Getting-started rail card). `?rail=collapsed`
 * = icon rail. The lab-flow and game screens use their own focused chrome (see the play pages), NOT this frame.
 * Props: skills (useSkillsLabState()), children.
 */
const SkillsLabFrame = ({ skills, children }) => {
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
      activeNav="skills-lab"
      talentHome={{ ...skills, navStreak: '12' }}
      rail={skills.rail}
      onToggleRail={() => skills.update({ rail: skills.rail === 'collapsed' ? null : 'collapsed' })}
      railActiveId="skills-lab"
      railBadges={{ opportunities: '2' }}
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={skills} />
    </DashboardShell>
  );
};

export default SkillsLabFrame;
