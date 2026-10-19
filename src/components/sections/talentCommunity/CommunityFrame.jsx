import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';

const log = debug('CommunityFrame');

/*
 * CommunityFrame — the talent shell every Community v2 screen sits in (Figma C-01…C-17: expanded sidebar with
 * "Community" highlighted, nav streak 12). `?rail=collapsed` = icon rail.
 * Props: community (useCommunityState()), children.
 */
const CommunityFrame = ({ community, children }) => {
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
      activeNav="community"
      talentHome={{ ...community, navStreak: '12' }}
      rail={community.rail}
      onToggleRail={() =>
        community.update({ rail: community.rail === 'collapsed' ? null : 'collapsed' })
      }
      railActiveId="community"
      railBadges={{ assessment: '142', opportunities: '2', messages: '4' }}
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={community} />
    </DashboardShell>
  );
};

export default CommunityFrame;
