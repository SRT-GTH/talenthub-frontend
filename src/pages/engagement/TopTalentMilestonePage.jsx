import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementTopNav from '../../components/sections/engagement/EngagementTopNav.jsx';
import EngagementTopBar from '../../components/sections/engagement/EngagementTopBar.jsx';
import EngagementHero from '../../components/sections/engagement/EngagementHero.jsx';
import EngagementFooter from '../../components/sections/engagement/EngagementFooter.jsx';
import MilestoneHeroPanel from '../../components/sections/engagement/MilestoneHeroPanel.jsx';
import UnlockedFeaturesSection from '../../components/sections/engagement/UnlockedFeaturesSection.jsx';
import MilestoneDetailsModal from '../../components/sections/engagement/MilestoneDetailsModal.jsx';
import trophyImg from '../../assets/engagement/trophy-icon.png';
import { debug } from '../../utils/debug.js';

const log = debug('TopTalentMilestonePage');

/*
 * TopTalentMilestonePage — celebration screen for the final milestone
 * (3 of 3): all 9 stages complete. Source: Figma frame ("You're discoverable"
 * end-state — 9/9 stages done, 100% profile strength, +200 XP).
 *
 * Layout:
 *   ┌─ EngagementTopNav         (with Switch Modes pill)
 *   ├─ EngagementTopBar         (Step 9 of 9 · Pitch · 100% profile complete)
 *   ├─ EngagementHero           (9 done, 0 remaining, 100% complete)
 *   ├─ MilestoneHeroPanel       (gold star + "You're discoverable." + 3-stat
 *   │                            row + Back / Go to Dashboard CTAs + 9
 *   │                            completed-stage chips)
 *   ├─ UnlockedFeaturesSection  (7-card "what you just unlocked" grid)
 *   ├─ EngagementFooter
 *   └─ MilestoneDetailsModal    ("Top Talent Status" — opens when the user
 *                                clicks "Go to Dashboard")
 */

const TOP_TALENT_MILESTONE = {
  number: 3,
  totalMilestones: 3,
  headline: (
    <>
      You&apos;re <span className="italic text-brand-green">discoverable.</span>
    </>
  ),
  description:
    "You've completed all nine stages. Your profile is live, ranked top, and unlocked for every recruiter and mentor in Ghana.",
  stats: [
    { value: '9/9', label: 'Stages Done', accent: 'brand' },
    { value: '100%', label: 'Profile Strength', accent: 'brand' },
    { value: '+200 XP', label: 'Milestone Bonus', accent: 'accent' },
  ],
  completedStages: [
    'Avatar',
    'Interest',
    'Personality',
    'Skills',
    'Work',
    'Portfolio',
    'Certifications',
    'Goals',
    'Pitch',
  ],
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
      highlighted: true,
    },
    {
      title: 'Full analytics dashboard',
      description:
        'Every metric unlocked: profile views, search appearances, project attention time, pitch-video plays, and recruiter intent signals.',
      highlighted: true,
    },
    {
      title: 'Exclusive opportunities',
      description:
        'Access to roles that are only visible to Top Talent profiles — positions that recruiters mark as high-value and selective.',
      highlighted: true,
    },
    {
      title: 'Mentor matching',
      description:
        'Matched with senior professionals in your field whove opted in to mentor Top Talent profiles. Introductions facilitated by GTH.',
      highlighted: true,
    },
    {
      title: 'All 3 milestone badges',
      description:
        'Discoverable + Top 20% + Top Talent — all three badges appear on your profile and recruiter card simultaneously.',
      highlighted: true,
    },
  ],
  // Details modal — "Top Talent Status". Opens when the user hits the
  // primary CTA on the celebration screen.
  details: {
    headline: (
      <>
        Top <span className="italic text-brand-green">Talent Status</span>
      </>
    ),
    description:
      'Your profile card is live. Recruiters can find you, view your avatar and personality archetype, and reach out directly.',
    items: [
      {
        icon: 'check',
        title: 'Priority search placement',
        description:
          "You rank first when your skills match a recruiter's search. 6.4× more views than standard profiles.",
      },
      {
        icon: 'arrow',
        title: 'Exclusive opportunities unlocked',
        description:
          'Roles visible only to Top Talent profiles: high-value, selective positions from the best employers on GTH.',
      },
      {
        icon: 'plus',
        title: 'Parent or guardian contact',
        description:
          "You're now eligible for introductions to senior professionals in your field who've opted in to mentor Top Talent profiles.",
      },
    ],
    ctaLabel: 'Go to my dashboard',
  },
};

const TopTalentMilestonePage = () => {
  log('mount');
  const navigate = useNavigate();

  // Frozen trail state: all 9 done, Pitch is the last completed step.
  const trailCurrentIndex = 8; // Pitch
  const completionPct = 100;

  // Details modal — pops up when the user clicks "Go to Dashboard".
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const closeDetails = () => setIsDetailsOpen(false);

  const handleSwitchModes = () => {
    navigate('/profile/engagement/identity');
  };

  const handleSaveExit = () => {
    navigate('/');
  };

  const handleBackToStages = () => {
    log('back to profile stages');
    navigate('/profile/engagement');
  };

  const handleGoToDashboard = () => {
    log('go to dashboard → open Top Talent Status modal');
    setIsDetailsOpen(true);
  };

  const handleDetailsCta = () => {
    log('details modal CTA → avatar customiser');
    closeDetails();
    navigate('/profile/engagement/avatar');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav
        onSaveExit={handleSaveExit}
        showSwitchModes
        onSwitchModes={handleSwitchModes}
      />
      <EngagementTopBar currentStageIndex={trailCurrentIndex} completionPct={completionPct} />

      <EngagementHero completionPct={100} doneCount={9} inProgressCount={0} remainingCount={0} />

      <main className="flex-1">
        <MilestoneHeroPanel
          theme="green"
          iconSrc={trophyImg}
          milestoneNumber={TOP_TALENT_MILESTONE.number}
          totalMilestones={TOP_TALENT_MILESTONE.totalMilestones}
          headline={TOP_TALENT_MILESTONE.headline}
          description={TOP_TALENT_MILESTONE.description}
          stats={TOP_TALENT_MILESTONE.stats}
          completedStages={TOP_TALENT_MILESTONE.completedStages}
          primaryCtaLabel="Go to Dashboard"
          primaryCtaIcon={null}
          secondaryCtaLabel="Back to profile stages"
          onClaim={handleGoToDashboard}
          onContinue={handleBackToStages}
        />

        <UnlockedFeaturesSection
          items={TOP_TALENT_MILESTONE.features}
          accent="brand"
          background="default"
        />
      </main>

      <EngagementFooter
        onSkip={handleBackToStages}
        onContinue={handleGoToDashboard}
        skipLabel="Back to stages"
        continueLabel="Go to Dashboard"
      />

      <MilestoneDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        iconSrc={trophyImg}
        headline={TOP_TALENT_MILESTONE.details.headline}
        description={TOP_TALENT_MILESTONE.details.description}
        items={TOP_TALENT_MILESTONE.details.items}
        ctaLabel={TOP_TALENT_MILESTONE.details.ctaLabel}
        ctaTheme="green"
        onCta={handleDetailsCta}
      />
    </div>
  );
};

export default TopTalentMilestonePage;
