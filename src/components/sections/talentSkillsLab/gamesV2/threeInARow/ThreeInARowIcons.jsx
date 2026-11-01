/*
 * Three in a Row icons — exported from Figma (SVG), recoloured with currentColor.
 *   check-circle (chip) 9619:63182 · game-feedback check 9619:64138 / icon · checkc · game-feedback info 9619:64876 / icon · info
 */
const base = { fill: 'none', 'aria-hidden': true, focusable: 'false' };
const stroke = {
  strokeWidth: 1.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: 'currentColor',
};

export const ThreeInARowCheckCircleIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 14 14" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.00001 1.74922C4.10052 1.74922 1.75001 4.09972 1.75001 6.99922C1.75001 9.89871 4.10052 12.2492 7.00001 12.2492C9.89951 12.2492 12.25 9.89871 12.25 6.99922C12.25 4.09972 9.89951 1.74922 7.00001 1.74922ZM0.700012 6.99922C0.700012 3.51982 3.52062 0.699219 7.00001 0.699219C10.4794 0.699219 13.3 3.51982 13.3 6.99922C13.3 10.4786 10.4794 13.2992 7.00001 13.2992C3.52062 13.2992 0.700012 10.4786 0.700012 6.99922ZM9.59602 4.65879C9.82546 4.83608 9.86773 5.1658 9.69044 5.39523L6.71544 9.24523C6.62024 9.36843 6.47526 9.44302 6.31968 9.44885C6.16409 9.45468 6.01394 9.39115 5.90978 9.27542L4.33478 7.52542C4.14082 7.30991 4.15829 6.97795 4.37381 6.78399C4.58932 6.59002 4.92128 6.60749 5.11524 6.82301L6.26932 8.10532L8.85959 4.75321C9.03688 4.52378 9.36659 4.48151 9.59602 4.65879Z"
      fill="currentColor"
    />
  </svg>
);

export const ThreeInARowFeedbackCheckIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 16 16" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      {...stroke}
    />
    <path d="M5.3335 8.1987L7.20016 10.0654L11.0002 6.33203" {...stroke} />
  </svg>
);

export const ThreeInARowFeedbackInfoIcon = ({ className = '' }) => (
  <svg {...base} viewBox="0 0 16 16" className={className}>
    <path
      d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
      fill="currentColor"
      fillOpacity="0.22"
    />
    <path
      d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
      {...stroke}
    />
    <path d="M8 7.33255V10.9992M8 5.19922V5.33255" {...stroke} />
  </svg>
);
