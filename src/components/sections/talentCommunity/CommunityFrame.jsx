import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';
import { useTalentHomeState } from '../talentHome/talentHomeState.js';

const log = debug('CommunityFrame');

/*
 * CommunityFrame — the talent shell every Community v2 screen sits in (Figma C-01…C-17: expanded sidebar with
 * "Community" highlighted, nav streak 12). `?rail=collapsed` = icon rail.
 * Props: community (useCommunityState()), children.
 * Live pages (not `community.demo`) show the signed-in talent's own sidebar / nav (useTalentHomeState), like /home;
 * the demo keeps the drawn Kofi shell.
 */
const CommunityFrame = ({ community, children }) => {
  const home = useTalentHomeState();
  // While home data loads, `live.placeholder` draws the dashed card (never the drawn Kofi) on live pages.
  const liveShell = !community.demo && Boolean(home?.live);
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
      talentHome={
        liveShell
          ? { ...home, update: community.update, rail: community.rail }
          : { ...community, navStreak: '12' }
      }
      rail={community.rail}
      onToggleRail={() =>
        community.update({ rail: community.rail === 'collapsed' ? null : 'collapsed' })
      }
      railActiveId="community"
      railBadges={liveShell ? {} : { assessment: '142', opportunities: '2', messages: '4' }}
    >
      <UiStyleScope enabled />
      {children}
      <AskBuddyFab home={community} />
    </DashboardShell>
  );
};

export default CommunityFrame;
