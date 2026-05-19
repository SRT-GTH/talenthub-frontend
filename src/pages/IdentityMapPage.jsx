import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../components/sections/engagement/EngagementTopBar.jsx';
import EngagementFooter from '../components/sections/engagement/EngagementFooter.jsx';
import IdentityStageMap from '../components/sections/engagement/IdentityStageMap.jsx';
import CareerBuddyPromoCard from '../components/sections/engagement/CareerBuddyPromoCard.jsx';
import HowItWorksCard from '../components/sections/engagement/HowItWorksCard.jsx';
import LeaderboardsLockedCard from '../components/cards/LeaderboardsLockedCard.jsx';
import { PROFILE_STAGES, STAGE_STATUS } from '../constants/profileStages.js';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('IdentityMapPage');

/*
 * IdentityMapPage — game-map view of the "Section 1 · Your Identity" flow.
 * Source: Figma frame (Section 1 · Your Identity · 2 of 9 stages done).
 *
 * A more playful alternative to the list-based ProfileEngagementPage: the
 * same 9 profile stages are arranged along a vertical green map, with two
 * milestone nodes (Reward, Trophy) marking progress checkpoints.
 *
 * Layout:
 *   ┌─ EngagementTopNav          (logo + Save & Exit + user)
 *   ├─ EngagementTopBar          (stage trail + step indicator)
 *   ├─ Main grid (two-column on lg+)
 *   │   ├─ left   → IdentityStageMap (green map column)
 *   │   └─ right  → Career Buddy + How it works + Leaderboards locked
 *   └─ EngagementFooter          (status + actions)
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

  const handleStageSelect = (stage) => {
    log('stage selected', stage.id);
  };

  const handleSkipHome = () => {
    navigate(ROUTES.home);
  };

  const handleGetStarted = () => {
    const next = PROFILE_STAGES[counts.currentIndex];
    handleStageSelect(next);
  };

  const handleStartBuddy = () => {
    log('start with career buddy');
  };

  const handleSaveExit = () => {
    navigate(ROUTES.home);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav onSaveExit={handleSaveExit} />
      <EngagementTopBar
        currentStageIndex={counts.currentIndex}
        completionPct={counts.completionPct}
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
    </div>
  );
};

export default IdentityMapPage;
