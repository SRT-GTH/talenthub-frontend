import { useUiStyle } from '../../../hooks/useUiStyle.js';
import {
  HubArrowRightIcon,
  HubCalendarIcon,
  HubChartBarIcon,
  HubCompassIcon,
  HubDnsIcon,
  HubEyeOffIcon,
  HubFunctionIcon,
  HubHourglassIcon,
  HubImageIcon,
  HubLaptopIcon,
  HubMicIcon,
  HubRepeatIcon,
  HubSearchIcon,
  HubShieldIcon,
  HubStarIcon,
  HubTargetIcon,
  HubTrendUpIcon,
  HubUsersIcon,
  HubViewTableIcon,
  HubWifiOffIcon,
} from './HubIcons.jsx';

export const LAB_ICONS = {
  function: HubFunctionIcon,
  mic: HubMicIcon,
  users: HubUsersIcon,
  dns: HubDnsIcon,
  'view-table': HubViewTableIcon,
  'chart-bar': HubChartBarIcon,
  laptop: HubLaptopIcon,
  image: HubImageIcon,
  calendar: HubCalendarIcon,
  target: HubTargetIcon,
  compass: HubCompassIcon,
};

export const NOTE_ICONS = {
  repeat: HubRepeatIcon,
  'eye-off': HubEyeOffIcon,
  hourglass: HubHourglassIcon,
  shield: HubShieldIcon,
  'wifi-off': HubWifiOffIcon,
};

/* "XP" in Playful, "pts" in Focused (Figma copy differs per style). */
export const useXpWord = () => {
  const { uiStyle } = useUiStyle();
  return uiStyle === 'playful' ? 'XP' : 'pts';
};
