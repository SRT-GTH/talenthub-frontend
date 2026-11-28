/* parentNavIcons — one icon per parent nav id, shared by the sidebar, the collapsed rail, the phone tab bar and the search (Figma exports in src/assets/parent). */
import homeIcon from '../../../../assets/parent/frame-1.svg';
import navWards from '../../../../assets/parent/icon-1.svg';
import navReview from '../../../../assets/parent/icon-2.svg';
import navEvaluate from '../../../../assets/parent/icon-3.svg';
import navWallets from '../../../../assets/parent/stroke.svg';
import navNotifications from '../../../../assets/parent/icon-4.svg';
import navSettings from '../../../../assets/parent/icon-5.svg';
import navHelp from '../../../../assets/parent/icon-6.svg';
import navCareer from '../../../../assets/parent/icon-7.svg';

export const PARENT_NAV_ICONS = {
  home: homeIcon,
  wards: navWards,
  review: navReview,
  evaluate: navEvaluate,
  wallets: navWallets,
  notifications: navNotifications,
  settings: navSettings,
  help: navHelp,
  career: navCareer,
};
