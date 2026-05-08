import HeroSection from '../components/sections/landing/HeroSection.jsx';
import { debug } from '../utils/debug.js';

const log = debug('LandingPage');

/*
 * LandingPage — public marketing page.
 * Composes the landing-section components in order. Today the hero is the
 * only section; subsequent sections (How it Works, Cards, Find Talent, etc.)
 * will be added as their Figma frames are implemented.
 */

const LandingPage = () => {
  log('mount');
  return (
    <>
      <HeroSection />
    </>
  );
};

export default LandingPage;
