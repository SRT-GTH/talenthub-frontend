/*
 * actionIcons.jsx — glyphs of the pipeline action dialogs (candidate drawer, offer, interview feedback).
 * Paths are Figma's own exports (file OHG2xsfCCskT8xEn356njv, page "Recruiter - Application Pipeline", frames PL-03 / PL-10 / PL-14: Icon/message, Icon/user, Icon/external, Icon/file, Icon/feedback, Icon/star, Icon/x),
 * with colours swapped for currentColor so the caller sets the tone. Glyphs that already exist elsewhere (badge-check, x-circle, pipeline, arrow-right, calendar, check-circle) come from `recruiterJobs/jobIcons.jsx`.
 */
const stroke = {
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const MessageBubbleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M10.5 7.5C10.5 7.76522 10.3946 8.01957 10.2071 8.20711C10.0196 8.39464 9.76522 8.5 9.5 8.5H3.5L1.5 10.5V2.5C1.5 2.23478 1.60536 1.98043 1.79289 1.79289C1.98043 1.60536 2.23478 1.5 2.5 1.5H9.5C9.76522 1.5 10.0196 1.60536 10.2071 1.79289C10.3946 1.98043 10.5 2.23478 10.5 2.5V7.5Z"
      strokeWidth="1.75"
      {...stroke}
    />
  </svg>
);

export const UserOutlineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path
      d="M11.3327 5.33333C11.3327 7.17428 9.8403 8.66667 7.99935 8.66667C6.1584 8.66667 4.66602 7.17428 4.66602 5.33333C4.66602 3.49238 6.1584 2 7.99935 2C9.8403 2 11.3327 3.49238 11.3327 5.33333Z"
      strokeWidth="1.4"
      {...stroke}
    />
    <path
      d="M13.3327 14C13.3327 12.5855 12.7708 11.229 11.7706 10.2288C10.7704 9.22857 9.41384 8.66667 7.99935 8.66667C6.58486 8.66667 5.22831 9.22857 4.22811 10.2288C3.22792 11.229 2.66602 12.5855 2.66602 14"
      strokeWidth="1.4"
      {...stroke}
    />
  </svg>
);

export const ExternalLinkOutlineIcon = ({ className = '' }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
    <path d="M10 2H14V6" strokeWidth="1.4" {...stroke} />
    <path d="M6.66602 9.33333L13.9993 2" strokeWidth="1.4" {...stroke} />
    <path
      d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H5.33333"
      strokeWidth="1.4"
      {...stroke}
    />
  </svg>
);

export const OfferLetterFileIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M12.4999 1.66667H4.99992C4.55789 1.66667 4.13397 1.84226 3.82141 2.15482C3.50885 2.46738 3.33325 2.89131 3.33325 3.33333V16.6667C3.33325 17.1087 3.50885 17.5326 3.82141 17.8452C4.13397 18.1577 4.55789 18.3333 4.99992 18.3333H14.9999C15.4419 18.3333 15.8659 18.1577 16.1784 17.8452C16.491 17.5326 16.6666 17.1087 16.6666 16.6667V5.83333L12.4999 1.66667Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path
      d="M11.6667 1.66667V5C11.6667 5.44203 11.8423 5.86595 12.1549 6.17851C12.4675 6.49107 12.8914 6.66667 13.3334 6.66667H16.6667"
      strokeWidth="1.75"
      {...stroke}
    />
  </svg>
);

export const FeedbackBubbleIcon = ({ className = '' }) => (
  <svg viewBox="0 0 22 22" fill="none" aria-hidden="true" className={className}>
    <path
      d="M19.25 13.75C19.25 14.2362 19.0568 14.7025 18.713 15.0464C18.3692 15.3902 17.9029 15.5833 17.4167 15.5833H6.41667L2.75 19.25V4.58333C2.75 4.0971 2.94315 3.63079 3.28697 3.28697C3.63079 2.94315 4.0971 2.75 4.58333 2.75H17.4167C17.9029 2.75 18.3692 2.94315 18.713 3.28697C19.0568 3.63079 19.25 4.0971 19.25 4.58333V13.75Z"
      strokeWidth="1.75"
      {...stroke}
    />
    <path d="M7.3335 8.25H14.6668" strokeWidth="1.75" {...stroke} />
    <path d="M7.3335 11.9167H12.8335" strokeWidth="1.75" {...stroke} />
  </svg>
);

/* Outline star, 18px; `filled` paints the same path solid (the drawn rating shows the first four stars gold). */
export const RatingOutlineStarIcon = ({ className = '', filled = false }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path
      d="M9 1.5L11.3175 6.195L16.5 6.9525L12.75 10.605L13.635 15.765L9 13.3275L4.365 15.765L5.25 10.605L1.5 6.9525L6.6825 6.195L9 1.5Z"
      strokeWidth="1.75"
      fill={filled ? 'currentColor' : 'none'}
      {...stroke}
    />
  </svg>
);

export const CloseCrossIcon = ({ className = '' }) => (
  <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
    <path d="M13.5 4.5L4.5 13.5" strokeWidth="1.75" {...stroke} />
    <path d="M4.5 4.5L13.5 13.5" strokeWidth="1.75" {...stroke} />
  </svg>
);
