import { classNames } from '../../../../../utils/classNames.js';
import SiteCopyChip from './SiteCopyChip.jsx';

/*
 * SiteCopyPagesCard — the white "Pages" list card of the Site copy screens (Figma "Pages": 420 wide, r20, p16, gap 6, 1px ink@.10): a head row (13/700 label with
 * .52 tracking + a 12.5/500 count on the right) and the page groups below. `SiteCopySharedHead` is the "SHARED SECTIONS" divider row of the same card.
 * Props: title ("Pages", "RESULTS", "UNPUBLISHED CHANGES", "TEMPLATES"...), meta ("46 pages"), className, children.
 */
export const SiteCopyPagesCard = ({ title, meta, className, children }) => (
  <section
    aria-label={title}
    className={classNames(
      'flex w-full min-w-0 flex-col gap-[6px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] lg:w-[min(420px,34%)] lg:shrink-0 xl:w-[420px]',
      className
    )}
  >
    <div className="flex items-center gap-[8px] pt-[4px] pr-[4px] pb-[8px] pl-[4px]">
      <h2 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
        {title}
      </h2>
      <span className="flex-1" />
      <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
        {meta}
      </span>
    </div>
    {children}
  </section>
);

export const SiteCopySharedHead = () => (
  <>
    <div className="h-[8px]" aria-hidden="true" />
    <div className="flex items-center gap-[8px] pt-[8px] pr-[4px] pb-[6px] pl-[4px]">
      <h3 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
        SHARED SECTIONS
      </h3>
      <span className="flex-1" />
      <SiteCopyChip kind="shared" />
    </div>
  </>
);

export default SiteCopyPagesCard;
