import WavyDivider from '../../../shared/WavyDivider.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * StepHeading - eyebrow pill ("07 Preferences"), h1, subtitle and the wavy
 * divider shared by the closing recruiter steps (R07 preferences, R08 review).
 * Figma: R07 7374:9004 (eyebrow 134x27, h1 Bricolage 54/600 -0.54, subtitle
 * 16/24 #737373, divider 200 wide); R08 7374:9838 same stack with a green
 * italic span in the headline ("Almost there.").
 * Same chassis as the talent ContactEyebrow / h1 (owner-approved reference).
 *
 * Props: maxSize (h1 max font-size, 3.375rem = 54px; review uses 4rem = 64px), number ('07'), label, title (ReactNode), subtitle (ReactNode),
 *        subtitleClassName, className.
 */
const StepHeading = ({
  number,
  label,
  title,
  subtitle,
  subtitleClassName,
  className,
  maxSize = '3.375rem',
}) => (
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
      className="font-heading font-semibold text-[#1c2a21] max-md:text-[24px]! max-md:leading-tight!"
      style={{
        fontSize: `clamp(2.25rem, 5vw, ${maxSize})`,
        lineHeight: 1.1,
        letterSpacing: '-0.54px',
      }}
    >
      {title}
    </h1>
    <p
      className={classNames(
        'max-w-[482px] text-[16px] leading-6 text-[#737373] max-md:text-[14px] max-md:leading-5',
        subtitleClassName
      )}
      style={{ letterSpacing: '0.2px' }}
    >
      {subtitle}
    </p>
    <WavyDivider />
  </header>
);

export default StepHeading;
