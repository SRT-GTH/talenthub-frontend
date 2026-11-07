/*
 * Glyphs of the recruiter Settings · Account / Organisation / Team screens. Each is Figma's own export (node `Icon/user-plus` 10161:78807, saved as src/assets/recruiter/settings/team-invite-user-plus.svg)
 * with the stroke switched to `currentColor` so the caller colours it. The other glyphs (trash, "…", clock, eye, badge-check, check) come from `recruiterJobs/jobIcons.jsx`.
 */
export const UserPlusIcon = ({ size = 22, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M14.6673 19.25V17.4167C14.6673 16.4442 14.281 15.5116 13.5934 14.8239C12.9057 14.1363 11.9731 13.75 11.0007 13.75H5.50065C4.52819 13.75 3.59556 14.1363 2.90793 14.8239C2.22029 15.5116 1.83398 16.4442 1.83398 17.4167V19.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9173 6.41667C11.9173 8.44171 10.2757 10.0833 8.25065 10.0833C6.22561 10.0833 4.58398 8.44171 4.58398 6.41667C4.58398 4.39162 6.22561 2.75 8.25065 2.75C10.2757 2.75 11.9173 4.39162 11.9173 6.41667Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.416 7.33325V12.8333"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.166 10.0833H14.666"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// `Icon/check` 16px (10161:79220, src/assets/recruiter/settings/team-role-menu-check.svg): the tick on the chosen role of the role menu.
export const RoleCheckIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M13.3327 4L5.99935 11.3333L2.66602 8"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
