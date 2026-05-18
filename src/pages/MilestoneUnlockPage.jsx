import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../components/sections/engagement/EngagementTopBar.jsx';
import EngagementFooter from '../components/sections/engagement/EngagementFooter.jsx';
import MilestoneHeroPanel from '../components/sections/engagement/MilestoneHeroPanel.jsx';
import UnlockedFeaturesSection from '../components/sections/engagement/UnlockedFeaturesSection.jsx';
import { ROUTES } from '../constants/routes.js';
import { debug } from '../utils/debug.js';

const log = debug('MilestoneUnlockPage');

/*
 * MilestoneUnlockPage — celebration screen after completing a milestone.
 * Source: Figma frame ("You're discoverable" — Milestone 1 of 3).
 *
 * The flow surfaces three named milestones along the engagement journey:
 *   1. "You're discoverable" — after Avatar + Interests + Personality
 *   2. (future) "You're matchable" — after Skills + Work + Portfolio
 *   3. (future) "You're hireable" — after Certs + Goals + Pitch
 *
 * Today we hardcode the discoverable milestone's copy and data here. Once
 * milestones 2 and 3 land we'll lift the per-milestone payload into a
 * shared constants module keyed by milestone id.
 *
 * Layout:
 *   ┌─ EngagementTopNav        (with the gold "Switch Modes" pill enabled)
 *   ├─ EngagementTopBar        (stage trail)
 *   ├─ MilestoneHeroPanel      (gift + headline + stats + CTAs + completed)
 *   ├─ UnlockedFeaturesSection ("what you just unlocked" 3-card grid)
 *   └─ EngagementFooter
 */

const DISCOVERABLE_MILESTONE = {
  number: 1,
  totalMilestones: 3,
  headlinePrefix: 'You’re',
  headlineAccent: 'discoverable.',
  description:
    'You’ve completed the first three stages. Your profile card is now live in recruiter search. Thousands of employers in Ghana can find you right now.',
  stats: [
    { value: '3/9', label: 'Stages Done', accent: 'brand' },
    { value: '33%', label: 'Profile Strength', accent: 'accent' },
    { value: '+50 XP', label: 'Milestone Bonus', accent: 'brand' },
  ],
  completedStages: ['Avatar', 'Interest', 'Personality'],
  features: [
    {
      title: 'Recruiter search visibility',
      description:
        'Your profile card is now live and discoverable. Recruiters searching for talent in your interest areas will see your card.',
      highlighted: true,
    },
    {
      title: 'Recruiter reach-out enabled',
      description:
        'Recruiters can now send you messages directly. Profiles that are discoverable receive an average of 3.2 reach-outs in the first week.',
      highlighted: true,
    },
    {
      title: 'Personality archetype visible',
      description:
        'Your Architect archetype and six-trait breakdown are now shown on your recruiter card alongside your avatar.',
      highlighted: false,
    },
  ],
};

const MilestoneUnlockPage = () => {
  log('mount');
  const navigate = useNavigate();

  // For the milestone hero we lock the trail to its visual "just finished
  // stage 3" state — i.e. Personality completed (index 3 is the next stage
  // to start, which is Skills). This is the data shown when the celebration
  // screen appears, regardless of the live PROFILE_STAGES state.
  const trailCurrentIndex = 3; // Skills is the next unstarted stage
  const completionPct = Math.round((3 / 9) * 100); // 33%

  const handleSwitchModes = () => {
    log('switch modes');
    navigate(ROUTES.identityMap);
  };

  const handleSaveExit = () => {
    navigate(ROUTES.home);
  };

  const handleSkipHome = () => {
    navigate(ROUTES.home);
  };

  const handleContinue = () => {
    log('continue building');
    navigate(ROUTES.profileEngagement);
  };

  const handleClaim = () => {
    log('claim reward');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav
        onSaveExit={handleSaveExit}
        showSwitchModes
        onSwitchModes={handleSwitchModes}
      />
      <EngagementTopBar currentStageIndex={trailCurrentIndex} completionPct={completionPct} />

      <main className="flex-1">
        <MilestoneHeroPanel
          milestoneNumber={DISCOVERABLE_MILESTONE.number}
          totalMilestones={DISCOVERABLE_MILESTONE.totalMilestones}
          headlinePrefix={DISCOVERABLE_MILESTONE.headlinePrefix}
          headlineAccent={DISCOVERABLE_MILESTONE.headlineAccent}
          description={DISCOVERABLE_MILESTONE.description}
          stats={DISCOVERABLE_MILESTONE.stats}
          completedStages={DISCOVERABLE_MILESTONE.completedStages}
          onClaim={handleClaim}
          onContinue={handleContinue}
        />

        <UnlockedFeaturesSection items={DISCOVERABLE_MILESTONE.features} />
      </main>

      <EngagementFooter onSkip={handleSkipHome} onContinue={handleContinue} />
    </div>
  );
};

export default MilestoneUnlockPage;
