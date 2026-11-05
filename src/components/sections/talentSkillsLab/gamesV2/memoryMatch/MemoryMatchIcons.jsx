/*
 * MemoryMatchIcons — the card faces of Memory Match, exported from Figma (the 'icon · …' duotone family: 22 % fill + stroke,
 * 48px cards; GV-04 star heart bolt bulb compass trophy pin book). The other seven (building cash chart target repeat trend grid)
 * are the same family exported from the GV-01 tiles — ⚠️ ASSUMPTION: only 8 faces are drawn (4×4); Advanced (10 pairs) and Expert
 * (15 pairs) need more, so they borrow these. All use currentColor so a card state can recolour them.
 */

export const MatchStarIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M24 7L29.2 17.6L41 19.4L32.5 27.6L34.5 39.2L24 33.8L13.5 39.2L15.5 27.6L7 19.4L18.8 17.6L24 7Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M24 7L29.2 17.6L41 19.4L32.5 27.6L34.5 39.2L24 33.8L13.5 39.2L15.5 27.6L7 19.4L18.8 17.6L24 7Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchHeartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M24 39.9994C24 39.9994 9 30.7994 9 19.5994C9.13929 17.9217 9.76794 16.3217 10.808 14.9979C11.8481 13.6741 13.2538 12.6846 14.851 12.1523C16.4481 11.6199 18.1663 11.568 19.7927 12.003C21.419 12.438 22.8819 13.3408 24 14.5994C25.1181 13.3408 26.581 12.438 28.2073 12.003C29.8337 11.568 31.5519 11.6199 33.149 12.1523C34.7462 12.6846 36.1519 13.6741 37.192 14.9979C38.2321 16.3217 38.8607 17.9217 39 19.5994C39 30.7994 24 39.9994 24 39.9994Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M24 39.9994C24 39.9994 9 30.7994 9 19.5994C9.13929 17.9217 9.76794 16.3217 10.808 14.9979C11.8481 13.6741 13.2538 12.6846 14.851 12.1523C16.4481 11.6199 18.1663 11.568 19.7927 12.003C21.419 12.438 22.8819 13.3408 24 14.5994C25.1181 13.3408 26.581 12.438 28.2073 12.003C29.8337 11.568 31.5519 11.6199 33.149 12.1523C34.7462 12.6846 36.1519 13.6741 37.192 14.9979C38.2321 16.3217 38.8607 17.9217 39 19.5994C39 30.7994 24 39.9994 24 39.9994Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchBoltIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path d="M26 5L10 27H22L20 43L36 21H24L26 5Z" fill="currentColor" fillOpacity="0.22" />
    <path
      d="M26 5L10 27H22L20 43L36 21H24L26 5Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchBulbIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M24 26C28.4183 26 32 22.4183 32 18C32 13.5817 28.4183 10 24 10C19.5817 10 16 13.5817 16 18C16 22.4183 19.5817 26 24 26Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M19 36H29M21 42H27M24 6C21.5145 6.01223 19.094 6.79601 17.073 8.24306C15.0521 9.69011 13.5303 11.729 12.718 14.0782C11.9057 16.4273 11.8429 18.9707 12.5383 21.3571C13.2337 23.7434 14.6529 25.855 16.6 27.4C18.2 28.8 19 30.2 19 32V33H29V32C29 30.2 29.8 28.8 31.4 27.4C33.3471 25.855 34.7664 23.7434 35.4618 21.3571C36.1572 18.9707 36.0944 16.4273 35.2821 14.0782C34.4698 11.729 32.948 9.69011 30.9271 8.24306C28.9061 6.79601 26.4856 6.01223 24 6Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchCompassIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path d="M31 17L27 27L17 31L21 21L31 17Z" fill="currentColor" fillOpacity="0.22" />
    <path
      d="M42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M31 17L27 27L17 31L21 21L31 17Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchTrophyIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M16 8H32V18C32 20.1217 31.1571 22.1566 29.6569 23.6569C28.1566 25.1571 26.1217 26 24 26C21.8783 26 19.8434 25.1571 18.3431 23.6569C16.8429 22.1566 16 20.1217 16 18V8Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M32 12V8H16V12M32 12V18C32 20.1217 31.1572 22.1566 29.6569 23.6569C28.1566 25.1571 26.1218 26 24 26M32 12H38C38.3317 12.9329 38.4274 13.9334 38.2785 14.9123C38.1296 15.8911 37.7408 16.8179 37.1467 17.61C36.5527 18.4021 35.7718 19.0349 34.8738 19.4519C33.9757 19.8689 32.9885 20.0572 32 20M24 26C21.8783 26 19.8435 25.1571 18.3432 23.6569C16.8429 22.1566 16 20.1217 16 18V12M24 26V34M16 12H10C9.66833 12.9329 9.57266 13.9334 9.72155 14.9123C9.87043 15.8911 10.2592 16.8179 10.8533 17.61C11.4474 18.4021 12.2283 19.0349 13.1263 19.4519C14.0243 19.8689 15.0116 20.0572 16 20M24 34H19V41H29V34H24Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchPinIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M24 42C24 42 11 30.8 11 20C11 16.5522 12.3696 13.2456 14.8076 10.8076C17.2456 8.36964 20.5522 7 24 7C27.4478 7 30.7544 8.36964 33.1924 10.8076C35.6304 13.2456 37 16.5522 37 20C37 30.8 24 42 24 42Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M24 42C24 42 11 30.8 11 20C11 16.5522 12.3696 13.2456 14.8076 10.8076C17.2456 8.36964 20.5522 7 24 7C27.4478 7 30.7544 8.36964 33.1924 10.8076C35.6304 13.2456 37 16.5522 37 20C37 30.8 24 42 24 42Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M29 20C29 22.7614 26.7614 25 24 25C21.2386 25 19 22.7614 19 20C19 17.2386 21.2386 15 24 15C26.7614 15 29 17.2386 29 20Z"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchBookIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M29 12H19C17.8954 12 17 12.8954 17 14V18C17 19.1046 17.8954 20 19 20H29C30.1046 20 31 19.1046 31 18V14C31 12.8954 30.1046 12 29 12Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M10 39V9C10 8.20435 10.3161 7.44129 10.8787 6.87868C11.4413 6.31607 12.2044 6 13 6H38V36H13C12.2044 36 11.4413 36.3161 10.8787 36.8787C10.3161 37.4413 10 38.2043 10 39ZM10 39C10 39.7957 10.3161 40.5587 10.8787 41.1213C11.4413 41.6839 12.2044 42 13 42H38"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchBuildingIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M17.5 11.668H21.5833C22.0475 11.668 22.4926 11.8523 22.8208 12.1805C23.149 12.5087 23.3333 12.9538 23.3333 13.418V24.5013H17.5V11.668Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M4.66663 24.5013V6.41797C4.66663 5.95384 4.851 5.50872 5.17919 5.18053C5.50738 4.85234 5.9525 4.66797 6.41663 4.66797H15.75C16.2141 4.66797 16.6592 4.85234 16.9874 5.18053C17.3156 5.50872 17.5 5.95384 17.5 6.41797V11.668M4.66663 24.5013H2.91663M4.66663 24.5013H17.5M17.5 11.668V24.5013M17.5 11.668H21.5833C22.0474 11.668 22.4925 11.8523 22.8207 12.1805C23.1489 12.5087 23.3333 12.9538 23.3333 13.418V24.5013M17.5 24.5013H23.3333M23.3333 24.5013H25.0833M9.33329 9.33464H12.8333M9.33329 14.0013H12.8333M9.33329 18.668H12.8333"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchCashIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M14 17.2677C15.8041 17.2677 17.2667 15.8052 17.2667 14.001C17.2667 12.1969 15.8041 10.7344 14 10.7344C12.1959 10.7344 10.7333 12.1969 10.7333 14.001C10.7333 15.8052 12.1959 17.2677 14 17.2677Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M5.83335 7H22.1667C23.7775 7 25.0834 8.30584 25.0834 9.91667V18.0833C25.0834 19.6942 23.7775 21 22.1667 21H5.83335C4.22252 21 2.91669 19.6942 2.91669 18.0833V9.91667C2.91669 8.30584 4.22252 7 5.83335 7Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M17.2667 14.001C17.2667 15.8052 15.8041 17.2677 14 17.2677C12.1959 17.2677 10.7333 15.8052 10.7333 14.001C10.7333 12.1969 12.1959 10.7344 14 10.7344C15.8041 10.7344 17.2667 12.1969 17.2667 14.001Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7 11.082V11.0937M21 16.9154V16.927"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchChartIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M14.5833 7H13.4167C12.7723 7 12.25 7.52233 12.25 8.16667V18.6667C12.25 19.311 12.7723 19.8333 13.4167 19.8333H14.5833C15.2277 19.8333 15.75 19.311 15.75 18.6667V8.16667C15.75 7.52233 15.2277 7 14.5833 7Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M4.66669 23.332H23.3334"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M7.58335 12.832H8.75002C9.39435 12.832 9.91669 13.3544 9.91669 13.9987V18.6654C9.91669 19.3097 9.39435 19.832 8.75002 19.832H7.58335C6.93902 19.832 6.41669 19.3097 6.41669 18.6654V13.9987C6.41669 13.3544 6.93902 12.832 7.58335 12.832Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M13.4167 7H14.5834C15.2277 7 15.7501 7.52233 15.7501 8.16667V18.6667C15.7501 19.311 15.2277 19.8333 14.5834 19.8333H13.4167C12.7724 19.8333 12.2501 19.311 12.2501 18.6667V8.16667C12.2501 7.52233 12.7724 7 13.4167 7Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M19.25 15.168H20.4167C21.061 15.168 21.5834 15.6903 21.5834 16.3346V18.668C21.5834 19.3123 21.061 19.8346 20.4167 19.8346H19.25C18.6057 19.8346 18.0834 19.3123 18.0834 18.668V16.3346C18.0834 15.6903 18.6057 15.168 19.25 15.168Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchTargetIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M14 20.0669C17.3505 20.0669 20.0667 17.3508 20.0667 14.0003C20.0667 10.6497 17.3505 7.93359 14 7.93359C10.6495 7.93359 7.93335 10.6497 7.93335 14.0003C7.93335 17.3508 10.6495 20.0669 14 20.0669Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M24.5 14C24.5 19.799 19.799 24.5 14 24.5C8.20101 24.5 3.5 19.799 3.5 14C3.5 8.20101 8.20101 3.5 14 3.5C19.799 3.5 24.5 8.20101 24.5 14Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M20.0667 14.0003C20.0667 17.3508 17.3505 20.0669 14 20.0669C10.6495 20.0669 7.93335 17.3508 7.93335 14.0003C7.93335 10.6497 10.6495 7.93359 14 7.93359C17.3505 7.93359 20.0667 10.6497 20.0667 14.0003Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M14 14H14.0117"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchRepeatIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M4.66663 12.8333V11.0833C4.66663 10.0004 5.09683 8.96175 5.86261 8.19598C6.62838 7.43021 7.66699 7 8.74996 7H22.1666M18.6666 10.5L22.1666 7L18.6666 3.5M23.3333 15.1667V16.9167C23.3333 17.9996 22.9031 19.0382 22.1373 19.804C21.3715 20.5698 20.3329 21 19.25 21H5.83329M9.33329 17.5L5.83329 21L9.33329 24.5"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchTrendIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M3.5 19.8346L10.5 12.8346L15.1667 17.5013L24.5 8.16797V23.3346H3.5V19.8346Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M3.5 19.8346L10.5 12.8346L15.1667 17.5013L24.5 8.16797M24.5 15.168V8.16797H17.5"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

