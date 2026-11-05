/*
 * recruiterMessagesIcons — icons of the Recruiter / Talent Messages screens, exported from Figma
 * (file OHG2xsfCCskT8xEn356njv, "Job prospecting V2.0"). Every path is the node's own; colours are
 * `currentColor` so the caller sets them (the menu icons are #bfbfbf, the trash icon #c0392b).
 *
 *   InboxRefreshIcon           "ep:refresh"   7249:84831, 20x20 (fill #595959)
 *   MenuViewProfileIcon        "icon/user"    8187:78393, 18x18
 *   MenuMuteNotificationsIcon  "icon/mute"    8187:78400, 18x18
 *   MenuArchiveIcon            "icon/archive" 8187:78407, 18x18
 *   MenuReportFlagIcon         "icon/flag"    8187:78414, 18x18
 *   MenuBlockIcon              "icon/ban"     8187:78421, 17x18
 *   MenuDeleteTrashIcon        "icon/trash"   8187:78429, 18x18 (stroke 1.35)
 */

export const InboxRefreshIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M15.0742 15.5256C14.0016 16.5111 12.6653 17.1629 11.2284 17.4015C9.79154 17.64 8.31628 17.455 6.98278 16.8691C5.64929 16.2831 4.51528 15.3215 3.71922 14.1017C2.92317 12.882 2.49951 11.4568 2.5 10.0002H3.75C3.75015 11.259 4.13037 12.4883 4.84088 13.5274C5.5514 14.5664 6.55909 15.3667 7.73203 15.8235C8.90497 16.2802 10.1885 16.3722 11.4146 16.0873C12.6407 15.8024 13.7521 15.1539 14.6035 14.2268H12.7871C12.6213 14.2268 12.4624 14.161 12.3452 14.0437C12.228 13.9265 12.1621 13.7676 12.1621 13.6018C12.1621 13.436 12.228 13.2771 12.3452 13.1599C12.4624 13.0427 12.6213 12.9768 12.7871 12.9768H15.6973C15.863 12.9768 16.022 13.0427 16.1392 13.1599C16.2564 13.2771 16.3223 13.436 16.3223 13.6018V16.512C16.3223 16.6777 16.2564 16.8367 16.1392 16.9539C16.022 17.0711 15.863 17.137 15.6973 17.137C15.5315 17.137 15.3725 17.0711 15.2553 16.9539C15.1381 16.8367 15.0723 16.6777 15.0723 16.512L15.0742 15.5256ZM5.39648 5.77368H7.21289C7.37865 5.77368 7.53762 5.83953 7.65483 5.95674C7.77204 6.07395 7.83789 6.23292 7.83789 6.39868C7.83789 6.56444 7.77204 6.72341 7.65483 6.84062C7.53762 6.95783 7.37865 7.02368 7.21289 7.02368H4.30078C4.13502 7.02368 3.97605 6.95783 3.85884 6.84062C3.74163 6.72341 3.67578 6.56444 3.67578 6.39868V3.48852C3.67578 3.32276 3.74163 3.16379 3.85884 3.04658C3.97605 2.92937 4.13502 2.86352 4.30078 2.86352C4.46654 2.86352 4.62551 2.92937 4.74272 3.04658C4.85993 3.16379 4.92578 3.32276 4.92578 3.48852V4.4729C5.99823 3.48617 7.33491 2.83327 8.77245 2.59398C10.21 2.3547 11.6861 2.5394 13.0203 3.12552C14.3546 3.71164 15.4892 4.67378 16.2854 5.89433C17.0817 7.11488 17.5051 8.54097 17.5039 9.99829H16.2539C16.2542 8.73912 15.8741 7.50923 15.1635 6.46974C14.4529 5.43024 13.4449 4.62963 12.2715 4.17278C11.0982 3.71593 9.81415 3.62415 8.58773 3.90946C7.36132 4.19478 6.24967 4.84387 5.39844 5.77172L5.39648 5.77368Z"
      fill="currentColor"
    />
  </svg>
);

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
};

