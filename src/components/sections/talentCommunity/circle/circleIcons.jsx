import { classNames } from '../../../../utils/classNames.js';

/* Circle icons: Figma `gth-icon/*` exports (svg, colours -> currentColor; duotone fills keep their .22 opacity). */

export const CircleBellIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4 10.9987V7.33203C4 6.27117 4.42143 5.25375 5.17157 4.5036C5.92172 3.75346 6.93913 3.33203 8 3.33203C9.06087 3.33203 10.0783 3.75346 10.8284 4.5036C11.5786 5.25375 12 6.27117 12 7.33203V10.9987L13 12.332H3L4 10.9987Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.66667 13.9987H9.33333M4 10.9987V7.33203C4 6.27117 4.42143 5.25375 5.17157 4.5036C5.92172 3.75346 6.93913 3.33203 8 3.33203C9.06087 3.33203 10.0783 3.75346 10.8284 4.5036C11.5786 5.25375 12 6.27117 12 7.33203V10.9987L13 12.332H3L4 10.9987Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleBriefcaseIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M1.5 4.75C1.5 4.41848 1.6317 4.10054 1.86612 3.86612C2.10054 3.6317 2.41848 3.5 2.75 3.5H9.25C9.58152 3.5 9.89946 3.6317 10.1339 3.86612C10.3683 4.10054 10.5 4.41848 10.5 4.75V6.25H1.5V4.75Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M2.75 3.5H9.25C9.94036 3.5 10.5 4.05964 10.5 4.75V8.75C10.5 9.44036 9.94036 10 9.25 10H2.75C2.05964 10 1.5 9.44036 1.5 8.75V4.75C1.5 4.05964 2.05964 3.5 2.75 3.5Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.5 3.5V2.75C4.5 2.55109 4.57902 2.36032 4.71967 2.21967C4.86032 2.07902 5.05109 2 5.25 2H6.75C6.94891 2 7.13968 2.07902 7.28033 2.21967C7.42098 2.36032 7.5 2.55109 7.5 2.75V3.5M1.5 6.25H10.5"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleCheckIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M3.33301 8.33464L6.13301 11.1346L12.6663 4.66797"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleChevronRightIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M5.14551 3.25L8.39551 6.5L5.14551 9.75"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleCloseIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M3.25 3.25L6 6M6 6L8.75 8.75M6 6L8.75 3.25M6 6L3.25 8.75"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleCodeIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4.25 3.5L1.75 6L4.25 8.5M7.75 3.5L10.25 6L7.75 8.5M6.75 2.25L5.25 9.75"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleCommentIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M2.6665 4.33464C2.6665 3.89261 2.8421 3.46868 3.15466 3.15612C3.46722 2.84356 3.89114 2.66797 4.33317 2.66797H11.6665C12.1085 2.66797 12.5325 2.84356 12.845 3.15612C13.1576 3.46868 13.3332 3.89261 13.3332 4.33464V9.66797C13.3332 10.11 13.1576 10.5339 12.845 10.8465C12.5325 11.159 12.1085 11.3346 11.6665 11.3346H6.6665L3.6665 13.668V11.3346C3.40129 11.3346 3.14693 11.2293 2.9594 11.0417C2.77186 10.8542 2.6665 10.5999 2.6665 10.3346V4.33464Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5.33317 6.0013H10.6665M5.33317 8.33464H8.6665M2.6665 4.33464C2.6665 3.89261 2.8421 3.46868 3.15466 3.15612C3.46722 2.84356 3.89114 2.66797 4.33317 2.66797H11.6665C12.1085 2.66797 12.5325 2.84356 12.845 3.15612C13.1576 3.46868 13.3332 3.89261 13.3332 4.33464V9.66797C13.3332 10.11 13.1576 10.5339 12.845 10.8465C12.5325 11.159 12.1085 11.3346 11.6665 11.3346H6.6665L3.6665 13.668V11.3346C3.40129 11.3346 3.14693 11.2293 2.9594 11.0417C2.77186 10.8542 2.6665 10.5999 2.6665 10.3346V4.33464Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleEyeIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M1.66602 8.0013C1.66602 8.0013 3.99935 3.66797 7.99935 3.66797C11.9993 3.66797 14.3327 8.0013 14.3327 8.0013C14.3327 8.0013 11.9993 12.3346 7.99935 12.3346C3.99935 12.3346 1.66602 8.0013 1.66602 8.0013Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleGlobeIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M6.0001 1.5C7.2501 2.8 7.9001 4.3 7.9001 6C7.9001 7.7 7.2501 9.2 6.0001 10.5C4.7501 9.2 4.1001 7.7 4.1001 6C4.1001 4.3 4.7501 2.8 6.0001 1.5Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M1.5 6H4.1M4.1 6H7.9M4.1 6C4.1 7.7 4.75 9.2 6 10.5C7.25 9.2 7.9 7.7 7.9 6M4.1 6C4.1 4.3 4.75 2.8 6 1.5C7.25 2.8 7.9 4.3 7.9 6M7.9 6H10.5"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleInfoIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
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

