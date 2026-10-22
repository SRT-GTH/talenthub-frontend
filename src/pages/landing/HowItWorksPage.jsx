import { useEffect } from 'react';
import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import HeroMilestones from '../../components/sections/landing/howItWorks/HeroMilestones.jsx';
import StagesSection from '../../components/sections/landing/howItWorks/StagesSection.jsx';
import AfterProfileSection from '../../components/sections/landing/howItWorks/AfterProfileSection.jsx';
import FreeAndFairSection from '../../components/sections/landing/howItWorks/FreeAndFairSection.jsx';
import { FigmaMapChipIcon } from '../../components/sections/landing/howItWorks/HowItWorksFigmaIcons.jsx';
import heroPhoto from '../../assets/landing/page-hero-how-it-works.webp';
import { debug } from '../../utils/debug.js';

const log = debug('HowItWorksPage');

/* P-01 How it works — Figma 7797:19953 (tablet 7815:280356, mobile 7815:286952). S10 final CTA + S11 footer come from LandingShell. */
const HowItWorksPage = () => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <LandingShell>
      <PageHero
        crumb="How it works"
        chip={{ icon: <FigmaMapChipIcon />, label: 'How it works' }}
        title="Your profile, step by step."
        accent="step by step."
        mobileBreak
        subtitle="Nine short stages, about 20 minutes in total, saved as you go. Every three stages unlock something new, and Career Buddy is there the whole way."
        photo={{ src: heroPhoto, alt: '' }}
        sticker="ABOUT 20 MIN"
      >
        <HeroMilestones />
      </PageHero>
      <StagesSection />
      <AfterProfileSection />
      <FreeAndFairSection />
    </LandingShell>
  );
};

export default HowItWorksPage;
