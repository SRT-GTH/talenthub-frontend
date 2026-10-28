import { useEffect } from 'react';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import { useTalentHomeState } from '../../components/sections/talentHome/talentHomeState.js';
import TalentHomeHero from '../../components/sections/talentHome/TalentHomeHero.jsx';
import JourneyCard from '../../components/sections/talentHome/JourneyCard.jsx';
import CareerBuddyIntroCard from '../../components/sections/talentHome/CareerBuddyIntroCard.jsx';
import FirstQuestsCard from '../../components/sections/talentHome/FirstQuestsCard.jsx';
import UnlocksSection from '../../components/sections/talentHome/UnlocksSection.jsx';
import ExploreRolesStrip from '../../components/sections/talentHome/ExploreRolesStrip.jsx';
import MyAssessmentTab from '../../components/sections/talentHome/MyAssessmentTab.jsx';
import RecruiterActivityTab from '../../components/sections/talentHome/RecruiterActivityTab.jsx';
import GlobalSearchOverlay from '../../components/sections/talentHome/GlobalSearchOverlay.jsx';
import {
  EditHomeBanner,
  EditHomeTray,
} from '../../components/sections/talentHome/EditHomePanel.jsx';
import NewUserWelcome from '../../components/sections/talentHome/NewUserWelcome.jsx';
import GuidedTour from '../../components/sections/talentHome/GuidedTour.jsx';
import ApplyGateModal from '../../components/sections/talentHome/ApplyGateModal.jsx';
import CareerBuddyFirstChat from '../../components/sections/talentHome/CareerBuddyFirstChat.jsx';
import TalentHomeLoading from '../../components/sections/talentHome/TalentHomeLoading.jsx';
import AskBuddyFab from '../../components/sections/talentHome/AskBuddyFab.jsx';
import SpaceBanner from '../../components/sections/talentHome/SpaceBanner.jsx';

const log = debug('TalentHomePage');

/*
 * TalentHomePage — `/home`, Figma "Talents dashboard" (5686:95479).
 * Focused + Playful in one build: <UiStyleScope> puts data-ui-style on <html> while this
 * page is mounted (see wiki/playful-mode.md). Which Figma state shows is chosen from the
 * URL (talentHomeState.js). Sections are owned by separate files (wiki/talent-home.md).
 */
const TalentHomePage = () => {
  const home = useTalentHomeState();

  useEffect(() => {
    ensurePlayfulFont();
  }, []);

  // Marks <html> while /home is mounted so talentA11y.css (focus ring, reduced motion) also
  // covers portaled dialogs; removed on unmount so no other route is affected.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { state: home.stateKey, tab: home.tab, loading: home.loading });
  }, [home.stateKey, home.tab, home.loading]);

  const renderBody = () => {
    if (home.loading) return <TalentHomeLoading home={home} />;
    if (home.tab === 'assessment') return <MyAssessmentTab home={home} />;
    if (home.tab === 'recruiter') return <RecruiterActivityTab home={home} />;
    return (
      <>
        {home.editOpen && <EditHomeBanner home={home} />}
        <TalentHomeHero home={home} />
        <JourneyCard home={home} />
        <div className="grid gap-[clamp(12px,0.926vw,16px)] lg:grid-cols-2">
          <CareerBuddyIntroCard home={home} />
          <FirstQuestsCard home={home} />
        </div>
        <UnlocksSection home={home} />
        <ExploreRolesStrip home={home} />
        {home.editOpen && <EditHomeTray />}
      </>
    );
  };

  return (
    <DashboardShell role="talent" talentHome={home}>
      <UiStyleScope enabled />
      {home.persona ? <SpaceBanner persona={home.persona} /> : null}
      <div className="flex flex-col gap-[clamp(12px,0.926vw,16px)] px-[clamp(12px,1.4vw,24px)] py-[clamp(12px,1.2vw,20px)]">
        {renderBody()}
      </div>
      {home.searchOpen && <GlobalSearchOverlay home={home} />}
      {home.newUser === 'welcome' && <NewUserWelcome home={home} />}
      {home.newUser === 'tour' && <GuidedTour home={home} />}
      {home.newUser === 'chat' && <CareerBuddyFirstChat home={home} />}
      {home.newUser === 'gate' && <ApplyGateModal home={home} />}
      <AskBuddyFab home={home} rendersChat />
    </DashboardShell>
  );
};

export default TalentHomePage;
