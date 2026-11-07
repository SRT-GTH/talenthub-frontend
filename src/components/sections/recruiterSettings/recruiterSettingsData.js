/*
 * Recruiter Settings & Account - nav + copy shared by every tab (Figma "Recruiter - Settings & Account" 10161:75722, SR-01 ... SR-27).
 * Tab ids are the `?tab=` values of /recruiter/settings. Each tab's own copy lives in its own data file (owned by that tab).
 */
import {
  SettingsNavAccessibilityIcon,
  SettingsNavBriefcaseIcon,
  SettingsNavBuildingIcon,
  SettingsNavCreditCardIcon,
} from './settingsNavIcons.jsx';

export const RECRUITER_SETTINGS_HEADING = 'Settings';
export const RECRUITER_SETTINGS_SUBHEADING =
  'Manage your account, your organisation and how GTH works for your hiring team.';

// `icon` = a key of SettingsLayout's ICONS (talent glyphs); `Icon` = the glyph Figma draws for the row when the talent set has none (settingsNavIcons.jsx).
export const RECRUITER_SETTINGS_NAV = [
  { id: 'account', label: 'Account', icon: 'user' },
  {
    id: 'organisation',
    label: 'Organisation',
    Icon: SettingsNavBuildingIcon,
    chip: 'Verified',
    chipClassName: 'bg-[#ebf1ec] text-[#387440]',
  },
  { id: 'team', label: 'Team and roles', icon: 'users' },
  { id: 'hiring', label: 'Hiring preferences', Icon: SettingsNavBriefcaseIcon },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'billing', label: 'Plan and billing', Icon: SettingsNavCreditCardIcon },
  { id: 'accessibility', label: 'Accessibility', Icon: SettingsNavAccessibilityIcon },
  { id: 'language', label: 'Language and data', icon: 'globe' },
  { id: 'security', label: 'Security and sign-in', icon: 'lock' },
];
export const RECRUITER_SETTINGS_TAB_IDS = RECRUITER_SETTINGS_NAV.map((item) => item.id);
