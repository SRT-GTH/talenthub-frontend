import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import FeaturedStory from '../../components/sections/landing/stories/FeaturedStory.jsx';
import MoreStories from '../../components/sections/landing/stories/MoreStories.jsx';
import StoriesNumbers from '../../components/sections/landing/stories/StoriesNumbers.jsx';
import ShareYourStory from '../../components/sections/landing/stories/ShareYourStory.jsx';
import { StoriesChatIcon } from '../../components/sections/landing/stories/StoriesIcons.jsx';
import {
  CENTERED_HERO_CLASS,
  HERO_NOTE,
  STORIES_HERO,
} from '../../components/sections/landing/stories/StoriesData.js';
import { debug } from '../../utils/debug.js';

const log = debug('StoriesPage');

/* P-05 Stories — Figma 7797:30021 (tablet 7815:298873, mobile 7815:299931). Hero → Featured → More stories → Numbers → Share yours → S10 → S11. */
const StoriesPage = () => {
  log('mount');
  return (
    <LandingShell>
      <PageHero
        className={CENTERED_HERO_CLASS}
        crumb={STORIES_HERO.crumb}
        chip={{ icon: <StoriesChatIcon />, label: STORIES_HERO.chipLabel }}
        title={STORIES_HERO.title}
        accent="Real paths."
        goldGlowY={320}
        subtitle={STORIES_HERO.subtitle}
      >
        <div className="mt-[18px] text-center font-sans text-[13px] font-medium leading-[15.5px] text-[#ffd86b]">
          {HERO_NOTE}
        </div>
      </PageHero>
      <FeaturedStory />
      <MoreStories />
      <StoriesNumbers />
      <ShareYourStory />
    </LandingShell>
  );
};

export default StoriesPage;
