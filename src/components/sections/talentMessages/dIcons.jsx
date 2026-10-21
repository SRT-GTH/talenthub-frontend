import {
  A11yPanelSparkleIcon,
  CheckIcon as SharedCheckIcon,
  ProfileA11yCloudGlyph,
  ProfileA11ySparkGlyph,
  ProfileA11yTextSizeGlyph,
  ProfileA11yVolumeGlyph,
  ProfileCloseGlyph,
  ProfileGhanaFlagIcon,
  ProfilePauseGlyph,
  SettingsABellIcon,
  WarningIcon as SharedWarningIcon,
} from '../../shared/assets.jsx';

/*
 * Package D icons: glyphs that already exist in shared/assets.jsx are re-exported under the Figma layer name; the rest
 * (enter 7488:4915, skip 7491:6665, message-01 7613:155186, squiggles 7499:6859 / 7499:6861, sparkles 7499:6873 /
 * 6875 / 6877) were exported from Figma through the MCP asset server. None is hand-drawn.
 */

export const VolumeIcon = ProfileA11yVolumeGlyph; // icon/vol 7488:4899 (stroke #2D5D33)
export const TextSizeIcon = ProfileA11yTextSizeGlyph; // 7488:4855
export const SparkIcon = ProfileA11ySparkGlyph; // icon/spark 7488:4902
export const CloudIcon = ProfileA11yCloudGlyph; // icon/cloud 7488:4904
export const EnterIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6 6.66667L2.66667 10L6 13.3333"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3333 2.66667V7.33333C13.3333 8.04058 13.0524 8.71885 12.5523 9.21895C12.0522 9.71905 11.3739 10 10.6667 10H2.66667"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
); // icon/enter 7488:4915 (Figma stroke #2D5D33; pass the colour with text-[#2d5d33])
export const MessageIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.3125 8.64583H9.6875M5.3125 5.52083H7.5"
      stroke="currentColor"
      strokeWidth="0.833333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.85662 12.6399C11.471 12.4661 13.5535 10.3541 13.7249 7.70265C13.7584 7.18377 13.7584 6.6464 13.7249 6.12752C13.5535 3.47607 11.471 1.36404 8.85662 1.19025C7.96469 1.13096 7.0335 1.13109 6.14337 1.19025C3.52899 1.36404 1.4465 3.47607 1.27515 6.12752C1.24162 6.6464 1.24162 7.18377 1.27515 7.70265C1.33756 8.66833 1.76464 9.56246 2.26744 10.3175C2.55938 10.846 2.36671 11.5057 2.06263 12.082C1.84338 12.4975 1.73375 12.7052 1.82177 12.8553C1.9098 13.0053 2.10641 13.0101 2.49964 13.0197C3.27729 13.0386 3.80167 12.8181 4.21792 12.5112C4.454 12.3371 4.57204 12.2501 4.6534 12.2401C4.73475 12.2301 4.89485 12.296 5.215 12.4279C5.50275 12.5464 5.83685 12.6195 6.14337 12.6399C7.0335 12.6991 7.96469 12.6992 8.85662 12.6399Z"
      stroke="currentColor"
      strokeWidth="0.833333"
      strokeLinejoin="round"
    />
  </svg>
); // icon/message-01 7613:155186 (Figma stroke white)
export const PauseIcon = ProfilePauseGlyph; // icon/pause 7491:6637
export const SkipIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12.6667 3.33333V12.6667M3.33333 2.66667L10 8L3.33333 13.3333V2.66667Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
); // icon/skip 7491:6665 (exported via the Figma MCP asset server)
export const CloseIcon = ProfileCloseGlyph; // icon/x
export const BellIcon = SettingsABellIcon; // icon/bell
export const WarningIcon = SharedWarningIcon; // icon/warning 7613:8931
export const GhanaFlagIcon = ProfileGhanaFlagIcon; // icon/Ghana flag 7613:8935
export const CheckIcon = SharedCheckIcon; // selected check 7496:4976
export const SquiggleGoldIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="70"
    height="14"
    viewBox="0 0 70 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.33333 7C8.16667 0 12.8333 14 18.6667 7C24.5 0 29.1667 14 35 7C40.8333 0 45.5 14 51.3333 7C57.1667 0 61.8333 14 67.6667 7"
      stroke="#C8951A"
      strokeWidth="2.56667"
      strokeLinecap="round"
    />
  </svg>
); // doodle/squiggle 7499:6859
export const SquiggleGreenIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="50"
    height="10"
    viewBox="0 0 50 10"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1.66667 5C5.83333 0 9.16667 10 13.3333 5C17.5 0 20.8333 10 25 5C29.1667 0 32.5 10 36.6667 5C40.8333 0 44.1667 10 48.3333 5"
      stroke="#387440"
      strokeWidth="1.83333"
      strokeLinecap="round"
    />
  </svg>
); // doodle/squiggle 7499:6861
export const SparkleYellowIcon = ({ className = '', style }) => (
  <svg
    className={className}
    style={style}
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M13 1.625L15.8167 10.1833L24.375 13L15.8167 15.8167L13 24.375L10.1833 15.8167L1.625 13L10.1833 10.1833L13 1.625Z"
      fill="#FFD86B"
      stroke="#1C2A21"
      strokeWidth="1.51667"
      strokeLinejoin="round"
    />
  </svg>
); // doodle/sparkle 7499:6873 (exported via the Figma MCP asset server)
export const SparkleWhiteIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 1L9.73333 6.26667L15 8L9.73333 9.73333L8 15L6.26667 9.73333L1 8L6.26667 6.26667L8 1Z"
      fill="#FFFFFF"
      stroke="#1C2A21"
      strokeWidth="0.933333"
      strokeLinejoin="round"
    />
  </svg>
); // doodle/sparkle 7499:6875
export const SparkleSmallIcon = ({ className = '', style }) => (
  <svg
    style={style}
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 0.875L8.51667 5.48333L13.125 7L8.51667 8.51667L7 13.125L5.48333 8.51667L0.875 7L5.48333 5.48333L7 0.875Z"
      fill="#FFD86B"
      stroke="#1C2A21"
      strokeWidth="0.816667"
      strokeLinejoin="round"
    />
  </svg>
); // doodle/sparkle 7499:6877
