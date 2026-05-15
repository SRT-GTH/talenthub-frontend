/*
 * HeroSection — stub.
 *
 * The committed file shipped empty (pre-existing scaffold gap on `main`),
 * which broke the production build and dev-server bundle. This minimal
 * default export unblocks routing so the profile engagement page can render and
 * be visually verified. The real hero content should land in a follow-up
 * via the landing-page Figma frames.
 */

const HeroSection = () => (
  <section className="px-[clamp(16px,4vw,56px)] py-[clamp(24px,3vw,40px)]">
    <h1 className="font-display text-[clamp(36px,4vw,52px)] leading-[1.0] text-content-primary">
      TalentHub
    </h1>
    <p className="mt-3 font-sans text-[16px] text-neutral-darker">Landing hero coming soon.</p>
  </section>
);

export default HeroSection;
