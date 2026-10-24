import { useId } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { PublicIconShield } from './showcaseIcons.jsx';

/*
 * ShowcaseConsentBanner — Figma "consent banner" 8497:76 (collapsed, 1360x50) and 8497:348989 (expanded, 1360x127; frame 8.4.1c).
 * #ebf1ec, 1px #c1d4c4, r16, p 14/20. Row: shield 20 #387440 · "Showcase profile, displayed with consent." 15/18 600 #2a5730 ·
 * "One of 5 curated examples. Contact details are never shown." 15/18 400 · toggle on the right (14/17 600 #387440).
 * Expanded: three points (title 14/17 600, body 14/20 400, gap 24, pt 6) — what is shown and that profiles are shared with consent.
 * Mobile (< md): the drawn frame 8508:128 is a single chip "Showcase profile · shown with consent" (13/16 600, r12, p 10/12) with no toggle;
 * ⚠️ ASSUMPTION: the chip stays non-interactive as drawn; the full explanation lives on the desktop/tablet banner and the grid page.
 * Props: consent (the API block), expanded (boolean), onToggle (fn)
 */

const ShowcaseConsentBanner = ({ consent, expanded, onToggle, className }) => {
  const panelId = useId();
  return (
    <>
      <div
        className={classNames(
          'hidden flex-col gap-[10px] rounded-[16px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[20px] py-[14px] font-sans md:flex',
          className
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[6px]">
          <p className="m-0 flex min-w-0 flex-wrap items-center gap-x-[10px] gap-y-[2px] text-[15px] leading-[18px] text-[#2a5730]">
            <PublicIconShield className="size-[20px] shrink-0 text-[#387440]" />
            <span className="font-semibold">{consent.headline}</span>
            <span className="font-normal">{consent.summary}</span>
          </p>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="min-h-[24px] cursor-pointer border-0 bg-transparent p-0 text-[14px] leading-[17px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {expanded ? consent.expandedToggle : consent.collapsedToggle}
          </button>
        </div>
        <div
          id={panelId}
          hidden={!expanded}
          className="grid gap-[16px] pt-[6px] xl:grid-cols-3 xl:gap-[24px]"
        >
          {consent.points.map((point) => (
            <div key={point.id} className="flex min-w-0 flex-col gap-[4px] text-[#2a5730]">
              <p className="m-0 text-[14px] leading-[17px] font-semibold">{point.title}</p>
              <p className="m-0 text-[14px] leading-[20px] font-normal">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="m-0 flex items-center gap-[8px] rounded-[12px] bg-[#ebf1ec] px-[12px] py-[10px] font-sans text-[13px] leading-[16px] font-semibold text-[#2a5730] md:hidden">
        <PublicIconShield className="size-[16px] shrink-0 text-[#387440]" />
        {consent.mobileLabel}
      </p>
    </>
  );
};

export default ShowcaseConsentBanner;
