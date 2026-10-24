import { Link } from 'react-router-dom';
import { PublicIconInfo } from '../publicDataIcons.jsx';

/*
 * OverviewPageHeader — "page header" of Figma 8.2.1a (8487:345974): title 34/41 600 -0.34, sentence 16/19 #595959; on the right "Data as of
 * 17 Oct 2026 · 14:02 GMT" 14/500 + "How we count" (info icon, 14/600 #387440, leads to the methodology page).
 * Mobile 8.2.1e (8507:41): title 26/31, short sentence 14/20, and one line "Updated 2 min ago · data as of 17 Oct, 14:02" (12/500).
 * Tablet 8.2.1f draws the same row as desktop.
 * The top bar owns the page's <h1> ("National snapshot"), so the big title is an <h2>.
 * Props: asOf { label, short }.
 */

const OverviewPageHeader = ({ asOf }) => (
  <div className="flex flex-col gap-[8px] md:flex-row md:items-end md:justify-between md:gap-[16px]">
    <div className="flex min-w-0 flex-col gap-[4px] md:gap-[6px]">
      <h2 className="m-0 font-sans text-[26px] leading-[31px] font-semibold tracking-[-0.13px] text-[#1c2a21] md:text-[34px] md:leading-[41px] md:tracking-[-0.34px]">
        National talent snapshot
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959] md:text-[16px] md:leading-[19px]">
        <span className="md:hidden">Live, anonymised figures. No personal details shown.</span>
        <span className="hidden md:inline">
          Live, anonymised figures from Ghana Talent Hub. No names, photos or contact details are
          ever shown.
        </span>
      </p>
    </div>
    <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959] md:hidden">
      Updated 2 min ago · {asOf.short}
    </p>
    <div className="hidden shrink-0 items-center gap-[16px] md:flex">
      <span className="font-sans text-[14px] leading-[17px] font-medium text-[#595959]">
        {asOf.label}
      </span>
      <Link
        to="/data/methodology"
        className="inline-flex min-h-[24px] items-center gap-[6px] rounded-[6px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <PublicIconInfo className="size-[18px]" />
        How we count
      </Link>
    </div>
  </div>
);

export default OverviewPageHeader;
