import AgencyButton from '../AgencyButton.jsx';
import { formatCount } from '../agencyFormat.js';
import AgencyMapGlyph from './AgencyMapGlyph.jsx';
import { NATIONAL_SNAPSHOT as S } from './data/agencyHomeData.js';

/*
 * AgencyNationalSnapshot — "National view snapshot" card (Figma 8597:398353, 1329 x 179, white, 1.5 #e5e5e5, r16, p 18/24, gap 24):
 * 96 x 140 map glyph · eyebrow 11/13 600 #387440 + headline 20/24 600 + top-regions line 14/17 #575755 · "Open national data" button.
 * All counts through formatCount().
 */

const AgencyNationalSnapshot = ({ className }) => (
  <section
    aria-label="National view snapshot"
    className={`flex flex-col items-start gap-[16px] rounded-[16px] border-[1.5px] border-solid border-[#e5e5e5] bg-white px-[24px] py-[18px] shadow-[0_1px_2px_rgba(15,15,10,0.05)] sm:flex-row sm:items-center sm:gap-[24px] ${className ?? ''}`}
  >
    <AgencyMapGlyph className="h-[140px] w-[96px] shrink-0" />
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[11px] max-lg:text-[12px] leading-[13px] font-semibold tracking-[0.2px] text-[#387440]">
        {S.eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[20px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21]">
        {formatCount(S.total)} talents across {S.regions} regions
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[17px] tracking-[0.2px] text-[#575755]">
        {S.top.map((t) => `${t.name} ${formatCount(t.count)}`).join(' · ')} · {S.readinessNote}
      </p>
    </div>
    <AgencyButton size="md" to={S.to}>
      {S.action}
    </AgencyButton>
  </section>
);

export default AgencyNationalSnapshot;
