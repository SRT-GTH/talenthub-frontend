/*
 * talentSearchMenuIcons.jsx — glyphs of the talent-search menus and states (Figma frames TS-01 … TS-10, file OHG2xsfCCskT8xEn356njv, page 10102).
 * Each is the Figma REST svg export of the "Icon/…" instance (6065:*) with the baked stroke / fill colour replaced by `currentColor`. Sizes follow the instance.
 *
 *   SparklesIcon 18      10102:36684   assistant / suggestion rows        PlusIcon 18        10102:37484   suggested-skill rows
 *   CheckIcon 16         10102:38255   selected row                       MapPinIcon 18      10102:39016   location rows
 *   GlobeIcon 18         10102:39034   "Include remote talent"            ActivityIcon 18    10102:39040   "Within 50 km"
 *   BriefcaseIcon 18     10102:36696   role rows and the role cards       ClockIcon 18       10102:36703   recent searches
 *   SearchSmallIcon 16   10102:41316   popular-search pills               CloseIcon 14       10102:40558   More filters close button
 *   SearchLargeIcon 32   10102:40978   no-results tile                    SearchFieldIcon 16 10102:37460   green magnifier in the skills / location fields
 *   ArrowheadDownIcon 20 the sort trigger chevron. The "20-arrowhead-down" instance (10102:35262;2040:8546) exports as NO IMAGE, so the path is the one drawn
 *                        inside the exported trigger 10102:35262, translated by that icon's (184, 12) offset inside the trigger.
 */
const stroke = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const SparklesIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 2.25L10.425 6.6L15 8.25L10.425 9.9L9 14.25L7.575 9.9L3 8.25L7.575 6.6L9 2.25Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path d="M14.25 2.25V5.25M15.75 3.75H12.75" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const PlusIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M3.75 9H14.25M9 3.75V14.25" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const CheckIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M13.3337 4L6.00033 11.3333L2.66699 8" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const MapPinIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path
      d="M11.25 7.5C11.25 8.74264 10.2426 9.75 9 9.75C7.75736 9.75 6.75 8.74264 6.75 7.5C6.75 6.25736 7.75736 5.25 9 5.25C10.2426 5.25 11.25 6.25736 11.25 7.5Z"
      strokeWidth="1.75"
      {...stroke}
    />
  </svg>
);

export const GlobeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path
      d="M9 1.5C7.07418 3.52212 6 6.20756 6 9C6 11.7924 7.07418 14.4779 9 16.5C10.9258 14.4779 12 11.7924 12 9C12 6.20756 10.9258 3.52212 9 1.5Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path d="M1.5 9H16.5" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const ActivityIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M16.5 9H13.5L11.25 15.75L6.75 2.25L4.5 9H1.5" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const BriefcaseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M3 5.25H15C15.8284 5.25 16.5 5.92157 16.5 6.75V14.25C16.5 15.0784 15.8284 15.75 15 15.75H3C2.17157 15.75 1.5 15.0784 1.5 14.25V6.75C1.5 5.92157 2.17157 5.25 3 5.25Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path
      d="M12 15.75V3.75C12 3.35218 11.842 2.97064 11.5607 2.68934C11.2794 2.40804 10.8978 2.25 10.5 2.25H7.5C7.10218 2.25 6.72064 2.40804 6.43934 2.68934C6.15804 2.97064 6 3.35218 6 3.75V15.75"
      strokeWidth="1.75"
      {...stroke}
    />
  </svg>
);

export const ClockIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M16.5 9C16.5 13.1421 13.1421 16.5 9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path d="M9 4.5V9L12 10.5" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const SearchSmallIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path d="M14 14L11.1334 11.1333" strokeWidth="1.75" {...stroke} />
  </svg>
);

export const CloseIcon = ({ className = '' }) => (
  <svg viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
    <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" strokeWidth="1.5" {...stroke} />
  </svg>
);

export const SearchLargeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path
      d="M25.3333 14.6667C25.3333 20.5577 20.5577 25.3333 14.6667 25.3333C8.77563 25.3333 4 20.5577 4 14.6667C4 8.77563 8.77563 4 14.6667 4C20.5577 4 25.3333 8.77563 25.3333 14.6667Z"
      strokeWidth="2.5"
      {...stroke}
    />
    <path d="M28.0001 28L22.2667 22.2667" strokeWidth="2.5" {...stroke} />
  </svg>
);

export const SearchFieldIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M7.33333 11.3333C7.85862 11.3333 8.37877 11.2299 8.86407 11.0289C9.34937 10.8278 9.79033 10.5332 10.1618 10.1618C10.5332 9.79033 10.8278 9.34937 11.0289 8.86407C11.2299 8.37877 11.3333 7.85862 11.3333 7.33333C11.3333 6.80805 11.2299 6.2879 11.0289 5.8026C10.8278 5.3173 10.5332 4.87634 10.1618 4.50491C9.79033 4.13347 9.34937 3.83883 8.86407 3.63782C8.37877 3.4368 7.85862 3.33333 7.33333 3.33333C6.27247 3.33333 5.25505 3.75476 4.50491 4.50491C3.75476 5.25505 3.33333 6.27247 3.33333 7.33333C3.33333 8.3942 3.75476 9.41161 4.50491 10.1618C5.25505 10.9119 6.27247 11.3333 7.33333 11.3333ZM7.33333 12.6667C8.74782 12.6667 10.1044 12.1048 11.1046 11.1046C12.1048 10.1044 12.6667 8.74782 12.6667 7.33333C12.6667 5.91885 12.1048 4.56229 11.1046 3.5621C10.1044 2.5619 8.74782 2 7.33333 2C5.91885 2 4.56229 2.5619 3.5621 3.5621C2.5619 4.56229 2 5.91885 2 7.33333C2 8.74782 2.5619 10.1044 3.5621 11.1046C4.56229 12.1048 5.91885 12.6667 7.33333 12.6667Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
    <path
      d="M10.2131 10.1933C10.3386 10.0688 10.5084 9.9992 10.6852 9.99982C10.8619 10.0004 11.0312 10.0713 11.1558 10.1967L13.8058 12.8633C13.9269 12.9894 13.9937 13.158 13.9917 13.3328C13.9897 13.5077 13.9191 13.6747 13.7951 13.798C13.6712 13.9213 13.5037 13.9909 13.3289 13.9919C13.1541 13.9929 12.9858 13.9252 12.8605 13.8033L10.2105 11.1367C10.0858 11.0113 10.0161 10.8416 10.0166 10.6648C10.0171 10.488 10.0878 10.3187 10.2131 10.194V10.1933Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

export const ArrowheadDownIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10 12.9998C9.685 12.9998 9.389 12.8516 9.2 12.5998L6.2 8.5998C5.973 8.2967 5.936 7.8913 6.106 7.5525C6.275 7.2138 6.621 6.9998 7 6.9998H13C13.379 6.9998 13.725 7.2138 13.894 7.5525C14.064 7.8913 14.027 8.2967 13.8 8.5998L10.8 12.5998C10.611 12.8516 10.315 12.9998 10 12.9998Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);
