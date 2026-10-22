import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import HeroSection from '../../components/sections/landing/home/HeroSection.jsx';
import PartnerStrip from '../../components/sections/landing/home/PartnerStrip.jsx';
import HowItWorksSection from '../../components/sections/landing/home/HowItWorksSection.jsx';
import FeaturesSection from '../../components/sections/landing/home/FeaturesSection.jsx';
import OpportunitiesSection from '../../components/sections/landing/home/OpportunitiesSection.jsx';
import MadeForGhanaSection from '../../components/sections/landing/home/MadeForGhanaSection.jsx';
import ForEveryoneSection from '../../components/sections/landing/home/ForEveryoneSection.jsx';
import StoriesSection from '../../components/sections/landing/home/StoriesSection.jsx';
import FaqSection from '../../components/sections/landing/home/FaqSection.jsx';
import { debug } from '../../utils/debug.js';

const log = debug('LandingHomePage');

/* Landing page v2 (LP-01) — Figma 7797:7854. Sections S1–S9; S10 final CTA + S11 footer come from LandingShell. */
const LandingHomePage = () => {
  log('mount');
  return (
    <LandingShell ctaPhoto>
      <HeroSection />
      <PartnerStrip />
      <HowItWorksSection />
      <FeaturesSection />
      <OpportunitiesSection />
      <MadeForGhanaSection />
      <ForEveryoneSection />
      <StoriesSection />
      <FaqSection />
    </LandingShell>
  );
};

export default LandingHomePage;
