import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopBar from '../components/sections/engagement/EngagementTopBar.jsx';
import EngagementHero from '../components/sections/engagement/EngagementHero.jsx';
import ProfileStagesList from '../components/sections/engagement/ProfileStagesList.jsx';
import CareerBuddyPromoCard from '../components/sections/engagement/CareerBuddyPromoCard.jsx';
import HowItWorksCard from '../components/sections/engagement/HowItWorksCard.jsx';
import EngagementFooter from '../components/sections/engagement/EngagementFooter.jsx';
import { PROFILE_STAGES, STAGE_STATUS } from '../constants/profileStages.js';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('ProfileEngagementPage');

/*
 * ProfileEngagementPage — the "9 profile stages" engagement hub.
 * Source: Figma frame 3384:81927 (Gh Design system — engagement side).
 *
 * Candidates land here to build out their profile (avatar, interests,
 * personality, skills, work, portfolio, certs, career goals, talent pitch).
 * Each stage is non-blocking — pick any order, save anytime, come back.
 *
 * Layout (Figma exact, clamp-scaled):
 *   ┌─ EngagementTopBar          (full-bleed, breadcrumbs + step indicator)
 *   ├─ EngagementHero            (full-bleed, headline + standing card)
 *   ├─ Main grid (two-column on lg+)
 *   │   ├─ left  → ProfileStagesList
 *   │   └─ right → CareerBuddyPromoCard + HowItWorksCard
 *   └─ EngagementFooter          (full-bleed, status + actions)
 *
 * The active stage / completion data is derived directly from
 * PROFILE_STAGES — when those statuses are eventually wired to the store
 * the only change needed here is swapping the constants import for a
 * selector. Everything else (counts, percentages, current-step label)
 * recomputes automatically via useMemo.
 */

const ProfileEngagementPage = () => {
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
    log('counts', { done, inProgress, remaining, completionPct, currentIndex });
    return { done, inProgress, remaining, completionPct, currentIndex };
  }, []);

  const handleStageSelect = (stage) => {
    log('stage selected', stage.id);
    // Routing per-stage screens lands in a future PR; for now this is a hook.
  };

  const handleSkipHome = () => {
    log('skip to home');
    navigate(ROUTES.home);
  };

  const handleGetStarted = () => {
    log('get started');
    const next = PROFILE_STAGES[counts.currentIndex];
    handleStageSelect(next);
  };

  const handleStartBuddy = () => {
    log('start with career buddy');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
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

      <main className="flex-1 px-[clamp(16px,4vw,56px)] py-[clamp(24px,3vw,40px)]">
        <div className="mx-auto grid gap-8 max-w-[1620px] lg:grid-cols-[minmax(0,1fr)_clamp(320px,28vw,400px)]">
          <ProfileStagesList onStageSelect={handleStageSelect} />

          <div className="flex flex-col gap-4">
            <CareerBuddyPromoCard onStart={handleStartBuddy} />
            <HowItWorksCard />
          </div>
        </div>
      </main>

      <EngagementFooter onSkip={handleSkipHome} onContinue={handleGetStarted} />
    </div>
  );
};

export default ProfileEngagementPage;
