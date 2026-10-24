/*
 * Theme 8 public dashboards: UI-primitive icons exported from Figma (filter I8488:828;8486:1698 24px as in the empty state, filter-bar I8487:345987 18px as in the filter bar (clipped at 18 like the frame), warning I8488:601;8486:1529, close I8515:502, trend-up I8494:1968), currentColor. Own icon file: never edit shared assets.jsx.
 */

export const PublicIconFilter = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M1 4.75C1 4.33579 1.33579 4 1.75 4H18.25C18.6642 4 19 4.33579 19 4.75C19 5.16421 18.6642 5.5 18.25 5.5H1.75C1.33579 5.5 1 5.16421 1 4.75ZM4 10C4 9.58579 4.33579 9.25 4.75 9.25H15.25C15.6642 9.25 16 9.58579 16 10C16 10.4142 15.6642 10.75 15.25 10.75H4.75C4.33579 10.75 4 10.4142 4 10ZM7 15.25C7 14.8358 7.33579 14.5 7.75 14.5H12.25C12.6642 14.5 13 14.8358 13 15.25C13 15.6642 12.6642 16 12.25 16H7.75C7.33579 16 7 15.6642 7 15.25Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const PublicIconFilterBar = ({ className }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className={className}>
    <g clipPath="url(#clip0_0_16)">
      <path
        d="M1 4.75C1 4.33579 1.33579 4 1.75 4H18.25C18.6642 4 19 4.33579 19 4.75C19 5.16421 18.6642 5.5 18.25 5.5H1.75C1.33579 5.5 1 5.16421 1 4.75ZM4 10C4 9.58579 4.33579 9.25 4.75 9.25H15.25C15.6642 9.25 16 9.58579 16 10C16 10.4142 15.6642 10.75 15.25 10.75H4.75C4.33579 10.75 4 10.4142 4 10ZM7 15.25C7 14.8358 7.33579 14.5 7.75 14.5H12.25C12.6642 14.5 13 14.8358 13 15.25C13 15.6642 12.6642 16 12.25 16H7.75C7.33579 16 7 15.6642 7 15.25Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_0_16">
        <rect width="18" height="18" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);

export const PublicIconWarning = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M11.1621 4.14695C10.6544 3.28435 9.3469 3.28435 8.83915 4.14695L2.6724 14.6236C2.19959 15.4269 2.77389 16.5 3.83388 16.5H16.1674C17.2274 16.5 17.8017 15.4269 17.3289 14.6236L11.1621 4.14695ZM7.54647 3.38605C8.63428 1.53798 11.367 1.53799 12.4548 3.38605L18.6215 13.8627C19.7275 15.7416 18.2988 18 16.1674 18H3.83388C1.70249 18 0.273774 15.7416 1.37972 13.8627L7.54647 3.38605ZM10.0006 6C10.4148 6 10.7506 6.33579 10.7506 6.75L10.7506 10.25C10.7506 10.6642 10.4148 11 10.0006 11C9.58642 11 9.25063 10.6642 9.25063 10.25L9.25063 6.75C9.25063 6.33579 9.58642 6 10.0006 6ZM10.0006 12C10.4148 12 10.7506 12.3358 10.7506 12.75V14.25C10.7506 14.6642 10.4148 15 10.0006 15C9.58642 15 9.25063 14.6642 9.25063 14.25V12.75C9.25063 12.3358 9.58642 12 10.0006 12Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const PublicIconClose = ({ className }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M5.74164 5.74164C6.06382 5.41945 6.58618 5.41945 6.90836 5.74164L11 9.83327L15.0916 5.74164C15.4138 5.41945 15.9362 5.41945 16.2584 5.74164C16.5805 6.06382 16.5805 6.58618 16.2584 6.90836L12.1667 11L16.2584 15.0916C16.5805 15.4138 16.5805 15.9362 16.2584 16.2584C15.9362 16.5805 15.4138 16.5805 15.0916 16.2584L11 12.1667L6.90836 16.2584C6.58618 16.5805 6.06382 16.5805 5.74164 16.2584C5.41945 15.9362 5.41945 15.4138 5.74164 15.0916L9.83327 11L5.74164 6.90836C5.41945 6.58618 5.41945 6.06382 5.74164 5.74164Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const PublicIconTrendUp = ({ className }) => (
  <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path
      d="M16.7999 6.64961C16.7999 6.06971 17.27 5.59961 17.8499 5.59961H25.5499C26.1298 5.59961 26.5999 6.06971 26.5999 6.64961V14.3496C26.5999 14.9295 26.1298 15.3996 25.5499 15.3996C24.97 15.3996 24.4999 14.9295 24.4999 14.3496V9.18453L15.7924 17.8921C15.4229 18.2616 14.838 18.3031 14.4199 17.9896L9.61796 14.3881L3.25656 22.0218C2.88532 22.4673 2.22323 22.5275 1.77774 22.1562C1.33224 21.785 1.27205 21.1229 1.6433 20.6774L8.6433 12.2774C9.00116 11.848 9.63273 11.7742 10.0799 12.1096L14.9514 15.7632L23.015 7.69961H17.8499C17.27 7.69961 16.7999 7.22951 16.7999 6.64961Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);
