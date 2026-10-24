import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { FOOTER_LINKS } from './publicDataNav.js';

/*
 * PublicFooter — Figma "T8 · Public footer" (tablet 8508:351146, mobile 8515:155), Focused style.
 *   >= md : row 1 "Ghana Talent Hub · all figures come from the live GTH database" + 5 links; row 2 privacy line + © line
 *   <  md : two-column links (Methodology · Partners · Opportunities · Monthly digest · Contact), one short note, ©
 * Props: onModal(name) opens the digest modal. Mobile labels follow the mobile frame ("Partners", "Opportunities").
 */

const LINK =
  'font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const FooterLink = ({ link, label, onModal }) => {
  const text = label ?? link.label;
  if (link.modal) {
    return (
      <button
        type="button"
        onClick={() => onModal?.(link.modal)}
        className={classNames(LINK, 'p-0 text-left')}
      >
        {text}
      </button>
    );
  }
  if (!link.to) {
    return <span className={LINK}>{text}</span>;
  }
  return (
    <Link to={link.to} className={LINK}>
      {text}
    </Link>
  );
};

const MOBILE_LABELS = { 'Partner directory': 'Partners', 'Opportunity directory': 'Opportunities' };

const PublicFooter = ({ onModal }) => (
  <footer className="border-t border-solid border-[#e7e7e7] bg-white">
    <div className="hidden flex-col gap-[20px] px-[32px] pt-[32px] pb-[40px] md:flex xl:px-[40px]">
      <div className="flex flex-wrap items-center justify-between gap-x-[67px] gap-y-[12px]">
        <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
          Ghana Talent Hub · all figures come from the live GTH database
        </p>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-[24px] gap-y-[8px]">
          {FOOTER_LINKS.map((link) => (
            <FooterLink key={link.label} link={link} onModal={onModal} />
          ))}
        </nav>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-[8px] gap-y-[4px] font-sans text-[13px] leading-[16px] text-[#595959]">
        <p className="m-0">
          Counts under 5 are shown as “&lt;5” to protect privacy. No personal data is shown on
          public pages.
        </p>
        <p className="m-0">© 2026 Ghana Talent Hub · Accessibility · Privacy</p>
      </div>
    </div>
    <div className="flex flex-col gap-[12px] px-[16px] pt-[24px] pb-[96px] md:hidden">
      <nav aria-label="Footer" className="grid grid-cols-2 gap-x-[16px] gap-y-[12px]">
        {FOOTER_LINKS.map((link) => (
          <FooterLink
            key={link.label}
            link={link}
            label={MOBILE_LABELS[link.label]}
            onModal={onModal}
          />
        ))}
      </nav>
      <p className="m-0 font-sans text-[12px] leading-[18px] text-[#595959]">
        All figures come from the live GTH database. Counts under 5 show as “&lt;5”. No personal
        data on public pages.
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] text-[#595959]">
        © 2026 Ghana Talent Hub
      </p>
    </div>
  </footer>
);

export default PublicFooter;
