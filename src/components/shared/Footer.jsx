import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { ROUTES } from '../../constants/routes.js';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Footer');

/*
 * Footer — landing-page footer.
 * Source: Figma frame 2638:4802 ("Footer - FOOTER").
 *
 * Visual signature: full-width brand-green-darker (#142916) panel with a
 * subtle decorative arc shape behind the content. 1300px content column
 * with a 1px hairline (rgba(255,255,255,0.07)) under the link rows,
 * separating the legal copy at the bottom.
 *
 * Layout: a 1019px inner row split into 2 columns:
 *   - Left: Logo + tagline + "Made with pride in Ghana 🇬🇭"
 *   - Right: 3 link columns (Platform / Company / Legal)
 *
 * Below the hairline: copyright on the left, contact line on the right.
 */

const PLATFORM_LINKS = [
  { label: 'For Talents', to: ROUTES.home },
  { label: 'For Schools', to: ROUTES.home },
  { label: 'For Recruiters', to: ROUTES.home },
  { label: 'Assessments', to: ROUTES.home },
  { label: 'Opportunities', to: ROUTES.home },
];

const COMPANY_LINKS = [
  { label: 'About Us', to: ROUTES.home },
  { label: 'Blog', to: ROUTES.home },
  { label: 'Careers', to: ROUTES.home },
  { label: 'Press', to: ROUTES.home },
  { label: 'Contact', to: ROUTES.home },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: ROUTES.home },
  { label: 'Terms of Service', to: ROUTES.home },
  { label: 'Cookie Policy', to: ROUTES.home },
  { label: 'Child Safety', to: ROUTES.home },
];

const FooterColumn = ({ heading, links }) => (
  <div className="flex flex-col gap-4">
    <h3 className="font-sans font-bold text-[10px] leading-none tracking-[1px] uppercase text-white">
      {heading}
    </h3>
    <ul className="flex flex-col gap-4">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className={classNames(
              'font-sans text-[14px] leading-none whitespace-nowrap',
              'text-yellow-hover hover:text-white transition-colors duration-150'
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  log('render');
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-green-darker text-white overflow-hidden">
      {/* Top accent strip — 4px gold band marking the boundary between
        the page content above and the dark footer below. */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent" aria-hidden="true" />

      {/*
        Decorative wave shape — Figma node 2638:4803.
        A scalloped wave silhouette in brand-green at 10% opacity sitting in
        the lower portion of the footer. The path's intrinsic viewBox is
        1728×204 with the wave crests starting near y=0 and the fill
        extending down to y=252; we render it across the full footer width
        and let the bottom hang slightly below the content.
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1728 252"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 bottom-0 w-full h-[252px] pointer-events-none"
      >
        <path
          opacity="0.1"
          fill="#387440"
          d="M572.667 126C572.667 56.4119 443.351 0 283.833 0C124.316 0 -5 56.4119 -5 126V252H1728V126C1728 56.4119 1598.68 0 1439.17 0C1279.65 0 1150.33 56.4119 1150.33 126C1150.33 56.4119 1021.02 0 861.5 0C701.982 0 572.667 56.4119 572.667 126Z"
        />
      </svg>

      {/*
        Outer 1300px container holds the hairline + bottom legal row.
        Per Figma frame 2663:38952 the brand+links row is fixed at 1019px
        wide, left-aligned within the 1300px container (the right ~281px
        is intentional whitespace).
      */}
      <div className="relative max-w-[1300px] mx-auto px-8 pt-16 pb-8">
        <div className="border-b border-white/[0.07] pb-12">
          {/* Brand + links row — 1019px max, left-aligned, justify-between */}
          <div className="w-full max-w-[1019px] flex flex-col lg:flex-row gap-12 lg:gap-0 lg:justify-between items-start">
            {/* Brand block — fixed 215px wide per Figma 2638:4805 */}
            <div className="flex flex-col gap-4 w-full lg:w-[215px] shrink-0">
              <div className="flex items-center gap-4">
                <Link to={ROUTES.home} className="inline-flex">
                  <Logo size="md" />
                </Link>
                <span aria-hidden="true" className="w-px h-[30px] bg-white/10" />
              </div>
              <p className="font-sans text-[13px] leading-[21.45px] text-white/60">
                Connecting every Ghanaian student with the opportunities they deserve. Built in
                Accra.
              </p>
              <p className="font-sans text-[11px] leading-none text-yellow tracking-wide italic">
                Made with pride in Ghana <span aria-hidden="true">🇬🇭</span>
              </p>
            </div>

            {/* Link columns group — gap-50 between columns per Figma 2638:4820 */}
            <div className="flex flex-wrap gap-x-[50px] gap-y-12">
              <FooterColumn heading="Platform" links={PLATFORM_LINKS} />
              <FooterColumn heading="Company" links={COMPANY_LINKS} />
              <FooterColumn heading="Legal" links={LEGAL_LINKS} />
            </div>
          </div>
        </div>

        {/* Bottom row: copyright + contact — spans the full 1300px container */}
        <div className="flex flex-col md:flex-row justify-between gap-2 pt-6">
          <p className="font-sans text-[12px] leading-none text-white/60">
            © {year} Ghana Talent Hub. All rights reserved.
          </p>
          <p className="font-sans text-[12px] leading-none text-white/60">
            Accra, Ghana ·{' '}
            <a
              href="mailto:info@ghanatalenthub.com"
              className="hover:text-white transition-colors duration-150"
            >
              info@ghanatalenthub.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
