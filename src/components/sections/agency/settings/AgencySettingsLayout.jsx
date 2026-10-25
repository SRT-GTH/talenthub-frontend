import AgencySettingsNav from './AgencySettingsNav.jsx';

/*
 * AgencySettingsLayout — "Main Content Canvas" of Figma 11.6.1a-g: h1 "Settings" 32/40 600 + 16/24 #595959 subtitle, then the 280px nav
 * and the tab body (gap 24, body column gap 20).
 * Props: active (nav id), subtitle, children.
 */
const AgencySettingsLayout = ({ active, subtitle, children }) => (
  <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)] pt-[clamp(0px,0.93vw,16px)]">
    <div className="flex flex-col gap-[3px]">
      <h1 className="m-0 font-sans text-[clamp(26px,1.85vw,32px)] leading-[1.25] font-semibold tracking-[-0.16px] text-[#1c2a21]">
        Settings
      </h1>
      <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
        {subtitle}
      </p>
    </div>
    <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
      <AgencySettingsNav active={active} />
      <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
    </div>
  </div>
);

export default AgencySettingsLayout;
