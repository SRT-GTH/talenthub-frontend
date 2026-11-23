import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFlagGh } from '../home/LpFigmaIcons.jsx';
import { debug } from '../../../../utils/debug.js';
import logoSrc from '../../../../assets/landing/gth-logo-footer.png';
import TermsModal from '../../../shared/TermsModal.jsx';
import PrivacyPolicyModal from '../../../shared/PrivacyPolicyModal.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { isLoggedIn, logoHomePath } from '../../../../services/auth.api.js';

const log = debug('LandingFooter');

/*
 * LandingFooter — S11 (Figma 7797:14940, 1728x373, #19341d). Columns Platform / Company / Legal (14/700 gold #ffd86b headings, 15/400 white links),
 * brand block (logo tile, tagline, "Made with pride in Ghana"), bottom row copyright + contact.
 * "Privacy policy" / "Terms of service" open the PrivacyPolicyModal / TermsModal summaries in place (no legal pages yet).
 * Figma draws no prototype links for the footer, so the other targets are the closest existing pages (⚠️ ASSUMPTION, inspection 2026-11-21):
 * the audience links reuse the landing CTAs' targets, section links land on the matching landing section (#hash, see useLandingHash),
 * Contact / Careers / Press write to the address printed in the footer. Cookie policy and Accessibility statement have no copy
 * anywhere in the app or in Figma, so they stay inert (log only) rather than inventing legal text.
 */
const HELP_EMAIL = 'info@ghanatalenthub.com';
const mailto = (subject) => `mailto:${HELP_EMAIL}?subject=${encodeURIComponent(subject)}`;
const LEGAL_MODALS = { 'Privacy policy': 'privacy', 'Terms of service': 'terms' };

/* label -> { to } (in-app path, may be a function read at click time) or { href } (mailto). Labels not listed stay inert. */
const LINK_TARGETS = {
  'For students': { to: LANDING_ROUTES.getStartedTalent },
  'For parents': { to: `${LANDING_ROUTES.forParentsSchools}#parents` },
  'For schools': { to: `${LANDING_ROUTES.forParentsSchools}#schools` },
  'For recruiters': { to: LANDING_ROUTES.getStartedRecruiter },
  // a signed-in talent goes to their Skills Lab; everyone else to the Skills Lab feature on the Features page
  'Skills Lab': {
    to: () =>
      isLoggedIn() && logoHomePath() === '/home'
        ? '/skills-lab'
        : `${LANDING_ROUTES.features}#skills-lab`,
  },
  Opportunities: { to: LANDING_ROUTES.opportunities },
  'About us': { to: LANDING_ROUTES.howItWorks },
  Blog: { to: LANDING_ROUTES.stories },
  Careers: { href: mailto('Careers at Ghana Talent Hub') },
  Press: { href: mailto('Press enquiry') },
  Contact: { href: `mailto:${HELP_EMAIL}` },
  'Child safety': { to: `${LANDING_ROUTES.forParentsSchools}#child-safety` },
};

const LINK_CLASS =
  'cursor-pointer self-start border-0 bg-transparent p-0 text-left font-sans text-[15px] leading-[18px] text-white no-underline lp-ul-hover';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      'For students',
      'For parents',
      'For schools',
      'For recruiters',
      'Skills Lab',
      'Opportunities',
    ],
  },
  { title: 'Company', links: ['About us', 'Blog', 'Careers', 'Press', 'Contact'] },
  {
    title: 'Legal',
    links: [
      'Privacy policy',
      'Terms of service',
      'Cookie policy',
      'Child safety',
      'Accessibility statement',
    ],
  },
];

const FooterLink = ({ label, onButton }) => {
  const target = LINK_TARGETS[label];
  if (target?.to) {
    const to = typeof target.to === 'function' ? target.to() : target.to;
    return (
      <Link to={to} onClick={() => log('footer link ->', label, to)} className={LINK_CLASS}>
        {label}
      </Link>
    );
  }
  if (target?.href) {
    return (
      <a
        href={target.href}
        onClick={() => log('footer link ->', label, target.href)}
        className={LINK_CLASS}
      >
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => onButton(label)} className={LINK_CLASS}>
      {label}
    </button>
  );
};

const LandingFooter = () => {
  log('render');
  // 'privacy' | 'terms' | null
  const [legalModal, setLegalModal] = useState(null);
  const closeModal = () => setLegalModal(null);
  const handleLink = (label) => {
    const modal = LEGAL_MODALS[label];
    if (modal) {
      log('open legal summary:', modal);
      setLegalModal(modal);
      return;
    }
    log('footer link (inert: no page or copy exists yet):', label);
  };
  return (
    <footer className="bg-[#19341d] text-white">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-10 px-5 pb-8 pt-[clamp(40px,4.6vw,80px)] md:px-10 xl:px-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-[minmax(0,420px)_repeat(3,minmax(0,312px))] xl:justify-between">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-3 xl:col-span-1">
            <span className="flex h-[60px] w-[76px] items-start justify-start rounded-[14px] bg-white pl-3 pt-[6px]">
              <img src={logoSrc} alt="Ghana Talent Hub" className="h-12 w-[52px] object-contain" />
            </span>
            <p className="m-0 font-sans text-[15px] leading-[23px] text-white xl:max-w-[400px]">
              Connecting every Ghanaian student and graduate with the opportunities they deserve.
              Built in Accra.
            </p>
            <span className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold leading-[17px] text-[#ffd86b]">
              <FiFlagGh className="size-4 shrink-0" />
              Made with pride in Ghana
            </span>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="m-0 font-sans text-[14px] font-bold text-[#ffd86b]">{col.title}</h3>
              {col.links.map((label) => (
                <FooterLink key={label} label={label} onButton={handleLink} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-2 font-sans text-[13px] md:flex-row">
          <span>© 2026 Ghana Talent Hub. All rights reserved.</span>
          <span>
            Accra, Ghana ·{' '}
            <a href={`mailto:${HELP_EMAIL}`} className="text-white no-underline lp-ul-hover">
              {HELP_EMAIL}
            </a>
          </span>
        </div>
      </div>
      {legalModal === 'privacy' && (
        <PrivacyPolicyModal ctaLabel="Got it" onAccept={closeModal} onClose={closeModal} />
      )}
      {legalModal === 'terms' && (
        <TermsModal ctaLabel="Got it" onAccept={closeModal} onClose={closeModal} />
      )}
    </footer>
  );
};

export default LandingFooter;
