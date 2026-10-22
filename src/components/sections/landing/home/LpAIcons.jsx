/*
 * LpAIcons — icons / doodles for the landing home sections S1 Hero, S3 How it works, S4 Features (package LP-A).
 * ⚠️ ASSUMPTION: the Figma icon vector geometry is not available offline, so the outline icons below are redrawn in the same
 * 20-24px stroke style (colour comes from `currentColor`, set by the caller to the Figma fill). Doodle star paths are the
 * 4-point sparkle already used across the app (DoodleStarLargeIcon).
 */

export {
  Fi20Star as LpStarIcon,
  Fi20User as LpUserIcon,
  Fi20Heart as LpHeartIcon,
  Fi20Bulb as LpBulbIcon,
  Fi20Eye as LpEyeIcon,
  Fi20Bolt as LpBoltIcon,
  FiWork as LpBriefcaseIcon,
  Fi20Folder as LpFolderIcon,
  FiTrophy as LpTrophyIcon,
  FiMortarboard01 as LpMortarboardIcon,
  Fi20Target as LpTargetIcon,
  Fi20Diamond as LpDiamondIcon,
  Fi16Check as LpCheckIcon,
  Fi20Shield as LpShieldIcon,
  FiGame as LpGameIcon,
  Fi20Chat as LpChatIcon,
  Fi20Edit as LpEditIcon,
  Fi20Search as LpSearchIcon,
  Fi20MarkerPin as LpPinIcon,
  Fi20Wallet as LpWalletIcon,
  FiAi as LpAiSparkIcon,
  FiDoodleStar as LpDoodleStar,
  FiScribbleUnderline as LpScribbleUnderline,
  FiFire as LpFireIcon,
} from './LpFigmaIcons.jsx';

const Outline = ({ children, className = '', strokeWidth = 1.8 }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const LpVideoIcon = ({ className }) => (
  <Outline className={className}>
    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
    <rect x="2" y="6" width="14" height="12" rx="2" />
  </Outline>
);
