/*
 * Help me reply (package C) icons — exported from Figma (Talent Messages H-01…H-04, node ids in each comment) and
 * recoloured through `currentColor` so the parent sets the Figma colour with a text-* class.
 */

// 7463:4834 — gold sparkle beside the "Help me reply" title (14×14, Figma #c8951a)
export const HelpSparkleIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M7 0C7.58333 4.08333 9.91667 6.41667 14 7C9.91667 7.58333 7.58333 9.91667 7 14C6.41667 9.91667 4.08333 7.58333 0 7C4.08333 6.41667 6.41667 4.08333 7 0Z"
      fill="currentColor"
    />
  </svg>
);

// 7463:5969 / 7463:6519 — small green sparkle on the draft meta line and the "Drafted with Buddy" note (12×12, #387440)
export const HelpDraftSparkleIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 0C6.5 3.5 8.5 5.5 12 6C8.5 6.5 6.5 8.5 6 12C5.5 8.5 3.5 6.5 0 6C3.5 5.5 5.5 3.5 6 0Z"
      fill="currentColor"
    />
  </svg>
);

// 7463:4837 — padlock before "Career Buddy · only reads this chat · you send, not Buddy" (12×12, #737373)
export const HelpLockIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3 5.5H9C9.55228 5.5 10 5.94772 10 6.5V9.5C10 10.0523 9.55228 10.5 9 10.5H3C2.44772 10.5 2 10.0523 2 9.5V6.5C2 5.94772 2.44772 5.5 3 5.5Z"
      stroke="currentColor"
      strokeWidth="1.16667"
    />
    <path
      d="M4 5.5V3.5C4 2.96957 4.21071 2.46086 4.58579 2.08579C4.96086 1.71071 5.46957 1.5 6 1.5C6.53043 1.5 7.03914 1.71071 7.41421 2.08579C7.78929 2.46086 8 2.96957 8 3.5V5.5"
      stroke="currentColor"
      strokeWidth="1.16667"
    />
  </svg>
);

// 7463:4842 — close X inside the 32px round close button (14×14, #595959)
export const HelpCloseIcon = ({ className = '' }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M10.5 3.5L7 7M7 7L3.5 10.5M7 7L3.5 3.5M7 7L10.5 10.5"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
    />
  </svg>
);
