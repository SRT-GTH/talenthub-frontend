import AgencyButton from '../../agency/AgencyButton.jsx';
import AgencyMapGlyph from '../../agency/home/AgencyMapGlyph.jsx';

/*
 * AdminSnapshotCard — the "Live ops" / role snapshot card under the quick actions (Figma "National view snapshot" 8623:~, 1329 x 179, white,
 * 1.5 #e5e5e5, r16, p 18/24, gap 24): 96 x 140 Ghana map glyph · eyebrow 11/13 600 #387440 + headline 20/24 600 + detail line 14/17 #575755 ·
 * "Open live ops" button. The same card as the agency home; text and button come from the role (HOME[role].snapshot).
 * Props: snapshot { eyebrow, headline, line, action }, to (destination of the button).
 */

const AdminSnapshotCard = ({ snapshot, to, className }) => (
  <section
    aria-label={snapshot.eyebrow}
    className={`flex flex-col items-start gap-[16px] rounded-[16px] border-[1.5px] border-solid border-[#e5e5e5] bg-white px-[24px] py-[18px] shadow-[0_1px_2px_rgba(15,15,10,0.05)] sm:flex-row sm:items-center sm:gap-[24px] ${className ?? ''}`}
  >
    <AgencyMapGlyph className="h-[140px] w-[96px] shrink-0" />
    <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
      <p className="m-0 font-sans text-[11px] leading-[13px] font-semibold tracking-[0.2px] text-[#387440] max-lg:text-[12px]">
        {snapshot.eyebrow}
      </p>
      <h2 className="m-0 font-sans text-[20px] leading-[24px] font-semibold tracking-[0.2px] text-[#1c2a21]">
        {snapshot.headline}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[17px] tracking-[0.2px] text-[#575755]">
        {snapshot.line}
      </p>
    </div>
    <AgencyButton size="md" to={to}>
      {snapshot.action}
    </AgencyButton>
  </section>
);

export default AdminSnapshotCard;
