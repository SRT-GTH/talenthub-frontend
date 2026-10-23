/*
 * Small icons of the live-captions frames, exported from Figma (export.py svg) and recoloured with
 * currentColor so one component serves every state:
 *   gth-icon/info 9149:83483, gth-icon/play 9149:84380, gth-icon/check 9149:84831,
 *   gth-icon/edit 9149:84838, gth-icon/mic 9149:84367 (all 14x14).
 */
const base = { viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': 'true' };
const stroke = {
  strokeWidth: '1.05',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: 'currentColor',
};

export const CaptionInfoIcon = ({ className = '' }) => (
  <svg {...base} className={className}>
    <path
      d="M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M12.25 7C12.25 9.8995 9.8995 12.25 7 12.25C4.1005 12.25 1.75 9.8995 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.8995 1.75 12.25 4.1005 12.25 7Z"
      {...stroke}
    />
    <path d="M7 6.41745V9.62578M7 4.55078V4.66745" {...stroke} />
  </svg>
);

export const CaptionPlayIcon = ({ className = '' }) => (
  <svg {...base} className={className}>
    <path
      d="M5.83203 4.95703V9.04036L9.04036 6.9987L5.83203 4.95703Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M12.25 7C12.25 9.8995 9.8995 12.25 7 12.25C4.1005 12.25 1.75 9.8995 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.8995 1.75 12.25 4.1005 12.25 7Z"
      {...stroke}
    />
    <path d="M5.83203 4.95703V9.04036L9.04036 6.9987L5.83203 4.95703Z" {...stroke} />
  </svg>
);

export const CaptionCheckIcon = ({ className = '' }) => (
  <svg {...base} className={className}>
    <path d="M2.91797 7.29036L5.36797 9.74037L11.0846 4.08203" {...stroke} />
  </svg>
);

export const CaptionEditIcon = ({ className = '' }) => (
  <svg {...base} className={className}>
    <path
      d="M2.33203 11.6668H4.66536L11.082 5.25018C11.3914 4.94076 11.5653 4.52109 11.5653 4.08351C11.5653 3.64592 11.3914 3.22626 11.082 2.91684C10.7726 2.60742 10.3529 2.43359 9.91536 2.43359C9.47778 2.43359 9.05812 2.60742 8.7487 2.91684L2.33203 9.33351V11.6668Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M7.8737 3.79184L8.7487 2.91684C9.05812 2.60742 9.47778 2.43359 9.91536 2.43359C10.3529 2.43359 10.7726 2.60742 11.082 2.91684C11.3914 3.22626 11.5653 3.64592 11.5653 4.08351C11.5653 4.52109 11.3914 4.94076 11.082 5.25018L10.207 6.12518L4.66536 11.6668H2.33203V9.33351L7.8737 3.79184ZM10.207 6.12518L7.8737 3.79184"
      {...stroke}
    />
  </svg>
);

export const CaptionMicIcon = ({ className = '' }) => (
  <svg {...base} className={className}>
    <path
      d="M8.75 3.5C8.75 2.5335 7.9665 1.75 7 1.75C6.0335 1.75 5.25 2.5335 5.25 3.5V6.41667C5.25 7.38317 6.0335 8.16667 7 8.16667C7.9665 8.16667 8.75 7.38317 8.75 6.41667V3.5Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M7 1.75C7.9665 1.75 8.75 2.5335 8.75 3.5V6.41667C8.75 7.38317 7.9665 8.16667 7 8.16667C6.0335 8.16667 5.25 7.38317 5.25 6.41667V3.5C5.25 2.5335 6.0335 1.75 7 1.75Z"
      {...stroke}
    />
    <path
      d="M3.20703 6.41797C3.20703 7.42358 3.60651 8.38801 4.31758 9.09908C5.02866 9.81016 5.99309 10.2096 6.9987 10.2096M6.9987 10.2096C8.00431 10.2096 8.96874 9.81016 9.67981 9.09908C10.3909 8.38801 10.7904 7.42358 10.7904 6.41797M6.9987 10.2096V12.2513"
      {...stroke}
    />
  </svg>
);
