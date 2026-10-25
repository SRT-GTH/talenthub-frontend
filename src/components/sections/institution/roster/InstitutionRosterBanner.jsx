import { classNames } from '../../../../utils/classNames.js';
import { RosterClockIcon } from './rosterIcons.jsx';

/*
 * InstitutionRosterBanner — the amber "discovery banner" under the roster toolbar (Figma 8590:383377, 1329 x 48, #faf4e8, 1px #eedeb8, r20, p 14/18/14/14, gap 14):
 * clock glyph (18, #967014) + one line 14/17 500 #1c2a21. Props: children (the sentence), className.
 */
const InstitutionRosterBanner = ({ children, className }) => (
  <div
    role="status"
    className={classNames(
      'flex items-center gap-[14px] rounded-[20px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[14px] pr-[18px] pl-[14px]',
      className
    )}
  >
    <RosterClockIcon className="size-[18px] shrink-0 text-[#967014]" />
    <p className="m-0 font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
      {children}
    </p>
  </div>
);

export default InstitutionRosterBanner;
