/*
 * institutionHomeIcons — the Figma icons of the institution home (11.2.1a-c), exported as SVG from the frames (node ids in the home data file header) and
 * recoloured with currentColor. Each takes className (size + colour).
 */

/* imgIconLock · colours #575755 */
export const IhLock = ({ className }) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4.16667 9.16667H15.8333C16.7538 9.16667 17.5 9.91286 17.5 10.8333V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6667V10.8333C2.5 9.91286 3.24619 9.16667 4.16667 9.16667Z"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
    <path
      d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 10 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
    />
  </svg>
);

/* rowdots · colours #9A988F */
export const IhRowDots = ({ className }) => (
  <svg aria-hidden="true" viewBox="0 0 16 4" fill="none" className={className}>
    <path
      d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4V4M8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4V4M14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4V4"
      fill="currentColor"
    />
  </svg>
);
