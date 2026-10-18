import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ProfileA11yPillCloudIcon, ProfileA11yPillRowsIcon } from '../../shared/assets.jsx';
import { A11Y_PILLS } from './profileA11yData.js';

const log = debug('ProfileA11yPills');

/*
 * ProfileA11yPills — the line of "what is on" pills above the profile when accessibility settings are
 * applied. Figma AX-02 (Playful 7590:3379 / Focused 8110:390599): dark pills "Calm profile" (cloud) ·
 * "Aa Large text" · "One column" (rows) then the green link "Change in Accessibility". AX-03
 * (7590:4097…): the dark "High contrast ON" pill, the outlined "U̲ Underline links" pill and the
 * green text "Set in Accessibility › Everywhere" (those two are talent-wide settings, so the line
 * points at the Everywhere tab). Pills are 32px tall (35px outlined), r999, p8/14, 13px/600.
 *
 * Props: effective (from useProfileA11y), onOpenPanel(scope) — opens the settings popover.
 */
const DarkPill = ({ children, icon }) => (
  <span className="inline-flex h-[32px] items-center gap-[8px] rounded-full bg-[#1c2a21] px-[14px] py-[8px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-white max-lg:text-[13px]">
    {icon}
    {children}
  </span>
);

const OutlinePill = ({ children }) => (
  <span className="inline-flex h-[35px] items-center gap-[8px] rounded-full border-[1.5px] border-[#1c2a21] bg-white px-[14px] py-[8px] text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#1c2a21]">
    {children}
  </span>
);

const ProfileA11yPills = ({ effective, onOpenPanel }) => {
  const profileModes = effective.calm || effective.size === 'large' || effective.oneColumn;
  const globalModes = effective.contrast || effective.links;

  useEffect(() => {
    log('mount', { profileModes, globalModes });
  }, [profileModes, globalModes]);

  if (!profileModes && !globalModes) return null;

  return (
    <div
      role="status"
      aria-label="Accessibility settings applied"
      className={classNames('flex flex-wrap items-center justify-center gap-[8px]')}
    >
      {effective.calm ? (
        <DarkPill icon={<ProfileA11yPillCloudIcon className="size-[15px] shrink-0" />}>
          {A11Y_PILLS.calm}
        </DarkPill>
      ) : null}
      {effective.size === 'large' ? <DarkPill>{A11Y_PILLS.large}</DarkPill> : null}
      {effective.oneColumn ? (
        <DarkPill icon={<ProfileA11yPillRowsIcon className="size-[15px] shrink-0" />}>
          {A11Y_PILLS.oneColumn}
        </DarkPill>
      ) : null}
      {profileModes ? (
        <button
          type="button"
          onClick={() => {
            log('change in accessibility ->', 'profile');
            onOpenPanel('profile');
          }}
          className="cursor-pointer text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {A11Y_PILLS.change}
        </button>
      ) : null}

      {effective.contrast ? <DarkPill>{A11Y_PILLS.contrast}</DarkPill> : null}
      {effective.links ? <OutlinePill>{A11Y_PILLS.links}</OutlinePill> : null}
      {globalModes ? (
        <button
          type="button"
          onClick={() => {
            log('set in accessibility ->', 'everywhere');
            onOpenPanel('everywhere');
          }}
          className="cursor-pointer text-[13px] leading-[16px] font-semibold whitespace-nowrap text-[#1f4423] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {A11Y_PILLS.everywhere}
        </button>
      ) : null}
    </div>
  );
};

export default ProfileA11yPills;
