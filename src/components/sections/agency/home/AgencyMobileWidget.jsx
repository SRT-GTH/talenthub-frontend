import { classNames } from '../../../../utils/classNames.js';

/*
 * AgencyMobileWidget — the white card of the phone home (Figma "Widget · …" 8613:28: 328 wide, white, 1px #e5e8e3, r16, p 24, gap 16, Elevation/Card shadow).
 * Head: 28 x 28 #ebf1ec r6 icon tile + title 16/28 600 #111 (+ optional chip) over the 12/20 #575755 subtitle.
 * Props: icon (node), title, count (chip text), subtitle, id (heading id), children, className.
 */

const AgencyMobileWidget = ({ icon, title, count, subtitle, id, children, className }) => (
  <section
    aria-labelledby={id}
    className={classNames(
      'flex flex-col gap-[16px] rounded-[16px] border border-solid border-[#e5e8e3] bg-white p-[24px] shadow-[0_1px_2px_rgba(15,15,10,0.05),0_6px_16px_-4px_rgba(15,15,10,0.07)]',
      className
    )}
  >
    <header className="flex flex-col gap-[2px]">
      <div className="flex items-center gap-[8px]">
        <span
          aria-hidden="true"
          className="grid size-[28px] shrink-0 place-items-center rounded-[6px] bg-[#ebf1ec] text-[#387440]"
        >
          {icon}
        </span>
        <h2
          id={id}
          className="m-0 font-sans text-[16px] leading-[28px] font-semibold tracking-[0.1px] text-[#111111]"
        >
          {title}
        </h2>
        {count ? (
          <span className="inline-flex rounded-full bg-[#ebf1ec] px-[8px] py-[3px] font-sans text-[12px] leading-[20px] font-medium tracking-[0.2px] text-[#2a5730]">
            {count}
          </span>
        ) : null}
      </div>
      <p className="m-0 font-sans text-[12px] leading-[20px] tracking-[0.2px] text-[#575755]">
        {subtitle}
      </p>
    </header>
    {children}
  </section>
);

export default AgencyMobileWidget;
