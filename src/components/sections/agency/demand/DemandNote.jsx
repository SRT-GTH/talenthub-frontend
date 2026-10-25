import { classNames } from '../../../../utils/classNames.js';
import { PublicIconInfo } from '../../publicData/publicDataIcons.jsx';
import { AgencyShieldIcon } from '../agencyIcons.jsx';

/*
 * DemandNote — the 13/16 #575755 footnote with its 16px icon (Figma "note": icon/20-info-circle under cards, icon/20-shield on the page footnote), gap 8.
 * Props: icon 'info' | 'shield', children (the verbatim sentence), className.
 */

const DemandNote = ({ icon = 'info', children, className }) => {
  const Icon = icon === 'shield' ? AgencyShieldIcon : PublicIconInfo;
  return (
    <p
      className={classNames(
        'm-0 flex items-start gap-[8px] font-sans text-[13px] leading-[16px] text-[#575755]',
        className
      )}
    >
      <Icon className="mt-[0px] size-[16px] shrink-0 text-[#575755]" />
      <span className="min-w-0">{children}</span>
    </p>
  );
};

export default DemandNote;
