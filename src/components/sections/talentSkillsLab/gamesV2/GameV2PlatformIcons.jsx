/*
 * GameV2PlatformIcons — small icons of the Games v2 dialogs, the offline banner and the result card, exported from Figma
 * (Playful 9612:52761 warning, 9612:53598 hourglass, 9612:54422 refresh, 20-check-circle / 20-close, GV-10 / GV-11 / GV-12 chips).
 */

export const GameV2WarningIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M9.99967 3.33203L2.33301 16.2487H17.6663L9.99967 3.33203Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M9.99967 8.33203V12.082M9.99967 14.1654V14.1737M9.99967 3.33203L2.33301 16.2487H17.6663L9.99967 3.33203Z"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2HourglassIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M7.5 17.4987V15.4154L10 13.582L12.5 15.4154V17.4987H7.5Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5.83301 2.5H6.66634M6.66634 2.5H13.333M6.66634 2.5V5.41667C6.66634 5.93415 6.78682 6.44453 7.01825 6.90738C7.24968 7.37023 7.58569 7.77284 7.99967 8.08333L9.99967 9.58333L11.9997 8.08333C12.4137 7.77284 12.7497 7.37023 12.9811 6.90738C13.2125 6.44453 13.333 5.93415 13.333 5.41667V2.5M13.333 2.5H14.1663M5.83301 17.5H6.66634M6.66634 17.5H13.333M6.66634 17.5V14.5833C6.66634 14.0658 6.78682 13.5555 7.01825 13.0926C7.24968 12.6298 7.58569 12.2272 7.99967 11.9167L9.99967 10.4167L11.9997 11.9167C12.4137 12.2272 12.7497 12.6298 12.9811 13.0926C13.2125 13.5555 13.333 14.0658 13.333 14.5833V17.5M13.333 17.5H14.1663"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2RefreshIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M14.9997 8.99822C14.9847 10.3854 14.4895 11.7246 13.5983 12.7879C12.7072 13.8511 11.4751 14.5726 10.1118 14.8297C8.74853 15.0868 7.33829 14.8635 6.12111 14.1978C4.90392 13.5322 3.95502 12.4653 3.4359 11.1788C2.91678 9.89225 2.85951 8.46559 3.27386 7.1416C3.6882 5.81761 4.54855 4.67811 5.70847 3.91705C6.86838 3.15599 8.25619 2.82039 9.63569 2.96737C11.0152 3.11436 12.3011 3.73484 13.2747 4.72322M14.9997 2.99822V6.37322H11.6247"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2NoteCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M9.00039 2.24844C5.27247 2.24844 2.25039 5.27052 2.25039 8.99844C2.25039 12.7264 5.27247 15.7484 9.00039 15.7484C12.7283 15.7484 15.7504 12.7264 15.7504 8.99844C15.7504 5.27052 12.7283 2.24844 9.00039 2.24844ZM0.900391 8.99844C0.900391 4.52493 4.52688 0.898438 9.00039 0.898438C13.4739 0.898438 17.1004 4.52493 17.1004 8.99844C17.1004 13.4719 13.4739 17.0984 9.00039 17.0984C4.52688 17.0984 0.900391 13.4719 0.900391 8.99844ZM12.3381 5.98932C12.6331 6.21726 12.6875 6.64118 12.4595 6.93616L8.63451 11.8862C8.51211 12.0446 8.32571 12.1405 8.12567 12.148C7.92563 12.1555 7.73258 12.0738 7.59867 11.925L5.57367 9.67499C5.32428 9.39789 5.34675 8.9711 5.62384 8.72171C5.90093 8.47233 6.32773 8.49479 6.57711 8.77188L8.06093 10.4206L11.3913 6.11071C11.6192 5.81573 12.0431 5.76138 12.3381 5.98932Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const GameV2CloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M4.6977 4.6977C4.96131 4.4341 5.38869 4.4341 5.6523 4.6977L9 8.04541L12.3477 4.6977C12.6113 4.4341 13.0387 4.4341 13.3023 4.6977C13.5659 4.96131 13.5659 5.38869 13.3023 5.6523L9.95459 9L13.3023 12.3477C13.5659 12.6113 13.5659 13.0387 13.3023 13.3023C13.0387 13.5659 12.6113 13.5659 12.3477 13.3023L9 9.95459L5.6523 13.3023C5.38869 13.5659 4.96131 13.5659 4.6977 13.3023C4.4341 13.0387 4.4341 12.6113 4.6977 12.3477L8.04541 9L4.6977 5.6523C4.4341 5.38869 4.4341 4.96131 4.6977 4.6977Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const GameV2ShieldIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M9 2.25L14.625 4.5V8.625C14.625 12.075 12.225 14.85 9 15.75C5.775 14.85 3.375 12.075 3.375 8.625V4.5L9 2.25Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M9 2.25L14.625 4.5V8.625C14.625 12.075 12.225 14.85 9 15.75C5.775 14.85 3.375 12.075 3.375 8.625V4.5L9 2.25Z"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2TrophyChipIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M4.33301 2.16797H8.66634V4.8763C8.66634 5.45094 8.43807 6.00204 8.03174 6.40837C7.62541 6.8147 7.07431 7.04297 6.49967 7.04297C5.92504 7.04297 5.37394 6.8147 4.96761 6.40837C4.56128 6.00204 4.33301 5.45094 4.33301 4.8763V2.16797Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M8.66649 3.2513V2.16797H4.33316V3.2513M8.66649 3.2513V4.8763C8.66649 5.45094 8.43822 6.00204 8.03189 6.40837C7.62556 6.8147 7.07446 7.04297 6.49982 7.04297M8.66649 3.2513H10.2915C10.3813 3.50396 10.4072 3.77493 10.3669 4.04004C10.3266 4.30515 10.2213 4.55616 10.0604 4.77068C9.89949 4.98521 9.68801 5.15658 9.4448 5.26953C9.20158 5.38247 8.9342 5.43346 8.66649 5.41797M6.49982 7.04297C5.92519 7.04297 5.37409 6.8147 4.96776 6.40837C4.56143 6.00204 4.33316 5.45094 4.33316 4.8763V3.2513M6.49982 7.04297V9.20964M4.33316 3.2513H2.70816C2.61832 3.50396 2.59241 3.77493 2.63274 4.04004C2.67306 4.30515 2.77836 4.55616 2.93926 4.77068C3.10015 4.98521 3.31164 5.15658 3.55485 5.26953C3.79806 5.38247 4.06545 5.43346 4.33316 5.41797M6.49982 9.20964H5.14566V11.1055H7.85399V9.20964H6.49982Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2StarChipIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M6.49967 1.89453L7.90801 4.76536L11.1038 5.25286L8.80176 7.4737L9.34342 10.6154L6.49967 9.15286L3.65592 10.6154L4.19759 7.4737L1.89551 5.25286L5.09134 4.76536L6.49967 1.89453Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.49967 1.89453L7.90801 4.76536L11.1038 5.25286L8.80176 7.4737L9.34342 10.6154L6.49967 9.15286L3.65592 10.6154L4.19759 7.4737L1.89551 5.25286L5.09134 4.76536L6.49967 1.89453Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2TrendChipIcon = ({ className = '' }) => (
  <svg viewBox="0 0 13 13" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M1.625 9.20964L4.875 5.95964L7.04167 8.1263L11.375 3.79297V10.8346H1.625V9.20964Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M1.625 9.20964L4.875 5.95964L7.04167 8.1263L11.375 3.79297M11.375 7.04297V3.79297H8.125"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2InfoIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M8 7.33255V10.9992M8 5.19922V5.33255"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2CashIcon = ({ className = '' }) => (
  <svg viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M13.0001 16.0315C14.6754 16.0315 16.0335 14.6734 16.0335 12.9982C16.0335 11.3229 14.6754 9.96484 13.0001 9.96484C11.3249 9.96484 9.9668 11.3229 9.9668 12.9982C9.9668 14.6734 11.3249 16.0315 13.0001 16.0315Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5.41732 6.5H20.584C22.0798 6.5 23.2923 7.71256 23.2923 9.20833V16.7917C23.2923 18.2874 22.0798 19.5 20.584 19.5H5.41732C3.92155 19.5 2.70898 18.2874 2.70898 16.7917V9.20833C2.70898 7.71256 3.92155 6.5 5.41732 6.5Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.0335 12.9982C16.0335 14.6734 14.6754 16.0315 13.0001 16.0315C11.3249 16.0315 9.9668 14.6734 9.9668 12.9982C9.9668 11.3229 11.3249 9.96484 13.0001 9.96484C14.6754 9.96484 16.0335 11.3229 16.0335 12.9982Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.5 10.293V10.3038M19.5 15.7096V15.7205"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2GridIcon = ({ className = '' }) => (
  <svg viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M10.2913 4.33203H5.95801C5.06055 4.33203 4.33301 5.05957 4.33301 5.95703V10.2904C4.33301 11.1878 5.06055 11.9154 5.95801 11.9154H10.2913C11.1888 11.9154 11.9163 11.1878 11.9163 10.2904V5.95703C11.9163 5.05957 11.1888 4.33203 10.2913 4.33203Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5.95801 4.33203H10.2913C11.1888 4.33203 11.9163 5.05957 11.9163 5.95703V10.2904C11.9163 11.1878 11.1888 11.9154 10.2913 11.9154H5.95801C5.06055 11.9154 4.33301 11.1878 4.33301 10.2904V5.95703C4.33301 5.05957 5.06055 4.33203 5.95801 4.33203Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M15.708 4.33203H20.0413C20.9388 4.33203 21.6663 5.05957 21.6663 5.95703V10.2904C21.6663 11.1878 20.9388 11.9154 20.0413 11.9154H15.708C14.8105 11.9154 14.083 11.1878 14.083 10.2904V5.95703C14.083 5.05957 14.8105 4.33203 15.708 4.33203Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5.95801 14.082H10.2913C11.1888 14.082 11.9163 14.8096 11.9163 15.707V20.0404C11.9163 20.9378 11.1888 21.6654 10.2913 21.6654H5.95801C5.06055 21.6654 4.33301 20.9378 4.33301 20.0404V15.707C4.33301 14.8096 5.06055 14.082 5.95801 14.082Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M15.708 14.082H20.0413C20.9388 14.082 21.6663 14.8096 21.6663 15.707V20.0404C21.6663 20.9378 20.9388 21.6654 20.0413 21.6654H15.708C14.8105 21.6654 14.083 20.9378 14.083 20.0404V15.707C14.083 14.8096 14.8105 14.082 15.708 14.082Z"
      strokeWidth="1.95"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2FeedbackCheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5.3335 8.1987L7.20016 10.0654L11.0002 6.33203"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2FeedbackCloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M4.3335 4.33203L8.00016 7.9987M8.00016 7.9987L11.6668 11.6654M8.00016 7.9987L11.6668 4.33203M8.00016 7.9987L4.3335 11.6654"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const GameV2CheckCircleSmIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false" className={className}>
    <g clipPath="url(#GameV2CheckCircleSmIcon-clip0_9612_50934)">
      <path
        d="M7.0002 1.74922C4.1007 1.74922 1.7502 4.09972 1.7502 6.99922C1.7502 9.89871 4.1007 12.2492 7.0002 12.2492C9.89969 12.2492 12.2502 9.89871 12.2502 6.99922C12.2502 4.09972 9.89969 1.74922 7.0002 1.74922ZM0.700195 6.99922C0.700195 3.51982 3.5208 0.699219 7.0002 0.699219C10.4796 0.699219 13.3002 3.51982 13.3002 6.99922C13.3002 10.4786 10.4796 13.2992 7.0002 13.2992C3.5208 13.2992 0.700195 10.4786 0.700195 6.99922ZM9.59621 4.65879C9.82564 4.83608 9.86791 5.1658 9.69062 5.39523L6.71562 9.24523C6.62042 9.36843 6.47545 9.44302 6.31986 9.44885C6.16427 9.45468 6.01412 9.39115 5.90997 9.27542L4.33497 7.52542C4.141 7.30991 4.15847 6.97795 4.37399 6.78399C4.58951 6.59002 4.92146 6.60749 5.11543 6.82301L6.2695 8.10532L8.85977 4.75321C9.03706 4.52378 9.36677 4.48151 9.59621 4.65879Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="GameV2CheckCircleSmIcon-clip0_9612_50934">
        <rect width="14" height="14" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);
