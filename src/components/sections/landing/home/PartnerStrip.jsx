import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { PARTNERS, PARTNER_STRIP_LABEL } from './PartnerStripData.js';

const log = debug('PartnerStrip');

/*
 * PartnerStrip ("LandingStrip", Figma Frame 17: desktop 7797:9115 1728x87, tablet 7815:265720 834x109, mobile 7815:273537 430x101).
 *  - cream #f4eedf band with #ebf1ec top/bottom border; label "Opportunities from teams across Ghana" (14/600 +0.1 #387440);
 *  - desktop: label (297 wide) left, logo strip fills the rest up to 68px from the right edge; tablet/mobile: label above the strip
 *    (the right inset of 68 and the zero left inset are as drawn in Figma);
 *  - the strip clips a doubled row of 7 partner logos (Figma container 2516 wide = 2 x 1258) — drawn mid-scroll, so it is a marquee:
 *    translates by one set per loop (paused for prefers-reduced-motion). Two blurred 2x60 dividers sit at the strip ends.
 */
const MARQUEE_CSS = `
@keyframes lpa-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.lpa-marquee-track { animation: lpa-marquee 32s linear infinite; }
@media (prefers-reduced-motion: reduce) { .lpa-marquee-track { animation: none; } }
`;

const Logo = ({ name, hidden }) => (
  <li className="flex shrink-0 items-center gap-[10px]" aria-hidden={hidden || undefined}>
    {/* Empty logo slot (placeholder, 32x32, radius 8, 1px #deded6) */}
    <span className="size-8 shrink-0 rounded-[8px] border border-[#deded6] bg-white" />
    <span className="whitespace-nowrap font-ui text-[15px] font-semibold leading-[18.3px] text-[#70706e]">
      {name}
    </span>
  </li>
);

const PartnerStrip = () => {
  useEffect(() => {
    log('mount: partners', PARTNERS.length);
  }, []);

  return (
    <section
      id="lp-partners"
      aria-label={PARTNER_STRIP_LABEL}
      className="flex flex-col items-stretch justify-between border-y border-[#ebf1ec] bg-[#f4eedf] pb-[13px] pr-[68px] pt-4 md:pb-[15px] md:pt-[18px] xl:h-[87px] xl:flex-row xl:items-center xl:gap-[15px] xl:py-0"
    >
      <style>{MARQUEE_CSS}</style>
      <p className="m-0 flex shrink-0 items-center justify-center text-center font-sans text-[14px] font-semibold leading-6 tracking-[0.1px] text-[#387440] max-md:h-7 md:h-8 xl:w-[297px] xl:justify-center">
        {PARTNER_STRIP_LABEL}
      </p>
      <div className="relative h-[43px] min-w-0 shrink-0 overflow-hidden xl:flex-1">
        <ul className="lpa-marquee-track absolute left-0 top-1/2 m-0 flex w-max -translate-y-1/2 list-none items-center gap-12 py-0 pl-0 pr-12">
          {[...PARTNERS, ...PARTNERS].map((name, i) => (
            <Logo key={`${name}-${i}`} name={name} hidden={i >= PARTNERS.length} />
          ))}
        </ul>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/2 h-[60px] w-[2px] -translate-y-1/2 rounded-[20px] bg-[#c6c6c3] opacity-80 blur-[3px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 h-[60px] w-[2px] -translate-y-1/2 rounded-[20px] bg-[#c6c6c3] opacity-80 blur-[3px]"
        />
      </div>
    </section>
  );
};

export default PartnerStrip;
