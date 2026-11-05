/*
 * RecruiterSidebarIcons — the three glyphs the "Job prospecting V2.0" recruiter rail introduced.
 * Exported from Figma (file OHG2xsfCCskT8xEn356njv) as SVG and converted to `currentColor` so the
 * rail can tint them (grey at rest, #EBF1EC on the green active pill, green on the public-profile card).
 *
 *   SidebarProfileNotebookPenIcon   Figma `notebook-pen`   — secondary-nav "Profile" item (20x20)
 *   SidebarPublicLinkChainIcon      Figma `akar-icons:link-chain` — "Your public profile" header (14x14)
 *   SidebarPreviewArrowRightIcon    Figma `20-arrow-right`  — "Preview as talent" button (20x20)
 */
export const SidebarProfileNotebookPenIcon = ({ className, ...rest }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    <path
      d="M8.3269 8.61068H11.2436M8.3269 5.27734H14.1602"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.99341 4.44434H2.49341M4.99341 9.44434H2.49341M4.99341 14.4443H2.49341"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.49341 17.727C6.17573 17.6416 5.33107 17.413 4.71972 16.8017C3.74341 15.8254 3.74341 14.254 3.74341 11.1113V7.77799C3.74341 4.6353 3.74341 3.06395 4.71972 2.08764C5.69603 1.11133 7.26738 1.11133 10.4101 1.11133H10.8267C13.9694 1.11133 15.5408 1.11133 16.5171 2.08764C17.4934 3.06395 17.4934 4.6353 17.4934 7.77799V8.19466"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5468 11.4774L17.126 12.0544C17.6161 12.5425 17.6161 13.334 17.126 13.8221L14.0912 16.9017C13.8524 17.1395 13.547 17.2998 13.2152 17.3616L11.3343 17.7682C11.0373 17.8324 10.7729 17.5698 10.8364 17.2738L11.2369 15.4111C11.2988 15.0806 11.4598 14.7764 11.6985 14.5386L14.7719 11.4774C15.262 10.9893 16.0567 10.9893 16.5468 11.4774Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarPublicLinkChainIcon = ({ className, ...rest }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    <path
      d="M7.9006 6.09993C7.42263 5.6226 6.77476 5.35449 6.09926 5.35449C5.42377 5.35449 4.77589 5.6226 4.29793 6.09993L2.49601 7.90126C2.01819 8.37908 1.74976 9.02714 1.74976 9.70288C1.74976 10.3786 2.01819 11.0267 2.49601 11.5045C2.97383 11.9823 3.6219 12.2508 4.29764 12.2508C4.97338 12.2508 5.62144 11.9823 6.09926 11.5045L6.99993 10.6038"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.09937 7.90084C6.57733 8.37817 7.2252 8.64628 7.9007 8.64628C8.57619 8.64628 9.22407 8.37817 9.70203 7.90084L11.5039 6.09951C11.9818 5.62169 12.2502 4.97362 12.2502 4.29788C12.2502 3.62214 11.9818 2.97408 11.5039 2.49626C11.0261 2.01844 10.3781 1.75 9.70232 1.75C9.02658 1.75 8.37852 2.01844 7.9007 2.49626L7.00003 3.39692"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidebarPreviewArrowRightIcon = ({ className, ...rest }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    <path
      d="M11.736 5.20385C12.0376 4.91996 12.5123 4.93435 12.7962 5.23598L16.7962 9.48598C17.068 9.77477 17.068 10.2252 16.7962 10.514L12.7962 14.764C12.5123 15.0657 12.0376 15.08 11.736 14.7962C11.4343 14.5123 11.42 14.0376 11.7038 13.736L14.5142 10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H14.5142L11.7038 6.26403C11.42 5.9624 11.4343 5.48774 11.736 5.20385Z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);