export const CircleLikeFilledIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4.66667 7H3.33333C3.14924 7 3 7.14924 3 7.33333V13C3 13.1841 3.14924 13.3333 3.33333 13.3333H4.66667C4.85076 13.3333 5 13.1841 5 13V7.33333C5 7.14924 4.85076 7 4.66667 7Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5 6.9995V13.1328M5 6.9995H3V13.3328H5V13.1328M5 6.9995L7.4 2.86616C8 2.53283 9 2.86616 9 3.93283V6.33283H12.0667C12.2666 6.32878 12.465 6.36978 12.6469 6.45278C12.8289 6.53578 12.9899 6.65865 13.118 6.81231C13.246 6.96597 13.3378 7.14647 13.3867 7.34043C13.4355 7.5344 13.44 7.73686 13.4 7.93283L12.5333 12.0662C12.471 12.3719 12.3034 12.646 12.0598 12.8409C11.8162 13.0358 11.5119 13.1391 11.2 13.1328H5"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleLikeIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4.66667 7H3.33333C3.14924 7 3 7.14924 3 7.33333V13C3 13.1841 3.14924 13.3333 3.33333 13.3333H4.66667C4.85076 13.3333 5 13.1841 5 13V7.33333C5 7.14924 4.85076 7 4.66667 7Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5 6.9995V13.1328M5 6.9995H3V13.3328H5V13.1328M5 6.9995L7.4 2.86616C8 2.53283 9 2.86616 9 3.93283V6.33283H12.0667C12.2666 6.32878 12.465 6.36978 12.6469 6.45278C12.8289 6.53578 12.9899 6.65865 13.118 6.81231C13.246 6.96597 13.3378 7.14647 13.3867 7.34043C13.4355 7.5344 13.44 7.73686 13.4 7.93283L12.5333 12.0662C12.471 12.3719 12.3034 12.646 12.0598 12.8409C11.8162 13.0358 11.5119 13.1391 11.2 13.1328H5"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleLinkIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M8.33402 11.6674C8.64418 11.9823 9.01389 12.2324 9.42163 12.4031C9.82936 12.5739 10.267 12.6618 10.709 12.6618C11.1511 12.6618 11.5887 12.5739 11.9964 12.4031C12.4041 12.2324 12.7739 11.9823 13.084 11.6674L15.584 9.16735C16.2139 8.53746 16.5678 7.68315 16.5678 6.79235C16.5678 5.90155 16.2139 5.04724 15.584 4.41735C14.9541 3.78746 14.0998 3.43359 13.209 3.43359C12.3182 3.43359 11.4639 3.78746 10.834 4.41735L10.0007 5.25068M11.6674 8.33402C11.3572 8.01907 10.9875 7.76895 10.5797 7.59823C10.172 7.42751 9.73439 7.33959 9.29235 7.33959C8.85032 7.33959 8.4127 7.42751 8.00496 7.59823C7.59722 7.76895 7.22751 8.01907 6.91735 8.33402L4.41735 10.834C3.78746 11.4639 3.43359 12.3182 3.43359 13.209C3.43359 14.0998 3.78746 14.9541 4.41735 15.584C5.04724 16.2139 5.90155 16.5678 6.79235 16.5678C7.68315 16.5678 8.53746 16.2139 9.16735 15.584L10.0007 14.7507"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleLockIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M9.62435 6.125H4.37435C3.56893 6.125 2.91602 6.77792 2.91602 7.58333V10.5C2.91602 11.3054 3.56893 11.9583 4.37435 11.9583H9.62435C10.4298 11.9583 11.0827 11.3054 11.0827 10.5V7.58333C11.0827 6.77792 10.4298 6.125 9.62435 6.125Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M4.37435 6.125H9.62435C10.4298 6.125 11.0827 6.77792 11.0827 7.58333V10.5C11.0827 11.3054 10.4298 11.9583 9.62435 11.9583H4.37435C3.56893 11.9583 2.91602 11.3054 2.91602 10.5V7.58333C2.91602 6.77792 3.56893 6.125 4.37435 6.125Z"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.66602 6.1263V4.3763C4.66602 3.75746 4.91185 3.16397 5.34943 2.72639C5.78702 2.2888 6.38051 2.04297 6.99935 2.04297C7.61819 2.04297 8.21168 2.2888 8.64926 2.72639C9.08685 3.16397 9.33268 3.75746 9.33268 4.3763V6.1263M6.99935 8.45964V9.91797"
      strokeWidth="1.05"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleMoreIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4 8H4.00667M8 8H8.00667M12 8H12.0067"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleMortarboardIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path d="M1.25 4.5L6 2.25L10.75 4.5L6 6.75L1.25 4.5Z" fill="currentColor" fillOpacity="0.22" />
    <path
      d="M10.75 4.5L6 2.25L1.25 4.5L6 6.75L10.75 4.5ZM10.75 4.5V7M3.25 5.5V7.75C3.25 8.55 4.5 9.25 6 9.25C7.5 9.25 8.75 8.55 8.75 7.75V5.5"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleSearchIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M7.33333 11.6667C9.72657 11.6667 11.6667 9.72657 11.6667 7.33333C11.6667 4.9401 9.72657 3 7.33333 3C4.9401 3 3 4.9401 3 7.33333C3 9.72657 4.9401 11.6667 7.33333 11.6667Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M11.6667 7.33333C11.6667 9.72657 9.72657 11.6667 7.33333 11.6667C4.9401 11.6667 3 9.72657 3 7.33333C3 4.9401 4.9401 3 7.33333 3C9.72657 3 11.6667 4.9401 11.6667 7.33333Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M10.6665 10.668L13.6665 13.668"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleShieldIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M8 2L13 4V7.66667C13 10.7333 10.8667 13.2 8 14C5.13333 13.2 3 10.7333 3 7.66667V4L8 2Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M8 2L13 4V7.66667C13 10.7333 10.8667 13.2 8 14C5.13333 13.2 3 10.7333 3 7.66667V4L8 2Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleSparkleIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M6 1.5L6.9 4.1L9.5 5L6.9 5.9L6 8.5L5.1 5.9L2.5 5L5.1 4.1L6 1.5Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6 1.5L6.9 4.1L9.5 5L6.9 5.9L6 8.5L5.1 5.9L2.5 5L5.1 4.1L6 1.5ZM9.5 7.75L9.85 8.65L10.75 9L9.85 9.35L9.5 10.25L9.15 9.35L8.25 9L9.15 8.65L9.5 7.75Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleStarIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M6 1.75L7.3 4.4L10.25 4.85L8.125 6.9L8.625 9.8L6 8.45L3.375 9.8L3.875 6.9L1.75 4.85L4.7 4.4L6 1.75Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6 1.75L7.3 4.4L10.25 4.85L8.125 6.9L8.625 9.8L6 8.45L3.375 9.8L3.875 6.9L1.75 4.85L4.7 4.4L6 1.75Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleSwitchCircleIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 18 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M7.50023 10.5002C7.77937 10.7837 8.11211 11.0088 8.47907 11.1624C8.84604 11.3161 9.23989 11.3952 9.63773 11.3952C10.0356 11.3952 10.4294 11.3161 10.7964 11.1624C11.1633 11.0088 11.4961 10.7837 11.7752 10.5002L14.0252 8.25023C14.5921 7.68332 14.9106 6.91444 14.9106 6.11272C14.9106 5.31101 14.5921 4.54213 14.0252 3.97523C13.4583 3.40832 12.6894 3.08984 11.8877 3.08984C11.086 3.08984 10.3171 3.40833 9.75023 3.97523L9.00023 4.72523M10.5002 7.50023C10.2211 7.21677 9.88834 6.99167 9.52138 6.83802C9.15441 6.68437 8.76056 6.60524 8.36272 6.60524C7.96489 6.60524 7.57104 6.68437 7.20407 6.83802C6.83711 6.99167 6.50437 7.21677 6.22523 7.50023L3.97523 9.75023C3.40833 10.3171 3.08984 11.086 3.08984 11.8877C3.08984 12.6894 3.40832 13.4583 3.97523 14.0252C4.54213 14.5921 5.31101 14.9106 6.11272 14.9106C6.91444 14.9106 7.68332 14.5921 8.25023 14.0252L9.00023 13.2752"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleSwitchCommunitiesIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 18 19"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M12 15.75V14.25C12 13.4544 11.6839 12.6913 11.1213 12.1287C10.5587 11.5661 9.79565 11.25 9 11.25H4.5C3.70435 11.25 2.94129 11.5661 2.37868 12.1287C1.81607 12.6913 1.5 13.4544 1.5 14.25V15.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9.75 5.25C9.75 6.90685 8.40685 8.25 6.75 8.25C5.09315 8.25 3.75 6.90685 3.75 5.25C3.75 3.59315 5.09315 2.25 6.75 2.25C8.40685 2.25 9.75 3.59315 9.75 5.25Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.5 15.7502V14.2502C16.4995 13.5855 16.2783 12.9397 15.871 12.4144C15.4638 11.889 14.8936 11.5138 14.25 11.3477"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M12 2.34766C12.6453 2.51288 13.2173 2.88818 13.6257 3.41439C14.0342 3.9406 14.2559 4.58778 14.2559 5.25391C14.2559 5.92003 14.0342 6.56722 13.6257 7.09342C13.2173 7.61963 12.6453 7.99493 12 8.16016"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleTrophyIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M9.33398 4.66797H18.6673V10.5013C18.6673 11.739 18.1757 12.926 17.3005 13.8011C16.4253 14.6763 15.2383 15.168 14.0007 15.168C12.763 15.168 11.576 14.6763 10.7008 13.8011C9.82565 12.926 9.33398 11.739 9.33398 10.5013V4.66797Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M18.6664 7.0013V4.66797H9.3331V7.0013M18.6664 7.0013V10.5013C18.6664 11.739 18.1748 12.926 17.2996 13.8011C16.4244 14.6763 15.2374 15.168 13.9998 15.168M18.6664 7.0013H22.1664C22.3599 7.5455 22.4157 8.12912 22.3289 8.70012C22.242 9.27113 22.0152 9.81176 21.6687 10.2738C21.3221 10.7359 20.8666 11.105 20.3428 11.3482C19.8189 11.5915 19.243 11.7013 18.6664 11.668M13.9998 15.168C12.7621 15.168 11.5751 14.6763 10.6999 13.8011C9.82477 12.926 9.3331 11.739 9.3331 10.5013V7.0013M13.9998 15.168V19.8346M9.3331 7.0013H5.8331C5.63961 7.5455 5.58381 8.12912 5.67066 8.70012C5.75751 9.27113 5.98432 9.81176 6.33086 10.2738C6.6774 10.7359 7.1329 11.105 7.65675 11.3482C8.18059 11.5915 8.7565 11.7013 9.3331 11.668M13.9998 19.8346H11.0831V23.918H16.9164V19.8346H13.9998Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleUserIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M7.99967 8.0013C9.47243 8.0013 10.6663 6.80739 10.6663 5.33464C10.6663 3.86188 9.47243 2.66797 7.99967 2.66797C6.52692 2.66797 5.33301 3.86188 5.33301 5.33464C5.33301 6.80739 6.52692 8.0013 7.99967 8.0013Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M10.6673 5.33464C10.6673 6.80739 9.47341 8.0013 8.00065 8.0013C6.52789 8.0013 5.33398 6.80739 5.33398 5.33464C5.33398 3.86188 6.52789 2.66797 8.00065 2.66797C9.47341 2.66797 10.6673 3.86188 10.6673 5.33464Z"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M2.66699 13.6693C2.66699 11.0026 5.06699 9.33594 8.00033 9.33594C10.9337 9.33594 13.3337 11.0026 13.3337 13.6693"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleUsersIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M4.5 5.75C5.4665 5.75 6.25 4.9665 6.25 4C6.25 3.0335 5.4665 2.25 4.5 2.25C3.5335 2.25 2.75 3.0335 2.75 4C2.75 4.9665 3.5335 5.75 4.5 5.75Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.25 4C6.25 4.9665 5.4665 5.75 4.5 5.75C3.5335 5.75 2.75 4.9665 2.75 4C2.75 3.0335 3.5335 2.25 4.5 2.25C5.4665 2.25 6.25 3.0335 6.25 4Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M1.25 10C1.25 8.2 2.7 7 4.5 7C6.3 7 7.75 8.2 7.75 10"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M9.75 4.5C9.75 5.19036 9.19036 5.75 8.5 5.75C7.80964 5.75 7.25 5.19036 7.25 4.5C7.25 3.80964 7.80964 3.25 8.5 3.25C9.19036 3.25 9.75 3.80964 9.75 4.5Z"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M8.75 7C9.95 7.1 10.75 7.95 10.75 9.25"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const CircleVerifiedIcon = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 13 13"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={classNames('block shrink-0', className)}
    {...rest}
  >
    <path
      d="M6.50023 1.51562L7.74606 2.43646L9.26273 2.32813L9.75023 3.79063L10.9961 4.65729L10.5086 6.11979L10.9961 7.58229L9.75023 8.44896L9.26273 9.91146L7.74606 9.80313L6.50023 11.4823L5.2544 10.5615L3.73773 10.6698L3.25023 9.20729L2.00439 8.34062L2.49189 6.87813L2.00439 5.41563L3.25023 3.73646L3.73773 2.27396L5.2544 2.38229L6.50023 1.51562Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.50023 1.51562L7.74606 2.43646L9.26273 2.32813L9.75023 3.79062L10.9961 4.65729L10.5086 6.11979L10.9961 7.58229L9.75023 8.44896L9.26273 9.91146L7.74606 9.80313L6.50023 11.4823L5.2544 10.5615L3.73773 10.6698L3.25023 9.20729L2.00439 8.34062L2.49189 6.87812L2.00439 5.41563L3.25023 3.73646L3.73773 2.27396L5.2544 2.38229L6.50023 1.51562Z"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M4.76709 6.60573L5.95876 7.7974L8.23376 5.41406"
      strokeWidth="0.975"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);
