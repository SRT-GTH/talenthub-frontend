/*
 * InstitutionSettingsInfoBox — the cream info strip (Figma 8746:260 page banner: r16 p16, 14/500 #463409; 8746:938 dialog box: r12 p12, 13.5/500).
 * Props: icon, compact (dialog size, default true; false = the page banner), children.
 */
const InstitutionSettingsInfoBox = ({ icon, compact = true, children }) => (
  <div
    className={
      compact
        ? 'flex items-center gap-[10px] rounded-[12px] bg-[#faf4e8] p-[12px] text-[13.5px] leading-[20px] font-medium text-[#463409]'
        : 'flex items-center gap-[12px] rounded-[16px] bg-[#faf4e8] p-[16px] text-[14px] leading-[20px] font-medium text-[#463409]'
    }
  >
    <span className="flex shrink-0 text-[#463409]">{icon}</span>
    <p className="m-0 min-w-0 flex-1">{children}</p>
  </div>
);

export default InstitutionSettingsInfoBox;
