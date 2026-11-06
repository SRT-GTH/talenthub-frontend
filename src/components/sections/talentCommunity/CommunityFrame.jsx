import { useEffect } from 'react';
import '../../../styles/talentA11y.css';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import AskBuddyFab from '../talentHome/AskBuddyFab.jsx';
import { useTalentHomeState } from '../talentHome/talentHomeState.js';
import { useCommunityVariant } from './communityVariant.js';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';

const log = debug('CommunityFrame');

/*
 * CommunityFrame — the talent shell every Community v2 screen sits in (Figma C-01…C-17: expanded sidebar with
 * "Community" highlighted, nav streak 12). `?rail=collapsed` = icon rail.
 * Props: community (useCommunityState()), children.
 * Live pages (not `community.demo`) show the signed-in talent's own sidebar / nav (useTalentHomeState), like /home;
 * the demo keeps the drawn Kofi shell.
 */
const CommunityFrame = ({ community, children }) => {
  const { isRecruiter } = useCommunityVariant();
  // A recruiter session must never hit the talent home API (its 401 redirects to /login).
  const home = useTalentHomeState({ enabled: !isRecruiter });
  // Figma draws the recruiter screens in SF Pro Rounded: the bundled face (styles/parent.css) while they are mounted.
  useScopedRoundedFont('data-recruiter-ui', isRecruiter);
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

  // Recruiter variant (Figma 10026:36840): the recruiter dashboard shell (top bar, profile card rail, Community active), one style, no Playful.
  if (isRecruiter) {
    return (
      <DashboardShell defaultSidebarCollapsed={community.rail === 'collapsed'}>
        {children}
      </DashboardShell>
    );
  }

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
