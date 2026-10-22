import LandingShell from '../../components/sections/landing/shared/LandingShell.jsx';
import PageHero from '../../components/sections/landing/shared/PageHero.jsx';
import FaqAnswers from '../../components/sections/landing/faq/FaqAnswers.jsx';
import FaqHelp from '../../components/sections/landing/faq/FaqHelp.jsx';
import FaqSearch from '../../components/sections/landing/faq/FaqSearch.jsx';
import { FaqInfoIcon } from '../../components/sections/landing/faq/FaqIcons.jsx';
import { FAQ_HERO } from '../../components/sections/landing/faq/FaqData.js';
import { CENTERED_HERO_CLASS } from '../../components/sections/landing/stories/StoriesData.js';
import { debug } from '../../utils/debug.js';

const log = debug('FaqPage');

/* P-06 FAQ — Figma 7797:31009 (tablet 7815:300988, mobile 7815:302216). Hero (+ search) → Answers → Still need help → S10 → S11. */
const FaqPage = () => {
  log('mount');
  return (
    <LandingShell>
      <PageHero
        className={CENTERED_HERO_CLASS}
        crumb={FAQ_HERO.crumb}
        chip={{ icon: <FaqInfoIcon size={15} />, label: FAQ_HERO.chipLabel }}
        title={FAQ_HERO.title}
        accent="got you."
        goldGlowY={340}
        mobileBreak
        subtitle={FAQ_HERO.subtitle}
      >
        <FaqSearch />
      </PageHero>
      <FaqAnswers />
      <FaqHelp />
    </LandingShell>
  );
};

export default FaqPage;
