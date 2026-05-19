import { Link } from 'react-router-dom';
import Button from '../../ui/Button.jsx';
/*
 * HeroSection — landing hero stub.
 *
 * The full Figma landing hero hasn't been wired yet, but the page needs
 * to render *something* that doesn't get clipped by the floating dark
 * Navbar pill (`fixed top-5` in src/components/shared/Navbar.jsx) and
 * gives the page enough vertical content to scroll naturally.
 *
 * This placeholder is a single full-width hero with:
 *   ├─ enough top-padding to clear the floating navbar (~140px)
 *   ├─ a min-height that pushes the footer off-screen on first paint so
 *   │  the page is obviously scrollable
 *   └─ quick links into the two engagement pages we've built so the
 *      design can be evaluated in context
 *
 * Replace this with the real hero from the landing Figma frames when ready.
 */

const HeroSection = () => (
  <section
    className={[
      'relative w-full',
      // Soft cream → green-light wash, matches the engagement hero's
      // gradient family so the brand feels coherent until the real
      // landing hero ships.
      'bg-[linear-gradient(180deg,var(--color-yellow-light)_0%,var(--color-brand-green-light)_100%)]',
      // Reserve room for the floating navbar pill (fixed top-5, ~88px tall +
      // 20px top inset + breathing room) so headline text isn't covered.
      'pt-[clamp(140px,15vw,180px)] pb-[clamp(48px,6vw,96px)]',
      'px-[clamp(16px,4vw,56px)]',
      'min-h-[80vh] flex flex-col items-center justify-center text-center',
    ].join(' ')}
  >
    <p className="font-sans font-semibold text-[12px] tracking-[2px] uppercase text-brand-green">
      Ghana Talent Hub
    </p>
    <h1 className="mt-4 font-display text-[clamp(36px,5vw,72px)] leading-[1.0] tracking-[-0.5px] text-content-primary max-w-[18ch]">
      Your career, <span className="italic text-brand-green">your hub.</span>
    </h1>
    <p className="mt-5 font-sans text-[16px] leading-[26px] tracking-[0.2px] text-neutral-darker max-w-[52ch]">
      The landing page is being rebuilt from the Figma frames. In the meantime, jump straight into
      the engagement flow to see the new profile-building experience.
    </p>

    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Link to={'/profile/engagement'} className="inline-flex">
        <Button variant="primary" size="md">
          Profile Engagement Hub
        </Button>
      </Link>
      <Link to={'/profile/engagement/identity'} className="inline-flex">
        <Button variant="tertiary" size="md">
          Identity Map (Section 1)
        </Button>
      </Link>
    </div>
  </section>
);

export default HeroSection;
