import { CsClockIcon } from './ComingSoonIcons.jsx';
import { CS_COPY, CS_PARTNERS, CS_PROGRESS } from './ComingSoonData.js';
import logoSrc from '../../../../assets/landing/gth-logo-nav.png';
import { debug } from '../../../../utils/debug.js';

const log = debug('ComingSoonChrome');

/*
 * ComingSoonTopBar — Figma "Top bar" (7797:17086, 1728x84, pad 24/64 · tablet 40 · mobile 20): white logo tile (76x60 r14, logo 52x48)
 * on the left, gold chip "Coming soon · 2026" (13/600, 1px ink border, clock icon) on the right.
 */
export const ComingSoonTopBar = () => {
  log('render');
  return (
    <header className="relative z-10 flex h-[84px] items-start justify-between gap-4 px-5 pt-6 md:px-10 xl:px-16">
      <span className="flex h-[60px] w-[76px] items-center justify-center rounded-[14px] bg-white px-3 py-[6px]">
        <img src={logoSrc} alt="Ghana Talent Hub" className="h-12 w-[52px] object-contain" />
      </span>
      <span className="mt-4 inline-flex items-center gap-[5px] rounded-full border border-[#1c2a21] bg-[#ffd86b] py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
        <CsClockIcon size={15} />
        {CS_COPY.topChip}
      </span>
    </header>
  );
};

/*
 * ComingSoonBottom — Figma "Frame 133" (7797:17193, 1600x104, gap 24): "Launch progress" pill (980x54, r100, white 6% + 1px white border, pad 14/20, gap 16)
 * with label 13/700 gold + three meters (12/600 white label, 6px track #eceee8, gradient fill #84cc16 → #ffd86b), then partner chips (26px, white 8%, gap 14).
 * Tablet (7817:6537): pill 754 wide. Mobile (7817:9335): pill stacks vertically, chips wrap.
 */
export const ComingSoonBottom = () => (
  <footer className="relative z-10 flex flex-col items-center gap-6 px-5 md:px-10">
    <div className="flex w-full max-w-[980px] flex-col gap-3 rounded-[100px] border border-white bg-white/[0.06] px-5 py-[14px] md:flex-row md:items-center md:gap-4 md:rounded-full">
      <span className="shrink-0 whitespace-nowrap font-sans text-[13px] font-bold leading-[15.5px] text-[#ffd86b]">
        {CS_PROGRESS.label}
      </span>
      {CS_PROGRESS.items.map((m) => (
        <div key={m.label} className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-sans text-[12px] font-semibold leading-[14.3px] text-white">
            {`${m.label} · ${m.value} / ${m.total}`}
          </span>
          <div className="h-[6px] w-full rounded-[3px] bg-[#eceee8]">
            <div
              className="h-[6px] rounded-[3px] bg-[linear-gradient(90deg,#84cc16_0%,#ffd86b_100%)]"
              style={{ width: `${(m.value / m.total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
    <ul className="m-0 flex w-full max-w-[1600px] list-none flex-wrap items-center justify-center gap-[14px] p-0">
      {CS_PARTNERS.map((p) => (
        <li
          key={p}
          className="rounded-full border border-white bg-white/[0.08] px-[10px] py-1 font-sans text-[13px] font-semibold leading-[15.5px] text-white"
        >
          {p}
        </li>
      ))}
    </ul>
  </footer>
);
