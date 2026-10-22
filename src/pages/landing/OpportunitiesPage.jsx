import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import HowMatchingWorks from '../../components/sections/landing/opportunities/HowMatchingWorks.jsx';
import OpportunitiesListing from '../../components/sections/landing/opportunities/OpportunitiesListing.jsx';
import OpportunitiesSearch from '../../components/sections/landing/opportunities/OpportunitiesSearch.jsx';
import { HERO } from '../../components/sections/landing/opportunities/OpportunitiesData.js';
import { SuitcaseGlyph } from '../../components/sections/landing/opportunities/OpportunitiesIcons.jsx';
import { useOpportunitiesParams } from '../../components/sections/landing/opportunities/useOpportunitiesParams.js';
import heroPhoto from '../../assets/landing/page-hero-opportunities.webp';
import { debug } from '../../utils/debug.js';

const log = debug('OpportunitiesPage');

/* P-03 Opportunities — Figma 7797:27590 (tablet 7815:303443, mobile 7815:304934, filters sheet 7815:306490). Filter/search/sheet state is in the URL. */
const OpportunitiesPage = () => {
  const { state, update } = useOpportunitiesParams();
  log('mount', state);
  return (
    <LandingShell>
      <PageHero
        crumb={HERO.crumb}
        chip={{
          icon: (
            <span className="size-[15px]">
              <SuitcaseGlyph />
            </span>
          ),
          label: HERO.chip,
        }}
        title={HERO.title}
        accent="all over Ghana."
        subtitle={HERO.subtitle}
        photo={{ src: heroPhoto, alt: '' }}
      >
        <OpportunitiesSearch state={state} update={update} />
      </PageHero>
      <OpportunitiesListing state={state} update={update} />
      <HowMatchingWorks />
    </LandingShell>
  );
};

export default OpportunitiesPage;
