import { classNames } from '../../../utils/classNames.js';

/*
 * Talent Messages — package A icons, exported from Figma (GTH icon/* instances) via the local Figma MCP asset server.
 * Single-colour glyphs: stroke/fill are `currentColor`; the Figma colour is applied where each icon is used.
 */

export const MsgUserIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3C10.6569 3 12 4.34315 12 6Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M3 15.75C3 14.1587 3.63214 12.6326 4.75736 11.5074C5.88258 10.3821 7.4087 9.75 9 9.75C10.5913 9.75 12.1174 10.3821 13.2426 11.5074C14.3679 12.6326 15 14.1587 15 15.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgMuteIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M10.275 15.75C10.1405 15.9671 9.95276 16.1462 9.72964 16.2704C9.50651 16.3946 9.25537 16.4598 9 16.4598C8.74463 16.4598 8.49349 16.3946 8.27036 16.2704C8.04724 16.1462 7.85953 15.9671 7.725 15.75M13.95 9.75C13.624 8.52745 13.4725 7.26496 13.5 6C13.4985 5.18835 13.2775 4.39222 12.8605 3.69592C12.4434 2.99963 11.8458 2.42909 11.1309 2.04475C10.416 1.66041 9.61052 1.47656 8.79967 1.5127C7.98883 1.54883 7.20286 1.80359 6.525 2.25M4.725 4.725C4.58893 5.13693 4.51315 5.56638 4.5 6C4.5 11.25 2.25 12.75 2.25 12.75H12.75M4.725 4.725L1.5 1.5M4.725 4.725L12.75 12.75M12.75 12.75L16.5 16.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgArchiveIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2.25 2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V5.25C16.5 5.66421 16.1642 6 15.75 6H2.25C1.83579 6 1.5 5.66421 1.5 5.25V3C1.5 2.58579 1.83579 2.25 2.25 2.25Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M3 6V14.25C3 14.6478 3.15804 15.0294 3.43934 15.3107C3.72064 15.592 4.10218 15.75 4.5 15.75H13.5C13.8978 15.75 14.2794 15.592 14.5607 15.3107C14.842 15.0294 15 14.6478 15 14.25V6M7.5 9H10.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgFlagIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M0.50189 16.5122V11.2622M0.50189 11.2622V3.01224C0.50189 3.01224 1.25189 2.26224 3.50189 2.26224C5.75189 2.26224 7.25189 3.76224 9.50189 3.76224C11.7519 3.76224 12.5019 3.01224 12.5019 3.01224V11.2622C12.5019 11.2622 11.7519 12.0122 9.50189 12.0122C7.25189 12.0122 5.75189 10.5122 3.50189 10.5122C1.25189 10.5122 0.50189 11.2622 0.50189 11.2622Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgBanIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M15.5 9.2998C15.5 13.4419 12.1421 16.7998 8 16.7998C3.85786 16.7998 0.5 13.4419 0.5 9.2998C0.5 5.15767 3.85786 1.7998 8 1.7998C12.1421 1.7998 15.5 5.15767 15.5 9.2998Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M2.6748 3.97461L13.3248 14.6246"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgTrashIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M0 4.5H1.5M1.5 4.5H3.75M1.5 4.5L2.25 15H11.25L12 4.5M3.75 4.5H9.75M3.75 4.5V3H9.75V4.5M9.75 4.5H12M12 4.5H13.5"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgInfoIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9 12V9M9 6H9.0075"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgShieldIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9 16.5C9 16.5 15 13.5 15 9V3.75L9 1.5L3 3.75V9C3 13.5 9 16.5 9 16.5Z"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.75 9L8.25 10.5L11.25 7.5"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgWifiOffIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3.75 9.45C4.78082 8.43959 6.07272 7.75598 7.46484 7.46484M7.46484 7.46484C7.96607 7.36002 8.48029 7.30607 9 7.30607C10.9631 7.30607 12.848 8.0758 14.25 9.45M7.46484 7.46484L1.5 1.5M7.46484 7.46484L16.5 16.5M6.375 12C7.07598 11.3129 8.01843 10.928 9 10.928C9.98157 10.928 10.924 11.3129 11.625 12M9 15H9.0075"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgAlertIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12.8333 7C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77834 12.8333 1.16667 10.2217 1.16667 7C1.16667 3.77834 3.77834 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77834 12.8333 7Z"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7 4.66667V7M7 9.33333H7.00583"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgLockIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M5.5 10.0833H16.5C17.5125 10.0833 18.3333 10.9041 18.3333 11.9167V17.4167C18.3333 18.4292 17.5125 19.25 16.5 19.25H5.5C4.48748 19.25 3.66667 18.4292 3.66667 17.4167V11.9167C3.66667 10.9041 4.48748 10.0833 5.5 10.0833Z"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7.33333 10.0833V6.41667C7.33333 5.44421 7.71964 4.51157 8.40727 3.82394C9.09491 3.13631 10.0275 2.75 11 2.75C11.9725 2.75 12.9051 3.13631 13.5927 3.82394C14.2804 4.51157 14.6667 5.44421 14.6667 6.41667V10.0833"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgSearchIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M14.1667 14.1667L17.5 17.5"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667Z"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgMeatballIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="20.25"
    height="3.75"
    viewBox="0 0 20.25 3.75"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M1.875 3C2.49632 3 3 2.49632 3 1.875C3 1.25368 2.49632 0.75 1.875 0.75C1.25368 0.75 0.75 1.25368 0.75 1.875C0.75 2.49632 1.25368 3 1.875 3Z"
      fill="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10.125 3C10.7463 3 11.25 2.49632 11.25 1.875C11.25 1.25368 10.7463 0.75 10.125 0.75C9.50368 0.75 9 1.25368 9 1.875C9 2.49632 9.50368 3 10.125 3Z"
      fill="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M18.375 3C18.9963 3 19.5 2.49632 19.5 1.875C19.5 1.25368 18.9963 0.75 18.375 0.75C17.7537 0.75 17.25 1.25368 17.25 1.875C17.25 2.49632 17.7537 3 18.375 3Z"
      fill="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MsgCheckIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="8.8"
    height="8.8"
    viewBox="0 0 8.8 8.8"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7.33333 2.2L3.3 6.23333L1.46667 4.4"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="white"
    />
  </svg>
);