export const MenuViewProfileIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" {...strokeProps} className={className}>
    <path d="M12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3C10.6569 3 12 4.34315 12 6Z" />
    <path d="M3 15.75C3 14.1587 3.63214 12.6326 4.75736 11.5074C5.88258 10.3821 7.4087 9.75 9 9.75C10.5913 9.75 12.1174 10.3821 13.2426 11.5074C14.3679 12.6326 15 14.1587 15 15.75" />
  </svg>
);

export const MenuMuteNotificationsIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" {...strokeProps} className={className}>
    <path d="M10.275 15.75C10.1405 15.9671 9.95276 16.1462 9.72964 16.2704C9.50651 16.3946 9.25537 16.4598 9 16.4598C8.74463 16.4598 8.49349 16.3946 8.27036 16.2704C8.04724 16.1462 7.85953 15.9671 7.725 15.75M13.95 9.75C13.624 8.52745 13.4725 7.26496 13.5 6C13.4985 5.18835 13.2775 4.39222 12.8605 3.69592C12.4434 2.99963 11.8458 2.42909 11.1309 2.04475C10.416 1.66041 9.61052 1.47656 8.79967 1.5127C7.98883 1.54883 7.20286 1.80359 6.525 2.25M4.725 4.725C4.58893 5.13693 4.51315 5.56638 4.5 6C4.5 11.25 2.25 12.75 2.25 12.75H12.75M4.725 4.725L1.5 1.5M4.725 4.725L12.75 12.75M12.75 12.75L16.5 16.5" />
  </svg>
);

export const MenuArchiveIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" {...strokeProps} className={className}>
    <path d="M2.25 2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V5.25C16.5 5.66421 16.1642 6 15.75 6H2.25C1.83579 6 1.5 5.66421 1.5 5.25V3C1.5 2.58579 1.83579 2.25 2.25 2.25Z" />
    <path d="M3 6V14.25C3 14.6478 3.15804 15.0294 3.43934 15.3107C3.72064 15.592 4.10218 15.75 4.5 15.75H13.5C13.8978 15.75 14.2794 15.592 14.5607 15.3107C14.842 15.0294 15 14.6478 15 14.25V6M7.5 9H10.5" />
  </svg>
);

export const MenuReportFlagIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" {...strokeProps} className={className}>
    <path d="M0.501953 16.5117V11.2617M0.501953 11.2617V3.01172C0.501953 3.01172 1.25195 2.26172 3.50195 2.26172C5.75195 2.26172 7.25195 3.76172 9.50195 3.76172C11.752 3.76172 12.502 3.01172 12.502 3.01172V11.2617C12.502 11.2617 11.752 12.0117 9.50195 12.0117C7.25195 12.0117 5.75195 10.5117 3.50195 10.5117C1.25195 10.5117 0.501953 11.2617 0.501953 11.2617Z" />
  </svg>
);

export const MenuBlockIcon = ({ className = '' }) => (
  <svg viewBox="0 0 17 18" {...strokeProps} className={className}>
    <path d="M15.5 9.30078C15.5 13.4429 12.1421 16.8008 8 16.8008C3.85786 16.8008 0.5 13.4429 0.5 9.30078C0.5 5.15865 3.85786 1.80078 8 1.80078C12.1421 1.80078 15.5 5.15865 15.5 9.30078Z" />
    <path d="M2.6748 3.97461L13.3248 14.6246" />
  </svg>
);

export const MenuDeleteTrashIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" {...strokeProps} strokeWidth="1.35" className={className}>
    <path d="M0 4.5H1.5M1.5 4.5H3.75M1.5 4.5L2.25 15H11.25L12 4.5M3.75 4.5H9.75M3.75 4.5V3H9.75V4.5M9.75 4.5H12M12 4.5H13.5" />
  </svg>
);

