import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../../components/sections/engagement/EngagementTopBar.jsx';
import EngagementHero from '../../components/sections/engagement/EngagementHero.jsx';
import EngagementFooter from '../../components/sections/engagement/EngagementFooter.jsx';
import IdentityStageMap from '../../components/sections/engagement/IdentityStageMap.jsx';
import CareerBuddyPromoCard from '../../components/sections/engagement/CareerBuddyPromoCard.jsx';
import HowItWorksCard from '../../components/sections/engagement/HowItWorksCard.jsx';
import LeaderboardsLockedCard from '../../components/cards/LeaderboardsLockedCard.jsx';
import EntryMethodModal from '../../components/sections/engagement/EntryMethodModal.jsx';
import { PROFILE_STAGES, STAGE_STATUS } from '../../constants/profileStages.js';
import { debug } from '../../utils/debug.js';

const log = debug('IdentityMapPage');

/*
 * IdentityMapPage — game-map view of the "Section 1 · Your Identity" flow.
 * Source: Figma frame (Section 1 · Your Identity · 2 of 9 stages done).
 *
 * Layout:
 *   ┌─ EngagementTopNav          (logo + Save & Exit + user)
 *   ├─ EngagementTopBar          (stage trail + step indicator)
 *   ├─ EngagementHero            (Your Profile, Your Way + Where You Stand)
 *   ├─ Main grid (two-column on lg+)
 *   │   ├─ left   → IdentityStageMap (green map column)
 *   │   └─ right  → Career Buddy + How it works + Leaderboards locked
 *   ├─ EngagementFooter          (status + actions)
 *   └─ EntryMethodModal          (auto-opens on first mount)
 */

const IdentityMapPage = () => {
  log('mount');
  const navigate = useNavigate();

  const counts = useMemo(() => {
    const done = PROFILE_STAGES.filter((s) => s.status === STAGE_STATUS.DONE).length;
    const inProgress = PROFILE_STAGES.filter((s) => s.status === STAGE_STATUS.IN_PROGRESS).length;
    const remaining = PROFILE_STAGES.length - done - inProgress;
    const completionPct = Math.round((done / PROFILE_STAGES.length) * 100);
    const currentIndex = Math.max(
      0,
      PROFILE_STAGES.findIndex((s) => s.status !== STAGE_STATUS.DONE)
    );
    return { done, inProgress, remaining, completionPct, currentIndex };
  }, []);

  // Entry-method modal opens on first mount (matches the engagement-hub
  // behaviour — gives the user the three quick ways to add profile data
  // even from the map view).
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(true);
  const closeEntryModal = () => setIsEntryModalOpen(false);

  const handleStageSelect = (stage) => {
    log('stage selected', stage.id);
  };

  const handleSkipHome = () => {
    navigate('/');
  };

  const handleGetStarted = () => {
    const next = PROFILE_STAGES[counts.currentIndex];
    handleStageSelect(next);
  };

  const handleStartBuddy = () => {
    log('start with career buddy → open entry method modal');
    setIsEntryModalOpen(true);
  };

  const handleSaveExit = () => {
    navigate('/');
  };

  const handleFillManually = () => {
    log('entry method: fill manually');
    closeEntryModal();
  };
  const handleChatWithAi = () => {
    log('entry method: chat with AI');
    closeEntryModal();
  };
  const handleUploadCv = () => {
    log('entry method: upload CV');
    closeEntryModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav onSaveExit={handleSaveExit} />
      <EngagementTopBar
        currentStageIndex={counts.currentIndex}
        completionPct={counts.completionPct}
      />

      <EngagementHero
        completionPct={counts.completionPct}
        doneCount={counts.done}
        inProgressCount={counts.inProgress}
        remainingCount={counts.remaining}
      />

      <main className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_clamp(320px,28vw,400px)]">
          <IdentityStageMap onStageSelect={handleStageSelect} />

          <aside className="flex flex-col gap-4 bg-background-default p-[clamp(12px,2vw,24px)]">
            <CareerBuddyPromoCard onStart={handleStartBuddy} />
            <HowItWorksCard />
            <LeaderboardsLockedCard remainingStages={counts.remaining} city="Accra" />
          </aside>
        </div>
      </main>

      <EngagementFooter onSkip={handleSkipHome} onContinue={handleGetStarted} />

      <EntryMethodModal
        isOpen={isEntryModalOpen}
        onClose={closeEntryModal}
        onFillManually={handleFillManually}
        onChatWithAi={handleChatWithAi}
        onUploadCv={handleUploadCv}
      />
    </div>
  );
};

export default IdentityMapPage;
