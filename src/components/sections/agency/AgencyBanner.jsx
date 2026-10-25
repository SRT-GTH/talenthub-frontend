import { classNames } from '../../../utils/classNames.js';

/*
 * AgencyBanner — the dark-green context card under the filter bar ("Your MoU view · 3 data categories · access until Oct 2027" on
 * National data 8596:389759, "Your query · Volta · Technology · ages 18–24" on Queries 8597:391007). 1329 x 173, bg #1f6b3f, border
 * #00522b, r16, p 21/22/22/22, gap 12; eyebrow 14/500 ls .44 #b9d6c8 · title 20/600 white · body 16/500 #b9cdbd.
 * Props: eyebrow, title, children (the body text / extra nodes), className.
 */

const AgencyBanner = ({ eyebrow, title, children, className }) => (
  <section
    aria-label={typeof title === 'string' ? title : eyebrow}
    className={classNames(
      'flex flex-col gap-[12px] rounded-[16px] border border-solid border-[#00522b] bg-[#1f6b3f] px-[22px] pt-[21px] pb-[22px]',
      className
    )}
  >
    {eyebrow ? (
      <p className="m-0 font-sans text-[14px] leading-[15px] font-medium tracking-[0.44px] text-[#b9d6c8]">
        {eyebrow}
      </p>
    ) : null}
    <div className="flex flex-col gap-[8px]">
      {title ? (
        <h2 className="m-0 font-sans text-[20px] leading-[25px] font-semibold tracking-[-0.1px] text-white">
          {title}
        </h2>
      ) : null}
      {children ? (
        <div className="font-sans text-[16px] leading-[22px] font-medium text-[#b9cdbd]">
          {children}
        </div>
      ) : null}
    </div>
  </section>
);

export default AgencyBanner;
