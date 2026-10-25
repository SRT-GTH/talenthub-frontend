import { classNames } from '../../../../utils/classNames.js';
import InstitutionSettingsNav from './InstitutionSettingsNav.jsx';

/*
 * InstitutionSettingsLayout — "Main Content Canvas" of Figma 11.6.1a-f: h1 "Settings" 34/41 600 (-0.68) (8597:*; 32/40 -0.16 on the revised 8746:* frames,
 * `revised`) + 16/24 #595959 subtitle, then the 280px nav and the tab body (gap 24, body column gap 20).
 * Props: active (nav id), subtitle, revised (8746:* heading size), children.
 */
const InstitutionSettingsLayout = ({ active, subtitle, revised = false, children }) => (
  <div className="flex flex-col gap-[clamp(16px,1.39vw,24px)] pt-[clamp(0px,0.93vw,16px)]">
    <div className="flex flex-col gap-[3px]">
      <h1
        className={classNames(
          'm-0 font-sans font-semibold text-[#1c2a21]',
          revised
            ? 'text-[clamp(26px,1.85vw,32px)] leading-[1.25] tracking-[-0.16px]'
            : 'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.68px] max-sm:tracking-[-0.3px]'
        )}
      >
        Settings
      </h1>
      <p className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px]">
        {subtitle}
      </p>
    </div>
    <div className="flex items-start gap-[24px] max-lg:flex-col max-lg:gap-[16px]">
      <InstitutionSettingsNav active={active} />
      <div className="flex w-full min-w-0 flex-1 flex-col gap-[20px]">{children}</div>
    </div>
  </div>
);

export default InstitutionSettingsLayout;
