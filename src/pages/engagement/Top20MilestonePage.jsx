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

const log = debug('Top20MilestonePage');

/*
 * Top20MilestonePage â€” celebration screen for Milestone 2 of 3.
 * Source: Figma frame ("Top 20% profile" milestone celebration).
 *
 * Same layout pattern as MilestoneUnlockPage (Milestone 1) but with the
 * gold/amber accent theme and the milestone-2-specific copy:
 *   â”œâ”€ EngagementTopNav         (with Switch Modes pill)
 *   â”œâ”€ EngagementTopBar         (Step 7 of 9 Â· Certs is the next stage)
 *   â”œâ”€ MilestoneHeroPanel       (trophy + gold pill + "Top 20% profile."
 *   â”‚                            headline with 20% in gold italic and
 *   â”‚                            "profile." in green italic + 4 stat
 *   â”‚                            tiles + gold primary CTA + 6 completed
 *   â”‚                            chips)
 *   â”œâ”€ UnlockedFeaturesSection  (gold-accented 3-card grid on a cream wash)
 *   â””â”€ EngagementFooter         (â† Back to map / Next: Certs â†’)
 *
 * The milestone payload sits in TOP20_MILESTONE â€” when Milestone 3 lands
 * we'll lift this and the discoverable payload into a shared constants
 * module keyed by milestone id.
 */

const TOP20_MILESTONE = {
  number: 2,
  totalMilestones: 3,
  headline: (
    <>
      Top <span className="italic text-accent-dark">20%</span>{' '}
      <span className="italic text-brand-green">profile.</span>
    </>
  ),
  description:
    "You've completed six stages and earned the Top 20% badge. Your profile now ranks higher in recruiter search and gets richer analytics.",
  stats: [
    { value: '6/9', label: 'Stages Done', accent: 'brand' },
    { value: '66%', label: 'Profile Strength', accent: 'accent' },
    { value: 'Top 20%', label: 'Ghana Ranking', accent: 'brand' },
    { value: '+100 XP', label: 'Milestone Bonus', accent: 'accent' },
  ],
  completedStages: ['Avatar', 'Interest', 'Personality', 'Skills', 'Work', 'Portfolio'],
  // Details modal â€” pops up when the user claims the Top 20% badge.
  // Source: Figma frame (Top 20% Profile details modal).
  details: {
    headline: (
      <>
        Top <span className="italic text-accent-dark">20%</span>{' '}
        <span className="italic">Profile</span>
      </>
    ),
    description:
      "You're in the top fifth of all GTH profiles. The badge is now live on your recruiter card — it's visible to every recruiter who finds you.",
    items: [
      {
        icon: 'check',
        title: 'Top 20% badge on recruiter card',
        description:
          'Visible to every recruiter. Only 20% of GTH profiles earn it. It signals serious commitment.',
      },
      {
        icon: 'arrow',
        title: '2.8Ã— more profile views',
        description:
          'Badge holders rank higher in search results. More views = more opportunities surfacing.',
      },
      {
        icon: 'plus',
        title: 'Portfolio analytics unlocked',
        description:
          "See exactly which projects hold recruiters' attention longest — and optimise accordingly.",
      },
    ],
    ctaLabel: '3 stages to Top Talent, keep going',
  },
  features: [
    {
      title: 'Top 20% badge on your card',
      description:
        'A visible badge on your recruiter card marking you as a serious candidate. Only profiles with 6+ stages completed earn it.',
      highlighted: true,
    },
    {
      title: 'Boosted search ranking',
      description:
        'Your card ranks higher in recruiter search results. Profiles with this badge receive 2.8Ã— more views than those without.',
      highlighted: true,
    },
    {
      title: 'Portfolio analytics unlocked',
      description:
        'See which of your projects recruiters spend the most time on, and how long they viewed your profile.',
      highlighted: true,
    },
  ],
};

const Top20MilestonePage = () => {
  log('mount');
  const navigate = useNavigate();

  // Trail "frozen" state for this milestone â€” 6 stages just completed,
  // Certs is the next stage to start.
  const trailCurrentIndex = 6; // Certs
  const completionPct = Math.round((6 / 9) * 100); // 67%

  // Details modal â€” pops up when the user claims the Top 20% badge.
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const closeDetails = () => setIsDetailsOpen(false);

  const handleSwitchModes = () => {
    navigate('/profile/engagement/identity');
  };

  const handleSaveExit = () => {
    navigate('/');
  };

  const handleBackToMap = () => {
    log('back to map');
    navigate('/profile/engagement/identity');
  };

  const handleNextCerts = () => {
    log('next: certs → top talent milestone');
    navigate('/profile/engagement/milestone/top-talent');
  };

  const handleClaim = () => {
    log('claim top 20% badge â†’ open details modal');
    setIsDetailsOpen(true);
  };

  const handleDetailsCta = () => {
    log('details modal CTA → top talent milestone');
    closeDetails();
    navigate('/profile/engagement/milestone/top-talent');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-default">
      <EngagementTopNav
        onSaveExit={handleSaveExit}
        showSwitchModes
        onSwitchModes={handleSwitchModes}
      />
      <EngagementTopBar currentStageIndex={trailCurrentIndex} completionPct={completionPct} />

      <EngagementHero completionPct={67} doneCount={6} inProgressCount={0} remainingCount={3} />

      <main className="flex-1">
        <MilestoneHeroPanel
          theme="gold"
          iconSrc={trophyImg}
          milestoneNumber={TOP20_MILESTONE.number}
          totalMilestones={TOP20_MILESTONE.totalMilestones}
          headline={TOP20_MILESTONE.headline}
          description={TOP20_MILESTONE.description}
          stats={TOP20_MILESTONE.stats}
          completedStages={TOP20_MILESTONE.completedStages}
          primaryCtaLabel="Claim Top 20% badge"
          primaryCtaIcon={null}
          secondaryCtaLabel="Continue, 3 stages left"
          onClaim={handleClaim}
          onContinue={handleNextCerts}
        />

        <UnlockedFeaturesSection
          items={TOP20_MILESTONE.features}
          accent="accent"
          background="cream"
        />
      </main>

      <EngagementFooter
        onSkip={handleBackToMap}
        onContinue={handleNextCerts}
        skipLabel="Back to map"
        continueLabel="Next: Certs"
      />

      <MilestoneDetailsModal
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        iconSrc={trophyImg}
        headline={TOP20_MILESTONE.details.headline}
        description={TOP20_MILESTONE.details.description}
        items={TOP20_MILESTONE.details.items}
        ctaLabel={TOP20_MILESTONE.details.ctaLabel}
        ctaTheme="gold"
        onCta={handleDetailsCta}
      />
    </div>
  );
};

export default Top20MilestonePage;
