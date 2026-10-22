import { useEffect } from 'react';
import FinalCta from './FinalCta.jsx';
import LandingFooter from './LandingFooter.jsx';
import LandingNav from './LandingNav.jsx';
import useFitZoom from './useFitZoom.js';
import { ensurePlayfulFont } from '../../../../utils/ensurePlayfulFont.js';

/*
 * LandingShell — wraps every landing-site page: nav (overlays the page's dark hero), page content, optional final CTA, footer.
 * Mounted outside MainLayout (the landing set carries its own chrome). Loads the Bricolage heading font.
 */
const LandingShell = ({ children, finalCta = true, ctaPhoto = false }) => {
  const zoom = useFitZoom();
  useEffect(() => {
    ensurePlayfulFont();
  }, []);
  return (
    <div
      className="relative flex min-h-dvh flex-col bg-[#fbf3e4]"
      style={zoom < 1 ? { zoom } : undefined}
    >
      <LandingNav />
      <main className="flex flex-1 flex-col">{children}</main>
      {finalCta ? <FinalCta photo={ctaPhoto} /> : null}
      <LandingFooter />
    </div>
  );
};

export default LandingShell;
