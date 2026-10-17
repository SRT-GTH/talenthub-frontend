import WavyDivider from '../../../shared/WavyDivider.jsx';
import { classNames } from '../../../../utils/classNames.js';

/*
 * BillingHeading - eyebrow pill ("05 Choose a Plan" / "06 Payment"), h1,
 * subtitle and wavy divider for the recruiter billing steps.
 * Figma: R05 7374:6764 (eyebrow 134x27, h1 Bricolage Grotesque 54/600
 * -0.54 #1c2a21, subtitle 16/24 #737373, divider 200 wide); R06 7374:7507.
 *
 * Font: `font-heading` (Bricolage Grotesque 600, loaded globally by index.html).
 *
 * Props: number ('05'), label, title, subtitle, subtitleClassName, titleId.
 */

const BillingHeading = ({ number, label, title, subtitle, subtitleClassName, titleId }) => {
  return (
    <header className="flex w-full flex-col items-center gap-4 text-center max-md:gap-3">
      <span className="inline-flex items-center gap-2 rounded-[8px] border border-brand-green-light-active bg-[#FFFEFC] px-4 py-1 max-md:px-3 max-md:py-0.5">
        <span
          aria-hidden="true"
          className="size-2 rounded-full border-[1.5px] border-success bg-brand-green-light-hover"
          style={{ boxShadow: '0 0 4px 0 #006B3F' }}
        />
        <span className="font-heading text-[15px] font-semibold leading-[19px] text-[#B5B5B5]">
          {number}
        </span>
        <span
          className="text-[12px] leading-[18px] text-brand-green"
          style={{ letterSpacing: '0.2px' }}
        >
          {label}
        </span>
      </span>
      <h1
        id={titleId}
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
};

export default BillingHeading;
