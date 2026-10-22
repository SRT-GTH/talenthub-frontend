import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import ParentsSection from '../../components/sections/landing/parentsSchools/ParentsSection.jsx';
import SafetySection from '../../components/sections/landing/parentsSchools/SafetySection.jsx';
import SchoolsSection from '../../components/sections/landing/parentsSchools/SchoolsSection.jsx';
import { HERO } from '../../components/sections/landing/parentsSchools/ParentsSchoolsData.js';
import { UsersGlyph } from '../../components/sections/landing/parentsSchools/ParentsSchoolsIcons.jsx';
import heroPhoto from '../../assets/landing/stories-feature-photo.webp';
import { debug } from '../../utils/debug.js';

const log = debug('ForParentsSchoolsPage');

/* P-04 For parents & schools — Figma 7797:28950 (tablet 7815:296546, mobile 7815:297710). */
const ForParentsSchoolsPage = () => {
  log('mount');
  return (
    <LandingShell>
      <PageHero
        crumb={HERO.crumb}
        chip={{
          icon: (
            <span className="size-[15px]">
              <UsersGlyph />
            </span>
          ),
          label: HERO.chip,
        }}
        title={HERO.title}
        accent="in the loop."
        goldGlowY={340}
        subtitle={HERO.subtitle}
        photo={{ src: heroPhoto, alt: '' }}
      />
      <ParentsSection />
      <SchoolsSection />
      <SafetySection />
    </LandingShell>
  );
};

export default ForParentsSchoolsPage;