export const SendMessageIcon = ({ className = '' }) => (
  // Figma 7249:84150 — 13x12. Path and its #FEF1E7 -> #E8F2ED gradient are the
  // node's own, supplied verbatim; the gradient is why this is not a flat fill.
  <svg viewBox="0 0 13 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M0.969725 0.0653414C0.448101 -0.174616 -0.124982 0.284433 0.023976 0.822251L1.11598 4.75182C1.14334 4.85058 1.20023 4.93942 1.27959 5.0073C1.35894 5.07519 1.45725 5.11913 1.56231 5.13366L6.91614 5.87023C7.07106 5.89109 7.07106 6.10706 6.91614 6.12844L1.56285 6.86449C1.45779 6.87902 1.35948 6.92296 1.28013 6.99085C1.20078 7.05873 1.14388 7.14757 1.11652 7.24633L0.023976 11.178C-0.124982 11.7153 0.448101 12.1743 0.969725 11.9349L12.6145 6.58854C13.1285 6.35275 13.1285 5.64749 12.6145 5.41118L0.969725 0.0653414Z"
      fill="url(#gthSendGradient)"
    />
    <defs>
      <linearGradient
        id="gthSendGradient"
        x1="13"
        y1="0"
        x2="3.37754"
        y2="14.2765"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FEF1E7" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
  </svg>
);

// Figma 7249:84133 "ep:opportunity" — the proposal card's watermark. 72.5x72.5
// at NODE opacity 0.59, overhanging the card's top-right corner (left 253.8,
// top -14.8 of a 299x151 card) so the card's overflow clips it. Path, its
// #142916 -> #2A5730 gradient and the 0.59 are the node's own.
export const ProposalWatermarkIcon = ({ className = '', opacity = 0.59 }) => (
  <svg viewBox="0 0 46 58" fill="none" aria-hidden="true" className={className}>
    <g opacity={opacity} clipPath="url(#gthProposalClip)">
      <path
        d="M23.4244 46.3567L24.1778 42.5782L35.5132 44.8382L34.7599 48.6167L23.4244 46.3567ZM56.2773 19.5129C55.6671 22.5778 54.3847 25.4692 52.5224 27.9788C50.6602 30.4883 48.2645 32.5536 45.5079 34.0258C42.8689 35.4395 40.8478 37.7866 40.2628 40.7209L40.0451 41.8131L21.1526 38.0464L21.3209 37.2021C21.8859 34.3683 21.2985 31.3415 19.4152 29.149C16.8716 26.1874 15.1956 22.5807 14.572 18.7269C13.9484 14.873 14.4016 10.9219 15.8815 7.30926C17.4432 3.48272 20.0927 0.198158 23.5022 -2.13783C26.9117 -4.47382 30.9314 -5.75867 35.0637 -5.83333C38.2339 -5.89397 41.3774 -5.24319 44.263 -3.92886C47.1486 -2.61454 49.7029 -0.670087 51.738 1.76148C53.7731 4.19304 55.2373 7.04987 56.0228 10.1219C56.8084 13.1938 56.8953 16.4028 56.2773 19.5129ZM23.7834 14.9987C25.3407 7.18787 30.9011 2.66741 37.7555 4.03401L38.5089 0.255511C29.3933 -1.56191 21.9494 4.49215 20.0049 14.2454L23.7834 14.9987Z"
        fill="url(#gthProposalGradient)"
      />
    </g>
    <defs>
      <linearGradient
        id="gthProposalGradient"
        x1="18.8494"
        y1="-9.56836"
        x2="62.2039"
        y2="41.0745"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#142916" />
        <stop offset="1" stopColor="#2A5730" />
      </linearGradient>
      <clipPath id="gthProposalClip">
        <rect
          width="61.6458"
          height="61.6458"
          fill="white"
          transform="translate(12.0535 -14.8398) rotate(11.2755)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const BackToListArrowIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M15 5l-7 7 7 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
