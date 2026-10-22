import { useEffect } from 'react';
import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import FeatureDeepDives from '../../components/sections/landing/features/FeatureDeepDives.jsx';
import { StarGlyph } from '../../components/sections/landing/features/FeaturesIcons.jsx';
import heroPhoto from '../../assets/landing/page-hero-features.webp';
import { debug } from '../../utils/debug.js';

const log = debug('FeaturesPage');

/* P-02 Features — Figma 7797:26426 (tablet 7815:261355, mobile 7815:262836). S10 final CTA + S11 footer come from LandingShell. */
const FeaturesPage = () => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <LandingShell>
      <PageHero
        crumb="Features"
        chip={{ icon: <StarGlyph className="size-[15px]" />, label: 'Features' }}
        title={'Everything you need to \nget found.'}
        accent="get found."
        goldGlowY={340}
        subtitle="Career Buddy, assessments, Skills Lab, verified skills and smart matching, built around how Ghana actually works."
        photo={{ src: heroPhoto, alt: '' }}
      />
      <FeatureDeepDives />
    </LandingShell>
  );
};

export default FeaturesPage;