export const MsgSendIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="13"
    height="12"
    viewBox="37 27 14 13"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        id="msgSendGlyph"
        x1="50.5"
        y1="27.5"
        x2="40.8775"
        y2="41.7765"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FEF1E7" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
    <path
      d="M38.4697 27.5653C37.9481 27.3254 37.375 27.7844 37.524 28.3223L38.616 32.2518C38.6433 32.3506 38.7002 32.4394 38.7796 32.5073C38.8589 32.5752 38.9572 32.6191 39.0623 32.6337L44.4161 33.3702C44.5711 33.3911 44.5711 33.6071 44.4161 33.6284L39.0629 34.3645C38.9578 34.379 38.8595 34.423 38.7801 34.4908C38.7008 34.5587 38.6439 34.6476 38.6165 34.7463L37.524 38.678C37.375 39.2153 37.9481 39.6743 38.4697 39.4349L50.1145 34.0885C50.6285 33.8528 50.6285 33.1475 50.1145 32.9112L38.4697 27.5653Z"
      fill="url(#msgSendGlyph)"
    />
  </svg>
);

export const MsgStarIcon = ({ className }) => (
  <svg
    className={classNames('shrink-0', className)}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7.06497 1.76629C6.99934 1.73244 6.90327 1.75021 6.85534 1.85168L5.6056 4.49793C5.43351 4.86231 5.09465 5.1261 4.68968 5.1876L1.89515 5.61194C1.86457 5.61659 1.8323 5.63218 1.805 5.66145C1.73004 5.74181 1.73227 5.87881 1.80821 5.95617L3.83034 8.01598C4.11328 8.30419 4.23726 8.71246 4.1724 9.10763L3.69504 12.0161C3.68718 12.064 3.69497 12.1125 3.71536 12.153C3.76509 12.2519 3.86068 12.2679 3.92628 12.2318L6.42577 10.8586C6.78441 10.6616 7.2155 10.6616 7.57414 10.8586L10.0736 12.2318C10.1038 12.2484 10.136 12.2531 10.1664 12.2477C10.2105 12.2398 10.2587 12.2114 10.2939 12.1626C10.3278 12.1157 10.3394 12.0643 10.3322 12.0177L9.82749 9.10764C9.76263 8.71246 9.88663 8.30419 10.1696 8.01598L12.1917 5.95617C12.2198 5.92756 12.241 5.88672 12.2477 5.83861C12.2659 5.70828 12.1781 5.62307 12.1048 5.61194L9.31024 5.1876C8.90526 5.1261 8.5664 4.86231 8.39431 4.49793L7.14457 1.85168C7.12517 1.81062 7.09567 1.78213 7.06497 1.76629ZM5.9059 1.40329C6.1956 0.789871 6.9278 0.514123 7.54626 0.833091C7.78796 0.957749 7.97896 1.15967 8.09401 1.40329L9.34376 4.04953C9.37287 4.11117 9.42294 4.14267 9.46787 4.1495L12.2624 4.57384C12.944 4.67735 13.3793 5.32463 13.2877 5.98322C13.2507 6.24926 13.1304 6.49876 12.941 6.69175L10.9188 8.75156C10.8766 8.79464 10.852 8.86344 10.8634 8.93591L11.3681 11.8461C11.4806 12.5314 11.0006 13.1649 10.3516 13.2812C10.0826 13.3295 9.80677 13.2832 9.56805 13.1521L7.06855 11.7789C7.02478 11.7548 6.97513 11.7548 6.93136 11.7789L4.43187 13.1521C3.82222 13.487 3.08263 13.2317 2.77737 12.6249C2.6564 12.3844 2.61541 12.1111 2.6589 11.8461L3.13626 8.93758C3.14826 8.8645 3.12368 8.79497 3.08106 8.75156L1.05893 6.69175C0.588588 6.21264 0.579634 5.43576 1.03717 4.94525C1.22191 4.7472 1.46748 4.61485 1.73752 4.57384L4.53204 4.1495C4.57697 4.14267 4.62704 4.11117 4.65615 4.04953L5.9059 1.40329Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);
