import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../../../../assets/admin/site-copy/browse/home-hero-preview.png';
import { debug } from '../../../../../utils/debug.js';
import SiteCopyChip from './SiteCopyChip.jsx';
import { BrowseEditTagIcon } from './SiteCopyBrowseIcons.jsx';
import { HOME_OVERVIEW } from './siteCopyBrowseData.js';

const log = debug('SiteCopyPagePreview');

/*
 * SiteCopyPagePreview — the "page overview" card of 7.8.1a: the Home page title with its draft chip, "6 sections · last published 28 Oct by Ama Owusu", the line
 * "Pick a section on the left, or click it on the page below." and a tablet-width drawing of the page whose sections (Hero, How it works) are outlined in dashed
 * blue with an edit tag; clicking one opens it in the section editor. The nav, hero and steps are the drawn Home content (verbatim).
 * Props: draftCount (Draft changes chip of the page, 0 hides it), heroTo / howTo (editor links of the two outlined sections).
 */
const EditTag = ({ label }) => (
  <span className="absolute top-[8px] left-[8px] z-[1] inline-flex items-center gap-[4px] rounded-[6px] bg-[#244a9f] py-[3px] pr-[8px] pl-[6px] font-sans text-[11.5px] leading-[14px] font-bold text-white max-xl:text-[12px]">
    <BrowseEditTagIcon className="size-[12px]" />
    {label}
  </span>
);

const SiteCopyPagePreview = ({ draftCount, heroTo, howTo }) => {
  useEffect(() => {
    log('render', { draftCount });
  }, [draftCount]);
  return (
    <section
      aria-label="Home page overview"
      className="flex min-w-0 flex-1 flex-col gap-[16px] self-start rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(16px,1.8vw,24px)] font-sans max-lg:w-full"
    >
      <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[6px]">
        <h2 className="m-0 text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
          {HOME_OVERVIEW.title}
        </h2>
        {draftCount > 0 ? <SiteCopyChip kind="draft" count={draftCount} /> : null}
        <span className="flex-1" />
        <span className="text-[13px] leading-[16px] text-[#575755]">
          {HOME_OVERVIEW.sectionsLine}
        </span>
      </div>
      <p className="m-0 text-[14px] leading-[17px] text-[#575755]">
        Pick a section on the left, or click it on the page below.
      </p>
      <div className="overflow-hidden rounded-[20px] border border-solid border-[#e7e7e7] bg-white">
        <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[8px] px-[clamp(14px,2vw,24px)] py-[14px]">
          <span className="text-[16px] leading-[19px] font-bold text-[#2a5730]">
            Ghana Talent Hub
          </span>
          <span className="flex-1" />
          {HOME_OVERVIEW.nav.map((n) => (
            <span
              key={n}
              className="text-[13px] leading-[16px] font-medium text-[#575755] max-sm:hidden"
            >
              {n}
            </span>
          ))}
          <span className="inline-flex h-[32px] items-center rounded-full border border-solid border-[#1c2a21] bg-[#1c2a21] px-[14px] text-[13px] leading-[16px] font-semibold text-white">
            Join now
          </span>
        </div>
        <Link
          to={heroTo}
          aria-label="Edit the Hero section"
          className="relative flex flex-col gap-[24px] border-[1.5px] border-dashed border-[#1f5fa8]/70 bg-[#f8f8f4] px-[clamp(16px,3vw,40px)] pt-[clamp(40px,3vw,36px)] pb-[clamp(20px,3vw,36px)] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244a9f] sm:flex-row sm:items-center sm:gap-[32px]"
        >
          <EditTag label="Hero" />
          <span className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <span className="text-[clamp(26px,2.4vw,34px)] leading-[1.18] font-bold text-[#1c2a21]">
              Find work that fits you
            </span>
            <span className="text-[16px] leading-[24px] text-[#575755]">
              Show what you can do, get verified skills and connect with employers across Ghana.
            </span>
            <span className="mt-[2px] inline-flex min-h-[56px] w-fit items-center rounded-[14px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[34px] py-[16px] text-[16px] leading-[24px] font-bold tracking-[0.1px] text-[#e8f2ed] shadow-[0_4px_0_#2a5730]">
              Create my profile
            </span>
          </span>
          <img
            src={heroImage}
            alt=""
            width={300}
            height={260}
            className="h-[clamp(180px,18vw,260px)] w-full shrink-0 rounded-[18px] object-cover sm:w-[clamp(200px,22vw,300px)]"
          />
        </Link>
        <Link
          to={howTo}
          aria-label="Edit the How it works section"
          className="relative flex flex-col gap-[14px] border-[1.5px] border-t-0 border-dashed border-[#1f5fa8]/70 px-[clamp(16px,3vw,40px)] pt-[clamp(38px,3vw,28px)] pb-[clamp(16px,2.4vw,28px)] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#244a9f]"
        >
          <EditTag label="How it works" />
          <span className="text-[22px] leading-[26px] font-semibold text-[#1c2a21]">
            How it works
          </span>
          <span className="grid grid-cols-1 gap-[14px] sm:grid-cols-3">
            {['Build your profile', 'Prove your skills', 'Get matched'].map((s, i) => (
              <span
                key={s}
                className="flex flex-col gap-[6px] rounded-[14px] bg-[#f8f8f4] p-[14px]"
              >
                <span className="text-[18px] leading-[21px] font-bold text-[#387440]">{i + 1}</span>
                <span className="text-[14px] leading-[17px] font-semibold text-[#1c2a21]">{s}</span>
              </span>
            ))}
          </span>
        </Link>
      </div>
    </section>
  );
};

export default SiteCopyPagePreview;
