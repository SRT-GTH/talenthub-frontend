import WavyDivider from '../../../shared/WavyDivider.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * OrganisationHeading - eyebrow pill, h1, subtitle and wavy divider for R03 / R04 / R04b.
 * Figma: eyebrow 7374:4149 (148x27 "03 Recruiter Type"), 7374:4580 ("04 Organisation"),
 * h1 Bricolage 54/59 w600 ls -0.54 (#1c2a21) - rendered with the app's `font-display`
 * (same substitution the talent steps already use), subtitle SF Pro Rounded 16/24 #737373
 * max 482px, wavy divider 200px wide.
 * Same chassis as the talent ContactEyebrow (owner-approved reference).
 */
const OrganisationHeading = ({ number, label, title, subtitle, className }) => (
  <header className={classNames('flex w-full flex-col items-center gap-4 text-center', className)}>
    <span className="inline-flex items-center gap-2 rounded-[8px] border border-brand-green-light-active bg-[#FFFEFC] px-4 py-1 max-md:px-3 max-md:py-0.5">
      <span
        aria-hidden="true"
        className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-hover"
        style={{ boxShadow: '0 0 4px 0 #006B3F' }}
      />
      <span className="font-heading text-[15px] font-semibold text-[#B5B5B5]">{number}</span>
      <span
        className="text-[12px] leading-[18px] text-brand-green"
        style={{ letterSpacing: '0.2px' }}
      >
        {label}
      </span>
    </span>
    <h1
      className="font-heading font-semibold text-[#1c2a21] max-md:text-[28px]! max-md:leading-tight!"
      style={{
        fontSize: 'clamp(2.25rem, 5vw, 3.375rem)',
        lineHeight: 1.1,
        letterSpacing: '-0.54px',
      }}
    >
      {title}
    </h1>
    <p
      className="max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5"
      style={{ letterSpacing: '0.2px' }}
    >
      {subtitle}
    </p>
    <WavyDivider />
  </header>
);

export default OrganisationHeading;