export const MatchGridIcon = ({ className = '' }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M11.0834 4.66797H6.41669C5.45019 4.66797 4.66669 5.45147 4.66669 6.41797V11.0846C4.66669 12.0511 5.45019 12.8346 6.41669 12.8346H11.0834C12.0499 12.8346 12.8334 12.0511 12.8334 11.0846V6.41797C12.8334 5.45147 12.0499 4.66797 11.0834 4.66797Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M6.41669 4.66797H11.0834C12.0499 4.66797 12.8334 5.45147 12.8334 6.41797V11.0846C12.8334 12.0511 12.0499 12.8346 11.0834 12.8346H6.41669C5.45019 12.8346 4.66669 12.0511 4.66669 11.0846V6.41797C4.66669 5.45147 5.45019 4.66797 6.41669 4.66797Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.9167 4.66797H21.5834C22.5499 4.66797 23.3334 5.45147 23.3334 6.41797V11.0846C23.3334 12.0511 22.5499 12.8346 21.5834 12.8346H16.9167C15.9502 12.8346 15.1667 12.0511 15.1667 11.0846V6.41797C15.1667 5.45147 15.9502 4.66797 16.9167 4.66797Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M6.41669 15.168H11.0834C12.0499 15.168 12.8334 15.9515 12.8334 16.918V21.5846C12.8334 22.5511 12.0499 23.3346 11.0834 23.3346H6.41669C5.45019 23.3346 4.66669 22.5511 4.66669 21.5846V16.918C4.66669 15.9515 5.45019 15.168 6.41669 15.168Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M16.9167 15.168H21.5834C22.5499 15.168 23.3334 15.9515 23.3334 16.918V21.5846C23.3334 22.5511 22.5499 23.3346 21.5834 23.3346H16.9167C15.9502 23.3346 15.1667 22.5511 15.1667 21.5846V16.918C15.1667 15.9515 15.9502 15.168 16.9167 15.168Z"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);
